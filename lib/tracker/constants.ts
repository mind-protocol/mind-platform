export type SubstanceKey = 'thc' | 'ketamine' | 'lsd' | 'nicotine' | 'hydration';

export interface SubstanceConfig {
  color: string;
  icon: string;
  label: string;
  unit: string;
  geometry: 'cylinder' | 'octahedron' | 'icosahedron' | 'torus' | 'sphere';
  laneY: number;
}

export const SUBSTANCE_CONFIG: Record<SubstanceKey, SubstanceConfig> = {
  thc:       { color: '#22c55e', icon: '\u{1F33F}', label: 'THC',       unit: 'chambers', geometry: 'cylinder',     laneY: 0 },
  ketamine:  { color: '#8b5cf6', icon: '\u{1F48E}', label: 'Ketamine',  unit: 'mg',       geometry: 'octahedron',   laneY: 2.5 },
  lsd:       { color: '#ec4899', icon: '\u{1F52E}', label: 'LSD',       unit: 'ug',       geometry: 'icosahedron',  laneY: 5 },
  nicotine:  { color: '#f59e0b', icon: '\u{1F4A8}', label: 'Nicotine',  unit: 'puffs',    geometry: 'torus',        laneY: 7.5 },
  hydration: { color: '#3b82f6', icon: '\u{1F4A7}', label: 'H2O',       unit: 'ml',       geometry: 'sphere',       laneY: 10 },
};

export const SUBSTANCE_KEYS = Object.keys(SUBSTANCE_CONFIG) as SubstanceKey[];

// Map raw dose amounts to a 0.3-1.5 scale factor for 3D marker size
export const DOSE_RANGES: Record<SubstanceKey, { min: number; max: number }> = {
  thc:       { min: 1, max: 5 },
  ketamine:  { min: 15, max: 150 },
  lsd:       { min: 25, max: 200 },
  nicotine:  { min: 1, max: 20 },
  hydration: { min: 200, max: 1500 },
};

export function normalizeDose(substance: SubstanceKey, amount: number): number {
  const range = DOSE_RANGES[substance];
  if (!range) return 0.5;
  const t = (amount - range.min) / (range.max - range.min);
  return 0.3 + Math.max(0, Math.min(1, t)) * 1.2; // 0.3 to 1.5
}
