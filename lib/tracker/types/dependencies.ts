import type { SubstanceKey } from '../constants';

export interface FrequencyData {
  current_period: number;
  previous_period: number;
  trend: 'increasing' | 'decreasing' | 'stable' | 'new' | 'none';
  daily_average: number;
  regularity: number;
}

export interface DosingData {
  current_avg: number;
  previous_avg: number;
  trend: 'increasing' | 'decreasing' | 'stable' | 'new' | 'none';
  unit: string;
}

export interface IntentData {
  therapeutic: number;
  recreational: number;
  coping: number;
  coping_ratio: number;
  shift_trend: 'toward_coping' | 'away_from_coping' | 'stable';
}

export interface TaperingStep {
  step: number;
  week: number;
  target_dose: number;
  target_frequency: number;
  unit: string;
  notes: string;
}

export interface TaperingProtocol {
  recommended: boolean;
  protocol_name: string;
  current_baseline: {
    dose: number;
    unit: string;
    frequency_per_day: number;
  };
  steps: TaperingStep[];
  duration_weeks: number;
  safety_level: 'self_managed' | 'medical_supervision_recommended' | 'medical_supervision_required';
  warnings: string[];
  withdrawal_symptoms: string[];
}

export interface BiometricValidation {
  current: {
    hr: number | null;
    hrv: number | null;
    stress: number | null;
    body_battery: number | null;
    sleep_score: number | null;
  };
  baseline_during_use: Record<string, number>;
  withdrawal_thresholds: {
    stress_alert: number;
    hrv_alert: number;
    sleep_alert: number;
  };
  status: 'ok' | 'withdrawal_signs';
}

export interface SubstanceDependency {
  dependency_score: number;
  risk_level: 'low' | 'moderate' | 'high' | 'critical';
  risk_class: 'none' | 'low' | 'moderate' | 'high';
  frequency: FrequencyData;
  dosing: DosingData;
  intents: IntentData;
  biometric_impact: Record<string, number>;
  last_use: string;
  hours_since_last: number | null;
  tapering: TaperingProtocol | null;
  biometric_validation: BiometricValidation | null;
}

export interface DependencyAnalysis {
  substances: Record<string, SubstanceDependency>;
  biometrics_now: {
    hr: number | null;
    hrv: number | null;
    stress: number | null;
    body_battery: number | null;
    sleep_score: number | null;
    ans_mode: string;
  } | null;
  overall_risk: 'low' | 'moderate' | 'high' | 'critical';
  highest_risk_substance: string | null;
  analysis_period_days: number;
}
