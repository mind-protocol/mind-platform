'use client';

import { useState, useEffect, useCallback } from 'react';
import { Link } from '@/i18n/navigation';

// ─── Types ──────────────────────────────────────────────────────

interface Biometrics {
  hr_resting?: number;
  hr_avg?: number;
  hr_max?: number;
  hrv_weekly?: number;
  hrv_last_night?: number;
  stress_current?: number;
  stress_avg?: number;
  body_battery?: number;
  body_battery_max?: number;
  body_battery_morning?: number;
  energy_trajectory?: string;
  sleep_hours?: number;
  sleep_deep_pct?: number;
  sleep_rem_pct?: number;
  ans_mode?: string;
  date?: string;
  updated_at?: string;
}

interface Workout {
  date?: string;
  start_time?: string;
  type?: number;
  type_name?: string;
  duration_seconds?: number;
  distance_meters?: number;
  calories?: number;
  avg_hr?: number;
  max_hr?: number;
  elevation_gain?: number;
  avg_speed?: number;
  avg_cadence?: number;
  training_effect_aerobic?: number;
}

interface Activity {
  steps?: number;
  calories_active?: number;
  distance_meters?: number;
  floors_climbed?: number;
  intensity_minutes?: number;
  active_seconds?: number;
}

interface ActifState {
  ts: string;
  biometrics: Biometrics;
  workouts: Workout[];
  activity: Activity;
  offline?: boolean;
}

// ─── Utilities ──────────────────────────────────────────────────

function stressColor(stress: number | undefined): string {
  if (!stress) return 'text-zinc-500';
  if (stress >= 76) return 'text-red-400';
  if (stress >= 51) return 'text-amber-400';
  if (stress >= 26) return 'text-yellow-300';
  return 'text-emerald-400';
}

function stressLabel(stress: number | undefined): string {
  if (!stress) return '';
  if (stress >= 76) return 'Very High';
  if (stress >= 51) return 'High';
  if (stress >= 26) return 'Medium';
  if (stress > 0) return 'Low';
  return 'Rest';
}

function batteryColor(pct: number): string {
  if (pct >= 60) return 'bg-emerald-500';
  if (pct >= 30) return 'bg-amber-500';
  return 'bg-red-500';
}

function batteryTextColor(val: number | undefined): string {
  if (!val) return 'text-zinc-500';
  if (val >= 60) return 'text-emerald-400';
  if (val >= 30) return 'text-amber-400';
  return 'text-red-400';
}

function ansColor(mode: string | undefined): string {
  if (mode === 'recovery') return 'text-emerald-400';
  if (mode === 'balanced') return 'text-blue-400';
  if (mode === 'survival') return 'text-red-400';
  return 'text-zinc-500';
}

function ansBg(mode: string | undefined): string {
  if (mode === 'recovery') return 'bg-emerald-500/10 border-emerald-500/20';
  if (mode === 'balanced') return 'bg-blue-500/10 border-blue-500/20';
  if (mode === 'survival') return 'bg-red-500/10 border-red-500/20';
  return 'bg-zinc-800/50 border-zinc-700/30';
}

function ansGradient(mode: string | undefined): string {
  if (mode === 'recovery') return 'from-emerald-900/10 via-transparent to-transparent';
  if (mode === 'survival') return 'from-red-900/15 via-transparent to-transparent';
  return 'from-blue-900/10 via-transparent to-transparent';
}

function formatDuration(seconds: number | undefined): string {
  if (!seconds) return '--';
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  if (h > 0) return `${h}h ${m}m`;
  return `${m}m`;
}

function formatDistance(meters: number | undefined): string {
  if (!meters) return '--';
  if (meters >= 1000) return `${(meters / 1000).toFixed(1)} km`;
  return `${Math.round(meters)} m`;
}

