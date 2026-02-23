'use client';

import { useState } from 'react';
import { SUBSTANCE_KEYS, SUBSTANCE_CONFIG, DOSE_RANGES, type SubstanceKey } from '@/lib/tracker/constants';
import type { Regimen } from '@/lib/tracker/planning';

interface RegimenManagerProps {
  regimens: Regimen[];
  onCreateRegimen: (regimen: {
    substance: string;
    dose: { amount: number; unit: string; details: Record<string, unknown> };
    intent: string;
    pattern: { type: string; times?: string[]; interval_hours?: number; waking_hours_only?: boolean };
    notes: string;
  }) => Promise<boolean>;
  onToggleRegimen: (id: string, active: boolean) => Promise<boolean>;
}

export default function RegimenManager({ regimens, onCreateRegimen, onToggleRegimen }: RegimenManagerProps) {
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="px-4 py-3">
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-xs font-medium text-zinc-400 uppercase tracking-wider">Recurring Regimens</h4>
        <button
          onClick={() => setShowForm(!showForm)}
          className="text-[11px] px-2 py-0.5 rounded bg-zinc-800 text-zinc-400 hover:text-white transition"
        >
          {showForm ? 'Cancel' : '+ Add'}
        </button>
      </div>

      {/* Active regimens */}
      {regimens.length === 0 && !showForm && (
        <div className="text-xs text-zinc-600">No regimens configured. Add one to auto-schedule recurring doses.</div>
      )}

      <div className="space-y-2">
        {regimens.map(reg => {
          const cfg = SUBSTANCE_CONFIG[reg.substance as SubstanceKey];
          if (!cfg) return null;
          const pattern = reg.pattern;
          const desc = pattern.type === 'daily'
            ? `Daily at ${(pattern.times || []).join(', ')}`
            : `Every ${pattern.interval_hours}h${pattern.waking_hours_only ? ' (waking)' : ''}`;

          return (
            <div
              key={reg.id}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg border transition ${
                reg.active
                  ? 'border-zinc-700 bg-zinc-800/50'
                  : 'border-zinc-800/50 bg-zinc-900/50 opacity-50'
              }`}
            >
              <span className="text-sm">{cfg.icon}</span>
              <div className="flex-1 min-w-0">
                <div className="text-xs text-zinc-200">
                  {cfg.label} — {reg.dose.amount}{reg.dose.unit}
                </div>
                <div className="text-[10px] text-zinc-500">{desc}</div>
              </div>
              <button
                onClick={() => onToggleRegimen(reg.id, !reg.active)}
                className={`text-[10px] px-2 py-0.5 rounded transition ${
                  reg.active
                    ? 'bg-emerald-600/20 text-emerald-400 hover:bg-emerald-600/30'
                    : 'bg-zinc-700/50 text-zinc-500 hover:bg-zinc-700'
                }`}
              >
                {reg.active ? 'Active' : 'Paused'}
              </button>
            </div>
          );
        })}
      </div>

      {/* Add form */}
      {showForm && (
        <RegimenForm
          onSubmit={async (data) => {
            const ok = await onCreateRegimen(data);
            if (ok) setShowForm(false);
          }}
        />
      )}
    </div>
  );
}

function RegimenForm({ onSubmit }: {
  onSubmit: (data: {
    substance: string;
    dose: { amount: number; unit: string; details: Record<string, unknown> };
    intent: string;
    pattern: { type: string; times?: string[]; interval_hours?: number; waking_hours_only?: boolean };
    notes: string;
  }) => Promise<void>;
}) {
  const [substance, setSubstance] = useState<SubstanceKey>('hydration');
  const [amount, setAmount] = useState(500);
  const [patternType, setPatternType] = useState<'daily' | 'interval'>('daily');
  const [times, setTimes] = useState('08:00');
  const [intervalHours, setIntervalHours] = useState(3);
  const [wakingOnly, setWakingOnly] = useState(true);
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const cfg = SUBSTANCE_CONFIG[substance];
  const range = DOSE_RANGES[substance];

  return (
    <div className="mt-3 p-3 bg-zinc-800/50 rounded-lg border border-zinc-700/50 space-y-3">
      {/* Substance */}
      <div className="flex flex-wrap gap-1">
        {SUBSTANCE_KEYS.map(key => {
          const c = SUBSTANCE_CONFIG[key];
          return (
            <button
              key={key}
              onClick={() => {
                setSubstance(key);
                setAmount(DOSE_RANGES[key]?.min || 1);
              }}
              className={`text-[10px] px-1.5 py-0.5 rounded transition ${
                substance === key
                  ? 'text-white'
                  : 'text-zinc-600 hover:text-zinc-400 bg-zinc-800'
              }`}
              style={substance === key ? { backgroundColor: c.color + '25', color: c.color } : {}}
            >
              {c.icon} {c.label}
            </button>
          );
        })}
      </div>

      {/* Amount */}
      <div className="flex gap-3">
        <div className="flex-1">
          <label className="text-[9px] uppercase text-zinc-600 block mb-0.5">Amount ({cfg.unit})</label>
          <input
            type="number"
            value={amount}
            onChange={e => setAmount(Number(e.target.value))}
            min={range?.min || 0.1}
            step={range?.min && range.min < 1 ? 0.1 : 1}
            className="w-full bg-zinc-900 border border-zinc-700 rounded px-2 py-1 text-xs text-white font-mono focus:outline-none focus:border-indigo-500"
          />
        </div>

        {/* Pattern type */}
        <div className="flex-1">
          <label className="text-[9px] uppercase text-zinc-600 block mb-0.5">Pattern</label>
          <div className="flex bg-zinc-900 rounded p-0.5 text-[10px]">
            <button
              onClick={() => setPatternType('daily')}
              className={`flex-1 px-2 py-0.5 rounded ${patternType === 'daily' ? 'bg-zinc-700 text-white' : 'text-zinc-500'}`}
            >
              Daily
            </button>
            <button
              onClick={() => setPatternType('interval')}
              className={`flex-1 px-2 py-0.5 rounded ${patternType === 'interval' ? 'bg-zinc-700 text-white' : 'text-zinc-500'}`}
            >
              Interval
            </button>
          </div>
        </div>
      </div>

      {/* Pattern details */}
      {patternType === 'daily' ? (
        <div>
          <label className="text-[9px] uppercase text-zinc-600 block mb-0.5">Times (comma-separated HH:MM)</label>
          <input
            type="text"
            value={times}
            onChange={e => setTimes(e.target.value)}
            placeholder="08:00, 20:00"
            className="w-full bg-zinc-900 border border-zinc-700 rounded px-2 py-1 text-xs text-white font-mono focus:outline-none focus:border-indigo-500"
          />
        </div>
      ) : (
        <div className="flex gap-3 items-end">
          <div className="flex-1">
            <label className="text-[9px] uppercase text-zinc-600 block mb-0.5">Every N hours</label>
            <input
              type="number"
              value={intervalHours}
              onChange={e => setIntervalHours(Number(e.target.value))}
              min={1}
              max={24}
              className="w-full bg-zinc-900 border border-zinc-700 rounded px-2 py-1 text-xs text-white font-mono focus:outline-none focus:border-indigo-500"
            />
          </div>
          <label className="flex items-center gap-1.5 text-xs text-zinc-400 pb-1 cursor-pointer">
            <input
              type="checkbox"
              checked={wakingOnly}
              onChange={e => setWakingOnly(e.target.checked)}
              className="rounded bg-zinc-800 border-zinc-600"
            />
            Waking hours only
          </label>
        </div>
      )}

      {/* Notes */}
      <input
        type="text"
        value={notes}
        onChange={e => setNotes(e.target.value)}
        placeholder="Notes (optional)"
        className="w-full bg-zinc-900 border border-zinc-700 rounded px-2 py-1 text-xs text-white focus:outline-none focus:border-indigo-500"
      />

      {/* Submit */}
      <button
        onClick={async () => {
          setSubmitting(true);
          const pattern = patternType === 'daily'
            ? { type: 'daily' as const, times: times.split(',').map(t => t.trim()).filter(Boolean) }
            : { type: 'interval' as const, interval_hours: intervalHours, waking_hours_only: wakingOnly };
          await onSubmit({
            substance,
            dose: { amount, unit: cfg.unit, details: {} },
            intent: '',
            pattern,
            notes,
          });
          setSubmitting(false);
        }}
        disabled={submitting}
        className="w-full py-1.5 rounded bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium transition disabled:opacity-50"
      >
        {submitting ? 'Creating...' : 'Create Regimen'}
      </button>
    </div>
  );
}
