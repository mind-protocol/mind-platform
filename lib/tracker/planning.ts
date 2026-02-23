import type { SubstanceKey } from './constants';

export type PlanStatus = 'scheduled' | 'snoozed' | 'taken' | 'skipped';
export type PlanSource = 'manual' | 'recommendation' | 'regimen';

export interface PlannedDose {
  id: string;
  ts_created: string;
  ts_scheduled: string;
  substance: SubstanceKey;
  dose: { amount: number; unit: string; details: Record<string, unknown> };
  intent: string;
  source: PlanSource;
  regimen_id: string | null;
  status: PlanStatus;
  ts_actioned: string | null;
  linked_log_id: string | null;
  snooze_until: string | null;
  notes: string;
}

export interface RegimenPattern {
  type: 'daily' | 'interval';
  times?: string[];
  interval_hours?: number;
  waking_hours_only?: boolean;
}

export interface Regimen {
  id: string;
  ts_created: string;
  substance: SubstanceKey;
  dose: { amount: number; unit: string; details: Record<string, unknown> };
  intent: string;
  pattern: RegimenPattern;
  active: boolean;
  ts_deactivated: string | null;
  notes: string;
}

export interface ProjectionPoint {
  ts: number; // timestamp ms
  substances: Record<SubstanceKey, number>;
  alterationDepth: number;
  dominant: SubstanceKey | null;
}
