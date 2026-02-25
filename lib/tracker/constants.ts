export type SubstanceKey = 'thc' | 'cbd' | 'lions_mane' | 'caffeine' | 'ketamine' | 'lsd' | 'nicotine' | 'hydration' | 'melatonin' | 'venlafaxine' | 'sertraline' | 'prazepam' | 'cyamemazine' | 'dynabiane' | 'omegabiane' | 'griffonia' | 'valeriane' | 'safran' | 'yoga';

export interface SubstanceConfig {
  color: string;
  icon: string;
  label: string;
  unit: string;
  geometry: 'cylinder' | 'octahedron' | 'icosahedron' | 'torus' | 'sphere' | 'capsule' | 'disc' | 'crescent' | 'tetrahedron' | 'dodecahedron' | 'cone' | 'ring' | 'pill' | 'droplet';
  laneY: number;
}

export const SUBSTANCE_CONFIG: Record<SubstanceKey, SubstanceConfig> = {
  thc:         { color: '#22c55e', icon: '\u{1F33F}', label: 'THC',         unit: 'chambers', geometry: 'cylinder',     laneY: 0 },
  cbd:         { color: '#84cc16', icon: '\u{1F331}', label: 'CBD Complex', unit: 'comprimé',  geometry: 'dodecahedron', laneY: 1.25 },
  lions_mane:  { color: '#b45309', icon: '\u{1F981}', label: "Lion's Mane", unit: 'mg',       geometry: 'cone',         laneY: 1.75 },
  caffeine:    { color: '#d97706', icon: '\u{2615}',  label: 'Caffeine',    unit: 'mg',       geometry: 'ring',         laneY: 2.25 },
  ketamine:    { color: '#8b5cf6', icon: '\u{1F48E}', label: 'Ketamine',    unit: 'mg',       geometry: 'octahedron',   laneY: 2.5 },
  lsd:         { color: '#ec4899', icon: '\u{1F52E}', label: 'LSD',         unit: 'ug',       geometry: 'icosahedron',  laneY: 5 },
  nicotine:    { color: '#f59e0b', icon: '\u{1F4A8}', label: 'Nicotine',    unit: 'puffs',    geometry: 'torus',        laneY: 7.5 },
  hydration:   { color: '#3b82f6', icon: '\u{1F4A7}', label: 'H2O',         unit: 'ml',       geometry: 'sphere',       laneY: 10 },
  melatonin:   { color: '#6366f1', icon: '\u{1F319}', label: 'Melatonin',   unit: 'mg',       geometry: 'crescent',     laneY: 12.5 },
  venlafaxine: { color: '#14b8a6', icon: '\u{1F48A}', label: 'Venlafaxine', unit: 'mg',       geometry: 'capsule',      laneY: 15 },
  sertraline:  { color: '#06b6d4', icon: '\u{1F48A}', label: 'Sertraline',  unit: 'mg',       geometry: 'capsule',      laneY: 16.25 },
  prazepam:    { color: '#94a3b8', icon: '\u{1FAE7}', label: 'Prazepam',    unit: 'mg',       geometry: 'disc',         laneY: 17.5 },
  cyamemazine: { color: '#7e22ce', icon: '\u{1F30C}', label: 'Cyamemazine', unit: 'mg',       geometry: 'tetrahedron',  laneY: 20 },
  dynabiane:   { color: '#10b981', icon: '\u{1F9EC}', label: 'Dynabiane',   unit: 'gélule',   geometry: 'pill',         laneY: 22.5 },
  omegabiane:  { color: '#0ea5e9', icon: '\u{1F41F}', label: 'Omegabiane',  unit: 'gélule',   geometry: 'droplet',      laneY: 25 },
  griffonia:   { color: '#a855f7', icon: '\u{1F330}', label: 'Griffonia',   unit: 'mg',       geometry: 'pill',         laneY: 26.25 },
  valeriane:   { color: '#65a30d', icon: '\u{1F33E}', label: 'Valériane',   unit: 'mg',       geometry: 'pill',         laneY: 27.5 },
  safran:      { color: '#f97316', icon: '\u{1F338}', label: 'Safran',      unit: 'mg',       geometry: 'pill',         laneY: 28.75 },
  yoga:        { color: '#f472b6', icon: '\u{1F9D8}', label: 'Yoga',        unit: 'min',      geometry: 'sphere',       laneY: 30 },
};

export const SUBSTANCE_KEYS = Object.keys(SUBSTANCE_CONFIG) as SubstanceKey[];

// Map raw dose amounts to a 0.3-1.5 scale factor for 3D marker size
export const DOSE_RANGES: Record<SubstanceKey, { min: number; max: number }> = {
  thc:         { min: 1, max: 5 },
  cbd:         { min: 1, max: 3 },     // Comprimé count (1-3 tablets)
  lions_mane:  { min: 420, max: 2520 },
  caffeine:    { min: 40, max: 400 },
  ketamine:    { min: 15, max: 150 },
  lsd:         { min: 25, max: 200 },
  nicotine:    { min: 1, max: 20 },
  hydration:   { min: 200, max: 1500 },
  melatonin:   { min: 0.5, max: 10 },
  venlafaxine: { min: 37.5, max: 225 },
  sertraline:  { min: 50, max: 200 },
  prazepam:    { min: 5, max: 20 },
  cyamemazine: { min: 12.5, max: 100 },
  dynabiane:   { min: 1, max: 2 },       // 1-2 gélules/jour
  omegabiane:  { min: 1, max: 3 },       // 1-3 gélules/jour
  griffonia:   { min: 50, max: 400 },    // 50-400mg (5-HTP precursor)
  valeriane:   { min: 100, max: 600 },   // 100-600mg (root extract)
  safran:      { min: 15, max: 30 },     // 15-30mg (standardized extract)
  yoga:        { min: 1, max: 60 },      // 1-60 min session
};

export function normalizeDose(substance: SubstanceKey, amount: number): number {
  const range = DOSE_RANGES[substance];
  if (!range) return 0.5;
  const t = (amount - range.min) / (range.max - range.min);
  return 0.3 + Math.max(0, Math.min(1, t)) * 1.2; // 0.3 to 1.5
}
