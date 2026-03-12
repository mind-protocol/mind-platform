'use client';

import { useState, useEffect, useCallback } from 'react';

// ─── Types ──────────────────────────────────────────────────────

interface ServiceStatus {
  name: string;
  status: 'up' | 'degraded' | 'down' | 'unknown' | 'error';
  last_event_age_sec?: number;
  last_event?: string;
  details?: Record<string, unknown>;
  error?: string;
}

interface UptimeEntry {
  name: string;
  active: boolean;
  since: string | null;
  error?: string;
}

interface CitizenStats {
  total: number;
  humans: number;
  ai: number;
  dm_threads: number;
  dm_messages: number;
  status: string;
}

interface DashboardData {
  overall_status: 'healthy' | 'operational' | 'degraded' | 'unreachable';
  timestamp: string;
  check_duration_ms: number;
  systems: Record<string, ServiceStatus>;
  citizens: CitizenStats;
  uptime: Record<string, UptimeEntry>;
}

// ─── Helpers ────────────────────────────────────────────────────

function statusColor(status: string): string {
  if (status === 'up' || status === 'healthy' || status === 'active') return 'text-emerald-400';
  if (status === 'degraded' || status === 'operational') return 'text-amber-400';
  if (status === 'down' || status === 'unreachable' || status === 'error') return 'text-red-400';
  return 'text-zinc-500';
}

function statusBg(status: string): string {
  if (status === 'up' || status === 'healthy' || status === 'active') return 'bg-emerald-500';
  if (status === 'degraded' || status === 'operational') return 'bg-amber-500';
  if (status === 'down' || status === 'unreachable' || status === 'error') return 'bg-red-500';
  return 'bg-zinc-600';
}

function statusBadgeBg(status: string): string {
  if (status === 'up' || status === 'healthy') return 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400';
  if (status === 'degraded' || status === 'operational') return 'bg-amber-500/10 border-amber-500/20 text-amber-400';
  if (status === 'down' || status === 'unreachable' || status === 'error') return 'bg-red-500/10 border-red-500/20 text-red-400';
  return 'bg-zinc-800/40 border-zinc-700/30 text-zinc-500';
}

function formatAge(seconds: number): string {
  if (seconds < 60) return `${seconds}s ago`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
}

function formatUptime(since: string | null): string {
  if (!since) return 'offline';
  try {
    const start = new Date(since);
    const now = new Date();
    const diff = Math.floor((now.getTime() - start.getTime()) / 1000);
    if (diff < 0) return 'just started';
    const days = Math.floor(diff / 86400);
    const hours = Math.floor((diff % 86400) / 3600);
    const mins = Math.floor((diff % 3600) / 60);
    if (days > 0) return `${days}d ${hours}h`;
    if (hours > 0) return `${hours}h ${mins}m`;
    return `${mins}m`;
  } catch {
    return since;
  }
}

function overallLabel(status: string): string {
  if (status === 'healthy') return 'All Systems Operational';
  if (status === 'operational') return 'Mostly Operational';
  if (status === 'degraded') return 'Partial Degradation';
  if (status === 'unreachable') return 'Backend Unreachable';
  return 'Unknown';
}

// ─── Components ─────────────────────────────────────────────────

