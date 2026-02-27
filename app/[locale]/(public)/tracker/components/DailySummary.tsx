'use client';

import { useEffect, useState } from 'react';
import { useToast } from '@/components/Toast';
import { SUBSTANCE_CONFIG, type SubstanceKey } from '@/lib/tracker/constants';

interface DayStats {
  stats: Record<string, { count: number; total_dose: number; avg_dose: number; last_log: string | null }>;
  total_entries: number;
}

function timeStr(ts: string): string {
  return new Date(ts).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
}

export default function DailySummary({ refreshKey }: { refreshKey: number }) {
  const { toast } = useToast();
  const [data, setData] = useState<DayStats | null>(null);

  useEffect(() => {
    fetch('/api/tracker/stats?days=1')
      .then((r) => r.ok ? r.json() : null)
      .then((d) => { if (d) setData(d); })
      .catch(() => toast('Failed to load daily summary', 'error'));
  }, [refreshKey]);

  if (!data || data.total_entries === 0) return null;

  const entries = Object.entries(data.stats)
    .filter(([, v]) => v.count > 0)
    .sort((a, b) => {
      // Sort by last log time (most recent first)
      const aTime = a[1].last_log ? new Date(a[1].last_log).getTime() : 0;
      const bTime = b[1].last_log ? new Date(b[1].last_log).getTime() : 0;
      return bTime - aTime;
    });

  if (entries.length === 0) return null;

  return (
    <div className="bg-zinc-900/50 border border-zinc-800/50 rounded-lg px-4 py-3">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-xs font-medium text-zinc-500 uppercase tracking-wider">Today</h3>
        <span className="text-xs text-zinc-600 font-mono">{data.total_entries} logs</span>
      </div>
      <div className="flex flex-wrap gap-2">
        {entries.map(([key, val]) => {
          const config = SUBSTANCE_CONFIG[key as SubstanceKey];
          if (!config) return null;
          return (
            <div
              key={key}
              className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-zinc-800/50 border border-zinc-800"
              title={`${val.count}x — last: ${val.last_log ? timeStr(val.last_log) : '—'}`}
            >
              <span className="text-xs">{config.icon}</span>
              <span className="text-xs font-mono" style={{ color: config.color }}>
                {config.label}
              </span>
              <span className="text-[10px] text-zinc-500">
                {val.count}x
              </span>
              {val.total_dose > 0 && (
                <span className="text-[10px] text-zinc-600">
                  ({val.total_dose}{config.unit})
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
