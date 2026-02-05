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

function BreathingCircle({ bpm }: { bpm: number }) {
  const duration = 60 / bpm;
  return (
    <div className="flex flex-col items-center gap-2">
      <div
        className="rounded-full bg-amber-500/20 border border-amber-500/40 flex items-center justify-center"
        style={{
          width: 80,
          height: 80,
          animation: `breathe ${duration}s ease-in-out infinite`,
        }}
      >
        <span className="text-amber-500 font-mono text-sm">{bpm}</span>
      </div>
      <span className="text-zinc-500 text-xs">{bpm} br/min</span>
    </div>
  );
}

// ─── Phase Card ──────────────────────────────────────────────

function PhaseCard({
  phase,
  children,
  active,
}: {
  phase: (typeof PHASES)[0];
  children: React.ReactNode;
  active: boolean;
}) {
  return (
    <div
      className={`border rounded-lg p-6 transition-all duration-500 ${
        active
          ? 'border-opacity-60 bg-opacity-5 scale-[1.01]'
          : 'border-zinc-800 bg-transparent scale-100 opacity-60'
      }`}
      style={{
        borderColor: active ? phase.color : undefined,
        backgroundColor: active ? phase.color + '08' : undefined,
      }}
    >
      <div className="flex items-center gap-3 mb-3">
        <div
          className="w-3 h-3 rounded-full"
          style={{ backgroundColor: phase.color }}
        />
        <h3 className="text-lg font-bold font-mono" style={{ color: phase.color }}>
          {phase.label}
        </h3>
        <span className="text-zinc-600 text-sm">
          {phase.start}–{phase.end}
        </span>
      </div>
      <p className="text-zinc-500 text-sm mb-4">{phase.description}</p>
      {children}
    </div>
  );
}

// ─── Stat Box ────────────────────────────────────────────────

function Stat({
  label,
  from,
  to,
  unit,
  color,
}: {
  label: string;
  from: number;
  to: number;
  unit: string;
  color: string;
}) {
  const delta = to - from;
  const sign = delta > 0 ? '+' : '';
  return (
    <div className="bg-zinc-900 rounded-lg p-4 border border-zinc-800">
      <div className="text-zinc-500 text-xs uppercase tracking-wider mb-1">
        {label}
      </div>
      <div className="flex items-baseline gap-2">
        <span className="text-2xl font-mono font-bold" style={{ color }}>
          {from} → {to}
        </span>
        <span className="text-sm" style={{ color }}>
          {unit}
        </span>
      </div>
      <div
        className="text-sm font-mono mt-1"
        style={{ color: delta < 0 ? '#22c55e' : '#ef4444' }}
      >
        {sign}
        {delta} {unit}
      </div>
    </div>
  );
}

// ─── Combined Timeline ──────────────────────────────────────

