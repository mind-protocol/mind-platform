'use client';

import { useEffect, useState } from 'react';

interface SubStats {
  count: number;
  avg_dose: number;
  total_dose: number;
  last_log: string | null;
}

interface StatsResponse {
  stats: Record<string, SubStats>;
  total_entries: number;
}

const SUBSTANCES = [
  { key: 'thc', label: 'THC', color: '#22c55e', icon: '🌿' },
  { key: 'cbd', label: 'CBD', color: '#84cc16', icon: '🌱' },
  { key: 'lions_mane', label: "Lion's Mane", color: '#b45309', icon: '🦁' },
  { key: 'caffeine', label: 'Café', color: '#d97706', icon: '☕' },
  { key: 'ketamine', label: 'K', color: '#8b5cf6', icon: '💎' },
  { key: 'lsd', label: 'LSD', color: '#ec4899', icon: '🔮' },
  { key: 'nicotine', label: 'Nic', color: '#f59e0b', icon: '💨' },
  { key: 'hydration', label: 'H₂O', color: '#3b82f6', icon: '💧' },
  { key: 'melatonin', label: 'Mel', color: '#6366f1', icon: '🌙' },
  { key: 'venlafaxine', label: 'Ven', color: '#14b8a6', icon: '💊' },
  { key: 'prazepam', label: 'Praz', color: '#94a3b8', icon: '🫧' },
  { key: 'cyamemazine', label: 'Cya', color: '#7e22ce', icon: '🌌' },
  { key: 'dynabiane', label: 'Dyna', color: '#10b981', icon: '🧬' },
  { key: 'omegabiane', label: 'Omega', color: '#0ea5e9', icon: '🐟' },
] as const;

function timeSince(ts: string): string {
  const diff = Date.now() - new Date(ts).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export default function SubstanceCard({ refreshKey }: { refreshKey: number }) {
  const [stats, setStats] = useState<StatsResponse | null>(null);

  useEffect(() => {
    fetch('/api/tracker/stats?days=7')
      .then((r) => r.json())
      .then(setStats)
      .catch(() => {});
  }, [refreshKey]);

  const todayStats = stats?.stats;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {SUBSTANCES.map((sub) => {
        const s = todayStats?.[sub.key];
        return (
          <div
            key={sub.key}
            className="bg-zinc-900 border border-zinc-800 rounded-lg p-3"
          >
            <div className="flex items-center gap-2 mb-2">
              <div
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: sub.color }}
              />
              <span className="text-sm font-medium text-zinc-300">
                {sub.icon} {sub.label}
              </span>
            </div>
            <div className="text-2xl font-mono font-bold" style={{ color: sub.color }}>
              {s?.count ?? 0}
            </div>
            <div className="text-xs text-zinc-500 mt-1">
              {s?.last_log ? timeSince(s.last_log) : 'no logs'} &middot; 7d avg{' '}
              {s ? (s.count / 7).toFixed(1) : '0'}/d
            </div>
          </div>
        );
      })}
    </div>
  );
}
