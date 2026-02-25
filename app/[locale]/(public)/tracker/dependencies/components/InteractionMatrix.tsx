'use client';

import { useMemo } from 'react';
import { SUBSTANCE_CONFIG, type SubstanceKey } from '@/lib/tracker/constants';

interface InteractionEntry {
  a: string;
  b: string;
  severity: 'low' | 'moderate' | 'high' | 'critical';
  note: string;
}

interface Props {
  /** List of substances the user has logged (to filter the matrix) */
  userSubstances: string[];
  /** Interaction data from the backend */
  interactions: InteractionEntry[];
}

const SEVERITY_COLORS: Record<string, { bg: string; border: string; text: string; label: string }> = {
  critical: { bg: 'bg-red-600/30', border: 'border-red-500/50', text: 'text-red-300', label: 'MORTEL' },
  high:     { bg: 'bg-orange-500/25', border: 'border-orange-500/40', text: 'text-orange-300', label: 'DANGER' },
  moderate: { bg: 'bg-yellow-500/20', border: 'border-yellow-500/30', text: 'text-yellow-300', label: 'Attention' },
  low:      { bg: 'bg-green-500/15', border: 'border-green-500/30', text: 'text-green-300', label: 'OK' },
};

function getInteraction(
  interactions: InteractionEntry[],
  a: string,
  b: string,
): InteractionEntry | null {
  return (
    interactions.find(
      (i) => (i.a === a && i.b === b) || (i.a === b && i.b === a),
    ) || null
  );
}

export default function InteractionMatrix({ userSubstances, interactions }: Props) {
  // Only show substances the user actually uses
  const subs = useMemo(() => {
    return userSubstances.filter((s) => s in SUBSTANCE_CONFIG);
  }, [userSubstances]);

  if (subs.length < 2) {
    return (
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 text-center">
        <p className="text-zinc-500 text-sm">
          Matrice d'interactions disponible quand 2+ substances sont track{'\u{00E9}'}es.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 overflow-x-auto">
      <h2 className="text-sm font-semibold text-zinc-300 mb-3 flex items-center gap-2">
        <span>{'\u{1F9EA}'}</span> Matrice d'interactions
      </h2>

      {/* Legend */}
      <div className="flex flex-wrap gap-3 mb-3 text-[10px]">
        {Object.entries(SEVERITY_COLORS).map(([key, val]) => (
          <span key={key} className={`px-2 py-0.5 rounded ${val.bg} ${val.text}`}>
            {val.label}
          </span>
        ))}
        <span className="px-2 py-0.5 rounded bg-zinc-800 text-zinc-500">Pas d'interaction connue</span>
      </div>

      <div className="inline-block min-w-max">
        <table className="border-collapse">
          <thead>
            <tr>
              <th className="w-20" />
              {subs.map((s) => {
                const cfg = SUBSTANCE_CONFIG[s as SubstanceKey];
                return (
                  <th
                    key={s}
                    className="text-[10px] font-medium text-zinc-400 px-1 py-1 w-16 text-center"
                    style={{ writingMode: 'vertical-rl', textOrientation: 'mixed' }}
                  >
                    <span style={{ color: cfg?.color }}>{cfg?.icon}</span>{' '}
                    {cfg?.label || s}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {subs.map((rowSub, ri) => {
              const rowCfg = SUBSTANCE_CONFIG[rowSub as SubstanceKey];
              return (
                <tr key={rowSub}>
                  <td className="text-[10px] font-medium text-zinc-400 pr-2 py-1 whitespace-nowrap text-right">
                    <span style={{ color: rowCfg?.color }}>{rowCfg?.icon}</span>{' '}
                    {rowCfg?.label || rowSub}
                  </td>
                  {subs.map((colSub, ci) => {
                    if (ci <= ri) {
                      // Diagonal or below — empty (mirror)
                      return (
                        <td
                          key={colSub}
                          className={`w-16 h-10 ${ci === ri ? 'bg-zinc-800/30' : ''}`}
                        >
                          {ci === ri && (
                            <div className="w-full h-full flex items-center justify-center text-zinc-600 text-[10px]">
                              —
                            </div>
                          )}
                        </td>
                      );
                    }

                    const interaction = getInteraction(interactions, rowSub, colSub);
                    const sev = interaction ? SEVERITY_COLORS[interaction.severity] : null;

                    return (
                      <td key={colSub} className="w-16 h-10 p-0.5">
                        {interaction ? (
                          <div
                            className={`w-full h-full rounded ${sev!.bg} border ${sev!.border} flex items-center justify-center cursor-help transition hover:scale-110`}
                            title={interaction.note}
                          >
                            <span className={`text-[9px] font-bold ${sev!.text}`}>
                              {interaction.severity === 'critical'
                                ? '\u{2620}\u{FE0F}'
                                : interaction.severity === 'high'
                                  ? '\u{1F6A8}'
                                  : interaction.severity === 'moderate'
                                    ? '\u{26A0}\u{FE0F}'
                                    : '\u{2705}'}
                            </span>
                          </div>
                        ) : (
                          <div className="w-full h-full rounded bg-zinc-800/20 flex items-center justify-center">
                            <span className="text-zinc-700 text-[9px]">·</span>
                          </div>
                        )}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Click hint */}
      <p className="text-[10px] text-zinc-600 mt-2">
        Survolez une case pour voir le d{'\u{00E9}'}tail de l'interaction.
      </p>
    </div>
  );
}
