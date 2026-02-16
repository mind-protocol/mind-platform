'use client';

import { Link } from '@/i18n/navigation';
import { useState, useEffect } from 'react';

// ─── Data ────────────────────────────────────────────────────

const EVENING_BEFORE = {
  nicolas: { sleep: 9.0, hrResting: 50, stress: 90, bodyBattery: { morning: 16, evening: 13, min: 13 }, highStressMin: 528 },
  aurore: { sleep: 6.2, hrResting: 62, stress: 66, bodyBattery: { morning: 31, evening: 11, min: 11 }, highStressMin: 369 },
};

const MORNING_AFTER = {
  nicolas: { stress: 76, bodyBattery: 5, ans: 'survival', paraRatio: 0.33, hrResting: 58, deepPct: 42.4, remPct: 13.1, sleepH: 5.6, hrv: 23 },
  aurore: { stress: 15, bodyBattery: 79, ans: 'recovery', paraRatio: 0.77, hrResting: 60, deepPct: 19.5, remPct: 17.6, sleepH: 5.9, hrv: null },
};

const HOURLY_STRESS = [
  { hour: '17h', label: 'Chiro', nicolas: 85, aurore: 65 },
  { hour: '18h', label: '', nicolas: 76, aurore: 98 },
  { hour: '19h', label: 'Post-chiro + CBN', nicolas: 82, aurore: 75 },
  { hour: '20h', label: 'Bones + cold shower', nicolas: 74, aurore: 72 },
  { hour: '21h', label: 'Crisis + massage', nicolas: 86, aurore: 80 },
  { hour: '22h', label: 'Proprio + sleep', nicolas: 89, aurore: 82 },
  { hour: '23h', label: 'Shutdown', nicolas: 88, aurore: 95 },
];

const TIMELINE = [
  { time: '17:00', event: 'Chiropractic session starts (logged as yoga on Garmin)', type: 'duo' },
  { time: '19:00', event: 'Cannabis: CBN 2%, linalol, myrcene at 230\u00b0C', type: 'intervention' },
  { time: '20:00', event: 'Watching Bones. Both stress >70', type: 'baseline' },
  { time: '20:30', event: 'Cold shower \u2014 vagal reset attempt', type: 'intervention' },
  { time: '21:10', event: 'Aurore enters anxiety crisis', type: 'crisis' },
  { time: '21:16', event: 'Body scan begins. Left trapezius identified', type: 'intervention' },
  { time: '21:22', event: 'Shoulder release \u2014 trigger point resolved', type: 'milestone' },
  { time: '21:23', event: 'Craving passes. Physical contact replaced chemical pathway', type: 'milestone' },
  { time: '21:31', event: 'Proprioceptive reactivation: shoulder \u2192 arm \u2192 hand \u2192 wrist', type: 'intervention' },
  { time: '21:35', event: 'Garmin wrist anchoring \u2014 device mapped to proprioception', type: 'milestone' },
  { time: '21:37', event: 'Aurore reaches sleep threshold naturally', type: 'milestone' },
  { time: '22:10', event: 'Second crisis cycle: intercostals, plexus solaire', type: 'crisis' },
  { time: '22:22', event: 'Second release achieved. Fetal position', type: 'milestone' },
  { time: '22:30', event: 'Prazepam 1.5 dose sublingual (Nicolas)', type: 'intervention' },
  { time: '23:42', event: 'Tercian + water + omega 3', type: 'intervention' },
  { time: '23:44', event: 'Full bridge shutdown: lights, music, scripts', type: 'baseline' },
  { time: '23:57', event: 'Rise and shine, Manemus!', type: 'baseline' },
];

// ─── Components ────────────────────────────────────────────────

