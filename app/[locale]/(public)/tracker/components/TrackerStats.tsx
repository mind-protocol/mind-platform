'use client';

import { useEffect, useState, useMemo } from 'react';
import { SUBSTANCE_CONFIG, type SubstanceKey } from '@/lib/tracker/constants';

// ── Types ────────────────────────────────────────────────────────

interface SubStats {
  count: number;
  avg_dose?: number;
  total_dose?: number;
  time_of_day?: { morning: number; afternoon: number; evening: number; night: number };
  avg_biometrics?: { hr?: number; stress?: number; body_battery?: number };
  last_log?: string | null;
}

interface StatsResponse {
  days: number;
  stats: Record<string, SubStats>;
  total_entries: number;
}

interface DailyEntry {
  date: string;
  substances: Record<string, number>;
}

interface DailyResponse {
  days: number;
  daily: DailyEntry[];
  streaks: Record<string, number>;
  top_intents: { intent: string; count: number }[];
}

// ── Helpers ──────────────────────────────────────────────────────

function timeSince(ts: string): string {
  const diff = Date.now() - new Date(ts).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h`;
  return `${Math.floor(hrs / 24)}j`;
}

/** Inline SVG sparkline (7-day frequency) */
function Sparkline({ data, color, width = 56, height = 20 }: {
  data: number[];
  color: string;
  width?: number;
  height?: number;
}) {
  const max = Math.max(...data, 1);
  const step = width / Math.max(data.length - 1, 1);
  const points = data.map((v, i) => `${i * step},${height - (v / max) * height}`).join(' ');
  const areaPoints = `0,${height} ${points} ${(data.length - 1) * step},${height}`;

  return (
    <svg width={width} height={height} className="inline-block">
      <polygon points={areaPoints} fill={color} opacity={0.15} />
      <polyline points={points} fill="none" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/** CSS bar chart — stacked daily bars */
function DailyChart({ daily, activeSubs }: { daily: DailyEntry[]; activeSubs: string[] }) {
  // Find max total per day for scaling
  const maxTotal = Math.max(
    ...daily.map((d) => Object.values(d.substances).reduce((a, b) => a + b, 0)),
    1,
  );

  // Only show last N entries based on screen (show all, CSS will handle overflow)
  const bars = daily.slice(-30);

  return (
    <div className="flex items-end gap-[2px] h-24 overflow-x-auto">
      {bars.map((day) => {
        const total = Object.values(day.substances).reduce((a, b) => a + b, 0);
        const heightPct = (total / maxTotal) * 100;
        const dateLabel = day.date.slice(5); // MM-DD

        return (
          <div key={day.date} className="flex flex-col items-center flex-1 min-w-[8px] group relative">
            <div
              className="w-full rounded-t-sm flex flex-col-reverse overflow-hidden transition-all"
              style={{ height: `${Math.max(heightPct, 2)}%` }}
            >
              {activeSubs.map((sub) => {
                const count = day.substances[sub] || 0;
                if (!count) return null;
                const segPct = (count / total) * 100;
                const cfg = SUBSTANCE_CONFIG[sub as SubstanceKey];
                return (
                  <div
                    key={sub}
                    style={{
                      height: `${segPct}%`,
                      backgroundColor: cfg?.color || '#71717a',
                      minHeight: count ? '2px' : 0,
                    }}
                  />
                );
              })}
            </div>
            {/* Date label on hover */}
            <div className="absolute -bottom-5 text-[8px] text-zinc-600 opacity-0 group-hover:opacity-100 transition whitespace-nowrap">
              {dateLabel}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ── Main Component ───────────────────────────────────────────────

export default function TrackerStats({ refreshKey }: { refreshKey: number }) {
  const [period, setPeriod] = useState<7 | 30 | 90>(7);
  const [stats, setStats] = useState<StatsResponse | null>(null);
  const [daily, setDaily] = useState<DailyResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      fetch(`/api/tracker/stats?days=${period}`).then((r) => r.ok ? r.json() : null),
      fetch(`/api/tracker/stats/daily?days=${period}`).then((r) => r.ok ? r.json() : null),
    ])
      .then(([s, d]) => {
        if (s) setStats(s);
        if (d) setDaily(d);
      })
      .catch((e: unknown) => { console.debug('TrackerStats fetch failed:', e); })
      .finally(() => setLoading(false));
  }, [period, refreshKey]);

  // Active substances (those with count > 0), sorted by count desc
  const activeSubs = useMemo(() => {
    if (!stats?.stats) return [];
    return Object.entries(stats.stats)
      .filter(([, v]) => v.count > 0)
      .sort(([, a], [, b]) => b.count - a.count)
      .map(([k]) => k);
  }, [stats]);

  // Sparkline data per substance (last 7 entries of daily)
  const sparklines = useMemo(() => {
    if (!daily?.daily) return {};
    const last7 = daily.daily.slice(-7);
    const result: Record<string, number[]> = {};
    for (const sub of activeSubs) {
      result[sub] = last7.map((d) => d.substances[sub] || 0);
    }
    return result;
  }, [daily, activeSubs]);

  // Overall clean days (no logs at all)
  const overallCleanDays = useMemo(() => {
    if (!daily?.daily) return 0;
    let clean = 0;
    for (let i = daily.daily.length - 1; i >= 0; i--) {
      const total = Object.values(daily.daily[i].substances).reduce((a, b) => a + b, 0);
      if (total === 0) clean++;
      else break;
    }
    return clean;
  }, [daily]);

  if (loading) {
    return (
      <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 animate-pulse">
        <div className="h-5 w-32 bg-zinc-800 rounded mb-4" />
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-20 bg-zinc-800/50 rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  if (!stats || !daily) return null;

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden">
      {/* Header with period selector */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between p-4 hover:bg-zinc-800/30 transition"
      >
        <div className="flex items-center gap-3">
          <h3 className="text-sm font-medium text-zinc-300">Stats</h3>
          <span className="text-xs text-zinc-600 font-mono">
            {stats.total_entries} logs &middot; {activeSubs.length} substances
          </span>
        </div>
        <div className="flex items-center gap-2">
          {/* Period toggle */}
          <div className="flex gap-1" onClick={(e) => e.stopPropagation()}>
            {([7, 30, 90] as const).map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`px-2 py-0.5 rounded text-xs font-mono transition ${
                  period === p
                    ? 'bg-zinc-700 text-white'
                    : 'text-zinc-500 hover:text-zinc-300'
                }`}
              >
                {p}d
              </button>
            ))}
          </div>
          <span className={`text-zinc-500 transition-transform ${expanded ? 'rotate-180' : ''}`}>
            &#9662;
          </span>
        </div>
      </button>

      {expanded && (
        <div className="px-4 pb-4 space-y-5">
          {/* ── Daily Chart ─────────────────────────────────── */}
          <div>
            <div className="text-[10px] text-zinc-600 mb-2 font-mono uppercase tracking-wider">
              Daily Activity ({period}d)
            </div>
            <DailyChart daily={daily.daily} activeSubs={activeSubs} />
            {/* Legend */}
            <div className="flex flex-wrap gap-2 mt-3">
              {activeSubs.slice(0, 8).map((sub) => {
                const cfg = SUBSTANCE_CONFIG[sub as SubstanceKey];
                return (
                  <div key={sub} className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: cfg?.color || '#71717a' }} />
                    <span className="text-[10px] text-zinc-500">{cfg?.label || sub}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ── Substance Cards ────────────────────────────── */}
          <div>
            <div className="text-[10px] text-zinc-600 mb-2 font-mono uppercase tracking-wider">
              Per Substance
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {activeSubs.map((sub) => {
                const s = stats.stats[sub];
                const cfg = SUBSTANCE_CONFIG[sub as SubstanceKey];
                const spark = sparklines[sub] || [];

                return (
                  <div
                    key={sub}
                    className="bg-zinc-800/50 border border-zinc-700/50 rounded-lg p-3 space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs">{cfg?.icon}</span>
                        <span className="text-xs font-medium text-zinc-300">{cfg?.label || sub}</span>
                      </div>
                      <Sparkline data={spark} color={cfg?.color || '#71717a'} />
                    </div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-xl font-mono font-bold" style={{ color: cfg?.color }}>
                        {s.count}
                      </span>
                      <span className="text-[10px] text-zinc-500">
                        {(s.count / period).toFixed(1)}/d
                      </span>
                    </div>
                    <div className="text-[10px] text-zinc-600 space-x-2">
                      {s.avg_dose ? (
                        <span>avg {s.avg_dose} {cfg?.unit}</span>
                      ) : null}
                      {s.last_log ? (
                        <span>{timeSince(s.last_log)} ago</span>
                      ) : null}
                    </div>
                    {/* Time of day mini bar */}
                    {s.time_of_day && s.count > 0 && (
                      <div className="flex gap-0.5 h-1.5 rounded-full overflow-hidden bg-zinc-700/30">
                        {(['morning', 'afternoon', 'evening', 'night'] as const).map((tod) => {
                          const pct = (s.time_of_day![tod] / s.count) * 100;
                          const colors = {
                            morning: '#fbbf24',
                            afternoon: '#f59e0b',
                            evening: '#6366f1',
                            night: '#312e81',
                          };
                          return pct > 0 ? (
                            <div
                              key={tod}
                              style={{ width: `${pct}%`, backgroundColor: colors[tod] }}
                              className="h-full"
                              title={`${tod}: ${s.time_of_day![tod]}`}
                            />
                          ) : null;
                        })}
                      </div>
                    )}
                    {/* Biometrics at time of use */}
                    {s.avg_biometrics && Object.keys(s.avg_biometrics).length > 0 && (
                      <div className="flex gap-2 text-[9px] text-zinc-500">
                        {s.avg_biometrics.hr && <span>HR {s.avg_biometrics.hr}</span>}
                        {s.avg_biometrics.stress && <span>Stress {s.avg_biometrics.stress}</span>}
                        {s.avg_biometrics.body_battery && <span>BB {s.avg_biometrics.body_battery}</span>}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* ── Streaks ───────────────────────────────────── */}
          {daily.streaks && Object.keys(daily.streaks).length > 0 && (
            <div>
              <div className="text-[10px] text-zinc-600 mb-2 font-mono uppercase tracking-wider">
                Clean Streaks (days without)
              </div>
              <div className="flex flex-wrap gap-2">
                {overallCleanDays > 0 && (
                  <div className="px-2 py-1 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono">
                    ALL: {overallCleanDays}d
                  </div>
                )}
                {Object.entries(daily.streaks)
                  .filter(([, days]) => days > 0)
                  .sort(([, a], [, b]) => b - a)
                  .slice(0, 10)
                  .map(([sub, days]) => {
                    const cfg = SUBSTANCE_CONFIG[sub as SubstanceKey];
                    return (
                      <div
                        key={sub}
                        className="px-2 py-1 rounded border text-xs font-mono"
                        style={{
                          borderColor: `${cfg?.color || '#71717a'}30`,
                          color: cfg?.color || '#a1a1aa',
                          backgroundColor: `${cfg?.color || '#71717a'}08`,
                        }}
                      >
                        {cfg?.icon} {days}d
                      </div>
                    );
                  })}
              </div>
            </div>
          )}

          {/* ── Alerts (harm reduction) ───────────────────── */}
          {activeSubs.some((sub) => {
            const s = stats.stats[sub];
            const cfg = SUBSTANCE_CONFIG[sub as SubstanceKey];
            return (cfg?.danger === 'high' || cfg?.danger === 'critical') && s.count >= 3;
          }) && (
            <div>
              <div className="text-[10px] text-zinc-600 mb-2 font-mono uppercase tracking-wider">
                Alerts
              </div>
              <div className="space-y-2">
                {activeSubs
                  .filter((sub) => {
                    const s = stats.stats[sub];
                    const cfg = SUBSTANCE_CONFIG[sub as SubstanceKey];
                    return (cfg?.danger === 'high' || cfg?.danger === 'critical') && s.count >= 3;
                  })
                  .map((sub) => {
                    const s = stats.stats[sub];
                    const cfg = SUBSTANCE_CONFIG[sub as SubstanceKey];
                    const freq = s.count / period;
                    return (
                      <div
                        key={sub}
                        className="bg-red-500/10 border border-red-500/30 rounded p-2 text-xs text-red-400"
                      >
                        {cfg?.icon} <span className="font-medium">{cfg?.label}</span>: {s.count}x in {period}d ({freq.toFixed(1)}/d)
                        {freq > 1 && ' — high frequency, consider spacing'}
                        {s.avg_dose && s.total_dose && s.total_dose > (s.avg_dose * s.count * 1.3) && ' — dose escalation detected'}
                      </div>
                    );
                  })}
              </div>
            </div>
          )}

          {/* ── Top Intents ───────────────────────────────── */}
          {daily.top_intents && daily.top_intents.length > 0 && (
            <div>
              <div className="text-[10px] text-zinc-600 mb-2 font-mono uppercase tracking-wider">
                Top Intents
              </div>
              <div className="flex flex-wrap gap-1.5">
                {daily.top_intents.map(({ intent, count }) => (
                  <div
                    key={intent}
                    className="px-2 py-1 rounded bg-zinc-800 border border-zinc-700/50 text-xs text-zinc-400"
                  >
                    {intent} <span className="text-zinc-600 font-mono">{count}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
