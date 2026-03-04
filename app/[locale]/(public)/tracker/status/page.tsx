'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';

// ── Types ────────────────────────────────────────────────────────

interface ServiceInfo {
  name: string;
  status: 'up' | 'degraded' | 'down' | 'error' | 'unknown';
  error?: string;
  last_event_age_sec?: number;
  last_event?: string;
  last_sync_age_sec?: number;
  count?: number;
  latency_ms?: number;
  details?: Record<string, unknown>;
}

interface HealthResponse {
  status: string;
  timestamp: string;
  check_duration_ms: number;
  services: Record<string, ServiceInfo>;
}

// ── Helpers ──────────────────────────────────────────────────────

const STATUS_COLORS: Record<string, { bg: string; border: string; text: string; dot: string }> = {
  up: { bg: 'bg-emerald-500/10', border: 'border-emerald-500/30', text: 'text-emerald-400', dot: 'bg-emerald-400' },
  degraded: { bg: 'bg-amber-500/10', border: 'border-amber-500/30', text: 'text-amber-400', dot: 'bg-amber-400' },
  down: { bg: 'bg-red-500/10', border: 'border-red-500/30', text: 'text-red-400', dot: 'bg-red-400' },
  error: { bg: 'bg-red-500/10', border: 'border-red-500/30', text: 'text-red-400', dot: 'bg-red-400' },
  unknown: { bg: 'bg-zinc-800/50', border: 'border-zinc-700/30', text: 'text-zinc-500', dot: 'bg-zinc-500' },
};

const SERVICE_ICONS: Record<string, string> = {
  api: '🖥️',
  orchestrator: '🧠',
  redis: '⚡',
  waha: '💬',
  garmin: '⌚',
  telegram: '📱',
  dead_letters: '📬',
};