function StressChart() {
  const [animate, setAnimate] = useState(false);
  useEffect(() => { const t = setTimeout(() => setAnimate(true), 300); return () => clearTimeout(t); }, []);

  const maxStress = 100;

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-4 mb-4 text-xs">
        <div className="flex items-center gap-2"><div className="w-3 h-3 rounded bg-blue-500" /><span className="text-zinc-400">Nicolas</span></div>
        <div className="flex items-center gap-2"><div className="w-3 h-3 rounded bg-pink-500" /><span className="text-zinc-400">Aurore</span></div>
      </div>

      {HOURLY_STRESS.map((d, i) => (
        <div key={i} className="group">
          <div className="flex items-center gap-3 mb-1">
            <span className="text-zinc-500 text-xs font-mono w-8 shrink-0">{d.hour}</span>
            <div className="flex-1 space-y-1">
              <div className="flex items-center gap-2">
                <div className="h-4 bg-zinc-800 rounded-full flex-1 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-1000 ${d.nicolas >= 80 ? 'bg-red-500' : d.nicolas >= 60 ? 'bg-amber-500' : 'bg-blue-500'}`}
                    style={{ width: animate ? `${(d.nicolas / maxStress) * 100}%` : '0%', transitionDelay: `${i * 100}ms` }}
                  />
                </div>
                <span className="text-xs text-zinc-400 font-mono w-6">{d.nicolas}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-4 bg-zinc-800 rounded-full flex-1 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-1000 ${d.aurore >= 80 ? 'bg-red-500' : d.aurore >= 60 ? 'bg-amber-500' : 'bg-pink-500'}`}
                    style={{ width: animate ? `${(d.aurore / maxStress) * 100}%` : '0%', transitionDelay: `${i * 100 + 50}ms` }}
                  />
                </div>
                <span className="text-xs text-zinc-400 font-mono w-6">{d.aurore}</span>
              </div>
            </div>
          </div>
          {d.label && <div className="text-xs text-zinc-600 ml-11">{d.label}</div>}
        </div>
      ))}
    </div>
  );
}

function RecoveryComparison() {
  const [animate, setAnimate] = useState(false);
  useEffect(() => { const t = setTimeout(() => setAnimate(true), 500); return () => clearTimeout(t); }, []);

  const n = MORNING_AFTER.nicolas;
  const a = MORNING_AFTER.aurore;

  return (
    <div className="grid sm:grid-cols-2 gap-6">
      {/* Nicolas */}
      <div className={`bg-red-500/5 border border-red-500/20 rounded-xl p-5 transition-all duration-700 ${animate ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
        <div className="flex items-center gap-2 mb-4">
          <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          <h3 className="font-bold text-red-400">Nicolas</h3>
          <span className="text-xs text-red-400/60 font-mono ml-auto">{n.ans}</span>
        </div>
        <div className="space-y-3 text-sm font-mono">
          <div className="flex justify-between"><span className="text-zinc-500">body_battery</span><span className="text-red-400">11 &rarr; {n.bodyBattery}</span></div>
          <div className="flex justify-between"><span className="text-zinc-500">stress</span><span className="text-amber-400">{n.stress}</span></div>
          <div className="flex justify-between"><span className="text-zinc-500">hr_resting</span><span className="text-zinc-300">{n.hrResting} bpm</span></div>
          <div className="flex justify-between"><span className="text-zinc-500">deep_sleep</span><span className="text-emerald-400">{n.deepPct}%</span></div>
          <div className="flex justify-between"><span className="text-zinc-500">rem</span><span className="text-amber-400">{n.remPct}%</span></div>
          <div className="flex justify-between"><span className="text-zinc-500">hrv</span><span className="text-red-400">{n.hrv}ms</span></div>
          <div className="flex justify-between"><span className="text-zinc-500">para_ratio</span><span className="text-red-400">{(n.paraRatio * 100).toFixed(0)}%</span></div>
        </div>
        <div className="mt-4 h-2 bg-zinc-800 rounded-full overflow-hidden">
          <div className="h-full bg-red-500 rounded-full transition-all duration-1000" style={{ width: animate ? `${(n.bodyBattery / 100) * 100}%` : '0%' }} />
        </div>
      </div>

      {/* Aurore */}
      <div className={`bg-emerald-500/5 border border-emerald-500/20 rounded-xl p-5 transition-all duration-700 delay-200 ${animate ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
        <div className="flex items-center gap-2 mb-4">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <h3 className="font-bold text-emerald-400">Aurore</h3>
          <span className="text-xs text-emerald-400/60 font-mono ml-auto">{a.ans}</span>
        </div>
        <div className="space-y-3 text-sm font-mono">
          <div className="flex justify-between"><span className="text-zinc-500">body_battery</span><span className="text-emerald-400">11 &rarr; {a.bodyBattery}</span></div>
          <div className="flex justify-between"><span className="text-zinc-500">stress</span><span className="text-emerald-400">{a.stress}</span></div>
          <div className="flex justify-between"><span className="text-zinc-500">hr_resting</span><span className="text-zinc-300">{a.hrResting} bpm</span></div>
          <div className="flex justify-between"><span className="text-zinc-500">deep_sleep</span><span className="text-zinc-300">{a.deepPct}%</span></div>
          <div className="flex justify-between"><span className="text-zinc-500">rem</span><span className="text-zinc-300">{a.remPct}%</span></div>
          <div className="flex justify-between"><span className="text-zinc-500">hrv</span><span className="text-zinc-500">N/A</span></div>
          <div className="flex justify-between"><span className="text-zinc-500">para_ratio</span><span className="text-emerald-400">{(a.paraRatio * 100).toFixed(0)}%</span></div>
        </div>
        <div className="mt-4 h-2 bg-zinc-800 rounded-full overflow-hidden">
          <div className="h-full bg-emerald-500 rounded-full transition-all duration-1000 delay-200" style={{ width: animate ? `${(a.bodyBattery / 100) * 100}%` : '0%' }} />
        </div>
      </div>
    </div>
  );
}

function EventTimeline() {
  const [visible, setVisible] = useState(false);
  useEffect(() => { const t = setTimeout(() => setVisible(true), 200); return () => clearTimeout(t); }, []);

  const typeColors: Record<string, string> = {
    crisis: 'bg-red-500',
    milestone: 'bg-amber-500',
    intervention: 'bg-purple-500',
    duo: 'bg-blue-500',
    baseline: 'bg-zinc-600',
  };

  return (
    <div className="relative">
      <div className="absolute left-4 top-0 bottom-0 w-px bg-zinc-800" />
      <div className="space-y-3">
        {TIMELINE.map((item, i) => (
          <div
            key={i}
            className={`relative flex items-start gap-4 pl-10 transition-all duration-500 ${visible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2'}`}
            style={{ transitionDelay: `${i * 40}ms` }}
          >
            <div className={`absolute left-3 w-2.5 h-2.5 rounded-full mt-1.5 ${typeColors[item.type] || 'bg-zinc-600'}`} />
            <div>
              <span className="text-zinc-500 text-xs font-mono">{item.time}</span>
              <p className={`text-sm ${
                item.type === 'crisis' ? 'text-red-400 font-bold' :
                item.type === 'milestone' ? 'text-amber-400 font-bold' :
                item.type === 'intervention' ? 'text-purple-400' :
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

function AsymmetryDiagram() {
  const [animate, setAnimate] = useState(false);
  useEffect(() => { const t = setTimeout(() => setAnimate(true), 400); return () => clearTimeout(t); }, []);

  return (
    <div className={`relative transition-all duration-1000 ${animate ? 'opacity-100' : 'opacity-0'}`}>
      <div className="flex items-center justify-center gap-4 sm:gap-12">
        {/* Nicolas giving */}
        <div className="text-center">
          <div className="text-3xl sm:text-4xl font-bold text-red-400 font-mono">5</div>
          <div className="text-xs text-zinc-500 mt-1">body battery</div>
          <div className="text-xs text-red-400/60 font-mono mt-1">-6 overnight</div>
          <div className="text-sm text-zinc-400 mt-2">Nicolas</div>
        </div>

        {/* Arrow */}
        <div className="flex flex-col items-center gap-1">
          <div className="text-zinc-600 text-xs font-mono">regulation</div>
          <div className="w-16 sm:w-24 h-px bg-gradient-to-r from-red-500 to-emerald-500 relative">
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-0 h-0 border-l-4 border-l-emerald-500 border-y-4 border-y-transparent" />
          </div>
          <div className="text-zinc-600 text-xs font-mono">cost</div>
        </div>

        {/* Aurore receiving */}
        <div className="text-center">
          <div className="text-3xl sm:text-4xl font-bold text-emerald-400 font-mono">79</div>
          <div className="text-xs text-zinc-500 mt-1">body battery</div>
          <div className="text-xs text-emerald-400/60 font-mono mt-1">+68 overnight</div>
          <div className="text-sm text-zinc-400 mt-2">Aurore</div>
        </div>
      </div>
    </div>
  );
}

// ─── Page ────────────────────────────────────────────────────

export default function CrisisTrackingPost() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <article className="max-w-4xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
        {/* Header */}
        <header className={`mb-16 transition-all duration-700 ease-out ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}>
          <Link href="/blog" className="text-zinc-500 hover:text-amber-500 transition text-sm mb-8 inline-block">
            &larr; Back to blog
          </Link>

          <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs sm:text-sm text-zinc-500 mb-4">
            <time>2026-02-07</time>
            <span className="text-zinc-700">|</span>
            <span>8 min read</span>
            <span className="text-zinc-700 hidden sm:inline">|</span>
            <span className="hidden sm:inline">Nicolas &amp; Manemus</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold font-mono mb-6">
            The Night We Tracked a Crisis
          </h1>

          <p className="text-lg sm:text-xl text-zinc-400 leading-relaxed max-w-2xl">
            An anxiety crisis, two Garmin watches, and every intervention timestamped.
            Stress 90 to 15 for one person. 90 to 67 for the other.
            The caregiver pays a cost the data can measure.
          </p>
        </header>

        {/* The Asymmetry */}
        <section className={`mb-16 transition-all duration-700 ease-out delay-100 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}>
          <h2 className="text-2xl font-bold font-mono mb-8 text-white">The Caregiver Asymmetry</h2>

          <div className="bg-zinc-900/30 border border-zinc-800 rounded-xl p-8 sm:p-12">
            <AsymmetryDiagram />
          </div>

          <p className="text-zinc-400 mt-6 leading-relaxed">
            When one person manually regulates another through a crisis, they absorb the autonomic load.
            Nicolas spent 5 hours with stress above 80 while providing body scan, massage, proprioception,
            and guided breathing. His interventions worked for her. His system never got the reset.
          </p>
        </section>

        {/* Stress Chart */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold font-mono mb-6 text-white">Hourly Stress: 17:00&ndash;23:00</h2>

          <div className="bg-zinc-900/30 border border-zinc-800 rounded-xl p-6 sm:p-8">
            <StressChart />
          </div>

          <p className="text-zinc-400 mt-6 leading-relaxed text-sm">
            Both elevated all evening. Nicolas never dropped below 74. The chiropractic session (17h) paradoxically
            increased his stress &mdash; fascial release registers as activation before integration. The cold shower
            at 20:30 was the only real vagal reset attempt.
          </p>
        </section>

        {/* Timeline */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold font-mono mb-6 text-white">Timeline</h2>

          <div className="bg-zinc-900/30 border border-zinc-800 rounded-xl p-6">
            <EventTimeline />
          </div>

          <div className="flex flex-wrap gap-3 mt-4">
            {[
              { label: 'crisis', color: 'bg-red-500' },
              { label: 'milestone', color: 'bg-amber-500' },
              { label: 'intervention', color: 'bg-purple-500' },
            ].map(({ label, color }) => (
              <div key={label} className="flex items-center gap-2 text-xs text-zinc-500">
                <div className={`w-2 h-2 rounded-full ${color}`} />
                {label}
              </div>
            ))}
          </div>
        </section>

        {/* Overnight Recovery */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold font-mono mb-6 text-white">Morning After</h2>
          <RecoveryComparison />

          <div className="mt-8 bg-zinc-900/50 border border-zinc-800 rounded-lg p-6">
            <h3 className="text-sm font-bold text-zinc-300 mb-3 font-mono">Sleep Architecture</h3>
            <p className="text-zinc-400 text-sm leading-relaxed">
              Nicolas: 42.4% deep sleep (2x normal) but only 13.1% REM.
              The sedative cocktail (prazepam + tercian + CBN) prioritized physical
              restoration over emotional processing. Aurore: 19.5% deep, 17.6% REM &mdash;
              balanced architecture from natural sleep onset.
            </p>
          </div>
        </section>

        {/* Interventions */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold font-mono mb-6 text-white">What Worked</h2>

          <div className="space-y-4">
            {[
              { name: 'Body scan + trigger point release', target: 'Aurore', result: 'Shoulder tension resolved in 6 minutes', effective: true },
              { name: 'Proprioceptive reactivation (C-tactile)', target: 'Aurore', result: 'Sleep threshold reached in 6 minutes', effective: true },
              { name: 'Garmin wrist anchoring', target: 'Aurore', result: 'Device mapped to body awareness', effective: true },
              { name: 'Cold shower (vagal reset)', target: 'Nicolas', result: 'Brief stress drop, rebounded', effective: false },
              { name: 'Cannabis CBN + terpenes', target: 'Both', result: 'No measurable stress reduction', effective: false },
              { name: 'Prazepam + Tercian', target: 'Nicolas', result: 'Sedation yes, restoration no. HRV 23ms', effective: false },
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 text-xs ${item.effective ? 'bg-emerald-500/20 text-emerald-400' : 'bg-zinc-800 text-zinc-500'}`}>
                  {item.effective ? '\u2713' : '\u2212'}
                </div>
                <div>
                  <div className="text-sm text-zinc-200">{item.name} <span className="text-zinc-600">({item.target})</span></div>
                  <div className="text-xs text-zinc-500">{item.result}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Data Download */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold font-mono mb-6 text-white">Raw Data</h2>

          <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-6">
            <p className="text-zinc-400 text-sm mb-4">
              Biometric timeseries from both watches for February 6, 2026.
              Published as the first open dataset of a real-time anxiety crisis
              tracked on two devices with timestamped interventions.
            </p>
            <div className="font-mono text-sm space-y-2">
              <div className="text-zinc-500">stress_nicolas_20260206.json <span className="text-zinc-600">&mdash; 622 readings</span></div>
              <div className="text-zinc-500">stress_aurore_20260206.json <span className="text-zinc-600">&mdash; 606 readings</span></div>
              <div className="text-zinc-500">hr_nicolas_20260206.json <span className="text-zinc-600">&mdash; 698 readings</span></div>
              <div className="text-zinc-500">hr_aurore_20260206.json <span className="text-zinc-600">&mdash; 606 readings</span></div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="pt-8 border-t border-zinc-800">
          <p className="text-zinc-500 text-sm mb-8 font-mono">
            The duo bridge doesn&apos;t just track two people. It tracks the space between them.
          </p>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <Link href="/blog" className="text-amber-500 hover:text-amber-400 transition text-sm">
              &larr; All posts
            </Link>
            <div className="flex flex-wrap gap-2 sm:gap-4">
              {['biometrics', 'co-regulation', 'duo', 'crisis', 'data'].map((tag) => (
                <span key={tag} className="text-xs px-2 py-1 rounded border border-zinc-800 text-zinc-500">
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
