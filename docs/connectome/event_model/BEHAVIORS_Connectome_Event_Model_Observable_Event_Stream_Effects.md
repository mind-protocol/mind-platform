```

# event_model — Behaviors: Observable Effects of the FlowEvent Contract

STATUS: DRAFT
CREATED: 2025-12-20
VERIFIED: 2025-12-20 against ?
```

---

## CHAIN

```
PATTERNS:        ./PATTERNS_Connectome_Event_Model_Contract_And_Normalization_Patterns.md
THIS:            BEHAVIORS_Connectome_Event_Model_Observable_Event_Stream_Effects.md (you are here)
ALGORITHM:       ./ALGORITHM_Connectome_Event_Normalization_And_Rendering_Event_Synthesis.md
VALIDATION:      ./VALIDATION_Connectome_Event_Model_Invariants_And_Error_Conditions.md
IMPLEMENTATION:  ./IMPLEMENTATION_Connectome_Event_Model_Code_Architecture_And_Schema.md
HEALTH:          ./HEALTH_Connectome_Event_Model_Runtime_Verification_And_Signal_Coverage.md
SYNC:            ./SYNC_Connectome_Event_Model_Sync_Current_State.md

IMPL:            ? (planned TypeScript module under /connectome)
```

> **Contract:** Read docs before modifying. After changes: update IMPL or add TODO to SYNC. Run health.

---

## BEHAVIORS

### B1: Stepper and realtime produce the same visual semantics

```
GIVEN:  A step is released by the stepper OR an SSE payload is received
WHEN:   The input is normalized into a FlowEvent
THEN:   The UI can render the same edge styling, node highlighting, and log formatting
AND:    The log entry is copy/export identical (modulo timestamps)
```

### B2: Unclear data becomes explicit, never silently dropped

```
GIVEN:  A missing or unknown field is encountered (event name, endpoint, duration, rate)
WHEN:   The normalization runs
THEN:   The normalized event includes `notes="?"` (or field value "?") rather than omitting the event
AND:    The UI shows a visible “?” marker in hover or log
```

### B3: Duration is always meaningful to the user

```
GIVEN:  An event duration is declared or measured
WHEN:   The log is rendered
THEN:   The duration is displayed with a stable unit rule (ms vs s)
AND:    The duration is color-coded by thresholds (ms blue; <1s green; <2s yellow; <3s orange; else red)
```

### B4: Trigger type drives both diagram styling and log styling

```
GIVEN:  A FlowEvent has trigger in {direct, stream, async, hook, timer}
WHEN:   The event is rendered
THEN:   The edge dash style matches trigger semantics (solid/dotted/dashed)
AND:    The log includes a trigger badge colored per trigger type
```

### B5: Schema evolution does not break existing renderers

```
GIVEN:  A new optional field is added to FlowEvent
WHEN:   Older code consumes it
THEN:   Rendering and logging remain correct using existing required fields
AND:    Unknown fields are ignored without data loss (raw payload can retain them)
```

---

## INPUTS / OUTPUTS

### Primary Function: `normalize_flow_event(raw)`

**Inputs:**

| Parameter        | Type      | Description                                                   |
| ---------------- | --------- | ------------------------------------------------------------- |
| `raw`            | `unknown` | Any input event (stepper definition, SSE payload, timer tick) |
| `source`         | `enum`    | `stepper` | `sse` | `derived`                                 |
| `received_at_ms` | `number`  | Local receipt time (monotonic preferred)                      |

**Outputs:**

| Return  | Type        | Description                                |
| ------- | ----------- | ------------------------------------------ |
| `event` | `FlowEvent` | Normalized event object with strict schema |

**Side Effects:**

* None required (pure transform). Storage happens in `state_store`.

---

## EDGE CASES

### E1: Missing node ids

```
GIVEN:  raw event lacks from/to node ids
THEN:   normalize_flow_event returns event with from="?" or to="?"
AND:    validation marks it as WARN/ERROR (depending on policy)
```

### E2: Negative or zero durations

```
GIVEN:  duration_ms <= 0
THEN:   duration_ms is clamped to minimum 200ms for animation
AND:    original value is preserved in notes/raw payload if available
```

---

## ANTI-BEHAVIORS

What should NOT happen:

### A1: Presentation logic re-implements normalization

```
GIVEN:   UI needs a label, color, or dash style
WHEN:    UI code tries to infer it from arbitrary payload fields
MUST NOT: Duplicate normalization logic in rendering
INSTEAD: Use normalized callType/trigger/label fields from FlowEvent
```

### A2: Dropping events because they are “unknown”

```
GIVEN:   an unrecognized SSE event name is received
WHEN:    normalization runs
MUST NOT: discard the event
INSTEAD: map it to callType="code" trigger="stream" with notes="?" and preserve raw payload
```

---

## MARKERS

* [ ] Confirm whether we need `parent_event_id` for causal tracing in V1 (nice-to-have).
* QUESTION: Do we treat “graph link energy flow” as callType=graphLink or as a derived visualization event?
* IDEA: Provide a “strict mode” toggle that fails hard on schema violations (agent debugging).

---
