# Moment Graph Engine — HEALTH: Connectome Live Signals

```
STATUS: DRAFT
CREATED: 2025-12-21
```
---

## PURPOSE

Provide live, low-cost health signals for the moment-graph runtime and the “field” mechanics
(Attention Split, PRIMES, Contradiction Pressure) without modifying hot-path logic.

This HEALTH layer is **diagnostic, not corrective**:
- It must never mutate canon state.
- It must be O(1) per tick on the hot path (read-only taps).
- It must be throttleable and safe in production.

---

## CHAIN

```
OBJECTIVES:      ./OBJECTIVES_Connectome_Health.md
PATTERNS:        ../../physics/attention/PATTERNS_Attention_Energy_Split.md
                 ../../mind/membrane/PATTERNS_Membrane_Modulation.md
                 ../../mind/membrane/PATTERNS_Membrane_Scoping.md
BEHAVIORS:       ../../physics/attention/BEHAVIORS_Attention_Split_And_Interrupts.md
MECHANISMS:      ../../physics/mechanisms/MECHANISMS_Attention_Energy_Split.md
                 ../../physics/mechanisms/MECHANISMS_Primes_Lag_Decay.md
                 ../../physics/mechanisms/MECHANISMS_Contradiction_Pressure.md
VALIDATION:      ../../physics/attention/VALIDATION_Attention_Split_And_Interrupts.md
THIS:            HEALTH_Connectome_Live_Signals.md
IMPL:            ../../../app/connectome/components/connectome_health_panel.tsx
                 ../../../app/connectome/components/connectome_page_shell_route_layout_and_control_surface.tsx
```

---

## FLOWS ANALYSIS (TRIGGERS + FREQUENCY)

```yaml
flows_analysis:
  - flow_id: tick_physics_and_attention
    purpose: "Detect drift/plateau, interrupt correctness, and query-write violations without slowing traversal."
    triggers:
      - type: schedule
        source: mind/physics/tick.py:tick
        notes: "Runs on every tick; HEALTH must be sampled/throttled."
    frequency:
      expected_rate: "1-10/sec (depends on runner speed)"
      peak_rate: "50/sec (x3 fast runner)"
      burst_behavior: "Runner accelerates until interrupt; HEALTH must downsample in x3."
    risks:
      - "Hidden canon mutation in queries"
      - "Over/under modulation (plateau or churn)"
      - "Async job applying stale outputs"
    notes: "Signals should be computed from already-available tick diagnostics."
```

---

## HEALTH INDICATORS SELECTED

```yaml
health_indicators:
  - name: query_write_attempts
    flow_id: tick_physics_and_attention
    priority: high
    rationale: "Hard invariant: queries must be read-only; violations destroy replayability."
  - name: interrupt_reason_stream
    flow_id: tick_physics_and_attention
    priority: high
    rationale: "Ensures acceleration stops for the right reasons (spoken / focus reconfig)."
  - name: attention_sink_stats
    flow_id: tick_physics_and_attention
    priority: med
    rationale: "Detect neighborhood explosion (too many sinks) or starvation (too few)."
  - name: focus_reconfig_rate
    flow_id: tick_physics_and_attention
    priority: med
    rationale: "Detect churn vs plateau; enables tuning."
  - name: contradiction_pressure
    flow_id: tick_physics_and_attention
    priority: med
    rationale: "Verify alternatives remain alive and pressure is local/bounded."
  - name: async_epoch_mismatch
    flow_id: tick_physics_and_attention
    priority: med
    rationale: "Detect stale async outputs applying after the world moved on."
  - name: dmz_violation_attempts
    flow_id: tick_physics_and_attention
   priority: high
    rationale: "WorldBuilder must not mutate player-neighborhood; prevents ‘world shifts under player’."
```

---

## STATUS (RESULT INDICATOR)

```yaml
status:
  stream_destination: sse:connectome_health  # consumed by Connectome page
  result:
    representation: tuple
    value: {state: OK, score: 0.92}
    updated_at: 2025-12-21T00:00:00Z
    source: connectome_health_aggregate
```

---

## INDICATOR: query_write_attempts

### VALUE TO CLIENTS & VALIDATION MAPPING

```yaml
value_and_validation:
  indicator: query_write_attempts
  client_value: "Guarantees replayability and prevents hidden narrators caused by read-order side-effects."
  validation:
    - validation_id: V1
      criteria: "GraphQueries are read-only; no canon mutation during queries."
```

### HEALTH REPRESENTATION

```yaml
representation:
  selected: [enum, float_0_1]
  semantics:
    enum: "OK if 0, ERROR if >0"
    float_0_1: "1.0 if 0 attempts, else 0.0"
  aggregation:
    method: "Hard-fail"
    display: "enum"
```

### MECHANISM (TAP)

Increment a counter when any GraphOps write method is called while a “query context” flag is set.

### THROTTLING STRATEGY

```yaml
throttling:
  trigger: tick
  max_frequency: 2/sec
  burst_limit: 10
  backoff: "exponential"
```

---

## INDICATOR: interrupt_reason_stream

Maps to VALIDATION V4.

Signal:
- last interrupt reason (spoken | active_changed | active_deactivated | contradicts_visible)
- rates over last N seconds
- current runner speed (pause/x1/x2/x3)

---

## INDICATOR: attention_sink_stats

Maps to VALIDATION V3.

Signal:
- sink_set_size (p50/p95)
- top_3 sinks by mass/alloc (debug)
- neighborhood size (nodes, edges)

---

## INDICATOR: focus_reconfig_rate

Signal:
- interrupts per minute
- focus changes per minute
- “plateau” heuristic: no focus change AND no spoken for >T seconds (diagnostic only)

---

## INDICATOR: contradiction_pressure

Signal:
- pressure_value in [0,1] per place/player
- top contradiction edges contributing (debug)

---

## INDICATOR: async_epoch_mismatch

Signal:
- count of async results dropped due to epoch mismatch
- last mismatch job type (fox/worldbuilder)

---

## INDICATOR: dmz_violation_attempts

Signal:
- count of attempted writes inside DMZ neighborhood
- last offending writer (worldbuilder/agent)

---

## HOW TO RUN (MANUAL)

```bash
python -m engine.health.connectome_health --once --playthrough {id} --place {place_id}
```

---

## DISPLAY (CONNECTOME PAGE)

Show a compact panel:
- Overall status (OK/WARN/ERROR)
- Runner speed + last interrupt reason
- Sink set size (p50/p95) + churn/plateau meter
- Contradiction pressure gauge
- Counters: query writes (hard), DMZ violations (hard), async mismatches (warn)
