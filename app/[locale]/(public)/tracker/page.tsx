'use client';

import { useState, useCallback } from 'react';
import Link from 'next/link';
import Recommendation from './components/Recommendation';
import SubstanceCard from './components/SubstanceCard';
import LogForm from './components/LogForm';
import BiometricCorrelation from './components/BiometricCorrelation';
import SensationLogger from './components/SensationLogger';
import Timeline from './components/Timeline';
import KCalculator from './components/KCalculator';
import FoodLog from './components/FoodLog';
import PlanViewToggle from './components/planning/PlanViewToggle';
import PlanningCalendar from './components/planning/PlanningCalendar';
import ScheduleDoseForm from './components/planning/ScheduleDoseForm';
import ThemeToggle from './components/ThemeToggle';
import SubstanceConfigMenu from './components/SubstanceConfigMenu';
import SanitizeToggle from '@/components/SanitizeToggle';
import { useSubstanceConfig } from '@/lib/tracker/hooks/useSubstanceConfig';
import { SUBSTANCE_CONFIG, type SubstanceKey } from '@/lib/tracker/constants';

// Category definitions (before visibility filtering)
const BODY_KEYS = new Set(['hydration', 'lions_mane', 'dynabiane', 'omegabiane', 'griffonia', 'valeriane', 'safran', 'venlafaxine', 'sertraline', 'prazepam', 'cyamemazine', 'melatonin', 'yoga', 'vitamine_c']);
const RECREATIONAL_KEYS = new Set(['thc', 'cbd', 'caffeine', 'ketamine', 'lsd', 'nicotine', 'cocaine', 'mmc', 'heroine']);

export default function TrackerPage() {
  const [refreshKey, setRefreshKey] = useState(0);
  const [showKCalc, setShowKCalc] = useState(false);
  const [viewMode, setViewMode] = useState<'now' | 'plan'>('now');
  const [activeTab, setActiveTab] = useState<'body' | 'substances'>('body');
  const [showScheduleForm, setShowScheduleForm] = useState(false);
  const [scheduleDefaults, setScheduleDefaults] = useState<{
    substance?: SubstanceKey;
    dose?: { amount: number; unit: string };
    intent?: string;
  }>({});
  const { visibleKeys } = useSubstanceConfig();

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

  // Filter visible substances by category
  const bodySubstances = visibleKeys.filter((k) => BODY_KEYS.has(k));
  const recreationalSubstances = visibleKeys.filter((k) => RECREATIONAL_KEYS.has(k));
  const currentFilter = activeTab === 'body' ? bodySubstances : recreationalSubstances;

  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 sm:py-20">
        {/* Header */}
        <header className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold font-mono">
              Body Tracker
            </h1>
            <p className="text-zinc-500 text-sm mt-1">
              Precision dosing &middot; Biometric correlation
            </p>
          </div>
          <div className="flex gap-2 items-center flex-wrap justify-end">
            <SubstanceConfigMenu />
            <SanitizeToggle />
            <ThemeToggle />
            <PlanViewToggle mode={viewMode} onChange={setViewMode} />
            <Link
              href="/tracker/3d"
              className="text-sm px-3 py-1.5 rounded border border-zinc-700 text-zinc-400 hover:text-white hover:border-zinc-500 transition"
            >
              Awareness Mirror
            </Link>
            <Link
              href="/tracker/health"
              className="text-sm px-3 py-1.5 rounded border border-teal-500/30 text-teal-400 hover:bg-teal-500/10 transition"
            >
              Health
            </Link>
            <Link
              href="/tracker/protocols"
              className="text-sm px-3 py-1.5 rounded border border-orange-500/30 text-orange-400 hover:bg-orange-500/10 transition"
            >
              Protocoles
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

            {/* Sensation / side-effect logger */}
            <div className="mb-6">
              <SensationLogger onLogged={refresh} />
            </div>

            {/* ── Category tabs ────────────────────────────────── */}
            <div className="flex gap-3 mb-6">
              <button
                onClick={() => setActiveTab('body')}
                className={`flex-1 py-3 px-4 rounded-lg text-sm font-medium transition border ${
                  activeTab === 'body'
                    ? 'border-teal-500/40 bg-teal-500/10 text-teal-400'
                    : 'border-zinc-800 bg-zinc-900 text-zinc-500 hover:text-zinc-300 hover:border-zinc-700'
                }`}
              >
                <span className="text-lg mr-2">💪</span>
                Body
                <span className="block text-[10px] text-zinc-600 mt-0.5 font-normal">
                  Eau, nourriture, vitamines, médicaments
                </span>
              </button>
              <button
                onClick={() => setActiveTab('substances')}
                className={`flex-1 py-3 px-4 rounded-lg text-sm font-medium transition border ${
                  activeTab === 'substances'
                    ? 'border-green-500/40 bg-green-500/10 text-green-400'
                    : 'border-zinc-800 bg-zinc-900 text-zinc-500 hover:text-zinc-300 hover:border-zinc-700'
                }`}
              >
                <span className="text-lg mr-2">🌿</span>
                Substances
                <span className="block text-[10px] text-zinc-600 mt-0.5 font-normal">
                  THC, CBD, Café, K, LSD, Nicotine
                </span>
              </button>
            </div>

            {/* K Calculator (toggle, substances tab only) */}
            {showKCalc && activeTab === 'substances' && (
              <div className="mb-6">
                <KCalculator />
              </div>
            )}

            {/* Summary cards */}
            <SubstanceCard refreshKey={refreshKey} filter={currentFilter} />

            {/* Body tab: food log above substance log */}
            {activeTab === 'body' && (
              <div className="mt-6">
                <FoodLog refreshKey={refreshKey} />
              </div>
            )}

            {/* Log form (filtered by tab) */}
            <div className="mt-6">
              <LogForm onLogged={refresh} filter={currentFilter} />
            </div>

            {/* Timeline (filtered by tab) */}
            <div className="mt-6">
              <Timeline refreshKey={refreshKey} filter={currentFilter} />
            </div>
          </>
        )}

        {/* Biometric correlation chart — always visible */}
        <div className="mt-6">
          <BiometricCorrelation refreshKey={refreshKey} />
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
