'use client';

import { useState } from 'react';
import SubstanceCard from './components/SubstanceCard';
import LogForm from './components/LogForm';
import BiometricCorrelation from './components/BiometricCorrelation';
import Timeline from './components/Timeline';
import KCalculator from './components/KCalculator';

export default function TrackerPage() {
  const [refreshKey, setRefreshKey] = useState(0);
  const [showKCalc, setShowKCalc] = useState(false);

  const refresh = () => setRefreshKey((k) => k + 1);

  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 sm:py-20">
        {/* Header */}
        <header className="flex items-center justify-between mb-8">
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
