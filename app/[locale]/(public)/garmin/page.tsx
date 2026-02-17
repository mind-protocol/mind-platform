'use client';

import { Link } from '@/i18n/navigation';
import { useState } from 'react';

type Phase = 'credentials' | 'mfa' | 'success';

export default function GarminPage() {
  const [phase, setPhase] = useState<Phase>('credentials');
  const [userId, setUserId] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mfaCode, setMfaCode] = useState('');
  const [sessionToken, setSessionToken] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleCredentials(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    if (!userId.trim()) {
      setError('User ID is required.');
      return;
    }
    if (!email.trim()) {
      setError('Garmin email is required.');
      return;
    }
    if (!password) {
      setError('Password is required.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/garmin/link', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: userId.trim(),
          email: email.trim(),
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Authentication failed.');
        return;
      }

      if (data.status === 'mfa_required') {
        setSessionToken(data.session_token);
        setPhase('mfa');
      } else if (data.status === 'linked') {
        setDisplayName(data.display_name || email);
        setPhase('success');
      }
    } catch {
      setError('Network error. Is the service running?');
    } finally {
      setLoading(false);
    }
  }

  async function handleMfa(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    if (!mfaCode.trim()) {
      setError('Enter the verification code from your email.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/garmin/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          session_token: sessionToken,
          mfa_code: mfaCode.trim(),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Verification failed.');
        return;
      }

      setDisplayName(data.display_name || email);
      setPhase('success');
    } catch {
      setError('Network error. Try again.');
    } finally {
      setLoading(false);
    }
  }

  if (phase === 'success') {
    return (
      <main className="min-h-screen bg-zinc-950 text-white">
        <div className="max-w-xl mx-auto px-6 py-24">
          <div className="text-center mb-12">
            <p className="text-emerald-500/80 text-sm tracking-widest uppercase mb-4">
              Connected
            </p>
            <h1 className="text-4xl md:text-5xl font-bold font-mono mb-4">
              Garmin Linked
            </h1>
            <p className="text-zinc-500 text-lg">
              Welcome, {displayName}.
            </p>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6 mb-8 font-mono text-sm">
            <div className="mb-3">
              <span className="text-zinc-500">user:</span>{' '}
              <span className="text-amber-500">{userId}</span>
            </div>
            <div className="mb-3">
              <span className="text-zinc-500">device:</span>{' '}
              <span className="text-emerald-400">Garmin Connect</span>
            </div>
            <div>
              <span className="text-zinc-500">status:</span>{' '}
              <span className="text-emerald-400">linked</span>
            </div>
          </div>

          <p className="text-center text-zinc-600 text-sm mb-8">
            Your biometric data will sync automatically. Heart rate, HRV, stress, sleep, and body battery
            flow into Mind Protocol in real time.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/"
              className="px-6 py-3 bg-amber-500 text-black font-semibold rounded hover:bg-amber-400 transition text-center"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </main>
    );
  }

  if (phase === 'mfa') {
    return (
      <main className="min-h-screen bg-zinc-950 text-white">
        <div className="max-w-xl mx-auto px-6 py-24">
          <div className="text-center mb-12">
            <p className="text-amber-500/80 text-sm tracking-widest uppercase mb-4">
              Verification Required
            </p>
            <h1 className="text-4xl md:text-5xl font-bold font-mono mb-4">
              MFA Code
            </h1>
            <p className="text-zinc-500 text-lg">
              Garmin sent a verification code to your email. Enter it below.
            </p>
          </div>

          <form onSubmit={handleMfa} className="space-y-6">
            <div>
              <label htmlFor="mfa" className="block text-sm text-zinc-400 mb-2">
                Verification Code <span className="text-amber-500">*</span>
              </label>
              <input
                id="mfa"
                type="text"
                inputMode="numeric"
                value={mfaCode}
                onChange={(e) => setMfaCode(e.target.value)}
                placeholder="6-digit code"
                maxLength={10}
                autoFocus
                className="w-full px-4 py-3 bg-zinc-900 border border-zinc-700 rounded text-white text-center text-2xl font-mono tracking-widest placeholder-zinc-600 focus:outline-none focus:border-amber-500 transition"
              />
            </div>

            {error && (
              <p className="text-red-400 text-sm">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-amber-500 text-black font-semibold rounded hover:bg-amber-400 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Verifying...' : 'Verify'}
            </button>
          </form>

          <p className="text-center text-zinc-600 text-sm mt-8">
            Code expires in 5 minutes.{' '}
            <button
              onClick={() => { setPhase('credentials'); setError(''); setMfaCode(''); }}
              className="text-amber-500 hover:text-amber-400 underline"
            >
              Start over
            </button>
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <div className="max-w-xl mx-auto px-6 py-24">
        <div className="text-center mb-12">
          <p className="text-amber-500/80 text-sm tracking-widest uppercase mb-4">
            Biometric Link
          </p>
          <h1 className="text-4xl md:text-5xl font-bold font-mono mb-4">
            Link Garmin
          </h1>
          <p className="text-zinc-500 text-lg">
            Connect your Garmin watch to enable biometric awareness.
          </p>
        </div>

        <form onSubmit={handleCredentials} className="space-y-6">
          <div>
            <label htmlFor="userId" className="block text-sm text-zinc-400 mb-2">
              User ID <span className="text-amber-500">*</span>
            </label>
            <input
              id="userId"
              type="text"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              placeholder="Your Mind Protocol user ID"
              maxLength={64}
              className="w-full px-4 py-3 bg-zinc-900 border border-zinc-700 rounded text-white placeholder-zinc-600 focus:outline-none focus:border-amber-500 transition"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm text-zinc-400 mb-2">
              Garmin Email <span className="text-amber-500">*</span>
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your Garmin Connect email"
              className="w-full px-4 py-3 bg-zinc-900 border border-zinc-700 rounded text-white placeholder-zinc-600 focus:outline-none focus:border-amber-500 transition"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm text-zinc-400 mb-2">
              Garmin Password <span className="text-amber-500">*</span>
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Your Garmin Connect password"
              className="w-full px-4 py-3 bg-zinc-900 border border-zinc-700 rounded text-white placeholder-zinc-600 focus:outline-none focus:border-amber-500 transition"
            />
          </div>

          {error && (
            <p className="text-red-400 text-sm">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-amber-500 text-black font-semibold rounded hover:bg-amber-400 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Connecting...' : 'Link Device'}
          </button>
        </form>

        <div className="mt-8 p-4 border border-zinc-800 rounded-lg bg-zinc-900/30">
          <p className="text-zinc-500 text-xs leading-relaxed">
            Your password is used once to authenticate with Garmin&apos;s SSO and is never stored.
            Only OAuth tokens are saved, which auto-refresh and can be revoked at any time from your
            Garmin account settings.
          </p>
        </div>

        <p className="text-center text-zinc-600 text-sm mt-6">
          <Link href="/" className="text-amber-500 hover:text-amber-400 underline">
            Back to home
          </Link>
        </p>
      </div>
    </main>
  );
}
