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
  griffonia:   { icon: '🌰', label: 'Griffonia',   color: '#a855f7' },
  valeriane:   { icon: '🌾', label: 'Valériane',   color: '#65a30d' },
  safran:      { icon: '🌸', label: 'Safran',      color: '#f97316' },
  yoga:        { icon: '🧘', label: 'Yoga',        color: '#f472b6' },
  vitamine_c:  { icon: '🍊', label: 'Vitamine C',  color: '#fb923c' },
  cocaine:     { icon: '⚠️', label: 'Cocaïne',     color: '#e2e8f0' },
  mmc:         { icon: '⚠️', label: 'MMC',          color: '#22d3ee' },
  heroine:     { icon: '🚨', label: 'Héroïne',     color: '#78350f' },
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

// ── Visual helpers ──────────────────────────────────────────────────────

/** Score to color: green < 25, yellow < 50, orange < 75, red >= 75 */
function scoreColor(v: number): string {
  if (v >= 75) return '#ef4444';
  if (v >= 50) return '#f97316';
  if (v >= 25) return '#eab308';
  return '#22c55e';
}

/** Percentage to color: inverse (low % = good green, high = bad red) */
function pctColorDanger(v: number): string {
  if (v >= 80) return '#ef4444';
  if (v >= 60) return '#f97316';
  if (v >= 40) return '#eab308';
  if (v >= 20) return '#a3e635';
  return '#22c55e';
}

/** Percentage to color: normal (low = bad, high = good) */
function pctColorHealth(v: number): string {
  if (v >= 80) return '#22c55e';
  if (v >= 60) return '#a3e635';
  if (v >= 40) return '#eab308';
  if (v >= 20) return '#f97316';
  return '#ef4444';
}

/** Frequency color: higher = more concerning */
function freqColor(daily: number): string {
  if (daily >= 5) return '#ef4444';
  if (daily >= 3) return '#f97316';
  if (daily >= 1) return '#eab308';
  if (daily >= 0.5) return '#a3e635';
  return '#22c55e';
}

/** Mini SVG arc for radial gauges */
function MiniArc({ pct, color, size = 32, stroke = 3 }: { pct: number; color: string; size?: number; stroke?: number }) {
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ * (1 - Math.min(1, Math.max(0, pct / 100)));
  return (
    <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(63,63,70,0.5)" strokeWidth={stroke} />
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={stroke}
        strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"
        style={{ transition: 'stroke-dashoffset 400ms ease' }} />
    </svg>
  );
}

/** Mini horizontal bar */
function MiniBar({ pct, color, height = 4 }: { pct: number; color: string; height?: number }) {
  return (
    <div style={{ height, borderRadius: height / 2, background: 'rgba(63,63,70,0.5)', overflow: 'hidden', width: '100%' }}>
      <div style={{
        height: '100%', borderRadius: height / 2,
        width: `${Math.min(100, Math.max(2, pct))}%`,
        background: color,
        transition: 'width 400ms ease',
      }} />
    </div>
  );
}

/** Time-since badge color */
function timeSinceColor(hours: number): string {
  if (hours < 2) return '#ef4444';
  if (hours < 6) return '#f97316';
  if (hours < 12) return '#eab308';
  if (hours < 24) return '#a3e635';
  return '#22c55e';
}

