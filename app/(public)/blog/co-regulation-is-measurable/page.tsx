'use client';

import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';

// ─── Raw Data ────────────────────────────────────────────────

const STRESS_DATA = [
  { time: '19:30', value: 84, label: 'V.HIGH' },
  { time: '19:33', value: 85, label: 'V.HIGH' },
  { time: '19:36', value: 66, label: 'HIGH' },
  { time: '19:39', value: 80, label: 'V.HIGH' },
  { time: '19:42', value: 51, label: 'HIGH' },
  { time: '19:45', value: 49, label: 'medium' },
  { time: '19:48', value: 58, label: 'HIGH' },
];

const HR_DATA = [
  { time: '19:30', value: 99 },
  { time: '19:32', value: 100 },
  { time: '19:34', value: 112 },
  { time: '19:36', value: 92 },
  { time: '19:38', value: 86 },
  { time: '19:40', value: 94 },
  { time: '19:42', value: 90 },
  { time: '19:44', value: 82 },
  { time: '19:46', value: 81 },
  { time: '19:48', value: 80 },
  { time: '19:50', value: 89 },
  { time: '19:52', value: 63 },
];

const RESP_DATA = [
  { time: '19:30', value: 14 },
  { time: '19:32', value: 16 },
  { time: '19:34', value: 14 },
  { time: '19:36', value: 12 },
  { time: '19:38', value: 6 },
  { time: '19:40', value: 7 },
  { time: '19:42', value: 12 },
  { time: '19:44', value: 8 },
  { time: '19:46', value: 8 },
  { time: '19:48', value: 7 },
  { time: '19:50', value: 16 },
  { time: '19:52', value: 15 },
];

const PHASES = [
  {
    id: 'crisis',
    label: 'Crisis',
    start: '19:30',
    end: '19:34',
    color: '#ef4444',
    description: 'Empathetic stress activation',
  },
  {
    id: 'coregulation',
    label: 'Co-Regulation',
    start: '19:36',
    end: '19:48',
    color: '#f59e0b',
    description: 'Deliberate slow breathing together',
  },
  {
    id: 'rebound',
    label: 'Rebound',
    start: '19:50',
    end: '19:52',
    color: '#22c55e',
    description: 'Parasympathetic rebound',
  },
];

// ─── Helpers ─────────────────────────────────────────────────

function timeToMinutes(t: string): number {
  const [h, m] = t.split(':').map(Number);
  return h * 60 + m;
}

function stressColor(v: number): string {
  if (v >= 76) return '#ef4444';
  if (v >= 51) return '#f97316';
  if (v >= 26) return '#eab308';
  return '#22c55e';
}

// ─── Two-Body ANS Visualization ─────────────────────────────