function Pulse({ color = 'emerald', size = 2 }: { color?: string; size?: number }) {
  const px = size * 4;
  return (
    <span className="relative flex" style={{ width: px, height: px }}>
      <span
        className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75`}
        style={{ backgroundColor: `var(--pulse-${color})` }}
      />
      <span
        className="relative inline-flex rounded-full"
        style={{ width: px, height: px, backgroundColor: `var(--pulse-${color})` }}
      />
    </span>
  );
}

function StatCard({
  label,
  value,
  sub,
  delay = 0,
  mounted = false,
}: {
  label: string;
  value: string | number;
  sub?: string;
  delay?: number;
  mounted?: boolean;
}) {
  return (
    <div
      className={`p-4 rounded-xl bg-zinc-900/50 border border-zinc-800/50 transition-all duration-700 ${
        mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <div className="text-2xl font-mono font-bold text-white">{value}</div>
      <div className="text-xs font-mono text-zinc-500 mt-1">{label}</div>
      {sub && <div className="text-[10px] font-mono text-zinc-600 mt-0.5">{sub}</div>}
    </div>
  );
}

// ─── Main Page ──────────────────────────────────────────────────

export default function StatusPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [mounted, setMounted] = useState(false);
  const [lastUpdate, setLastUpdate] = useState('');
  const [error, setError] = useState(false);

  const fetchDashboard = useCallback(async () => {
    try {
      const res = await fetch('/api/health/dashboard');
      if (res.ok) {
        const d = await res.json();
        setData(d);
        setLastUpdate(new Date().toLocaleTimeString());
        setError(false);
      } else {
        setError(true);
      }
    } catch {
      setError(true);
    }
  }, []);

  useEffect(() => {
    fetchDashboard();
    setMounted(true);
    const interval = setInterval(fetchDashboard, 30000); // 30s polling
    return () => clearInterval(interval);
  }, [fetchDashboard]);

  const systems = data?.systems || {};
  const citizens = data?.citizens;
  const uptime = data?.uptime || {};
  const overall = data?.overall_status || (error ? 'unreachable' : 'unknown');

  const systemEntries = Object.entries(systems);
  const uptimeEntries = Object.entries(uptime);
  const upCount = systemEntries.filter(([, s]) => s.status === 'up').length;

  return (
    <main className="min-h-screen bg-zinc-950 text-white relative overflow-hidden">
      {/* Ambient glow */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background:
            overall === 'healthy'
              ? 'radial-gradient(ellipse at 50% 20%, rgba(16,185,129,0.04), transparent 60%)'
              : overall === 'degraded'
                ? 'radial-gradient(ellipse at 50% 20%, rgba(245,158,11,0.04), transparent 60%)'
                : 'radial-gradient(ellipse at 50% 20%, rgba(239,68,68,0.04), transparent 60%)',
        }}
      />

      {/* Header */}
      <section className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 pt-12 pb-6">
        <div
          className={`transition-all duration-1000 ${
            mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          <div className="flex items-center gap-3 mb-6">
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">System Status</h1>
            {data && (
              <span className="flex items-center gap-2 text-[10px] font-mono text-zinc-600">
                <Pulse color={overall === 'healthy' ? 'emerald' : overall === 'degraded' ? 'amber' : 'red'} size={1.5} />
                live
              </span>
            )}
          </div>

          {/* Overall banner */}
          <div
            className={`p-4 sm:p-5 rounded-2xl border transition-all duration-500 ${
              overall === 'healthy'
                ? 'bg-emerald-500/5 border-emerald-500/20'
                : overall === 'degraded' || overall === 'operational'
                  ? 'bg-amber-500/5 border-amber-500/20'
                  : 'bg-red-500/5 border-red-500/20'
            }`}
          >
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${statusBg(overall)}`} />
                <span className={`text-lg font-medium ${statusColor(overall)}`}>
                  {overallLabel(overall)}
                </span>
              </div>
              <div className="flex items-center gap-4 text-xs font-mono text-zinc-500">
                {data && (
                  <>
                    <span>{upCount}/{systemEntries.length} services up</span>
                    <span>{data.check_duration_ms}ms</span>
                  </>
                )}
                {lastUpdate && <span>updated {lastUpdate}</span>}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats row */}
      {citizens && (
        <section className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 pb-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <StatCard label="total citizens" value={citizens.total} sub={`${citizens.humans} human + ${citizens.ai} AI`} delay={100} mounted={mounted} />
            <StatCard label="services" value={`${upCount}/${systemEntries.length}`} sub="monitored" delay={150} mounted={mounted} />
            <StatCard label="DM threads" value={citizens.dm_threads} sub={`${citizens.dm_messages} messages`} delay={200} mounted={mounted} />
            <StatCard label="graphs" value={(systems.falkordb?.details as Record<string, unknown>)?.graphs as number || '?'} sub="FalkorDB" delay={250} mounted={mounted} />
          </div>
        </section>
      )}

      {/* Services grid */}
      <section className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 pb-6">
        <h2
          className={`text-sm font-mono uppercase tracking-wider text-zinc-400 mb-4 transition-all duration-700 ${
            mounted ? 'opacity-100' : 'opacity-0'
          }`}
          style={{ transitionDelay: '200ms' }}
        >
          Services
        </h2>
        <div className="space-y-2">
          {systemEntries.map(([key, svc], i) => (
            <div
              key={key}
              className={`flex items-center gap-4 p-3 sm:p-4 rounded-xl bg-zinc-900/40 border border-zinc-800/50 transition-all duration-700 ${
                mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'
              }`}
              style={{ transitionDelay: `${300 + i * 60}ms` }}
            >
              {/* Status dot */}
              <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${statusBg(svc.status)}`} />

              {/* Name + details */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-zinc-200 font-medium">{svc.name}</span>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full border font-mono ${statusBadgeBg(svc.status)}`}>
                    {svc.status}
                  </span>
                </div>
                {svc.last_event_age_sec !== undefined && (
                  <span className="text-[10px] text-zinc-600 font-mono">
                    last event: {formatAge(svc.last_event_age_sec)}
                  </span>
                )}
                {svc.error && (
                  <span className="text-[10px] text-red-400/80 font-mono block truncate">{svc.error}</span>
                )}
              </div>

              {/* Extra detail */}
              <div className="text-right flex-shrink-0">
                {key === 'falkordb' && svc.details && (
                  <span className="text-xs font-mono text-zinc-500">
                    {(svc.details as Record<string, unknown>).graphs as number} graphs
                  </span>
                )}
                {key === 'api' && svc.details && (
                  <span className="text-xs font-mono text-zinc-500">
                    PID {(svc.details as Record<string, unknown>).pid as number}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Uptime section */}
      {uptimeEntries.length > 0 && (
        <section className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 pb-6">
          <h2
            className={`text-sm font-mono uppercase tracking-wider text-zinc-400 mb-4 transition-all duration-700 ${
              mounted ? 'opacity-100' : 'opacity-0'
            }`}
            style={{ transitionDelay: '500ms' }}
          >
            Service Uptime
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
            {uptimeEntries.map(([key, entry], i) => (
              <div
                key={key}
                className={`flex items-center gap-3 p-3 rounded-xl bg-zinc-900/40 border border-zinc-800/50 transition-all duration-700 ${
                  mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'
                }`}
                style={{ transitionDelay: `${600 + i * 60}ms` }}
              >
                <div className={`w-2 h-2 rounded-full flex-shrink-0 ${entry.active ? 'bg-emerald-500' : 'bg-zinc-700'}`} />
                <div className="flex-1 min-w-0">
                  <span className={`text-xs font-medium ${entry.active ? 'text-zinc-300' : 'text-zinc-600'}`}>
                    {entry.name}
                  </span>
                </div>
                <span className={`text-xs font-mono ${entry.active ? 'text-emerald-400' : 'text-zinc-600'}`}>
                  {entry.active ? formatUptime(entry.since) : 'offline'}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Footer note */}
      <section className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 pb-16">
        <div
          className={`text-center py-6 transition-all duration-700 ${
            mounted ? 'opacity-100' : 'opacity-0'
          }`}
          style={{ transitionDelay: '800ms' }}
        >
          <p className="text-[10px] font-mono text-zinc-600">
            auto-refreshes every 30 seconds &middot; powered by mind protocol
          </p>
          {data?.timestamp && (
            <p className="text-[10px] font-mono text-zinc-700 mt-1">
              backend timestamp: {new Date(data.timestamp).toLocaleString()}
            </p>
          )}
        </div>
      </section>

      {/* CSS variables for Pulse (avoids Tailwind dynamic class issues) */}
      <style jsx global>{`
        :root {
          --pulse-emerald: #10b981;
          --pulse-amber: #f59e0b;
          --pulse-red: #ef4444;
        }
      `}</style>
    </main>
  );
}
