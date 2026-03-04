'use client';

import { memo } from 'react';

export interface MindAnalysisData {
  substance: string;
  biometrics: Record<string, number | string | null> | null;
  active_substances: { substance: string; since_min: number; intensity: number; dose: number; unit: string; steady_state: boolean }[];
  interactions: { substances: string[]; severity: string; note: string }[];
  frequency: { today: number; avg_daily_7d: number; hours_since_last: number | null };
  dependency: { frequency_daily: number; count_30d: number; risk_class: string; warning?: string } | null;
  medical_flags: string[];
  insights: string[];
  recommendation: string;
  intent_category: string;
  period: string;
  body_model?: {
    bmi: number | null;
    weight_kg: number | null;
    height_cm: number | null;
    fitness_strengths: string[];
    fitness_weaknesses: string[];
    steps_percentile: number | null;
    sleep_percentile: number | null;
    floors_percentile: number | null;
    running_percentile: number | null;
  } | null;
}

interface Props {
  analysis: MindAnalysisData | null;
  analyzing: boolean;
  collapsed: boolean;
  onToggleCollapsed: () => void;
}

function MindAnalysisCardInner({ analysis, analyzing, collapsed, onToggleCollapsed }: Props) {
  if (analyzing) {
    return (
      <div className="mt-4 border border-zinc-700/50 bg-zinc-800/30 rounded-lg p-4 text-center">
        <div className="text-sm text-zinc-400 animate-pulse">Analyse MIND en cours...</div>
      </div>
    );
  }

  if (!analysis) return null;

  return (
    <div className="mt-4 border border-zinc-700/50 bg-zinc-800/30 rounded-lg overflow-hidden">
      {/* Header — always visible */}
      <button
        onClick={onToggleCollapsed}
        className="w-full flex items-center justify-between px-4 py-3 hover:bg-zinc-800/50 transition text-left"
      >
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-zinc-500">MIND</span>
          <span className="text-sm text-zinc-300">
            {analysis.insights[0] || 'Analyse complète'}
          </span>
        </div>
        <span className="text-zinc-600 text-xs">{collapsed ? '▸' : '▾'}</span>
      </button>

      {!collapsed && (
        <div className="px-4 pb-4 space-y-3 border-t border-zinc-800">
          {/* Biometric snapshot */}
          {analysis.biometrics && (
            <div className="flex flex-wrap gap-3 pt-3 text-xs">
              {analysis.biometrics.hr != null && (
                <span className="text-zinc-400">♡ {analysis.biometrics.hr} bpm</span>
              )}
              {analysis.biometrics.stress != null && (
                <span className={`${Number(analysis.biometrics.stress) > 60 ? 'text-amber-400' : 'text-zinc-400'}`}>
                  σ {analysis.biometrics.stress}
                </span>
              )}
              {analysis.biometrics.body_battery != null && (
                <span className={`${Number(analysis.biometrics.body_battery) < 25 ? 'text-red-400' : 'text-zinc-400'}`}>
                  ⚡ {analysis.biometrics.body_battery}
                </span>
              )}
              {analysis.biometrics.ans_mode && analysis.biometrics.ans_mode !== 'unknown' && (
                <span className="text-zinc-500">ANS: {analysis.biometrics.ans_mode}</span>
              )}
            </div>
          )}

          {/* Frequency context */}
          <div className="flex flex-wrap gap-3 text-xs text-zinc-500">
            <span>{analysis.frequency.today}x aujourd&apos;hui</span>
            <span>moy. {analysis.frequency.avg_daily_7d}/j</span>
            {analysis.frequency.hours_since_last != null && (
              <span>dernière : il y a {analysis.frequency.hours_since_last < 1
                ? `${Math.round(analysis.frequency.hours_since_last * 60)}min`
                : `${analysis.frequency.hours_since_last.toFixed(1)}h`}
              </span>
            )}
            <span className="text-zinc-600">{analysis.period} · {analysis.intent_category}</span>
          </div>

          {/* Active substances */}
          {analysis.active_substances.length > 0 && (
            <div>
              <div className="text-[10px] text-zinc-600 uppercase tracking-wider mb-1">Substances actives</div>
              <div className="flex flex-wrap gap-1.5">
                {analysis.active_substances.map((a) => (
                  <span
                    key={a.substance}
                    className="text-[11px] px-2 py-0.5 rounded-full border border-zinc-700 text-zinc-400"
                    style={{ opacity: 0.4 + a.intensity * 0.6 }}
                  >
                    {a.substance} {a.since_min}min {Math.round(a.intensity * 100)}%
                    {a.steady_state && ' ∞'}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Interactions */}
          {analysis.interactions.length > 0 && (
            <div className="space-y-1">
              {analysis.interactions.map((ix, i) => (
                <div
                  key={i}
                  className={`text-xs px-3 py-1.5 rounded border ${
                    ix.severity === 'high'
                      ? 'border-red-500/30 bg-red-500/5 text-red-400'
                      : ix.severity === 'moderate'
                      ? 'border-amber-500/30 bg-amber-500/5 text-amber-400'
                      : 'border-zinc-700 text-zinc-400'
                  }`}
                >
                  {ix.note}
                </div>
              ))}
            </div>
          )}

          {/* Insights */}
          {analysis.insights.length > 1 && (
            <div className="space-y-1 pt-1">
              {analysis.insights.slice(1).map((insight, i) => (
                <div key={i} className="text-xs text-zinc-400 flex gap-2">
                  <span className="text-zinc-600 shrink-0">·</span>
                  {insight}
                </div>
              ))}
            </div>
          )}

          {/* Dependency flag */}
          {analysis.dependency?.warning && (
            <div className="text-xs px-3 py-1.5 rounded border border-amber-500/20 bg-amber-500/5 text-amber-400/80">
              {analysis.dependency.warning}
              {analysis.dependency.risk_class !== 'none' && (
                <span className="text-zinc-600 ml-2">({analysis.dependency.risk_class})</span>
              )}
            </div>
          )}

          {/* Medical flags */}
          {analysis.medical_flags.length > 0 && (
            <div className="space-y-1">
              {analysis.medical_flags.map((flag, i) => (
                <div key={i} className="text-xs text-teal-400/70 flex gap-2">
                  <span className="shrink-0">🏥</span>
                  {flag}
                </div>
              ))}
            </div>
          )}

          {/* Body model */}
          {analysis.body_model && (
            <div className="flex flex-wrap gap-2 text-[10px]">
              {analysis.body_model.bmi && (
                <span className="px-2 py-0.5 rounded border border-zinc-700 text-zinc-500">
                  IMC {analysis.body_model.bmi}
                </span>
              )}
              {analysis.body_model.steps_percentile != null && (
                <span className={`px-2 py-0.5 rounded border ${
                  analysis.body_model.steps_percentile < 40
                    ? 'border-amber-500/30 text-amber-400/70'
                    : 'border-zinc-700 text-zinc-500'
                }`}>
                  Pas P{analysis.body_model.steps_percentile}
                </span>
              )}
              {analysis.body_model.floors_percentile != null && (
                <span className={`px-2 py-0.5 rounded border ${
                  analysis.body_model.floors_percentile > 60
                    ? 'border-green-500/30 text-green-400/70'
                    : 'border-zinc-700 text-zinc-500'
                }`}>
                  Etages P{analysis.body_model.floors_percentile}
                </span>
              )}
              {analysis.body_model.sleep_percentile != null && (
                <span className="px-2 py-0.5 rounded border border-indigo-500/30 text-indigo-400/70">
                  Sommeil P{analysis.body_model.sleep_percentile}
                </span>
              )}
              {analysis.body_model.running_percentile != null && (
                <span className="px-2 py-0.5 rounded border border-zinc-700 text-zinc-500">
                  Course P{analysis.body_model.running_percentile}
                </span>
              )}
            </div>
          )}

          {/* Recommendation */}
          {analysis.recommendation && (
            <div className="text-xs text-zinc-300 bg-zinc-800/80 rounded px-3 py-2 border border-zinc-700/50">
              {analysis.recommendation}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

const MindAnalysisCard = memo(MindAnalysisCardInner);
export default MindAnalysisCard;
