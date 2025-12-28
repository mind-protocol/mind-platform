```

# event_model — Algorithm: Normalizing Inputs into FlowEvents

STATUS: DRAFT
CREATED: 2025-12-20
VERIFIED: 2025-12-20 against ?
```

---

## CHAIN

```
PATTERNS:        ./PATTERNS_Connectome_Event_Model_Contract_And_Normalization_Patterns.md
BEHAVIORS:       ./BEHAVIORS_Connectome_Event_Model_Observable_Event_Stream_Effects.md
THIS:            ALGORITHM_Connectome_Event_Normalization_And_Rendering_Event_Synthesis.md (you are here)
VALIDATION:      ./VALIDATION_Connectome_Event_Model_Invariants_And_Error_Conditions.md
HEALTH:          ./HEALTH_Connectome_Event_Model_Runtime_Verification_And_Signal_Coverage.md
SYNC:            ./SYNC_Connectome_Event_Model_Sync_Current_State.md

IMPL:            ? (planned TypeScript module under /connectome)
```

> **Contract:** Read docs before modifying. After changes: update IMPL or add TODO to SYNC. Run health.

---

## OVERVIEW

This module converts heterogeneous inputs (stepper steps, SSE payloads, timers, derived UI transitions) into a single canonical structure: **FlowEvent**.

The output is used by:

* edge styling (type, color, directionality)
* node highlighting (stepKey, flipped glow, energy changes)
* unified explain/log panel (durations, triggers, payload summaries)
* export/copy (stable machine-readable event ledger)

---

## DATA STRUCTURES

### `FlowEvent`

```
FlowEvent:
required:
id: string                # stable unique id for this event
at_ms: number             # time of occurrence (monotonic preferred)
from_node_id: string      # source node id OR "?"
to_node_id: string        # target node id OR "?"
trigger: TriggerKind      # direct|stream|async|hook|timer
call_type: CallType       # code|graphQuery|llm|graphLink|moment
label: string             # short link label (NOT bold in UI)
optional:
duration_ms: number       # measured or declared; for animation and log
payload_summary: string   # short “what data moved”
rate_hint: string         # “per tick”, “<=3/tick”, “per action”
step_key: string          # which node internal step is active
energy_delta: number      # magnitude of energy transfer/pulse
notes: string             # "?" or clarifying remarks
raw_payload: unknown      # stored only if debug enabled (?)
```

### `TriggerKind`

```
TriggerKind: direct | stream | async | hook | timer
```

### `CallType`

```
CallType: code | graphQuery | llm | graphLink | moment
```

---

## ALGORITHM: `normalize_flow_event(raw_input)`

### Step 1: Establish source + base envelope

* Determine `source_kind` = stepper | sse | derived | timer
* Create default fields:

  * `id` = stable id (see decision D1)
  * `at_ms` = received_at_ms
  * `from_node_id`/`to_node_id` = "?" until mapped

```
base = {
id, at_ms,
from_node_id: "?",
to_node_id: "?",
trigger: "direct",
call_type: "code",
label: "?",
notes: ""
}
```

### Step 2: Classify trigger + call type

* Map trigger:

  * stepper: use declared trigger
  * sse: trigger="stream"
  * timer: trigger="timer"
  * derived UI: trigger="hook" or "timer" depending on origin
* Map call_type:

  * endpoints, internal methods -> code
  * graph query functions -> graphQuery
  * world builder/narrator -> llm
  * ABOUT/THEN/SAID -> graphLink
  * moment lifecycle transitions -> moment

### Step 3: Map nodes and labels

* Resolve `from_node_id`, `to_node_id`, `label`
* If not resolvable, keep "?" and add `notes="?"`

### Step 4: Duration handling

* If `duration_ms` missing: set to `?` (undefined) and add notes if important
* If present: clamp to `min_animation_ms = 200`

### Step 5: Summaries and rate hints

* `payload_summary`: shortest truthful summary
* `rate_hint`: fill from known semantics:

  * tick edges: `rate=tick` with speed-based hint (if known)
  * SSE edges: `rate=per event`
  * agent edges: `rate=on sparse` or `rate=on flip` (often `?`)

### Step 6: Emit normalized FlowEvent

* Return normalized event
* Never throw; error conditions become notes + validation failures

---

## KEY DECISIONS

### D1: Event ID strategy

```
IF raw_input has stable id:
id = raw_input.id
ELSE IF (source_kind == stepper):
id = "step:" + step_index + ":" + step_key
ELSE:
id = "evt:" + hash(label, from_node_id, to_node_id, at_ms_bucket)
```

Rationale:

* ensures stepper replay is stable
* avoids id churn in logs
* supports “copy log then replay” workflows

### D2: Duration bucketing for log color

```
IF duration_ms is undefined:
color = "muted_unknown"
ELSE IF duration_ms < 1000:
color = "green"
ELSE IF duration_ms < 2000:
color = "yellow"
ELSE IF duration_ms < 3000:
color = "orange"
ELSE:
color = "red"
AND:
IF unit is ms (duration_ms < 1000):
duration_text_color = "blue"  # special rule: show ms as blue
```

---

## DATA FLOW

```
raw input (stepper / sse / timer)
↓
normalize_flow_event(raw)
↓
FlowEvent (canonical)
↓
render edge + highlight node step + append unified log entry
```

---

## COMPLEXITY

**Time:** O(1) per event — constant mapping + string formatting

**Space:** O(n) for stored event ledger (bounded by UI retention policy)

**Bottlenecks:**

* storing raw payloads unbounded (avoid by toggle + retention)
* too many events per second in realtime mode (needs throttling in `telemetry_adapter`)

---

## HELPER FUNCTIONS

### `infer_call_type(raw)`

**Purpose:** classify call type for edge coloring and node semantics

**Logic:** pattern match by declared step type, SSE event name, endpoint path, link name

### `format_payload_summary(raw)`

**Purpose:** produce short truthful “what data moved” summary

**Logic:** prefer `payload_summary` if declared; else map known SSE payloads; else `?`

---

## INTERACTIONS

| Module              | What We Call                 | What We Get               |
| ------------------- | ---------------------------- | ------------------------- |
| `telemetry_adapter` | `adapt_sse_payload_to_raw()` | raw input candidate       |
| `runtime_engine`    | `declare_stepper_step()`     | raw step definition       |
| `state_store`       | `append_event(event)`        | persistent ledger storage |

---

## MARKERS

* [ ] Define retention policy for event ledger in realtime mode (max N, or time window).
* QUESTION: should “energy pulse” be represented as a FlowEvent or a derived rendering-only artifact?

---
