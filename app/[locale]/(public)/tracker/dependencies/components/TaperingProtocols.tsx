'use client';

import { useState } from 'react';
import type { SubstanceDependency } from '@/lib/tracker/types/dependencies';

const SAFETY_BADGES: Record<string, { label: string; color: string }> = {
  self_managed: { label: 'Auto-géré', color: 'text-green-400 bg-green-500/10 border-green-500/20' },
  medical_supervision_recommended: { label: 'Suivi médical recommandé', color: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20' },
  medical_supervision_required: { label: 'Suivi médical OBLIGATOIRE', color: 'text-red-400 bg-red-500/10 border-red-500/20' },
};

const SUBSTANCE_LABELS: Record<string, string> = {
  thc: 'THC', cbd: 'CBD', lions_mane: "Lion's Mane", caffeine: 'Caféine',
  ketamine: 'Kétamine', lsd: 'LSD', nicotine: 'Nicotine', hydration: 'H2O',
  melatonin: 'Mélatonine', venlafaxine: 'Venlafaxine', prazepam: 'Prazépam',
  cyamemazine: 'Cyamémazine',
  dynabiane: 'Dynabiane',
  omegabiane: 'Omegabiane',
};

interface Props {
  substances: Record<string, SubstanceDependency>;
  selected: string | null;
  onSelect: (substance: string | null) => void;
}

export default function TaperingProtocols({ substances, selected, onSelect }: Props) {
  const [expanded, setExpanded] = useState<Set<string>>(new Set());

  const toggleExpanded = (key: string) => {
    setExpanded(prev => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  const expandAll = () => {
    setExpanded(new Set(Object.keys(substances)));
  };

  const collapseAll = () => {
    setExpanded(new Set());
  };

  // Show ALL substances that have tapering data
  const allWithTapering = Object.entries(substances).filter(
    ([, dep]) => dep.tapering !== null
  );

  // Sort: with steps first (by score desc), then no-step ones
  const sorted = [...allWithTapering].sort(([, a], [, b]) => {
    const aHasSteps = (a.tapering?.steps.length || 0) > 0 ? 1 : 0;
    const bHasSteps = (b.tapering?.steps.length || 0) > 0 ? 1 : 0;
    if (aHasSteps !== bHasSteps) return bHasSteps - aHasSteps;
    return b.dependency_score - a.dependency_score;
  });

  if (sorted.length === 0) {
    return (
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
        <h2 className="text-lg font-semibold text-amber-400 mb-3">Protocoles de Sevrage</h2>
        <p className="text-zinc-500 text-sm">Aucune donnée de substance disponible.</p>
      </div>
    );
  }

  // Always show all substances (no filtering by selection)
  const displayed = sorted;

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-amber-400">Protocoles de Sevrage</h2>
        <div className="flex gap-2">
          <button
            onClick={expandAll}
            className="text-xs px-2 py-1 rounded border border-zinc-700 text-zinc-400 hover:text-white hover:border-zinc-500 transition"
          >
            Tout ouvrir
          </button>
          <button
            onClick={collapseAll}
            className="text-xs px-2 py-1 rounded border border-zinc-700 text-zinc-400 hover:text-white hover:border-zinc-500 transition"
          >
            Tout fermer
          </button>
        </div>
      </div>

      <div className="space-y-3">
        {displayed.map(([key, dep]) => {
          const tap = dep.tapering!;
          const safety = SAFETY_BADGES[tap.safety_level] || SAFETY_BADGES.self_managed;
          const isExpanded = expanded.has(key);
          const hasSteps = tap.steps.length > 0;
          const label = SUBSTANCE_LABELS[key] || key;

          return (
            <div key={key} className={`border rounded-lg overflow-hidden ${
              dep.risk_class === 'high' ? 'border-red-500/20' :
              dep.risk_class === 'moderate' ? 'border-yellow-500/20' :
              'border-zinc-700'
            }`}>
              {/* Protocol header */}
              <button
                onClick={() => toggleExpanded(key)}
                className="w-full flex items-center justify-between p-4 hover:bg-zinc-800/50 transition text-left"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium text-zinc-200">{tap.protocol_name || `Sevrage ${label}`}</h3>
                    {dep.dependency_score > 0 && (
                      <span className={`text-xs px-1.5 py-0.5 rounded ${
                        dep.dependency_score >= 50 ? 'bg-red-500/10 text-red-400' :
                        dep.dependency_score >= 25 ? 'bg-yellow-500/10 text-yellow-400' :
                        'bg-zinc-800 text-zinc-500'
                      }`}>
                        {dep.dependency_score}/100
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-3 mt-1 flex-wrap">
                    {tap.current_baseline.dose > 0 && (
                      <span className="text-xs text-zinc-500">
                        Dose : {tap.current_baseline.dose} {tap.current_baseline.unit}
                      </span>
                    )}
                    {tap.current_baseline.frequency_per_day > 0 && (
                      <span className="text-xs text-zinc-500">
                        {tap.current_baseline.frequency_per_day}/j
                      </span>
                    )}
                    {hasSteps && (
                      <span className="text-xs text-zinc-500">
                        Durée : {tap.duration_weeks} sem.
                      </span>
                    )}
                    {!hasSteps && (
                      <span className="text-xs text-green-400/70">
                        Aucune dépendance physique
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
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
                    <div className={`border rounded-lg p-3 ${
                      dep.risk_class === 'high' ? 'bg-red-500/5 border-red-500/20' :
                      dep.risk_class === 'moderate' ? 'bg-orange-500/5 border-orange-500/20' :
                      'bg-zinc-800/50 border-zinc-700'
                    }`}>
                      <div className={`text-sm font-medium mb-2 ${
                        dep.risk_class === 'high' ? 'text-red-400' :
                        dep.risk_class === 'moderate' ? 'text-orange-400' :
                        'text-zinc-400'
                      }`}>
                        {dep.risk_class === 'high' ? 'Avertissements critiques' :
                         dep.risk_class === 'moderate' ? 'Avertissements' : 'Informations'}
                      </div>
                      <ul className="space-y-1">
                        {tap.warnings.map((w, i) => (
                          <li key={i} className={`text-sm flex gap-2 ${
                            dep.risk_class === 'high' ? 'text-red-300/80' :
                            dep.risk_class === 'moderate' ? 'text-orange-300/80' :
                            'text-zinc-400'
                          }`}>
                            <span className="shrink-0">•</span>
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
                  {hasSteps ? (
                    <div>
                      <div className="text-sm font-medium text-zinc-300 mb-3">Planning de réduction</div>
                      <div className="relative">
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
                              <div className="text-zinc-500">Sevrage complet — semaine {tap.duration_weeks}</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-sm text-zinc-500 italic">
                      Aucun protocole de réduction nécessaire — cette substance ne crée pas de dépendance physique.
                      {tap.warnings.length === 0 && ' Arrêt libre à tout moment.'}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
