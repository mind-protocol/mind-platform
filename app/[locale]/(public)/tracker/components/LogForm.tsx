'use client';

import { useState, useCallback } from 'react';

const TABS = [
  { key: 'thc', label: 'THC', color: '#22c55e', icon: '🌿' },
  { key: 'cbd', label: 'CBD Complex', color: '#84cc16', icon: '🌱' },
  { key: 'lions_mane', label: "Lion's Mane", color: '#b45309', icon: '🦁' },
  { key: 'caffeine', label: 'Caffeine', color: '#d97706', icon: '☕' },
  { key: 'ketamine', label: 'Ketamine', color: '#8b5cf6', icon: '💎' },
  { key: 'lsd', label: 'LSD', color: '#ec4899', icon: '🔮' },
  { key: 'nicotine', label: 'Nicotine', color: '#f59e0b', icon: '💨' },
  { key: 'hydration', label: 'H₂O', color: '#3b82f6', icon: '💧' },
  { key: 'melatonin', label: 'Melatonin', color: '#6366f1', icon: '🌙' },
  { key: 'venlafaxine', label: 'Venlafaxine', color: '#14b8a6', icon: '💊' },
  { key: 'prazepam', label: 'Prazepam', color: '#94a3b8', icon: '🫧' },
  { key: 'cyamemazine', label: 'Cyamemazine', color: '#7e22ce', icon: '🌌' },
  { key: 'dynabiane', label: 'Dynabiane', color: '#10b981', icon: '🧬' },
  { key: 'omegabiane', label: 'Omegabiane', color: '#0ea5e9', icon: '🐟' },
] as const;

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
  prazepam: ['anxiety', 'panic', 'sleep', 'as-needed'],
  cyamemazine: ['sleep', 'anxiety', 'as-needed'],
  dynabiane: ['daily', 'gut-brain', 'immunity', 'mood'],
  omegabiane: ['daily', 'neuroprotection', 'anti-inflammatory', 'cardiovascular'],
};

const DEFAULTS: Record<string, { amount: number; unit: string; details: Record<string, unknown> }> = {
  thc: { amount: 1, unit: 'chamber', details: { strain_thc: 22, temp_c: 230 } },
  cbd: { amount: 1, unit: 'comprimé', details: { route: 'complex', form: 'tablet' } },
  lions_mane: { amount: 420, unit: 'mg', details: { form: 'capsule', mg_per_capsule: 420 } },
  caffeine: { amount: 150, unit: 'mg', details: { form: 'espresso', shots: 2, milk: true, sugar: 1 } },
  ketamine: { amount: 30, unit: 'mg', details: { form: 'crystal', route: 'intranasal', estimate: 'visual' } },
  lsd: { amount: 0.5, unit: 'carton', details: { form: 'carton', ug_estimate: 100 } },
  nicotine: { amount: 5, unit: 'puffs', details: { strength_pct: 20, mode: 'ATL' } },
  hydration: { amount: 500, unit: 'ml', details: { additives: [] } },
  melatonin: { amount: 3, unit: 'mg', details: { form: 'tablet' } },
  venlafaxine: { amount: 75, unit: 'mg', details: { form: 'capsule', release: 'extended' } },
  prazepam: { amount: 10, unit: 'mg', details: { form: 'sublingual', route: 'sublingual' } },
  cyamemazine: { amount: 25, unit: 'mg', details: { form: 'tablet' } },
  dynabiane: { amount: 1, unit: 'gélule', details: { form: 'capsule', brand: 'PiLeJe', type: 'probiotic' } },
  omegabiane: { amount: 1, unit: 'gélule', details: { form: 'capsule', brand: 'PiLeJe', type: 'omega-3' } },
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
      const unit = tab === 'ketamine'
        ? (details.form === 'spray' ? 'spray' : 'mg')
        : tab === 'cbd'
        ? (details.route === 'vaporized' ? 'chambers' : 'mg')
        : DEFAULTS[tab]?.unit || 'mg';
      const body = {
        substance: tab,
        dose: { amount, unit, details },
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
            Amount ({tab === 'ketamine' ? (details.form === 'spray' ? 'sprays' : 'mg estimate') : tab === 'cbd' ? (details.route === 'vaporized' ? 'chambers' : 'mg') : DEFAULTS[tab].unit})
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
                        setAmount(20);
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
                        onClick={() => {
                          setDetails({ ...details, cbd_pct: pct });
                          setAmount(pct);
                        }}
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
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-xs text-zinc-500 block mb-1">Dose (mg)</label>
                    <input
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(Number(e.target.value))}
                      className="w-full bg-zinc-800 border border-zinc-700 rounded px-3 py-2 text-white font-mono text-sm focus:outline-none focus:border-zinc-500"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-zinc-500 block mb-1">Gouttes</label>
                    <input
                      type="number"
                      value={(details.drops as number) || 5}
                      onChange={(e) => setDetails({ ...details, drops: Number(e.target.value) })}
                      className="w-full bg-zinc-800 border border-zinc-700 rounded px-3 py-2 text-white font-mono text-sm focus:outline-none focus:border-zinc-500"
                    />
                  </div>
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
            {/* Espresso presets */}
            <div>
              <label className="text-xs text-zinc-500 block mb-1">Quick dose</label>
              <div className="flex flex-wrap gap-1.5">
                {[
                  { shots: 1, mg: 75, label: 'Simple', desc: 'espresso' },
                  { shots: 2, mg: 150, label: 'Double', desc: 'espresso' },
                  { shots: 3, mg: 225, label: 'Triple', desc: 'espresso' },
                ].map((p) => (
                  <button
                    key={p.shots}
                    onClick={() => {
                      setAmount(p.mg);
                      setDetails({ ...details, form: 'espresso', shots: p.shots });
                    }}
                    className={`px-2 py-1 rounded text-xs border transition ${
                      amount === p.mg && details.form === 'espresso'
                        ? 'border-amber-500/50 text-amber-300 bg-amber-500/15'
                        : 'border-zinc-700 text-zinc-500 hover:text-zinc-300'
                    }`}
                  >
                    {p.label} <span className="text-zinc-600">· {p.mg}mg</span>
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
                <div className="flex gap-1.5">
                  {[0, 1, 2].map((s) => (
                    <button
                      key={s}
                      onClick={() => setDetails({ ...details, sugar: s })}
                      className={`px-2 py-1.5 rounded text-sm border transition ${
                        (details.sugar as number) === s
                          ? 'border-amber-500/50 text-amber-400 bg-amber-500/10'
                          : 'border-zinc-700 text-zinc-500 hover:text-zinc-300'
                      }`}
                    >
                      {s === 0 ? 'Sans' : `${s}`}
                    </button>
                  ))}
                </div>
              </div>
            </div>
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
          <div>
            <label className="text-xs text-zinc-500 block mb-1">Route</label>
            <div className="flex gap-2">
              {(['sublingual', 'oral'] as const).map((r) => (
                <button
                  key={r}
                  onClick={() => setDetails({ ...details, route: r })}
                  className={`px-3 py-1.5 rounded text-sm border transition ${
                    details.route === r
                      ? 'border-slate-400/50 text-slate-300 bg-slate-500/10'
                      : 'border-zinc-700 text-zinc-500 hover:text-zinc-300'
                  }`}
                >
                  {r === 'sublingual' ? '👅 Sublingual' : '💊 Oral'}
                </button>
              ))}
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
