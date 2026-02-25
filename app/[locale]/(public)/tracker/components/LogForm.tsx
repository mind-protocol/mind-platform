'use client';

import { useState, useCallback, useRef, useEffect } from 'react';

const TABS = [
  { key: 'nicotine', label: 'Nicotine', color: '#f59e0b', icon: '💨' },
  { key: 'caffeine', label: 'Caffeine', color: '#d97706', icon: '☕' },
  { key: 'thc', label: 'THC', color: '#22c55e', icon: '🌿' },
  { key: 'cbd', label: 'CBD Complex', color: '#84cc16', icon: '🌱' },
  { key: 'lions_mane', label: "Lion's Mane", color: '#b45309', icon: '🦁' },
  { key: 'ketamine', label: 'Ketamine', color: '#8b5cf6', icon: '💎' },
  { key: 'lsd', label: 'LSD', color: '#ec4899', icon: '🔮' },
  { key: 'hydration', label: 'H₂O', color: '#3b82f6', icon: '💧' },
  { key: 'melatonin', label: 'Melatonin', color: '#6366f1', icon: '🌙' },
  { key: 'venlafaxine', label: 'Venlafaxine', color: '#14b8a6', icon: '💊' },
  { key: 'sertraline', label: 'Sertraline', color: '#06b6d4', icon: '💊' },
  { key: 'prazepam', label: 'Prazepam', color: '#94a3b8', icon: '🫧' },
  { key: 'cyamemazine', label: 'Cyamemazine', color: '#7e22ce', icon: '🌌' },
  { key: 'dynabiane', label: 'Dynabiane', color: '#10b981', icon: '🧬' },
  { key: 'omegabiane', label: 'Omegabiane', color: '#0ea5e9', icon: '🐟' },
  { key: 'griffonia', label: 'Griffonia', color: '#a855f7', icon: '🌰' },
  { key: 'valeriane', label: 'Valériane', color: '#65a30d', icon: '🌾' },
  { key: 'safran', label: 'Safran', color: '#f97316', icon: '🌸' },
  { key: 'yoga', label: 'Yoga', color: '#8b5cf6', icon: '🧘' },
] as const;

type TabKey = (typeof TABS)[number]['key'];

const INTENTS: Record<string, string[]> = {
  thc: ['focus', 'relax', 'creative', 'sleep', 'social'],
  cbd: ['relax', 'anxiety', 'sleep', 'recovery', 'adaptogenic', 'serotonin-support'],
  lions_mane: ['focus', 'neuroprotection', 'memory', 'daily'],
  caffeine: ['focus', 'energy', 'morning-ritual', 'social', 'pre-workout'],
  ketamine: ['micro-boost', 'dissociation', 'identity-dissolution'],
  lsd: ['microdose', 'creative', 'introspection', 'therapeutic', 'social'],
  nicotine: ['focus', 'break', 'craving'],
  hydration: ['baseline', 'recovery', 'pre-sleep'],
  melatonin: ['sleep', 'jet-lag', 'circadian-reset'],
  venlafaxine: ['daily', 'morning', 'evening'],
  sertraline: ['daily', 'morning'],
  prazepam: ['anxiety', 'panic', 'sleep', 'as-needed'],
  cyamemazine: ['sleep', 'anxiety', 'as-needed'],
  dynabiane: ['daily', 'gut-brain', 'immunity', 'mood'],
  omegabiane: ['daily', 'neuroprotection', 'anti-inflammatory', 'cardiovascular'],
  griffonia: ['daily', 'mood', 'sleep', 'serotonin-support', 'anxiety'],
  valeriane: ['sleep', 'anxiety', 'relaxation', 'as-needed'],
  safran: ['daily', 'mood', 'anti-stress', 'cognitive'],
  yoga: ['morning', 'recovery', 'focus', 'sleep', 'stretching', 'strength'],
};

const DEFAULTS: Record<string, { amount: number; unit: string; details: Record<string, unknown> }> = {
  thc: { amount: 1, unit: 'chamber', details: { strain_thc: 22, temp_c: 230, reaction: 'clean' } },
  cbd: { amount: 1, unit: 'comprimé', details: { route: 'complex', form: 'tablet', reaction: 'clean' } },
  lions_mane: { amount: 420, unit: 'mg', details: { form: 'capsule', mg_per_capsule: 420 } },
  caffeine: { amount: 150, unit: 'mg', details: { form: 'double', shots: 2, milk: true, sugar: 1, sugarType: 'blanc' } },
  ketamine: { amount: 30, unit: 'mg', details: { form: 'crystal', route: 'intranasal', estimate: 'visual' } },
  lsd: { amount: 0.5, unit: 'carton', details: { form: 'carton', ug_estimate: 100 } },
  nicotine: { amount: 3, unit: 'puffs', details: { strength_pct: 20, mode: 'POWER', wattage: 22, resistance: 1.2, voltage_v: null, puff_duration_s: null, reaction: 'clean' } },
  hydration: { amount: 500, unit: 'ml', details: { additives: [] } },
  melatonin: { amount: 3, unit: 'mg', details: { form: 'tablet' } },
  venlafaxine: { amount: 75, unit: 'mg', details: { form: 'capsule', release: 'extended' } },
  sertraline: { amount: 200, unit: 'mg', details: { form: 'tablet' } },
  prazepam: { amount: 10, unit: 'gouttes', details: { form: 'solution', route: 'sublingual', concentration: '1mg/goutte' } },
  cyamemazine: { amount: 25, unit: 'mg', details: { form: 'tablet' } },
  dynabiane: { amount: 1, unit: 'gélule', details: { form: 'capsule', brand: 'PiLeJe', type: 'probiotic' } },
  omegabiane: { amount: 1, unit: 'gélule', details: { form: 'capsule', brand: 'PiLeJe', type: 'omega-3' } },
  griffonia: { amount: 900, unit: 'mg', details: { form: 'capsule', active: '5-HTP' } },
  valeriane: { amount: 300, unit: 'mg', details: { form: 'capsule', type: 'root-extract' } },
  safran: { amount: 1000, unit: 'mg', details: { form: 'capsule', type: 'extract' } },
  yoga: { amount: 3, unit: 'min', details: { style: 'vinyasa', flow: false } },
};

const K_PRESETS = [
  { mg: 15, label: 'Bump', desc: 'tiny line' },
  { mg: 30, label: 'Light', desc: 'small key' },
  { mg: 50, label: 'Moderate', desc: 'medium line' },
  { mg: 80, label: 'Strong', desc: 'fat line' },
  { mg: 120, label: 'Deep', desc: 'heavy dose' },
];

const LSD_PRESETS = [
  { dose: 0.25, label: '¼ carton', desc: 'microdose', ug: 25 },
  { dose: 0.5, label: '½ carton', desc: 'light / threshold', ug: 50 },
  { dose: 1, label: '1 carton', desc: 'standard', ug: 100 },
  { dose: 1.5, label: '1½ cartons', desc: 'strong', ug: 150 },
  { dose: 2, label: '2 cartons', desc: 'heavy', ug: 200 },
];

const ADDITIVES = ['sodium', 'potassium', 'magnesium', 'vitC', 'B12', 'B6', 'B2'];

const RESISTANCE_OPTIONS = [0.2, 0.4, 0.6, 0.8, 1.2];
const VAPE_MODES = ['POWER', 'BYPASS', 'TC-SS', 'TC-Ni', 'TC-Ti', 'ATL', 'MTL'] as const;

const VAPE_REACTIONS = [
  { key: 'clean', label: 'Clean', icon: '✅' },
  { key: 'cough-light', label: 'Cough (light)', icon: '😤' },
  { key: 'cough-strong', label: 'Cough (strong)', icon: '🫁' },
  { key: 'cough-very-strong', label: 'Cough (very strong)', icon: '💀' },
  { key: 'gag', label: 'Gag', icon: '🤢' },
  { key: 'vomit', label: 'Vomit', icon: '🤮' },
] as const;

const YOGA_STYLES = [
  { key: 'vinyasa', label: 'Vinyasa', icon: '🌊', hasFlow: true },
  { key: 'yin', label: 'Yin', icon: '☯️', hasFlow: false },
  { key: 'gainage', label: 'Gainage', icon: '🪨', hasFlow: false },
  { key: 'renforcement', label: 'Renforcement', icon: '💪', hasFlow: false },
  { key: 'mobilite', label: 'Mobilité', icon: '🦎', hasFlow: false },
] as const;

