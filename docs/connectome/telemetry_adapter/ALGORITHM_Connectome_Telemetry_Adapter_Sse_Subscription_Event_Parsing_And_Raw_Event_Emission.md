```

# telemetry_adapter — Algorithm: SSE Subscribe, Parse, Envelope, Emit

STATUS: DRAFT
CREATED: 2025-12-20
VERIFIED: 2025-12-20 against ?
```

---

## CHAIN

```
PATTERNS:        ./PATTERNS_Connectome_Telemetry_Adapter_Sse_To_FlowEvent_Normalization_Docking_Patterns.md
BEHAVIORS:       ./BEHAVIORS_Connectome_Telemetry_Adapter_Realtime_Ingestion_Buffering_And_Backpressure_Effects.md
THIS:            ALGORITHM_Connectome_Telemetry_Adapter_Sse_Subscription_Event_Parsing_And_Raw_Event_Emission.md (you are here)
VALIDATION:      ./VALIDATION_Connectome_Telemetry_Adapter_Invariants_For_No_Dropped_Events_And_Stable_Order.md
IMPLEMENTATION:  ./IMPLEMENTATION_Connectome_Telemetry_Adapter_Code_Structure_For_Sse_And_Snapshot_Docking.md
HEALTH:          ./HEALTH_Connectome_Telemetry_Adapter_Runtime_Verification_Of_Stream_Integrity_And_Buffer_Bounds.md
SYNC:            ./SYNC_Connectome_Telemetry_Adapter_Sync_Current_State.md
```

---

## DATA STRUCTURES

### `RawTelemetryEnvelope`

```
RawTelemetryEnvelope:
envelope_id: string
received_at_ms: number
arrival_index: number
stream_id: string              # e.g. "moments" | "tempo" | "weights" | "unknown"
sse_event_name: string         # e.g. "moment_completed" | "speed_changed" | "?"
data_text: string              # raw data string from SSE
parsed_json: object|null
parse_error: string|null
notes: string|null
```

---

## ALGORITHM: `connect_to_sse_stream(stream_config)`

1. Set connection_state = connecting
2. Create EventSource(url)
3. Attach handlers:

* onopen → connection_state=connected
* onerror → connection_state=error; schedule retry (backoff)
* addEventListener(event_name) for known names if available else default message handler → `?`

4. Return subscription handle with `close()`

---

## ALGORITHM: `on_sse_message(frame) → RawTelemetryEnvelope`

Input: SSE frame provides:

* event_name (may be empty depending on browser API path) → `?`
* data_text

Steps:

1. arrival_index += 1
2. received_at_ms = performance.now() (monotonic preferred)
3. Attempt JSON parse:

* if parse ok: parsed_json=object
* else: parsed_json=null, parse_error=string, notes="?"

4. Create envelope_id:

* `env:${stream_id}:${arrival_index}`

5. Emit envelope to runtime_engine (or to a callback) for normalization

---

## ALGORITHM: local pause buffering gate (owned jointly with runtime_engine)

telemetry_adapter should not decide focus; it only gates envelopes.

Option A (preferred): telemetry_adapter always emits envelopes; runtime_engine buffers based on local_pause.
Option B: telemetry_adapter buffers internally when local_pause true.

V1 recommendation:

* Option A (runtime_mind/store own buffering), telemetry_adapter stays stateless.
* telemetry_adapter still exposes connection/rate metrics.

Mark chosen option in SYNC once decided.

---

## ALGORITHM: rate estimation (health signal)

Maintain a small sliding window:

* count envelopes in last 1s and 10s
* compute events_per_second estimate
* expose metric for health badges

---

## COMPLEXITY

* parse: O(size of data_text)
* per event overhead O(1)
* rate window bounded

---

## MARKERS

* QUESTION: Do we subscribe via named SSE events (preferred) or use default onmessage? depends on backend format → `?`
* IDEA: unify multiple SSE sources into one combined envelope stream for the runtime engine.

---

---
