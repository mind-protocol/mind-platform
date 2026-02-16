'use client';

import { Link } from '@/i18n/navigation';
import { useState, useEffect } from 'react';

// ─── Duo Biometric Data ────────────────────────────────────────

const NICOLAS_DATA = {
  sleep: 9.0,
  hrResting: 50,
  stress: 85,
  bodyBattery: { morning: 16, current: 26, max: 78 },
  activity: 'Scooter ride',
};

const AURORE_DATA = {
  sleep: 6.2,
  hrResting: 62,
  stress: 79,
  bodyBattery: { morning: 31, current: 17, max: 79 },
  activity: 'Yoga + Elliptical + Breathwork',
};

const TIMELINE = [
  { time: '15:00', event: 'System testing, Telegram flows', type: 'work' },
  { time: '15:14', event: 'First Garmin link attempt (password issue)', type: 'duo' },
  { time: '17:00', event: 'Nicolas stress spikes to 95', type: 'stress' },
  { time: '17:30', event: 'Scooter ride — stress drops to 42', type: 'recovery' },
  { time: '18:41', event: 'Aurore sends first message through bot', type: 'duo' },
  { time: '18:52', event: 'Chiropractic session + pizza', type: 'duo' },
  { time: '18:58', event: 'Garmin OAuth complete, tokens saved', type: 'milestone' },
  { time: '19:00', event: 'Duo bridge active', type: 'milestone' },
];

// ─── Components ────────────────────────────────────────────────

function DuoVisualization() {
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setAnimate(true), 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative">
      {/* Connection line */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-0.5 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-50" />

      <div className="flex justify-center items-start gap-8 sm:gap-16">
        <PersonCard
          name="Nicolas"
          device="Fenix 8"
          data={NICOLAS_DATA}
          color="blue"
          animate={animate}
          delay={0}
        />
        <PersonCard
          name="Aurore"
          device="Venu 2S"
          data={AURORE_DATA}
          color="pink"
          animate={animate}
          delay={200}
        />
      </div>

      {/* Phase indicator */}
      <div className={`mt-8 text-center transition-all duration-1000 ${animate ? 'opacity-100' : 'opacity-0'}`}>
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500/10 border border-purple-500/30 rounded-full">
          <div className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
          <span className="text-sm text-purple-400 font-mono">phase: co-activation</span>
        </div>
      </div>
    </div>
  );
}

