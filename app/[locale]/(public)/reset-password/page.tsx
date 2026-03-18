'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';

export default function ResetPasswordPage() {
  const t = useTranslations('Auth');
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // Redirect if no token
  useEffect(() => {
    if (!token) {
      router.replace('/forgot-password');
    }
  }, [token, router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    if (!password) {
      setError(t('errorNewPasswordRequired'));
      return;
    }

    if (password.length < 8) {
      setError(t('errorPasswordLength'));
      return;
    }

    if (password !== confirm) {
      setError(t('errorPasswordMismatch'));
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/auth/password-reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      });

      const data = await res.json().catch(() => ({ /* non-JSON response */ }));

      if (!res.ok) {
        setError(data.error || t('errorMagicLink'));
        return;
      }

      setSuccess(true);
      // Auto-redirect to tracker after 2s (session cookie was set by the API)
      setTimeout(() => router.push('/tracker'), 2000);
    } catch {
      setError(t('errorNetwork'));
    } finally {
      setLoading(false);
    }
  }

  if (!token) return null;

  if (success) {
    return (
      <main className="min-h-screen bg-zinc-950 text-white flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold font-mono tracking-tight">
              {t('brand')}
            </h1>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-8 text-center">
            <h2 className="text-lg font-semibold text-white mb-2">
              {t('resetSuccessTitle')}
            </h2>
            <p className="text-zinc-400 text-sm">
              {t('resetSuccessMessage')}
            </p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-zinc-950 text-white flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold font-mono tracking-tight">
            {t('brand')}
          </h1>
          <p className="text-zinc-500 text-sm mt-2">
            {t('resetSubtitle')}
          </p>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="password" className="block text-sm text-zinc-400 mb-2">
                {t('resetNewLabel')}
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={t('passwordNewPlaceholder')}
                autoComplete="new-password"
                autoFocus
                className="w-full px-4 py-3 bg-zinc-950 border border-zinc-700 rounded text-white placeholder-zinc-600 focus:outline-none focus:border-amber-500 transition"
              />
            </div>

            <div>
              <label htmlFor="confirm" className="block text-sm text-zinc-400 mb-2">
                {t('passwordConfirmLabel')}
              </label>
              <input
                id="confirm"
                type="password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                placeholder={t('resetConfirmPlaceholder')}
                autoComplete="new-password"
                className="w-full px-4 py-3 bg-zinc-950 border border-zinc-700 rounded text-white placeholder-zinc-600 focus:outline-none focus:border-amber-500 transition"
              />
            </div>

            {error && (
              <p className="text-red-400 text-sm" role="alert">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-amber-500 text-black font-semibold rounded hover:bg-amber-400 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? t('resetLoading') : t('resetButton')}
            </button>
          </form>
        </div>

        <p className="text-center text-zinc-500 text-sm mt-6">
          <Link href="/login" className="text-amber-500 hover:text-amber-400 underline">
            {t('backToLogin')}
          </Link>
        </p>
      </div>
    </main>
  );
}