function formatAge(seconds: number): string {
  if (seconds < 60) return `${seconds}s`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h`;
  return `${Math.floor(seconds / 86400)}d`;
}

function formatTimestamp(ts: string): string {
  try {
    const d = new Date(ts);
    return d.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  } catch {
    return ts;
  }
}

// ── Service Card ─────────────────────────────────────────────────

function ServiceCard({ id, service }: { id: string; service: ServiceInfo }) {
  const c = STATUS_COLORS[service.status] || STATUS_COLORS.unknown;
  const icon = SERVICE_ICONS[id] || '🔧';

  return (
    <div className={`rounded-lg border p-4 transition ${c.border} ${c.bg}`}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-lg">{icon}</span>
          <span className="text-sm font-medium text-zinc-200">{service.name}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className={`w-2 h-2 rounded-full ${c.dot} ${service.status === 'up' ? 'animate-pulse' : ''}`} />
          <span className={`text-xs font-mono uppercase ${c.text}`}>{service.status}</span>
        </div>
      </div>

      <div className="space-y-1">
        {/* Age info */}
        {service.last_event_age_sec != null && (
          <div className="flex items-center justify-between text-xs">
            <span className="text-zinc-500">Last event</span>
            <span className="text-zinc-400 font-mono">{formatAge(service.last_event_age_sec)} ago</span>
          </div>
        )}
        {service.last_sync_age_sec != null && (
          <div className="flex items-center justify-between text-xs">
            <span className="text-zinc-500">Last sync</span>
            <span className="text-zinc-400 font-mono">{formatAge(service.last_sync_age_sec)} ago</span>
          </div>
        )}
        {service.last_event && (
          <div className="flex items-center justify-between text-xs">
            <span className="text-zinc-500">Event</span>
            <span className="text-zinc-400 font-mono truncate max-w-[140px]">{service.last_event}</span>
          </div>
        )}
        {service.latency_ms != null && service.latency_ms > 0 && (
          <div className="flex items-center justify-between text-xs">
            <span className="text-zinc-500">Latency</span>
            <span className="text-zinc-400 font-mono">{service.latency_ms}ms</span>
          </div>
        )}
        {service.count != null && (
          <div className="flex items-center justify-between text-xs">
            <span className="text-zinc-500">Pending</span>
            <span className={`font-mono ${service.count > 0 ? 'text-amber-400' : 'text-zinc-400'}`}>{service.count}</span>
          </div>
        )}
        {service.error && (
          <div className="text-xs text-red-400/80 mt-1 truncate">{service.error}</div>
        )}

        {/* Details */}
        {service.details && Object.keys(service.details).length > 0 && (
          <div className="flex flex-wrap gap-x-3 gap-y-0.5 mt-1.5 pt-1.5 border-t border-zinc-700/30">
            {Object.entries(service.details).map(([k, v]) => (
              v != null && (
                <div key={k} className="text-[10px] text-zinc-500">
                  <span className="text-zinc-600">{k}:</span>{' '}
                  <span className="text-zinc-400">{String(v)}</span>
                </div>
              )
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ── Main Page ────────────────────────────────────────────────────

export default function StatusPage() {
  const [data, setData] = useState<HealthResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastCheck, setLastCheck] = useState<Date | null>(null);
  const [autoRefresh, setAutoRefresh] = useState(true);

  const refresh = useCallback(async () => {
    try {
      const res = await fetch('/api/health/services');
      if (res.ok) {
        const json = await res.json();
        setData(json);
        setLastCheck(new Date());
      }
    } catch {
      // network error
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  useEffect(() => {
    if (!autoRefresh) return;
    const interval = setInterval(refresh, 30_000);
    return () => clearInterval(interval);
  }, [autoRefresh, refresh]);

  const overallColor = !data ? 'text-zinc-500' :
    data.status === 'healthy' ? 'text-emerald-400' :
    data.status === 'operational' ? 'text-emerald-400' :
    data.status === 'degraded' ? 'text-amber-400' : 'text-red-400';

  const serviceCount = data ? Object.keys(data.services).length : 0;
  const upCount = data ? Object.values(data.services).filter(s => s.status === 'up').length : 0;

  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-20">
        {/* Header */}
        <header className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold font-mono">System Status</h1>
              <p className="text-zinc-500 text-sm mt-1">
                Service health &middot; Real-time monitoring
              </p>
            </div>
            <div className="flex gap-2 items-center">
              <button
                onClick={() => setAutoRefresh(!autoRefresh)}
                className={`text-xs px-2 py-1 rounded border transition ${
                  autoRefresh
                    ? 'border-emerald-500/30 text-emerald-400 bg-emerald-500/10'
                    : 'border-zinc-700 text-zinc-500'
                }`}
              >
                {autoRefresh ? 'Auto 30s' : 'Paused'}
              </button>
              <button
                onClick={refresh}
                disabled={loading}
                className="text-xs px-3 py-1 rounded border border-zinc-700 text-zinc-400 hover:text-white hover:border-zinc-500 transition disabled:opacity-50"
              >
                {loading ? '...' : 'Refresh'}
              </button>
              <Link
                href="/tracker"
                className="text-xs px-3 py-1 rounded border border-zinc-700 text-zinc-400 hover:text-white hover:border-zinc-500 transition"
              >
                Tracker
              </Link>
            </div>
          </div>

          {/* Overall status banner */}
          {data && (
            <div className="mt-4 flex items-center gap-4">
              <div className={`text-lg font-bold font-mono uppercase ${overallColor}`}>
                {data.status}
              </div>
              <div className="text-xs text-zinc-600 font-mono">
                {upCount}/{serviceCount} services up
              </div>
              {data.check_duration_ms > 0 && (
                <div className="text-xs text-zinc-600 font-mono">
                  checked in {data.check_duration_ms}ms
                </div>
              )}
              {lastCheck && (
                <div className="text-xs text-zinc-600 font-mono ml-auto">
                  {formatTimestamp(lastCheck.toISOString())}
                </div>
              )}
            </div>
          )}
        </header>

        {/* Loading skeleton */}
        {loading && !data && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 7 }).map((_, i) => (
              <div key={i} className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-4 animate-pulse">
                <div className="h-5 w-32 bg-zinc-800 rounded mb-3" />
                <div className="space-y-2">
                  <div className="h-3 w-full bg-zinc-800/50 rounded" />
                  <div className="h-3 w-3/4 bg-zinc-800/50 rounded" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Service grid */}
        {data && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(data.services).map(([id, service]) => (
              <ServiceCard key={id} id={id} service={service} />
            ))}
          </div>
        )}

        {/* Footer */}
        <div className="mt-8 text-center text-xs text-zinc-700 font-mono">
          mind protocol &middot; system status
        </div>
      </div>
    </main>
  );
}
