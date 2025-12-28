```

# telemetry_adapter — Implementation: Code Architecture and Structure

STATUS: DRAFT
CREATED: 2025-12-20
```

---

## CHAIN

```
PATTERNS:        ./PATTERNS_Connectome_Telemetry_Adapter_Sse_To_FlowEvent_Normalization_Docking_Patterns.md
BEHAVIORS:       ./BEHAVIORS_Connectome_Telemetry_Adapter_Realtime_Ingestion_Buffering_And_Backpressure_Effects.md
ALGORITHM:       ./ALGORITHM_Connectome_Telemetry_Adapter_Sse_Subscription_Event_Parsing_And_Raw_Event_Emission.md
VALIDATION:      ./VALIDATION_Connectome_Telemetry_Adapter_Invariants_For_No_Dropped_Events_And_Stable_Order.md
THIS:            IMPLEMENTATION_Connectome_Telemetry_Adapter_Code_Structure_For_Sse_And_Snapshot_Docking.md
HEALTH:          ./HEALTH_Connectome_Telemetry_Adapter_Runtime_Verification_Of_Stream_Integrity_And_Buffer_Bounds.md
SYNC:            ./SYNC_Connectome_Telemetry_Adapter_Sync_Current_State.md

IMPL:            app/connectome/lib/sse_telemetry_eventsource_adapter_with_envelope_emission (planned) (PROPOSED)
```

---

## CODE STRUCTURE

```
app/
└── connectome/
├── lib/
│   ├── sse_telemetry_eventsource_adapter_with_envelope_emission (planned)
│   ├── telemetry_envelope_parser_and_json_decode_with_error_preservation (planned)
│   ├── telemetry_connection_state_machine_with_retry_backoff (planned)
│   ├── telemetry_arrival_index_and_rate_estimation_window (planned)
│   └── telemetry_stream_configuration_for_connectome_sources (planned)
```

### File Responsibilities

| File                                                                   | Responsibility                       | Key Exports                                        |
| ---------------------------------------------------------------------- | ------------------------------------ | -------------------------------------------------- |
| `sse_telemetry_eventsource_adapter_with_envelope_emission (planned)`          | creates EventSource, emits envelopes | `attachTelemetryStreams`, `detachTelemetryStreams` |
| `telemetry_envelope_parser_and_json_decode_with_error_preservation (planned)` | parse JSON with explicit errors      | `parseEnvelopeDataText`                            |
| `telemetry_connection_state_machine_with_retry_backoff (planned)`             | retry/backoff and status             | `ConnectionStateMachine`                           |
| `telemetry_arrival_index_and_rate_estimation_window (planned)`                | monotonic ordering + rate            | `ArrivalIndex`, `RateWindow`                       |
| `telemetry_stream_configuration_for_connectome_sources (planned)`             | list of stream urls/names            | `STREAM_CONFIGS` (placeholder `?`)                 |

---

## ENTRY POINTS

| Entry Point                          | Trigger                |
| ------------------------------------ | ---------------------- |
| `attachTelemetryStreams(onEnvelope)` | entering realtime mode |
| `detachTelemetryStreams()`           | leaving realtime mode  |
| `onEnvelope(envelope)`               | per SSE frame          |

---

## DATA FLOW AND DOCKING

```
SSE EventSource frame
→ telemetry_adapter parses to RawTelemetryEnvelope
→ runtime_engine (realtime) receives envelope
→ event_model.normalize_flow_event(envelope)
→ state_store append + focus policy
→ flow_canvas + log_panel render
```

---

## CONFIGURATION

| Config                | Default | Notes                             |
| --------------------- | ------- | --------------------------------- |
| `RETRY_BACKOFF_MS`    | ?       | exponential backoff               |
| `STREAM_CONFIGS`      | ?       | endpoints and event names unknown |
| `STORE_RAW_DATA_TEXT` | true    | preserve raw                      |
| `STORE_PARSED_JSON`   | true    | if parse succeeds                 |

---

## BIDIRECTIONAL LINKS

* adapter source files include doc pointers to docs/connectome/telemetry_adapter/*
* update SYNC when backend stream contracts become known

---

## MARKERS

* QUESTION: Do we need authentication headers for SSE? (browser EventSource limitations) → `?`
* IDEA: If SSE auth is hard, switch to fetch-stream polyfill (but that affects implementation and must be documented).
