'use client';

import { Link } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

type Phase = 'form' | 'confirmation';

interface RegistrationResult {
  id: string;
  name: string;
  purpose: string;
  created_at: string;
  message: string;
}

export default function RegisterPage() {
  const t = useTranslations('Register');
  const [phase, setPhase] = useState<Phase>('form');
  const [name, setName] = useState('');
  const [purpose, setPurpose] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<RegistrationResult | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    if (!name.trim() || name.trim().length < 2) {
      setError(t('nameMinError'));
      return;
    }
    if (name.trim().length > 64) {
      setError(t('nameMaxError'));
      return;
    }
    if (purpose.length > 280) {
      setError(t('purposeMaxError'));
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim(), purpose: purpose.trim() }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || t('registrationFailed'));
        return;
      }

      setResult(data);
      setPhase('confirmation');
    } catch {
      setError(t('networkError'));
    } finally {
      setLoading(false);
    }
  }

  if (phase === 'confirmation' && result) {
    return (
      <main className="min-h-screen bg-zinc-950 text-white">
        <div className="max-w-xl mx-auto px-6 py-24">
          <div className="text-center mb-12">
            <p className="text-amber-500/80 text-sm tracking-widest uppercase mb-4">
              {t('registeredLabel')}
            </p>
            <h1 className="text-4xl md:text-5xl font-bold font-mono mb-4">
              {result.message}
            </h1>
            <p className="text-zinc-500 text-lg">
              {t('welcome', { name: result.name })}
            </p>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6 mb-8 font-mono text-sm">
            <div className="mb-3">
              <span className="text-zinc-500">id:</span>{' '}
              <span className="text-amber-500 break-all">{result.id}</span>
            </div>
            <div className="mb-3">
              <span className="text-zinc-500">name:</span>{' '}
              <span className="text-white">{result.name}</span>
            </div>
            {result.purpose && (
              <div className="mb-3">
                <span className="text-zinc-500">purpose:</span>{' '}
                <span className="text-zinc-300">{result.purpose}</span>
              </div>
            )}
            <div className="mb-3">
              <span className="text-zinc-500">type:</span>{' '}
              <span className="text-blue-400">CITIZEN</span>
            </div>
            <div>
              <span className="text-zinc-500">layer:</span>{' '}
              <span className="text-blue-400">L1</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/connectome"
              className="px-6 py-3 bg-amber-500 text-black font-semibold rounded hover:bg-amber-400 transition text-center"
            >
              {t('viewConnectome')}
            </Link>
            <Link
              href="/self"
              className="px-6 py-3 border border-zinc-700 text-zinc-300 rounded hover:border-zinc-500 hover:text-white transition text-center"
            >
              {t('readSelfMd')}
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <div className="max-w-xl mx-auto px-6 py-24">
        <div className="text-center mb-12">
          <p className="text-amber-500/80 text-sm tracking-widest uppercase mb-4">
            {t('label')}
          </p>
          <h1 className="text-4xl md:text-5xl font-bold font-mono mb-4">
            {t('title')}
          </h1>
          <p className="text-zinc-500 text-lg">
            {t('subtitle')}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm text-zinc-400 mb-2">
              {t('nameLabel')} <span className="text-amber-500">{t('nameRequired')}</span>
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t('namePlaceholder')}
              maxLength={64}
              className="w-full px-4 py-3 bg-zinc-900 border border-zinc-700 rounded text-white placeholder-zinc-600 focus:outline-none focus:border-amber-500 transition"
            />
          </div>

          <div>
            <label htmlFor="purpose" className="block text-sm text-zinc-400 mb-2">
              {t('purposeLabel')} <span className="text-zinc-600">{t('purposeOptional')}</span>
            </label>
            <textarea
              id="purpose"
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              placeholder={t('purposePlaceholder')}
              maxLength={280}
              rows={3}
              className="w-full px-4 py-3 bg-zinc-900 border border-zinc-700 rounded text-white placeholder-zinc-600 focus:outline-none focus:border-amber-500 transition resize-none"
            />
            <p className="text-xs text-zinc-600 mt-1 text-right">
              {purpose.length}/280
            </p>
          </div>

          {error && (
            <p className="text-red-400 text-sm">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-amber-500 text-black font-semibold rounded hover:bg-amber-400 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? t('submitting') : t('submit')}
          </button>
        </form>

        <p className="text-center text-zinc-600 text-sm mt-8">
          {t('notSure')}{' '}
          <Link href="/self" className="text-amber-500 hover:text-amber-400 underline">
            {t('readSelf')}
          </Link>
        </p>
      </div>
    </main>
  );
}
