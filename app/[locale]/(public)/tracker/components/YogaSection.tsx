'use client';

import { memo } from 'react';

// ── Constants ────────────────────────────────────────────────────

export const YOGA_STYLES = [
  { key: 'vinyasa', label: 'Vinyasa', icon: '🌊', hasFlow: true },
  { key: 'yin', label: 'Yin', icon: '☯️', hasFlow: false },
  { key: 'gainage', label: 'Gainage', icon: '🪨', hasFlow: false },
  { key: 'renforcement', label: 'Renforcement', icon: '💪', hasFlow: false },
  { key: 'mobilite', label: 'Mobilité', icon: '🦎', hasFlow: false },
] as const;

export const YOGA_TIMER_PRESETS = [
  { seconds: 30, label: '30s' },
  { seconds: 60, label: '1m' },
  { seconds: 120, label: '2m' },
  { seconds: 180, label: '3m' },
  { seconds: 240, label: '4m' },
  { seconds: 300, label: '5m' },
  { seconds: 420, label: '7m' },
];

export function formatTimer(secs: number): string {
  const m = Math.floor(secs / 60);
  const s = secs % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

// ── Types ────────────────────────────────────────────────────────

export interface YogaAnalysis {
  ans_shift: string;
  effects: string[];
  summary: string;
  bio_before?: Record<string, number | null>;
  bio_after?: Record<string, number | null>;
}

interface YogaSectionProps {
  details: Record<string, unknown>;
  setDetails: React.Dispatch<React.SetStateAction<Record<string, unknown>>>;
  notes: string;
  setNotes: (n: string) => void;
  amount: number;
  setAmount: (n: number) => void;
  yogaTimerSecs: number;
  setYogaTimerSecs: (n: number) => void;
  yogaTimerRunning: boolean;
  setYogaTimerRunning: (v: boolean) => void;
  yogaTimerRemaining: number;
  setYogaTimerRemaining: (n: number) => void;
  yogaSessionDone: boolean;
  setYogaSessionDone: (v: boolean) => void;
  yogaAnalysis: YogaAnalysis | null;
  setYogaAnalysis: (a: YogaAnalysis | null) => void;
  yogaAnalyzing: boolean;
  yogaStartTime: React.MutableRefObject<string | null>;
  timerInterval: React.MutableRefObject<ReturnType<typeof setInterval> | null>;
  defaultAmount: number;
}

// ── Component ────────────────────────────────────────────────────

function YogaSectionInner({
  details,
  setDetails,
  notes,
  setNotes,
  amount,
  setAmount,
  yogaTimerSecs,
  setYogaTimerSecs,
  yogaTimerRunning,
  setYogaTimerRunning,
  yogaTimerRemaining,
  setYogaTimerRemaining,
  yogaSessionDone,
  setYogaSessionDone,
  yogaAnalysis,
  setYogaAnalysis,
  yogaAnalyzing,
  yogaStartTime,
  timerInterval,
  defaultAmount,
}: YogaSectionProps) {
  return (
    <div className="space-y-4 sm:col-span-2">
      {/* Style selector */}
      <div>
        <label className="text-xs text-zinc-500 block mb-1.5">Style</label>
        <div className="flex flex-wrap gap-2">
          {YOGA_STYLES.map((s) => (
            <button
              key={s.key}
              onClick={() => {
                setDetails({ ...details, style: s.key, flow: s.hasFlow ? (details.flow ?? false) : undefined });
              }}
              className={`px-3 py-2 rounded-lg text-sm border transition ${
                details.style === s.key
                  ? 'border-pink-500/50 text-pink-300 bg-pink-500/15'
                  : 'border-zinc-700 text-zinc-500 hover:text-zinc-300'
              }`}
            >
              {s.icon} {s.label}
            </button>
          ))}
        </div>
        {details.style === 'vinyasa' && (
          <div className="mt-2">
            <button
              onClick={() => setDetails({ ...details, flow: !details.flow })}
              className={`px-3 py-1.5 rounded text-xs border transition ${
                details.flow
                  ? 'border-pink-500/40 text-pink-300 bg-pink-500/10'
                  : 'border-zinc-700 text-zinc-500 hover:text-zinc-300'
              }`}
            >
              🌊 Flow continu {details.flow ? '✓' : ''}
            </button>
          </div>
        )}
      </div>

      {/* Timer */}
      <div>
        <label className="text-xs text-zinc-500 block mb-1.5">Minuteur</label>

        {!yogaTimerRunning && !yogaSessionDone && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {YOGA_TIMER_PRESETS.map((p) => (
              <button
                key={p.seconds}
                onClick={() => {
                  setYogaTimerSecs(p.seconds);
                  setYogaTimerRemaining(p.seconds);
                  setAmount(Math.round(p.seconds / 60 * 10) / 10);
                }}
                className={`px-3 py-1.5 rounded text-sm border transition ${
                  yogaTimerSecs === p.seconds
                    ? 'border-pink-500/50 text-pink-300 bg-pink-500/15'
                    : 'border-zinc-700 text-zinc-500 hover:text-zinc-300'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        )}

        <div className="flex items-center gap-4">
          <div className={`text-4xl font-mono font-bold tabular-nums ${
            yogaTimerRunning ? 'text-pink-400' : yogaSessionDone ? 'text-green-400' : 'text-zinc-300'
          }`}>
            {formatTimer(yogaTimerRemaining)}
          </div>

          {!yogaTimerRunning && !yogaSessionDone && (
            <button
              onClick={() => {
                yogaStartTime.current = new Date().toISOString();
                setYogaTimerRunning(true);
                setYogaSessionDone(false);
                setYogaAnalysis(null);
              }}
              className="px-5 py-2.5 rounded-lg text-sm font-medium border border-pink-500/40 text-pink-400 bg-pink-500/10 hover:bg-pink-500/20 transition"
            >
              Démarrer
            </button>
          )}

          {yogaTimerRunning && (
            <button
              onClick={() => {
                setYogaTimerRunning(false);
                if (timerInterval.current) clearInterval(timerInterval.current);
                const elapsed = yogaTimerSecs - yogaTimerRemaining;
                setAmount(Math.round(elapsed / 60 * 10) / 10);
                setYogaSessionDone(true);
              }}
              className="px-5 py-2.5 rounded-lg text-sm font-medium border border-amber-500/40 text-amber-400 bg-amber-500/10 hover:bg-amber-500/20 transition"
            >
              Terminer
            </button>
          )}

          {yogaSessionDone && (
            <div className="flex items-center gap-2">
              <span className="text-green-400 text-sm font-medium">Session terminée</span>
              <button
                onClick={() => {
                  setYogaSessionDone(false);
                  setYogaTimerRemaining(yogaTimerSecs);
                  setYogaAnalysis(null);
                  setAmount(defaultAmount);
                }}
                className="text-xs text-zinc-500 hover:text-zinc-300 transition underline"
              >
                Reset
              </button>
            </div>
          )}
        </div>

        {(yogaTimerRunning || yogaSessionDone) && (
          <div className="mt-2 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-1000"
              style={{
                width: `${((yogaTimerSecs - yogaTimerRemaining) / yogaTimerSecs) * 100}%`,
                backgroundColor: yogaSessionDone ? '#22c55e' : '#f472b6',
              }}
            />
          </div>
        )}
      </div>

      {/* Comment for MIND analysis */}
      <div>
        <label className="text-xs text-zinc-500 block mb-1">
          Commentaire <span className="text-zinc-600">(analysé par MIND)</span>
        </label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Comment tu te sens ? Tensions, douleurs, respiration..."
          rows={2}
          className="w-full bg-zinc-800 border border-zinc-700 rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-zinc-500 placeholder:text-zinc-600 resize-none"
        />
      </div>

      {/* ANS Analysis results */}
      {yogaAnalyzing && (
        <div className="bg-zinc-800/50 border border-zinc-700/50 rounded-lg p-4 text-center">
          <div className="text-pink-400 text-sm animate-pulse">Analyse biométrique en cours...</div>
        </div>
      )}
      {yogaAnalysis && (
        <div className="bg-zinc-800/50 border border-zinc-700/50 rounded-lg p-4 space-y-2">
          <div className="flex items-center gap-2 mb-2">
            <span className={`text-sm font-medium ${
              yogaAnalysis.ans_shift === 'parasympathique' ? 'text-green-400' :
              yogaAnalysis.ans_shift === 'sympathique' ? 'text-amber-400' : 'text-zinc-400'
            }`}>
              {yogaAnalysis.ans_shift === 'parasympathique' ? '🧘 Parasympathique' :
               yogaAnalysis.ans_shift === 'sympathique' ? '⚡ Sympathique' : '⚖️ Neutre'}
            </span>
          </div>
          {yogaAnalysis.effects.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {yogaAnalysis.effects.map((e, i) => (
                <span key={i} className="text-[10px] px-2 py-0.5 rounded-full border border-pink-500/30 text-pink-400/70">
                  {e}
                </span>
              ))}
            </div>
          )}
          <div className="text-xs text-zinc-400">{yogaAnalysis.summary}</div>
          {yogaAnalysis.bio_before && yogaAnalysis.bio_after && (
            <div className="grid grid-cols-2 gap-2 text-xs mt-2">
              <div className="text-zinc-500">
                <div className="font-medium mb-1">Avant</div>
                {yogaAnalysis.bio_before.hr != null && <div>HR: {yogaAnalysis.bio_before.hr}</div>}
                {yogaAnalysis.bio_before.stress != null && <div>Stress: {yogaAnalysis.bio_before.stress}</div>}
                {yogaAnalysis.bio_before.body_battery != null && <div>BB: {yogaAnalysis.bio_before.body_battery}</div>}
              </div>
              <div className="text-zinc-400">
                <div className="font-medium mb-1">Après</div>
                {yogaAnalysis.bio_after.hr != null && <div>HR: {yogaAnalysis.bio_after.hr}</div>}
                {yogaAnalysis.bio_after.stress != null && <div>Stress: {yogaAnalysis.bio_after.stress}</div>}
                {yogaAnalysis.bio_after.body_battery != null && <div>BB: {yogaAnalysis.bio_after.body_battery}</div>}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

const YogaSection = memo(YogaSectionInner);
export default YogaSection;
