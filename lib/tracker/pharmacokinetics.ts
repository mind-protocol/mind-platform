/**
 * Pharmacokinetic modeling for subjective substance effects.
 *
 * Each substance has a characteristic curve:  onset → peak → plateau → decay
 * Intensity is 0-1 representing subjective effect strength.
 *
 * These are simplified PK models tuned for subjective experience,
 * NOT clinical plasma concentration curves.
 */

import type { SubstanceKey } from './constants';

export interface PKProfile {
  /** Minutes from intake to first noticeable effect */
  onsetMin: number;
  /** Minutes from intake to peak effect */
  peakMin: number;
  /** Minutes from intake where plateau ends and decay begins */
  plateauEndMin: number;
  /** Minutes from intake to baseline (subjective zero) */
  durationMin: number;
  /** Peak intensity multiplier (dose-dependent scaling applies on top) */
  peakIntensity: number;
  /** Shape of decay: 'exponential' (sharp dropoff) or 'linear' (gradual) */
  decayShape: 'exponential' | 'linear';
  /** Whether this is a steady-state medication (always "on") */
  steadyState?: boolean;
}

export const PK_PROFILES: Record<SubstanceKey, PKProfile> = {
  thc: {
    onsetMin: 2,
    peakMin: 15,
    plateauEndMin: 45,
    durationMin: 180,       // 3 hours subjective
    peakIntensity: 1.0,
    decayShape: 'exponential',
  },
  ketamine: {
    onsetMin: 5,
    peakMin: 20,
    plateauEndMin: 40,
    durationMin: 120,       // 2 hours with afterglow
    peakIntensity: 1.0,
    decayShape: 'exponential',
  },
  lsd: {
    onsetMin: 30,
    peakMin: 150,           // 2.5 hours
    plateauEndMin: 300,     // 5 hours
    durationMin: 720,       // 12 hours
    peakIntensity: 1.0,
    decayShape: 'linear',
  },
  nicotine: {
    onsetMin: 0.5,
    peakMin: 3,
    plateauEndMin: 8,
    durationMin: 30,
    peakIntensity: 0.7,     // Lower ceiling — stimulant not psychedelic
    decayShape: 'exponential',
  },
  hydration: {
    onsetMin: 5,
    peakMin: 20,
    plateauEndMin: 60,
    durationMin: 120,
    peakIntensity: 0.3,     // Subtle — affects state but isn't psychoactive
    decayShape: 'linear',
  },
  melatonin: {
    onsetMin: 20,
    peakMin: 60,
    plateauEndMin: 120,
    durationMin: 360,       // 6 hours
    peakIntensity: 0.6,
    decayShape: 'linear',
  },
  venlafaxine: {
    onsetMin: 0,
    peakMin: 0,
    plateauEndMin: 0,
    durationMin: 1440,      // 24 hours — steady state
    peakIntensity: 0.4,
    decayShape: 'linear',
    steadyState: true,      // Always baseline-active once taken
  },
  prazepam: {
    onsetMin: 10,           // Sublingual: faster
    peakMin: 60,
    plateauEndMin: 240,     // 4 hours
    durationMin: 480,       // 8 hours subjective (metabolite much longer)
    peakIntensity: 0.8,
    decayShape: 'linear',
  },
};

/**
 * Calculate current subjective intensity for a single dose.
 *
 * @param substance - The substance key
 * @param minutesSinceDose - Time elapsed since intake in minutes
 * @param doseNormalized - Dose normalized to 0-1 range (from normalizeDose)
 * @returns intensity 0-1
 */
export function getIntensity(
  substance: SubstanceKey,
  minutesSinceDose: number,
  doseNormalized: number = 0.5,
): number {
  const pk = PK_PROFILES[substance];
  if (!pk) return 0;

  // Steady-state substances: constant baseline when taken today
  if (pk.steadyState) {
    if (minutesSinceDose < 0 || minutesSinceDose > pk.durationMin) return 0;
    return pk.peakIntensity * Math.min(1, doseNormalized + 0.3);
  }

  // Not yet onset
  if (minutesSinceDose < 0) return 0;

  // Past duration — fully metabolized
  if (minutesSinceDose >= pk.durationMin) return 0;

  const t = minutesSinceDose;
  let intensity: number;

  if (t < pk.onsetMin) {
    // Onset ramp — smooth ease-in
    intensity = (t / pk.onsetMin) * 0.3 * pk.peakIntensity;
  } else if (t < pk.peakMin) {
    // Rising to peak — smooth sigmoid-like curve
    const progress = (t - pk.onsetMin) / (pk.peakMin - pk.onsetMin);
    const eased = progress * progress * (3 - 2 * progress); // smoothstep
    intensity = (0.3 + eased * 0.7) * pk.peakIntensity;
  } else if (t < pk.plateauEndMin) {
    // Plateau — slight wave around peak
    const plateauProgress = (t - pk.peakMin) / (pk.plateauEndMin - pk.peakMin);
    const wave = Math.sin(plateauProgress * Math.PI) * 0.05;
    intensity = (0.95 + wave) * pk.peakIntensity;
  } else {
    // Decay phase
    const decayProgress = (t - pk.plateauEndMin) / (pk.durationMin - pk.plateauEndMin);

    if (pk.decayShape === 'exponential') {
      // Sharp initial drop then long tail
      intensity = pk.peakIntensity * 0.95 * Math.exp(-3 * decayProgress);
    } else {
      // Gradual linear fade
      intensity = pk.peakIntensity * 0.95 * (1 - decayProgress);
    }
  }

  // Scale by dose (higher dose = stronger effect, but with diminishing returns)
  const doseScale = 0.4 + 0.6 * Math.pow(doseNormalized, 0.7);

  return Math.max(0, Math.min(1, intensity * doseScale));
}

