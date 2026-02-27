'use client';

import { useEffect, useState, useCallback } from 'react';
import { useTranslations } from 'next-intl';

interface NeonData {
  hr?: number;
  hrv?: number;
  stress?: number;
  energy?: number;
  energy_max?: number;
  sleep_hours?: number;
  ans_mode?: string;
}

interface HouseState {
  ts: string;
  neon: NeonData;
  offline?: boolean;
}

function stressLevel(s: number): { label: string; color: string } {
  if (s >= 76) return { label: 'Very High', color: 'text-red-400' };
  if (s >= 51) return { label: 'High', color: 'text-amber-400' };
  if (s >= 26) return { label: 'Medium', color: 'text-yellow-300' };
  return { label: 'Low', color: 'text-emerald-400' };
}

function ansLabel(mode?: string): { label: string; color: string; icon: string } {
  switch (mode) {
    case 'sympathetic':
      return { label: 'Fight / Flight', color: 'text-red-400', icon: '⚡' };
    case 'parasympathetic':
      return { label: 'Rest / Digest', color: 'text-emerald-400', icon: '🧘' };
    case 'balanced':
      return { label: 'Balanced', color: 'text-cyan-400', icon: '⚖️' };
    default:
      return { label: '—', color: 'text-zinc-500', icon: '·' };
  }
}

function batteryColor(energy: number, max: number): string {
  const pct = max > 0 ? energy / max : 0;
  if (pct >= 0.7) return 'text-emerald-400';
  if (pct >= 0.4) return 'text-yellow-300';
  if (pct >= 0.2) return 'text-amber-400';
  return 'text-red-400';
}

function Pulse({ active }: { active: boolean }) {
  if (!active) return null;
  return (
    <span className="relative flex h-2 w-2">
      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
    </span>
  );
}

export default function LiveBiometrics() {
  const t = useTranslations('Tracker');
  const [data, setData] = useState<HouseState | null>(null);
  const [fresh, setFresh] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      const res = await fetch('/api/house');
      if (!res.ok) { setFresh(false); return; }
      const json: HouseState = await res.json();
      setData(json);
      // Data is fresh if timestamp is < 60s old
      if (json.ts) {
        const age = (Date.now() - new Date(json.ts).getTime()) / 1000;
        setFresh(age < 120 && !json.offline);
      }
    } catch {
      setFresh(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 15_000); // poll every 15s
    return () => clearInterval(interval);
  }, [fetchData]);

  const neon = data?.neon;
  if (!neon || (!neon.hr && !neon.stress && !neon.energy)) {
    // No biometric data — show minimal offline state
    return (
      <div className="bg-zinc-900/50 border border-zinc-800/50 rounded-lg px-4 py-2.5 flex items-center gap-3">
        <span className="text-zinc-600 text-xs font-mono">{t('biometricsOffline')}</span>
        <span className="text-zinc-700 text-xs">{t('connectGarmin')}</span>
      </div>
    );
  }

  const stress = neon.stress != null ? stressLevel(neon.stress) : null;
  const ans = ansLabel(neon.ans_mode);
  const energyColor = neon.energy != null && neon.energy_max != null
    ? batteryColor(neon.energy, neon.energy_max)
    : 'text-zinc-400';

  return (
    <div className="bg-zinc-900/80 border border-zinc-800 rounded-lg px-4 py-3 backdrop-blur-sm">
      <div className="flex items-center gap-6 flex-wrap">
        {/* Live indicator */}
        <div className="flex items-center gap-2">
          <Pulse active={fresh} />
          <span className="text-[10px] uppercase tracking-wider text-zinc-500 font-medium">
            {fresh ? t('live') : t('stale')}
          </span>
        </div>

        {/* Heart Rate */}
        {neon.hr != null && (
          <div className="flex items-center gap-1.5">
            <span className="text-red-400 text-sm">♥</span>
            <span className="text-white font-mono text-sm font-medium">{neon.hr}</span>
            <span className="text-zinc-600 text-[10px]">bpm</span>
          </div>
        )}

        {/* HRV */}
        {neon.hrv != null && (
          <div className="flex items-center gap-1.5">
            <span className="text-cyan-400 text-[10px]">HRV</span>
            <span className="text-white font-mono text-sm font-medium">{neon.hrv}</span>
            <span className="text-zinc-600 text-[10px]">ms</span>
          </div>
        )}

        {/* Stress */}
        {stress && neon.stress != null && (
          <div className="flex items-center gap-1.5">
            <span className="text-zinc-500 text-[10px]">Stress</span>
            <span className={`font-mono text-sm font-medium ${stress.color}`}>
              {neon.stress}
            </span>
            <span className={`text-[10px] ${stress.color} opacity-70`}>
              {stress.label}
            </span>
          </div>
        )}

        {/* Body Battery */}
        {neon.energy != null && (
          <div className="flex items-center gap-1.5">
            <span className="text-zinc-500 text-[10px]">Energy</span>
            <span className={`font-mono text-sm font-medium ${energyColor}`}>
              {neon.energy}
            </span>
            {neon.energy_max != null && (
              <span className="text-zinc-600 text-[10px]">/ {neon.energy_max}</span>
            )}
          </div>
        )}

        {/* ANS Mode */}
        <div className="flex items-center gap-1.5">
          <span className="text-xs">{ans.icon}</span>
          <span className={`text-[10px] ${ans.color}`}>{ans.label}</span>
        </div>

        {/* Sleep */}
        {neon.sleep_hours != null && (
          <div className="flex items-center gap-1.5 ml-auto">
            <span className="text-indigo-400 text-[10px]">Sleep</span>
            <span className="text-white font-mono text-sm">{neon.sleep_hours.toFixed(1)}h</span>
          </div>
        )}
      </div>
    </div>
  );
}
