// Knowledge Graph types shared across components

export interface GraphNode {
  id: string;
  name: string;
  labels: string[];
  description?: string;
  properties?: Record<string, unknown>;
  link_count?: number;
  // D3 simulation adds these at runtime
  x?: number;
  y?: number;
  fx?: number | null;
  fy?: number | null;
}

export interface GraphLink {
  source: string | GraphNode;
  target: string | GraphNode;
  type?: string;
}

export interface GraphStats {
  total_nodes: number;
  total_links: number;
  by_label: Record<string, number>;
  by_graph: Record<string, number>;
  graphs?: string[];
}

export interface NodeDetail {
  node: GraphNode;
  neighbors: Neighbor[];
}

export interface Neighbor {
  id: string;
  name: string;
  relation: string;
  labels?: string[];
}

export const LABEL_COLORS: Record<string, string> = {
  Realization: '#f7768e',
  Principle: '#9ece6a',
  Mechanism: '#7aa2f7',
  Best_Practice: '#7dcfff',
  Behavior: '#bb9af7',
  Anti_Pattern: '#ff9e64',
  Process: '#e0af68',
  Concept: '#7aa2f7',
  Decision: '#f7768e',
  Pattern: '#9ece6a',
  Milestone: '#4ade80',
  Coping_Mechanism: '#bb9af7',
  Wound: '#f87171',
  Trigger: '#f59e0b',
  U3_Pattern: '#73daca',
  U4_Event: '#89ddff',
  U4_Goal: '#c0caf5',
  Metric: '#a9b1d6',
  default: '#555555',
};

/** Schema labels to exclude from filter dropdowns */
export const SCHEMA_LABELS = [
  'SubEntity',
  'FieldSchema',
  'LinkTypeSchema',
  'NodeTypeSchema',
  'UniversalNodeField',
  'UniversalLinkField',
  'UniversalNodeCategory',
  'UniversalLinkCategory',
  'NodeType',
  'NodeTypeName',
];

export function getNodeColor(node: GraphNode): string {
  for (const label of node.labels || []) {
    if (LABEL_COLORS[label]) return LABEL_COLORS[label];
  }
  return LABEL_COLORS.default;
}

export function getNodeRadius(node: GraphNode): number {
  const count = node.link_count || 0;
  return Math.max(4, Math.min(16, 5 + count * 0.8));
}
