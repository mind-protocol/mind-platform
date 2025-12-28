```

# event_model — Health: Verification Mechanics and Coverage

STATUS: DRAFT
CREATED: 2025-12-20
```

---

## PURPOSE OF THIS FILE

This HEALTH file covers **runtime correctness** of the /connectome **FlowEvent model**, ensuring the dashboard’s event ledger remains reliable under both stepper and realtime ingestion.

It exists because:

* unit tests can pass while the dashboard silently drops events or mis-styles triggers
* realtime payloads can drift and break normalization without obvious compile errors

Boundaries:

* This file does NOT verify layout stability or rendering performance → see `flow_canvas`, `edge_kit`.
* This file does NOT verify backend truthfulness (Tempo/Canon invariants) → belongs to backend module health.

---

## WHY THIS PATTERN

HEALTH verifies input/output against VALIDATION without requiring invasive code edits, using docking points exposed by the connectome ingestion and store layers.

Failure mode avoided:

* “diagram looks fine” but events are misclassified, durations lie, or unknown payloads vanish.

Throttling matters:

* realtime mode can generate many events; checks must be bounded and meaningful.

---

## CHAIN

```
PATTERNS:        ./PATTERNS_Connectome_Event_Model_Contract_And_Normalization_Patterns.md
BEHAVIORS:       ./BEHAVIORS_Connectome_Event_Model_Observable_Event_Stream_Effects.md
ALGORITHM:       ./ALGORITHM_Connectome_Event_Normalization_And_Rendering_Event_Synthesis.md
VALIDATION:      ./VALIDATION_Connectome_Event_Model_Invariants_And_Error_Conditions.md
IMPLEMENTATION:  ./IMPLEMENTATION_Connectome_Event_Model_Code_Architecture_And_Schema.md
THIS:            HEALTH_Connectome_Event_Model_Runtime_Verification_And_Signal_Coverage.md
SYNC:            ./SYNC_Connectome_Event_Model_Sync_Current_State.md

IMPL:            ? (planned) scripts/connectome/health/event_model_health_check_runner.ts
```

---

## FLOWS ANALYSIS (TRIGGERS + FREQUENCY)

```
flows_analysis:

* flow_id: connectome_event_ingestion_and_normalization
  purpose: Wrong normalization breaks every downstream render + log meaning.
  triggers:

  * type: event
    source: connectome/telemetry_adapter:adapt_sse_payload_to_raw (?)
    notes: SSE payload arrives
  * type: manual
    source: connectome/runtime_engine:release_next_step (?)
    notes: user clicks Next step
    frequency:
    expected_rate: "stepper: <= 1/s (manual); realtime: ?/s"
    peak_rate: "realtime: ?/s (depends on Tempo + Canon output)"
    burst_behavior: "UI may buffer; health must sample not exhaust"
    risks:
  * "VALIDATION V1 schema completeness fails → events dropped or unreadable"
  * "VALIDATION V2 determinism fails → stepper not replayable"
    notes: "Realtime rates are unknown until telemetry adapter exists → ?"

* flow_id: connectome_event_ledger_storage_and_export
  purpose: If ledger corrupts, copy/export and auditing fail.
  triggers:

  * type: event
    source: connectome/state_store:append_event (?)
    notes: normalized event stored
    frequency:
    expected_rate: "matches ingestion"
    peak_rate: "matches ingestion"
    burst_behavior: "retention policy should cap memory → ?"
    risks:
  * "VALIDATION V4 ordering policy violated → confusing chronology"
    notes: "Retention window policy still TBD → ?"
    ```

---

## HEALTH INDICATORS SELECTED

```
health_indicators:

* name: event_schema_conformance
  flow_id: connectome_event_ingestion_and_normalization
  priority: high
  rationale: "If required fields are missing, the dashboard cannot be trusted."

* name: event_duration_clamping
  flow_id: connectome_event_ingestion_and_normalization
  priority: med
  rationale: "If durations are unsafe, animations mislead the user."

* name: event_unknown_preservation
  flow_id: connectome_event_ingestion_and_normalization
  priority: high
  rationale: "Unknown inputs must not disappear; '?' must surface."

* name: event_ordering_policy
  flow_id: connectome_event_ledger_storage_and_export
  priority: med
  rationale: "Out-of-order events must still yield stable readable logs."
  ```

---

## STATUS (RESULT INDICATOR)

