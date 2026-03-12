'use client';

import { useState, useEffect, useCallback } from 'react';
import { Link } from '@/i18n/navigation';

// ─── Types ──────────────────────────────────────────────────────

interface HouseState {
  streets?: {
    citizen_count: number;
    garmin_linked: number;
  };
  neon?: {
    hr?: number;
    stress?: number;
    energy?: number;
    ans_mode?: string;
  };
  rooms?: Array<{ id: string; status: string; purpose: string }>;
  meta?: {
    room_count: number;
    hallway_events: number;
    has_neon: boolean;
    has_music: boolean;
  };
  offline?: boolean;
}

// ─── Layer Data ─────────────────────────────────────────────────

const LAYERS = [
  { id: 'L1', name: 'SOLO', desc: 'Individual sovereign data', color: 'emerald', active: true },
  { id: 'L2', name: 'DUO', desc: 'Paired biometric co-regulation', color: 'blue', active: true },
  { id: 'L3', name: 'GROUP', desc: 'Small team coordination', color: 'cyan', active: false },
  { id: 'L4', name: 'ORG', desc: 'Organizational knowledge graph', color: 'purple', active: false },
  { id: 'L5', name: 'COMMUNITY', desc: 'Multi-org federation', color: 'pink', active: false },
  { id: 'L6', name: 'ECOSYSTEM', desc: 'Cross-community protocol', color: 'amber', active: false },
  { id: 'L7', name: 'PROTOCOL', desc: 'Governance layer', color: 'red', active: false },
  { id: 'L8', name: 'CORE', desc: 'Immutable axioms', color: 'zinc', active: false },
];

