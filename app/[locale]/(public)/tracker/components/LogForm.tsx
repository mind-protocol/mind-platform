'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import SubstanceFields, { NICOTINE_FORMS } from './SubstanceFields';
import YogaSection, { type YogaAnalysis } from './YogaSection';

const TABS = [
  { key: 'nicotine', label: 'Nicotine', color: '#f59e0b', icon: '💨' },
  { key: 'caffeine', label: 'Caffeine', color: '#d97706', icon: '☕' },
  { key: 'thc', label: 'THC', color: '#22c55e', icon: '🌿' },
  { key: 'hashish', label: 'Shit', color: '#854d0e', icon: '🪴' },
  { key: 'cbd', label: 'CBD Complex', color: '#84cc16', icon: '🌱' },
  { key: 'cbd_joint', label: 'Joint CBD', color: '#a3e635', icon: '💨' },
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
  { key: 'vitamine_c', label: 'Vitamine C', color: '#fb923c', icon: '🍊' },
  { key: 'cocaine', label: 'Cocaïne', color: '#e2e8f0', icon: '⚠️' },
  { key: 'mmc', label: 'MMC', color: '#22d3ee', icon: '⚠️' },
  { key: 'heroine', label: 'Héroïne', color: '#78350f', icon: '🚨' },
  { key: 'alcohol', label: 'Alcool', color: '#dc2626', icon: '🍷' },
] as const;

type TabKey = (typeof TABS)[number]['key'];

const INTENTS: Record<string, string[]> = {
  thc: ['focus', 'relax', 'creative', 'sleep', 'social'],
  hashish: ['relax', 'social', 'creative', 'sleep', 'détente'],
  cbd: ['relax', 'anxiety', 'sleep', 'recovery', 'adaptogenic', 'serotonin-support'],
  cbd_joint: ['relax', 'anxiety', 'sleep', 'détente', 'rituel-soir'],
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
  vitamine_c: ['daily', 'immunity', 'recovery', 'antioxidant', 'cold-prevention'],
  cocaine: ['stimulation', 'social', 'work', 'craving'],
  mmc: ['stimulation', 'social', 'craving'],
  heroine: ['pain', 'craving', 'withdrawal'],
  alcohol: ['social', 'apéro', 'repas', 'fête', 'détente', 'dégustation', 'nightlife'],
};

const DEFAULTS: Record<string, { amount: number; unit: string; details: Record<string, unknown> }> = {
  thc: { amount: 1, unit: 'chamber', details: { strain_thc: 22, temp_c: 230, reaction: 'clean' } },
  hashish: { amount: 0.3, unit: 'g', details: { form: 'joint', thc_pct: 15, mix: 'tabac', reaction: 'clean' } },
  cbd: { amount: 1, unit: 'comprimé', details: { route: 'complex', form: 'tablet', reaction: 'clean' } },
  cbd_joint: { amount: 1, unit: 'joint', details: { form: 'pré-roulé', cbd_pct: 15, brand: '', reaction: 'clean' } },
  lions_mane: { amount: 420, unit: 'mg', details: { form: 'capsule', mg_per_capsule: 420 } },
  caffeine: { amount: 150, unit: 'mg', details: { form: 'double', shots: 2, milk: true, sugar: 1, sugarType: 'blanc' } },
  ketamine: { amount: 1, unit: 'ml', details: { form: 'liquid', route: 'oral', crystal_mg: 1000, water_ml: 10 } },
  lsd: { amount: 0.5, unit: 'carton', details: { form: 'carton', ug_estimate: 100 } },
  nicotine: { amount: 3, unit: 'puffs', details: { form: 'vape', strength_pct: 20, mode: 'POWER', wattage: 22, resistance: 1.2, voltage_v: null, puff_duration_s: null, reaction: 'clean' } },
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
  vitamine_c: { amount: 120, unit: 'mg', details: { form: 'pilule à croquer' } },
  cocaine: { amount: 50, unit: 'mg', details: { form: 'insufflation (ligne)' } },
  mmc: { amount: 100, unit: 'mg', details: { form: 'insufflation' } },
  heroine: { amount: 30, unit: 'mg', details: { form: 'insufflation' } },
  alcohol: { amount: 1, unit: 'verres', details: { form: 'bière', abv: 5 } },
};

