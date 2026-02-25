'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    if (!email.trim()) {
      setError('Veuillez entrer votre adresse email.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/auth/password-reset-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim() }),
      });

      if (res.ok) {
        setSent(true);
      } else {
        const data = await res.json().catch(() => ({}));
        setError(data.error || 'Une erreur est survenue.');
      }
    } catch {
      setError('Erreur réseau. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  }

  if (sent) {
    return (
      <main className="min-h-screen bg-zinc-950 text-white flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold font-mono tracking-tight">
              Mind Protocol
            </h1>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-8 text-center">
            <div className="text-4xl mb-4">{'\\u{2709}\\u{FE0F}'}</div>
            <h2 className="text-lg font-semibold text-white mb-2">
              Lien envoy&eacute;
            </h2>
            <p className="text-zinc-400 text-sm mb-6">
              Si un compte existe avec cette adresse, un lien de
              r&eacute;initialisation a &eacute;t&eacute; g&eacute;n&eacute;r&eacute;.
              V&eacute;rifiez vos emails ou demandez le lien via Telegram.
            </p>
            <Link
              href="/login"
              className="text-amber-500 hover:text-amber-400 underline text-sm"
            >
              Retour &agrave; la connexion
            </Link>
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
            R&eacute;initialisation du mot de passe
          </p>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-8">
          <p className="text-zinc-400 text-sm mb-6">
            Entrez votre adresse email. Si un compte existe, nous
            g&eacute;n&eacute;rerons un lien de r&eacute;initialisation.
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-sm text-zinc-400 mb-2">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="vous@exemple.com"
                autoComplete="email"
                autoFocus
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
              {loading ? 'Envoi en cours...' : 'Envoyer le lien'}
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
