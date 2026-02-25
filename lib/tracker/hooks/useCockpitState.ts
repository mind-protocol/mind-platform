'use client';

import { useMemo } from 'react';
import type { AwarenessState } from '../pharmacokinetics';

// ─── Cockpit Mode ──────────────────────────────────────────────────────
// Derived from biometrics + substance state + alteration depth
// Represents the current operating mode of consciousness

export type CockpitMode = 'survival' | 'recovery' | 'stable' | 'flow';

export interface CockpitState {
  mode: CockpitMode;
  headline: string;
  subline: string;
  nextAction: string | null;
  /** 0-1 confidence in the mode detection */
  confidence: number;
  /** Color associated with current mode */
  color: string;
  /** Icon glyph */
  icon: string;
  /** Signals that contributed to mode detection */
  signals: CockpitSignal[];
}

export interface CockpitSignal {
  source: 'stress' | 'bodyBattery' | 'hr' | 'alteration' | 'sedative' | 'stimulant' | 'psychedelic' | 'hydration' | 'antidepressant' | 'serotonergic' | 'neuroprotective';
  value: number;
  label: string;
  severity: 'ok' | 'warn' | 'alert';
}

// ─── Mode Detection Logic ──────────────────────────────────────────────

const MODE_CONFIG: Record<CockpitMode, { color: string; icon: string }> = {
  survival: { color: '#ef4444', icon: '🔴' },
  recovery: { color: '#f59e0b', icon: '🟡' },
  stable:   { color: '#22c55e', icon: '🟢' },
  flow:     { color: '#818cf8', icon: '🟣' },
};

function detectMode(awareness: AwarenessState): CockpitState {
  const {
    stress, bodyBattery, hr,
    alterationDepth, psychedelicLoad, stimulantLoad, sedativeLoad,
    antidepressantBaseline, serotonergicSupport, neuroprotectiveLoad,
    hydrationLevel,
  } = awareness;

  const signals: CockpitSignal[] = [];

  // ── Collect signals ────────────────────────────────────────────────

  if (stress != null) {
    signals.push({
      source: 'stress',
      value: stress,
      label: `Stress ${stress}`,
      severity: stress > 70 ? 'alert' : stress > 45 ? 'warn' : 'ok',
    });
  }

  if (bodyBattery != null) {
    signals.push({
      source: 'bodyBattery',
      value: bodyBattery,
      label: `BB ${bodyBattery}`,
      severity: bodyBattery < 15 ? 'alert' : bodyBattery < 35 ? 'warn' : 'ok',
    });
  }

  if (hr != null) {
    signals.push({
      source: 'hr',
      value: hr,
      label: `HR ${hr}`,
      severity: hr > 110 ? 'alert' : hr > 90 ? 'warn' : 'ok',
    });
  }

  if (alterationDepth > 0.05) {
    signals.push({
      source: 'alteration',
      value: alterationDepth,
      label: `Alteration ${(alterationDepth * 100).toFixed(0)}%`,
      severity: alterationDepth > 0.6 ? 'alert' : alterationDepth > 0.3 ? 'warn' : 'ok',
    });
  }

  if (sedativeLoad > 0.1) {
    signals.push({
      source: 'sedative',
      value: sedativeLoad,
      label: `Sedative ${(sedativeLoad * 100).toFixed(0)}%`,
      severity: sedativeLoad > 0.7 ? 'warn' : 'ok',
    });
  }

  if (stimulantLoad > 0.1) {
    signals.push({
      source: 'stimulant',
      value: stimulantLoad,
      label: `Stimulant ${(stimulantLoad * 100).toFixed(0)}%`,
      severity: stimulantLoad > 0.6 ? 'warn' : 'ok',
    });
  }

  if (psychedelicLoad > 0.1) {
    signals.push({
      source: 'psychedelic',
      value: psychedelicLoad,
      label: `Psychedelic ${(psychedelicLoad * 100).toFixed(0)}%`,
      severity: psychedelicLoad > 0.5 ? 'alert' : 'warn',
    });
  }

  if (hydrationLevel > 0.05) {
    signals.push({
      source: 'hydration',
      value: hydrationLevel,
      label: `Hydration ${(hydrationLevel * 100).toFixed(0)}%`,
      severity: 'ok',
    });
  }

  // ── Score each mode ────────────────────────────────────────────────
  // Higher score = more likely

  let survivalScore = 0;
  let recoveryScore = 0;
  let stableScore = 0;
  let flowScore = 0;

  // Stress contribution
  if (stress != null) {
    if (stress > 70) survivalScore += 3;
    else if (stress > 50) survivalScore += 1.5;
    else if (stress > 35) stableScore += 1;
    else if (stress <= 35) {
      flowScore += 1;
      recoveryScore += 0.5;
    }
  }

  // Body battery contribution
  if (bodyBattery != null) {
    if (bodyBattery < 10) survivalScore += 3;
    else if (bodyBattery < 25) {
      recoveryScore += 2;
      survivalScore += 1;
    } else if (bodyBattery < 45) recoveryScore += 1.5;
    else if (bodyBattery >= 60) flowScore += 1.5;
    else stableScore += 1;
  }

  // HR contribution
  if (hr != null) {
    if (hr > 110) survivalScore += 1;
    else if (hr > 90) survivalScore += 0.5;
    else if (hr >= 55 && hr <= 75) flowScore += 0.5;
  }

  // Alteration depth
  if (alterationDepth > 0.6) {
    survivalScore += 1.5; // High alteration needs monitoring
  } else if (alterationDepth > 0.3) {
    flowScore += 1; // Moderate alteration can be flow-enabling
  }

  // Psychedelic load — high requires survival awareness
  if (psychedelicLoad > 0.5) survivalScore += 2;
  else if (psychedelicLoad > 0.2) flowScore += 1;

  // Sedative load — pushes toward recovery
  if (sedativeLoad > 0.5) recoveryScore += 2;
  else if (sedativeLoad > 0.2) recoveryScore += 1;

  // Stimulant can enable flow but also stress
  if (stimulantLoad > 0.5 && (stress == null || stress < 50)) flowScore += 1;
  else if (stimulantLoad > 0.5) survivalScore += 0.5;

  // Baseline antidepressant provides stability
  if (antidepressantBaseline > 0.3) stableScore += 0.5;

  // Serotonergic support contributes to stable/flow
  if (serotonergicSupport > 0.3) {
    stableScore += 0.5;
    flowScore += 0.3;
  }

  // Neuroprotective contributes to stable
  if (neuroprotectiveLoad > 0.2) stableScore += 0.3;

  // Default baseline: if no strong signals, lean stable
  if (survivalScore === 0 && recoveryScore === 0 && flowScore === 0 && stableScore === 0) {
    stableScore = 1;
  }

  // ── Pick winning mode ──────────────────────────────────────────────

  const scores = {
    survival: survivalScore,
    recovery: recoveryScore,
    stable: stableScore,
    flow: flowScore,
  };

  const maxScore = Math.max(...Object.values(scores));
  const mode: CockpitMode = (Object.entries(scores) as [CockpitMode, number][])
    .sort((a, b) => b[1] - a[1])[0][0];

  // Confidence: how much does the winner lead?
  const sortedScores = Object.values(scores).sort((a, b) => b - a);
  const totalScore = sortedScores.reduce((a, b) => a + b, 0);
  const confidence = totalScore > 0 ? Math.min(1, maxScore / totalScore) : 0.5;

  // ── Generate headline + next action ────────────────────────────────

  const { headline, subline, nextAction } = generateHeadline(mode, awareness, signals);

  return {
    mode,
    headline,
    subline,
    nextAction,
    confidence,
    color: MODE_CONFIG[mode].color,
    icon: MODE_CONFIG[mode].icon,
    signals,
  };
}

