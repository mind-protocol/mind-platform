import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  initialize_connectome_runtime,
  dispatch_runtime_command,
} from '@/app/connectome/lib/next_step_gate_and_realtime_playback_runtime_engine';
import { useConnectomeStore } from '@/app/connectome/lib/zustand_connectome_state_store_with_atomic_commit_actions';

// Mock global fetch
const mockFetch = vi.fn();
vi.stubGlobal('fetch', mockFetch);

function resetStore() {
  useConnectomeStore.setState({
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
    current_explanation: { sentence: '', notes: null },
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
  });
}

describe('Runtime Engine', () => {
  beforeEach(() => {
    resetStore();
    mockFetch.mockReset();
  });

  describe('dispatch_runtime_command', () => {
    it('restart resets session', async () => {
      useConnectomeStore.getState().commitStepRelease(
        { type: 'test', timestamp: 0, payload: {} },
        {},
        { sentence: 'test' },
      );

      const result = await dispatch_runtime_command({ kind: 'restart' });
      expect(result.status).toBe('released');
      expect(result.notes).toBe('Restarted');
      expect(useConnectomeStore.getState().cursor).toBe(0);
    });

    it('set_speed updates store speed', async () => {
      const result = await dispatch_runtime_command({
        kind: 'set_speed',
        payload: { speed: '3x' },
      });
      expect(result.status).toBe('released');
      expect(useConnectomeStore.getState().speed).toBe('3x');
    });

    it('set_mode updates store mode', async () => {
      const result = await dispatch_runtime_command({
        kind: 'set_mode',
        payload: { mode: 'realtime' },
      });
      expect(result.status).toBe('released');
      expect(useConnectomeStore.getState().mode).toBe('realtime');
    });

    it('next_step calls tick API', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ status: 'end_of_script', notes: 'No more events' }),
      });

      const result = await dispatch_runtime_command({ kind: 'next_step' });
      expect(result.status).toBe('end_of_script');
      expect(mockFetch).toHaveBeenCalledWith('/api/connectome/tick?graph=seed');
    });

    it('next_step commits event when API returns one', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          status: 'released',
          event: { type: 'traversal_step', timestamp: 123, payload: { to_node: 'n1' } },
          focus: { node_id: 'n1' },
          notes: 'Traversed',
        }),
      });

      const result = await dispatch_runtime_command({ kind: 'next_step' });
      expect(result.status).toBe('released');
      expect(useConnectomeStore.getState().ledger).toHaveLength(1);
    });

    it('next_step returns blocked on API error', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        json: async () => ({ error: 'Server down' }),
      });

      const result = await dispatch_runtime_command({ kind: 'next_step' });
      expect(result.status).toBe('blocked');
      expect(result.notes).toBe('Server down');
    });

    it('next_step returns blocked on network error', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network failure'));

      const result = await dispatch_runtime_command({ kind: 'next_step' });
      expect(result.status).toBe('blocked');
      expect(result.notes).toBe('Network failure');
    });
  });
});
