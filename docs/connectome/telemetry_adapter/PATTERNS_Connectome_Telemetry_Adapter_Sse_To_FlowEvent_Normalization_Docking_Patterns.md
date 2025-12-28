```

# telemetry_adapter — Patterns: SSE-to-FlowEvent Docking for Realtime Connectome Playback

STATUS: DRAFT
CREATED: 2025-12-20
VERIFIED: 2025-12-20 against ?
```

---

## CHAIN

```
THIS:            PATTERNS_Connectome_Telemetry_Adapter_Sse_To_FlowEvent_Normalization_Docking_Patterns.md (you are here)
BEHAVIORS:       ./BEHAVIORS_Connectome_Telemetry_Adapter_Realtime_Ingestion_Buffering_And_Backpressure_Effects.md
ALGORITHM:       ./ALGORITHM_Connectome_Telemetry_Adapter_Sse_Subscription_Event_Parsing_And_Raw_Event_Emission.md
VALIDATION:      ./VALIDATION_Connectome_Telemetry_Adapter_Invariants_For_No_Dropped_Events_And_Stable_Order.md
IMPLEMENTATION:  ./IMPLEMENTATION_Connectome_Telemetry_Adapter_Code_Structure_For_Sse_And_Snapshot_Docking.md
HEALTH:          ./HEALTH_Connectome_Telemetry_Adapter_Runtime_Verification_Of_Stream_Integrity_And_Buffer_Bounds.md
SYNC:            ./SYNC_Connectome_Telemetry_Adapter_Sync_Current_State.md
```

---

## THE PROBLEM

/connectome needs a realtime mode that is truthful:

* consume backend SSE streams (moments, tempo, weights, etc.)
* map each inbound SSE payload to a canonical FlowEvent (event_model)
* preserve order and avoid silent drops
* provide local pause + buffering semantics (runtime_engine)
* provide health signals (rate, drops, parse failures, buffer size)

Without a telemetry_adapter:

* realtime mode becomes “random UI animation”
* payload parsing spreads across components and drifts
* unknown SSE events vanish silently
* debugging regressions are impossible to audit
* the connectome cannot become a real dashboard for the running system

---

## THE PATTERN

**Single ingress boundary: SSE → RawTelemetryEnvelope → FlowEvent.**

telemetry_adapter performs only ingress concerns:

* subscribe to SSE streams
* parse event name + JSON payload
* annotate metadata (received time, stream name)
* output raw envelopes that event_model can normalize deterministically

Key insight:

> Realtime is not “another UI mode.”
> Realtime is an ingestion pipeline. Treat it like one: one dock, one normalization boundary.

---

## PRINCIPLES

### Principle 1: One-way truth stream, no UI inference

telemetry_adapter must not infer semantics the event_model already defines.

* it preserves what arrived
* it annotates where it came from
* it never “fixes” payloads except minimal parse normalization

### Principle 2: Unknown events are preserved, never dropped

Any unrecognized SSE event name:

* still becomes a raw envelope
* becomes a FlowEvent with notes="?" after normalization
* appears in the unified log

### Principle 3: Buffering is explicit and bounded

Realtime pause is a local UI control:

* when locally paused, events are buffered
* buffers must be bounded by retention policy (size/time)
* overflow policy must be explicit (drop oldest with WARN, or stop ingestion) → `?`

### Principle 4: Order is stable and auditable

Ordering policy must be explicit:

* default: arrival order (received_at_ms + arrival_index)
* do not attempt to reorder by backend timestamps unless proven necessary → `?`

---

## DATA

| Data                   | Description                                  |
| ---------------------- | -------------------------------------------- |
| `SseFrame`             | raw SSE frame: {event_name, data_text}       |
| `RawTelemetryEnvelope` | parsed JSON + stream metadata + receipt time |
| `arrival_index`        | monotonic counter for stable ordering        |
| `buffer`               | bounded queue used when locally paused       |

---

## DEPENDENCIES

| Module           | Why                                                             |
| ---------------- | --------------------------------------------------------------- |
| `event_model`    | telemetry_adapter outputs raw envelopes; event_model normalizes |
| `runtime_engine` | realtime mode attach/detach, local pause gating                 |
| `state_store`    | buffer counters and “telemetry connected” state signals         |
| `backend_docks`  | optional snapshot endpoints (reserved, may stay `?`)            |

---

## INSPIRATIONS

* Observability ingestion pipelines
* EventSource/SSE clients in dashboards
* Trace collectors (preserve raw, normalize later)

---

## SCOPE

### In Scope (v1)

* SSE subscription management (connect/disconnect/retry)
* parse SSE frames into raw telemetry envelopes
* arrival ordering metadata
* expose connection state signals (connected/disconnected/error)
* minimal buffering when locally paused (bounded)

### Out of Scope (v1)

* full backend schema enforcement (event_model + validation own semantics)
* rendering and animation (flow_canvas/edge_kit/node_kit)
* stepper sequencing (runtime_engine)
* creation of new backend endpoints (backend_docks, reserved)

---

## MARKERS

* [ ] Confirm actual SSE endpoints and event names used by the backend → `?`
* QUESTION: one SSE connection or multiple (moments + tempo + weights)? (likely multiple, unified into one envelope stream)
* IDEA: add a “telemetry source selector” UI (dev vs prod) later

---

---