function generateHeadline(
  mode: CockpitMode,
  awareness: AwarenessState,
  signals: CockpitSignal[],
): { headline: string; subline: string; nextAction: string | null } {
  const { stress, bodyBattery, dominant } = awareness;
  const alertSignals = signals.filter(s => s.severity === 'alert');

  switch (mode) {
    case 'survival': {
      if (alertSignals.length > 0) {
        const alertLabels = alertSignals.map(s => s.label).join(', ');
        return {
          headline: 'Mode Survie',
          subline: alertLabels,
          nextAction: stress != null && stress > 70
            ? 'Respiration cohérence cardiaque'
            : bodyBattery != null && bodyBattery < 15
              ? 'Repos immédiat — économiser la batterie'
              : 'Réduire la stimulation',
        };
      }
      return {
        headline: 'Mode Survie',
        subline: 'Signaux en alerte',
        nextAction: 'Observer, ne pas réagir',
      };
    }

    case 'recovery': {
      return {
        headline: 'Récupération',
        subline: bodyBattery != null
          ? `BB ${bodyBattery} — recharge en cours`
          : 'Phase de repos actif',
        nextAction: bodyBattery != null && bodyBattery < 30
          ? 'Yin yoga ou sieste courte'
          : 'Activité douce, hydratation',
      };
    }

    case 'flow': {
      const flowSource = dominant
        ? `${dominant} + focus`
        : stress != null && stress < 30
          ? 'Basse tension, haute clarté'
          : 'Conditions optimales';
      return {
        headline: 'Flow',
        subline: flowSource,
        nextAction: 'Capitaliser — deep work maintenant',
      };
    }

    case 'stable':
    default: {
      return {
        headline: 'Stable',
        subline: bodyBattery != null
          ? `BB ${bodyBattery} — état nominal`
          : 'Baseline normal',
        nextAction: null,
      };
    }
  }
}

// ─── Hook ──────────────────────────────────────────────────────────────

export function useCockpitState(awareness: AwarenessState): CockpitState {
  return useMemo(() => detectMode(awareness), [
    awareness.stress,
    awareness.bodyBattery,
    awareness.hr,
    awareness.alterationDepth,
    awareness.psychedelicLoad,
    awareness.stimulantLoad,
    awareness.sedativeLoad,
    awareness.antidepressantBaseline,
    awareness.serotonergicSupport,
    awareness.neuroprotectiveLoad,
    awareness.hydrationLevel,
    awareness.dominant,
  ]);
}