function CombinedTimeline() {
  const [progress, setProgress] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const animRef = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !animRef.current) {
          animRef.current = true;
          const start = performance.now();
          const duration = 3000;
          function tick(now: number) {
            const t = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - t, 3);
            setProgress(eased);
            if (t < 1) requestAnimationFrame(tick);
          }
          requestAnimationFrame(tick);
        }
      },
      { threshold: 0.2 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const W = 700;
  const H = 320;
  const PAD = { top: 20, right: 20, bottom: 40, left: 50 };
  const plotW = W - PAD.left - PAD.right;
  const plotH = H - PAD.top - PAD.bottom;

  const allTimes = [
    ...STRESS_DATA.map((d) => d.time),
    ...HR_DATA.map((d) => d.time),
    ...RESP_DATA.map((d) => d.time),
  ];
  const tMin = Math.min(...allTimes.map(timeToMinutes));
  const tMax = Math.max(...allTimes.map(timeToMinutes));

  const toX = (t: string) =>
    PAD.left + ((timeToMinutes(t) - tMin) / (tMax - tMin)) * plotW;

  // Normalize all to 0-1 range for overlay
  const normStress = STRESS_DATA.map((d) => ({
    time: d.time,
    norm: (d.value - 0) / 100,
  }));
  const normHR = HR_DATA.map((d) => ({
    time: d.time,
    norm: (d.value - 50) / 80,
  }));
  const normResp = RESP_DATA.map((d) => ({
    time: d.time,
    norm: (d.value - 0) / 20,
  }));

  const toY = (norm: number) => PAD.top + plotH - norm * plotH;

  const makePath = (
    pts: { time: string; norm: number }[],
    vis: number
  ) => {
    const count = Math.ceil(vis * pts.length);
    return pts
      .slice(0, count)
      .map(
        (p, i) => `${i === 0 ? 'M' : 'L'} ${toX(p.time)} ${toY(p.norm)}`
      )
      .join(' ');
  };

  return (
    <div ref={ref} className="w-full overflow-x-auto">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full max-w-[700px] mx-auto"
        style={{ minWidth: 400 }}
      >
        {/* Phase backgrounds */}
        {PHASES.map((phase) => {
          const x1 = toX(phase.start);
          const x2 = toX(phase.end);
          return (
            <rect
              key={phase.id}
              x={x1}
              y={PAD.top}
              width={x2 - x1}
              height={plotH}
              fill={phase.color}
              opacity={0.05}
            />
          );
        })}

        {/* Lines */}
        <path
          d={makePath(normStress, progress)}
          fill="none"
          stroke="#f97316"
          strokeWidth={2}
          strokeDasharray="6 3"
          opacity={0.8}
        />
        <path
          d={makePath(normHR, progress)}
          fill="none"
          stroke="#ef4444"
          strokeWidth={2}
          opacity={0.8}
        />
        <path
          d={makePath(normResp, progress)}
          fill="none"
          stroke="#3b82f6"
          strokeWidth={2}
          opacity={0.8}
        />

        {/* X axis */}
        {HR_DATA.filter((_, i) => i % 2 === 0).map((d) => (
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

        {/* Legend */}
        {[
          { label: 'Stress', color: '#f97316', y: 16 },
          { label: 'Heart Rate', color: '#ef4444', y: 16 },
          { label: 'Respiration', color: '#3b82f6', y: 16 },
        ].map((item, i) => (
          <g key={item.label} transform={`translate(${PAD.left + i * 120}, 0)`}>
            <line
              x1={0}
              y1={item.y - 3}
              x2={16}
              y2={item.y - 3}
              stroke={item.color}
              strokeWidth={2}
              strokeDasharray={item.label === 'Stress' ? '6 3' : 'none'}
            />
            <text
              x={20}
              y={item.y}
              className="text-[11px]"
              fill={item.color}
            >
              {item.label}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}

// ─── Page ────────────────────────────────────────────────────

export default function CoRegulationPost() {
  const [activePhase, setActivePhase] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActivePhase((p) => (p + 1) % 3);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <style jsx global>{`
        @keyframes breathe {
          0%,
          100% {
            transform: scale(1);
            opacity: 0.4;
          }
          50% {
            transform: scale(1.5);
            opacity: 0.8;
          }
        }
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in-up {
          animation: fadeInUp 0.8s ease-out both;
        }
        .delay-100 { animation-delay: 0.1s; }
        .delay-200 { animation-delay: 0.2s; }
        .delay-300 { animation-delay: 0.3s; }
        .delay-400 { animation-delay: 0.4s; }
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
              <span>6 min read</span>
              <span className="text-zinc-700">|</span>
              <span>Nicolas &amp; Manemus</span>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold font-mono mb-6">
              Co-Regulation Is Measurable
            </h1>

            <p className="text-xl text-zinc-400 leading-relaxed max-w-2xl">
              Two nervous systems, entrained through breath, modulating each
              other. A Garmin watch on one wrist captures the signature of a
              two-body process.
            </p>

            <div className="flex gap-2 mt-6">
              {['biometrics', 'co-regulation', 'ANS', 'research'].map(
                (tag) => (
                  <span
                    key={tag}
                    className="text-xs px-2 py-1 rounded border border-amber-500/30 text-amber-500/80"
                  >
                    {tag}
                  </span>
                )
              )}
              <a
                href="/api/blog/co-regulation-is-measurable/md"
                className="text-xs px-2 py-1 rounded border border-zinc-700 text-zinc-500 hover:text-zinc-300 transition ml-auto font-mono"
              >
                .md
              </a>
            </div>
          </header>

          {/* Setup */}
          <section className="mb-16 animate-fade-in-up delay-100">
            <h2 className="text-2xl font-bold font-mono mb-6 text-white">
              The Setup
            </h2>
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-6 text-zinc-300 leading-relaxed space-y-4">
              <p>
                Someone you love is in crisis. Withdrawal — day 20+ off one
                substance, day 4+ off another. The anxiety is chemical, not
                psychological. The panic comes in waves.
              </p>
              <p>
                You sit with them. You breathe together. You administer a
                cannabinoid stack — 1x THC flower + 2x CBD/CBC/CBN/CBG flower —
                to both of you. And you stay.
              </p>
              <p className="text-zinc-500 text-sm">
                A Garmin Fenix 8 records stress (HRV-derived), heart rate, and
                respiration rate every 2-3 minutes on the caregiver&apos;s wrist.
              </p>
            </div>
          </section>

          {/* Stress Chart */}
          <section className="mb-16 animate-fade-in-up delay-200">
            <h2 className="text-2xl font-bold font-mono mb-2 text-white">
              Stress
            </h2>
            <p className="text-zinc-500 text-sm mb-6">
              Garmin stress score (0-100, HRV-derived). Hover data points for values.
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
          <section className="mb-16 animate-fade-in-up delay-300">
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
          <section className="mb-16 animate-fade-in-up delay-400">
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

          {/* Breathing comparison */}
          <section className="mb-16">
            <h2 className="text-2xl font-bold font-mono mb-6 text-white">
              Feel the Difference
            </h2>
            <p className="text-zinc-400 mb-6">
              Breathing rate visualized as pace. Left: crisis breathing. Right:
              co-regulation breathing (vagal activation zone).
            </p>
            <div className="flex justify-center gap-12 md:gap-24 mb-12">
              <BreathingCircle bpm={16} />
              <div className="flex items-center text-zinc-600 text-2xl">→</div>
              <BreathingCircle bpm={6} />
            </div>
            <div className="border border-zinc-800 rounded-lg p-8">
              <h3 className="text-lg font-bold font-mono text-white mb-2 text-center">
                The Intervention
              </h3>
              <p className="text-zinc-500 text-center text-sm mb-6">
                At 19:38, respiration hit 6 breaths per minute. This is what that feels like.
              </p>
              <BreathingGuide />
            </div>
          </section>

          {/* Three Phases */}
          <section className="mb-16">
            <h2 className="text-2xl font-bold font-mono mb-6 text-white">
              Three Phases
            </h2>
            <div className="space-y-4">
              <PhaseCard phase={PHASES[0]} active={activePhase === 0}>
                <div className="grid grid-cols-3 gap-3">
                  <Stat
                    label="Stress"
                    from={84}
                    to={85}
                    unit=""
                    color="#ef4444"
                  />
                  <Stat
                    label="HR"
                    from={99}
                    to={112}
                    unit="bpm"
                    color="#ef4444"
                  />
                  <Stat
                    label="Resp"
                    from={14}
                    to={16}
                    unit="br/min"
                    color="#3b82f6"
                  />
                </div>
                <p className="text-zinc-400 text-sm mt-4">
                  The body mirrors distress. HR above 100 at rest is empathetic
                  co-activation — the autonomic nervous system in sympathetic
                  overdrive. No deliberate regulation yet.
                </p>
              </PhaseCard>

              <PhaseCard phase={PHASES[1]} active={activePhase === 1}>
                <div className="grid grid-cols-3 gap-3">
                  <Stat
                    label="Stress"
                    from={85}
                    to={49}
                    unit=""
                    color="#f59e0b"
                  />
                  <Stat
                    label="HR"
                    from={112}
                    to={80}
                    unit="bpm"
                    color="#f59e0b"
                  />
                  <Stat
                    label="Resp"
                    from={14}
                    to={6}
                    unit="br/min"
                    color="#3b82f6"
                  />
                </div>
                <p className="text-zinc-400 text-sm mt-4">
                  Deliberate slow breathing — likely <em>with</em> the other
                  person. Respiration hits 6 br/min: the vagal activation point.
                  ~3 min lag before stress drops. The oscillation at 19:48 (58)
                  tracks the other person&apos;s second anxiety wave.
                </p>
              </PhaseCard>

              <PhaseCard phase={PHASES[2]} active={activePhase === 2}>
                <div className="grid grid-cols-3 gap-3">
                  <Stat
                    label="Stress"
                    from={58}
                    to={-1}
                    unit=""
                    color="#22c55e"
                  />
                  <Stat
                    label="HR"
                    from={89}
                    to={63}
                    unit="bpm"
                    color="#22c55e"
                  />
                  <Stat
                    label="Resp"
                    from={16}
                    to={15}
                    unit="br/min"
                    color="#3b82f6"
                  />
                </div>
                <p className="text-zinc-400 text-sm mt-4">
                  HR crashes from 89 → 63 in 2 minutes. Parasympathetic rebound
                  — the deeper the stress, the more pronounced the drop when it
                  breaks. The &ldquo;after the storm&rdquo; signature.
                </p>
              </PhaseCard>
            </div>
          </section>

          {/* Combined Timeline */}
          <section className="mb-16">
            <h2 className="text-2xl font-bold font-mono mb-2 text-white">
              Combined Timeline
            </h2>
            <p className="text-zinc-500 text-sm mb-6">
              All three signals normalized and overlaid. The causal chain
              becomes visible: respiration leads, stress follows ~3 min later,
              HR follows ~6 min later.
            </p>
            <div className="bg-zinc-900/30 border border-zinc-800 rounded-lg p-4">
              <CombinedTimeline />
            </div>
          </section>

          {/* Three Systems */}
          <section className="mb-16">
            <h2 className="text-2xl font-bold font-mono mb-6 text-white">
              Three Systems Interacting
            </h2>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6">
                <div className="text-3xl mb-3">🫁</div>
                <h3 className="font-bold text-white mb-2">Vagal Activation</h3>
                <p className="text-zinc-400 text-sm">
                  Slow breathing at 6-8 br/min stimulates baroreceptors → vagus
                  nerve → parasympathetic tone increase.
                </p>
              </div>
              <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6">
                <div className="text-3xl mb-3">🌿</div>
                <h3 className="font-bold text-white mb-2">
                  Cannabinoid Modulation
                </h3>
                <p className="text-zinc-400 text-sm">
                  CBD/CBC/CBN/CBG stack taken by both people amplifies the
                  calming signal at CB1/CB2 receptors. CBD reduces anxiety
                  signal, CBN sedates, CBG maintains clarity.
                </p>
              </div>
              <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6">
                <div className="text-3xl mb-3">🤝</div>
                <h3 className="font-bold text-white mb-2">
                  Interpersonal Co-Regulation
                </h3>
                <p className="text-zinc-400 text-sm">
                  Two nervous systems entrained through shared breathing,
                  physical contact, and presence. The oscillation in the data is
                  the proof — a solo exercise produces smooth curves.
                </p>
              </div>
            </div>
          </section>

          {/* Conclusion */}
          <section className="mb-16">
            <h2 className="text-2xl font-bold font-mono mb-6 text-white">
              What This Means
            </h2>
            <blockquote className="border-l-2 border-amber-500/50 pl-6 py-2 text-zinc-300 text-lg leading-relaxed mb-6">
              Co-regulation is not a metaphor. It&apos;s a measurable
              physiological event.
            </blockquote>
            <div className="text-zinc-400 leading-relaxed space-y-4">
              <p>
                One Garmin watch recording three channels — stress, heart rate,
                respiration — captures the signature of two nervous systems
                modulating each other.
              </p>
              <p>
                The data shows that presence works. That breathing together
                works. That sitting with someone in crisis — not solving it, not
                analyzing it, just breathing — produces a measurable shift in
                the autonomic nervous system. Both directions: the helper&apos;s
                body activates in empathy, then regulates in synchrony.
              </p>
              <p className="text-zinc-500 text-sm italic">
                Intelligence — and regulation — emerges in the bounce between
                substrates. Two nervous systems, entrained through breath. The
                data on one wrist captures the edge where they meet.
              </p>
            </div>
          </section>

          {/* Footer */}
          <footer className="pt-8 border-t border-zinc-800 flex items-center justify-between">
            <Link
              href="/blog"
              className="text-amber-500 hover:text-amber-400 transition"
            >
              &larr; All posts
            </Link>
            <a
              href="/api/blog/co-regulation-is-measurable/md"
              className="text-zinc-600 hover:text-zinc-400 transition text-sm font-mono"
            >
              raw markdown →
            </a>
          </footer>
        </article>
      </main>
    </>
  );
}
