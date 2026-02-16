'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Link } from '@/i18n/navigation';

type Step = 'loading' | 'invalid' | 'ready' | 'redirecting' | 'error';

function GmailLinkForm() {
  const searchParams = useSearchParams();
  const code = searchParams.get('code') || '';

  const [step, setStep] = useState<Step>('loading');
  const [error, setError] = useState('');
  const [chatId, setChatId] = useState('');
  const [username, setUsername] = useState('');

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
      const res = await fetch(`/api/gmail/link/verify`, {
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
      setStep('ready');
    } catch (e) {
      setStep('error');
      setError('Unable to connect to server. Please try again.');
    }
  }

  async function handleConnect() {
    setStep('redirecting');
    setError('');

    try {
      const res = await fetch(`/api/gmail/auth/init?link_code=${encodeURIComponent(code)}&user_id=${encodeURIComponent(chatId)}`);

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || 'Failed to start Google authentication.');
        setStep('error');
        return;
      }

      const data = await res.json();
      if (data.auth_url) {
        // Redirect to Google OAuth consent screen
        window.location.href = data.auth_url;
      } else {
        setError('No auth URL returned. Please try again.');
        setStep('error');
      }
    } catch (e) {
      setError('Connection error. Please try again.');
      setStep('error');
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
          <h1 className="text-2xl font-bold font-mono mt-4">Connect Gmail</h1>
          <p className="text-zinc-500 text-sm mt-2">
            Link your Gmail account to enable email access
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
              Send &quot;/gmail&quot; in Telegram to get a new link.
            </p>
          </div>
        )}

        {/* Ready — Show Connect Button */}
        {step === 'ready' && (
          <div className="space-y-6">
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
              <p className="text-zinc-400 text-sm mb-4">
                You&apos;ll be redirected to Google to sign in and approve read-only access to your emails.
              </p>
              <p className="text-zinc-500 text-xs">
                We only request permission to read your emails — we cannot send, delete, or modify anything.
              </p>
            </div>

            <button
              onClick={handleConnect}
              className="w-full bg-amber-500 text-black font-medium py-3 rounded-lg hover:bg-amber-400 transition flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Connect with Google
            </button>

            <p className="text-zinc-600 text-xs text-center">
              Authentication goes directly through Google.
              <br />
              Your password is never shared with us.
            </p>
          </div>
        )}

        {/* Redirecting */}
        {step === 'redirecting' && (
          <div className="text-center py-12">
            <div className="animate-spin w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full mx-auto mb-4" />
            <p className="text-zinc-500">Redirecting to Google...</p>
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
export default function GmailLinkPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <GmailLinkForm />
    </Suspense>
  );
}