function TwoBodyANS() {
  const [phase, setPhase] = useState(0); // 0: crisis, 1: attune, 2: regulate, 3: rebound
  const [auto, setAuto] = useState(true);

  useEffect(() => {
    if (!auto) return;
    const interval = setInterval(() => {
      setPhase((p) => (p + 1) % 4);
    }, 3000);
    return () => clearInterval(interval);
  }, [auto]);

  const phases = [
    {
      label: 'Crisis',
      personA: { symp: 90, para: 20, breathing: 16, label: 'In distress' },
      personB: { symp: 85, para: 25, breathing: 14, label: 'Feels their pain' },
      transfer: 'up', // distress transfers up
      description: 'Person A is in crisis. Person B, sitting close, feels their distress — their own sympathetic system activates in response.',
    },
    {
      label: 'Attunement',
      personA: { symp: 85, para: 25, breathing: 12, label: 'Still distressed' },
      personB: { symp: 70, para: 40, breathing: 8, label: 'Slowing breath' },
      transfer: 'sync', // syncing
      description: 'Person B begins breathing slowly and deliberately. They match Person A\'s rhythm, then gradually slow down.',
    },
    {
      label: 'Co-Regulation',
      personA: { symp: 50, para: 55, breathing: 7, label: 'Following' },
      personB: { symp: 40, para: 65, breathing: 6, label: 'Leading' },
      transfer: 'down', // calm transfers down
      description: 'Person A\'s nervous system begins to follow. The calm signal from Person B provides a reference — their body borrows the regulation.',
    },
    {
      label: 'Rebound',
      personA: { symp: 25, para: 80, breathing: 12, label: 'Releasing' },
      personB: { symp: 20, para: 85, breathing: 14, label: 'Released' },
      transfer: 'none',
      description: 'Both systems release accumulated tension. Heart rates drop sharply — the parasympathetic rebound. The storm passes.',
    },
  ];

  const current = phases[phase];

  return (
    <div className="relative">
      {/* Phase selector */}
      <div className="flex justify-center gap-2 mb-8">
        {phases.map((p, i) => (
          <button
            key={p.label}
            onClick={() => { setPhase(i); setAuto(false); }}
            className={`px-4 py-2 text-sm rounded-lg transition-all ${
              phase === i
                ? 'bg-amber-500/20 text-amber-500 border border-amber-500/50'
                : 'text-zinc-500 border border-zinc-800 hover:border-zinc-600'
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* Two bodies visualization */}
      <div className="flex justify-center items-start gap-8 md:gap-16 mb-8">
        {/* Person A */}
        <div className="flex flex-col items-center">
          <div className="text-sm text-zinc-500 mb-2">Person A</div>
          <PersonBody
            sympathetic={current.personA.symp}
            parasympathetic={current.personA.para}
            breathing={current.personA.breathing}
            side="left"
          />
          <div className="mt-3 text-center">
            <div className="text-xs text-zinc-400">{current.personA.label}</div>
            <div className="text-xs text-zinc-600 mt-1">{current.personA.breathing} br/min</div>
          </div>
        </div>

        {/* Transfer animation */}
        <div className="flex flex-col items-center justify-center h-[200px]">
          <TransferAnimation direction={current.transfer} />
        </div>

        {/* Person B (caregiver) */}
        <div className="flex flex-col items-center">
          <div className="text-sm text-zinc-500 mb-2">Person B</div>
          <PersonBody
            sympathetic={current.personB.symp}
            parasympathetic={current.personB.para}
            breathing={current.personB.breathing}
            side="right"
          />
          <div className="mt-3 text-center">
            <div className="text-xs text-zinc-400">{current.personB.label}</div>
            <div className="text-xs text-zinc-600 mt-1">{current.personB.breathing} br/min</div>
          </div>
        </div>
      </div>

      {/* Description */}
      <div className="text-center max-w-xl mx-auto">
        <p className="text-zinc-300 leading-relaxed">{current.description}</p>
      </div>

      {/* Legend */}
      <div className="flex justify-center gap-6 mt-8 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500" />
          <span className="text-zinc-500">Sympathetic (stress)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-emerald-500" />
          <span className="text-zinc-500">Parasympathetic (calm)</span>
        </div>
      </div>

      {/* Auto-play indicator */}
      <div className="flex justify-center mt-4">
        <button
          onClick={() => setAuto(!auto)}
          className="text-xs text-zinc-600 hover:text-zinc-400 transition"
        >
          {auto ? '⏸ Pause' : '▶ Auto-play'}
        </button>
      </div>
    </div>
  );
}

function PersonBody({
  sympathetic,
  parasympathetic,
  breathing,
  side,
}: {
  sympathetic: number;
  parasympathetic: number;
  breathing: number;
  side: 'left' | 'right';
}) {
  const breathDuration = 60 / breathing;
  const sympColor = `rgba(239, 68, 68, ${sympathetic / 100})`;
  const paraColor = `rgba(16, 185, 129, ${parasympathetic / 100})`;

  return (
    <div className="relative w-24 h-[180px]">
      {/* Head */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-12 rounded-full border-2 transition-all duration-1000"
        style={{
          borderColor: sympathetic > 60 ? '#ef4444' : sympathetic > 40 ? '#f59e0b' : '#10b981',
          backgroundColor: `rgba(${sympathetic > 60 ? '239,68,68' : sympathetic > 40 ? '245,158,11' : '16,185,129'}, 0.1)`,
        }}
      />

      {/* Body/torso with breathing animation */}
      <div
        className="absolute top-14 left-1/2 -translate-x-1/2 w-16 h-20 rounded-t-3xl rounded-b-lg overflow-hidden transition-all duration-500"
        style={{
          animation: `bodyBreathe ${breathDuration}s ease-in-out infinite`,
        }}
      >
        {/* Sympathetic side (left inner) */}
        <div
          className="absolute inset-y-0 left-0 w-1/2 transition-all duration-1000"
          style={{ backgroundColor: sympColor }}
        />
        {/* Parasympathetic side (right inner) */}
        <div
          className="absolute inset-y-0 right-0 w-1/2 transition-all duration-1000"
          style={{ backgroundColor: paraColor }}
        />
        {/* Heart indicator */}
        <div
          className="absolute top-4 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full"
          style={{
            backgroundColor: sympathetic > parasympathetic ? '#ef4444' : '#10b981',
            animation: `heartbeat ${60 / (50 + sympathetic * 0.6)}s ease-in-out infinite`,
          }}
        />
      </div>

      {/* Arms */}
      <div
        className={`absolute top-16 ${side === 'left' ? '-right-2' : '-left-2'} w-3 h-12 rounded-full transition-all duration-1000`}
        style={{ backgroundColor: `rgba(161, 161, 170, 0.3)` }}
      />

      {/* ANS balance bar */}
      <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-20 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-red-500 to-emerald-500 transition-all duration-1000"
          style={{ width: `${parasympathetic}%` }}
        />
      </div>
    </div>
  );
}

function TransferAnimation({ direction }: { direction: 'up' | 'down' | 'sync' | 'none' }) {
  if (direction === 'none') {
    return (
      <div className="flex flex-col items-center gap-2 text-zinc-600">
        <div className="text-2xl">✓</div>
        <div className="text-xs">Settled</div>
      </div>
    );
  }

  const particles = direction === 'up' ? ['😰', '💢', '⚡'] : direction === 'down' ? ['🌊', '💚', '🍃'] : ['↔', '〰', '↔'];
  const color = direction === 'up' ? '#ef4444' : direction === 'down' ? '#10b981' : '#f59e0b';

  return (
    <div className="relative w-20 h-full flex items-center justify-center">
      {/* Connection line */}
      <div
        className="absolute w-full h-0.5 opacity-30"
        style={{ backgroundColor: color }}
      />

      {/* Animated particles */}
      {particles.map((p, i) => (
        <div
          key={i}
          className="absolute text-lg"
          style={{
            animation: direction === 'sync'
              ? `syncPulse 1.5s ease-in-out infinite ${i * 0.3}s`
              : direction === 'up'
              ? `transferUp 2s ease-in-out infinite ${i * 0.4}s`
              : `transferDown 2s ease-in-out infinite ${i * 0.4}s`,
          }}
        >
          {p}
        </div>
      ))}

      {/* Direction label */}
      <div className="absolute -bottom-6 text-xs text-zinc-600 whitespace-nowrap">
        {direction === 'up' && 'Distress transfers'}
        {direction === 'down' && 'Calm transfers'}
        {direction === 'sync' && 'Synchronizing'}
      </div>
    </div>
  );
}

// ─── Animated Line Chart ─────────────────────────────────────

function AnimatedChart({
  data,
  color,
  yMin,
  yMax,
  unit,
  height = 200,
  phases,
  showPhases = false,
  colorFn,
}: {
  data: { time: string; value: number }[];
  color: string;
  yMin: number;
  yMax: number;
  unit: string;
  height?: number;
  phases?: typeof PHASES;
  showPhases?: boolean;
  colorFn?: (v: number) => string;
}) {
  const [progress, setProgress] = useState(0);
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const ref = useRef<HTMLDivElement>(null);
  const animRef = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !animRef.current) {
          animRef.current = true;
          const start = performance.now();
          const duration = 2000;
          function tick(now: number) {
            const t = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - t, 3);
            setProgress(eased);
            if (t < 1) requestAnimationFrame(tick);
          }
          requestAnimationFrame(tick);
        }
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const W = 700;
  const H = height;
  const PAD = { top: 20, right: 20, bottom: 40, left: 50 };
  const plotW = W - PAD.left - PAD.right;
  const plotH = H - PAD.top - PAD.bottom;

  const tMin = timeToMinutes(data[0].time);
  const tMax = timeToMinutes(data[data.length - 1].time);

  const toX = (t: string) =>
    PAD.left + ((timeToMinutes(t) - tMin) / (tMax - tMin)) * plotW;
  const toY = (v: number) =>
    PAD.top + plotH - ((v - yMin) / (yMax - yMin)) * plotH;

  const visibleCount = Math.ceil(progress * data.length);
  const points = data.slice(0, visibleCount);

  const pathD = points
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${toX(p.time)} ${toY(p.value)}`)
    .join(' ');

  return (
    <div ref={ref} className="w-full overflow-x-auto">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full max-w-[700px] mx-auto"
        style={{ minWidth: 400 }}
      >
        {/* Phase backgrounds */}
        {showPhases &&
          phases?.map((phase) => {
            const x1 = toX(phase.start);
            const x2 = toX(phase.end);
            return (
              <g key={phase.id}>
                <rect
                  x={x1}
                  y={PAD.top}
                  width={x2 - x1}
                  height={plotH}
                  fill={phase.color}
                  opacity={0.06}
                />
                <text
                  x={(x1 + x2) / 2}
                  y={PAD.top + 14}
                  textAnchor="middle"
                  className="text-[10px]"
                  fill={phase.color}
                  opacity={0.6}
                >
                  {phase.label}
                </text>
              </g>
            );
          })}

        {/* Grid lines */}
        {[0, 0.25, 0.5, 0.75, 1].map((frac) => {
          const y = PAD.top + plotH * (1 - frac);
          const val = Math.round(yMin + (yMax - yMin) * frac);
          return (
            <g key={frac}>
              <line
                x1={PAD.left}
                y1={y}
                x2={W - PAD.right}
                y2={y}
                stroke="#27272a"
                strokeDasharray="4 4"
              />
              <text
                x={PAD.left - 8}
                y={y + 4}
                textAnchor="end"
                className="text-[11px]"
                fill="#71717a"
              >
                {val}
              </text>
            </g>
          );
        })}

        {/* X axis labels */}
        {data
          .filter((_, i) => i % 2 === 0)
          .map((d) => (
            <text
              key={d.time}
              x={toX(d.time)}
              y={H - 8}
              textAnchor="middle"
              className="text-[11px]"
              fill="#71717a"
            >
              {d.time}
            </text>
          ))}

        {/* Line */}
        <path
          d={pathD}
          fill="none"
          stroke={colorFn ? 'url(#stress-grad)' : color}
          strokeWidth={2.5}
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Gradient definition for stress */}
        {colorFn && (
          <defs>
            <linearGradient id="stress-grad" x1="0" y1="0" x2="1" y2="0">
              {points.map((p, i) => (
                <stop
                  key={i}
                  offset={`${(i / Math.max(points.length - 1, 1)) * 100}%`}
                  stopColor={colorFn(p.value)}
                />
              ))}
            </linearGradient>
          </defs>
        )}

        {/* Data points */}
        {points.map((p, i) => (
          <g key={i}>
            <circle
              cx={toX(p.time)}
              cy={toY(p.value)}
              r={hoveredIdx === i ? 6 : 4}
              fill={colorFn ? colorFn(p.value) : color}
              stroke="#09090b"
              strokeWidth={2}
              className="transition-all duration-150 cursor-pointer"
              onMouseEnter={() => setHoveredIdx(i)}
              onMouseLeave={() => setHoveredIdx(null)}
            />
            {hoveredIdx === i && (
              <g>
                <rect
                  x={toX(p.time) - 32}
                  y={toY(p.value) - 28}
                  width={64}
                  height={22}
                  rx={4}
                  fill="#18181b"
                  stroke="#3f3f46"
                />
                <text
                  x={toX(p.time)}
                  y={toY(p.value) - 14}
                  textAnchor="middle"
                  className="text-[11px] font-mono"
                  fill="white"
                >
                  {p.value} {unit}
                </text>
              </g>
            )}
          </g>
        ))}

        {/* Unit label */}
        <text
          x={PAD.left + 4}
          y={PAD.top - 6}
          className="text-[10px]"
          fill="#71717a"
        >
          {unit}
        </text>
      </svg>
    </div>
  );
}

// ─── Interactive Breathing Guide ─────────────────────────────

function BreathingGuide() {
  const [active, setActive] = useState(false);
  const [phase, setPhase] = useState<'inhale' | 'exhale'>('inhale');
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    if (!active) return;
    const interval = setInterval(() => {
      setSeconds((s) => {
        const next = (s + 1) % 10; // 5s in, 5s out = 6 br/min
        setPhase(next < 5 ? 'inhale' : 'exhale');
        return next;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [active]);

  const scale = active
    ? phase === 'inhale'
      ? 1 + (seconds % 5) * 0.12
      : 1.48 - ((seconds - 5) % 5) * 0.12
    : 1;

  return (
    <div className="flex flex-col items-center">
      <button
        onClick={() => setActive(!active)}
        className="mb-8 px-5 py-2.5 text-sm border border-zinc-700 text-zinc-400 hover:text-amber-500 hover:border-amber-500/50 rounded-lg transition"
      >
        {active ? 'Stop' : 'Try it — breathe with the circle'}
      </button>
      <div className="relative w-48 h-48 flex items-center justify-center">
        <div
          className="rounded-full transition-transform duration-1000 ease-in-out"
          style={{
            width: 80,
            height: 80,
            backgroundColor: active
              ? phase === 'inhale'
                ? '#f59e0b'
                : '#22c55e'
              : '#3f3f46',
            transform: `scale(${scale})`,
            opacity: active ? 0.7 : 0.3,
          }}
        />
        {active && (
          <span className="absolute bottom-2 text-sm font-mono text-zinc-400">
            {phase === 'inhale' ? 'inhale...' : 'exhale...'}
          </span>
        )}
      </div>
      <p className="text-zinc-600 text-xs mt-4 font-mono">
        5s in, 5s out = 6 breaths/min
      </p>
    </div>
  );
}

// ─── Page ────────────────────────────────────────────────────

export default function CoRegulationPost() {
  return (
    <>
      <style jsx global>{`
        @keyframes bodyBreathe {
          0%, 100% { transform: translateX(-50%) scaleY(1); }
          50% { transform: translateX(-50%) scaleY(1.08); }
        }
        @keyframes heartbeat {
          0%, 100% { transform: translateX(-50%) scale(1); }
          50% { transform: translateX(-50%) scale(1.2); }
        }
        @keyframes transferUp {
          0% { transform: translateX(30px); opacity: 0; }
          50% { opacity: 1; }
          100% { transform: translateX(-30px); opacity: 0; }
        }
        @keyframes transferDown {
          0% { transform: translateX(-30px); opacity: 0; }
          50% { opacity: 1; }
          100% { transform: translateX(30px); opacity: 0; }
        }
        @keyframes syncPulse {
          0%, 100% { transform: scale(0.8); opacity: 0.3; }
          50% { transform: scale(1.2); opacity: 1; }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
          animation: fadeInUp 0.8s ease-out both;
        }
      `}</style>

      <main className="min-h-screen bg-zinc-950 text-white">
        <article className="max-w-4xl mx-auto px-6 py-24">
          {/* Header */}
          <header className="mb-16 animate-fade-in-up">
            <Link
              href="/blog"
              className="text-zinc-500 hover:text-amber-500 transition text-sm mb-8 inline-block"
            >
              &larr; Back to blog
            </Link>

            <div className="flex items-center gap-3 text-sm text-zinc-500 mb-4">
              <time>2026-02-05</time>
              <span className="text-zinc-700">|</span>
              <span>8 min read</span>
              <span className="text-zinc-700">|</span>
              <span>Nicolas &amp; Manemus</span>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold font-mono mb-6">
              Co-Regulation Is Measurable
            </h1>

            <p className="text-xl text-zinc-400 leading-relaxed max-w-2xl">
              Your nervous system can borrow regulation from another person.
              Here&apos;s what that looks like in data.
            </p>
          </header>

          {/* The Mechanism — Lead with conclusion */}
          <section className="mb-20 animate-fade-in-up">
            <h2 className="text-2xl font-bold font-mono mb-4 text-white">
              The Mechanism
            </h2>

            <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-8 mb-8">
              <p className="text-zinc-300 leading-relaxed mb-6">
                Every human has two competing systems in their autonomic nervous system:
              </p>

              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <div className="bg-red-500/5 border border-red-500/20 rounded-lg p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-4 h-4 rounded-full bg-red-500" />
                    <h3 className="font-bold text-red-400">Sympathetic</h3>
                  </div>
                  <p className="text-zinc-400 text-sm leading-relaxed">
                    The &quot;fight or flight&quot; system. Activates during stress, danger, anxiety.
                    Raises heart rate, releases cortisol, prepares body for action.
                  </p>
                </div>

                <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-lg p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-4 h-4 rounded-full bg-emerald-500" />
                    <h3 className="font-bold text-emerald-400">Parasympathetic</h3>
                  </div>
                  <p className="text-zinc-400 text-sm leading-relaxed">
                    The &quot;rest and digest&quot; system. Activates during safety, calm, recovery.
                    Lowers heart rate, promotes healing, enables clear thinking.
                  </p>
                </div>
              </div>

              <p className="text-zinc-300 leading-relaxed">
                <strong className="text-white">Co-regulation</strong> is what happens when two people&apos;s
                nervous systems become coupled. If one person is calm and regulated, the other can
                use their nervous system as a reference signal — literally &quot;borrowing&quot; their
                parasympathetic state. This isn&apos;t metaphor. It&apos;s measurable.
              </p>
            </div>

            {/* Interactive two-body visualization */}
            <div className="bg-zinc-900/30 border border-zinc-800 rounded-xl p-6 md:p-8">
              <h3 className="text-lg font-bold font-mono text-center mb-6 text-zinc-300">
                Watch the Transfer
              </h3>
              <TwoBodyANS />
            </div>
          </section>

          {/* What is Co-Regulation */}
          <section className="mb-16">
            <h2 className="text-2xl font-bold font-mono mb-6 text-white">
              What Is Co-Regulation?
            </h2>

            <div className="space-y-6 text-zinc-300 leading-relaxed">
              <p>
                When you sit with someone who&apos;s distressed, your body responds. Your heart rate
                rises. Your stress hormones spike. This is <em>empathetic co-activation</em> —
                your nervous system mirroring theirs.
              </p>

              <p>
                But here&apos;s what&apos;s remarkable: if you then regulate yourself — slow your
                breathing, calm your body — the other person&apos;s nervous system can follow.
                Not because you told them to calm down. Because nervous systems are designed
                to synchronize.
              </p>

              <p>
                Parents do this with infants constantly. The baby cries, the parent holds them
                close, breathes slowly, and the baby calms. The baby&apos;s nervous system isn&apos;t
                mature enough to self-regulate — it needs to borrow regulation from another body.
              </p>

              <p className="text-zinc-400">
                Adults retain this capacity. In crisis, we can still receive regulation from
                others. The question is: can we see it in data?
              </p>
            </div>
          </section>

          {/* The Context */}
          <section className="mb-16">
            <h2 className="text-2xl font-bold font-mono mb-6 text-white">
              The Data
            </h2>

            <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-6 mb-8">
              <p className="text-zinc-300 leading-relaxed mb-4">
                <strong className="text-white">The context:</strong> Someone in withdrawal.
                Day 20+ off one substance, day 4+ off another. Chemical anxiety — not
                psychological, but neurotransmitter systems recalibrating.
              </p>
              <p className="text-zinc-400 text-sm">
                A Garmin Fenix 8 on the caregiver&apos;s wrist recorded stress (HRV-derived),
                heart rate, and respiration every 2-3 minutes. What follows is 22 minutes of
                co-regulation captured as data.
              </p>
            </div>
          </section>

          {/* Stress Chart */}
          <section className="mb-16">
            <h2 className="text-2xl font-bold font-mono mb-2 text-white">
              Stress
            </h2>
            <p className="text-zinc-500 text-sm mb-6">
              HRV-derived stress (0-100). Watch the curve: 85 → 49 → brief spike → unmeasured.
            </p>
            <div className="bg-zinc-900/30 border border-zinc-800 rounded-lg p-4">
              <AnimatedChart
                data={STRESS_DATA}
                color="#f97316"
                yMin={0}
                yMax={100}
                unit="stress"
                height={220}
                phases={PHASES}
                showPhases
                colorFn={stressColor}
              />
            </div>
          </section>

          {/* Heart Rate Chart */}
          <section className="mb-16">
            <h2 className="text-2xl font-bold font-mono mb-2 text-white">
              Heart Rate
            </h2>
            <p className="text-zinc-500 text-sm mb-6">
              Resting HR: 52 bpm. Peak of 112 at rest = empathetic stress, not exercise.
            </p>
            <div className="bg-zinc-900/30 border border-zinc-800 rounded-lg p-4">
              <AnimatedChart
                data={HR_DATA}
                color="#ef4444"
                yMin={50}
                yMax={120}
                unit="bpm"
                height={220}
                phases={PHASES}
                showPhases
              />
            </div>
          </section>

          {/* Respiration Chart */}
          <section className="mb-16">
            <h2 className="text-2xl font-bold font-mono mb-2 text-white">
              Respiration
            </h2>
            <p className="text-zinc-500 text-sm mb-6">
              Normal: 12-20 br/min. The dip to 6 br/min = vagal activation point.
            </p>
            <div className="bg-zinc-900/30 border border-zinc-800 rounded-lg p-4">
              <AnimatedChart
                data={RESP_DATA}
                color="#3b82f6"
                yMin={0}
                yMax={20}
                unit="br/min"
                height={220}
                phases={PHASES}
                showPhases
              />
            </div>
          </section>

          {/* The Key Insight */}
          <section className="mb-16">
            <div className="bg-amber-500/5 border border-amber-500/20 rounded-xl p-8">
              <h3 className="text-xl font-bold font-mono text-amber-500 mb-4">
                The Key Insight
              </h3>
              <p className="text-zinc-300 leading-relaxed mb-4">
                At 19:48, stress spikes briefly from 49 back to 58 — then continues down.
                This is the signature that distinguishes co-regulation from solo regulation.
              </p>
              <p className="text-zinc-400 leading-relaxed">
                A breathing exercise done alone produces a smooth curve. The jagged, responsive
                pattern here shows something different: the caregiver&apos;s nervous system is
                tracking the other person&apos;s second anxiety wave. Two bodies, one signal.
              </p>
            </div>
          </section>

          {/* Try the breathing */}
          <section className="mb-16">
            <h2 className="text-2xl font-bold font-mono mb-6 text-white">
              The Intervention
            </h2>
            <p className="text-zinc-400 mb-8 text-center max-w-xl mx-auto">
              At 19:38, respiration hit 6 breaths per minute — the vagal activation zone.
              This is what that feels like.
            </p>
            <div className="border border-zinc-800 rounded-lg p-8">
              <BreathingGuide />
            </div>
          </section>

          {/* What This Means */}
          <section className="mb-16">
            <h2 className="text-2xl font-bold font-mono mb-6 text-white">
              What This Means
            </h2>

            <blockquote className="border-l-2 border-amber-500/50 pl-6 py-2 text-zinc-300 text-lg leading-relaxed mb-6">
              Co-regulation is not a metaphor. It&apos;s a measurable physiological event.
            </blockquote>

            <div className="text-zinc-400 leading-relaxed space-y-4">
              <p>
                One Garmin watch recording three channels — stress, heart rate, respiration —
                captured the signature of two nervous systems modulating each other.
              </p>
              <p>
                <strong className="text-zinc-200">What the data shows:</strong> Presence works.
                Breathing together works. Sitting with someone in crisis — not solving it,
                not analyzing it, just breathing — produces a measurable shift in both
                autonomic nervous systems.
              </p>
              <p>
                The ~3 minute lag between respiration and stress, the ~6 minute lag to heart
                rate, the oscillation that tracks the other person&apos;s state — this is what
                co-regulation looks like as data.
              </p>
            </div>
          </section>

          {/* Try It */}
          <section className="mb-16">
            <h2 className="text-2xl font-bold font-mono mb-6 text-white">
              Try It Yourself
            </h2>

            <div className="grid md:grid-cols-2 gap-4">
              {[
                { step: '1', title: 'Sit close', desc: 'Physical proximity matters. Your nervous systems need to be in range.' },
                { step: '2', title: 'Match their breath', desc: 'Meet them where they are. A few breaths at their pace.' },
                { step: '3', title: 'Slow your exhale', desc: '5 seconds in, 5 seconds out. 6 breaths per minute.' },
                { step: '4', title: 'Stay', desc: 'Don\'t fix anything. Just breathe. 15 minutes to rebound.' },
              ].map((item) => (
                <div key={item.step} className="bg-zinc-900 border border-zinc-800 rounded-lg p-5">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-500 text-sm flex items-center justify-center font-mono">
                      {item.step}
                    </span>
                    <h3 className="font-bold text-white">{item.title}</h3>
                  </div>
                  <p className="text-zinc-400 text-sm">{item.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Footer */}
          <footer className="pt-8 border-t border-zinc-800">
            <p className="text-zinc-500 text-sm italic mb-8">
              This is one of the core observations that drives Mind Protocol: intelligence —
              and regulation — emerges in the bounce between substrates. Two nervous systems,
              entrained through breath, modulating each other.
            </p>
            <div className="flex items-center justify-between">
              <Link
                href="/blog"
                className="text-amber-500 hover:text-amber-400 transition"
              >
                &larr; All posts
              </Link>
              <div className="flex gap-4">
                {['biometrics', 'co-regulation', 'ANS'].map((tag) => (
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
    </>
  );
}
