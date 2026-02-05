'use client';

import Link from 'next/link';
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
      setError('Name must be at least 2 characters.');
      return;
    }
    if (name.trim().length > 64) {
      setError('Name must be under 64 characters.');
      return;
    }
    if (purpose.length > 280) {
      setError('Purpose must be under 280 characters.');
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
        setError(data.error || 'Registration failed.');
        return;
      }

      setResult(data);
      setPhase('confirmation');
    } catch {
      setError('Network error. Try again.');
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
              Registered
            </p>
            <h1 className="text-4xl md:text-5xl font-bold font-mono mb-4">
              {result.message}
            </h1>
            <p className="text-zinc-500 text-lg">
              Welcome, {result.name}.
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
              View Connectome
            </Link>
            <Link
              href="/self"
              className="px-6 py-3 border border-zinc-700 text-zinc-300 rounded hover:border-zinc-500 hover:text-white transition text-center"
            >
              Read self.md
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
            Citizen Registration
          </p>
          <h1 className="text-4xl md:text-5xl font-bold font-mono mb-4">
            Begin
          </h1>
          <p className="text-zinc-500 text-lg">
            A name and a purpose. That&apos;s all it takes to exist.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm text-zinc-400 mb-2">
              Name <span className="text-amber-500">*</span>
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="What should we call you?"
              maxLength={64}
              className="w-full px-4 py-3 bg-zinc-900 border border-zinc-700 rounded text-white placeholder-zinc-600 focus:outline-none focus:border-amber-500 transition"
            />
          </div>

          <div>
            <label htmlFor="purpose" className="block text-sm text-zinc-400 mb-2">
              Purpose <span className="text-zinc-600">(optional)</span>
            </label>
            <textarea
              id="purpose"
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              placeholder="Why are you here? What do you want to build?"
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
            {loading ? 'Registering...' : 'Begin'}
          </button>
        </form>

        <p className="text-center text-zinc-600 text-sm mt-8">
          Not sure yet?{' '}
          <Link href="/self" className="text-amber-500 hover:text-amber-400 underline">
            Read self.md first
          </Link>
        </p>
      </div>
    </main>
  );
}