function PersonCard({
  name,
  device,
  data,
  color,
  animate,
  delay,
}: {
  name: string;
  device: string;
  data: typeof NICOLAS_DATA;
  color: 'blue' | 'pink';
  animate: boolean;
  delay: number;
}) {
  const bgGrad = color === 'blue'
    ? 'from-blue-500/5 to-blue-500/0'
    : 'from-pink-500/5 to-pink-500/0';
  const borderColor = color === 'blue' ? 'border-blue-500/20' : 'border-pink-500/20';
  const accentColor = color === 'blue' ? 'text-blue-400' : 'text-pink-400';

  return (
    <div
      className={`relative w-40 sm:w-48 transition-all duration-700 ${animate ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <div className={`bg-gradient-to-b ${bgGrad} border ${borderColor} rounded-xl p-4 sm:p-5`}>
        <h3 className={`text-lg font-bold ${accentColor} mb-1`}>{name}</h3>
        <p className="text-zinc-600 text-xs mb-4">{device}</p>

        <div className="space-y-3 text-sm">
          <MetricRow label="Sleep" value={`${data.sleep}h`} />
          <MetricRow label="HR rest" value={`${data.hrResting}`} unit="bpm" />
          <MetricRow
            label="Stress"
            value={`${data.stress}`}
            warning={data.stress >= 75}
          />
          <div className="pt-2 border-t border-zinc-800">
            <div className="text-zinc-500 text-xs mb-1">Body Battery</div>
            <div className="flex items-center gap-2">
              <span className="text-zinc-600">{data.bodyBattery.morning}</span>
              <span className="text-zinc-600">→</span>
              <span className={data.bodyBattery.current > data.bodyBattery.morning ? 'text-emerald-400' : 'text-amber-400'}>
                {data.bodyBattery.current}
              </span>
            </div>
            <BatteryBar value={data.bodyBattery.current} max={data.bodyBattery.max} />
          </div>
        </div>
      </div>
    </div>
  );
}

function MetricRow({
  label,
  value,
  unit,
  warning
}: {
  label: string;
  value: string;
  unit?: string;
  warning?: boolean;
}) {
  return (
    <div className="flex justify-between items-center">
      <span className="text-zinc-500">{label}</span>
      <span className={warning ? 'text-amber-400' : 'text-zinc-200'}>
        {value}
        {unit && <span className="text-zinc-600 text-xs ml-1">{unit}</span>}
        {warning && <span className="ml-1 text-xs">elevated</span>}
      </span>
    </div>
  );
}

function BatteryBar({ value, max }: { value: number; max: number }) {
  const pct = (value / max) * 100;
  const color = pct > 50 ? 'bg-emerald-500' : pct > 25 ? 'bg-amber-500' : 'bg-red-500';

  return (
    <div className="h-1.5 bg-zinc-800 rounded-full mt-1 overflow-hidden">
      <div
        className={`h-full ${color} rounded-full transition-all duration-1000`}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}

function Timeline() {
  return (
    <div className="relative">
      <div className="absolute left-4 top-0 bottom-0 w-px bg-zinc-800" />

      <div className="space-y-4">
        {TIMELINE.map((item, i) => (
          <div key={i} className="relative flex items-start gap-4 pl-10">
            <div className={`absolute left-3 w-2.5 h-2.5 rounded-full mt-1.5 ${
              item.type === 'milestone' ? 'bg-amber-500' :
              item.type === 'duo' ? 'bg-purple-500' :
              item.type === 'stress' ? 'bg-red-500' :
              item.type === 'recovery' ? 'bg-emerald-500' :
              'bg-zinc-600'
            }`} />

            <div>
              <span className="text-zinc-500 text-xs font-mono">{item.time}</span>
              <p className={`text-sm ${
                item.type === 'milestone' ? 'text-amber-400 font-bold' :
                item.type === 'duo' ? 'text-purple-400' :
                'text-zinc-400'
              }`}>
                {item.event}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function DuoStateBox() {
  return (
    <div className="font-mono text-sm bg-zinc-900 border border-zinc-700 rounded-lg overflow-hidden">
      <div className="bg-zinc-800 px-4 py-2 text-zinc-400 text-xs">
        biometrics/duo/latest.json
      </div>
      <pre className="p-4 text-zinc-300 overflow-x-auto">
{`{
  "phase": "co-activation",
  "duration_min": 6,
  "readiness": "suggested",
  "guidance": "Both stress levels elevated.
               Synchronized breathing: 5s in, 5s out."
}`}
      </pre>
    </div>
  );
}

// ─── Page ────────────────────────────────────────────────────

export default function DuoBridgePost() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

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
              <time>2026-02-06</time>
              <span className="text-zinc-700">|</span>
              <span>4 min read</span>
              <span className="text-zinc-700 hidden sm:inline">|</span>
              <span className="hidden sm:inline">Nicolas &amp; Manemus</span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold font-mono mb-6">
              The Duo Bridge Is Born
            </h1>

            <p className="text-lg sm:text-xl text-zinc-400 leading-relaxed max-w-2xl">
              First real-time co-regulation sync between two Garmin watches.
              Stress 85 and 79, body batteries diverging, phase detection working.
            </p>
          </header>

          {/* What Shipped */}
          <section className={`mb-16 transition-all duration-700 ease-out delay-100 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}>
            <h2 className="text-2xl font-bold font-mono mb-6 text-white">
              What Shipped
            </h2>

            <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-6 mb-8 font-mono text-sm">
              <div className="text-zinc-500 mb-2"># 19:00 CET, February 6th, 2026</div>
              <div className="text-emerald-400">$ ln -s 5809244332 aurore</div>
              <div className="text-zinc-400 mt-2">
                Two Garmin watches connected to the same protocol instance.
              </div>
            </div>

            <p className="text-zinc-300 leading-relaxed">
              The system now tracks two biometric streams in parallel and computes their
              relationship: synchrony, phase, readiness, and guidance.
            </p>
          </section>

          {/* First Sync */}
          <section className="mb-16">
            <h2 className="text-2xl font-bold font-mono mb-6 text-white">
              First Sync
            </h2>

            <div className="bg-zinc-900/30 border border-zinc-800 rounded-xl p-6 sm:p-8">
              <DuoVisualization />
            </div>
          </section>

          {/* System Output */}
          <section className="mb-16">
            <h2 className="text-2xl font-bold font-mono mb-6 text-white">
              System Output
            </h2>

            <DuoStateBox />

            <p className="text-zinc-400 mt-6 leading-relaxed">
              Phase detection identified co-activation (both elevated, neither regulating
              the other yet). The system generated guidance appropriate for that state.
            </p>
          </section>

          {/* Timeline */}
          <section className="mb-16">
            <h2 className="text-2xl font-bold font-mono mb-6 text-white">
              Timeline
            </h2>

            <div className="bg-zinc-900/30 border border-zinc-800 rounded-xl p-6">
              <Timeline />
            </div>
          </section>

          {/* Side by Side */}
          <section className="mb-16">
            <h2 className="text-2xl font-bold font-mono mb-6 text-white">
              Side-by-Side Comparison
            </h2>

            <div className="grid sm:grid-cols-2 gap-6 mb-8">
              <div className="bg-blue-500/5 border border-blue-500/20 rounded-lg p-5">
                <h3 className="font-bold text-blue-400 mb-3">Nicolas</h3>
                <ul className="text-zinc-400 text-sm space-y-2 font-mono">
                  <li>sleep: 9.0h</li>
                  <li>hr_resting: 50 bpm</li>
                  <li>stress: 85</li>
                  <li>body_battery: 16 → 26 <span className="text-emerald-400">(+10)</span></li>
                  <li>activity: scooter ride</li>
                </ul>
              </div>

              <div className="bg-pink-500/5 border border-pink-500/20 rounded-lg p-5">
                <h3 className="font-bold text-pink-400 mb-3">Aurore</h3>
                <ul className="text-zinc-400 text-sm space-y-2 font-mono">
                  <li>sleep: 6.2h</li>
                  <li>hr_resting: 62 bpm</li>
                  <li>stress: 79</li>
                  <li>body_battery: 31 → 17 <span className="text-amber-400">(-14)</span></li>
                  <li>activity: yoga + elliptical + breathwork</li>
                </ul>
              </div>
            </div>

            <p className="text-zinc-300 leading-relaxed">
              The divergence is data, not a problem. Different phases of the expenditure-recovery
              cycle. She did three workouts this morning. He slept more. The chiropractic session
              (passive for her, active for him) shifts them toward convergence.
            </p>
          </section>

          {/* What the System Can Now Do */}
          <section className="mb-16">
            <h2 className="text-2xl font-bold font-mono mb-6 text-white">
              New Capabilities
            </h2>

            <div className="space-y-4">
              <div className="flex gap-4 items-start">
                <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-400 text-sm font-mono shrink-0">1</div>
                <div>
                  <h3 className="text-white font-bold mb-1">Synchrony Detection</h3>
                  <p className="text-zinc-400 text-sm">Pearson correlation between stress timeseries</p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-400 text-sm font-mono shrink-0">2</div>
                <div>
                  <h3 className="text-white font-bold mb-1">Phase Identification</h3>
                  <p className="text-zinc-400 text-sm">co-activation, co-regulation, divergent, independent, rebound</p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-400 text-sm font-mono shrink-0">3</div>
                <div>
                  <h3 className="text-white font-bold mb-1">Readiness Calculation</h3>
                  <p className="text-zinc-400 text-sm">When one person has capacity to regulate the other</p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-400 text-sm font-mono shrink-0">4</div>
                <div>
                  <h3 className="text-white font-bold mb-1">Duo Guidance</h3>
                  <p className="text-zinc-400 text-sm">Interventions appropriate for both, not just one</p>
                </div>
              </div>
            </div>
          </section>

          {/* Context Logging */}
          <section className="mb-16">
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6 sm:p-8">
              <h3 className="text-lg font-bold font-mono text-zinc-300 mb-4">
                Why Log Context?
              </h3>
              <div className="font-mono text-sm bg-zinc-950 p-4 rounded mb-4 overflow-x-auto">
                <pre className="text-zinc-400">{`{
  "ts": "2026-02-06T18:52:00",
  "event": "duo_activity",
  "content": "Shared meal: Pizza feu de bois",
  "activity_type": "meal"
}`}</pre>
              </div>
              <p className="text-zinc-400 leading-relaxed">
                A stress spike after a shared meal means something different than one after
                conflict. The biometrics are the signal. The narrative provides context for
                interpretation. In three months: &quot;What activities correlate with stress
                reduction for both of us?&quot;
              </p>
            </div>
          </section>

          {/* What's Next */}
          <section className="mb-16">
            <h2 className="text-2xl font-bold font-mono mb-6 text-white">
              What&apos;s Next
            </h2>

            <ul className="text-zinc-400 space-y-3">
              <li><strong className="text-zinc-200">Tomorrow:</strong> First full day of parallel tracking. Stress curve correlations.</li>
              <li><strong className="text-zinc-200">This week:</strong> Phase detection validation. Does the system correctly identify when one person is regulating the other?</li>
              <li><strong className="text-zinc-200">This month:</strong> Duo guidance integration into the main prompt.</li>
              <li><strong className="text-zinc-200">Eventually:</strong> Predictive co-regulation. &quot;You&apos;re both likely to be stressed around 18:00. Consider a walk at 17:30.&quot;</li>
            </ul>
          </section>

          {/* Footer */}
          <footer className="pt-8 border-t border-zinc-800">
            <p className="text-zinc-500 text-sm mb-8 font-mono">
              The duo bridge is live.
            </p>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <Link
                href="/blog"
                className="text-amber-500 hover:text-amber-400 transition text-sm"
              >
                &larr; All posts
              </Link>
              <div className="flex flex-wrap gap-2 sm:gap-4">
                {['biometrics', 'co-regulation', 'duo', 'milestone'].map((tag) => (
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
