```

# event_model — Implementation: Code Architecture and Structure

STATUS: DRAFT
CREATED: 2025-12-20
```

---

## CHAIN

```
PATTERNS:       ./PATTERNS_Connectome_Event_Model_Contract_And_Normalization_Patterns.md
BEHAVIORS:      ./BEHAVIORS_Connectome_Event_Model_Observable_Event_Stream_Effects.md
ALGORITHM:      ./ALGORITHM_Connectome_Event_Normalization_And_Rendering_Event_Synthesis.md
VALIDATION:     ./VALIDATION_Connectome_Event_Model_Invariants_And_Error_Conditions.md
THIS:           IMPLEMENTATION_Connectome_Event_Model_Code_Architecture_And_Schema.md
HEALTH:         ./HEALTH_Connectome_Event_Model_Runtime_Verification_And_Signal_Coverage.md
SYNC:           ./SYNC_Connectome_Event_Model_Sync_Current_State.md

IMPL:           app/connectome/lib/flow_event_schema_and_normalization_contract.ts
```

> **Contract:** Read docs before modifying. After changes: update IMPL or add TODO to SYNC. Run health.

---

## CODE STRUCTURE

```
app/
└── connectome/
├── lib/
│   ├── flow_event_schema_and_normalization_contract.ts     # exports FlowEvent + normalize_flow_event()
│   ├── flow_event_duration_bucket_color_classifier (planned)      # duration->(text,color) rules
│   └── flow_event_trigger_and_calltype_inference_rules (planned)  # mapping tables, kept deterministic
└── (other modules own rendering/store)
```

### File Responsibilities

| File                                                                    | Purpose                                              | Key Functions/Classes                       | Lines | Status |
| ----------------------------------------------------------------------- | ---------------------------------------------------- | ------------------------------------------- | ----- | ------ |
| `app/connectome/lib/flow_event_schema_and_normalization_contract.ts`    | Single source of truth for FlowEvent + normalization | `FlowEvent`, `normalize_flow_event()`       | ~200  | OK     |
| `app/connectome/lib/flow_event_duration_bucket_color_classifier (planned)`     | Duration formatting + threshold coloring             | `format_duration_for_log()`                 | ~120  | OK     |
| `app/connectome/lib/flow_event_trigger_and_calltype_inference_rules (planned)` | Deterministic mappings for trigger/callType          | `infer_trigger_kind()`, `infer_call_type()` | ~160  | OK     |

**Size Thresholds:**

* OK (<400 lines): Healthy size, easy to understand
* WATCH (400-700 lines): Getting large, consider extraction opportunities
* SPLIT (>700 lines): Too large, must split before adding more code

---

## DESIGN PATTERNS

### Architecture Pattern

**Pattern:** Pipeline / Normalization Boundary

**Why this pattern:** All upstream sources are heterogeneous; normalize once, render many ways.

### Code Patterns in Use

| Pattern              | Applied To                                           | Purpose                            |
| -------------------- | ---------------------------------------------------- | ---------------------------------- |
| Table-driven mapping | `flow_event_trigger_and_calltype_inference_rules (planned)` | deterministic classification       |
| Pure functions       | `normalize_flow_event()`                             | testability + replay determinism   |
| Strict types         | `FlowEvent`                                          | schema stability for agents and UI |

### Anti-Patterns to Avoid

* **God Object**: Do not put store, rendering, and normalization into one file.
* **Premature Abstraction**: No “general event framework”; just FlowEvent.
* **UI-based inference**: UI must not re-infer callType/trigger from raw payloads.

### Boundaries

| Boundary               | Inside                 | Outside                 | Interface                |
| ---------------------- | ---------------------- | ----------------------- | ------------------------ |
| Normalization boundary | raw inputs → FlowEvent | UI rendering and layout | `normalize_flow_event()` |

---

## SCHEMA

### FlowEvent

```
FlowEvent:
required:
id: string
at_ms: number
from_node_id: string
to_node_id: string
trigger: direct|stream|async|hook|timer
call_type: code|graphQuery|llm|graphLink|moment
label: string
optional:
duration_ms: number
payload_summary: string
rate_hint: string
step_key: string
energy_delta: number
notes: string
raw_payload: unknown
constraints:
- "from_node_id/to_node_id may be '?' but must never be empty"
- "duration_ms (if present) must clamp to >= 200ms"
```

---

## ENTRY POINTS

| Entry Point              | File:Line                                           | Triggered By                                   |
| ------------------------ | --------------------------------------------------- | ---------------------------------------------- |
| `normalize_flow_event()` | `flow_event_schema_and_normalization_contract.ts:?` | stepper release, SSE ingestion, derived events |

---

## DATA FLOW AND DOCKING (FLOW-BY-FLOW)

### connectome_event_ingestion_and_normalization: raw input → FlowEvent