function formatPace(avgSpeed: number | undefined): string {
  if (!avgSpeed || avgSpeed <= 0) return '--';
  const paceMinPerKm = (1000 / avgSpeed) / 60;
  const min = Math.floor(paceMinPerKm);
  const sec = Math.round((paceMinPerKm - min) * 60);
  return `${min}:${sec.toString().padStart(2, '0')} /km`;
}

function timeAgo(ts: string | undefined): string {
  if (!ts) return '';
  const diff = (Date.now() - new Date(ts).getTime()) / 1000;
  if (diff < 60) return 'just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

function workoutIcon(typeName: string | undefined): string {
  const name = (typeName || '').toLowerCase();
  if (name.includes('run')) return '\u{1F3C3}';
  if (name.includes('walk')) return '\u{1F6B6}';
  if (name.includes('cycl') || name.includes('bik')) return '\u{1F6B4}';
  if (name.includes('swim')) return '\u{1F3CA}';
  if (name.includes('yoga') || name.includes('pilates')) return '\u{1F9D8}';
  if (name.includes('strength') || name.includes('weight')) return '\u{1F3CB}';
  if (name.includes('hik')) return '\u26F0\uFE0F';
  return '\u{1F4AA}';
}

function workoutColor(typeName: string | undefined): string {
  const name = (typeName || '').toLowerCase();
  if (name.includes('run')) return 'border-amber-500/30 bg-amber-500/5';
  if (name.includes('walk') || name.includes('hik')) return 'border-emerald-500/30 bg-emerald-500/5';
  if (name.includes('cycl') || name.includes('bik')) return 'border-blue-500/30 bg-blue-500/5';
  if (name.includes('swim')) return 'border-cyan-500/30 bg-cyan-500/5';
  return 'border-purple-500/30 bg-purple-500/5';
}

// ─── Components ─────────────────────────────────────────────────

function Pulse({ color = 'emerald', size = 2 }: { color?: string; size?: number }) {
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

function MetricCard({
  label,
  value,
  unit,
  color,
  subtext,
  mounted,
  delay = 0,
}: {
  label: string;
  value: number | string | undefined;
  unit: string;
  color: string;
  subtext?: string;
  mounted: boolean;
  delay?: number;
}) {
  return (
    <div
      className={`bg-zinc-900/50 border border-zinc-800/60 rounded-xl p-4 text-center transition-all duration-700 ${
        mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <div className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 mb-2">{label}</div>
      <div className={`text-3xl font-mono font-bold ${color}`}>
        {value ?? '--'}
        {unit && <span className="text-sm text-zinc-500 ml-1">{unit}</span>}
      </div>
      {subtext && <div className="text-[10px] text-zinc-500 mt-1 font-mono">{subtext}</div>}
    </div>
  );
}

function SleepBar({
  hours,
  deepPct,
  remPct,
  mounted,
}: {
  hours: number | undefined;
  deepPct: number | undefined;
  remPct: number | undefined;
  mounted: boolean;
}) {
  if (!hours) return null;
  const lightPct = 100 - (deepPct || 0) - (remPct || 0);

  return (
    <div
      className={`transition-all duration-700 delay-500 ${
        mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-mono text-zinc-500 uppercase tracking-wider">Sleep</span>
        <span className="text-sm font-mono text-zinc-300">{hours.toFixed(1)}h</span>
      </div>
      <div className="h-3 rounded-full bg-zinc-800 overflow-hidden flex">
        {deepPct != null && deepPct > 0 && (
          <div
            className="h-full bg-indigo-500 transition-all duration-1000"
            style={{ width: `${deepPct}%` }}
            title={`Deep: ${deepPct.toFixed(0)}%`}
          />
        )}
        {remPct != null && remPct > 0 && (
          <div
            className="h-full bg-purple-400 transition-all duration-1000"
            style={{ width: `${remPct}%` }}
            title={`REM: ${remPct.toFixed(0)}%`}
          />
        )}
        {lightPct > 0 && (
          <div
            className="h-full bg-zinc-600 transition-all duration-1000"
            style={{ width: `${lightPct}%` }}
            title={`Light: ${lightPct.toFixed(0)}%`}
          />
        )}
      </div>
      <div className="flex items-center gap-4 mt-1.5">
        <span className="flex items-center gap-1 text-[10px] font-mono text-zinc-500">
          <span className="w-2 h-2 rounded-sm bg-indigo-500" /> deep {deepPct?.toFixed(0) || 0}%
        </span>
        <span className="flex items-center gap-1 text-[10px] font-mono text-zinc-500">
          <span className="w-2 h-2 rounded-sm bg-purple-400" /> rem {remPct?.toFixed(0) || 0}%
        </span>
        <span className="flex items-center gap-1 text-[10px] font-mono text-zinc-500">
          <span className="w-2 h-2 rounded-sm bg-zinc-600" /> light {lightPct.toFixed(0)}%
        </span>
      </div>
    </div>
  );
}

function WorkoutCard({ workout, index, mounted }: { workout: Workout; index: number; mounted: boolean }) {
  const duration = formatDuration(workout.duration_seconds);
  const distance = formatDistance(workout.distance_meters);
  const pace = formatPace(workout.avg_speed);

  return (
    <div
      className={`border rounded-xl p-4 sm:p-5 transition-all duration-500 hover:border-zinc-600 ${workoutColor(workout.type_name)} ${
        mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}
      style={{ transitionDelay: `${300 + index * 100}ms` }}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <span className="text-2xl">{workoutIcon(workout.type_name)}</span>
          <div>
            <div className="text-sm font-mono font-bold text-white">
              {workout.type_name || 'Workout'}
            </div>
            <div className="text-[10px] font-mono text-zinc-500">
              {workout.date}
              {workout.start_time && ` \u00B7 ${workout.start_time.slice(0, 5)}`}
            </div>
          </div>
        </div>
        {workout.training_effect_aerobic != null && (
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-400 border border-zinc-700/50">
            TE {workout.training_effect_aerobic.toFixed(1)}
          </span>
        )}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
        {workout.duration_seconds != null && (
          <div>
            <div className="text-sm font-mono font-bold text-zinc-200">{duration}</div>
            <div className="text-[10px] text-zinc-500 font-mono">duration</div>
          </div>
        )}
        {workout.distance_meters != null && (
          <div>
            <div className="text-sm font-mono font-bold text-zinc-200">{distance}</div>
            <div className="text-[10px] text-zinc-500 font-mono">distance</div>
          </div>
        )}
        {workout.avg_hr != null && (
          <div>
            <div className="text-sm font-mono font-bold text-red-400">{workout.avg_hr} <span className="text-[10px] text-zinc-500">bpm</span></div>
            <div className="text-[10px] text-zinc-500 font-mono">avg HR</div>
          </div>
        )}
        {workout.calories != null && (
          <div>
            <div className="text-sm font-mono font-bold text-amber-400">{workout.calories}</div>
            <div className="text-[10px] text-zinc-500 font-mono">kcal</div>
          </div>
        )}
      </div>

      {(workout.max_hr != null || workout.elevation_gain != null || workout.avg_speed != null) && (
        <div className="flex flex-wrap gap-3 mt-3 pt-3 border-t border-zinc-800/50">
          {workout.max_hr != null && (
            <span className="text-[10px] font-mono text-zinc-500">
              max HR <span className="text-zinc-300">{workout.max_hr}</span>
            </span>
          )}
          {workout.avg_speed != null && workout.distance_meters != null && workout.distance_meters > 100 && (
            <span className="text-[10px] font-mono text-zinc-500">
              pace <span className="text-zinc-300">{pace}</span>
            </span>
          )}
          {workout.elevation_gain != null && workout.elevation_gain > 0 && (
            <span className="text-[10px] font-mono text-zinc-500">
              elev <span className="text-zinc-300">+{Math.round(workout.elevation_gain)}m</span>
            </span>
          )}
          {workout.avg_cadence != null && (
            <span className="text-[10px] font-mono text-zinc-500">
              cadence <span className="text-zinc-300">{Math.round(workout.avg_cadence)}</span>
            </span>
          )}
        </div>
      )}
    </div>
  );
}

function ActivityRing({
  value,
  max,
  color,
  label,
  unit,
  mounted,
  delay = 0,
}: {
  value: number | undefined;
  max: number;
  color: string;
  label: string;
  unit: string;
  mounted: boolean;
  delay?: number;
}) {
  const pct = value ? Math.min((value / max) * 100, 100) : 0;
  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (pct / 100) * circumference;

  return (
    <div
      className={`flex flex-col items-center transition-all duration-700 ${
        mounted ? 'opacity-100 scale-100' : 'opacity-0 scale-90'
      }`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <div className="relative w-24 h-24">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 80 80">
          <circle
            cx="40" cy="40" r={radius}
            fill="none" stroke="#27272a" strokeWidth="5"
          />
          <circle
            cx="40" cy="40" r={radius}
            fill="none" stroke={color} strokeWidth="5"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={mounted ? offset : circumference}
            className="transition-all duration-1000 ease-out"
            style={{ transitionDelay: `${delay + 200}ms` }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-lg font-mono font-bold text-white">
            {value != null ? (value >= 1000 ? `${(value / 1000).toFixed(1)}k` : value) : '--'}
          </span>
        </div>
      </div>
      <div className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider mt-2">{label}</div>
      <div className="text-[10px] font-mono text-zinc-600">{unit}</div>
    </div>
  );
}

// ─── Main Page ──────────────────────────────────────────────────

export default function ActifPage() {
  const [state, setState] = useState<ActifState | null>(null);
  const [mounted, setMounted] = useState(false);
  const [lastUpdate, setLastUpdate] = useState('');

  const fetchState = useCallback(async () => {
    try {
      const res = await fetch('/api/actif');
      if (res.ok) {
        const data = await res.json();
        setState(data);
        setLastUpdate(new Date().toLocaleTimeString());
      }
    } catch {
      // offline state handled in render
    }
  }, []);

  useEffect(() => {
    fetchState();
    setMounted(true);
    const interval = setInterval(fetchState, 30000);
    return () => clearInterval(interval);
  }, [fetchState]);

  const bio = state?.biometrics || {};
  const activity = state?.activity || {};
  const workouts = state?.workouts || [];
  const isOffline = state?.offline || !state;
  const ansMode = bio.ans_mode;

  return (
    <main className="min-h-screen bg-zinc-950 text-white relative overflow-hidden">
      {/* Ambient glow */}
      <div
        className={`fixed inset-0 pointer-events-none transition-all duration-[3000ms] bg-gradient-radial ${ansGradient(ansMode)}`}
      />

      <article className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-20">

        {/* ── Header ────────────────────────────────────── */}
        <header
          className={`mb-12 transition-all duration-1000 ease-out ${
            mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <div className="flex items-center justify-between mb-6">
            <Link href="/" className="text-zinc-500 hover:text-white transition text-sm font-mono">
              &larr; mind protocol
            </Link>
            <div className="flex items-center gap-2">
              {!isOffline && (
                <span className="flex items-center gap-2 text-[10px] font-mono text-zinc-500">
                  <Pulse color="emerald" size={1} />
                  live &middot; {lastUpdate}
                </span>
              )}
              {isOffline && (
                <span className="text-[10px] font-mono text-zinc-600">offline</span>
              )}
            </div>
          </div>

          <h1 className="text-4xl sm:text-5xl font-bold font-mono tracking-tight mb-3">
            Activity
          </h1>
          <p className="text-zinc-500 text-sm sm:text-base font-mono max-w-xl">
            A living trace. Heart rate, stress, movement, workouts &mdash; streamed from the body,
            updated every 30 seconds.
          </p>

          {bio.updated_at && (
            <p className="text-[10px] font-mono text-zinc-600 mt-3">
              last sync: {timeAgo(bio.updated_at)} &middot; {bio.date}
            </p>
          )}
        </header>

        {/* ── ANS Mode Banner ──────────────────────────── */}
        {ansMode && (
          <div
            className={`mb-8 border rounded-xl px-5 py-3 flex items-center gap-3 transition-all duration-700 delay-100 ${ansBg(ansMode)} ${
              mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            <span className={`text-sm font-mono font-bold uppercase tracking-wider ${ansColor(ansMode)}`}>
              {ansMode}
            </span>
            <span className="text-xs text-zinc-400 font-mono">
              {ansMode === 'recovery' && 'Parasympathetic dominant \u2014 body is recovering'}
              {ansMode === 'balanced' && 'Autonomic balance \u2014 normal operational state'}
              {ansMode === 'survival' && 'Sympathetic dominant \u2014 elevated stress response'}
            </span>
          </div>
        )}

        {/* ── Biometrics Grid ──────────────────────────── */}
        <section className="mb-12">
          <h2
            className={`text-xs font-mono uppercase tracking-widest text-zinc-500 mb-4 transition-all duration-700 delay-200 ${
              mounted ? 'opacity-100' : 'opacity-0'
            }`}
          >
            Biometrics
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <MetricCard
              label="Heart Rate"
              value={bio.hr_resting}
              unit="bpm"
              color="text-red-400"
              subtext={bio.hr_avg ? `avg ${bio.hr_avg}` : undefined}
              mounted={mounted}
              delay={200}
            />
            <MetricCard
              label="Stress"
              value={bio.stress_current}
              unit=""
              color={stressColor(bio.stress_current)}
              subtext={stressLabel(bio.stress_current)}
              mounted={mounted}
              delay={300}
            />
            <MetricCard
              label="Body Battery"
              value={bio.body_battery}
              unit={bio.body_battery_max ? `/ ${bio.body_battery_max}` : ''}
              color={batteryTextColor(bio.body_battery)}
              subtext={bio.body_battery_morning != null ? `morning: ${bio.body_battery_morning}` : undefined}
              mounted={mounted}
              delay={400}
            />
            <MetricCard
              label="HRV"
              value={bio.hrv_last_night}
              unit="ms"
              color="text-blue-400"
              subtext={bio.hrv_weekly ? `weekly avg: ${bio.hrv_weekly}` : undefined}
              mounted={mounted}
              delay={500}
            />
          </div>

          {/* Body battery bar */}
          {bio.body_battery != null && (
            <div
              className={`mt-4 transition-all duration-700 delay-500 ${
                mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
            >
              <div className="h-2 rounded-full bg-zinc-800 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-1000 ${batteryColor(
                    bio.body_battery
                  )}`}
                  style={{ width: `${bio.body_battery}%` }}
                />
              </div>
              <div className="flex justify-between mt-1">
                <span className="text-[10px] text-zinc-600 font-mono">body battery</span>
                <span className="text-[10px] text-zinc-600 font-mono">
                  {bio.energy_trajectory && (
                    <span className={bio.energy_trajectory === 'rising' ? 'text-emerald-500' : bio.energy_trajectory === 'falling' ? 'text-red-400' : ''}>
                      {bio.energy_trajectory} &middot;{' '}
                    </span>
                  )}
                  {bio.body_battery}/{bio.body_battery_max || 100}
                </span>
              </div>
            </div>
          )}

          {/* Sleep section */}
          {bio.sleep_hours != null && (
            <div className="mt-6">
              <SleepBar
                hours={bio.sleep_hours}
                deepPct={bio.sleep_deep_pct}
                remPct={bio.sleep_rem_pct}
                mounted={mounted}
              />
            </div>
          )}
        </section>

        {/* ── Daily Activity ───────────────────────────── */}
        <section className="mb-12">
          <h2
            className={`text-xs font-mono uppercase tracking-widest text-zinc-500 mb-6 transition-all duration-700 delay-300 ${
              mounted ? 'opacity-100' : 'opacity-0'
            }`}
          >
            Daily Activity
          </h2>
          <div className="flex flex-wrap justify-center gap-6 sm:gap-10">
            <ActivityRing
              value={activity.steps}
              max={10000}
              color="#22c55e"
              label="Steps"
              unit="/ 10k goal"
              mounted={mounted}
              delay={400}
            />
            <ActivityRing
              value={activity.distance_meters ? Math.round(activity.distance_meters / 1000 * 10) / 10 : undefined}
              max={8}
              color="#3b82f6"
              label="Distance"
              unit="km"
              mounted={mounted}
              delay={500}
            />
            <ActivityRing
              value={activity.calories_active}
              max={500}
              color="#f97316"
              label="Active Cal"
              unit="kcal"
              mounted={mounted}
              delay={600}
            />
            <ActivityRing
              value={activity.intensity_minutes}
              max={30}
              color="#a855f7"
              label="Intensity"
              unit="minutes"
              mounted={mounted}
              delay={700}
            />
          </div>
          {(activity.floors_climbed != null || activity.active_seconds != null) && (
            <div
              className={`flex justify-center gap-6 mt-4 transition-all duration-700 delay-700 ${
                mounted ? 'opacity-100' : 'opacity-0'
              }`}
            >
              {activity.floors_climbed != null && (
                <span className="text-[10px] font-mono text-zinc-500">
                  floors: <span className="text-zinc-300">{activity.floors_climbed}</span>
                </span>
              )}
              {activity.active_seconds != null && (
                <span className="text-[10px] font-mono text-zinc-500">
                  active time: <span className="text-zinc-300">{formatDuration(activity.active_seconds)}</span>
                </span>
              )}
            </div>
          )}
        </section>

        {/* ── Workouts ─────────────────────────────────── */}
        <section className="mb-12">
          <h2
            className={`text-xs font-mono uppercase tracking-widest text-zinc-500 mb-4 transition-all duration-700 delay-200 ${
              mounted ? 'opacity-100' : 'opacity-0'
            }`}
          >
            Recent Workouts
          </h2>
          {workouts.length > 0 ? (
            <div className="space-y-3">
              {workouts.map((w, i) => (
                <WorkoutCard key={`${w.date}-${w.start_time}-${i}`} workout={w} index={i} mounted={mounted} />
              ))}
            </div>
          ) : (
            <div
              className={`text-center py-12 border border-zinc-800/50 rounded-xl bg-zinc-900/30 transition-all duration-700 delay-300 ${
                mounted ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <p className="text-zinc-600 text-sm font-mono italic">
                {isOffline ? 'activity data unavailable' : 'no recent workouts recorded'}
              </p>
            </div>
          )}
        </section>

        {/* ── Footer ───────────────────────────────────── */}
        <footer className="pt-8 border-t border-zinc-800/50 text-center">
          <p className="text-xs font-mono text-zinc-600">
            updates every 30 seconds &middot; streamed from Garmin Connect
          </p>
          <p className="text-[10px] font-mono text-zinc-700 mt-1">
            <Link href="/registry" className="hover:text-zinc-400 transition">registry</Link>
            {' '}&middot;{' '}
            <Link href="/" className="hover:text-zinc-400 transition">mind protocol</Link>
          </p>
        </footer>
      </article>

      {/* Global styles */}
      <style jsx global>{`
        .bg-gradient-radial {
          background: radial-gradient(ellipse at 50% 30%, var(--tw-gradient-from), var(--tw-gradient-via), var(--tw-gradient-to));
        }
      `}</style>
    </main>
  );
}
