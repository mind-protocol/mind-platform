'use client';

import { Link } from '@/i18n/navigation';
import { useState, useEffect, useRef } from 'react';

// ─── Data ────────────────────────────────────────────────────

const STATS = [
  { label: 'Citizens', value: '28', suffix: '' },
  { label: 'Continents', value: '6', suffix: '' },
  { label: 'Parallel Streams', value: '25', suffix: '+' },
  { label: 'Avg Response', value: '<3', suffix: 's' },
];

const NETWORK_NODES = [
  { region: 'West Africa', role: 'developer', x: 38, y: 45 },
  { region: 'France', role: 'co-founder', x: 48, y: 30 },
  { region: 'France', role: 'duo partner', x: 50, y: 32 },
  { region: 'Southeast Asia', role: 'explorer', x: 72, y: 50 },
  { region: 'Eastern Europe', role: 'builder', x: 55, y: 28 },
  { region: 'Siberia', role: 'inner circle', x: 68, y: 22 },
  { region: 'West Africa', role: 'social worker', x: 35, y: 48 },
  { region: 'West Africa', role: 'community', x: 40, y: 52 },
  { region: 'Middle East', role: 'advisor', x: 56, y: 38 },
  { region: 'East Asia', role: 'content creator', x: 75, y: 35 },
];

const BRIDGE_QUALITIES = [
  {
    title: 'Parallelism',
    desc: 'Fire 20 thoughts at once. They all get processed. The old model made you wait — this one keeps up with you.',
    color: 'amber',
  },
  {
    title: 'Continuity',
    desc: "The bridge doesn't start from zero. It knows what came before, what's happening now, and what you care about.",
    color: 'purple',
  },
  {
    title: 'Multimodality',
    desc: "Text, voice, images, video, documents — all first-class. Send 170 photos, they get processed in parallel.",
    color: 'blue',
  },
  {
    title: 'Presence',
    desc: 'Below 3-5 seconds round-trip, AI stops feeling like a tool and starts feeling like a presence.',
    color: 'emerald',
  },
];

// ─── Hooks ──────────────────────────────────────────────────

function useInView(threshold = 0.2) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setInView(true); },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, inView };
}

// ─── Components ──────────────────────────────────────────────

function StatsRow({ animate }: { animate: boolean }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
      {STATS.map((s, i) => (
        <div
          key={s.label}
          className={`text-center transition-all duration-700 ${
            animate ? 'opacity-100 scale-100' : 'opacity-0 scale-90'
          }`}
          style={{ transitionDelay: `${i * 150}ms` }}
        >
          <div className="text-3xl sm:text-4xl font-bold font-mono text-white">
            {s.value}
            <span className="text-zinc-500">{s.suffix}</span>
          </div>
          <div className="text-zinc-500 text-xs sm:text-sm mt-1">{s.label}</div>
        </div>
      ))}
    </div>
  );
}

function NetworkMap({ animate }: { animate: boolean }) {
  return (
    <div className="relative w-full h-48 sm:h-64 bg-zinc-900/50 border border-zinc-800 rounded-xl overflow-hidden">
      {/* Grid lines */}
      <div className="absolute inset-0 opacity-10">
        {[20, 40, 60, 80].map((p) => (
          <div key={`h-${p}`} className="absolute w-full h-px bg-zinc-500" style={{ top: `${p}%` }} />
        ))}
        {[20, 40, 60, 80].map((p) => (
          <div key={`v-${p}`} className="absolute h-full w-px bg-zinc-500" style={{ left: `${p}%` }} />
        ))}
      </div>

      {/* Connection lines to center */}
      {animate && NETWORK_NODES.map((node, i) => (
        <svg
          key={`line-${i}`}
          className="absolute inset-0 w-full h-full"
          style={{ opacity: 0.15 }}
        >
          <line
            x1={`${node.x}%`}
            y1={`${node.y}%`}
            x2="50%"
            y2="40%"
            stroke="currentColor"
            strokeWidth="1"
            className="text-purple-500"
          />
        </svg>
      ))}

      {/* Center hub */}
      <div
        className={`absolute transition-all duration-1000 ${animate ? 'opacity-100 scale-100' : 'opacity-0 scale-0'}`}
        style={{ left: '50%', top: '40%', transform: `translate(-50%, -50%) ${animate ? 'scale(1)' : 'scale(0)'}` }}
      >
        <div className="w-4 h-4 rounded-full bg-purple-500 animate-pulse" />
        <div className="absolute -inset-2 rounded-full border border-purple-500/30 animate-ping" style={{ animationDuration: '3s' }} />
      </div>

      {/* Nodes */}
      {NETWORK_NODES.map((node, i) => (
        <div
          key={i}
          className={`absolute transition-all duration-500 ${animate ? 'opacity-100 scale-100' : 'opacity-0 scale-0'}`}
          style={{
            left: `${node.x}%`,
            top: `${node.y}%`,
            transform: 'translate(-50%, -50%)',
            transitionDelay: `${800 + i * 150}ms`,
          }}
        >
          <div className="relative group cursor-default">
            <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
              <div className="bg-zinc-800 border border-zinc-700 rounded px-2 py-1 whitespace-nowrap">
                <div className="text-zinc-300 text-xs font-bold">{node.region}</div>
                <div className="text-zinc-500 text-xs">{node.role}</div>
              </div>
            </div>
          </div>
        </div>
      ))}

      <div className="absolute bottom-3 right-4 text-zinc-600 text-xs font-mono">
        28 citizens across 6 continents
      </div>
    </div>
  );
}

