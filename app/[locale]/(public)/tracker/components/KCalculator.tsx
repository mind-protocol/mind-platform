'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

type DeliveryMode = 'syringe' | 'spray';

const TIERS = [
  { key: 'micro', label: 'Micro', rangeMg: [5, 15], color: '#a78bfa' },
  { key: 'low', label: 'Low', rangeMg: [15, 30], color: '#8b5cf6' },
  { key: 'moderate', label: 'Moderate', rangeMg: [30, 60], color: '#7c3aed' },
  { key: 'strong', label: 'Strong', rangeMg: [60, 100], color: '#6d28d9' },
];

export default function KCalculator() {
  const t = useTranslations('Tracker');
  const [crystalMg, setCrystalMg] = useState(1000);
  const [waterMl, setWaterMl] = useState(60);
  const [mode, setMode] = useState<DeliveryMode>('syringe');
  const [sprayMl, setSprayMl] = useState(0.1);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  // Core calculation
  const mgPerMl = waterMl > 0 ? crystalMg / waterMl : 0;
  const mgPerDose = mode === 'spray' ? mgPerMl * sprayMl : mgPerMl; // 1ml syringe unit

  const savePrep = async () => {
    setSaving(true);
    try {
      await fetch('/api/tracker/k-calc', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          crystal_mg: crystalMg,
          water_ml: waterMl,
          spray_ml_per_puff: mode === 'spray' ? sprayMl : 1,
          delivery_mode: mode,
          save_prep: true,
        }),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch {
      // silent
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-zinc-900 border border-purple-500/20 rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-purple-400">
          {'💎'} {t('kCalculator')}
        </h3>
        {/* Delivery mode toggle */}
        <div className="flex gap-1 bg-zinc-800 rounded-lg p-0.5">
          <button
            onClick={() => setMode('syringe')}
            className={`px-2.5 py-1 text-xs rounded-md transition ${
              mode === 'syringe'
                ? 'bg-purple-600 text-white'
                : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            {'💉'} {t('syringe')}
          </button>
          <button
            onClick={() => setMode('spray')}
            className={`px-2.5 py-1 text-xs rounded-md transition ${
              mode === 'spray'
                ? 'bg-purple-600 text-white'
                : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            {'🌫️'} {t('spray')}
          </button>
        </div>
      </div>

      {/* Inputs */}
      <div className={`grid ${mode === 'spray' ? 'grid-cols-3' : 'grid-cols-2'} gap-3 mb-4`}>
        <div>
          <label className="text-xs text-zinc-500 block mb-1">{t('crystalMg')}</label>
          <input
            type="number"
            min={0}
            value={crystalMg}
            onChange={(e) => setCrystalMg(Number(e.target.value))}
            className="w-full bg-zinc-800 border border-zinc-700 rounded px-3 py-2 text-white font-mono text-sm focus:outline-none focus:border-purple-500/50"
          />
        </div>
        <div>
          <label className="text-xs text-zinc-500 block mb-1">{t('waterMl')}</label>
          <input
            type="number"
            min={0.1}
            step={0.5}
            value={waterMl}
            onChange={(e) => setWaterMl(Number(e.target.value))}
            className="w-full bg-zinc-800 border border-zinc-700 rounded px-3 py-2 text-white font-mono text-sm focus:outline-none focus:border-purple-500/50"
          />
        </div>
        {mode === 'spray' && (
          <div>
            <label className="text-xs text-zinc-500 block mb-1">{t('sprayVolume')}</label>
            <input
              type="number"
              min={0.01}
              step={0.01}
              value={sprayMl}
              onChange={(e) => setSprayMl(Number(e.target.value))}
              className="w-full bg-zinc-800 border border-zinc-700 rounded px-3 py-2 text-white font-mono text-sm focus:outline-none focus:border-purple-500/50"
            />
          </div>
        )}
      </div>

      {/* Concentration result */}
      <div className="bg-zinc-800/50 rounded-lg p-3 mb-4 text-center">
        <div className="text-xs text-zinc-500 mb-1">{t('concentration')}</div>
        <div className="text-2xl font-mono text-purple-300 font-bold">{mgPerMl.toFixed(1)} mg/ml</div>
        {mode === 'spray' && (
          <div className="text-sm text-zinc-400 mt-1">
            = {(mgPerMl * sprayMl).toFixed(2)} mg/puff &middot; {mgPerDose > 0 ? Math.round(crystalMg / mgPerDose) : '—'} {t('puffsTotal')}
          </div>
        )}
      </div>

      {/* Dosing tiers — adapted to mode */}
      <div className="mb-4">
        <div className="text-xs text-zinc-500 mb-2">
          {mode === 'syringe' ? t('syringeDosing') : t('sprayDosing')}
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {TIERS.map((tier) => {
            const [lo, hi] = tier.rangeMg;
            let doseLabel = '—';

            if (mode === 'syringe' && mgPerMl > 0) {
              const mlLo = lo / mgPerMl;
              const mlHi = hi / mgPerMl;
              doseLabel = `${mlLo.toFixed(1)}–${mlHi.toFixed(1)} ml`;
            } else if (mode === 'spray' && mgPerDose > 0) {
              const pLo = Math.max(1, Math.round(lo / mgPerDose));
              const pHi = Math.max(1, Math.round(hi / mgPerDose));
              doseLabel = `${pLo}–${pHi} puffs`;
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
                <div className="text-xs text-zinc-500">{lo}–{hi} mg</div>
                <div className="text-sm font-mono mt-1" style={{ color: tier.color }}>
                  {doseLabel}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Quick reference for syringe mode */}
      {mode === 'syringe' && mgPerMl > 0 && (
        <div className="mb-4 bg-zinc-800/30 rounded-lg p-3">
          <div className="text-xs text-zinc-500 mb-2">{t('quickReference')}</div>
          <div className="grid grid-cols-4 gap-2 text-center">
            {[0.25, 0.5, 1, 2].map((ml) => (
              <div key={ml}>
                <div className="text-xs text-zinc-500">{ml} ml</div>
                <div className="text-sm font-mono text-purple-300 font-medium">
                  {(mgPerMl * ml).toFixed(0)} mg
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Warnings */}
      {mgPerMl > 200 && (
        <div className="text-xs text-amber-400/80 mb-3 bg-amber-500/10 rounded p-2">
          {t('highConcentration')}
        </div>
      )}
      {mgPerMl > 0 && mgPerMl < 5 && (
        <div className="text-xs text-blue-400/80 mb-3 bg-blue-500/10 rounded p-2">
          {t('lowConcentration')}
        </div>
      )}

      {/* Save */}
      <div className="flex gap-2">
        <button
          onClick={savePrep}
          disabled={saving}
          className="px-3 py-1.5 rounded text-sm border border-purple-500/30 text-purple-400 hover:bg-purple-500/10 transition disabled:opacity-40"
        >
          {saving ? t('saving') : saved ? `${t('saved')} ✓` : t('savePrep')}
        </button>
      </div>
    </div>
  );
}