/**
 * Represents the computed awareness state at a point in time.
 */
export interface AwarenessState {
  /** Per-substance current intensity 0-1 */
  substances: Record<SubstanceKey, number>;
  /** Combined psychedelic load (LSD + ketamine + THC combined) */
  psychedelicLoad: number;
  /** Stimulant component (nicotine) */
  stimulantLoad: number;
  /** Sedative component (melatonin + prazepam) */
  sedativeLoad: number;
  /** Antidepressant baseline (venlafaxine) */
  antidepressantBaseline: number;
  /** Hydration level */
  hydrationLevel: number;
  /** Overall consciousness alteration 0-1 */
  alterationDepth: number;
  /** Dominant substance (highest intensity) */
  dominant: SubstanceKey | null;
  /** Biometric stress 0-100 */
  stress: number | null;
  /** Biometric body battery 0-100 */
  bodyBattery: number | null;
  /** Heart rate */
  hr: number | null;
}

export interface IntakeEvent {
  substance: SubstanceKey;
  ts: string;        // ISO timestamp
  amount: number;    // Raw dose amount
  normalizedDose: number;  // 0-1 normalized
}

/**
 * Compute the full awareness state from recent intakes + biometrics.
 */
export function computeAwareness(
  intakes: IntakeEvent[],
  now: Date,
  biometrics?: { stress?: number | null; body_battery?: number | null; hr?: number | null },
): AwarenessState {
  const substances: Record<string, number> = {};
  const keys: SubstanceKey[] = ['thc', 'ketamine', 'lsd', 'nicotine', 'hydration', 'melatonin', 'venlafaxine', 'prazepam'];

  for (const key of keys) {
    // Sum intensities from all recent doses of this substance
    // (stacking effect — multiple doses compound)
    let totalIntensity = 0;
    const relevantIntakes = intakes.filter(i => i.substance === key);

    for (const intake of relevantIntakes) {
      const elapsed = (now.getTime() - new Date(intake.ts).getTime()) / 60000; // minutes
      const intensity = getIntensity(key, elapsed, intake.normalizedDose);
      totalIntensity = Math.min(1, totalIntensity + intensity); // Cap at 1
    }

    substances[key] = totalIntensity;
  }

  const sub = substances as Record<SubstanceKey, number>;

  // Composite loads
  const psychedelicLoad = Math.min(1, sub.lsd * 1.0 + sub.ketamine * 0.8 + sub.thc * 0.4);
  const stimulantLoad = sub.nicotine;
  const sedativeLoad = Math.min(1, sub.melatonin + sub.prazepam * 0.8);
  const antidepressantBaseline = sub.venlafaxine;
  const hydrationLevel = sub.hydration;

  // Overall alteration depth — weighted sum
  const alterationDepth = Math.min(1,
    sub.lsd * 0.35 +
    sub.ketamine * 0.3 +
    sub.thc * 0.15 +
    sub.prazepam * 0.1 +
    sub.melatonin * 0.05 +
    sub.nicotine * 0.05
  );

  // Find dominant
  let dominant: SubstanceKey | null = null;
  let maxIntensity = 0.05; // Threshold to be considered "dominant"
  for (const key of keys) {
    if (sub[key] > maxIntensity) {
      maxIntensity = sub[key];
      dominant = key;
    }
  }

  return {
    substances: sub,
    psychedelicLoad,
    stimulantLoad,
    sedativeLoad,
    antidepressantBaseline,
    hydrationLevel,
    alterationDepth,
    dominant,
    stress: biometrics?.stress ?? null,
    bodyBattery: biometrics?.body_battery ?? null,
    hr: biometrics?.hr ?? null,
  };
}