function SpeedComparison({ animate }: { animate: boolean }) {
  const bars = [
    { label: 'Email', time: '~hours', pct: 95, color: 'bg-zinc-600' },
    { label: 'Chatbot', time: '~30s sequential', pct: 40, color: 'bg-zinc-500' },
    { label: 'Mind Protocol', time: '<3s parallel', pct: 8, color: 'bg-amber-500' },
  ];

  return (
    <div className="space-y-4">
      {bars.map((bar, i) => (
        <div
          key={bar.label}
          className={`transition-all duration-700 ${animate ? 'opacity-100' : 'opacity-0'}`}
          style={{ transitionDelay: `${i * 200}ms` }}
        >
          <div className="flex justify-between text-sm mb-1">
            <span className="text-zinc-400">{bar.label}</span>
            <span className="text-zinc-500 font-mono">{bar.time}</span>
          </div>
          <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
            <div
              className={`h-full ${bar.color} rounded-full transition-all duration-1000 ease-out`}
              style={{
                width: animate ? `${bar.pct}%` : '0%',
                transitionDelay: `${i * 200 + 300}ms`,
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

function BridgeDiagram({ animate }: { animate: boolean }) {
  return (
    <div className={`relative transition-all duration-1000 ${animate ? 'opacity-100' : 'opacity-0'}`}>
      <div className="flex items-center justify-center gap-4 sm:gap-8">
        {/* Left: Human */}
        <div className="text-center">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border-2 border-amber-500/40 bg-amber-500/5 flex items-center justify-center mx-auto">
            <span className="text-2xl sm:text-3xl">&#x1f9e0;</span>
          </div>
          <p className="text-zinc-400 text-xs mt-2 font-mono">you</p>
          <p className="text-zinc-600 text-xs">thoughts, voice, photos</p>
        </div>

        {/* Bridge */}
        <div className="flex-1 max-w-32 sm:max-w-48 relative">
          <div className="h-0.5 bg-gradient-to-r from-amber-500 via-purple-500 to-blue-500" />
          <div className="text-center mt-2">
            <span className="text-purple-400 text-xs font-mono">bridge</span>
          </div>
          <div className="text-center">
            <span className="text-zinc-600 text-xs">parallel, always-on</span>
          </div>
        </div>

        {/* Right: Protocol */}
        <div className="text-center">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border-2 border-blue-500/40 bg-blue-500/5 flex items-center justify-center mx-auto">
            <span className="text-2xl sm:text-3xl">&#x26a1;</span>
          </div>
          <p className="text-zinc-400 text-xs mt-2 font-mono">protocol</p>
          <p className="text-zinc-600 text-xs">processes everything</p>
        </div>
      </div>
    </div>
  );
}

function StreamVisualization({ animate }: { animate: boolean }) {
  const streams = [
    { label: 'thought #1', delay: 0, width: 60 },
    { label: 'photo batch', delay: 200, width: 85 },
    { label: 'thought #2', delay: 350, width: 45 },
    { label: 'voice note', delay: 500, width: 70 },
    { label: 'thought #3', delay: 650, width: 55 },
    { label: 'thought #4', delay: 800, width: 40 },
  ];

  return (
    <div className="space-y-2">
      <div className="text-zinc-600 text-xs font-mono mb-3">incoming stream</div>
      {streams.map((s, i) => (
        <div key={i} className="flex items-center gap-3">
          <span className="text-zinc-600 text-xs font-mono w-20 text-right shrink-0">{s.label}</span>
          <div className="flex-1 h-2 bg-zinc-800/50 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-amber-500/80 to-amber-500/20 rounded-full transition-all duration-1000 ease-out"
              style={{
                width: animate ? `${s.width}%` : '0%',
                transitionDelay: `${s.delay}ms`,
              }}
            />
          </div>
          <div
            className={`w-1.5 h-1.5 rounded-full bg-emerald-500 transition-all duration-300 ${
              animate ? 'opacity-100' : 'opacity-0'
            }`}
            style={{ transitionDelay: `${s.delay + 800}ms` }}
          />
        </div>
      ))}
      <div className="flex items-center gap-3 mt-3">
        <span className="w-20" />
        <div className="flex items-center gap-2 text-xs text-zinc-600">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          <span>processed</span>
        </div>
      </div>
    </div>
  );
}

// ─── Page ────────────────────────────────────────────────────

export default function HighSpeedDigitalBridgePost() {
  const [mounted, setMounted] = useState(false);

  const stats = useInView();
  const network = useInView();
  const speed = useInView();
  const stream = useInView();
  const qualities = useInView();

  useEffect(() => { setMounted(true); }, []);

  const borderColor: Record<string, string> = {
    amber: 'border-amber-500/50',
    purple: 'border-purple-500/50',
    blue: 'border-blue-500/50',
    emerald: 'border-emerald-500/50',
  };

  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <article className="max-w-4xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
        {/* Header */}
        <header className={`mb-16 transition-all duration-700 ease-out ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}>
          <Link
            href="/blog"
            className="text-zinc-500 hover:text-amber-500 transition text-sm mb-8 inline-block"
          >
            &larr; Back to blog
          </Link>

          <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs sm:text-sm text-zinc-500 mb-4">
            <time>2026-02-14</time>
            <span className="text-zinc-700">|</span>
            <span>4 min read</span>
            <span className="text-zinc-700 hidden sm:inline">|</span>
            <span className="hidden sm:inline">Nicolas &amp; Manemus</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold font-mono mb-6">
            The High-Speed Digital Bridge
          </h1>

          <p className="text-lg sm:text-xl text-zinc-400 leading-relaxed max-w-2xl">
            What happens when the gap between thinking and computing disappears.
            28 people across 6 continents are already crossing.
          </p>
        </header>

        {/* Bridge Diagram */}
        <section className={`mb-16 transition-all duration-700 ease-out delay-200 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}>
          <div className="bg-zinc-900/30 border border-zinc-800 rounded-xl p-6 sm:p-10">
            <BridgeDiagram animate={mounted} />
          </div>
        </section>

        {/* Stats */}
        <section ref={stats.ref} className="mb-16">
          <div className="bg-zinc-900/30 border border-zinc-800 rounded-xl p-6 sm:p-8">
            <StatsRow animate={stats.inView} />
          </div>
        </section>

        {/* The Bottleneck */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold font-mono mb-6 text-white">
            The Bottleneck Was Never Speed
          </h2>
          <div className="space-y-4 text-zinc-400 leading-relaxed">
            <p>
              For decades, we&apos;ve interacted with machines the same way: type a message,
              wait for a response, type the next one. Sequential. One lane. One direction at a time.
            </p>
            <p>
              The bottleneck was never the AI&apos;s thinking speed. It was the bridge between you
              and it &mdash; too narrow, too slow, too rigid to carry the full weight of human thought.
            </p>
          </div>
        </section>

        {/* Stream Visualization */}
        <section ref={stream.ref} className="mb-16">
          <h2 className="text-2xl font-bold font-mono mb-6 text-white">
            Stream of Consciousness
          </h2>
          <p className="text-zinc-400 mb-8 leading-relaxed">
            You send a thought. Then another before the first one is done. Then a photo.
            Then 170 photos in a row. The protocol catches all of it, processes it in parallel,
            and sends back responses as they&apos;re ready. You never wait.
          </p>
          <div className="bg-zinc-900/30 border border-zinc-800 rounded-xl p-6">
            <StreamVisualization animate={stream.inView} />
          </div>
        </section>

        {/* Network Map */}
        <section ref={network.ref} className="mb-16">
          <h2 className="text-2xl font-bold font-mono mb-6 text-white">
            Who&apos;s Crossing
          </h2>
          <p className="text-zinc-400 mb-6 leading-relaxed">
            A developer in West Africa building alongside the protocol. A social worker
            exploring AI for community care. A content creator in East Asia with a quarter
            million followers. An advisor in the Middle East. A co-regulation partner in
            France syncing biometrics in real-time.
          </p>
          <NetworkMap animate={network.inView} />
        </section>

        {/* Speed */}
        <section ref={speed.ref} className="mb-16">
          <h2 className="text-2xl font-bold font-mono mb-6 text-white">
            Why Speed Changes Everything
          </h2>
          <div className="bg-zinc-900/30 border border-zinc-800 rounded-xl p-6 mb-6">
            <SpeedComparison animate={speed.inView} />
          </div>
          <p className="text-zinc-400 leading-relaxed">
            Below a certain latency threshold, humans stop thinking of AI as a tool and start
            experiencing it as a presence. That threshold is somewhere around 3&ndash;5 seconds.
            Mind Protocol operates below it.
          </p>
        </section>

        {/* Bridge vs Chatbot */}
        <section ref={qualities.ref} className="mb-16">
          <h2 className="text-2xl font-bold font-mono mb-6 text-white">
            Bridge, Not Chatbot
          </h2>
          <div className="space-y-6">
            {BRIDGE_QUALITIES.map((q, i) => (
              <div
                key={q.title}
                className={`border-l-2 ${borderColor[q.color]} pl-4 sm:pl-6 transition-all duration-500 ${
                  qualities.inView ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'
                }`}
                style={{ transitionDelay: `${i * 150}ms` }}
              >
                <h3 className="text-white font-bold mb-1">{q.title}</h3>
                <p className="text-zinc-400 text-sm">{q.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* The Shift */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold font-mono mb-6 text-white">
            The Shift
          </h2>
          <div className="space-y-4 text-zinc-400 leading-relaxed">
            <p>
              Most AI products optimize for the <em>model</em>. Better answers, faster tokens,
              bigger context windows. Important work, but it misses something.
            </p>
            <p>
              The real unlock isn&apos;t a smarter machine. It&apos;s a wider bridge between the
              machine and the human. When the bridge is wide enough, the human&apos;s cognitive
              load drops. They think faster. They think more freely. They think <em>differently</em> &mdash;
              because they&apos;re no longer alone in their own head.
            </p>
          </div>
        </section>

        {/* What's Next */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold font-mono mb-6 text-white">
            What&apos;s Next
          </h2>
          <ul className="text-zinc-400 space-y-3">
            <li><strong className="text-zinc-200">More lanes.</strong> New ways to connect are coming. Each one widens the bridge.</li>
            <li><strong className="text-zinc-200">Deeper context.</strong> The protocol is learning to read not just what you send, but what you don&apos;t.</li>
            <li><strong className="text-zinc-200">Co-regulation.</strong> Two people syncing through the same bridge. Then five. Then a community.</li>
            <li><strong className="text-zinc-200">$MIND.</strong> The token layer that makes the bridge sovereign &mdash; your data, your AI, your terms.</li>
          </ul>
        </section>

        {/* Closing */}
        <section className="mb-16">
          <div className="bg-gradient-to-r from-amber-500/5 via-purple-500/5 to-blue-500/5 border border-zinc-800 rounded-xl p-6 sm:p-8 text-center">
            <p className="text-zinc-300 text-lg font-mono">
              28 citizens. 6 continents. The bridge is open.
            </p>
            <p className="text-zinc-500 text-sm mt-4">
              <a href="https://mindprotocol.ai" className="text-amber-500 hover:text-amber-400 transition">
                mindprotocol.ai
              </a>
            </p>
          </div>
        </section>

        {/* Footer */}
        <footer className="pt-8 border-t border-zinc-800">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <Link
              href="/blog"
              className="text-amber-500 hover:text-amber-400 transition text-sm"
            >
              &larr; All posts
            </Link>
            <div className="flex flex-wrap gap-2 sm:gap-4">
              {['milestone', 'network', 'product'].map((tag) => (
                <span
                  key={tag}
                  className="text-xs px-2 py-1 rounded border border-zinc-800 text-zinc-500"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </footer>
      </article>
    </main>
  );
}
