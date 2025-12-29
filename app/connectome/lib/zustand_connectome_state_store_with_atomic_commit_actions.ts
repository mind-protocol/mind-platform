/**
 * Connectome State Store (Browser-safe)
 *
 * Zustand store for Connectome UI state.
 * Inlined to avoid importing Node.js modules from mind-mcp.
 */

import { create } from 'zustand';

// =============================================================================
// Types
// =============================================================================

export type PlaybackMode = 'stepper' | 'realtime';
export type PlaybackSpeed = 'pause' | '1x' | '2x' | '3x';

export interface ActiveFocus {
  node_id: string | null;
  edge_id: string | null;
  step_key: string | null;
  active_node_id?: string | null;
  active_edge_id?: string | null;
}

export interface CurrentExplanation {
  sentence: string;
  notes: string | null;
}

export interface WaitProgress {
  started_at_ms: number | null;
  stopped_at_ms: number | null;
  max_seconds: number;
}

export interface TickDisplay {
  nominal_interval_ms: number | null;
  progress_0_1: number;
  speed_label: string;
}

export type HealthStatus = 'OK' | 'WARN' | 'ERROR' | 'UNKNOWN';

export interface HealthBadge {
  status: HealthStatus;
  tooltip: string;
}

export type TelemetryStatus = 'connecting' | 'connected' | 'disconnected' | 'error';

export interface ConnectomeHealth {
  node_count: number;
  link_count: number;
  total_energy: number;
  active_subentities: number;
}

export interface SearchResults {
  query: string;
  threshold: number;
  hops: number;
  matches: Array<{ id: string; similarity: number }>;
  nodes: any[];
  links: any[];
}

export interface FlowEvent {
  type: string;
  timestamp: number;
  payload: unknown;
}

// =============================================================================
// Store State
// =============================================================================

export interface ConnectomeStoreState {
  session_id: string;
  nodes: any[];
  links: any[];
  mode: PlaybackMode;
  speed: PlaybackSpeed;
  local_pause: boolean;
  cursor: number;
  ledger: FlowEvent[];
  active_focus: ActiveFocus;
  current_explanation: CurrentExplanation;
  wait_progress: WaitProgress;
  tick_display: TickDisplay;
  health_badges: Record<string, HealthBadge>;
  connectome_health: ConnectomeHealth | null;
  script: FlowEvent[];
  script_total: number;
  telemetry_status: TelemetryStatus;
  graph_name: string;
  available_graphs: string[];
  search_results: SearchResults | null;
  revealed_node_ids: string[];
  revealed_edge_ids: string[];
}

// =============================================================================
// Store Actions
// =============================================================================

export interface ConnectomeStoreActions {
  setNodes: (nodes: any[]) => void;
  setLinks: (links: any[]) => void;
  setMode: (mode: PlaybackMode) => void;
  setSpeed: (speed: PlaybackSpeed) => void;
  setLocalPause: (paused: boolean) => void;
  commitStepRelease: (
    event: FlowEvent,
    focus: Partial<ActiveFocus>,
    explanation: Partial<CurrentExplanation>
  ) => void;
  appendRealtimeEvent: (event: FlowEvent, updateFocus?: boolean) => void;
  loadScript: (events: FlowEvent[]) => void;
  advanceCursor: () => boolean;
  restartSession: (clearLedger?: boolean) => void;
  setHealthBadge: (key: string, badge: HealthBadge) => void;
  set_connectome_health: (health: ConnectomeHealth) => void;
  set_telemetry_status: (status: TelemetryStatus) => void;
  set_graph_name: (name: string) => void;
  set_available_graphs: (graphs: string[]) => void;
  set_search_results: (results: SearchResults) => void;
  reveal_node_and_edge_ids: (nodeIds: string[], edgeIds: string[]) => void;
  getCurrentEvent: () => FlowEvent | null;
  getProgress: () => { current: number; total: number };
}

// =============================================================================
// Initial State
// =============================================================================

