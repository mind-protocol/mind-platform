'use client';

import type { SubstanceDependency } from '@/lib/tracker/types/dependencies';

const SUBSTANCE_META: Record<string, { icon: string; label: string; color: string }> = {
  thc:         { icon: '🌿', label: 'THC',         color: '#22c55e' },
  cbd:         { icon: '🌱', label: 'CBD',         color: '#84cc16' },
  lions_mane:  { icon: '🦁', label: "Lion's Mane", color: '#b45309' },
  caffeine:    { icon: '☕', label: 'Caféine',     color: '#d97706' },
  ketamine:    { icon: '💎', label: 'Kétamine',    color: '#8b5cf6' },
  lsd:         { icon: '🔮', label: 'LSD',         color: '#ec4899' },
  nicotine:    { icon: '💨', label: 'Nicotine',    color: '#f59e0b' },
  hydration:   { icon: '💧', label: 'H2O',         color: '#3b82f6' },
  melatonin:   { icon: '🌙', label: 'Mélatonine',  color: '#6366f1' },
  venlafaxine: { icon: '💊', label: 'Venlafaxine', color: '#14b8a6' },
  sertraline:  { icon: '💊', label: 'Sertraline',  color: '#06b6d4' },
  prazepam:    { icon: '🫧', label: 'Prazépam',    color: '#94a3b8' },
  cyamemazine: { icon: '🌌', label: 'Cyamémazine', color: '#7e22ce' },
  dynabiane:   { icon: '🧬', label: 'Dynabiane',   color: '#10b981' },
  omegabiane:  { icon: '🐟', label: 'Omegabiane',  color: '#0ea5e9' },
};

const RISK_COLORS = {
  low: 'border-zinc-700 bg-zinc-800/50',
  moderate: 'border-yellow-500/30 bg-yellow-500/5',
  high: 'border-orange-500/30 bg-orange-500/5',
  critical: 'border-red-500/30 bg-red-500/5',
};

const RISK_LABELS = {
  low: { text: 'Faible', color: 'text-zinc-400' },
  moderate: { text: 'Modéré', color: 'text-yellow-400' },
  high: { text: 'Élevé', color: 'text-orange-400' },
  critical: { text: 'Critique', color: 'text-red-400' },
};

const TREND_ICONS: Record<string, string> = {
  increasing: '↑',
  decreasing: '↓',
  stable: '→',
  new: '●',
  none: '—',
};

interface Props {
  substances: Record<string, SubstanceDependency>;
  onSelect: (substance: string | null) => void;
  selected: string | null;
}

export default function DependencyOverview({ substances, onSelect, selected }: Props) {
  const entries = Object.entries(substances);

  if (entries.length === 0) {
    return (
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 text-center text-zinc-500">
        Aucune donnée de substance trouvée dans la période d'analyse.
      </div>
    );
  }

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
      <h2 className="text-lg font-semibold text-amber-400 mb-4">Vue d'ensemble des dépendances</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {entries.map(([key, dep]) => {
          const meta = SUBSTANCE_META[key] || { icon: '?', label: key, color: '#666' };
          const risk = RISK_LABELS[dep.risk_level];
          const isSelected = selected === key;

          return (
            <button
              key={key}
              onClick={() => onSelect(isSelected ? null : key)}
              className={`text-left p-4 rounded-lg border transition-all ${RISK_COLORS[dep.risk_level]} ${
                isSelected ? 'ring-2 ring-amber-500/50' : 'hover:border-zinc-600'
              }`}
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{meta.icon}</span>
                  <span className="font-medium text-zinc-200">{meta.label}</span>
                </div>
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${risk.color} bg-zinc-800`}>
                  {risk.text}
                </span>
              </div>

              {/* Score bar */}
              <div className="mb-3">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-zinc-500">Score</span>
                  <span className={risk.color}>{dep.dependency_score}/100</span>
                </div>
                <div className="h-2 bg-zinc-700 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      width: `${dep.dependency_score}%`,
                      backgroundColor: dep.dependency_score >= 75 ? '#ef4444' :
                        dep.dependency_score >= 50 ? '#f97316' :
                        dep.dependency_score >= 25 ? '#eab308' : '#22c55e',
                    }}
                  />
                </div>
              </div>

              {/* Metrics */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-zinc-500">Fréquence</span>
                  <div className="text-zinc-300">
                    {dep.frequency.daily_average}/j
                    <span className={dep.frequency.trend === 'increasing' ? 'text-red-400 ml-1' : dep.frequency.trend === 'decreasing' ? 'text-green-400 ml-1' : 'text-zinc-500 ml-1'}>
                      {TREND_ICONS[dep.frequency.trend] || ''}
                    </span>
                  </div>
                </div>
                <div>
                  <span className="text-zinc-500">Dose moy.</span>
                  <div className="text-zinc-300">
                    {dep.dosing.current_avg} {dep.dosing.unit}
                    <span className={dep.dosing.trend === 'increasing' ? 'text-red-400 ml-1' : dep.dosing.trend === 'decreasing' ? 'text-green-400 ml-1' : 'text-zinc-500 ml-1'}>
                      {TREND_ICONS[dep.dosing.trend] || ''}
                    </span>
                  </div>
                </div>
                <div>
                  <span className="text-zinc-500">Coping</span>
                  <div className={dep.intents.coping_ratio > 0.4 ? 'text-red-400' : dep.intents.coping_ratio > 0.2 ? 'text-yellow-400' : 'text-zinc-300'}>
                    {Math.round(dep.intents.coping_ratio * 100)}%
                    {dep.intents.shift_trend === 'toward_coping' && <span className="text-red-400 ml-1">↑</span>}
                  </div>
                </div>
                <div>
                  <span className="text-zinc-500">Régularité</span>
                  <div className="text-zinc-300">
                    {Math.round(dep.frequency.regularity * 100)}%
                  </div>
                </div>
              </div>

              {/* Last use */}
              {dep.hours_since_last !== null && (
                <div className="mt-2 text-xs text-zinc-500">
                  Dernière prise : {dep.hours_since_last < 1 ? `${Math.round(dep.hours_since_last * 60)}min` : dep.hours_since_last < 24 ? `${Math.round(dep.hours_since_last)}h` : `${Math.round(dep.hours_since_last / 24)}j`}
                </div>
              )}

              {/* Tapering badge */}
              {dep.tapering?.recommended && (
                <div className="mt-2 text-xs px-2 py-1 rounded bg-amber-500/10 border border-amber-500/20 text-amber-400">
                  Sevrage recommandé
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
