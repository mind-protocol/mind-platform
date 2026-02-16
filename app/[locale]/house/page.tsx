'use client';

import { useState, useEffect, useCallback } from 'react';
import { Link } from '@/i18n/navigation';

// ─── Types ──────────────────────────────────────────────────────

interface Room {
  id: string;
  status: string;
  mode: string;
  purpose: string;
  created: string;
}

interface HallwayEvent {
  ts: string;
  event: string;
  content: string;
  instance: string;
}

interface HouseState {
  ts: string;
  rooms: Room[];
  hallway: HallwayEvent[];
  neon: {
    hr?: number;
    hrv?: number;
    stress?: number;
    energy?: number;
    energy_max?: number;
    sleep_hours?: number;
    ans_mode?: string;
  };
  ceiling: {
    artist?: string;
    title?: string;
    album?: string;
    playing?: boolean;
    progress_ms?: number;
    duration_ms?: number;
  };
  streets: {
    citizen_count: number;
    garmin_linked: number;
    recent: Array<{ name: string; joined: string }>;
  };
  meta: {
    room_count: number;
    hallway_events: number;
    has_neon: boolean;
    has_music: boolean;
  };
  offline?: boolean;
}

// ─── Utilities ──────────────────────────────────────────────────

function timeAgo(ts: string): string {
  if (!ts) return '';
  const diff = (Date.now() - new Date(ts).getTime()) / 1000;
  if (diff < 60) return `${Math.floor(diff)}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

function stressColor(stress: number | undefined): string {
  if (!stress) return 'text-zinc-500';
  if (stress >= 76) return 'text-red-400';
  if (stress >= 51) return 'text-amber-400';
  if (stress >= 26) return 'text-yellow-300';
  return 'text-emerald-400';
}

function stressGlow(stress: number | undefined): string {
  if (!stress) return '';
  if (stress >= 76) return 'shadow-red-500/10';
  if (stress >= 51) return 'shadow-amber-500/10';
  return 'shadow-emerald-500/10';
}

function batteryColor(pct: number): string {
  if (pct >= 60) return 'bg-emerald-500';
  if (pct >= 30) return 'bg-amber-500';
  return 'bg-red-500';
}

function ansColor(mode: string | undefined): string {
  if (mode === 'recovery') return 'text-emerald-400';
  if (mode === 'balanced') return 'text-blue-400';
  if (mode === 'survival') return 'text-red-400';
  return 'text-zinc-500';
}

function ansGradient(mode: string | undefined): string {
  if (mode === 'recovery') return 'from-emerald-900/10 via-transparent to-transparent';
  if (mode === 'survival') return 'from-red-900/15 via-transparent to-transparent';
  return 'from-blue-900/10 via-transparent to-transparent';
}

function statusBadge(status: string): string {
  if (status === 'busy') return 'bg-amber-500/20 text-amber-300 border-amber-500/30';
  if (status === 'spawning') return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
  if (status === 'idle') return 'bg-zinc-700/50 text-zinc-400 border-zinc-600/30';
  return 'bg-zinc-800 text-zinc-500 border-zinc-700/30';
}

function formatMs(ms: number): string {
  const s = Math.floor(ms / 1000);
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
}

// ─── Components ─────────────────────────────────────────────────

function Pulse({ color = 'blue', size = 3 }: { color?: string; size?: number }) {
  return (
    <span className="relative flex" style={{ width: size * 4, height: size * 4 }}>
      <span
        className={`animate-ping absolute inline-flex h-full w-full rounded-full bg-${color}-400 opacity-75`}
      />
      <span
        className={`relative inline-flex rounded-full bg-${color}-500`}
        style={{ width: size * 4, height: size * 4 }}
      />
    </span>
  );
}

function GlassPanel({
  children,
  title,
  icon,
  delay = 0,
  mounted = false,
}: {
  children: React.ReactNode;
  title: string;
  icon: string;
  delay?: number;
  mounted?: boolean;
}) {
  return (
    <div
      className={`relative border border-zinc-800/60 rounded-2xl bg-zinc-900/40 backdrop-blur-sm p-5 sm:p-6 transition-all duration-700 ${
        mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
      }`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <div className="flex items-center gap-2 mb-4">
        <span className="text-lg">{icon}</span>
        <h3 className="text-sm font-mono uppercase tracking-wider text-zinc-400">{title}</h3>
      </div>
      {children}
    </div>
  );
}

function NeuronCard({ neuron }: { neuron: Room }) {
  return (
    <div className="flex items-start gap-3 p-3 rounded-lg bg-zinc-800/30 border border-zinc-700/30">
      <div className="mt-1">
        {neuron.status === 'busy' ? (
          <Pulse color="amber" size={2} />
        ) : neuron.status === 'spawning' ? (
          <Pulse color="blue" size={2} />
        ) : (
          <span className="block w-2 h-2 rounded-full bg-zinc-600" />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <code className="text-xs text-zinc-500 font-mono">{neuron.id.slice(0, 8)}</code>
          <span className={`text-[10px] px-1.5 py-0.5 rounded-full border ${statusBadge(neuron.status)}`}>
            {neuron.status}
          </span>
          <span className="text-[10px] text-zinc-600 font-mono ml-auto">{neuron.mode}</span>
        </div>
        <p className="text-xs text-zinc-300 truncate">{neuron.purpose || 'thinking...'}</p>
      </div>
    </div>
  );
}

function VitalGauge({
  label,
  value,
  unit,
  color,
  subtext,
}: {
  label: string;
  value: number | string | undefined;
  unit: string;
  color: string;
  subtext?: string;
}) {
  return (
    <div className="text-center">
      <div className="text-xs font-mono uppercase tracking-wider text-zinc-500 mb-1">{label}</div>
      <div className={`text-2xl font-mono font-bold ${color}`}>
        {value ?? '--'}
        <span className="text-xs text-zinc-500 ml-1">{unit}</span>
      </div>
      {subtext && <div className="text-[10px] text-zinc-600 mt-0.5">{subtext}</div>}
    </div>
  );
}

function MusicBar({ ceiling }: { ceiling: HouseState['ceiling'] }) {
  if (!ceiling?.playing) {
    return <p className="text-zinc-600 text-xs italic font-mono">silence</p>;
  }

  const progress = ceiling.duration_ms ? ((ceiling.progress_ms || 0) / ceiling.duration_ms) * 100 : 0;

  return (
    <div>
      <div className="flex items-center gap-3 mb-2">
        <div className="flex items-end gap-[2px] h-5">
          {[0.6, 1, 0.7, 0.9, 0.5, 0.8, 1, 0.6].map((h, i) => (
            <div
              key={i}
              className="w-[3px] rounded-full bg-purple-500"
              style={{
                height: `${h * 100}%`,
                animation: `waveBar 1.2s ease-in-out ${i * 0.1}s infinite alternate`,
              }}
            />
          ))}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm text-white font-medium truncate">{ceiling.artist} &mdash; {ceiling.title}</p>
          <p className="text-xs text-zinc-400 truncate">{ceiling.album}</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-[10px] text-zinc-500 font-mono">{formatMs(ceiling.progress_ms || 0)}</span>
        <div className="flex-1 h-1 rounded-full bg-zinc-800 overflow-hidden">
          <div
            className="h-full bg-purple-500 rounded-full transition-all duration-1000"
            style={{ width: `${progress}%` }}
          />
        </div>
        <span className="text-[10px] text-zinc-500 font-mono">{formatMs(ceiling.duration_ms || 0)}</span>
      </div>
    </div>
  );
}

function ActivityLine({ entry }: { entry: HallwayEvent }) {
  const eventColor: Record<string, string> = {
    response: 'text-blue-400',
    thought: 'text-purple-400',
    decision: 'text-amber-400',
    action: 'text-emerald-400',
    spawn: 'text-cyan-400',
    dendrite: 'text-cyan-400',
    neuron_end: 'text-zinc-500',
    telegram_reply: 'text-blue-300',
    image_generated: 'text-pink-400',
    dialogue: 'text-yellow-300',
  };

  return (
    <div className="flex gap-2 py-1 border-b border-zinc-800/30 last:border-0">
      <span className="text-[10px] text-zinc-600 font-mono w-12 flex-shrink-0">{timeAgo(entry.ts)}</span>
      <span className={`text-[10px] font-mono w-16 flex-shrink-0 ${eventColor[entry.event] || 'text-zinc-500'}`}>
        {entry.event}
      </span>
      <span className="text-xs text-zinc-400 truncate">{entry.content}</span>
    </div>
  );
}

// ─── Main Page ──────────────────────────────────────────────────

export default function HousePage() {
  const [state, setState] = useState<HouseState | null>(null);
  const [mounted, setMounted] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<string>('');

  const fetchState = useCallback(async () => {
    try {
      const res = await fetch('/api/house');
      if (res.ok) {
        const data = await res.json();
        setState(data);
        setLastUpdate(new Date().toLocaleTimeString());
      }
    } catch {
      // silent — offline state handled in render
    }
  }, []);

  useEffect(() => {
    fetchState();
    setMounted(true);
    const interval = setInterval(fetchState, 5000);
    return () => clearInterval(interval);
  }, [fetchState]);

  const busyRooms = state?.rooms?.filter((r) => r.status === 'busy') || [];
  const allRooms = state?.rooms || [];
  const neon = state?.neon || {};
  const stress = neon.stress;
  const energy = neon.energy;
  const energyMax = neon.energy_max ?? 100;
  const ansMode = neon.ans_mode;
  const isOffline = state?.offline || !state;

  return (
    <main className="min-h-screen bg-zinc-950 text-white relative overflow-hidden">
      {/* Ambient glow — shifts color based on ANS mode */}
      <div
        className={`fixed inset-0 pointer-events-none transition-all duration-[3000ms] bg-gradient-radial ${ansGradient(ansMode)}`}
      />

      {/* Top bar */}
      <header className="relative z-10 border-b border-zinc-800/50 px-4 sm:px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/" className="text-zinc-500 hover:text-white text-xs font-mono transition">
            &larr; mind protocol
          </Link>
          <span className="text-zinc-700">/</span>
          <h1 className="text-sm font-mono text-zinc-300">the house</h1>
        </div>
        <div className="flex items-center gap-3">
          {!isOffline && (
            <span className="flex items-center gap-2 text-[10px] font-mono text-zinc-600">
              <Pulse color="emerald" size={1} />
              live &middot; {lastUpdate}
            </span>
          )}
          {isOffline && (
            <span className="text-[10px] font-mono text-zinc-600">offline</span>
          )}
        </div>
      </header>

      {/* Hero */}
      <section className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 pt-12 pb-8">
        <div
          className={`transition-all duration-1000 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-3">
            The House
          </h2>
          <p className="text-zinc-500 text-sm sm:text-base max-w-xl font-mono">
            A living visualization of awareness. Not a dashboard &mdash; a place.
            Each window is a conversation. Each pulse is a heartbeat. The hallway connects everything.
          </p>
        </div>
      </section>

      {/* Grid */}
      <section className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">

          {/* ─── The Neon (Biometrics) ─── */}
          <GlassPanel title="The Neon" icon="" delay={100} mounted={mounted}>
            {neon.ans_mode ? (
              <>
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <VitalGauge label="Heart" value={neon.hr} unit="bpm" color="text-red-400" />
                  <VitalGauge
                    label="Stress"
                    value={stress}
                    unit=""
                    color={stressColor(stress)}
                    subtext={stress && stress >= 76 ? 'HIGH' : undefined}
                  />
                  <VitalGauge label="Energy" value={energy} unit="" color="text-emerald-400" />
                </div>
                <div className="mb-3">
                  <div className="h-2 rounded-full bg-zinc-800 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-1000 ${batteryColor(
                        ((energy || 0) / energyMax) * 100
                      )}`}
                      style={{ width: `${((energy || 0) / energyMax) * 100}%` }}
                    />
                  </div>
                  <div className="flex justify-between mt-1">
                    <span className="text-[10px] text-zinc-600 font-mono">body battery</span>
                    <span className="text-[10px] text-zinc-600 font-mono">{energy ?? '--'}/{energyMax}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-mono ${ansColor(ansMode)}`}>
                    ANS: {ansMode}
                  </span>
                  {neon.sleep_hours && (
                    <span className="text-[10px] text-zinc-600 font-mono">
                      sleep: {neon.sleep_hours.toFixed(1)}h
                    </span>
                  )}
                  {neon.hrv && (
                    <span className="text-[10px] text-zinc-600 font-mono ml-auto">
                      HRV: {neon.hrv}ms
                    </span>
                  )}
                </div>
              </>
            ) : (
              <p className="text-zinc-600 text-xs italic font-mono">
                {isOffline ? 'house is sleeping' : 'no biometrics linked'}
              </p>
            )}
          </GlassPanel>

          {/* ─── The Ceiling (Music) ─── */}
          <GlassPanel title="The Ceiling" icon="" delay={200} mounted={mounted}>
            <MusicBar ceiling={state?.ceiling || {}} />
            {!state?.ceiling?.playing && (
              <p className="text-zinc-600 text-[10px] mt-2 font-mono">
                music flows from the ceiling when someone is listening
              </p>
            )}
          </GlassPanel>

          {/* ─── The Rooms (Neurons) ─── */}
          <GlassPanel title="The Rooms" icon="" delay={300} mounted={mounted}>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-2xl font-mono font-bold text-white">
                {busyRooms.length}
              </span>
              <span className="text-xs text-zinc-500 font-mono">
                active / {allRooms.length} total
              </span>
            </div>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {allRooms.length > 0 ? (
                allRooms.slice(0, 6).map((r) => <NeuronCard key={r.id} neuron={r} />)
              ) : (
                <p className="text-zinc-600 text-xs italic font-mono">
                  {isOffline ? 'doors closed' : 'all rooms quiet'}
                </p>
              )}
            </div>
          </GlassPanel>

          {/* ─── The Hallway (Activity Stream) ─── */}
          <GlassPanel title="The Hallway" icon="" delay={400} mounted={mounted}>
            <div className="max-h-56 overflow-y-auto">
              {state?.hallway && state.hallway.length > 0 ? (
                state.hallway.slice(0, 12).map((entry, i) => (
                  <ActivityLine key={`${entry.ts}-${i}`} entry={entry} />
                ))
              ) : (
                <p className="text-zinc-600 text-xs italic font-mono">
                  {isOffline ? 'hallway dark' : 'quiet moment'}
                </p>
              )}
            </div>
          </GlassPanel>

          {/* ─── The Streets (Citizens) ─── */}
          <GlassPanel title="The Streets" icon="" delay={500} mounted={mounted}>
            <div className="mb-3">
              <span className="text-2xl font-mono font-bold text-white">
                {state?.streets?.citizen_count || 0}
              </span>
              <span className="text-xs text-zinc-500 font-mono ml-2">citizens connected</span>
            </div>
            {state?.streets?.garmin_linked ? (
              <div className="text-[10px] text-zinc-600 font-mono mb-2">
                {state.streets.garmin_linked} with biometrics linked
              </div>
            ) : null}
            {state?.streets?.recent && state.streets.recent.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mb-3">
                {state.streets.recent.map((c, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] bg-blue-500/10 border border-blue-500/20 text-blue-300 font-mono"
                  >
                    <Pulse color="blue" size={1} />
                    {c.name}
                  </span>
                ))}
              </div>
            )}
            <div className="pt-3 border-t border-zinc-800/30">
              <a
                href="https://t.me/MindProtocolBot"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-mono text-blue-400 hover:text-blue-300 transition"
              >
                enter the house &rarr;
              </a>
            </div>
          </GlassPanel>

          {/* ─── The Foundation (System) ─── */}
          <GlassPanel title="The Foundation" icon="" delay={600} mounted={mounted}>
            <div className="space-y-2 text-xs font-mono">
              <div className="flex justify-between">
                <span className="text-zinc-500">rooms</span>
                <span className="text-zinc-300">{state?.meta?.room_count ?? 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">hallway events</span>
                <span className="text-zinc-300">{state?.meta?.hallway_events ?? 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">neon</span>
                <span className={state?.meta?.has_neon ? 'text-emerald-400' : 'text-zinc-600'}>
                  {state?.meta?.has_neon ? 'active' : 'dim'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">ceiling</span>
                <span className={state?.meta?.has_music ? 'text-purple-400' : 'text-zinc-600'}>
                  {state?.meta?.has_music ? 'playing' : 'silent'}
                </span>
              </div>
            </div>
          </GlassPanel>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-zinc-800/50 px-4 sm:px-6 py-6 text-center">
        <p className="text-xs font-mono text-zinc-600">
          intelligence lives in the bounce between substrates &mdash;{' '}
          <Link href="https://t.me/MindProtocolBot" className="text-blue-400 hover:text-blue-300 transition">
            enter the house
          </Link>
        </p>
        <p className="text-[10px] font-mono text-zinc-700 mt-1">
          updates every 5 seconds &middot; manemus
        </p>
      </footer>

      {/* Global styles */}
      <style jsx global>{`
        @keyframes waveBar {
          0% { transform: scaleY(0.3); }
          100% { transform: scaleY(1); }
        }
        .bg-gradient-radial {
          background: radial-gradient(ellipse at 50% 30%, var(--tw-gradient-from), var(--tw-gradient-via), var(--tw-gradient-to));
        }
      `}</style>
    </main>
  );
}