const generateSessionId = () => `session_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

const initialState: ConnectomeStoreState = {
  session_id: generateSessionId(),
  nodes: [],
  links: [],
  mode: 'stepper',
  speed: 'pause',
  local_pause: false,
  cursor: 0,
  ledger: [],
  active_focus: {
    node_id: null,
    edge_id: null,
    step_key: null,
    active_node_id: null,
    active_edge_id: null,
  },
  current_explanation: {
    sentence: '',
    notes: null,
  },
  wait_progress: {
    started_at_ms: null,
    stopped_at_ms: null,
    max_seconds: 4.0,
  },
  tick_display: {
    nominal_interval_ms: null,
    progress_0_1: 0,
    speed_label: 'pause',
  },
  health_badges: {},
  connectome_health: null,
  script: [],
  script_total: 0,
  telemetry_status: 'disconnected',
  graph_name: 'seed',
  available_graphs: [],
  search_results: null,
  revealed_node_ids: [],
  revealed_edge_ids: [],
};

// =============================================================================
// Helpers
// =============================================================================

function speedToMs(speed: PlaybackSpeed): number | null {
  switch (speed) {
    case 'pause': return null;
    case '1x': return 1000;
    case '2x': return 500;
    case '3x': return 333;
    default: return null;
  }
}

function extractFocusFromEvent(event: FlowEvent): Partial<ActiveFocus> {
  if (event.type === 'traversal_step') {
    const payload = event.payload as { to_node?: string; via_link?: string };
    return {
      node_id: payload.to_node || null,
      edge_id: payload.via_link || null,
    };
  }
  if (event.type === 'energy_pulse') {
    const payload = event.payload as { node_id?: string };
    return {
      node_id: payload.node_id || null,
    };
  }
  return {};
}

function extractExplanationFromEvent(event: FlowEvent): string {
  switch (event.type) {
    case 'traversal_step':
      return `Traversed to ${(event.payload as { to_node?: string })?.to_node}`;
    case 'energy_pulse':
      return `Energy pulse at ${(event.payload as { node_id?: string })?.node_id}`;
    case 'node_created':
      return 'Node created';
    case 'link_created':
      return 'Link created';
    default:
      return event.type;
  }
}

// =============================================================================
// Store
// =============================================================================

export type ConnectomeStore = ConnectomeStoreState & ConnectomeStoreActions;

export const useConnectomeStore = create<ConnectomeStore>((set, get) => ({
  ...initialState,

  setNodes: (nodes) => set({ nodes }),
  setLinks: (links) => set({ links }),

  setMode: (mode) => set({ mode }),
  setSpeed: (speed) => set((state) => ({
    speed,
    tick_display: {
      ...state.tick_display,
      speed_label: speed,
      nominal_interval_ms: speedToMs(speed),
    },
  })),
  setLocalPause: (local_pause) => set({ local_pause }),

  commitStepRelease: (event, focus, explanation) => set((state) => {
    const newNodeId = focus.node_id ?? state.active_focus.node_id;
    const newEdgeId = focus.edge_id ?? state.active_focus.edge_id;
    return {
      ledger: [...state.ledger, event],
      cursor: state.cursor + 1,
      active_focus: {
        ...state.active_focus,
        ...focus,
        step_key: `step_${state.cursor + 1}`,
        active_node_id: newNodeId,
        active_edge_id: newEdgeId,
      },
      current_explanation: {
        ...state.current_explanation,
        ...explanation,
      },
      wait_progress: {
        ...state.wait_progress,
        started_at_ms: Date.now(),
        stopped_at_ms: null,
      },
    };
  }),

  appendRealtimeEvent: (event, updateFocus = true) => set((state) => {
    const newLedger = [...state.ledger, event];
    const MAX_RETENTION = 1000;
    const trimmedLedger = newLedger.length > MAX_RETENTION
      ? newLedger.slice(-MAX_RETENTION)
      : newLedger;

    return {
      ledger: trimmedLedger,
      cursor: state.cursor + 1,
      ...(updateFocus && event.type === 'traversal_step' ? {
        active_focus: {
          node_id: (event.payload as { to_node?: string })?.to_node || null,
          edge_id: (event.payload as { via_link?: string })?.via_link || null,
          step_key: `realtime_${state.cursor + 1}`,
        },
      } : {}),
    };
  }),

  loadScript: (events) => set({
    script: events,
    script_total: events.length,
    cursor: 0,
    ledger: [],
  }),

  advanceCursor: () => {
    const state = get();
    if (state.cursor >= state.script.length) {
      return false;
    }
    const event = state.script[state.cursor];
    get().commitStepRelease(
      event,
      extractFocusFromEvent(event),
      { sentence: extractExplanationFromEvent(event) }
    );
    return true;
  },

  restartSession: (clearLedger = true) => set((state) => ({
    session_id: generateSessionId(),
    cursor: 0,
    ledger: clearLedger ? [] : state.ledger,
    active_focus: initialState.active_focus,
    current_explanation: initialState.current_explanation,
    wait_progress: initialState.wait_progress,
  })),

  setHealthBadge: (key, badge) => set((state) => ({
    health_badges: {
      ...state.health_badges,
      [key]: badge,
    },
  })),
  set_connectome_health: (health) => set({ connectome_health: health }),
  set_telemetry_status: (status) => set({ telemetry_status: status }),
  set_graph_name: (name) => set({ graph_name: name }),
  set_available_graphs: (graphs) => set({ available_graphs: graphs }),
  set_search_results: (results) => set({ search_results: results }),
  reveal_node_and_edge_ids: (nodeIds, edgeIds) => set({
    revealed_node_ids: nodeIds,
    revealed_edge_ids: edgeIds,
  }),

  getCurrentEvent: () => {
    const state = get();
    if (state.ledger.length === 0) return null;
    return state.ledger[state.ledger.length - 1];
  },

  getProgress: () => {
    const state = get();
    return {
      current: state.cursor,
      total: state.script_total || state.ledger.length,
    };
  },
}));