function timeSinceLabel(hours: number): string {
  if (hours < 1) return `${Math.round(hours * 60)}min`;
  if (hours < 24) return `${Math.round(hours)}h`;
  return `${Math.round(hours / 24)}j`;
}

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

          const copingPct = Math.round(dep.intents.coping_ratio * 100);
          const regPct = Math.round(dep.frequency.regularity * 100);
          const sColor = scoreColor(dep.dependency_score);
          const fColor = freqColor(dep.frequency.daily_average);
          const cColor = pctColorDanger(copingPct);
          const rColor = pctColorHealth(regPct);
          // Frequency bar: cap at 8/day for visual
          const freqPct = Math.min(100, (dep.frequency.daily_average / 8) * 100);

          return (
            <button
              key={key}
              onClick={() => onSelect(isSelected ? null : key)}
              className={`text-left p-4 rounded-lg border transition-all ${RISK_COLORS[dep.risk_level]} ${
                isSelected ? 'ring-2 ring-amber-500/50' : 'hover:border-zinc-600'
              }`}
            >
              {/* Header — icon with colored ring + risk badge */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2.5">
                  <div className="relative flex items-center justify-center" style={{ width: 36, height: 36 }}>
                    <MiniArc pct={dep.dependency_score} color={sColor} size={36} stroke={2.5} />
                    <span className="absolute text-base" style={{ transform: 'rotate(0deg)' }}>{meta.icon}</span>
                  </div>
                  <div>
                    <span className="font-medium text-zinc-200 block leading-tight">{meta.label}</span>
                    <span className="text-[10px] font-mono" style={{ color: sColor }}>{dep.dependency_score}/100</span>
                  </div>
                </div>
                <span
                  className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                  style={{
                    color: risk.color === 'text-zinc-400' ? '#a1a1aa' : risk.color === 'text-yellow-400' ? '#facc15' : risk.color === 'text-orange-400' ? '#fb923c' : '#f87171',
                    background: risk.color === 'text-zinc-400' ? 'rgba(161,161,170,0.1)' : risk.color === 'text-yellow-400' ? 'rgba(250,204,21,0.1)' : risk.color === 'text-orange-400' ? 'rgba(251,146,60,0.1)' : 'rgba(248,113,113,0.1)',
                    border: `1px solid ${risk.color === 'text-zinc-400' ? 'rgba(161,161,170,0.2)' : risk.color === 'text-yellow-400' ? 'rgba(250,204,21,0.2)' : risk.color === 'text-orange-400' ? 'rgba(251,146,60,0.2)' : 'rgba(248,113,113,0.2)'}`,
                  }}
                >
                  {risk.text}
                </span>
              </div>

              {/* Score bar — full width, thicker */}
              <div className="mb-3">
                <MiniBar pct={dep.dependency_score} color={sColor} height={5} />
              </div>

              {/* Metrics — 2x2 grid with visual bars */}
              <div className="grid grid-cols-2 gap-x-3 gap-y-2.5 text-xs">
                {/* Fréquence */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-zinc-500">Fréquence</span>
                    <div className="flex items-center gap-1">
                      <span className="font-mono" style={{ color: fColor }}>{dep.frequency.daily_average}/j</span>
                      <span
                        className="text-[10px] font-bold"
                        style={{
                          color: dep.frequency.trend === 'increasing' ? '#ef4444' : dep.frequency.trend === 'decreasing' ? '#22c55e' : '#71717a',
                        }}
                      >
                        {TREND_ICONS[dep.frequency.trend] || ''}
                      </span>
                    </div>
                  </div>
                  <MiniBar pct={freqPct} color={fColor} />
                </div>

                {/* Dose moy. */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-zinc-500">Dose moy.</span>
                    <span
                      className="text-[10px] font-bold"
                      style={{
                        color: dep.dosing.trend === 'increasing' ? '#ef4444' : dep.dosing.trend === 'decreasing' ? '#22c55e' : '#71717a',
                      }}
                    >
                      {TREND_ICONS[dep.dosing.trend] || ''}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono text-zinc-300" style={{ color: meta.color }}>
                      {dep.dosing.current_avg}
                    </span>
                    <span className="text-zinc-500">{dep.dosing.unit}</span>
                  </div>
                </div>

                {/* Coping — radial arc */}
                <div className="flex items-center gap-2">
                  <MiniArc pct={copingPct} color={cColor} size={28} stroke={2.5} />
                  <div>
                    <span className="text-zinc-500 block leading-tight">Coping</span>
                    <span className="font-mono font-semibold" style={{ color: cColor }}>
                      {copingPct}%
                    </span>
                    {dep.intents.shift_trend === 'toward_coping' && (
                      <span className="text-[10px] font-bold text-red-400 ml-0.5">↑</span>
                    )}
                  </div>
                </div>

                {/* Régularité — radial arc */}
                <div className="flex items-center gap-2">
                  <MiniArc pct={regPct} color={rColor} size={28} stroke={2.5} />
                  <div>
                    <span className="text-zinc-500 block leading-tight">Régularité</span>
                    <span className="font-mono font-semibold" style={{ color: rColor }}>
                      {regPct}%
                    </span>
                  </div>
                </div>
              </div>

              {/* Last use — colored pill */}
              {dep.hours_since_last !== null && (
                <div className="mt-3 flex items-center gap-1.5">
                  <div
                    style={{
                      width: 6, height: 6, borderRadius: '50%',
                      backgroundColor: timeSinceColor(dep.hours_since_last),
                      boxShadow: `0 0 6px ${timeSinceColor(dep.hours_since_last)}66`,
                    }}
                  />
                  <span className="text-[11px]" style={{ color: timeSinceColor(dep.hours_since_last) }}>
                    {timeSinceLabel(dep.hours_since_last)}
                  </span>
                  <span className="text-[10px] text-zinc-600">depuis dernière prise</span>
                </div>
              )}

              {/* Tapering badge */}
              {dep.tapering?.recommended && (
                <div className="mt-2 text-xs px-2 py-1 rounded-md bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center gap-1.5">
                  <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#f59e0b', boxShadow: '0 0 6px #f59e0b66', display: 'inline-block' }} />
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
