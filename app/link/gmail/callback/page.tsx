'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

type Step = 'loading' | 'success' | 'error';

function GmailCallbackHandler() {
  const searchParams = useSearchParams();
  const code = searchParams.get('code') || '';
  const state = searchParams.get('state') || ''; // link_code passed through OAuth state
  const oauthError = searchParams.get('error') || '';

  const [step, setStep] = useState<Step>('loading');
  const [error, setError] = useState('');
  const [email, setEmail] = useState('');

  useEffect(() => {
    if (oauthError) {
      setStep('error');
      setError(oauthError === 'access_denied'
        ? 'You declined the permission request. Send /gmail in Telegram to try again.'
        : `Google returned an error: ${oauthError}`
      );
      return;
    }

    if (!code || !state) {
      setStep('error');
      setError('Missing authorization data. Please try the link flow again from Telegram.');
      return;
    }

    exchangeCode();
  }, [code, state, oauthError]);

  async function exchangeCode() {
    try {
      const res = await fetch(`/api/gmail/oauth/callback`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, state }),
      });

      const data = await res.json();

      if (!res.ok) {
        setStep('error');
        setError(data.error || 'Failed to complete authentication.');
        return;
      }

      if (data.status === 'linked') {
        setEmail(data.email || 'Google account');
        setStep('success');
      } else {
        setStep('error');
        setError('Unexpected response. Please try again.');
      }
    } catch (e) {
      setStep('error');
      setError('Connection error. Please try again.');
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
        </div>

        {/* Loading */}
        {step === 'loading' && (
          <div className="text-center py-12">
            <div className="animate-spin w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full mx-auto mb-4" />
            <p className="text-zinc-500">Completing authentication...</p>
          </div>
        )}

        {/* Success */}
        {step === 'success' && (
          <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-6 text-center">
            <div className="text-4xl mb-4">✅</div>
            <h2 className="text-xl font-bold text-emerald-400 mb-2">Gmail Connected!</h2>
            <p className="text-zinc-400 mb-4">
              Account: <span className="text-white">{email}</span>
            </p>
            <p className="text-zinc-500 text-sm">
              You can close this page and return to Telegram.
              <br />
              Try asking: &quot;check my email&quot; or &quot;search emails from X&quot;
            </p>
          </div>
        )}

        {/* Error */}
        {step === 'error' && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-6 text-center">
            <div className="text-3xl mb-4">⚠️</div>
            <h2 className="text-lg font-bold text-red-400 mb-2">Authentication Failed</h2>
            <p className="text-zinc-400 text-sm">{error}</p>
            <p className="text-zinc-500 text-xs mt-4">
              Send &quot;/gmail&quot; in Telegram to get a new link.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}

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

export default function GmailCallbackPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <GmailCallbackHandler />
    </Suspense>
  );
}