const YOGA_TIMER_PRESETS = [
  { seconds: 30, label: '30s' },
  { seconds: 60, label: '1m' },
  { seconds: 120, label: '2m' },
  { seconds: 180, label: '3m' },
  { seconds: 240, label: '4m' },
  { seconds: 300, label: '5m' },
  { seconds: 420, label: '7m' },
];

function formatTimer(secs: number): string {
  const m = Math.floor(secs / 60);
  const s = secs % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export default function LogForm({ onLogged, filter }: { onLogged: () => void; filter?: string[] }) {
  const filteredTabs = filter ? TABS.filter((t) => filter.includes(t.key)) : TABS;
  const defaultTab = filteredTabs[0]?.key || 'thc';
  const [tab, setTab] = useState(defaultTab);
  const [amount, setAmount] = useState(DEFAULTS.thc.amount);
  const [intent, setIntent] = useState('');
  const [notes, setNotes] = useState('');
  const [details, setDetails] = useState<Record<string, unknown>>(DEFAULTS.thc.details);
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [doseWarning, setDoseWarning] = useState<{
    message: string;
    suggestions: number[];
    unit: string;
  } | null>(null);

  // Yoga timer state
  const [yogaTimerSecs, setYogaTimerSecs] = useState(180); // 3m default
  const [yogaTimerRunning, setYogaTimerRunning] = useState(false);
  const [yogaTimerRemaining, setYogaTimerRemaining] = useState(180);
  const [yogaSessionDone, setYogaSessionDone] = useState(false);
  const [yogaAnalysis, setYogaAnalysis] = useState<{
    ans_shift: string;
    effects: string[];
    summary: string;
    bio_before?: Record<string, number | null>;
    bio_after?: Record<string, number | null>;
  } | null>(null);
  const [yogaAnalyzing, setYogaAnalyzing] = useState(false);
  const yogaStartTime = useRef<string | null>(null);
  const timerInterval = useRef<ReturnType<typeof setInterval> | null>(null);

  // MIND analysis state (triggered after every log)
  const [mindAnalysis, setMindAnalysis] = useState<{
    substance: string;
    biometrics: Record<string, number | string | null> | null;
    active_substances: { substance: string; since_min: number; intensity: number; dose: number; unit: string; steady_state: boolean }[];
    interactions: { substances: string[]; severity: string; note: string }[];
    frequency: { today: number; avg_daily_7d: number; hours_since_last: number | null };
    dependency: { frequency_daily: number; count_30d: number; risk_class: string; warning?: string } | null;
    medical_flags: string[];
    insights: string[];
    recommendation: string;
    intent_category: string;
    period: string;
    body_model?: {
      bmi: number | null;
      weight_kg: number | null;
      height_cm: number | null;
      fitness_strengths: string[];
      fitness_weaknesses: string[];
      steps_percentile: number | null;
      sleep_percentile: number | null;
      floors_percentile: number | null;
      running_percentile: number | null;
    } | null;
  } | null>(null);
  const [mindAnalyzing, setMindAnalyzing] = useState(false);
  const [analysisCollapsed, setAnalysisCollapsed] = useState(false);

  // Yoga timer effect
  useEffect(() => {
    if (yogaTimerRunning && yogaTimerRemaining > 0) {
      timerInterval.current = setInterval(() => {
        setYogaTimerRemaining((prev) => {
          if (prev <= 1) {
            setYogaTimerRunning(false);
            setYogaSessionDone(true);
            if (timerInterval.current) clearInterval(timerInterval.current);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => {
        if (timerInterval.current) clearInterval(timerInterval.current);
      };
    }
  }, [yogaTimerRunning, yogaTimerRemaining]);

  const switchTab = useCallback((key: TabKey) => {
    setTab(key);
    setAmount(DEFAULTS[key].amount);
    setDetails({ ...DEFAULTS[key].details });
    setIntent('');
    setNotes('');
    setFeedback('');
    // Reset yoga state when switching tabs
    setYogaTimerRunning(false);
    setYogaSessionDone(false);
    setYogaAnalysis(null);
    setYogaTimerRemaining(180);
    setYogaTimerSecs(180);
    if (timerInterval.current) clearInterval(timerInterval.current);
  }, []);

  const submit = async (force = false) => {
    setSubmitting(true);
    setFeedback('');
    setDoseWarning(null);
    try {
      const unit = tab === 'ketamine'
        ? (details.form === 'spray' ? 'spray' : 'mg')
        : tab === 'cbd'
        ? (details.route === 'vaporized' ? 'chambers' : details.route === 'sublingual' ? 'gouttes' : 'comprimés')
        : DEFAULTS[tab]?.unit || 'mg';
      const body: Record<string, unknown> = {
        substance: tab,
        dose: { amount, unit, details },
        intent,
        notes,
      };
      if (force) body.force = true;
      const res = await fetch('/api/tracker/log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (res.ok) {
        setFeedback('Logged ✓');
        onLogged();
        setTimeout(() => setFeedback(''), 2000);

        // Yoga: trigger ANS analysis after logging
        if (tab === 'yoga' && yogaStartTime.current) {
          setYogaAnalyzing(true);
          try {
            const analyzeRes = await fetch('/api/tracker/yoga/analyze', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                start_time: yogaStartTime.current,
                duration_min: amount,
                style: details.style,
                flow: details.flow || false,
                comment: notes,
              }),
            });
            if (analyzeRes.ok) {
              const analysis = await analyzeRes.json();
              setYogaAnalysis(analysis);
            }
          } catch { /* silent */ }
          setYogaAnalyzing(false);
        }

        // MIND analysis: cross-reference all data sources
        setMindAnalyzing(true);
        setAnalysisCollapsed(false);
        try {
          const analyzeRes = await fetch('/api/tracker/log/analyze', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              substance: tab,
              dose: { amount, unit, details },
              intent,
              notes,
            }),
          });
          if (analyzeRes.ok) {
            const analysis = await analyzeRes.json();
            setMindAnalysis(analysis);
          }
        } catch { /* silent */ }
        setMindAnalyzing(false);

        setNotes('');
      } else if (res.status === 422) {
        const data = await res.json();
        if (data.warning?.type === 'aberrant_dose') {
          setDoseWarning(data.warning);
        } else {
          setFeedback(data.warning?.message || 'Validation error');
        }
      } else {
        const err = await res.json();
        setFeedback(err.error || 'Failed');
      }
    } catch {
      setFeedback('Network error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      submit();
    }
  };

  const currentTab = TABS.find((t) => t.key === tab)!;

  return (
    <div
      className="bg-zinc-900 border border-zinc-800 rounded-lg p-4"
      onKeyDown={handleKeyDown}
    >
      {/* Tabs */}
      <div className="flex gap-1 mb-4 flex-wrap">
        {filteredTabs.map((t) => (
          <button
            key={t.key}
            onClick={() => switchTab(t.key)}
            className={`px-3 py-1.5 rounded text-sm font-medium transition ${
              tab === t.key
                ? 'text-white'
                : 'text-zinc-500 hover:text-zinc-300'
            }`}
            style={tab === t.key ? { backgroundColor: t.color + '20', color: t.color } : {}}
          >
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      {/* Form fields */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Amount (hidden for yoga — timer sets it) */}
        {tab !== 'yoga' && (
          <div>
            <label className="text-xs text-zinc-500 block mb-1">
              Amount ({tab === 'ketamine' ? (details.form === 'spray' ? 'sprays' : 'mg estimate') : tab === 'cbd' ? (details.route === 'vaporized' ? 'chambers' : details.route === 'sublingual' ? 'gouttes' : 'comprimés') : DEFAULTS[tab].unit})
            </label>
            <input
              type="number"
              min={0}
              step={tab === 'hydration' ? 50 : tab === 'ketamine' && details.form !== 'spray' ? 5 : 1}
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="w-full bg-zinc-800 border border-zinc-700 rounded px-3 py-2 text-white font-mono text-sm focus:outline-none focus:border-zinc-500"
            />
          </div>
        )}

        {/* Substance-specific details */}
        {tab === 'thc' && (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-xs text-zinc-500 block mb-1">THC %</label>
                <input
                  type="number"
                  value={(details.strain_thc as number) || 22}
                  onChange={(e) => setDetails({ ...details, strain_thc: Number(e.target.value) })}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded px-3 py-2 text-white font-mono text-sm focus:outline-none focus:border-zinc-500"
                />
              </div>
              <div>
                <label className="text-xs text-zinc-500 block mb-1">Temp °C</label>
                <input
                  type="number"
                  value={(details.temp_c as number) || 230}
                  onChange={(e) => setDetails({ ...details, temp_c: Number(e.target.value) })}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded px-3 py-2 text-white font-mono text-sm focus:outline-none focus:border-zinc-500"
                />
              </div>
            </div>
            <div>
              <label className="text-xs text-zinc-500 block mb-1">Reaction</label>
              <div className="flex gap-1.5 flex-wrap">
                {VAPE_REACTIONS.map((r) => (
                  <button
                    key={r.key}
                    onClick={() => setDetails({ ...details, reaction: r.key })}
                    className={`px-2 py-1.5 rounded text-xs border transition ${
                      (details.reaction as string || 'clean') === r.key
                        ? 'border-green-500/50 text-green-400 bg-green-500/10'
                        : 'border-zinc-700 text-zinc-500 hover:text-zinc-300'
                    }`}
                  >
                    {r.icon} {r.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {tab === 'cbd' && (
          <div className="space-y-3">
            {/* Route toggle: Complexe / Sublingual / Vaporisé */}
            <div>
              <label className="text-xs text-zinc-500 block mb-1">Forme</label>
              <div className="flex gap-2">
                {([
                  { key: 'complex', label: '💊 Complexe', desc: 'Comprimé multi-composé' },
                  { key: 'sublingual', label: '💧 Sublingual', desc: 'Huile CBD' },
                  { key: 'vaporized', label: '🌿 Vaporisé 230°C', desc: 'Chambre' },
                ] as const).map((r) => (
                  <button
                    key={r.key}
                    onClick={() => {
                      if (r.key === 'complex') {
                        setDetails({ ...details, route: 'complex', form: 'tablet' });
                        setAmount(1);
                      } else if (r.key === 'sublingual') {
                        setDetails({ ...details, route: 'sublingual', cbd_pct: (details.cbd_pct as number) || 20 });
                        setAmount(5);
                      } else {
                        setDetails({ ...details, route: 'vaporized', cbd_pct: (details.cbd_pct as number) || 7, temp_c: 230 });
                        setAmount(1);
                      }
                    }}
                    className={`px-3 py-1.5 rounded text-sm border transition ${
                      details.route === r.key
                        ? 'border-lime-500/50 text-lime-400 bg-lime-500/10'
                        : 'border-zinc-700 text-zinc-500 hover:text-zinc-300'
                    }`}
                  >
                    {r.label}
                  </button>
                ))}
              </div>
            </div>

            {/* === COMPLEXE === */}
            {(details.route === 'complex' || !details.route) && (
              <>
                <div>
                  <label className="text-xs text-zinc-500 block mb-1">Nombre de comprimés</label>
                  <div className="flex flex-wrap gap-1.5">
                    {[1, 2, 3].map((count) => (
                      <button
                        key={count}
                        onClick={() => setAmount(count)}
                        className={`px-3 py-1.5 rounded text-sm border transition ${
                          amount === count
                            ? 'border-lime-500/50 text-lime-300 bg-lime-500/15'
                            : 'border-zinc-700 text-zinc-500 hover:text-zinc-300'
                        }`}
                      >
                        {count} comprimé{count > 1 ? 's' : ''}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="bg-zinc-800/50 border border-zinc-700/50 rounded-lg p-3">
                  <div className="text-xs text-zinc-400 mb-2 font-medium">
                    Composition par comprimé <span className="text-zinc-600">&times; {amount}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                    {[
                      { name: 'CBD isolat', mg: 45, color: 'text-lime-400' },
                      { name: 'Griffonia (5-HTP)', mg: 50.5, color: 'text-purple-400' },
                      { name: 'Rhodiola', mg: 30, color: 'text-rose-400' },
                      { name: 'Ashwagandha', mg: 280, color: 'text-amber-400' },
                      { name: 'Magnésium', mg: 117, color: 'text-blue-400', note: '31% AJR' },
                      { name: 'Vitamine B6', mg: 1.4, color: 'text-teal-400', note: '100% AJR' },
                    ].map((c) => (
                      <div key={c.name} className="flex items-center justify-between text-xs py-0.5">
                        <span className={c.color}>{c.name}</span>
                        <span className="text-zinc-500 font-mono">
                          {(c.mg * amount).toFixed(c.mg < 2 ? 1 : 0)} mg
                          {c.note && <span className="text-zinc-600 ml-1">({c.note})</span>}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    { label: 'Anxiolytique', color: 'border-lime-500/30 text-lime-400/70' },
                    { label: 'Adaptogène', color: 'border-amber-500/30 text-amber-400/70' },
                    { label: 'Sérotoninergique', color: 'border-purple-500/30 text-purple-400/70' },
                    { label: 'Sans THC', color: 'border-zinc-600 text-zinc-500' },
                  ].map((tag) => (
                    <span key={tag.label} className={`text-[10px] px-2 py-0.5 rounded-full border ${tag.color}`}>
                      {tag.label}
                    </span>
                  ))}
                </div>
              </>
            )}

            {/* === SUBLINGUAL === */}
            {details.route === 'sublingual' && (
              <>
                <div>
                  <label className="text-xs text-zinc-500 block mb-1">CBD %</label>
                  <div className="flex flex-wrap gap-1.5">
                    {[10, 20, 30, 40].map((pct) => (
                      <button
                        key={pct}
                        onClick={() => setDetails({ ...details, cbd_pct: pct })}
                        className={`px-2 py-1 rounded text-xs border transition ${
                          (details.cbd_pct as number) === pct
                            ? 'border-lime-500/50 text-lime-300 bg-lime-500/15'
                            : 'border-zinc-700 text-zinc-500 hover:text-zinc-300'
                        }`}
                      >
                        {pct}%
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-xs text-zinc-500 block mb-1">Gouttes</label>
                  <div className="flex flex-wrap gap-1.5 mb-2">
                    {[3, 5, 8, 10, 15].map((g) => (
                      <button
                        key={g}
                        onClick={() => setAmount(g)}
                        className={`px-2 py-1 rounded text-xs border transition ${
                          amount === g
                            ? 'border-lime-500/50 text-lime-300 bg-lime-500/15'
                            : 'border-zinc-700 text-zinc-500 hover:text-zinc-300'
                        }`}
                      >
                        {g} gttes
                      </button>
                    ))}
                  </div>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value))}
                    min={1}
                    className="w-full bg-zinc-800 border border-zinc-700 rounded px-3 py-2 text-white font-mono text-sm focus:outline-none focus:border-zinc-500"
                  />
                </div>
                <div className="text-[10px] text-zinc-600">
                  {amount} goutte{amount > 1 ? 's' : ''} &times; huile CBD {(details.cbd_pct as number) || 20}% — voie sublinguale
                </div>
              </>
            )}

            {/* === VAPORISÉ === */}
            {details.route === 'vaporized' && (
              <>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-xs text-zinc-500 block mb-1">CBD %</label>
                    <input
                      type="number"
                      value={(details.cbd_pct as number) || 7}
                      onChange={(e) => setDetails({ ...details, cbd_pct: Number(e.target.value) })}
                      min={1}
                      max={100}
                      className="w-full bg-zinc-800 border border-zinc-700 rounded px-3 py-2 text-white font-mono text-sm focus:outline-none focus:border-zinc-500"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-zinc-500 block mb-1">Temp °C</label>
                    <input
                      type="number"
                      value={(details.temp_c as number) || 230}
                      onChange={(e) => setDetails({ ...details, temp_c: Number(e.target.value) })}
                      className="w-full bg-zinc-800 border border-zinc-700 rounded px-3 py-2 text-white font-mono text-sm focus:outline-none focus:border-zinc-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-xs text-zinc-500 block mb-1">Chambers</label>
                  <div className="flex flex-wrap gap-1.5">
                    {[1, 2, 3].map((chambers) => (
                      <button
                        key={chambers}
                        onClick={() => setAmount(chambers)}
                        className={`px-2 py-1 rounded text-xs border transition ${
                          amount === chambers
                            ? 'border-lime-500/50 text-lime-300 bg-lime-500/15'
                            : 'border-zinc-700 text-zinc-500 hover:text-zinc-300'
                        }`}
                      >
                        {chambers} chamber{chambers > 1 ? 's' : ''} <span className="text-zinc-600">· {(details.cbd_pct as number) || 7}%</span>
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-xs text-zinc-500 block mb-1">Reaction</label>
                  <div className="flex gap-1.5 flex-wrap">
                    {VAPE_REACTIONS.map((r) => (
                      <button
                        key={r.key}
                        onClick={() => setDetails({ ...details, reaction: r.key })}
                        className={`px-2 py-1.5 rounded text-xs border transition ${
                          (details.reaction as string || 'clean') === r.key
                            ? 'border-lime-500/50 text-lime-400 bg-lime-500/10'
                            : 'border-zinc-700 text-zinc-500 hover:text-zinc-300'
                        }`}
                      >
                        {r.icon} {r.label}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {tab === 'lions_mane' && (
          <div>
            <label className="text-xs text-zinc-500 block mb-1">Quick dose (420mg/capsule)</label>
            <div className="flex flex-wrap gap-1.5">
              {[1, 2, 3, 4].map((caps) => {
                const mg = caps * 420;
                return (
                  <button
                    key={caps}
                    onClick={() => setAmount(mg)}
                    className={`px-2 py-1 rounded text-xs border transition ${
                      amount === mg
                        ? 'border-amber-600/50 text-amber-400 bg-amber-600/15'
                        : 'border-zinc-700 text-zinc-500 hover:text-zinc-300'
                    }`}
                  >
                    {caps} cap{caps > 1 ? 's' : ''} <span className="text-zinc-600">· {mg}mg</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {tab === 'caffeine' && (
          <div className="space-y-3">
            {/* Coffee variants */}
            <div>
              <label className="text-xs text-zinc-500 block mb-1">Variante</label>
              <div className="flex flex-wrap gap-1.5">
                {([
                  { key: 'espresso', label: 'Espresso', icon: '☕', mg: 75, shots: 1 },
                  { key: 'double', label: 'Double', icon: '☕', mg: 150, shots: 2 },
                  { key: 'triple', label: 'Triple', icon: '☕', mg: 225, shots: 3 },
                  { key: 'americano', label: 'Americano', icon: '🇺🇸', mg: 120 },
                  { key: 'cappuccino', label: 'Cappuccino', icon: '☁️', mg: 150 },
                  { key: 'latte', label: 'Latte', icon: '🥛', mg: 150 },
                  { key: 'moccachino', label: 'Moccachino', icon: '🍫', mg: 150 },
                  { key: 'caramel', label: 'Caramel Latte', icon: '🍮', mg: 150 },
                  { key: 'flat-white', label: 'Flat White', icon: '🤍', mg: 130 },
                  { key: 'cortado', label: 'Cortado', icon: '🫗', mg: 75 },
                  { key: 'noisette', label: 'Noisette', icon: '🌰', mg: 75 },
                  { key: 'italian', label: 'Italien', icon: '🇮🇹', mg: 100 },
                  { key: 'nitro', label: 'Nitro', icon: '🧊', mg: 215 },
                  { key: 'turkish', label: 'Turc', icon: '🫖', mg: 200 },
                  { key: 'vietnamese', label: 'Vietnamien', icon: '🇻🇳', mg: 200 },
                  { key: 'bonbon', label: 'Bonbon', icon: '🍬', mg: 160 },
                  { key: 'irish', label: 'Irish', icon: '🍀', mg: 80 },
                  { key: 'macchiato', label: 'Macchiato', icon: '🔘', mg: 75 },
                  { key: 'ristretto', label: 'Ristretto', icon: '⚡', mg: 65 },
                  { key: 'lungo', label: 'Lungo', icon: '💧', mg: 90 },
                ] as const).map((v) => (
                  <button
                    key={v.key}
                    onClick={() => {
                      setAmount(v.mg);
                      setDetails({ ...details, form: v.key, ...('shots' in v ? { shots: v.shots } : {}) });
                    }}
                    className={`px-2 py-1 rounded text-xs border transition ${
                      details.form === v.key
                        ? 'border-amber-500/50 text-amber-300 bg-amber-500/15'
                        : 'border-zinc-700 text-zinc-500 hover:text-zinc-300'
                    }`}
                  >
                    {v.icon} {v.label} <span className="text-zinc-600">· {v.mg}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Milk + Sugar */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-zinc-500 block mb-1">Lait</label>
                <div className="flex gap-2">
                  {[true, false].map((v) => (
                    <button
                      key={String(v)}
                      onClick={() => setDetails({ ...details, milk: v })}
                      className={`px-3 py-1.5 rounded text-sm border transition ${
                        details.milk === v
                          ? 'border-amber-500/50 text-amber-400 bg-amber-500/10'
                          : 'border-zinc-700 text-zinc-500 hover:text-zinc-300'
                      }`}
                    >
                      {v ? '🥛 Oui' : 'Non'}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-xs text-zinc-500 block mb-1">Sucre</label>
                <div className="flex items-center gap-1">
                  {/* Minus button */}
                  <button
                    onClick={() => setDetails({ ...details, sugar: Math.max(0, ((details.sugar as number) || 0) - 1) })}
                    className="w-7 h-7 rounded border border-zinc-700 text-zinc-500 hover:text-zinc-300 hover:border-zinc-600 flex items-center justify-center text-sm transition"
                  >
                    −
                  </button>
                  {/* Quick buttons */}
                  {[0, 1, 2, 3, 4].map((s) => (
                    <button
                      key={s}
                      onClick={() => setDetails({ ...details, sugar: s })}
                      className={`px-1.5 py-1 rounded text-xs border transition min-w-[28px] ${
                        (details.sugar as number) === s
                          ? 'border-amber-500/50 text-amber-400 bg-amber-500/10'
                          : 'border-zinc-700 text-zinc-500 hover:text-zinc-300'
                      }`}
                    >
                      {s === 0 ? '∅' : s}
                    </button>
                  ))}
                  {/* Plus button */}
                  <button
                    onClick={() => setDetails({ ...details, sugar: ((details.sugar as number) || 0) + 1 })}
                    className="w-7 h-7 rounded border border-zinc-700 text-zinc-500 hover:text-zinc-300 hover:border-zinc-600 flex items-center justify-center text-sm transition"
                  >
                    +
                  </button>
                  {/* Show current count when > 4 */}
                  {(details.sugar as number) > 4 && (
                    <span className="text-xs text-amber-400 font-mono ml-1">{details.sugar as number}</span>
                  )}
                </div>
              </div>
            </div>

            {/* Sugar type — only when sugar > 0 */}
            {(details.sugar as number) > 0 && (
              <div>
                <label className="text-xs text-zinc-500 block mb-1">Type de sucre</label>
                <div className="flex flex-wrap gap-1.5">
                  {([
                    { key: 'blanc', label: 'Blanc' },
                    { key: 'brun', label: 'Brun' },
                    { key: 'sucrette', label: 'Sucrette' },
                    { key: 'coco', label: 'Fleur de coco' },
                    { key: 'miel', label: 'Miel' },
                    { key: 'agave', label: 'Agave' },
                    { key: 'stevia', label: 'Stévia' },
                    { key: 'sirop', label: 'Sirop' },
                    { key: 'muscovado', label: 'Muscovado' },
                    { key: 'demerara', label: 'Demerara' },
                    { key: 'rapadura', label: 'Rapadura' },
                  ] as const).map((st) => (
                    <button
                      key={st.key}
                      onClick={() => setDetails({ ...details, sugarType: st.key })}
                      className={`px-2 py-1 rounded text-[11px] border transition ${
                        (details.sugarType || 'blanc') === st.key
                          ? 'border-amber-500/40 text-amber-400 bg-amber-500/10'
                          : 'border-zinc-800 text-zinc-600 hover:text-zinc-400 hover:border-zinc-700'
                      }`}
                    >
                      {st.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {tab === 'ketamine' && (
          <div className="space-y-3">
            {/* Form toggle: crystal vs spray */}
            <div>
              <label className="text-xs text-zinc-500 block mb-1">Form</label>
              <div className="flex gap-2">
                {(['crystal', 'spray'] as const).map((f) => (
                  <button
                    key={f}
                    onClick={() => {
                      const isCrystal = f === 'crystal';
                      setDetails({
                        ...details,
                        form: f,
                        route: 'intranasal',
                        estimate: isCrystal ? 'visual' : undefined,
                      });
                      if (isCrystal && amount < 5) setAmount(30);
                      if (!isCrystal && amount > 20) setAmount(3);
                    }}
                    className={`px-3 py-1.5 rounded text-sm border transition ${
                      details.form === f
                        ? 'border-purple-500/50 text-purple-400 bg-purple-500/10'
                        : 'border-zinc-700 text-zinc-500 hover:text-zinc-300'
                    }`}
                  >
                    {f === 'crystal' ? '💎 Crystal' : '🔬 Spray'}
                  </button>
                ))}
              </div>
            </div>

            {/* Crystal: quick presets */}
            {details.form === 'crystal' && (
              <div>
                <label className="text-xs text-zinc-500 block mb-1">Quick dose</label>
                <div className="flex flex-wrap gap-1.5">
                  {K_PRESETS.map((p) => (
                    <button
                      key={p.mg}
                      onClick={() => setAmount(p.mg)}
                      className={`px-2 py-1 rounded text-xs border transition ${
                        amount === p.mg
                          ? 'border-purple-500/50 text-purple-300 bg-purple-500/15'
                          : 'border-zinc-700 text-zinc-500 hover:text-zinc-300'
                      }`}
                    >
                      {p.mg}mg <span className="text-zinc-600">· {p.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Spray: mg/spray + total */}
            {details.form === 'spray' && (
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs text-zinc-500 block mb-1">mg/spray</label>
                  <input
                    type="number"
                    step={0.1}
                    value={(details.mg_per_spray as number) || 0}
                    onChange={(e) => {
                      const mgps = Number(e.target.value);
                      setDetails({ ...details, mg_per_spray: mgps, total_mg: mgps * amount });
                    }}
                    className="w-full bg-zinc-800 border border-zinc-700 rounded px-3 py-2 text-white font-mono text-sm focus:outline-none focus:border-zinc-500"
                  />
                </div>
                <div>
                  <label className="text-xs text-zinc-500 block mb-1">Total mg</label>
                  <div className="bg-zinc-800 border border-zinc-700 rounded px-3 py-2 text-purple-400 font-mono text-sm">
                    {((details.mg_per_spray as number) || 0) * amount || '—'}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {tab === 'lsd' && (
          <div className="space-y-3">
            {/* Dose presets */}
            <div>
              <label className="text-xs text-zinc-500 block mb-1">Quick dose</label>
              <div className="flex flex-wrap gap-1.5">
                {LSD_PRESETS.map((p) => (
                  <button
                    key={p.dose}
                    onClick={() => {
                      setAmount(p.dose);
                      setDetails({ ...details, ug_estimate: p.ug });
                    }}
                    className={`px-2 py-1 rounded text-xs border transition ${
                      amount === p.dose
                        ? 'border-pink-500/50 text-pink-300 bg-pink-500/15'
                        : 'border-zinc-700 text-zinc-500 hover:text-zinc-300'
                    }`}
                  >
                    {p.label} <span className="text-zinc-600">· ~{p.ug}ug</span>
                  </button>
                ))}
              </div>
            </div>

            {/* ug estimate */}
            <div>
              <label className="text-xs text-zinc-500 block mb-1">ug estimate</label>
              <input
                type="number"
                step={5}
                min={0}
                value={(details.ug_estimate as number) || 100}
                onChange={(e) => setDetails({ ...details, ug_estimate: Number(e.target.value) })}
                className="w-full bg-zinc-800 border border-zinc-700 rounded px-3 py-2 text-white font-mono text-sm focus:outline-none focus:border-zinc-500"
              />
            </div>
          </div>
        )}

        {tab === 'nicotine' && (
          <div className="space-y-3 sm:col-span-2">
            {/* Puffs quick selector */}
            <div>
              <label className="text-xs text-zinc-500 block mb-1">Puffs</label>
              <div className="flex gap-1.5">
                {[1, 2, 3, 4, 5].map((n) => (
                  <button
                    key={n}
                    onClick={() => setAmount(n)}
                    className={`px-3 py-1.5 rounded text-sm font-mono border transition ${
                      amount === n
                        ? 'border-amber-500/50 text-amber-400 bg-amber-500/10'
                        : 'border-zinc-700 text-zinc-500 hover:text-zinc-300'
                    }`}
                  >
                    {n}
                  </button>
                ))}
              </div>
            </div>
            {/* Row 1: Wattage + Resistance */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-zinc-500 block mb-1">Wattage (W)</label>
                <input
                  type="number"
                  min={1}
                  max={200}
                  step={0.5}
                  value={(details.wattage as number) ?? 22}
                  onChange={(e) => setDetails({ ...details, wattage: Number(e.target.value) })}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded px-3 py-2 text-white font-mono text-sm focus:outline-none focus:border-zinc-500"
                />
              </div>
              <div>
                <label className="text-xs text-zinc-500 block mb-1">Résistance (ohm)</label>
                <div className="flex gap-1.5 flex-wrap">
                  {RESISTANCE_OPTIONS.map((r) => (
                    <button
                      key={r}
                      onClick={() => setDetails({ ...details, resistance: r })}
                      className={`px-2.5 py-1.5 rounded text-xs font-mono border transition ${
                        (details.resistance as number) === r
                          ? 'border-amber-500/50 text-amber-400 bg-amber-500/10'
                          : 'border-zinc-700 text-zinc-500 hover:text-zinc-300'
                      }`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Row 2: Mode */}
            <div>
              <label className="text-xs text-zinc-500 block mb-1">Mode</label>
              <div className="flex gap-1.5 flex-wrap">
                {VAPE_MODES.map((m) => (
                  <button
                    key={m}
                    onClick={() => setDetails({ ...details, mode: m })}
                    className={`px-2.5 py-1.5 rounded text-xs border transition ${
                      details.mode === m
                        ? 'border-amber-500/50 text-amber-400 bg-amber-500/10'
                        : 'border-zinc-700 text-zinc-500 hover:text-zinc-300'
                    }`}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>

            {/* Row 3: Voltage + Puff duration (S) */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-zinc-500 block mb-1">Voltage (V)</label>
                <input
                  type="number"
                  min={0}
                  max={10}
                  step={0.1}
                  value={(details.voltage_v as number) ?? ''}
                  onChange={(e) => setDetails({ ...details, voltage_v: e.target.value ? Number(e.target.value) : null })}
                  placeholder="ex: 3.7"
                  className="w-full bg-zinc-800 border border-zinc-700 rounded px-3 py-2 text-white font-mono text-sm focus:outline-none focus:border-zinc-500 placeholder:text-zinc-600"
                />
              </div>
              <div>
                <label className="text-xs text-zinc-500 block mb-1">S (sec)</label>
                <input
                  type="number"
                  min={0}
                  max={30}
                  step={0.01}
                  value={(details.puff_duration_s as number) ?? ''}
                  onChange={(e) => setDetails({ ...details, puff_duration_s: e.target.value ? Number(e.target.value) : null })}
                  placeholder="ex: 1.25"
                  className="w-full bg-zinc-800 border border-zinc-700 rounded px-3 py-2 text-white font-mono text-sm focus:outline-none focus:border-zinc-500 placeholder:text-zinc-600"
                />
              </div>
            </div>

            {/* Row 4: Reaction */}
            <div>
              <label className="text-xs text-zinc-500 block mb-1">Reaction</label>
              <div className="flex gap-1.5 flex-wrap">
                {VAPE_REACTIONS.map((r) => (
                  <button
                    key={r.key}
                    onClick={() => setDetails({ ...details, reaction: r.key })}
                    className={`px-2 py-1.5 rounded text-xs border transition ${
                      (details.reaction as string || 'clean') === r.key
                        ? 'border-amber-500/50 text-amber-400 bg-amber-500/10'
                        : 'border-zinc-700 text-zinc-500 hover:text-zinc-300'
                    }`}
                  >
                    {r.icon} {r.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {tab === 'hydration' && (
          <div>
            <label className="text-xs text-zinc-500 block mb-1">Additives</label>
            <div className="flex flex-wrap gap-1.5">
              {ADDITIVES.map((a) => {
                const active = ((details.additives as string[]) || []).includes(a);
                return (
                  <button
                    key={a}
                    onClick={() => {
                      const current = (details.additives as string[]) || [];
                      setDetails({
                        ...details,
                        additives: active
                          ? current.filter((x) => x !== a)
                          : [...current, a],
                      });
                    }}
                    className={`px-2 py-1 rounded text-xs border transition ${
                      active
                        ? 'border-blue-500/50 text-blue-400 bg-blue-500/10'
                        : 'border-zinc-700 text-zinc-500 hover:text-zinc-300'
                    }`}
                  >
                    {a}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {tab === 'melatonin' && (
          <div>
            <label className="text-xs text-zinc-500 block mb-1">Form</label>
            <div className="flex gap-2">
              {(['tablet', 'gummy', 'liquid', 'spray'] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setDetails({ ...details, form: f })}
                  className={`px-3 py-1.5 rounded text-sm border transition ${
                    details.form === f
                      ? 'border-indigo-500/50 text-indigo-400 bg-indigo-500/10'
                      : 'border-zinc-700 text-zinc-500 hover:text-zinc-300'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>
        )}

        {tab === 'venlafaxine' && (
          <div>
            <label className="text-xs text-zinc-500 block mb-1">Release</label>
            <div className="flex gap-2">
              {(['extended', 'immediate'] as const).map((r) => (
                <button
                  key={r}
                  onClick={() => setDetails({ ...details, release: r })}
                  className={`px-3 py-1.5 rounded text-sm border transition ${
                    details.release === r
                      ? 'border-teal-500/50 text-teal-400 bg-teal-500/10'
                      : 'border-zinc-700 text-zinc-500 hover:text-zinc-300'
                  }`}
                >
                  {r === 'extended' ? 'LP (Extended)' : 'Immediate'}
                </button>
              ))}
            </div>
          </div>
        )}

        {tab === 'sertraline' && (
          <div>
            <label className="text-xs text-zinc-500 block mb-1">Quick dose</label>
            <div className="flex flex-wrap gap-1.5">
              {[50, 100, 150, 200].map((mg) => (
                <button
                  key={mg}
                  onClick={() => setAmount(mg)}
                  className={`px-2 py-1 rounded text-xs border transition ${
                    amount === mg
                      ? 'border-cyan-500/50 text-cyan-400 bg-cyan-500/15'
                      : 'border-zinc-700 text-zinc-500 hover:text-zinc-300'
                  }`}
                >
                  {mg}mg
                </button>
              ))}
            </div>
          </div>
        )}

        {tab === 'griffonia' && (
          <div>
            <label className="text-xs text-zinc-500 block mb-1">Quick dose (5-HTP)</label>
            <div className="flex flex-wrap gap-1.5">
              {[450, 900, 1800].map((mg) => (
                <button
                  key={mg}
                  onClick={() => setAmount(mg)}
                  className={`px-2 py-1 rounded text-xs border transition ${
                    amount === mg
                      ? 'border-purple-400/50 text-purple-400 bg-purple-400/15'
                      : 'border-zinc-700 text-zinc-500 hover:text-zinc-300'
                  }`}
                >
                  {mg}mg
                </button>
              ))}
            </div>
          </div>
        )}

        {tab === 'valeriane' && (
          <div>
            <label className="text-xs text-zinc-500 block mb-1">Quick dose</label>
            <div className="flex flex-wrap gap-1.5">
              {[100, 200, 300, 450, 600].map((mg) => (
                <button
                  key={mg}
                  onClick={() => setAmount(mg)}
                  className={`px-2 py-1 rounded text-xs border transition ${
                    amount === mg
                      ? 'border-lime-600/50 text-lime-500 bg-lime-600/15'
                      : 'border-zinc-700 text-zinc-500 hover:text-zinc-300'
                  }`}
                >
                  {mg}mg
                </button>
              ))}
            </div>
          </div>
        )}

        {tab === 'safran' && (
          <div>
            <label className="text-xs text-zinc-500 block mb-1">Quick dose</label>
            <div className="flex flex-wrap gap-1.5">
              {[500, 1000, 2000].map((mg) => (
                <button
                  key={mg}
                  onClick={() => setAmount(mg)}
                  className={`px-2 py-1 rounded text-xs border transition ${
                    amount === mg
                      ? 'border-orange-500/50 text-orange-400 bg-orange-500/15'
                      : 'border-zinc-700 text-zinc-500 hover:text-zinc-300'
                  }`}
                >
                  {mg}mg
                </button>
              ))}
            </div>
          </div>
        )}

        {tab === 'cyamemazine' && (
          <div>
            <label className="text-xs text-zinc-500 block mb-1">Quick dose</label>
            <div className="flex flex-wrap gap-1.5">
              {[12.5, 25, 50, 100].map((mg) => (
                <button
                  key={mg}
                  onClick={() => setAmount(mg)}
                  className={`px-2 py-1 rounded text-xs border transition ${
                    amount === mg
                      ? 'border-purple-600/50 text-purple-400 bg-purple-600/15'
                      : 'border-zinc-700 text-zinc-500 hover:text-zinc-300'
                  }`}
                >
                  {mg}mg
                </button>
              ))}
            </div>
          </div>
        )}

        {tab === 'prazepam' && (
          <div className="space-y-3">
            <div>
              <label className="text-xs text-zinc-500 block mb-1">Quick dose (gouttes sublinguales)</label>
              <div className="flex flex-wrap gap-1.5">
                {[5, 10, 15, 20, 30, 40].map((g) => (
                  <button
                    key={g}
                    onClick={() => setAmount(g)}
                    className={`px-2 py-1 rounded text-xs border transition ${
                      amount === g
                        ? 'border-slate-400/50 text-slate-300 bg-slate-500/10'
                        : 'border-zinc-700 text-zinc-500 hover:text-zinc-300'
                    }`}
                  >
                    {g} gttes
                  </button>
                ))}
              </div>
            </div>
            <div className="bg-zinc-800/50 border border-zinc-700/50 rounded-lg p-3">
              <div className="text-xs text-zinc-400 mb-1 font-medium">Lysanxia (prazepam) solution buvable</div>
              <div className="text-xs text-zinc-500">
                1 goutte = 1mg prazepam — voie sublinguale. Max: 40 gouttes/jour.
              </div>
            </div>
          </div>
        )}

        {tab === 'dynabiane' && (
          <div className="space-y-3">
            <div>
              <label className="text-xs text-zinc-500 block mb-1">Nombre de gélules</label>
              <div className="flex flex-wrap gap-1.5">
                {[1, 2].map((count) => (
                  <button
                    key={count}
                    onClick={() => setAmount(count)}
                    className={`px-3 py-1.5 rounded text-sm border transition ${
                      amount === count
                        ? 'border-emerald-500/50 text-emerald-300 bg-emerald-500/15'
                        : 'border-zinc-700 text-zinc-500 hover:text-zinc-300'
                    }`}
                  >
                    {count} gélule{count > 1 ? 's' : ''}
                  </button>
                ))}
              </div>
            </div>
            <div className="bg-zinc-800/50 border border-zinc-700/50 rounded-lg p-3">
              <div className="text-xs text-zinc-400 mb-1 font-medium">PiLeJe Dynabiane</div>
              <div className="text-xs text-zinc-500">
                Probiotique axe intestin-cerveau — soutien microbiote, humeur, immunité
              </div>
            </div>
          </div>
        )}

        {tab === 'omegabiane' && (
          <div className="space-y-3">
            <div>
              <label className="text-xs text-zinc-500 block mb-1">Nombre de gélules</label>
              <div className="flex flex-wrap gap-1.5">
                {[1, 2, 3].map((count) => (
                  <button
                    key={count}
                    onClick={() => setAmount(count)}
                    className={`px-3 py-1.5 rounded text-sm border transition ${
                      amount === count
                        ? 'border-sky-500/50 text-sky-300 bg-sky-500/15'
                        : 'border-zinc-700 text-zinc-500 hover:text-zinc-300'
                    }`}
                  >
                    {count} gélule{count > 1 ? 's' : ''}
                  </button>
                ))}
              </div>
            </div>
            <div className="bg-zinc-800/50 border border-zinc-700/50 rounded-lg p-3">
              <div className="text-xs text-zinc-400 mb-1 font-medium">PiLeJe Omegabiane EPA/DHA</div>
              <div className="text-xs text-zinc-500">
                Omega-3 haute concentration — neuroprotection, anti-inflammatoire, cardiovasculaire
              </div>
            </div>
          </div>
        )}

        {tab === 'yoga' && (
          <div className="space-y-4 sm:col-span-2">
            {/* Style selector */}
            <div>
              <label className="text-xs text-zinc-500 block mb-1.5">Style</label>
              <div className="flex flex-wrap gap-2">
                {YOGA_STYLES.map((s) => (
                  <button
                    key={s.key}
                    onClick={() => {
                      setDetails({ ...details, style: s.key, flow: s.hasFlow ? (details.flow ?? false) : undefined });
                    }}
                    className={`px-3 py-2 rounded-lg text-sm border transition ${
                      details.style === s.key
                        ? 'border-pink-500/50 text-pink-300 bg-pink-500/15'
                        : 'border-zinc-700 text-zinc-500 hover:text-zinc-300'
                    }`}
                  >
                    {s.icon} {s.label}
                  </button>
                ))}
              </div>
              {/* Flow sub-option for Vinyasa */}
              {details.style === 'vinyasa' && (
                <div className="mt-2">
                  <button
                    onClick={() => setDetails({ ...details, flow: !details.flow })}
                    className={`px-3 py-1.5 rounded text-xs border transition ${
                      details.flow
                        ? 'border-pink-500/40 text-pink-300 bg-pink-500/10'
                        : 'border-zinc-700 text-zinc-500 hover:text-zinc-300'
                    }`}
                  >
                    🌊 Flow continu {details.flow ? '✓' : ''}
                  </button>
                </div>
              )}
            </div>

            {/* Timer */}
            <div>
              <label className="text-xs text-zinc-500 block mb-1.5">Minuteur</label>

              {/* Preset buttons */}
              {!yogaTimerRunning && !yogaSessionDone && (
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {YOGA_TIMER_PRESETS.map((p) => (
                    <button
                      key={p.seconds}
                      onClick={() => {
                        setYogaTimerSecs(p.seconds);
                        setYogaTimerRemaining(p.seconds);
                        setAmount(Math.round(p.seconds / 60 * 10) / 10);
                      }}
                      className={`px-3 py-1.5 rounded text-sm border transition ${
                        yogaTimerSecs === p.seconds
                          ? 'border-pink-500/50 text-pink-300 bg-pink-500/15'
                          : 'border-zinc-700 text-zinc-500 hover:text-zinc-300'
                      }`}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              )}

              {/* Timer display */}
              <div className="flex items-center gap-4">
                <div className={`text-4xl font-mono font-bold tabular-nums ${
                  yogaTimerRunning ? 'text-pink-400' : yogaSessionDone ? 'text-green-400' : 'text-zinc-300'
                }`}>
                  {formatTimer(yogaTimerRemaining)}
                </div>

                {!yogaTimerRunning && !yogaSessionDone && (
                  <button
                    onClick={() => {
                      yogaStartTime.current = new Date().toISOString();
                      setYogaTimerRunning(true);
                      setYogaSessionDone(false);
                      setYogaAnalysis(null);
                    }}
                    className="px-5 py-2.5 rounded-lg text-sm font-medium border border-pink-500/40 text-pink-400 bg-pink-500/10 hover:bg-pink-500/20 transition"
                  >
                    Démarrer
                  </button>
                )}

                {yogaTimerRunning && (
                  <button
                    onClick={() => {
                      setYogaTimerRunning(false);
                      if (timerInterval.current) clearInterval(timerInterval.current);
                      const elapsed = yogaTimerSecs - yogaTimerRemaining;
                      setAmount(Math.round(elapsed / 60 * 10) / 10);
                      setYogaSessionDone(true);
                    }}
                    className="px-5 py-2.5 rounded-lg text-sm font-medium border border-amber-500/40 text-amber-400 bg-amber-500/10 hover:bg-amber-500/20 transition"
                  >
                    Terminer
                  </button>
                )}

                {yogaSessionDone && (
                  <div className="flex items-center gap-2">
                    <span className="text-green-400 text-sm font-medium">Session terminée</span>
                    <button
                      onClick={() => {
                        setYogaSessionDone(false);
                        setYogaTimerRemaining(yogaTimerSecs);
                        setYogaAnalysis(null);
                        setAmount(DEFAULTS.yoga.amount);
                      }}
                      className="text-xs text-zinc-500 hover:text-zinc-300 transition underline"
                    >
                      Reset
                    </button>
                  </div>
                )}
              </div>

              {/* Progress bar */}
              {(yogaTimerRunning || yogaSessionDone) && (
                <div className="mt-2 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-1000"
                    style={{
                      width: `${((yogaTimerSecs - yogaTimerRemaining) / yogaTimerSecs) * 100}%`,
                      backgroundColor: yogaSessionDone ? '#22c55e' : '#f472b6',
                    }}
                  />
                </div>
              )}
            </div>

            {/* Comment for MIND analysis */}
            <div>
              <label className="text-xs text-zinc-500 block mb-1">
                Commentaire <span className="text-zinc-600">(analysé par MIND)</span>
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Comment tu te sens ? Tensions, douleurs, respiration..."
                rows={2}
                className="w-full bg-zinc-800 border border-zinc-700 rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-zinc-500 placeholder:text-zinc-600 resize-none"
              />
            </div>

            {/* ANS Analysis results */}
            {yogaAnalyzing && (
              <div className="bg-zinc-800/50 border border-zinc-700/50 rounded-lg p-4 text-center">
                <div className="text-pink-400 text-sm animate-pulse">Analyse biométrique en cours...</div>
              </div>
            )}
            {yogaAnalysis && (
              <div className="bg-zinc-800/50 border border-zinc-700/50 rounded-lg p-4 space-y-2">
                <div className="flex items-center gap-2 mb-2">
                  <span className={`text-sm font-medium ${
                    yogaAnalysis.ans_shift === 'parasympathique' ? 'text-green-400' :
                    yogaAnalysis.ans_shift === 'sympathique' ? 'text-amber-400' : 'text-zinc-400'
                  }`}>
                    {yogaAnalysis.ans_shift === 'parasympathique' ? '🧘 Parasympathique' :
                     yogaAnalysis.ans_shift === 'sympathique' ? '⚡ Sympathique' : '⚖️ Neutre'}
                  </span>
                </div>
                {yogaAnalysis.effects.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {yogaAnalysis.effects.map((e, i) => (
                      <span key={i} className="text-[10px] px-2 py-0.5 rounded-full border border-pink-500/30 text-pink-400/70">
                        {e}
                      </span>
                    ))}
                  </div>
                )}
                <div className="text-xs text-zinc-400">{yogaAnalysis.summary}</div>
                {/* Bio before/after comparison */}
                {yogaAnalysis.bio_before && yogaAnalysis.bio_after && (
                  <div className="grid grid-cols-2 gap-2 text-xs mt-2">
                    <div className="text-zinc-500">
                      <div className="font-medium mb-1">Avant</div>
                      {yogaAnalysis.bio_before.hr != null && <div>HR: {yogaAnalysis.bio_before.hr}</div>}
                      {yogaAnalysis.bio_before.stress != null && <div>Stress: {yogaAnalysis.bio_before.stress}</div>}
                      {yogaAnalysis.bio_before.body_battery != null && <div>BB: {yogaAnalysis.bio_before.body_battery}</div>}
                    </div>
                    <div className="text-zinc-400">
                      <div className="font-medium mb-1">Après</div>
                      {yogaAnalysis.bio_after.hr != null && <div>HR: {yogaAnalysis.bio_after.hr}</div>}
                      {yogaAnalysis.bio_after.stress != null && <div>Stress: {yogaAnalysis.bio_after.stress}</div>}
                      {yogaAnalysis.bio_after.body_battery != null && <div>BB: {yogaAnalysis.bio_after.body_battery}</div>}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Intent pills */}
      <div className="mt-4">
        <label className="text-xs text-zinc-500 block mb-1.5">Intent</label>
        <div className="flex flex-wrap gap-1.5">
          {INTENTS[tab].map((i) => (
            <button
              key={i}
              onClick={() => setIntent(intent === i ? '' : i)}
              className={`px-2.5 py-1 rounded-full text-xs border transition ${
                intent === i
                  ? 'text-white'
                  : 'border-zinc-700 text-zinc-500 hover:text-zinc-300'
              }`}
              style={
                intent === i
                  ? { borderColor: currentTab.color + '60', color: currentTab.color, backgroundColor: currentTab.color + '15' }
                  : {}
              }
            >
              {i}
            </button>
          ))}
        </div>
      </div>

      {/* Notes + submit */}
      <div className="mt-4 flex gap-3 items-end">
        {tab !== 'yoga' && (
          <div className="flex-1">
            <label className="text-xs text-zinc-500 block mb-1">Notes</label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Optional..."
              className="w-full bg-zinc-800 border border-zinc-700 rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-zinc-500 placeholder:text-zinc-600"
            />
          </div>
        )}
        {tab === 'yoga' && <div className="flex-1" />}
        <button
          onClick={() => submit()}
          disabled={submitting || amount <= 0 || (tab === 'yoga' && yogaTimerRunning)}
          className="px-5 py-2 rounded font-medium text-sm transition disabled:opacity-40"
          style={{ backgroundColor: currentTab.color, color: '#000' }}
        >
          {submitting ? '...' : tab === 'yoga' ? 'Log session' : 'Log'}
        </button>
      </div>

      {/* Aberrant dose warning */}
      {doseWarning && (
        <div className="mt-3 border border-amber-500/30 bg-amber-500/5 rounded-lg p-3 space-y-2">
          <div className="text-sm text-amber-400">{doseWarning.message}</div>
          <div className="flex flex-wrap gap-2">
            {doseWarning.suggestions.map((s) => (
              <button
                key={s}
                onClick={() => {
                  setAmount(s);
                  setDoseWarning(null);
                }}
                className="px-3 py-1.5 rounded text-sm font-medium border border-amber-500/40 text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 transition"
              >
                Ah si, {s} {doseWarning.unit}
              </button>
            ))}
            <button
              onClick={() => submit(true)}
              className="px-3 py-1.5 rounded text-sm border border-zinc-700 text-zinc-400 hover:text-zinc-200 transition"
            >
              Non, {amount} {doseWarning.unit} c&apos;est correct
            </button>
          </div>
        </div>
      )}

      {feedback && (
        <div className="mt-2 text-xs text-zinc-400">{feedback}</div>
      )}

      {/* MIND Analysis Card */}
      {mindAnalyzing && (
        <div className="mt-4 border border-zinc-700/50 bg-zinc-800/30 rounded-lg p-4 text-center">
          <div className="text-sm text-zinc-400 animate-pulse">Analyse MIND en cours...</div>
        </div>
      )}
      {mindAnalysis && !mindAnalyzing && (
        <div className="mt-4 border border-zinc-700/50 bg-zinc-800/30 rounded-lg overflow-hidden">
          {/* Header — always visible */}
          <button
            onClick={() => setAnalysisCollapsed(!analysisCollapsed)}
            className="w-full flex items-center justify-between px-4 py-3 hover:bg-zinc-800/50 transition text-left"
          >
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-zinc-500">MIND</span>
              <span className="text-sm text-zinc-300">
                {mindAnalysis.insights[0] || 'Analyse complète'}
              </span>
            </div>
            <span className="text-zinc-600 text-xs">{analysisCollapsed ? '▸' : '▾'}</span>
          </button>

          {!analysisCollapsed && (
            <div className="px-4 pb-4 space-y-3 border-t border-zinc-800">
              {/* Biometric snapshot */}
              {mindAnalysis.biometrics && (
                <div className="flex flex-wrap gap-3 pt-3 text-xs">
                  {mindAnalysis.biometrics.hr != null && (
                    <span className="text-zinc-400">♡ {mindAnalysis.biometrics.hr} bpm</span>
                  )}
                  {mindAnalysis.biometrics.stress != null && (
                    <span className={`${Number(mindAnalysis.biometrics.stress) > 60 ? 'text-amber-400' : 'text-zinc-400'}`}>
                      σ {mindAnalysis.biometrics.stress}
                    </span>
                  )}
                  {mindAnalysis.biometrics.body_battery != null && (
                    <span className={`${Number(mindAnalysis.biometrics.body_battery) < 25 ? 'text-red-400' : 'text-zinc-400'}`}>
                      ⚡ {mindAnalysis.biometrics.body_battery}
                    </span>
                  )}
                  {mindAnalysis.biometrics.ans_mode && mindAnalysis.biometrics.ans_mode !== 'unknown' && (
                    <span className="text-zinc-500">ANS: {mindAnalysis.biometrics.ans_mode}</span>
                  )}
                </div>
              )}

              {/* Frequency context */}
              <div className="flex flex-wrap gap-3 text-xs text-zinc-500">
                <span>{mindAnalysis.frequency.today}x aujourd&apos;hui</span>
                <span>moy. {mindAnalysis.frequency.avg_daily_7d}/j</span>
                {mindAnalysis.frequency.hours_since_last != null && (
                  <span>dernière : il y a {mindAnalysis.frequency.hours_since_last < 1
                    ? `${Math.round(mindAnalysis.frequency.hours_since_last * 60)}min`
                    : `${mindAnalysis.frequency.hours_since_last.toFixed(1)}h`}
                  </span>
                )}
                <span className="text-zinc-600">{mindAnalysis.period} · {mindAnalysis.intent_category}</span>
              </div>

              {/* Active substances */}
              {mindAnalysis.active_substances.length > 0 && (
                <div>
                  <div className="text-[10px] text-zinc-600 uppercase tracking-wider mb-1">Substances actives</div>
                  <div className="flex flex-wrap gap-1.5">
                    {mindAnalysis.active_substances.map((a) => (
                      <span
                        key={a.substance}
                        className="text-[11px] px-2 py-0.5 rounded-full border border-zinc-700 text-zinc-400"
                        style={{ opacity: 0.4 + a.intensity * 0.6 }}
                      >
                        {a.substance} {a.since_min}min {Math.round(a.intensity * 100)}%
                        {a.steady_state && ' ∞'}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Interactions */}
              {mindAnalysis.interactions.length > 0 && (
                <div className="space-y-1">
                  {mindAnalysis.interactions.map((ix, i) => (
                    <div
                      key={i}
                      className={`text-xs px-3 py-1.5 rounded border ${
                        ix.severity === 'high'
                          ? 'border-red-500/30 bg-red-500/5 text-red-400'
                          : ix.severity === 'moderate'
                          ? 'border-amber-500/30 bg-amber-500/5 text-amber-400'
                          : 'border-zinc-700 text-zinc-400'
                      }`}
                    >
                      {ix.note}
                    </div>
                  ))}
                </div>
              )}

              {/* Insights */}
              {mindAnalysis.insights.length > 1 && (
                <div className="space-y-1 pt-1">
                  {mindAnalysis.insights.slice(1).map((insight, i) => (
                    <div key={i} className="text-xs text-zinc-400 flex gap-2">
                      <span className="text-zinc-600 shrink-0">·</span>
                      {insight}
                    </div>
                  ))}
                </div>
              )}

              {/* Dependency flag */}
              {mindAnalysis.dependency?.warning && (
                <div className="text-xs px-3 py-1.5 rounded border border-amber-500/20 bg-amber-500/5 text-amber-400/80">
                  {mindAnalysis.dependency.warning}
                  {mindAnalysis.dependency.risk_class !== 'none' && (
                    <span className="text-zinc-600 ml-2">({mindAnalysis.dependency.risk_class})</span>
                  )}
                </div>
              )}

              {/* Medical flags */}
              {mindAnalysis.medical_flags.length > 0 && (
                <div className="space-y-1">
                  {mindAnalysis.medical_flags.map((flag, i) => (
                    <div key={i} className="text-xs text-teal-400/70 flex gap-2">
                      <span className="shrink-0">🏥</span>
                      {flag}
                    </div>
                  ))}
                </div>
              )}

              {/* Body model */}
              {mindAnalysis.body_model && (
                <div className="flex flex-wrap gap-2 text-[10px]">
                  {mindAnalysis.body_model.bmi && (
                    <span className="px-2 py-0.5 rounded border border-zinc-700 text-zinc-500">
                      IMC {mindAnalysis.body_model.bmi}
                    </span>
                  )}
                  {mindAnalysis.body_model.steps_percentile != null && (
                    <span className={`px-2 py-0.5 rounded border ${
                      mindAnalysis.body_model.steps_percentile < 40
                        ? 'border-amber-500/30 text-amber-400/70'
                        : 'border-zinc-700 text-zinc-500'
                    }`}>
                      Pas P{mindAnalysis.body_model.steps_percentile}
                    </span>
                  )}
                  {mindAnalysis.body_model.floors_percentile != null && (
                    <span className={`px-2 py-0.5 rounded border ${
                      mindAnalysis.body_model.floors_percentile > 60
                        ? 'border-green-500/30 text-green-400/70'
                        : 'border-zinc-700 text-zinc-500'
                    }`}>
                      Etages P{mindAnalysis.body_model.floors_percentile}
                    </span>
                  )}
                  {mindAnalysis.body_model.sleep_percentile != null && (
                    <span className="px-2 py-0.5 rounded border border-indigo-500/30 text-indigo-400/70">
                      Sommeil P{mindAnalysis.body_model.sleep_percentile}
                    </span>
                  )}
                  {mindAnalysis.body_model.running_percentile != null && (
                    <span className="px-2 py-0.5 rounded border border-zinc-700 text-zinc-500">
                      Course P{mindAnalysis.body_model.running_percentile}
                    </span>
                  )}
                </div>
              )}

              {/* Recommendation */}
              {mindAnalysis.recommendation && (
                <div className="text-xs text-zinc-300 bg-zinc-800/80 rounded px-3 py-2 border border-zinc-700/50">
                  {mindAnalysis.recommendation}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      <div className="mt-2 text-xs text-zinc-600">Ctrl+Enter to submit</div>
    </div>
  );
}
