```

# event_model — Patterns: Contract-First Event Stream for Stepper + Realtime

STATUS: DRAFT
CREATED: 2025-12-20
VERIFIED: 2025-12-20 against ?
```

---

## CHAIN

```
THIS:            PATTERNS_Connectome_Event_Model_Contract_And_Normalization_Patterns.md (you are here)
BEHAVIORS:       ./BEHAVIORS_Connectome_Event_Model_Observable_Event_Stream_Effects.md
ALGORITHM:       ./ALGORITHM_Connectome_Event_Normalization_And_Rendering_Event_Synthesis.md
VALIDATION:      ./VALIDATION_Connectome_Event_Model_Invariants_And_Error_Conditions.md
HEALTH:          ./HEALTH_Connectome_Event_Model_Runtime_Verification_And_Signal_Coverage.md
SYNC:            ./SYNC_Connectome_Event_Model_Sync_Current_State.md

IMPL:            ? (planned TypeScript module under /connectome, see IMPLEMENTATION doc)
```

### Bidirectional Contract

**Before modifying this doc or the code:**

1. Read ALL docs in this chain first
2. Read the linked IMPL source file

**After modifying this doc:**

1. Update the IMPL source file to match, OR
2. Add a TODO in SYNC_*.md: "Docs updated, implementation needs: {what}"
3. Run health: `pnpm connectome:health event_model` (?)

**After modifying the code:**

1. Update this doc chain to match, OR
2. Add a TODO in SYNC_*.md: "Implementation changed, docs need: {what}"
3. Run health: `pnpm connectome:health event_model` (?)

---

## THE PROBLEM

The /connectome dashboard needs to represent **one truth** across multiple sources:

* stepper simulation events (Next-step)
* realtime SSE events (stream)
* derived events (highlight changes, progress timers, energy pulses)
* health signals (invariant pass/fail)

Without a **single canonical event model**, the UI will:

* drift into ad-hoc payload parsing
* duplicate logic (labels, colors, durations, triggers)
* break stepper vs realtime parity (two incompatible “flows”)
* lose the ability to do stable logging + copy/export

What’s wrong with NOT having this:

* the diagram becomes “pretty” but non-auditable
* the log becomes uncopyable / inconsistent
* the dashboard cannot be used by agents as a reliable debugging instrument

---

## THE PATTERN

**Contract-first stream normalization.**

Everything that happens in /connectome is expressed as a **FlowEvent**:

* ingest raw inputs (SSE payloads, stepper definitions, timers)
* normalize them into a strict schema
* render and log from the normalized schema only

Key insight:

> If the event model is stable and deterministic, the visualization can be replaced without losing meaning.
> The UI becomes a view over an event ledger, not a pile of animations.

---

## PRINCIPLES

### Principle 1: One schema to rule stepper + realtime

The same FlowEvent schema must represent:

* direct calls (solid edges)
* streams (dotted edges)
* async agent calls (dashed edges)
* hooks/timers (log + state transitions)

Why this matters:

* avoids parallel “demo mode” and “real mode” logic
* makes /connectome a real tool instead of a mock

### Principle 2: Deterministic normalization (no “presentation logic” in rendering)

Normalization decides:

* callType / trigger classification
* duration bucketing for log colors
* label formatting
* “unknown” handling as explicit `?`

Why this matters:

* rendering stays simple + replaceable
* health checks can validate normalization output

### Principle 3: Lossless transport; lossy display

Store more than you display:

* raw payloads are preserved (optional)
* display uses `payload_summary` and `rate_hint`

Why this matters:

* operators can audit later
* the UI stays readable

---

## DATA

| Source                    | Type   | Purpose / Description                            |
| ------------------------- | ------ | ------------------------------------------------ |
| connectome stepper script | OTHER  | Simulated events released one-by-one             |
| backend SSE stream        | STREAM | Realtime event source (moment_completed, etc.)   |
| local timers              | OTHER  | Progress bar timings, tick cadence visualization |
| derived UI events         | OTHER  | Highlight changes, layout recomputation          |

---

## DEPENDENCIES

| Module              | Why We Depend On It                                            |
| ------------------- | -------------------------------------------------------------- |
| `state_store`       | Stores normalized events and current focus state               |
| `runtime_engine`    | Produces step releases + mode gating (stepper vs realtime)     |
| `edge_kit`          | Uses callType/trigger to style edges                           |
| `node_kit`          | Uses event stepKey + energy deltas to highlight node internals |
| `telemetry_adapter` | Converts SSE payloads into FlowEvent                           |

---

## INSPIRATIONS

* Event-sourcing (ledger of facts, many projections)
* Observability pipelines (normalize at ingestion, render later)
* Finite “call graph tracing” tools (spans + triggers + durations)

---

## SCOPE

### In Scope

* The **canonical FlowEvent schema** (fields, enums, constraints)
* Normalization rules (classification, defaults, “?” behavior)
* Stable formatting primitives used by the UI (duration buckets, label policy)
* Backward compatibility policy for schema changes

### Out of Scope

* Graph layout and rendering primitives → see: `flow_canvas`, `node_kit`, `edge_kit`
* Stepper sequencing logic → see: `runtime_engine`
* Realtime transport specifics (SSE/WebSocket) → see: `telemetry_adapter`
* Backend endpoint design → see: `backend_docks` (reserved)

---

## MARKERS

* [ ] Decide whether `raw_payload` is stored by default or behind a debug toggle (privacy + size).
* [ ] Confirm the authoritative list of backend SSE event names (some are known; others may drift) → `?`
* [ ] Define energy delta semantics: absolute units or normalized 0..1 → `?`
* IDEA: adopt OpenTelemetry-like span IDs for causal chains (parent_event_id).
* QUESTION: do we need multi-edge events (fanout) or always one edge per event?
* QUESTION: should `duration_ms` be measured or declared when simulated? (likely both: `duration_ms_declared` vs `duration_ms_measured`)

---
