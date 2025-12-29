/**
 * Connectome System Manifest (Browser-safe)
 *
 * Node and edge type definitions, colors, and display tokens.
 */

// =============================================================================
// Node Types (from schema.yaml)
// =============================================================================

export type GraphNodeType = 'Actor' | 'Moment' | 'Narrative' | 'Space' | 'Thing';

export const NODE_TYPES: GraphNodeType[] = ['Actor', 'Moment', 'Narrative', 'Space', 'Thing'];

export const NODE_TYPE_COLORS: Record<GraphNodeType, string> = {
  Actor: '#f472b6',     // pink
  Moment: '#60a5fa',    // blue
  Narrative: '#a78bfa', // purple
  Space: '#4ade80',     // green
  Thing: '#fbbf24',     // amber
};

export const NODE_TYPE_DESCRIPTIONS: Record<GraphNodeType, string> = {
  Actor: 'A character, person, or entity that can take actions',
  Moment: 'A point in time or event',
  Narrative: 'A story, theme, or conceptual thread',
  Space: 'A location or environment',
  Thing: 'An object, concept, or abstract entity',
};

// =============================================================================
// Edge Types (semantic relationship types)
// =============================================================================

export type GraphEdgeType =
  | 'LINK'
  | 'CONTAINS'
  | 'RELATES_TO'
  | 'PRECEDES'
  | 'FOLLOWS'
  | 'CAUSES'
  | 'INFLUENCES';

export const EDGE_TYPES: GraphEdgeType[] = [
  'LINK',
  'CONTAINS',
  'RELATES_TO',
  'PRECEDES',
  'FOLLOWS',
  'CAUSES',
  'INFLUENCES',
];

export const EDGE_TYPE_COLORS: Record<GraphEdgeType | string, string> = {
  LINK: '#6b7280',        // gray
  CONTAINS: '#22c55e',    // green
  RELATES_TO: '#3b82f6',  // blue
  PRECEDES: '#f59e0b',    // amber
  FOLLOWS: '#f97316',     // orange
  CAUSES: '#ef4444',      // red
  INFLUENCES: '#a855f7',  // purple
};

// =============================================================================
// Trigger Types (for flow events)
// =============================================================================

export type TriggerType = 'direct' | 'stream' | 'async' | 'hook' | 'timer';

export const TRIGGER_COLORS: Record<TriggerType, string> = {
  direct: '#3b82f6',   // blue
  stream: '#22c55e',   // green
  async: '#f59e0b',    // amber
  hook: '#a855f7',     // purple
  timer: '#6b7280',    // gray
};

// =============================================================================
// Call Types (for flow events)
// =============================================================================

export type CallType = 'code' | 'graphQuery' | 'llm' | 'graphLink' | 'moment';

export const CALL_TYPE_COLORS: Record<CallType, string> = {
  code: '#6b7280',       // gray
  graphQuery: '#3b82f6', // blue
  llm: '#a855f7',        // purple
  graphLink: '#22c55e',  // green
  moment: '#f59e0b',     // amber
};

// =============================================================================
// Energy Display
// =============================================================================

export type EnergyBucket = 'low' | 'medium' | 'high' | 'critical';

export function getEnergyBucket(energy: number): EnergyBucket {
  if (energy < 0.25) return 'low';
  if (energy < 0.5) return 'medium';
  if (energy < 0.75) return 'high';
  return 'critical';
}

export const ENERGY_COLORS: Record<EnergyBucket, string> = {
  low: '#6b7280',      // gray
  medium: '#22c55e',   // green
  high: '#f59e0b',     // amber
  critical: '#ef4444', // red
};

export function formatEnergy(energy: number): string {
  return (energy * 100).toFixed(0) + '%';
}
