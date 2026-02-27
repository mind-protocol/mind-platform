import { describe, it, expect, beforeEach } from 'vitest';
import { useConnectomeStore } from '@/app/[locale]/connectome/lib/zustand_connectome_state_store_with_atomic_commit_actions';
import type { FlowEvent, PlaybackMode, PlaybackSpeed } from '@/app/[locale]/connectome/lib/zustand_connectome_state_store_with_atomic_commit_actions';

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

describe('ConnectomeStore', () => {
  beforeEach(() => {
    resetStore();
  });

  describe('basic setters', () => {
    it('setNodes updates nodes', () => {
      const nodes = [{ id: 'n1' }, { id: 'n2' }];
      useConnectomeStore.getState().setNodes(nodes);
      expect(useConnectomeStore.getState().nodes).toEqual(nodes);
    });

    it('setLinks updates links', () => {
      const links = [{ id: 'e1' }];
      useConnectomeStore.getState().setLinks(links);
      expect(useConnectomeStore.getState().links).toEqual(links);
    });

    it('setMode updates mode', () => {
      useConnectomeStore.getState().setMode('realtime');
      expect(useConnectomeStore.getState().mode).toBe('realtime');
    });

    it('setSpeed updates speed and tick_display', () => {
      useConnectomeStore.getState().setSpeed('2x');
      const state = useConnectomeStore.getState();
      expect(state.speed).toBe('2x');
      expect(state.tick_display.speed_label).toBe('2x');
      expect(state.tick_display.nominal_interval_ms).toBe(500);
    });

    it('setSpeed pause sets nominal_interval_ms to null', () => {
      useConnectomeStore.getState().setSpeed('pause');
      expect(useConnectomeStore.getState().tick_display.nominal_interval_ms).toBeNull();
    });

    it('setLocalPause updates local_pause', () => {
      useConnectomeStore.getState().setLocalPause(true);
      expect(useConnectomeStore.getState().local_pause).toBe(true);
    });
  });

  describe('commitStepRelease', () => {
    it('appends event to ledger and advances cursor', () => {
      const event: FlowEvent = { type: 'test', timestamp: Date.now(), payload: {} };
      useConnectomeStore.getState().commitStepRelease(
        event,
        { node_id: 'n1' },
        { sentence: 'Test step' },
      );

      const state = useConnectomeStore.getState();
      expect(state.ledger).toHaveLength(1);
      expect(state.cursor).toBe(1);
      expect(state.active_focus.node_id).toBe('n1');
      expect(state.active_focus.step_key).toBe('step_1');
      expect(state.current_explanation.sentence).toBe('Test step');
    });

    it('preserves existing focus when partial update', () => {
      useConnectomeStore.getState().commitStepRelease(
        { type: 'test', timestamp: 0, payload: {} },
        { node_id: 'n1', edge_id: 'e1' },
        { sentence: 'First' },
      );
      useConnectomeStore.getState().commitStepRelease(
        { type: 'test', timestamp: 1, payload: {} },
        { node_id: 'n2' },
        { sentence: 'Second' },
      );

      const state = useConnectomeStore.getState();
      expect(state.active_focus.node_id).toBe('n2');
      expect(state.active_focus.edge_id).toBe('e1'); // preserved from first
    });
  });

  describe('appendRealtimeEvent', () => {
    it('appends event and increments cursor', () => {
      const event: FlowEvent = {
        type: 'traversal_step',
        timestamp: Date.now(),
        payload: { to_node: 'n1', via_link: 'e1' },
      };
      useConnectomeStore.getState().appendRealtimeEvent(event);

      const state = useConnectomeStore.getState();
      expect(state.ledger).toHaveLength(1);
      expect(state.cursor).toBe(1);
      expect(state.active_focus.node_id).toBe('n1');
    });

    it('trims ledger beyond MAX_RETENTION', () => {
      // Pre-fill with 1000 events
      const events: FlowEvent[] = Array.from({ length: 1000 }, (_, i) => ({
        type: 'tick',
        timestamp: i,
        payload: {},
      }));
      useConnectomeStore.setState({ ledger: events, cursor: 1000 });

      // Add one more
      useConnectomeStore.getState().appendRealtimeEvent(
        { type: 'tick', timestamp: 1000, payload: {} },
      );

      expect(useConnectomeStore.getState().ledger).toHaveLength(1000);
    });

    it('skips focus update when updateFocus is false', () => {
      useConnectomeStore.getState().appendRealtimeEvent(
        { type: 'traversal_step', timestamp: 0, payload: { to_node: 'n1' } },
        false,
      );
      expect(useConnectomeStore.getState().active_focus.node_id).toBeNull();
    });
  });

  describe('loadScript', () => {
    it('loads events and resets cursor', () => {
      const events: FlowEvent[] = [
        { type: 'a', timestamp: 0, payload: {} },
        { type: 'b', timestamp: 1, payload: {} },
      ];
      useConnectomeStore.getState().loadScript(events);

      const state = useConnectomeStore.getState();
      expect(state.script).toHaveLength(2);
      expect(state.script_total).toBe(2);
      expect(state.cursor).toBe(0);
      expect(state.ledger).toHaveLength(0);
    });
  });

  describe('advanceCursor', () => {
    it('returns false when no script events remain', () => {
      const result = useConnectomeStore.getState().advanceCursor();
      expect(result).toBe(false);
    });

    it('advances through script events', () => {
      useConnectomeStore.getState().loadScript([
        { type: 'traversal_step', timestamp: 0, payload: { to_node: 'n1' } },
        { type: 'energy_pulse', timestamp: 1, payload: { node_id: 'n2' } },
      ]);

      const first = useConnectomeStore.getState().advanceCursor();
      expect(first).toBe(true);
      expect(useConnectomeStore.getState().cursor).toBe(1);

      const second = useConnectomeStore.getState().advanceCursor();
      expect(second).toBe(true);
      expect(useConnectomeStore.getState().cursor).toBe(2);

      const third = useConnectomeStore.getState().advanceCursor();
      expect(third).toBe(false);
    });
  });

  describe('restartSession', () => {
    it('resets cursor and generates new session_id', () => {
      const oldId = useConnectomeStore.getState().session_id;
      useConnectomeStore.getState().commitStepRelease(
        { type: 'test', timestamp: 0, payload: {} },
        {},
        { sentence: 'test' },
      );
      useConnectomeStore.getState().restartSession();

      const state = useConnectomeStore.getState();
      expect(state.session_id).not.toBe(oldId);
      expect(state.cursor).toBe(0);
      expect(state.ledger).toHaveLength(0);
    });

    it('preserves ledger when clearLedger is false', () => {
      useConnectomeStore.getState().commitStepRelease(
        { type: 'test', timestamp: 0, payload: {} },
        {},
        { sentence: 'test' },
      );
      useConnectomeStore.getState().restartSession(false);
      expect(useConnectomeStore.getState().ledger).toHaveLength(1);
    });
  });

  describe('health and telemetry', () => {
    it('setHealthBadge adds a badge', () => {
      useConnectomeStore.getState().setHealthBadge('db', { status: 'OK', tooltip: 'Connected' });
      expect(useConnectomeStore.getState().health_badges.db).toEqual({
        status: 'OK',
        tooltip: 'Connected',
      });
    });

    it('set_connectome_health updates health', () => {
      const health = { node_count: 10, link_count: 5, total_energy: 3.5, active_subentities: 2 };
      useConnectomeStore.getState().set_connectome_health(health);
      expect(useConnectomeStore.getState().connectome_health).toEqual(health);
    });

    it('set_telemetry_status updates status', () => {
      useConnectomeStore.getState().set_telemetry_status('connected');
      expect(useConnectomeStore.getState().telemetry_status).toBe('connected');
    });
  });

  describe('graph management', () => {
    it('set_graph_name updates graph_name', () => {
      useConnectomeStore.getState().set_graph_name('test_graph');
      expect(useConnectomeStore.getState().graph_name).toBe('test_graph');
    });

    it('set_available_graphs updates list', () => {
      useConnectomeStore.getState().set_available_graphs(['a', 'b', 'c']);
      expect(useConnectomeStore.getState().available_graphs).toEqual(['a', 'b', 'c']);
    });
  });

  describe('search', () => {
    it('set_search_results stores results', () => {
      const results = {
        query: 'test',
        threshold: 0.3,
        hops: 1,
        matches: [{ id: 'n1', similarity: 0.9 }],
        nodes: [],
        links: [],
      };
      useConnectomeStore.getState().set_search_results(results);
      expect(useConnectomeStore.getState().search_results).toEqual(results);
    });

    it('reveal_node_and_edge_ids updates revealed sets', () => {
      useConnectomeStore.getState().reveal_node_and_edge_ids(['n1', 'n2'], ['e1']);
      const state = useConnectomeStore.getState();
      expect(state.revealed_node_ids).toEqual(['n1', 'n2']);
      expect(state.revealed_edge_ids).toEqual(['e1']);
    });
  });

  describe('getCurrentEvent', () => {
    it('returns null when ledger is empty', () => {
      expect(useConnectomeStore.getState().getCurrentEvent()).toBeNull();
    });

    it('returns last event in ledger', () => {
      useConnectomeStore.getState().commitStepRelease(
        { type: 'first', timestamp: 0, payload: {} },
        {},
        { sentence: '' },
      );
      useConnectomeStore.getState().commitStepRelease(
        { type: 'second', timestamp: 1, payload: {} },
        {},
        { sentence: '' },
      );
      const event = useConnectomeStore.getState().getCurrentEvent();
      expect(event?.type).toBe('second');
    });
  });

  describe('getProgress', () => {
    it('returns cursor and total', () => {
      useConnectomeStore.getState().loadScript([
        { type: 'a', timestamp: 0, payload: {} },
        { type: 'b', timestamp: 1, payload: {} },
        { type: 'c', timestamp: 2, payload: {} },
      ]);
      useConnectomeStore.getState().advanceCursor();

      const progress = useConnectomeStore.getState().getProgress();
      expect(progress.current).toBe(1);
      expect(progress.total).toBe(3);
    });
  });
});