```
status:
stream_destination: "file:?/var/connectome/health/event_model_status.json"
result:
representation: enum
value: UNKNOWN
updated_at: "2025-12-20T00:00:00+01:00"
source: event_schema_conformance
```

---

## DOCK TYPES (COMPLETE LIST)

Using standard dock types only (no custom needed for v1):

* `event` (stepper releases, SSE arrival)
* `stream` (SSE)
* `file` (exported log JSONL)
* `config` (normalization config / retention)

---

## CHECKER INDEX

```
checkers:

* name: health_check_event_schema_conformance
  purpose: "Verify VALIDATION V1 required fields always present."
  status: pending
  priority: high

* name: health_check_event_duration_clamping
  purpose: "Verify VALIDATION V3 duration min 200ms behavior."
  status: pending
  priority: med

* name: health_check_unknown_nodes_are_not_dropped
  purpose: "Verify VALIDATION E1: '?' preserved, event still logged."
  status: pending
  priority: high

* name: health_check_unknown_sse_is_preserved
  purpose: "Verify VALIDATION E2 mapping for unknown SSE event names."
  status: pending
  priority: high
  ```

---

## INDICATOR: event_schema_conformance

### VALUE TO CLIENTS & VALIDATION MAPPING

```
value_and_validation:
indicator: event_schema_conformance
client_value: "Agents and humans can trust that every visible edge/log line has a complete meaning."
validation:
- validation_id: V1
criteria: "Schema completeness (required fields exist and are valid)"
```

### HEALTH REPRESENTATION

```
representation:
allowed: [binary, float_0_1, enum, tuple, vector]
selected: [enum]
semantics:
enum: "OK=all sampled events valid; WARN=some invalid but preserved with '?'; ERROR=invalid and dropped (must not happen)"
aggregation:
method: "worst_state"
display: "enum"
```

### DOCKS SELECTED

```
docks:
input:
id: dock_ingestion_normalized_event
method: state_store.append_event (?)
location: "connectome/state_store:?"
output:
id: dock_export_log_jsonl
method: log_panel.export_jsonl (?)
location: "connectome/log_panel:?"
```

### ALGORITHM / CHECK MECHANISM

```
mechanism:
summary: "Sample normalized events and assert required fields match VALIDATION V1."
steps:
- "Intercept or sample FlowEvent objects at append_event()"
- "Validate required fields and enum membership"
- "Emit OK/WARN/ERROR enum + counts"
data_required: "Normalized FlowEvent objects"
failure_mode: "Missing fields → WARN; any dropped event → ERROR"
```

### INDICATOR

```
indicator:
error:
- name: dropped_event_detected
linked_validation: [V1]
meaning: "An event failed schema and was discarded"
default_action: page
warning:
- name: schema_violation_preserved_with_unknowns
linked_validation: [V1]
meaning: "Event preserved but fields are '?'"
default_action: warn/log
info:
- name: sample_ok
linked_validation: [V1]
meaning: "Sampled events valid"
default_action: log/notify
```

### THROTTLING STRATEGY

```
throttling:
trigger: event
max_frequency: "1/5s"
burst_limit: 10
backoff: "exponential on repeated WARN/ERROR"
```

### FORWARDINGS & DISPLAYS

```
forwarding:
targets:
- location: "/connectome (UI panel) — event_model indicator badge"
transport: event
notes: "Human-visible status"
display:
locations:
- surface: UI
location: "/connectome log panel header"
signal: "green/ok, yellow/warn, red/error"
notes: "Badge + tooltip with counts"
```

### MANUAL RUN

```
manual_run:
command: "pnpm connectome:health event_model"
notes: "Run after changing FlowEvent schema or telemetry mapping."
```

---

## HOW TO RUN

```

# Run all health checks for this module

pnpm connectome:health event_model

# Run a specific checker

pnpm connectome:health event_model --checker health_check_event_schema_conformance
```

---

## KNOWN GAPS

* [ ] No real docking points exist yet (file:line unknown) → fill after initial implementation.
* [ ] Ordering policy for realtime out-of-order events unresolved → affects V4 coverage.
* [ ] Realtime expected/peak rates unknown → update once telemetry adapter exists.

---

## MARKERS

* IDEA: Export health results to a stable JSON file consumed by mind doctor.
* QUESTION: Should schema violations in production hard-fail (stop realtime mode) or degrade (WARN)?

---
