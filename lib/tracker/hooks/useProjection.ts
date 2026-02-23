'use client';

import { useMemo } from 'react';
import { SUBSTANCE_KEYS, normalizeDose, type SubstanceKey } from '../constants';
import { getIntensity, computeAwareness, type IntakeEvent } from '../pharmacokinetics';
import type { PlannedDose, ProjectionPoint } from '../planning';

/**
 * Client-side PK forward projection.
 *
 * Merges real past intakes with planned future doses to sweep
 * the awareness state over a time window. Uses the existing PK engine.
 */
export function useProjection(
  pastIntakes: IntakeEvent[],
  plannedDoses: PlannedDose[],
  hoursAhead: number = 24,
  hoursBehind: number = 6,
  resolutionMinutes: number = 5,
): ProjectionPoint[] {
  return useMemo(() => {
    const now = Date.now();
    const startMs = now - hoursBehind * 60 * 60_000;
    const endMs = now + hoursAhead * 60 * 60_000;
    const stepMs = resolutionMinutes * 60_000;
    const totalSteps = Math.ceil((endMs - startMs) / stepMs);

    // Convert planned doses (scheduled/snoozed only) to synthetic IntakeEvents
    const futureIntakes: IntakeEvent[] = plannedDoses
      .filter(p => p.status === 'scheduled' || p.status === 'snoozed')
      .map(p => {
        const ts = p.status === 'snoozed' && p.snooze_until ? p.snooze_until : p.ts_scheduled;
        return {
          substance: p.substance,
          ts,
          amount: p.dose.amount,
          normalizedDose: SUBSTANCE_KEYS.includes(p.substance)
            ? normalizeDose(p.substance, p.dose.amount)
            : 0.5,
        };
      });

    const allIntakes = [...pastIntakes, ...futureIntakes];

    const points: ProjectionPoint[] = [];

    for (let i = 0; i <= totalSteps; i++) {
      const tsMs = startMs + i * stepMs;
      const dt = new Date(tsMs);

      // Compute awareness at this time point
      const state = computeAwareness(allIntakes, dt);

      // Find dominant
      let dominant: SubstanceKey | null = null;
      let maxIntensity = 0.05; // threshold
      for (const key of SUBSTANCE_KEYS) {
        if (state.substances[key] > maxIntensity) {
          maxIntensity = state.substances[key];
          dominant = key;
        }
      }

      points.push({
        ts: tsMs,
        substances: { ...state.substances },
        alterationDepth: state.alterationDepth,
        dominant,
      });
    }

    return points;
  }, [pastIntakes, plannedDoses, hoursAhead, hoursBehind, resolutionMinutes]);
}
