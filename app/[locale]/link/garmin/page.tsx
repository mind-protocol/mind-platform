'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Link } from '@/i18n/navigation';

type Step = 'loading' | 'invalid' | 'credentials' | 'mfa' | 'success' | 'error';

function GarminLinkForm() {
  const searchParams = useSearchParams();
  const code = searchParams.get('code') || '';

  const [step, setStep] = useState<Step>('loading');
  const [error, setError] = useState('');
  const [chatId, setChatId] = useState('');
  const [username, setUsername] = useState('');

  // Form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mfaCode, setMfaCode] = useState('');
  const [sessionToken, setSessionToken] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [displayName, setDisplayName] = useState('');

  // Verify link code on mount
  useEffect(() => {
    if (!code) {
      setStep('invalid');
      setError('No link code provided. Please request a new link from Telegram.');
      return;
    }

    verifyCode();
  }, [code]);

  async function verifyCode() {
    try {
      const res = await fetch(`/api/garmin/link/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code }),
      });

      if (!res.ok) {
        const data = await res.json();
        setStep('invalid');
        setError(data.error || 'Invalid or expired link. Please request a new one from Telegram.');
        return;
      }

      const data = await res.json();
      setChatId(data.chat_id);
      setUsername(data.username);
      setStep('credentials');
    } catch (e) {
      setStep('error');
      setError('Unable to connect to server. Please try again.');
    }
  }

  async function handleCredentialsSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const res = await fetch(`/api/garmin/link`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: chatId,
          email,
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Authentication failed.');
        setIsSubmitting(false);
        return;
      }

      if (data.status === 'mfa_required') {
        setSessionToken(data.session_token);
        setStep('mfa');
      } else if (data.status === 'linked') {
        setDisplayName(data.display_name || email);
        await notifyComplete(data.display_name || email);
        setStep('success');
      }
    } catch (e) {
      setError('Connection error. Please try again.');
    }

    setIsSubmitting(false);
  }

  async function handleMfaSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const res = await fetch(`/api/garmin/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          session_token: sessionToken,
          mfa_code: mfaCode,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Invalid MFA code.');
        setIsSubmitting(false);
        return;
      }

      if (data.status === 'linked') {
        setDisplayName(data.display_name || email);
        await notifyComplete(data.display_name || email);
        setStep('success');
      }
    } catch (e) {
      setError('Connection error. Please try again.');
    }

    setIsSubmitting(false);
  }

  async function notifyComplete(name: string) {
    try {
      await fetch(`/api/garmin/link/complete`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code,
          garmin_email: email,
          display_name: name,
        }),
      });
    } catch (e) {
      // Notification failure is non-fatal
      console.error('Failed to notify:', e);
    }
  }

  return (
    <main className="min-h-screen bg-zinc-950 text-white flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="text-zinc-500 hover:text-amber-500 text-sm">
            mind protocol
          </Link>
          <h1 className="text-2xl font-bold font-mono mt-4">Connect Garmin</h1>
          <p className="text-zinc-500 text-sm mt-2">
            Link your Garmin account to enable biometric tracking
          </p>
        </div>

        {/* Loading */}
        {step === 'loading' && (
          <div className="text-center py-12">
            <div className="animate-spin w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full mx-auto mb-4" />
            <p className="text-zinc-500">Verifying link...</p>
          </div>
        )}

        {/* Invalid/Expired Code */}
        {step === 'invalid' && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-6 text-center">
            <div className="text-3xl mb-4">❌</div>
            <h2 className="text-lg font-bold text-red-400 mb-2">Link Invalid</h2>
            <p className="text-zinc-400 text-sm">{error}</p>
            <p className="text-zinc-500 text-xs mt-4">
              Send &quot;connect garmin&quot; in Telegram to get a new link.
            </p>
          </div>
        )}

        {/* Credentials Form */}
        {step === 'credentials' && (
          <form onSubmit={handleCredentialsSubmit} className="space-y-6">
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
              <p className="text-zinc-400 text-sm mb-4">
                Enter your Garmin Connect credentials. They&apos;re only used to authenticate and are not stored.
              </p>

              <div className="space-y-4">
                <div>
                  <label className="block text-zinc-500 text-xs mb-1">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoComplete="email"
                    className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-3 text-white focus:border-amber-500 focus:outline-none transition"
                    placeholder="your@email.com"
                  />
                </div>

                <div>
                  <label className="block text-zinc-500 text-xs mb-1">Password</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    autoComplete="current-password"
                    className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-3 text-white focus:border-amber-500 focus:outline-none transition"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              {error && (
                <p className="text-red-400 text-sm mt-4">{error}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-amber-500 text-black font-medium py-3 rounded-lg hover:bg-amber-400 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Connecting...' : 'Connect Garmin'}
            </button>

            <p className="text-zinc-600 text-xs text-center">
              Your credentials are sent directly to Garmin for authentication.
              <br />
              We don&apos;t store your password.
            </p>
          </form>
        )}

        {/* MFA Form */}
        {step === 'mfa' && (
          <form onSubmit={handleMfaSubmit} className="space-y-6">
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
              <div className="text-center mb-4">
                <div className="text-3xl mb-2">🔐</div>
                <h2 className="text-lg font-bold">Two-Factor Authentication</h2>
              </div>

              <p className="text-zinc-400 text-sm mb-4 text-center">
                Enter the verification code from your authenticator app or SMS.
              </p>

              <input
                type="text"
                value={mfaCode}
                onChange={(e) => setMfaCode(e.target.value.replace(/\D/g, ''))}
                required
                maxLength={6}
                autoComplete="one-time-code"
                className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-4 text-white text-center text-2xl font-mono tracking-widest focus:border-amber-500 focus:outline-none transition"
                placeholder="000000"
              />

              {error && (
                <p className="text-red-400 text-sm mt-4 text-center">{error}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting || mfaCode.length < 6}
              className="w-full bg-amber-500 text-black font-medium py-3 rounded-lg hover:bg-amber-400 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Verifying...' : 'Verify'}
            </button>
          </form>
        )}

        {/* Success */}
        {step === 'success' && (
          <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-6 text-center">
            <div className="text-4xl mb-4">✅</div>
            <h2 className="text-xl font-bold text-emerald-400 mb-2">Garmin Connected!</h2>
            <p className="text-zinc-400 mb-4">
              Account: <span className="text-white">{displayName}</span>
            </p>
            <p className="text-zinc-500 text-sm">
              You can close this page and return to Telegram.
              <br />
              Your biometrics will now sync automatically.
            </p>
          </div>
        )}

        {/* Generic Error */}
        {step === 'error' && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-6 text-center">
            <div className="text-3xl mb-4">⚠️</div>
            <h2 className="text-lg font-bold text-red-400 mb-2">Connection Error</h2>
            <p className="text-zinc-400 text-sm">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 text-amber-500 hover:text-amber-400 text-sm"
            >
              Try again
            </button>
          </div>
        )}

        {/* Footer */}
        <p className="text-zinc-700 text-xs text-center mt-8">
          Linking for {username ? `@${username}` : 'Telegram user'}
        </p>
      </div>
    </main>
  );
}

// Loading fallback for Suspense
function LoadingFallback() {
  return (
    <main className="min-h-screen bg-zinc-950 text-white flex items-center justify-center px-4">
      <div className="w-full max-w-md text-center">
        <div className="animate-spin w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full mx-auto mb-4" />
        <p className="text-zinc-500">Loading...</p>
      </div>
    </main>
  );
}

// Export with Suspense boundary (required for useSearchParams)
export default function GarminLinkPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <GarminLinkForm />
    </Suspense>
  );
}
