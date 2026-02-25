'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function ResetPasswordPage() {
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
      setError('Veuillez entrer un nouveau mot de passe.');
      return;
    }

    if (password.length < 8) {
      setError('Le mot de passe doit contenir au moins 8 caractères.');
      return;
    }

    if (password !== confirm) {
      setError('Les mots de passe ne correspondent pas.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/auth/password-reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setError(data.error || 'Lien invalide ou expir\u00e9.');
        return;
      }

      setSuccess(true);
      // Auto-redirect to tracker after 2s (session cookie was set by the API)
      setTimeout(() => router.push('/tracker'), 2000);
    } catch {
      setError('Erreur r\u00e9seau. Veuillez r\u00e9essayer.');
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
              Mind Protocol
            </h1>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-8 text-center">
            <div className="text-4xl mb-4">{'\u{2705}'}</div>
            <h2 className="text-lg font-semibold text-white mb-2">
              Mot de passe mis &agrave; jour
            </h2>
            <p className="text-zinc-400 text-sm">
              Redirection vers le tracker...
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
            Mind Protocol
          </h1>
          <p className="text-zinc-500 text-sm mt-2">
            Nouveau mot de passe
          </p>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="password" className="block text-sm text-zinc-400 mb-2">
                Nouveau mot de passe
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimum 8 caract\u00e8res"
                autoComplete="new-password"
                autoFocus
                className="w-full px-4 py-3 bg-zinc-950 border border-zinc-700 rounded text-white placeholder-zinc-600 focus:outline-none focus:border-amber-500 transition"
              />
            </div>

            <div>
              <label htmlFor="confirm" className="block text-sm text-zinc-400 mb-2">
                Confirmer le mot de passe
              </label>
              <input
                id="confirm"
                type="password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                placeholder="Retapez le mot de passe"
                autoComplete="new-password"
                className="w-full px-4 py-3 bg-zinc-950 border border-zinc-700 rounded text-white placeholder-zinc-600 focus:outline-none focus:border-amber-500 transition"
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
              {loading ? 'Mise \u00e0 jour...' : 'Mettre \u00e0 jour le mot de passe'}
            </button>
          </form>
        </div>

        <p className="text-center text-zinc-500 text-sm mt-6">
          <Link href="/login" className="text-amber-500 hover:text-amber-400 underline">
            Retour &agrave; la connexion
          </Link>
        </p>
      </div>
    </main>
  );
}
