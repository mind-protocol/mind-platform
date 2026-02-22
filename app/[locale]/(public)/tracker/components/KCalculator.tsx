'use client';

import { useState } from 'react';

interface CalcResult {
  mg_per_ml: number;
  mg_per_puff: number;
  total_puffs: number;
  puffs_per_tier: Record<string, string>;
  warnings: string[];
  prep_id?: string;
}

const TIERS = [
  { key: 'micro', label: 'Micro-boost', range: '5-15mg', color: '#a78bfa' },
  { key: 'low', label: 'Low', range: '15-30mg', color: '#8b5cf6' },
  { key: 'moderate', label: 'Moderate', range: '30-60mg', color: '#7c3aed' },
  { key: 'strong', label: 'Strong', range: '60-100mg', color: '#6d28d9' },
];

export default function KCalculator() {
  const [crystalMg, setCrystalMg] = useState(200);
  const [waterMl, setWaterMl] = useState(10);
  const [sprayMl, setSprayMl] = useState(0.1);
  const [result, setResult] = useState<CalcResult | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const calculate = async () => {
    try {
      const res = await fetch('/api/tracker/k-calc', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          crystal_mg: crystalMg,
          water_ml: waterMl,
          spray_ml_per_puff: sprayMl,
        }),
      });
      const data = await res.json();
      setResult(data);
      setSaved(false);
    } catch {
      // silent
    }
  };

  const savePrep = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/tracker/k-calc', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          crystal_mg: crystalMg,
          water_ml: waterMl,
          spray_ml_per_puff: sprayMl,
          save_prep: true,
        }),
      });
      const data = await res.json();
      setResult(data);
      setSaved(true);
    } catch {
      // silent
    } finally {
      setSaving(false);
    }
  };

  // Live calculation (client-side)
  const mgPerMl = waterMl > 0 ? crystalMg / waterMl : 0;
  const mgPerPuff = mgPerMl * sprayMl;

  return (
    <div className="bg-zinc-900 border border-purple-500/20 rounded-lg p-4">
      <h3 className="text-sm font-medium text-purple-400 mb-4">
        💎 Ketamine Dissolution Calculator
      </h3>

      <div className="grid grid-cols-3 gap-3 mb-4">
        <div>
          <label className="text-xs text-zinc-500 block mb-1">Crystal (mg)</label>
          <input
            type="number"
            min={0}
            value={crystalMg}
            onChange={(e) => setCrystalMg(Number(e.target.value))}
            className="w-full bg-zinc-800 border border-zinc-700 rounded px-3 py-2 text-white font-mono text-sm focus:outline-none focus:border-purple-500/50"
          />
        </div>
        <div>
          <label className="text-xs text-zinc-500 block mb-1">Water (ml)</label>
          <input
            type="number"
            min={0.1}
            step={0.5}
            value={waterMl}
            onChange={(e) => setWaterMl(Number(e.target.value))}
            className="w-full bg-zinc-800 border border-zinc-700 rounded px-3 py-2 text-white font-mono text-sm focus:outline-none focus:border-purple-500/50"
          />
        </div>
        <div>
          <label className="text-xs text-zinc-500 block mb-1">Spray vol (ml)</label>
          <input
            type="number"
            min={0.01}
            step={0.01}
            value={sprayMl}
            onChange={(e) => setSprayMl(Number(e.target.value))}
            className="w-full bg-zinc-800 border border-zinc-700 rounded px-3 py-2 text-white font-mono text-sm focus:outline-none focus:border-purple-500/50"
          />
        </div>
      </div>

      {/* Live results */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        <div className="bg-zinc-800/50 rounded p-2.5 text-center">
          <div className="text-xs text-zinc-500 mb-0.5">mg/ml</div>
          <div className="text-lg font-mono text-purple-300">{mgPerMl.toFixed(1)}</div>
        </div>
        <div className="bg-zinc-800/50 rounded p-2.5 text-center">
          <div className="text-xs text-zinc-500 mb-0.5">mg/puff</div>
          <div className="text-lg font-mono text-purple-300">{mgPerPuff.toFixed(2)}</div>
        </div>
        <div className="bg-zinc-800/50 rounded p-2.5 text-center">
          <div className="text-xs text-zinc-500 mb-0.5">Total puffs</div>
          <div className="text-lg font-mono text-purple-300">
            {mgPerPuff > 0 ? Math.round(crystalMg / mgPerPuff) : '—'}
          </div>
        </div>
      </div>

      {/* Tier guide */}
      <div className="mb-4">
        <div className="text-xs text-zinc-500 mb-2">Dosing tiers</div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {TIERS.map((tier) => {
            let puffs = '—';
            if (mgPerPuff > 0) {
              const [lo, hi] = tier.range.replace('mg', '').split('-').map(Number);
              const pLo = Math.max(1, Math.round(lo / mgPerPuff));
              const pHi = Math.max(1, Math.round(hi / mgPerPuff));
              puffs = `${pLo}-${pHi}`;
            }
            return (
              <div
                key={tier.key}
                className="rounded p-2 border"
                style={{ borderColor: tier.color + '30', backgroundColor: tier.color + '08' }}
              >
                <div className="text-xs font-medium" style={{ color: tier.color }}>
                  {tier.label}
                </div>
                <div className="text-xs text-zinc-500">{tier.range}</div>
                <div className="text-sm font-mono mt-1" style={{ color: tier.color }}>
                  {puffs} puffs
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Warnings */}
      {mgPerMl > 200 && (
        <div className="text-xs text-amber-400/80 mb-3 bg-amber-500/10 rounded p-2">
          High concentration — may not dissolve fully or cause nasal irritation.
        </div>
      )}
      {mgPerMl > 0 && mgPerMl < 10 && (
        <div className="text-xs text-blue-400/80 mb-3 bg-blue-500/10 rounded p-2">
          Low concentration — many sprays needed per dose.
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-2">
        <button
          onClick={calculate}
          className="px-3 py-1.5 rounded text-sm bg-purple-600 hover:bg-purple-500 text-white transition"
        >
          Calculate (server)
        </button>
        <button
          onClick={savePrep}
          disabled={saving}
          className="px-3 py-1.5 rounded text-sm border border-purple-500/30 text-purple-400 hover:bg-purple-500/10 transition disabled:opacity-40"
        >
          {saving ? 'Saving...' : saved ? 'Saved ✓' : 'Save prep'}
        </button>
      </div>

      {result?.prep_id && (
        <div className="mt-2 text-xs text-zinc-500">
          Prep ID: <span className="font-mono text-purple-400">{result.prep_id.slice(0, 8)}</span>
        </div>
      )}
    </div>
  );
}
