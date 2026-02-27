'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useDependencies } from '@/lib/tracker/hooks/useDependencies';
import SanitizeToggle from '@/components/SanitizeToggle';
import DependencyOverview from './components/DependencyOverview';
import TaperingProtocols from './components/TaperingProtocols';
import BiometricValidation from './components/BiometricValidation';
import InteractionMatrix from './components/InteractionMatrix';

function AuthGate({ onAuth }: { onAuth: (token: string) => void }) {
  const [pass, setPass] = useState('');
  const [error, setError] = useState(false);

  const submit = async () => {
    setError(false);
    try {
      const res = await fetch('/api/tracker/dependencies?days=1', {
        headers: { Authorization: `Bearer ${pass}` },
      });
      if (res.ok) {
        sessionStorage.setItem('health_token', pass);
        onAuth(pass);
      } else {
        setError(true);
      }
    } catch {
      setError(true);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-8 w-full max-w-sm">
        <div className="text-center mb-6">
          <div className="text-4xl mb-3">🔒</div>
          <h1 className="text-xl font-bold text-white">Panel de Dependances</h1>
          <p className="text-zinc-500 text-sm mt-1">Acces protege -- donnees sensibles</p>
        </div>
        <input
          type="password"
          value={pass}
          onChange={(e) => setPass(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && submit()}
          placeholder="Cle d'acces"
          className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2.5 text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500/50 mb-3"
          autoFocus
        />
        {error && <p className="text-red-400 text-sm mb-3">Cle invalide</p>}
        <button
          onClick={submit}
          className="w-full bg-amber-500/20 text-amber-400 border border-amber-500/30 rounded-lg py-2.5 hover:bg-amber-500/30 transition font-medium"
        >
          Deverrouiller
        </button>
      </div>
    </div>
  );
}

function DependencyDashboard({ token }: { token: string }) {
  const { data, loading, error, refresh } = useDependencies(token, 60);
  const [selectedSubstance, setSelectedSubstance] = useState<string | null>(null);
  const [interactions, setInteractions] = useState<{ user_substances: string[]; interactions: Array<{ a: string; b: string; severity: string; note: string }> } | null>(null);

  // Fetch interaction matrix
  useEffect(() => {
    fetch('/api/tracker/interactions?days=60')
      .then((r) => r.ok ? r.json() : null)
      .then((d) => d && setInteractions(d))
      .catch(() => { console.error('Failed to load interaction matrix'); });
  }, []);

  if (loading && !data) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="text-zinc-500 animate-pulse">Analyse des dependances...</div>
      </div>
    );
  }

  if (error === 'unauthorized') {
    sessionStorage.removeItem('health_token');
    window.location.reload();
    return null;
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="text-red-400">Erreur: {error || 'Donnees indisponibles'}</div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-20">
        {/* Header */}
        <header className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold font-mono">
              Panel de Dependances
            </h1>
            <p className="text-zinc-500 text-sm mt-1">
              Analyse {data.analysis_period_days}j &middot; Protocoles de sevrage &middot; Validation biometrique
            </p>
          </div>
          <div className="flex gap-2 items-center">
            <SanitizeToggle />
            <Link
              href="/tracker"
              className="text-sm px-3 py-1.5 rounded border border-zinc-700 text-zinc-400 hover:text-white hover:border-zinc-500 transition"
            >
              Tracker
            </Link>
            <Link
              href="/tracker/health"
              className="text-sm px-3 py-1.5 rounded border border-teal-500/30 text-teal-400 hover:bg-teal-500/10 transition"
            >
              Sante
            </Link>
            <button
              onClick={refresh}
              disabled={loading}
              className="text-sm px-3 py-1.5 rounded border border-amber-500/30 text-amber-400 hover:bg-amber-500/10 transition disabled:opacity-50"
            >
              {loading ? '...' : 'Actualiser'}
            </button>
            <button
              onClick={() => { sessionStorage.removeItem('health_token'); window.location.reload(); }}
              className="text-sm px-3 py-1.5 rounded border border-red-500/30 text-red-400 hover:bg-red-500/10 transition"
            >
              Verrouiller
            </button>
          </div>
        </header>

        {/* Overall risk banner */}
        {data.overall_risk !== 'low' && (
          <div className={`mb-6 p-4 rounded-xl border ${
            data.overall_risk === 'critical' ? 'bg-red-500/10 border-red-500/30 text-red-400' :
            data.overall_risk === 'high' ? 'bg-orange-500/10 border-orange-500/30 text-orange-400' :
            'bg-yellow-500/10 border-yellow-500/30 text-yellow-400'
          }`}>
            <div className="flex items-center gap-2">
              <span className="text-lg">{data.overall_risk === 'critical' ? '🚨' : data.overall_risk === 'high' ? '⚠️' : '📊'}</span>
              <span className="font-medium">
                Risque global : {data.overall_risk === 'critical' ? 'CRITIQUE' : data.overall_risk === 'high' ? 'ELEVE' : 'MODERE'}
              </span>
              {data.highest_risk_substance && (
                <span className="text-sm opacity-75">
                  -- Substance principale : {data.highest_risk_substance}
                </span>
              )}
            </div>
          </div>
        )}

        {/* Interaction Matrix */}
        {interactions && interactions.user_substances.length >= 2 && (
          <div className="mb-6">
            <InteractionMatrix
              userSubstances={interactions.user_substances}
              interactions={interactions.interactions as Array<{ a: string; b: string; severity: 'low' | 'moderate' | 'high' | 'critical'; note: string }>}
            />
          </div>
        )}

        {/* Dependency Overview */}
        <div className="mb-6">
          <DependencyOverview
            substances={data.substances}
            onSelect={setSelectedSubstance}
            selected={selectedSubstance}
          />
        </div>

        {/* Real-time biometric validation */}
        <div className="mb-6">
          <BiometricValidation
            biometrics={data.biometrics_now}
            substances={data.substances}
            selected={selectedSubstance}
          />
        </div>

        {/* Tapering protocols */}
        <div className="mb-6">
          <TaperingProtocols
            substances={data.substances}
            selected={selectedSubstance}
            onSelect={setSelectedSubstance}
          />
        </div>
      </div>
    </main>
  );
}

export default function DependenciesPage() {
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const stored = sessionStorage.getItem('health_token');
    if (stored) setToken(stored);
  }, []);

  if (!token) return <AuthGate onAuth={setToken} />;
  return <DependencyDashboard token={token} />;
}
