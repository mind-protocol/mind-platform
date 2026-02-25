'use client';

import { useState } from 'react';
import { SUBSTANCE_KEYS, SUBSTANCE_CONFIG, DOSE_RANGES, type SubstanceKey } from '@/lib/tracker/constants';

const INTENTS: Record<SubstanceKey, string[]> = {
  thc: ['focus', 'relax', 'creative', 'sleep', 'social'],
  cbd: ['relax', 'pain', 'sleep', 'anxiety', 'recovery'],
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
  vitamine_c: ['daily', 'immunity', 'recovery', 'morning', 'pre-workout'],
  cocaine: ['social', 'energy', 'focus'],
  mmc: ['social', 'empathy', 'energy'],
  heroine: ['pain', 'sedation', 'withdrawal-management'],
};

interface ScheduleDoseFormProps {
  defaults?: {
    substance?: SubstanceKey;
    ts?: string;
    dose?: { amount: number; unit: string; details?: Record<string, unknown> };
    intent?: string;
    source?: string;
  };
  onSchedule: (data: {
    substance: string;
    ts_scheduled: string;
    dose: { amount: number; unit: string; details: Record<string, unknown> };
    intent: string;
    source: string;
    notes: string;
  }) => Promise<void>;
  onClose: () => void;
}

export default function ScheduleDoseForm({ defaults, onSchedule, onClose }: ScheduleDoseFormProps) {
  const [substance, setSubstance] = useState<SubstanceKey>(defaults?.substance || 'hydration');
  const [amount, setAmount] = useState(defaults?.dose?.amount || DOSE_RANGES[defaults?.substance || 'hydration']?.min || 1);
  const [intent, setIntent] = useState(defaults?.intent || '');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Default to next 30-min boundary
  const defaultTs = defaults?.ts || (() => {
    const d = new Date();
    d.setMinutes(Math.ceil(d.getMinutes() / 30) * 30, 0, 0);
    if (d.getTime() <= Date.now()) d.setMinutes(d.getMinutes() + 30);
    return d.toISOString().slice(0, 16);
  })();

  const [dateTime, setDateTime] = useState(() => {
    const d = new Date(defaultTs);
    // Format for datetime-local input (YYYY-MM-DDTHH:MM)
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const hours = String(d.getHours()).padStart(2, '0');
    const mins = String(d.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${mins}`;
  });

  const cfg = SUBSTANCE_CONFIG[substance];
  const range = DOSE_RANGES[substance];

  const handleSubstanceChange = (key: SubstanceKey) => {
    setSubstance(key);
    setAmount(DOSE_RANGES[key]?.min || 1);
    setIntent('');
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    const ts = new Date(dateTime).toISOString();
    await onSchedule({
      substance,
      ts_scheduled: ts,
      dose: { amount, unit: cfg.unit, details: {} },
      intent,
      source: defaults?.source || 'manual',
      notes,
    });
    setSubmitting(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div
        className="bg-zinc-900 border border-zinc-700 rounded-xl p-5 w-full max-w-md mx-4 shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-medium text-zinc-200">Schedule Dose</h3>
          <button onClick={onClose} className="text-zinc-500 hover:text-zinc-300 text-lg">&times;</button>
        </div>

        {/* Substance selector */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {SUBSTANCE_KEYS.map(key => {
            const c = SUBSTANCE_CONFIG[key];
            return (
              <button
                key={key}
                onClick={() => handleSubstanceChange(key)}
                className={`flex items-center gap-1 px-2 py-1 rounded text-xs transition ${
                  substance === key
                    ? 'ring-1 text-white'
                    : 'text-zinc-500 hover:text-zinc-300 bg-zinc-800'
                }`}
                style={substance === key ? {
                  backgroundColor: c.color + '20',
                  borderColor: c.color,
                  boxShadow: `0 0 0 1px ${c.color}`,
                } : {}}
              >
                <span>{c.icon}</span>
                <span>{c.label}</span>
              </button>
            );
          })}
        </div>

        {/* Date/Time picker */}
        <div className="mb-4">
          <label className="text-[10px] uppercase tracking-wider text-zinc-600 block mb-1">When</label>
          <input
            type="datetime-local"
            value={dateTime}
            onChange={e => setDateTime(e.target.value)}
            className="w-full bg-zinc-800 border border-zinc-700 rounded px-3 py-1.5 text-sm text-white font-mono focus:outline-none focus:border-indigo-500"
          />
        </div>

        {/* Amount */}
        <div className="mb-4">
          <label className="text-[10px] uppercase tracking-wider text-zinc-600 block mb-1">
            Amount ({cfg.unit})
          </label>
          <input
            type="number"
            value={amount}
            onChange={e => setAmount(Number(e.target.value))}
            min={range?.min || 0.1}
            max={range?.max || 1000}
            step={range?.min && range.min < 1 ? 0.1 : 1}
            className="w-full bg-zinc-800 border border-zinc-700 rounded px-3 py-1.5 text-sm text-white font-mono focus:outline-none focus:border-indigo-500"
          />
        </div>

        {/* Intent */}
        <div className="mb-4">
          <label className="text-[10px] uppercase tracking-wider text-zinc-600 block mb-1">Intent</label>
          <div className="flex flex-wrap gap-1.5">
            {(INTENTS[substance] || []).map(i => (
              <button
                key={i}
                onClick={() => setIntent(intent === i ? '' : i)}
                className={`px-2 py-0.5 rounded text-xs transition ${
                  intent === i
                    ? 'bg-indigo-600/30 text-indigo-300 ring-1 ring-indigo-500/40'
                    : 'bg-zinc-800 text-zinc-500 hover:text-zinc-300'
                }`}
              >
                {i}
              </button>
            ))}
          </div>
        </div>

        {/* Notes */}
        <div className="mb-4">
          <label className="text-[10px] uppercase tracking-wider text-zinc-600 block mb-1">Notes</label>
          <input
            type="text"
            value={notes}
            onChange={e => setNotes(e.target.value)}
            placeholder="Optional..."
            className="w-full bg-zinc-800 border border-zinc-700 rounded px-3 py-1.5 text-sm text-white focus:outline-none focus:border-indigo-500"
          />
        </div>

        {/* Submit */}
        <button
          onClick={handleSubmit}
          disabled={submitting}
          className="w-full py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium transition disabled:opacity-50"
        >
          {submitting ? 'Scheduling...' : 'Schedule'}
        </button>
      </div>
    </div>
  );
}
