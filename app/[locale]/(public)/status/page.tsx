'use client';

import { useState, useEffect, useCallback } from 'react';

// ─── Types ──────────────────────────────────────────────────────

interface ServiceStatus {
  name: string;
  status: 'up' | 'degraded' | 'down' | 'unknown' | 'error';
  last_event_age_sec?: number;
  details?: Record<string, unknown>;
  error?: string;
}

interface UptimeEntry {
  name: string;
  active: boolean;
  since: string | null;
}

interface CitizenStats {
  total: number;
  humans: number;
  ai: number;
  dm_threads: number;
  dm_messages: number;
  status: string;
}

interface Incident {
  id: string;
  service: string;
  service_display: string;
  severity: 'degraded' | 'down' | 'error';
  status: 'active' | 'resolved';
  started_at: string;
  resolved_at: string | null;
  duration_sec: number | null;
  description: string;
  cause: string | null;
  notes: string | null;
  resolution: string | null;
}

interface UptimePct {
  '24h': number;
  '7d': number;
  '30d': number;
}

interface DashboardData {
  overall_status: 'healthy' | 'operational' | 'degraded' | 'unreachable';
  timestamp: string;
  check_duration_ms: number;
  systems: Record<string, ServiceStatus>;
  citizens: CitizenStats;
  uptime: Record<string, UptimeEntry>;
  incidents: {
    active: Incident[];
    recent: Incident[];
  };
  uptime_pct: Record<string, UptimePct>;
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

function severityBorder(severity: string): string {
  if (severity === 'down' || severity === 'error') return 'border-red-500/30 bg-red-500/5';
  if (severity === 'degraded') return 'border-amber-500/30 bg-amber-500/5';
  return 'border-zinc-800/50 bg-zinc-900/40';
}

function formatAge(seconds: number): string {
  if (seconds < 60) return `${seconds}s ago`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
}

function formatDuration(seconds: number): string {
  if (seconds < 60) return `${seconds}s`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ${seconds % 60}s`;
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  return `${h}h ${m}m`;
}

function formatElapsed(isoStart: string): string {
  const start = new Date(isoStart);
  const now = new Date();
  const diff = Math.max(0, Math.floor((now.getTime() - start.getTime()) / 1000));
  return formatDuration(diff);
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

function formatTime(iso: string): string {
  try {
    return new Date(iso).toLocaleString();
  } catch {
    return iso;
  }
}

function overallLabel(status: string): string {
  if (status === 'healthy') return 'All Systems Operational';
  if (status === 'operational') return 'Mostly Operational';
  if (status === 'degraded') return 'Partial Degradation';
  if (status === 'unreachable') return 'Backend Unreachable';
  return 'Unknown';
}

function uptimeColor(pct: number): string {
  if (pct >= 99.9) return 'text-emerald-400';
  if (pct >= 99.0) return 'text-emerald-500';
  if (pct >= 95.0) return 'text-amber-400';
  return 'text-red-400';
}

function uptimeBarColor(pct: number): string {
  if (pct >= 99.9) return 'bg-emerald-500';
  if (pct >= 99.0) return 'bg-emerald-600';
  if (pct >= 95.0) return 'bg-amber-500';
  return 'bg-red-500';
}

// ─── Components ─────────────────────────────────────────────────

function Pulse({ color = 'emerald', size = 2 }: { color?: string; size?: number }) {
  const px = size * 4;
  return (
    <span className="relative flex" style={{ width: px, height: px }}>
      <span
        className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
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
    const interval = setInterval(fetchDashboard, 30000);
    return () => clearInterval(interval);
  }, [fetchDashboard]);

  const systems = data?.systems || {};
  const citizens = data?.citizens;
  const uptime = data?.uptime || {};
  const incidents = data?.incidents;
  const uptimePct = data?.uptime_pct || {};
  const overall = data?.overall_status || (error ? 'unreachable' : 'unknown');

  const systemEntries = Object.entries(systems);
  const uptimeEntries = Object.entries(uptime);
  const uptimePctEntries = Object.entries(uptimePct);
  const upCount = systemEntries.filter(([, s]) => s.status === 'up').length;
  const activeIncidents = incidents?.active || [];
  const recentIncidents = incidents?.recent || [];

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

      {/* Active incidents */}
      {activeIncidents.length > 0 && (
        <section className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 pb-6">
          <div className="space-y-2">
            {activeIncidents.map((inc) => (
              <div
                key={inc.id}
                className={`p-4 rounded-xl border ${severityBorder(inc.severity)}`}
              >
                <div className="flex items-center gap-3 mb-2">
                  <Pulse color={inc.severity === 'down' ? 'red' : 'amber'} size={1.5} />
                  <span className="text-sm font-medium text-zinc-200">{inc.service_display}</span>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full border font-mono ${statusBadgeBg(inc.severity)}`}>
                    {inc.severity}
                  </span>
                  <span className="text-[10px] font-mono text-zinc-500 ml-auto">
                    ongoing for {formatElapsed(inc.started_at)}
                  </span>
                </div>
                <p className="text-xs text-zinc-400 font-mono">{inc.description}</p>
                <p className="text-[10px] text-zinc-600 font-mono mt-1">
                  started {formatTime(inc.started_at)}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

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
              <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${statusBg(svc.status)}`} />
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

      {/* Uptime percentages */}
      {uptimePctEntries.length > 0 && (
        <section className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 pb-6">
          <h2
            className={`text-sm font-mono uppercase tracking-wider text-zinc-400 mb-4 transition-all duration-700 ${
              mounted ? 'opacity-100' : 'opacity-0'
            }`}
            style={{ transitionDelay: '450ms' }}
          >
            Uptime
          </h2>
          <div className="space-y-3">
            {uptimePctEntries.map(([key, pct], i) => {
              const svc = systems[key];
              return (
                <div
                  key={key}
                  className={`p-3 rounded-xl bg-zinc-900/40 border border-zinc-800/50 transition-all duration-700 ${
                    mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'
                  }`}
                  style={{ transitionDelay: `${500 + i * 50}ms` }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-zinc-300 font-medium">{svc?.name || key}</span>
                    <div className="flex items-center gap-4 text-[10px] font-mono">
                      <span className={uptimeColor(pct['24h'])}>{pct['24h']}% <span className="text-zinc-600">24h</span></span>
                      <span className={uptimeColor(pct['7d'])}>{pct['7d']}% <span className="text-zinc-600">7d</span></span>
                      <span className={uptimeColor(pct['30d'])}>{pct['30d']}% <span className="text-zinc-600">30d</span></span>
                    </div>
                  </div>
                  <div className="h-1.5 rounded-full bg-zinc-800 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-1000 ${uptimeBarColor(pct['30d'])}`}
                      style={{ width: `${pct['30d']}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Service uptime (systemd) */}
      {uptimeEntries.length > 0 && (
        <section className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 pb-6">
          <h2
            className={`text-sm font-mono uppercase tracking-wider text-zinc-400 mb-4 transition-all duration-700 ${
              mounted ? 'opacity-100' : 'opacity-0'
            }`}
            style={{ transitionDelay: '600ms' }}
          >
            Process Uptime
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
            {uptimeEntries.map(([key, entry], i) => (
              <div
                key={key}
                className={`flex items-center gap-3 p-3 rounded-xl bg-zinc-900/40 border border-zinc-800/50 transition-all duration-700 ${
                  mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'
                }`}
                style={{ transitionDelay: `${700 + i * 60}ms` }}
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

      {/* Recent incidents */}
      {recentIncidents.length > 0 && (
        <section className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 pb-6">
          <h2
            className={`text-sm font-mono uppercase tracking-wider text-zinc-400 mb-4 transition-all duration-700 ${
              mounted ? 'opacity-100' : 'opacity-0'
            }`}
            style={{ transitionDelay: '800ms' }}
          >
            Recent Incidents
          </h2>
          <div className="space-y-2">
            {recentIncidents.map((inc, i) => (
              <div
                key={inc.id}
                className={`p-3 sm:p-4 rounded-xl bg-zinc-900/40 border border-zinc-800/50 transition-all duration-700 ${
                  mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'
                }`}
                style={{ transitionDelay: `${900 + i * 50}ms` }}
              >
                <div className="flex items-center gap-3 mb-1">
                  <div className={`w-2 h-2 rounded-full flex-shrink-0 ${statusBg(inc.severity)}`} />
                  <span className="text-xs text-zinc-300 font-medium">{inc.service_display}</span>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full border font-mono ${statusBadgeBg(inc.severity)}`}>
                    {inc.severity}
                  </span>
                  <span className="text-[10px] font-mono text-zinc-600 ml-auto">
                    {inc.duration_sec !== null ? formatDuration(inc.duration_sec) : '?'}
                  </span>
                </div>
                <p className="text-[10px] text-zinc-500 font-mono">{inc.description}</p>
                <div className="flex items-center gap-4 mt-1 text-[10px] text-zinc-600 font-mono">
                  <span>{formatTime(inc.started_at)}</span>
                  {inc.resolution && <span>{inc.resolution}</span>}
                </div>
                {inc.cause && (
                  <p className="text-[10px] text-zinc-400 font-mono mt-1">
                    cause: {inc.cause}
                  </p>
                )}
                {inc.notes && (
                  <p className="text-[10px] text-zinc-500 font-mono mt-0.5">
                    {inc.notes}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* No incidents message */}
      {data && activeIncidents.length === 0 && recentIncidents.length === 0 && (
        <section className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 pb-6">
          <div
            className={`text-center p-6 rounded-xl bg-zinc-900/30 border border-zinc-800/30 transition-all duration-700 ${
              mounted ? 'opacity-100' : 'opacity-0'
            }`}
            style={{ transitionDelay: '800ms' }}
          >
            <p className="text-xs font-mono text-zinc-500">
              No incidents in the past 7 days
            </p>
          </div>
        </section>
      )}

      {/* Footer */}
      <section className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 pb-16">
        <div
          className={`text-center py-6 transition-all duration-700 ${
            mounted ? 'opacity-100' : 'opacity-0'
          }`}
          style={{ transitionDelay: '1000ms' }}
        >
          <p className="text-[10px] font-mono text-zinc-600">
            auto-refreshes every 30 seconds &middot; powered by mind protocol
          </p>
          {data?.timestamp && (
            <p className="text-[10px] font-mono text-zinc-700 mt-1">
              backend: {new Date(data.timestamp).toLocaleString()}
            </p>
          )}
        </div>
      </section>

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
