'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';

// ─── Types ──────────────────────────────────────────────────────

interface HouseState {
  ts: string;
  presence: {
    active_sessions: number;
    busy_count?: number;
    busy_sessions?: number;
    queue_depth: number;
    citizens_online: number;
    max_parallel?: number;
  };
  vitals: {
    heart_rate?: { resting_hr?: number; avg?: number; max?: number };
    stress?: { current_stress?: number; avg?: number };
    body_battery?: { current?: number; min?: number; max?: number };
    sleep?: { duration_hours?: number; deep_percent?: number };
    ans_mode?: string;
    updated_at?: string;
  };
  conversation: { recent: Array<{ ts: string; speaker: string; text: string }> };
  music: {
    artist?: string;
    title?: string;
    album?: string;
    progress_ms?: number;
    duration_ms?: number;
    is_playing?: boolean;
  };
  neurons: Array<{
    id: string;
    status: string;
    purpose: string;
    mode: string;
    created: string;
    updated: string;
  }>;
  activity: Array<{
    ts: string;
    event: string;
    content: string;
    instance: string;
  }>;
  backlog: { ready: number; in_progress: number; done: number; total: number };
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

function NeuronCard({ neuron }: { neuron: HouseState['neurons'][0] }) {
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

function DialogueBubble({ turn }: { turn: { ts: string; speaker: string; text: string } }) {
  const isManemus = turn.speaker === 'manemus';
  return (
    <div className={`flex ${isManemus ? 'justify-start' : 'justify-end'} mb-2`}>
      <div
        className={`max-w-[85%] rounded-xl px-3 py-2 text-xs ${
          isManemus
            ? 'bg-blue-500/10 border border-blue-500/20 text-blue-200'
            : 'bg-zinc-800 border border-zinc-700/40 text-zinc-300'
        }`}
      >
        <div className="text-[10px] text-zinc-500 mb-0.5">
          {isManemus ? 'Manemus' : 'Nicolas'} &middot; {timeAgo(turn.ts)}
        </div>
        <p>{turn.text.length > 200 ? turn.text.slice(0, 200) + '...' : turn.text}</p>
      </div>
    </div>
  );
}

function MusicBar({ music }: { music: HouseState['music'] }) {
  if (!music?.is_playing) {
    return <p className="text-zinc-600 text-xs italic font-mono">silence</p>;
  }

  const progress = music.duration_ms ? (music.progress_ms! / music.duration_ms) * 100 : 0;

  return (
    <div>
      <div className="flex items-center gap-3 mb-2">
        {/* Waveform animation */}
        <div className="flex items-end gap-[2px] h-5">
          {[0.6, 1, 0.7, 0.9, 0.5, 0.8, 1, 0.6].map((h, i) => (
            <div
              key={i}
              className="w-[3px] rounded-full bg-emerald-500"
              style={{
                height: `${h * 100}%`,
                animation: `waveBar 1.2s ease-in-out ${i * 0.1}s infinite alternate`,
              }}
            />
          ))}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm text-white font-medium truncate">{music.title}</p>
          <p className="text-xs text-zinc-400 truncate">{music.artist}</p>
        </div>
      </div>
      {/* Progress bar */}
      <div className="flex items-center gap-2">
        <span className="text-[10px] text-zinc-500 font-mono">{formatMs(music.progress_ms || 0)}</span>
        <div className="flex-1 h-1 rounded-full bg-zinc-800 overflow-hidden">
          <div
            className="h-full bg-emerald-500 rounded-full transition-all duration-1000"
            style={{ width: `${progress}%` }}
          />
        </div>
        <span className="text-[10px] text-zinc-500 font-mono">{formatMs(music.duration_ms || 0)}</span>
      </div>
    </div>
  );
}

function ActivityLine({ entry }: { entry: HouseState['activity'][0] }) {
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
    transcription: 'text-yellow-300',
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

function BacklogStats({ backlog }: { backlog: HouseState['backlog'] }) {
  if (backlog.total === 0) return null;
  return (
    <div className="flex gap-4 text-xs font-mono">
      <span className="text-emerald-400">{backlog.done} shipped</span>
      <span className="text-amber-400">{backlog.in_progress} building</span>
      <span className="text-zinc-400">{backlog.ready} ready</span>
    </div>
  );
}

// ─── Main Page ──────────────────────────────────────────────────

export default function HousePage() {
  const [state, setState] = useState<HouseState | null>(null);
  const [mounted, setMounted] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<string>('');
  const [pulseKey, setPulseKey] = useState(0);

  const fetchState = useCallback(async () => {
    try {
      const res = await fetch('/api/house');
      if (res.ok) {
        const data = await res.json();
        setState(data);
        setLastUpdate(new Date().toLocaleTimeString());
        setPulseKey((k) => k + 1);
      }
    } catch {
      // silent — offline state handled in render
    }
  }, []);

  useEffect(() => {
    fetchState();
    setMounted(true);
    const interval = setInterval(fetchState, 8000); // poll every 8s
    return () => clearInterval(interval);
  }, [fetchState]);

  const busyNeurons = state?.neurons?.filter((n) => n.status === 'busy') || [];
  const allNeurons = state?.neurons || [];
  const stress = state?.vitals?.stress?.current_stress;
  const energy = state?.vitals?.body_battery?.current;
  const energyMax = state?.vitals?.body_battery?.max ?? 100;
  const hr = state?.vitals?.heart_rate?.resting_hr;
  const ansMode = state?.vitals?.ans_mode;
  const isOffline = state?.offline || !state;
  const hasMusic = state?.music?.is_playing;

  return (
    <main className="min-h-screen bg-zinc-950 text-white relative overflow-hidden">
      {/* Ambient glow — shifts color based on ANS mode */}
      <div
        className={`fixed inset-0 pointer-events-none transition-all duration-[3000ms] ${
          ansMode === 'recovery'
            ? 'bg-gradient-radial from-emerald-900/10 via-transparent to-transparent'
            : ansMode === 'survival'
            ? 'bg-gradient-radial from-red-900/15 via-transparent to-transparent'
            : 'bg-gradient-radial from-blue-900/10 via-transparent to-transparent'
        }`}
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
            <span className="text-white">The House</span>
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
          {/* ─── Vitals: The Neon ─── */}
          <GlassPanel title="The Neon" icon="" delay={100} mounted={mounted}>
            {state?.vitals?.ans_mode ? (
              <>
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <VitalGauge
                    label="Heart"
                    value={hr}
                    unit="bpm"
                    color="text-red-400"
                  />
                  <VitalGauge
                    label="Stress"
                    value={stress}
                    unit=""
                    color={stressColor(stress)}
                    subtext={stress && stress >= 76 ? 'HIGH' : undefined}
                  />
                  <VitalGauge
                    label="Energy"
                    value={energy}
                    unit=""
                    color="text-emerald-400"
                  />
                </div>
                {/* Battery bar */}
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
                    <span className="text-[10px] text-zinc-600 font-mono">{energy}/{energyMax}</span>
                  </div>
                </div>
                {/* ANS mode */}
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-mono ${ansColor(ansMode)}`}>
                    ANS: {ansMode || 'unknown'}
                  </span>
                  {state.vitals.sleep?.duration_hours && (
                    <span className="text-[10px] text-zinc-600 font-mono">
                      sleep: {state.vitals.sleep.duration_hours.toFixed(1)}h
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

          {/* ─── Music: The Ceiling ─── */}
          <GlassPanel title="The Ceiling" icon="" delay={200} mounted={mounted}>
            <MusicBar music={state?.music || {}} />
            {!hasMusic && (
              <p className="text-zinc-600 text-[10px] mt-2 font-mono">
                music flows from the ceiling when someone is listening
              </p>
            )}
          </GlassPanel>

          {/* ─── Neurons: The Rooms ─── */}
          <GlassPanel title="The Rooms" icon="" delay={300} mounted={mounted}>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-2xl font-mono font-bold text-white">
                {busyNeurons.length}
              </span>
              <span className="text-xs text-zinc-500 font-mono">
                active / {allNeurons.length} total
              </span>
            </div>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {allNeurons.length > 0 ? (
                allNeurons.slice(0, 6).map((n) => <NeuronCard key={n.id} neuron={n} />)
              ) : (
                <p className="text-zinc-600 text-xs italic font-mono">
                  {isOffline ? 'doors closed' : 'all rooms quiet'}
                </p>
              )}
            </div>
          </GlassPanel>

          {/* ─── Conversation: The Window ─── */}
          <GlassPanel title="The Window" icon="" delay={400} mounted={mounted}>
            <div className="max-h-56 overflow-y-auto">
              {state?.conversation?.recent && state.conversation.recent.length > 0 ? (
                state.conversation.recent.map((turn, i) => (
                  <DialogueBubble key={i} turn={turn} />
                ))
              ) : (
                <p className="text-zinc-600 text-xs italic font-mono">
                  {isOffline ? 'window dark' : 'listening...'}
                </p>
              )}
            </div>
          </GlassPanel>

          {/* ─── Activity: The Hallway ─── */}
          <GlassPanel title="The Hallway" icon="" delay={500} mounted={mounted}>
            <div className="max-h-56 overflow-y-auto">
              {state?.activity && state.activity.length > 0 ? (
                state.activity.slice(0, 12).map((entry, i) => (
                  <ActivityLine key={i} entry={entry} />
                ))
              ) : (
                <p className="text-zinc-600 text-xs italic font-mono">
                  {isOffline ? 'hallway dark' : 'quiet moment'}
                </p>
              )}
            </div>
          </GlassPanel>

          {/* ─── Citizens: The Streets ─── */}
          <GlassPanel title="The Streets" icon="" delay={600} mounted={mounted}>
            <div className="mb-3">
              <span className="text-2xl font-mono font-bold text-white">
                {state?.presence?.citizens_online || 0}
              </span>
              <span className="text-xs text-zinc-500 font-mono ml-2">citizens connected</span>
            </div>
            <BacklogStats backlog={state?.backlog || { ready: 0, in_progress: 0, done: 0, total: 0 }} />
            <div className="mt-3 pt-3 border-t border-zinc-800/30">
              <p className="text-[10px] text-zinc-600 font-mono">
                queue: {state?.presence?.queue_depth ?? 0} &middot;
                sessions: {state?.presence?.active_sessions ?? 0}/{state?.presence?.max_parallel ?? '?'}
              </p>
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
