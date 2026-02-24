'use client';

import { useState } from 'react';
import type { SubstanceDependency } from '@/lib/tracker/types/dependencies';

const SAFETY_BADGES = {
  self_managed: { label: 'Auto-géré', color: 'text-green-400 bg-green-500/10 border-green-500/20' },
  medical_supervision_recommended: { label: 'Suivi médical recommandé', color: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20' },
  medical_supervision_required: { label: '⚠️ Suivi médical OBLIGATOIRE', color: 'text-red-400 bg-red-500/10 border-red-500/20' },
};

interface Props {
  substances: Record<string, SubstanceDependency>;
  selected: string | null;
  onSelect: (substance: string | null) => void;
}

export default function TaperingProtocols({ substances, selected, onSelect }: Props) {
  const [expandedStep, setExpandedStep] = useState<string | null>(null);

  // Filter to substances with tapering protocols
  const withTapering = Object.entries(substances).filter(
    ([, dep]) => dep.tapering && dep.tapering.steps.length > 0
  );

  if (withTapering.length === 0) {
    return (
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
        <h2 className="text-lg font-semibold text-amber-400 mb-3">Protocoles de Sevrage</h2>
        <p className="text-zinc-500 text-sm">Aucun protocole de sevrage nécessaire actuellement.</p>
      </div>
    );
  }

  // If a substance is selected and has tapering, show only that one
  const displayed = selected && substances[selected]?.tapering
    ? [[selected, substances[selected]] as [string, SubstanceDependency]]
    : withTapering;

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
      <h2 className="text-lg font-semibold text-amber-400 mb-4">Protocoles de Sevrage</h2>

      <div className="space-y-4">
        {displayed.map(([key, dep]) => {
          const tap = dep.tapering!;
          const safety = SAFETY_BADGES[tap.safety_level] || SAFETY_BADGES.self_managed;
          const isExpanded = expandedStep === key;

          return (
            <div key={key} className="border border-zinc-700 rounded-lg overflow-hidden">
              {/* Protocol header */}
              <button
                onClick={() => {
                  setExpandedStep(isExpanded ? null : key);
                  onSelect(key);
                }}
                className="w-full flex items-center justify-between p-4 hover:bg-zinc-800/50 transition text-left"
              >
                <div>
                  <h3 className="font-medium text-zinc-200">{tap.protocol_name}</h3>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-xs text-zinc-500">
                      Dose actuelle : {tap.current_baseline.dose} {tap.current_baseline.unit} &middot; {tap.current_baseline.frequency_per_day}/j
                    </span>
                    <span className="text-xs text-zinc-500">
                      Durée : {tap.duration_weeks} semaines
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-xs px-2 py-1 rounded border ${safety.color}`}>
                    {safety.label}
                  </span>
                  <span className="text-zinc-500">{isExpanded ? '\u2212' : '+'}</span>
                </div>
              </button>

              {isExpanded && (
                <div className="px-4 pb-4 space-y-4">
                  {/* Warnings */}
                  {tap.warnings.length > 0 && (
                    <div className="bg-red-500/5 border border-red-500/20 rounded-lg p-3">
                      <div className="text-sm font-medium text-red-400 mb-2">Avertissements</div>
                      <ul className="space-y-1">
                        {tap.warnings.map((w, i) => (
                          <li key={i} className="text-sm text-red-300/80 flex gap-2">
                            <span className="text-red-400 shrink-0">•</span>
                            {w}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Withdrawal symptoms */}
                  {tap.withdrawal_symptoms.length > 0 && (
                    <div className="bg-orange-500/5 border border-orange-500/20 rounded-lg p-3">
                      <div className="text-sm font-medium text-orange-400 mb-2">Symptômes de sevrage possibles</div>
                      <div className="flex flex-wrap gap-2">
                        {tap.withdrawal_symptoms.map((s, i) => (
                          <span key={i} className="text-xs px-2 py-1 rounded-full bg-orange-500/10 text-orange-300 border border-orange-500/20">
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Step-down schedule */}
                  <div>
                    <div className="text-sm font-medium text-zinc-300 mb-3">Planning de réduction</div>
                    <div className="relative">
                      {/* Timeline line */}
                      <div className="absolute left-3 top-3 bottom-3 w-0.5 bg-zinc-700" />

                      <div className="space-y-3">
                        {/* Current baseline */}
                        <div className="flex items-start gap-3 relative">
                          <div className="w-6 h-6 rounded-full bg-amber-500/20 border-2 border-amber-500 flex items-center justify-center z-10 shrink-0">
                            <div className="w-2 h-2 rounded-full bg-amber-500" />
                          </div>
                          <div className="text-sm">
                            <div className="text-amber-400 font-medium">Maintenant</div>
                            <div className="text-zinc-400">
                              {tap.current_baseline.dose} {tap.current_baseline.unit} &middot; {tap.current_baseline.frequency_per_day} prises/j
                            </div>
                          </div>
                        </div>

                        {tap.steps.map((step) => (
                          <div key={step.step} className="flex items-start gap-3 relative">
                            <div className="w-6 h-6 rounded-full bg-zinc-800 border-2 border-zinc-600 flex items-center justify-center z-10 shrink-0">
                              <span className="text-[10px] text-zinc-400">{step.step}</span>
                            </div>
                            <div className="text-sm flex-1">
                              <div className="flex items-center justify-between">
                                <span className="text-zinc-300">Semaine {step.week}</span>
                                <span className="text-zinc-500 text-xs">
                                  {step.target_dose} {step.unit} &middot; {step.target_frequency}/j
                                </span>
                              </div>
                              <div className="text-zinc-500 text-xs mt-0.5">{step.notes}</div>
                            </div>
                          </div>
                        ))}

                        {/* Target: zero */}
                        <div className="flex items-start gap-3 relative">
                          <div className="w-6 h-6 rounded-full bg-green-500/20 border-2 border-green-500 flex items-center justify-center z-10 shrink-0">
                            <span className="text-[10px]">✓</span>
                          </div>
                          <div className="text-sm">
                            <div className="text-green-400 font-medium">Objectif atteint</div>
                            <div className="text-zinc-500">
                              Sevrage complet — semaine {tap.duration_weeks}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
