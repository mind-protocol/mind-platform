'use client';

import { useState, useCallback } from 'react';
import Link from 'next/link';
import Recommendation from './components/Recommendation';
import SubstanceCard from './components/SubstanceCard';
import LogForm from './components/LogForm';
import BiometricCorrelation from './components/BiometricCorrelation';
import Timeline from './components/Timeline';
import KCalculator from './components/KCalculator';
import FoodLog from './components/FoodLog';
import PlanViewToggle from './components/planning/PlanViewToggle';
import PlanningCalendar from './components/planning/PlanningCalendar';
import ScheduleDoseForm from './components/planning/ScheduleDoseForm';
import type { SubstanceKey } from '@/lib/tracker/constants';

export default function TrackerPage() {
  const [refreshKey, setRefreshKey] = useState(0);
  const [showKCalc, setShowKCalc] = useState(false);
  const [viewMode, setViewMode] = useState<'now' | 'plan'>('now');
  const [showScheduleForm, setShowScheduleForm] = useState(false);
  const [scheduleDefaults, setScheduleDefaults] = useState<{
    substance?: SubstanceKey;
    dose?: { amount: number; unit: string };
    intent?: string;
  }>({});

  const refresh = () => setRefreshKey((k) => k + 1);

  const openSchedule = useCallback((substance: string, details: Record<string, unknown>) => {
    setScheduleDefaults({
      substance: substance as SubstanceKey,
      dose: {
        amount: (details.amount as number) || 1,
        unit: (details.unit as string) || 'unit',
      },
      intent: (details.intent as string) || '',
    });
    setShowScheduleForm(true);
  }, []);

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
          <div className="flex gap-2 items-center">
            <PlanViewToggle mode={viewMode} onChange={setViewMode} />
            <Link
              href="/tracker/3d"
              className="text-sm px-3 py-1.5 rounded border border-zinc-700 text-zinc-400 hover:text-white hover:border-zinc-500 transition"
            >
              3D View
            </Link>
            <Link
              href="/tracker/health"
              className="text-sm px-3 py-1.5 rounded border border-teal-500/30 text-teal-400 hover:bg-teal-500/10 transition"
            >
              Health
            </Link>
            <Link
              href="/tracker/dependencies"
              className="text-sm px-3 py-1.5 rounded border border-amber-500/30 text-amber-400 hover:bg-amber-500/10 transition"
            >
              Dépendances
            </Link>
            <button
              onClick={() => setShowKCalc(!showKCalc)}
              className="text-sm px-3 py-1.5 rounded border border-purple-500/30 text-purple-400 hover:bg-purple-500/10 transition"
            >
              {showKCalc ? 'Hide' : 'K Calculator'}
            </button>
          </div>
        </header>

        {viewMode === 'plan' ? (
          <>
            {/* Planning Calendar */}
            <div className="mb-6">
              <PlanningCalendar />
            </div>
          </>
        ) : (
          <>
            {/* Recommendation */}
            <div className="mb-6">
              <Recommendation refreshKey={refreshKey} onQuickLog={quickLog} onSchedule={openSchedule} />
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
          </>
        )}

        {/* Food tracker — always visible */}
        <div className="mt-6">
          <FoodLog refreshKey={refreshKey} />
        </div>

        {/* Biometric correlation chart — always visible */}
        <div className="mt-6">
          <BiometricCorrelation refreshKey={refreshKey} />
        </div>

        {/* Timeline — always visible */}
        <div className="mt-6">
          <Timeline refreshKey={refreshKey} />
        </div>
      </div>

      {/* Schedule form modal (from recommendation "Plan" button) */}
      {showScheduleForm && (
        <ScheduleDoseForm
          defaults={scheduleDefaults}
          onSchedule={async (data) => {
            try {
              await fetch('/api/tracker/plan', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
              });
            } catch { /* silent */ }
            setShowScheduleForm(false);
          }}
          onClose={() => setShowScheduleForm(false)}
        />
      )}
    </main>
  );
}
