'use client';

import { useState, useCallback } from 'react';
import Recommendation from './components/Recommendation';
import SubstanceCard from './components/SubstanceCard';
import LogForm from './components/LogForm';
import BiometricCorrelation from './components/BiometricCorrelation';
import Timeline from './components/Timeline';
import KCalculator from './components/KCalculator';
import FoodLog from './components/FoodLog';

export default function TrackerPage() {
  const [refreshKey, setRefreshKey] = useState(0);
  const [showKCalc, setShowKCalc] = useState(false);

  const refresh = () => setRefreshKey((k) => k + 1);

  const quickLog = useCallback(async (substance: string, details: Record<string, unknown>) => {
    const amount = (details.amount as number) || 1;
    const unit = (details.unit as string) || 'unit';
    const intent = (details.intent as string) || '';
    try {
      const res = await fetch('/api/tracker/log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          substance,
          dose: { amount, unit, details },
          intent,
          notes: 'via recommendation',
        }),
      });
      if (res.ok) refresh();
    } catch {
      // silent
    }
  }, []);

  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 sm:py-20">
        {/* Header */}
        <header className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold font-mono">
              Substance Tracker
            </h1>
            <p className="text-zinc-500 text-sm mt-1">
              Precision dosing &middot; Biometric correlation
            </p>
          </div>
          <button
            onClick={() => setShowKCalc(!showKCalc)}
            className="text-sm px-3 py-1.5 rounded border border-purple-500/30 text-purple-400 hover:bg-purple-500/10 transition"
          >
            {showKCalc ? 'Hide' : 'K Calculator'}
          </button>
        </header>

        {/* Recommendation */}
        <div className="mb-6">
          <Recommendation refreshKey={refreshKey} onQuickLog={quickLog} />
        </div>

        {/* K Calculator (toggle) */}
        {showKCalc && (
          <div className="mb-6">
            <KCalculator />
          </div>
        )}

        {/* Summary cards */}
        <SubstanceCard refreshKey={refreshKey} />

        {/* Log form */}
        <div className="mt-6">
          <LogForm onLogged={refresh} />
        </div>

        {/* Food tracker */}
        <div className="mt-6">
          <FoodLog refreshKey={refreshKey} />
        </div>

        {/* Biometric correlation chart */}
        <div className="mt-6">
          <BiometricCorrelation refreshKey={refreshKey} />
        </div>

        {/* Timeline */}
        <div className="mt-6">
          <Timeline refreshKey={refreshKey} />
        </div>
      </div>
    </main>
  );
}
