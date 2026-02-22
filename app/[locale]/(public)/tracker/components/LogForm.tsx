'use client';

import { useState, useCallback } from 'react';

const TABS = [
  { key: 'thc', label: 'THC', color: '#22c55e', icon: '🌿' },
  { key: 'ketamine', label: 'Ketamine', color: '#8b5cf6', icon: '💎' },
  { key: 'nicotine', label: 'Nicotine', color: '#f59e0b', icon: '💨' },
  { key: 'hydration', label: 'H₂O', color: '#3b82f6', icon: '💧' },
] as const;

const INTENTS: Record<string, string[]> = {
  thc: ['focus', 'relax', 'creative', 'sleep', 'social'],
  ketamine: ['micro-boost', 'dissociation', 'identity-dissolution'],
  nicotine: ['focus', 'break', 'craving'],
  hydration: ['baseline', 'recovery', 'pre-sleep'],
};

const DEFAULTS: Record<string, { amount: number; unit: string; details: Record<string, unknown> }> = {
  thc: { amount: 1, unit: 'chamber', details: { strain_thc: 22, temp_c: 230 } },
  ketamine: { amount: 1, unit: 'spray', details: { mg_per_spray: 0, total_mg: 0 } },
  nicotine: { amount: 5, unit: 'puffs', details: { strength_pct: 20, mode: 'ATL' } },
  hydration: { amount: 500, unit: 'ml', details: { additives: [] } },
};

const ADDITIVES = ['sodium', 'potassium', 'magnesium', 'vitC', 'B12', 'B6', 'B2'];

export default function LogForm({ onLogged }: { onLogged: () => void }) {
  const [tab, setTab] = useState('thc');
  const [amount, setAmount] = useState(DEFAULTS.thc.amount);
  const [intent, setIntent] = useState('');
  const [notes, setNotes] = useState('');
  const [details, setDetails] = useState<Record<string, unknown>>(DEFAULTS.thc.details);
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState('');

  const switchTab = useCallback((key: string) => {
    setTab(key);
    setAmount(DEFAULTS[key].amount);
    setDetails({ ...DEFAULTS[key].details });
    setIntent('');
    setNotes('');
    setFeedback('');
  }, []);

  const submit = async () => {
    setSubmitting(true);
    setFeedback('');
    try {
      const body = {
        substance: tab,
        dose: { amount, unit: DEFAULTS[tab].unit, details },
        intent,
        notes,
      };
      const res = await fetch('/api/tracker/log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (res.ok) {
        setFeedback('Logged ✓');
        setNotes('');
        onLogged();
        setTimeout(() => setFeedback(''), 2000);
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
      <div className="flex gap-1 mb-4">
        {TABS.map((t) => (
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
        {/* Amount */}
        <div>
          <label className="text-xs text-zinc-500 block mb-1">
            Amount ({DEFAULTS[tab].unit})
          </label>
          <input
            type="number"
            min={0}
            step={tab === 'hydration' ? 50 : 1}
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            className="w-full bg-zinc-800 border border-zinc-700 rounded px-3 py-2 text-white font-mono text-sm focus:outline-none focus:border-zinc-500"
          />
        </div>

        {/* Substance-specific details */}
        {tab === 'thc' && (
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
        )}

        {tab === 'ketamine' && (
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

        {tab === 'nicotine' && (
          <div>
            <label className="text-xs text-zinc-500 block mb-1">Mode</label>
            <div className="flex gap-2">
              {['ATL', 'MTL'].map((m) => (
                <button
                  key={m}
                  onClick={() => setDetails({ ...details, mode: m })}
                  className={`px-3 py-1.5 rounded text-sm border transition ${
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
        <button
          onClick={submit}
          disabled={submitting || amount <= 0}
          className="px-5 py-2 rounded font-medium text-sm transition disabled:opacity-40"
          style={{ backgroundColor: currentTab.color, color: '#000' }}
        >
          {submitting ? '...' : 'Log'}
        </button>
      </div>

      {feedback && (
        <div className="mt-2 text-xs text-zinc-400">{feedback}</div>
      )}

      <div className="mt-2 text-xs text-zinc-600">Ctrl+Enter to submit</div>
    </div>
  );
}