export default function LogForm({ onLogged, filter }: { onLogged: () => void; filter?: string[] }) {
  const t = useTranslations('Tracker');
  const filteredTabs = filter ? TABS.filter((tab) => filter.includes(tab.key)) : TABS;
  const defaultTab = filteredTabs[0]?.key || 'thc';
  const [tab, setTab] = useState(defaultTab);
  const [amount, setAmount] = useState(DEFAULTS.thc.amount);
  const [intent, setIntent] = useState('');
  const [notes, setNotes] = useState('');
  const [details, setDetails] = useState<Record<string, unknown>>(DEFAULTS.thc.details);
  const [showKCalc, setShowKCalc] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [doseWarning, setDoseWarning] = useState<{
    message: string;
    suggestions: number[];
    unit: string;
  } | null>(null);

  // Past clock state
  const [pastMode, setPastMode] = useState(false);
  const [pastDateTime, setPastDateTime] = useState('');

  // Yoga timer state
  const [yogaTimerSecs, setYogaTimerSecs] = useState(180);
  const [yogaTimerRunning, setYogaTimerRunning] = useState(false);
  const [yogaTimerRemaining, setYogaTimerRemaining] = useState(180);
  const [yogaSessionDone, setYogaSessionDone] = useState(false);
  const [yogaAnalysis, setYogaAnalysis] = useState<YogaAnalysis | null>(null);
  const [yogaAnalyzing, setYogaAnalyzing] = useState(false);
  const yogaStartTime = useRef<string | null>(null);
  const timerInterval = useRef<ReturnType<typeof setInterval> | null>(null);

  // MIND analysis state
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
    if (!yogaTimerRunning || yogaTimerRemaining <= 0) return;
    const interval = setInterval(() => {
      setYogaTimerRemaining((prev) => {
        if (prev <= 1) {
          setYogaTimerRunning(false);
          setYogaSessionDone(true);
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    timerInterval.current = interval;
    return () => clearInterval(interval);
  }, [yogaTimerRunning, yogaTimerRemaining]);

  const switchTab = useCallback((key: TabKey) => {
    setTab(key);
    setAmount(DEFAULTS[key].amount);
    setDetails({ ...DEFAULTS[key].details });
    setIntent('');
    setNotes('');
    setFeedback('');
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
        ? (details.form === 'liquid' ? 'ml' : details.form === 'spray' ? 'spray' : 'mg')
        : tab === 'cbd'
        ? (details.route === 'vaporized' ? 'chambers' : details.route === 'sublingual' ? 'gouttes' : 'comprimés')
        : tab === 'nicotine'
        ? (NICOTINE_FORMS.find((f) => f.key === (details.form as string))?.unit || 'puffs')
        : DEFAULTS[tab]?.unit || 'mg';
      const body: Record<string, unknown> = {
        substance: tab,
        dose: { amount, unit, details },
        intent,
        notes,
      };
      if (force) body.force = true;
      if (pastMode && pastDateTime) body.ts = new Date(pastDateTime).toISOString();
      const res = await fetch('/api/tracker/log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (res.ok) {
        const fb = pastMode && pastDateTime
          ? `${t('loggedAt')} ${new Date(pastDateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
          : t('logged');
        setFeedback(fb);
        setPastMode(false);
        setPastDateTime('');
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
          } catch { /* analysis optional */ }
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
        const data = await res.json().catch(() => null);
        if (data?.warning?.type === 'aberrant_dose') {
          setDoseWarning(data.warning);
        } else {
          setFeedback(data?.warning?.message || 'Validation error');
        }
      } else {
        const err = await res.json().catch(() => null);
        setFeedback(err?.error || t('failed'));
      }
    } catch {
      setFeedback(t('networkError'));
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

  const currentTab = TABS.find((t) => t.key === tab) ?? TABS[0];

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
              Amount ({tab === 'ketamine' ? (details.form === 'liquid' ? 'ml' : details.form === 'spray' ? 'sprays' : 'mg estimate') : tab === 'cbd' ? (details.route === 'vaporized' ? 'chambers' : details.route === 'sublingual' ? 'gouttes' : 'comprimés') : tab === 'nicotine' ? (NICOTINE_FORMS.find((f) => f.key === (details.form as string))?.unit || 'puffs') : DEFAULTS[tab].unit})
            </label>
            <input
              type="number"
              min={0}
              step={tab === 'hydration' ? 50 : tab === 'ketamine' ? (details.form === 'liquid' ? 1 : details.form === 'spray' ? 1 : 5) : 1}
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="w-full bg-zinc-800 border border-zinc-700 rounded px-3 py-2 text-white font-mono text-sm focus:outline-none focus:border-zinc-500"
            />
          </div>
        )}

        {/* Substance-specific details (extracted component) */}
        <SubstanceFields
          tab={tab}
          amount={amount}
          setAmount={setAmount}
          details={details}
          setDetails={setDetails}
          showKCalc={showKCalc}
          setShowKCalc={setShowKCalc}
          setIntent={setIntent}
        />

        {/* Yoga section (extracted component) */}
        {tab === 'yoga' && (
          <YogaSection
            details={details}
            setDetails={setDetails}
            notes={notes}
            setNotes={setNotes}
            amount={amount}
            setAmount={setAmount}
            yogaTimerSecs={yogaTimerSecs}
            setYogaTimerSecs={setYogaTimerSecs}
            yogaTimerRunning={yogaTimerRunning}
            setYogaTimerRunning={setYogaTimerRunning}
            yogaTimerRemaining={yogaTimerRemaining}
            setYogaTimerRemaining={setYogaTimerRemaining}
            yogaSessionDone={yogaSessionDone}
            setYogaSessionDone={setYogaSessionDone}
            yogaAnalysis={yogaAnalysis}
            setYogaAnalysis={setYogaAnalysis}
            yogaAnalyzing={yogaAnalyzing}
            yogaStartTime={yogaStartTime}
            timerInterval={timerInterval}
            defaultAmount={DEFAULTS.yoga.amount}
          />
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

      {/* Past clock toggle */}
      <div className="mt-3 flex items-center gap-2 flex-wrap">
        <button
          type="button"
          onClick={() => {
            const next = !pastMode;
            setPastMode(next);
            if (next) {
              const d = new Date();
              d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
              setPastDateTime(d.toISOString().slice(0, 16));
            } else {
              setPastDateTime('');
            }
          }}
          className={`px-3 py-1.5 rounded text-sm border transition flex items-center gap-1.5 ${
            pastMode
              ? 'border-amber-500/50 bg-amber-500/10 text-amber-400'
              : 'border-zinc-700 text-zinc-500 hover:text-zinc-300'
          }`}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {t('pastClock')}
        </button>
        {pastMode && (
          <input
            type="datetime-local"
            value={pastDateTime}
            onChange={(e) => setPastDateTime(e.target.value)}
            className="bg-zinc-800 border border-zinc-700 rounded px-3 py-1.5 text-white text-sm focus:outline-none focus:border-amber-500/50"
          />
        )}
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