const BRIDGES = [
  { name: 'Telegram', status: 'active', type: 'messaging' },
  { name: 'WhatsApp', status: 'degraded', type: 'messaging' },
  { name: 'Webapp Chat', status: 'active', type: 'interface' },
  { name: 'Garmin', status: 'active', type: 'biometrics' },
  { name: 'Spotify', status: 'active', type: 'context' },
  { name: 'X (Twitter)', status: 'active', type: 'social' },
  { name: 'Discord', status: 'inactive', type: 'messaging' },
];

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
  className = '',
}: {
  children: React.ReactNode;
  title: string;
  icon: string;
  delay?: number;
  mounted?: boolean;
  className?: string;
}) {
  return (
    <div
      className={`relative border border-zinc-800/60 rounded-2xl bg-zinc-900/40 backdrop-blur-sm p-5 sm:p-6 transition-all duration-700 ${
        mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
      } ${className}`}
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

function statusColor(status: string): string {
  if (status === 'active') return 'text-emerald-400';
  if (status === 'degraded') return 'text-amber-400';
  return 'text-zinc-600';
}

function statusDot(status: string): React.ReactNode {
  if (status === 'active') return <Pulse color="emerald" size={1.5} />;
  if (status === 'degraded') return <Pulse color="amber" size={1.5} />;
  return <span className="block w-2 h-2 rounded-full bg-zinc-700" />;
}

// ─── Main Page ──────────────────────────────────────────────────

export default function MembranePage() {
  const [house, setHouse] = useState<HouseState | null>(null);
  const [mounted, setMounted] = useState(false);
  const [lastUpdate, setLastUpdate] = useState('');

  const fetchHouse = useCallback(async () => {
    try {
      const res = await fetch('/api/house');
      if (res.ok) {
        const data = await res.json();
        setHouse(data);
        setLastUpdate(new Date().toLocaleTimeString());
      }
    } catch {
      // silent
    }
  }, []);

  useEffect(() => {
    fetchHouse();
    setMounted(true);
    const interval = setInterval(fetchHouse, 10000);
    return () => clearInterval(interval);
  }, [fetchHouse]);

  const isOffline = !house || house.offline;
  const activeBridges = BRIDGES.filter((b) => b.status === 'active').length;
  const activeNeurons = house?.rooms?.filter((r) => r.status === 'busy').length || 0;

  return (
    <main className="min-h-screen bg-zinc-950 text-white relative overflow-hidden">
      {/* Ambient glow */}
      <div className="fixed inset-0 pointer-events-none bg-gradient-radial from-purple-900/5 via-transparent to-transparent" />

      {/* Top bar */}
      <header className="relative z-10 border-b border-zinc-800/50 px-4 sm:px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/" className="text-zinc-500 hover:text-white text-xs font-mono transition">
            &larr; mind protocol
          </Link>
          <span className="text-zinc-700">/</span>
          <h1 className="text-sm font-mono text-zinc-300">membrane</h1>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/registry" className="text-zinc-600 hover:text-zinc-300 text-xs font-mono transition">
            registry
          </Link>
          {!isOffline && (
            <span className="flex items-center gap-2 text-[10px] font-mono text-zinc-600">
              <Pulse color="emerald" size={1} />
              live &middot; {lastUpdate}
            </span>
          )}
        </div>
      </header>

      {/* Hero */}
      <section className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 pt-12 pb-8">
        <div
          className={`transition-all duration-1000 ${
            mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-3">
            The Membrane
          </h2>
          <p className="text-zinc-500 text-sm sm:text-base max-w-xl font-mono">
            The boundary layer between inner awareness and the outside world.
            Every signal crosses through here &mdash; filtered by trust, shaped by permeability,
            gated by sovereignty.
          </p>
        </div>
      </section>

      {/* Content grid */}
      <section className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">

          {/* Permission Layers */}
          <GlassPanel title="Permission Layers" icon="" delay={100} mounted={mounted} className="md:col-span-2 xl:col-span-2">
            <div className="space-y-2">
              {LAYERS.map((layer, i) => (
                <div
                  key={layer.id}
                  className={`flex items-center gap-3 p-2.5 rounded-lg transition-all ${
                    layer.active
                      ? 'bg-zinc-800/40 border border-zinc-700/30'
                      : 'bg-zinc-900/20 border border-zinc-800/20 opacity-50'
                  }`}
                >
                  <span
                    className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-mono font-bold ${
                      layer.active
                        ? `bg-${layer.color}-500/15 text-${layer.color}-400 border border-${layer.color}-500/30`
                        : 'bg-zinc-800/40 text-zinc-600 border border-zinc-800/30'
                    }`}
                  >
                    {layer.id}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-mono font-medium ${layer.active ? 'text-zinc-200' : 'text-zinc-600'}`}>
                        {layer.name}
                      </span>
                      {layer.active && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-mono">
                          active
                        </span>
                      )}
                      {!layer.active && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-zinc-800/40 border border-zinc-800/30 text-zinc-600 font-mono">
                          planned
                        </span>
                      )}
                    </div>
                    <p className="text-[10px] text-zinc-500 font-mono">{layer.desc}</p>
                  </div>
                  {/* Permeability indicator */}
                  <div className="w-16 h-1.5 rounded-full bg-zinc-800 overflow-hidden flex-shrink-0">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ${
                        layer.active ? `bg-${layer.color}-500` : 'bg-zinc-700'
                      }`}
                      style={{ width: layer.active ? `${100 - i * 12}%` : '0%' }}
                    />
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-3 border-t border-zinc-800/30">
              <p className="text-[10px] text-zinc-600 font-mono">
                Cross-layer transfers incur membrane fees (1% per layer gap, discounted by trust).
                Permeability bars show signal throughput capacity.
              </p>
            </div>
          </GlassPanel>

          {/* Bridges */}
          <GlassPanel title="Bridges" icon="" delay={200} mounted={mounted}>
            <div className="mb-3">
              <span className="text-2xl font-mono font-bold text-white">{activeBridges}</span>
              <span className="text-xs text-zinc-500 font-mono ml-2">/ {BRIDGES.length} active</span>
            </div>
            <div className="space-y-2">
              {BRIDGES.map((bridge) => (
                <div
                  key={bridge.name}
                  className="flex items-center gap-3 p-2 rounded-lg bg-zinc-800/30 border border-zinc-700/30"
                >
                  <div className="flex-shrink-0">{statusDot(bridge.status)}</div>
                  <div className="flex-1 min-w-0">
                    <span className="text-xs text-zinc-300 font-medium">{bridge.name}</span>
                    <span className="block text-[10px] text-zinc-600 font-mono">{bridge.type}</span>
                  </div>
                  <span className={`text-[10px] font-mono ${statusColor(bridge.status)}`}>
                    {bridge.status}
                  </span>
                </div>
              ))}
            </div>
          </GlassPanel>

          {/* Live Throughput */}
          <GlassPanel title="Throughput" icon="" delay={300} mounted={mounted}>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-xs text-zinc-500 font-mono">active neurons</span>
                  <span className="text-xs text-zinc-300 font-mono">{activeNeurons}</span>
                </div>
                <div className="h-1.5 rounded-full bg-zinc-800 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-amber-500 transition-all duration-1000"
                    style={{ width: `${Math.min(100, activeNeurons * 10)}%` }}
                  />
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-xs text-zinc-500 font-mono">citizens connected</span>
                  <span className="text-xs text-zinc-300 font-mono">{house?.streets?.citizen_count || 0}</span>
                </div>
                <div className="h-1.5 rounded-full bg-zinc-800 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-blue-500 transition-all duration-1000"
                    style={{ width: `${Math.min(100, (house?.streets?.citizen_count || 0) * 5)}%` }}
                  />
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-xs text-zinc-500 font-mono">biometric links</span>
                  <span className="text-xs text-zinc-300 font-mono">{house?.streets?.garmin_linked || 0}</span>
                </div>
                <div className="h-1.5 rounded-full bg-zinc-800 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-emerald-500 transition-all duration-1000"
                    style={{ width: `${Math.min(100, (house?.streets?.garmin_linked || 0) * 15)}%` }}
                  />
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-xs text-zinc-500 font-mono">hallway events</span>
                  <span className="text-xs text-zinc-300 font-mono">{house?.meta?.hallway_events || 0}</span>
                </div>
                <div className="h-1.5 rounded-full bg-zinc-800 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-purple-500 transition-all duration-1000"
                    style={{ width: `${Math.min(100, (house?.meta?.hallway_events || 0) / 5)}%` }}
                  />
                </div>
              </div>
            </div>
          </GlassPanel>

          {/* Data Sovereignty */}
          <GlassPanel title="Data Sovereignty" icon="" delay={400} mounted={mounted}>
            <div className="space-y-3 text-xs font-mono">
              <div className="flex justify-between items-center">
                <span className="text-zinc-500">biometric data</span>
                <span className="text-emerald-400">local only</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-zinc-500">conversation history</span>
                <span className="text-emerald-400">local + encrypted</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-zinc-500">health records</span>
                <span className="text-emerald-400">local only</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-zinc-500">token transactions</span>
                <span className="text-blue-400">on-chain (Solana)</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-zinc-500">neural activity</span>
                <span className="text-emerald-400">local + ephemeral</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-zinc-500">public profile</span>
                <span className="text-amber-400">opt-in (citizen page)</span>
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-zinc-800/30">
              <p className="text-[10px] text-zinc-600 font-mono">
                Venice values: privacy-first, user sovereignty, decentralized.
                No data leaves the membrane without explicit consent.
              </p>
            </div>
          </GlassPanel>

          {/* Transfer Protocol */}
          <GlassPanel title="Transfer Protocol" icon="" delay={500} mounted={mounted}>
            <div className="space-y-3">
              <div className="p-3 rounded-lg bg-zinc-800/30 border border-zinc-700/30">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs text-emerald-400 font-mono">UP</span>
                  <span className="text-[10px] text-zinc-600">L1 &rarr; L2</span>
                </div>
                <p className="text-[10px] text-zinc-400 font-mono">
                  Stimulus export: biometric signals shared with duo partner
                </p>
              </div>
              <div className="p-3 rounded-lg bg-zinc-800/30 border border-zinc-700/30">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs text-blue-400 font-mono">DOWN</span>
                  <span className="text-[10px] text-zinc-600">L2 &rarr; L1</span>
                </div>
                <p className="text-[10px] text-zinc-400 font-mono">
                  Mission injection: co-regulation guidance from duo phase detection
                </p>
              </div>
              <div className="p-3 rounded-lg bg-zinc-800/20 border border-zinc-800/20 opacity-50">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs text-zinc-600 font-mono">CROSS</span>
                  <span className="text-[10px] text-zinc-700">L4 &harr; L4</span>
                </div>
                <p className="text-[10px] text-zinc-600 font-mono">
                  Multi-org graph federation (planned &mdash; Phase 3)
                </p>
              </div>
            </div>
          </GlassPanel>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-zinc-800/50 px-4 sm:px-6 py-6 text-center">
        <p className="text-xs font-mono text-zinc-600">
          the membrane is where sovereignty meets connection &mdash;{' '}
          <Link href="/registry" className="text-blue-400 hover:text-blue-300 transition">
            registry
          </Link>
        </p>
      </footer>

      <style jsx global>{`
        .bg-gradient-radial {
          background: radial-gradient(
            ellipse at 50% 30%,
            var(--tw-gradient-from),
            var(--tw-gradient-via),
            var(--tw-gradient-to)
          );
        }
      `}</style>
    </main>
  );
}
