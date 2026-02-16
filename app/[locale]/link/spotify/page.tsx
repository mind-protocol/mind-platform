'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Link } from '@/i18n/navigation';

type Step = 'loading' | 'invalid' | 'ready' | 'redirecting' | 'error';

function SpotifyLinkForm() {
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
      const res = await fetch(`/api/spotify/link/verify`, {
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
      const res = await fetch(`/api/spotify/auth/init?link_code=${encodeURIComponent(code)}&user_id=${encodeURIComponent(chatId)}`);

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || 'Failed to start Spotify authentication.');
        setStep('error');
        return;
      }

      const data = await res.json();
      if (data.auth_url) {
        // Redirect to Spotify OAuth consent screen
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
          <h1 className="text-2xl font-bold font-mono mt-4">Connect Spotify</h1>
          <p className="text-zinc-500 text-sm mt-2">
            Link your Spotify account to share what you&apos;re listening to
          </p>
        </div>

        {/* Loading */}
        {step === 'loading' && (
          <div className="text-center py-12">
            <div className="animate-spin w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full mx-auto mb-4" />
            <p className="text-zinc-500">Verifying link...</p>
          </div>
        )}

        {/* Invalid/Expired Code */}
        {step === 'invalid' && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-6 text-center">
            <div className="text-3xl mb-4">&#10060;</div>
            <h2 className="text-lg font-bold text-red-400 mb-2">Link Invalid</h2>
            <p className="text-zinc-400 text-sm">{error}</p>
            <p className="text-zinc-500 text-xs mt-4">
              Send &quot;/spotify&quot; in Telegram to get a new link.
            </p>
          </div>
        )}

        {/* Ready — Show Connect Button */}
        {step === 'ready' && (
          <div className="space-y-6">
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
              <p className="text-zinc-400 text-sm mb-4">
                You&apos;ll be redirected to Spotify to sign in and approve access to your listening data.
              </p>
              <p className="text-zinc-500 text-xs">
                We request access to see what you&apos;re currently playing, your recent listening history, and your top artists/tracks.
              </p>
            </div>

            <button
              onClick={handleConnect}
              className="w-full bg-[#1DB954] text-black font-medium py-3 rounded-full hover:bg-[#1ed760] transition flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="currentColor" d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
              </svg>
              Connect with Spotify
            </button>

            <p className="text-zinc-600 text-xs text-center">
              Authentication goes directly through Spotify.
              <br />
              Your password is never shared with us.
            </p>
          </div>
        )}

        {/* Redirecting */}
        {step === 'redirecting' && (
          <div className="text-center py-12">
            <div className="animate-spin w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full mx-auto mb-4" />
            <p className="text-zinc-500">Redirecting to Spotify...</p>
          </div>
        )}

        {/* Generic Error */}
        {step === 'error' && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-6 text-center">
            <div className="text-3xl mb-4">&#9888;&#65039;</div>
            <h2 className="text-lg font-bold text-red-400 mb-2">Connection Error</h2>
            <p className="text-zinc-400 text-sm">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 text-emerald-500 hover:text-emerald-400 text-sm"
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
        <div className="animate-spin w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full mx-auto mb-4" />
        <p className="text-zinc-500">Loading...</p>
      </div>
    </main>
  );
}

// Export with Suspense boundary (required for useSearchParams)
export default function SpotifyLinkPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <SpotifyLinkForm />
    </Suspense>
  );
}
