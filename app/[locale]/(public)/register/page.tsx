'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';

export default function RegisterPage() {
  const t = useTranslations('Auth');
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Redirect if already authenticated
  useEffect(() => {
    fetch('/api/auth/session')
      .then((r) => { if (r.ok) return r.json(); throw new Error(); })
      .then((data) => { if (data?.user_id) router.replace('/tracker'); })
      .catch(() => { console.error('Session check failed'); });
  }, [router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    if (!name.trim()) {
      setError(t('errorNameRequired'));
      return;
    }
    if (!email.trim()) {
      setError(t('errorEmailRequired'));
      return;
    }
    if (!password) {
      setError(t('errorChoosePassword'));
      return;
    }
    if (password.length < 8) {
      setError(t('errorPasswordLength'));
      return;
    }
    if (password !== passwordConfirm) {
      setError(t('errorPasswordMismatch'));
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          password,
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setError(data.error || t('errorRegistrationFailed'));
        return;
      }

      router.push('/tracker');
    } catch {
      setError(t('errorNetwork'));
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-zinc-950 text-white flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Branding */}
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold font-mono tracking-tight">
            {t('brand')}
          </h1>
          <p className="text-zinc-500 text-sm mt-2">
            {t('registerSubtitle')}
          </p>
        </div>

        {/* Card */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="name" className="block text-sm text-zinc-400 mb-2">
                {t('nameLabel')}
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={t('namePlaceholder')}
                autoComplete="name"
                className="w-full px-4 py-3 bg-zinc-950 border border-zinc-700 rounded text-white placeholder-zinc-600 focus:outline-none focus:border-amber-500 transition"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm text-zinc-400 mb-2">
                {t('emailLabel')}
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t('emailPlaceholder')}
                autoComplete="email"
                className="w-full px-4 py-3 bg-zinc-950 border border-zinc-700 rounded text-white placeholder-zinc-600 focus:outline-none focus:border-amber-500 transition"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm text-zinc-400 mb-2">
                {t('passwordLabel')}
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={t('passwordNewPlaceholder')}
                autoComplete="new-password"
                className="w-full px-4 py-3 bg-zinc-950 border border-zinc-700 rounded text-white placeholder-zinc-600 focus:outline-none focus:border-amber-500 transition"
              />
            </div>

            <div>
              <label htmlFor="passwordConfirm" className="block text-sm text-zinc-400 mb-2">
                {t('passwordConfirmLabel')}
              </label>
              <input
                id="passwordConfirm"
                type="password"
                value={passwordConfirm}
                onChange={(e) => setPasswordConfirm(e.target.value)}
                placeholder={t('passwordConfirmPlaceholder')}
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
              {loading ? t('registerLoading') : t('registerButton')}
            </button>
          </form>
        </div>

        {/* Login link */}
        <p className="text-center text-zinc-500 text-sm mt-6">
          {t('hasAccount')}{' '}
          <Link href="/login" className="text-amber-500 hover:text-amber-400 underline">
            {t('signIn')}
          </Link>
        </p>
      </div>
    </main>
  );
}
