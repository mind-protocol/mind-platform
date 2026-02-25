'use client';

import { useEffect, useState } from 'react';

interface Rec {
  substance: string;
  priority: number;
  action: string;
  reason: string;
  details: Record<string, unknown>;
}

interface RecContext {
  period: string;
  hour: number;
  biometrics: {
    hr: number | null;
    stress: number | null;
    body_battery: number | null;
    ans_mode: string;
  } | null;
  today_counts: Record<string, number>;
  last_intake: Record<string, number | null>;
}

interface RecResponse {
  recommendations: Rec[];
  context: RecContext;
}

const SUB_COLORS: Record<string, string> = {
  thc: '#22c55e',
  cbd: '#84cc16',
  lions_mane: '#b45309',
  caffeine: '#d97706',
  ketamine: '#8b5cf6',
  lsd: '#ec4899',
  nicotine: '#f59e0b',
  hydration: '#3b82f6',
  melatonin: '#6366f1',
  venlafaxine: '#14b8a6',
  sertraline: '#06b6d4',
  prazepam: '#94a3b8',
  cyamemazine: '#7e22ce',
  dynabiane: '#10b981',
  omegabiane: '#0ea5e9',
  yoga: '#f472b6',
  none: '#52525b',
};

const SUB_ICONS: Record<string, string> = {
  thc: '🌿',
  cbd: '🌱',
  lions_mane: '🦁',
  caffeine: '☕',
  ketamine: '💎',
  lsd: '🔮',
  nicotine: '💨',
  hydration: '💧',
  melatonin: '🌙',
  venlafaxine: '💊',
  sertraline: '💊',
  prazepam: '🫧',
  cyamemazine: '🌌',
  dynabiane: '🧬',
  omegabiane: '🐟',
  yoga: '🧘',
  none: '✓',
};

const PERIOD_LABELS: Record<string, string> = {
  morning: '🌅 Matin',
  afternoon: '☀️ Après-midi',
  evening: '🌆 Soirée',
  night: '🌙 Nuit',
};

export default function Recommendation({
  refreshKey,
  onQuickLog,
  onSchedule,
}: {
  refreshKey: number;
  onQuickLog: (substance: string, details: Record<string, unknown>) => void;
  onSchedule?: (substance: string, details: Record<string, unknown>) => void;
}) {
  const [data, setData] = useState<RecResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch('/api/tracker/recommend')
      .then((r) => r.json())
      .then((d) => {
        if (d.recommendations) setData(d);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [refreshKey]);

  if (loading) {
    return (
      <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 animate-pulse">
        <div className="h-4 bg-zinc-800 rounded w-1/3 mb-2" />
        <div className="h-6 bg-zinc-800 rounded w-2/3" />
      </div>
    );
  }

  if (!data) return null;

  const top = data.recommendations[0];
  const rest = data.recommendations.slice(1).filter((r) => r.priority > 0);
  const ctx = data.context;
  const bio = ctx.biometrics;

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
      {/* Context bar */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-xs text-zinc-500">
            {PERIOD_LABELS[ctx.period] || ctx.period}
          </span>
          {bio && (
            <span className="text-xs text-zinc-600">
              {bio.stress != null && (
                <span className={bio.stress >= 60 ? 'text-red-400' : ''}>
                  σ{bio.stress}
                </span>
              )}
              {bio.body_battery != null && (
                <span className={`ml-2 ${bio.body_battery < 30 ? 'text-amber-400' : ''}`}>
                  ⚡{bio.body_battery}
                </span>
              )}
              {bio.hr != null && <span className="ml-2">♡{bio.hr}</span>}
            </span>
          )}
        </div>
        <span className="text-[10px] text-zinc-600 uppercase tracking-wider">Recommandation</span>
      </div>

      {/* Top recommendation */}
      {top && (
        <div
          className="flex items-start gap-3 p-3 rounded-lg border mb-2"
          style={{
            borderColor: SUB_COLORS[top.substance] + '30',
            backgroundColor: SUB_COLORS[top.substance] + '08',
          }}
        >
          <span className="text-xl mt-0.5">{SUB_ICONS[top.substance] || '•'}</span>
          <div className="flex-1 min-w-0">
            <div className="font-medium text-sm" style={{ color: SUB_COLORS[top.substance] }}>
              {top.action}
            </div>
            <div className="text-xs text-zinc-500 mt-0.5">{top.reason}</div>
          </div>
          {top.substance !== 'none' && (
            <div className="flex gap-1.5 shrink-0">
              <button
                onClick={() => onQuickLog(top.substance, top.details)}
                className="px-3 py-1.5 rounded text-xs font-medium transition hover:opacity-80"
                style={{ backgroundColor: SUB_COLORS[top.substance], color: '#000' }}
              >
                Log
              </button>
              {onSchedule && (
                <button
                  onClick={() => onSchedule(top.substance, top.details)}
                  className="px-2 py-1.5 rounded text-xs font-medium border transition hover:opacity-80"
                  style={{ borderColor: SUB_COLORS[top.substance] + '60', color: SUB_COLORS[top.substance] }}
                >
                  Plan
                </button>
              )}
            </div>
          )}
        </div>
      )}

      {/* Secondary recommendations */}
      {rest.length > 0 && (
        <div className="space-y-1">
          {rest.map((rec, i) => (
            <div key={i} className="flex items-center gap-2 px-2 py-1.5 rounded hover:bg-zinc-800/40 transition">
              <span className="text-sm">{SUB_ICONS[rec.substance] || '•'}</span>
              <span className="text-xs text-zinc-400 flex-1 truncate">{rec.action}</span>
              <span className="text-[10px] text-zinc-600 shrink-0">{rec.reason}</span>
              {rec.substance !== 'none' && (
                <div className="flex gap-1 shrink-0">
                  <button
                    onClick={() => onQuickLog(rec.substance, rec.details)}
                    className="text-[10px] px-1.5 py-0.5 rounded border border-zinc-700 text-zinc-500 hover:text-zinc-300 transition"
                  >
                    log
                  </button>
                  {onSchedule && (
                    <button
                      onClick={() => onSchedule(rec.substance, rec.details)}
                      className="text-[10px] px-1.5 py-0.5 rounded border border-indigo-500/30 text-indigo-400/60 hover:text-indigo-300 transition"
                    >
                      plan
                    </button>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
