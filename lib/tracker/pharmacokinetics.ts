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
  cbd: {
    onsetMin: 25,           // Oral tablet — slower absorption
    peakMin: 75,            // ~1h15 to peak (CBD + ashwagandha + griffonia synergy)
    plateauEndMin: 180,     // 3h plateau (adaptogenic compounds sustain effect)
    durationMin: 420,       // ~7 hours (ashwagandha + magnesium long tail)
    peakIntensity: 0.55,    // Stronger than pure CBD — compound synergy
    decayShape: 'linear',
  },
  lions_mane: {
    onsetMin: 0,
    peakMin: 0,
    plateauEndMin: 0,
    durationMin: 1440,      // 24h — daily supplement, steady state
    peakIntensity: 0.2,     // Very subtle — cumulative nootropic, not felt acutely
    decayShape: 'linear',
    steadyState: true,      // Like venlafaxine — always "on" once taken daily
  },
  caffeine: {
    onsetMin: 15,           // Espresso absorbed fast
    peakMin: 45,            // Peak alertness ~45min
    plateauEndMin: 120,     // 2h solid plateau
    durationMin: 480,       // ~8h total (half-life ~5-6h)
    peakIntensity: 0.55,    // Noticeable stimulant, not psychoactive
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
  sertraline: {
    onsetMin: 0,
    peakMin: 0,
    plateauEndMin: 0,
    durationMin: 1440,      // 24 hours — steady state (t½ ~26h)
    peakIntensity: 0.4,     // SSRI — subtle baseline modulation
    decayShape: 'linear',
    steadyState: true,      // Requires 2-4 weeks for full therapeutic effect
  },
  prazepam: {
    onsetMin: 10,           // Sublingual: faster
    peakMin: 60,
    plateauEndMin: 240,     // 4 hours
    durationMin: 480,       // 8 hours subjective (metabolite much longer)
    peakIntensity: 0.8,
    decayShape: 'linear',
  },
  cyamemazine: {
    onsetMin: 20,           // Oral tablet
    peakMin: 90,            // 1.5 hours
    plateauEndMin: 180,     // 3 hours
    durationMin: 480,       // 8 hours (sedative tail)
    peakIntensity: 0.7,
    decayShape: 'linear',
  },
  dynabiane: {
    onsetMin: 0,
    peakMin: 0,
    plateauEndMin: 0,
    durationMin: 1440,      // 24h — daily probiotic, steady state
    peakIntensity: 0.15,    // Very subtle — gut-brain axis, cumulative
    decayShape: 'linear',
    steadyState: true,
  },
  omegabiane: {
    onsetMin: 0,
    peakMin: 0,
    plateauEndMin: 0,
    durationMin: 1440,      // 24h — daily omega-3, steady state
    peakIntensity: 0.15,    // Subtle — structural brain support, not felt acutely
    decayShape: 'linear',
    steadyState: true,
  },
  griffonia: {
    onsetMin: 30,           // 5-HTP oral absorption
    peakMin: 90,            // ~1.5h to peak serotonin effect
    plateauEndMin: 240,     // 4h plateau
    durationMin: 480,       // ~8h (5-HTP half-life ~4-6h)
    peakIntensity: 0.35,    // Moderate — serotonin precursor, felt subtly
    decayShape: 'linear',
  },
  valeriane: {
    onsetMin: 20,           // Oral absorption
    peakMin: 60,            // ~1h to peak sedative effect
    plateauEndMin: 180,     // 3h plateau
    durationMin: 360,       // ~6h (valerian GABA modulation)
    peakIntensity: 0.4,     // Moderate — noticeable calming/sedation
    decayShape: 'linear',
  },
  safran: {
    onsetMin: 0,
    peakMin: 0,
    plateauEndMin: 0,
    durationMin: 1440,      // 24h — daily supplement, steady state
    peakIntensity: 0.2,     // Subtle — mood support, cumulative
    decayShape: 'linear',
    steadyState: true,      // Requires 4-6 weeks for full antidepressant effect
  },
  yoga: {
    onsetMin: 0,
    peakMin: 5,
    plateauEndMin: 30,      // During session
    durationMin: 120,       // ANS effects last ~2h post-session
    peakIntensity: 0.5,     // Moderate — body practice, not chemical
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
  /** Adaptogenic load (ashwagandha + rhodiola via CBD complex) */
  adaptogenicLoad: number;
  /** Serotonergic support (griffonia 5-HTP + B6 via CBD complex) */
  serotonergicSupport: number;
  /** Neuroprotective load (omega-3 EPA/DHA + lion's mane NGF) */
  neuroprotectiveLoad: number;
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
  const keys: SubstanceKey[] = ['thc', 'cbd', 'lions_mane', 'caffeine', 'ketamine', 'lsd', 'nicotine', 'hydration', 'melatonin', 'venlafaxine', 'sertraline', 'prazepam', 'cyamemazine', 'dynabiane', 'omegabiane', 'griffonia', 'valeriane', 'safran'];

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
  const stimulantLoad = Math.min(1, sub.nicotine + sub.caffeine * 0.7 + sub.cbd * 0.1); // Rhodiola mild stimulant
  const sedativeLoad = Math.min(1, sub.melatonin + sub.prazepam * 0.8 + sub.cyamemazine * 0.7 + sub.cbd * 0.35 + sub.valeriane * 0.6); // CBD + ashwagandha anxiolytic + valerian GABA
  const antidepressantBaseline = Math.min(1, sub.venlafaxine + sub.sertraline + sub.safran * 0.3); // Saffron has mild antidepressant properties
  // Adaptogenic: ashwagandha (280mg) + rhodiola (30mg) via CBD complex + lion's mane + dynabiane gut-brain
  const adaptogenicLoad = Math.min(1, sub.cbd * 0.8 + sub.lions_mane * 0.15 + sub.dynabiane * 0.1);
  // Serotonin support: griffonia 5-HTP (direct precursor) + CBD complex + venlafaxine + sertraline (SSRI) + safran (serotonin reuptake) + dynabiane gut-serotonin
  const serotonergicSupport = Math.min(1, sub.griffonia * 0.7 + sub.cbd * 0.6 + sub.venlafaxine * 0.3 + sub.sertraline * 0.4 + sub.safran * 0.3 + sub.dynabiane * 0.1);
  // Neuroprotective: omega-3 EPA/DHA + lion's mane NGF
  const neuroprotectiveLoad = Math.min(1, sub.omegabiane * 0.7 + sub.lions_mane * 0.3);
  const hydrationLevel = sub.hydration;

  // Overall alteration depth — weighted sum
  const alterationDepth = Math.min(1,
    sub.lsd * 0.35 +
    sub.ketamine * 0.3 +
    sub.thc * 0.15 +
    sub.cbd * 0.08 +     // CBD complex has stronger effect than pure CBD
    sub.prazepam * 0.1 +
    sub.cyamemazine * 0.1 +
    sub.melatonin * 0.05 +
    sub.nicotine * 0.05 +
    sub.caffeine * 0.03 +
    sub.lions_mane * 0.02 +
    sub.sertraline * 0.02 +
    sub.dynabiane * 0.01 +
    sub.omegabiane * 0.01 +
    sub.griffonia * 0.03 +
    sub.valeriane * 0.04 +
    sub.safran * 0.01
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
    adaptogenicLoad,
    serotonergicSupport,
    neuroprotectiveLoad,
    hydrationLevel,
    alterationDepth,
    dominant,
    stress: biometrics?.stress ?? null,
    bodyBattery: biometrics?.body_battery ?? null,
    hr: biometrics?.hr ?? null,
  };
}
