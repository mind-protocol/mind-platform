/**
 * Browser-safe Runtime Engine
 *
 * Uses fetch to call Next.js API endpoints instead of Node.js adapters.
 * Server-side adapters (LocalAdapter) are used by API routes, not browser code.
 */

import { useConnectomeStore } from './zustand_connectome_state_store_with_atomic_commit_actions';

// Runtime command types
export type RuntimeCommand =
  | { kind: 'next_step' }
  | { kind: 'restart' }
  | { kind: 'set_speed'; payload: { speed: 'pause' | '1x' | '2x' | '3x' } }
  | { kind: 'set_mode'; payload: { mode: 'stepper' | 'realtime' } };

export type RuntimeReleaseStatus = 'released' | 'blocked' | 'end_of_script';

export interface RuntimeReleaseResult {
  status: RuntimeReleaseStatus;
  notes: string;
}

// Engine state
let _initialized = false;
let _scriptCursor = 0;
let _script: any[] = [];

/**
 * Initialize the connectome runtime (browser-safe)
 */
export function initialize_connectome_runtime(): void {
  if (_initialized) return;
  _initialized = true;
  _scriptCursor = 0;
  _script = [];
}

/**
 * Dispatch a runtime command
 */
export async function dispatch_runtime_command(cmd: RuntimeCommand): Promise<RuntimeReleaseResult> {
  if (!_initialized) {
    initialize_connectome_runtime();
  }

  const store = useConnectomeStore.getState();

  switch (cmd.kind) {
    case 'next_step':
      return releaseNextStep();

    case 'restart':
      _scriptCursor = 0;
      store.restartSession(true);
      return { status: 'released', notes: 'Restarted' };

    case 'set_speed':
      store.setSpeed(cmd.payload.speed);
      return { status: 'released', notes: `Speed: ${cmd.payload.speed}` };

    case 'set_mode':
      store.setMode(cmd.payload.mode);
      return { status: 'released', notes: `Mode: ${cmd.payload.mode}` };

    default:
      return { status: 'blocked', notes: 'Unknown command' };
  }
}

/**
 * Release next step - calls API to get next event
 */
async function releaseNextStep(): Promise<RuntimeReleaseResult> {
  const store = useConnectomeStore.getState();
  const graphName = store.graph_name;

  try {
    const response = await fetch(`/api/connectome/tick?graph=${encodeURIComponent(graphName)}`);
    const payload = await response.json();

    if (!response.ok) {
      return {
        status: 'blocked',
        notes: payload?.error ?? 'Tick failed',
      };
    }

    if (payload.status === 'end_of_script') {
      return { status: 'end_of_script', notes: 'No more events' };
    }

    // If the API returned event data, commit it
    if (payload.event) {
      store.commitStepRelease(
        payload.event,
        payload.focus ?? {},
        { sentence: payload.notes ?? 'Step complete' }
      );
    }

    return {
      status: 'released',
      notes: payload.notes ?? 'Step complete',
    };
  } catch (error: any) {
    return {
      status: 'blocked',
      notes: error?.message ?? 'Network error',
    };
  }
}

/**
 * Release next step (alias for backwards compatibility)
 */
export async function release_next_step(): Promise<RuntimeReleaseResult> {
  return releaseNextStep();
}