```
flow:
name: connectome_event_ingestion_and_normalization
purpose: Normalize heterogeneous inputs into a single contract for rendering/logging/health.
scope: raw input (stepper/SSE/timer) → FlowEvent
steps:
- id: step_1_capture_raw
description: Receive raw input and annotate source_kind + received_at_ms.
file: app/connectome/? (runtime_engine or telemetry_adapter)
function: capture_raw_input (?)
input: unknown
output: raw_envelope
trigger: "Next step" | "SSE event" | "timer"
side_effects: none
- id: step_2_normalize
description: Convert raw_envelope into FlowEvent using deterministic rules.
file: app/connectome/lib/flow_event_schema_and_normalization_contract.ts
function: normalize_flow_event
input: raw_envelope
output: FlowEvent
trigger: direct call
side_effects: none
- id: step_3_store
description: Append FlowEvent to ledger (store owns persistence).
file: app/connectome/? (state_store)
function: append_event (?)
input: FlowEvent
output: ledger_updated
trigger: direct call
side_effects: state mutation
docking_points:
guidance:
include_when: "schema boundary crossings; storage; export"
omit_when: "trivial format conversions"
selection_notes: "HEALTH should dock at normalize and at append_event"
available:
- id: dock_normalize_flow_event_output
type: event
direction: output
file: app/connectome/lib/flow_event_schema_and_normalization_contract.ts
function: normalize_flow_event
trigger: direct call
payload: FlowEvent
async_hook: not_applicable
needs: none
notes: "primary health dock for schema conformance"
- id: dock_append_event_ledger
type: event
direction: input
file: app/connectome/? (state_store)
function: append_event (?)
trigger: direct call
payload: FlowEvent
async_hook: not_applicable
needs: none
notes: "secondary health dock for ordering/retention"
health_recommended:
- dock_id: dock_normalize_flow_event_output
reason: "Directly validates V1/V2/V3 invariants at the contract boundary."
- dock_id: dock_append_event_ledger
reason: "Validates ledger ordering policy and export integrity."
```

---

## LOGIC CHAINS

### LC1: Normalize and store one event

```
raw_input
→ normalize_flow_event()                     # contract boundary
→ state_store.append_event()               # persistent ledger
→ log_panel.render_from_ledger()         # display + copy/export
```

---

## MODULE DEPENDENCIES

### Internal Dependencies

```
event_model
└── imported by → state_store
└── imported by → runtime_engine
└── imported by → telemetry_adapter
└── imported by → edge_kit (colors)
└── imported by → log_panel (formatting)
```

### External Dependencies

| Package            | Used For     | Imported By |
| ------------------ | ------------ | ----------- |
| none required (v1) | keep it pure | event_model |

---

## STATE MANAGEMENT

This module is stateless by design.

| State | Location | Scope | Lifecycle |
| ----- | -------- | ----- | --------- |
| none  | —        | —     | —         |

---

## RUNTIME BEHAVIOR

### Initialization

```

1. module loads mapping tables
2. exports FlowEvent type + normalization helpers
3. system ready
   ```

### Main Cycle

```

1. raw input arrives (stepper/SSE/timer)
2. normalize_flow_event(raw) returns FlowEvent
3. store/app layers consume it
   ```

---

## CONCURRENCY MODEL

Stateless and synchronous. Concurrency handled by callers (store/adapter).

---

## CONFIGURATION

| Config               | Location                                          | Default   | Description                        |
| -------------------- | ------------------------------------------------- | --------- | ---------------------------------- |
| `MIN_ANIMATION_MS`   | `flow_event_schema_and_normalization_contract.ts` | 200       | clamp for trustworthiness          |
| `STORE_RAW_PAYLOADS` | same                                              | false (?) | store raw payloads behind a toggle |
| `RETENTION_POLICY`   | caller (state_store)                              | ?         | how many events to keep            |

---

## BIDIRECTIONAL LINKS

### Code → Docs

To add during implementation:

| File                                              | Line | Reference                                                         |
| ------------------------------------------------- | ---- | ----------------------------------------------------------------- |
| `flow_event_schema_and_normalization_contract.ts` | ?    | documented in this file |

### Docs → Code

| Doc Section                    | Implemented In                                                                 |
| ------------------------------ | ------------------------------------------------------------------------------ |
| ALGORITHM normalize_flow_event | `flow_event_schema_and_normalization_contract.ts:normalize_flow_event`         |
| VALIDATION V1                  | `event_model_health_check_runner (planned):health_check_event_schema_conformance` (?) |
| BEHAVIOR B3                    | `flow_event_duration_bucket_color_classifier (planned):format_duration_for_log`       |

---

## MARKERS

### Extraction Candidates

None yet (v1 sizes are OK).

### Missing Implementation

* [ ] Create the three proposed TS files with long descriptive names.
* [ ] Provide a minimal health runner script entrypoint.

### Ideas

* IDEA: optionally export OpenTelemetry spans for external tracing (v2+)

### Questions

* QUESTION: should `at_ms` use `performance.now()` for monotonic time, or wall clock? (likely monotonic)
* QUESTION: how to generate stable ids for realtime events without backend ids? → `?`

---
