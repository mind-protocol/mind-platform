```

# state_store — Implementation: Code Architecture and Structure

STATUS: DRAFT
CREATED: 2025-12-20
```

---

## CHAIN

```
PATTERNS:        ./PATTERNS_Connectome_State_Store_Single_Source_Of_Truth_For_Events_Focus_And_Timers.md
BEHAVIORS:       ./BEHAVIORS_Connectome_State_Store_Observable_State_Consistency_Effects.md
ALGORITHM:       ./ALGORITHM_Connectome_State_Store_Atomic_Commits_For_Step_Releases_And_Realtime.md
VALIDATION:      ./VALIDATION_Connectome_State_Store_Invariants_For_Ledger_Ordering_And_Focus.md
THIS:            IMPLEMENTATION_Connectome_State_Store_Code_Structure_And_Zustand_Actions.md
HEALTH:          ./HEALTH_Connectome_State_Store_Runtime_Verification_Of_Ledger_And_Timer_Correctness.md
SYNC:            ./SYNC_Connectome_State_Store_Sync_Current_State.md

IMPL:            app/connectome/lib/zustand_connectome_state_store_with_atomic_commit_actions (planned) (PROPOSED)
```

---

## SCHEMA

The implementation mirrors the `ConnectomeStoreState` shape described in the ALGORITHM doc so TypeScript consumers can rely on the same structure that drives selectors, exports, and health checks. The schema keeps ledger, focus, timers, and health badges in one plain object so readers can hydrate every view from the same authoritative snapshot.

```
ConnectomeStoreState:
  session_id: string
  mode:     "stepper" | "realtime"
  speed:    "pause" | "1x" | "2x" | "3x"
  local_pause: boolean
  cursor:   number
  ledger:   FlowEvent[]
  active_focus:
    node_id: string | null
    edge_id: string | null
    step_key: string | null
  current_explanation:
    sentence: string
    notes: string | null
  wait_progress:
    started_at_ms: number | null
    stopped_at_ms: number | null
    max_seconds: 4.0
  tick_display:
    nominal_interval_ms: number | null
    progress_0_1: number
    speed_label: string
  health_badges: Record<string, { status: "OK" | "WARN" | "ERROR" | "UNKNOWN", tooltip: string }>
```

Every field is preserved during serialization so the copy/export helpers and health probes can rely on a consistent JSON payload.

---

## CODE STRUCTURE

```
app/
└── connectome/
    ├── lib/
    │   ├── zustand_connectome_state_store_with_atomic_commit_actions (planned)
    │   ├── connectome_session_boundary_and_restart_policy_controller (planned)
    │   ├── connectome_wait_timer_progress_and_tick_display_signal_selectors (planned)
    │   └── connectome_export_jsonl_and_text_log_serializer (planned)
```

### File Responsibilities

| File                                                                  | Responsibility                   | Key Exports                                       |
| --------------------------------------------------------------------- | -------------------------------- | ------------------------------------------------- |
| `zustand_connectome_state_store_with_atomic_commit_actions (planned)`        | store state + long-named actions | `useConnectomeStore`                              |
| `connectome_session_boundary_and_restart_policy_controller (planned)`        | implements restart policy A/B    | `restart_session_*`                               |
| `connectome_wait_timer_progress_and_tick_display_signal_selectors (planned)` | selectors for wait/tick widgets  | `selectWaitProgress`, `selectTickDisplay`         |
| `connectome_export_jsonl_and_text_log_serializer (planned)`                  | stable copy/export               | `serializeLedgerToJsonl`, `serializeLedgerToText` |

---

## DESIGN PATTERNS

* Single store authority (Zustand)
* atomic commit action for each release
* pure selectors for derived time values (avoid scattered timers)

---

## ENTRY POINTS

| Entry Point                                                        | Trigger                     |
| ------------------------------------------------------------------ | --------------------------- |
| `commit_step_release_append_event_and_set_focus_and_explanation()` | runtime_engine step release |
| `restart_session_clear_or_boundary()`                              | user Restart                |
| `serializeLedgerToJsonl()`                                         | Copy/export button          |

---

## DATA FLOW AND DOCKING (FLOW-BY-FLOW)

### store_atomic_commit: runtime release → store update

```
flow:
  name: store_atomic_commit
  steps:
    - runtime_engine releases a FlowEvent and focus/explanation payload
    - the commit action appends to `ledger`, updates `active_focus`, and writes the explanation sentence and notes
    - wait/tick timers recalculate, counters increment, and selectors pick up the new values
    - renderers read the updated state and emit docking telemetry for HEALTH
  docking_points:
    - dock_store_commit_action_invoked (event): ensures the action completed atomically
    - dock_store_ledgers_synced (metric): keeps export tooling aligned with the ledger
```

### realtime_ingestion_append_and_retention: telemetry → store append

```
flow:
  name: realtime_ingestion_append_and_retention
  steps:
    - telemetry_adapter emits raw payloads that event_model normalizes into FlowEvent
    - the store appends the normalized event and, if the focus is not pinned, refreshes `active_focus`
    - retention logic drops the oldest entries once the configured threshold or window is exceeded
  docking_points:
    - dock_store_retention_evictions (metric): tracked by HEALTH and health_badges
    - dock_store_realtime_focus_updates (event): log_panel hears when live focus shifts
```

### restart_session_clear_or_boundary: manual restart flow

```
flow:
  name: restart_session_clear_or_boundary
  steps:
    - user triggers Restart or a runtime boundary policy fires
    - controller either clears the ledger or emits a session boundary marker before resetting focus
    - timers, cursor, and explanation reset while `session_id` rotates so downstream selectors know about the new session
  docking_points:
    - dock_store_session_restart (event): health harness checks that runtime_engine matches the store signal
```

These flows keep the docking contracts referenced by HEALTH and validation docs aligned with the actual implementation hooks.

---

## LOGIC CHAINS

Runtime logic chains flow from `runtime_engine` through the long-named store actions to selectors consumed by `flow_canvas`, `log_panel`, and the export helpers. For example:

* `runtime_engine` releases a FlowEvent and calls `commit_step_release_append_event_and_set_focus_and_explanation`, which mutates the schema in one atomic transaction.
* `connectome_wait_timer_progress_and_tick_display_signal_selectors` draw from `wait_progress` and `tick_display`, keeping the wait/tick widgets in sync with the ledger timeline.
* `serializeLedgerToJsonl` reads the same `ledger` array the renderers use so exported data never lags behind the UI.

The PATTERNS file prohibits any additional local sagas, so these chains keep the implementation from introducing intermediate inconsistent states.

---

## STATE MANAGEMENT

State is the product here; the store exists so downstream renderers do not try to duplicate the ledger, focus, or timers.

* keep ledger immutable by copying the array on append
* keep focus singular
* keep explanation as one sentence

---

## CONFIGURATION

| Config                 | Default | Notes                             |
| ---------------------- | ------- | --------------------------------- |
| `MAX_WAIT_SECONDS`     | 4.0     | progress cap                      |
| `RETENTION_MAX_EVENTS` | ?       | realtime retention cap (deferred) |
| `RESTART_POLICY`       | ?       | clear vs boundary                 |

---

## MODULE DEPENDENCIES

| Module             | Why it matters for the store                                   |
| ------------------ | -------------------------------------------------------------- |
| `event_model`      | supplies normalized `FlowEvent` payloads and stable IDs       |
| `runtime_engine`   | orchestrates when commits run and how restarts are triggered    |
| `telemetry_adapter`| feeds realtime events that the store appends through the action|
| `log_panel`        | derives renders from `ledger`, `active_focus`, and explanations|
| `flow_canvas`      | highlights nodes/edges based on `active_focus`                |
| `health`           | watches docking events (`dock_store_commit_action_invoked`, etc.) |

Documenting dependencies helps future agents trace the feature perimeter before touching the store implementation.

---

## RUNTIME BEHAVIOR

The store exposes only long-named actions, which keeps runtime behavior deterministic:

* Stepper release: `runtime_engine` triggers the atomic commit, appending the event, updating focus, and writing the explanation sentence in one synchronous call.
* Realtime ingestion: telemetry events append via `append_realtime_event_and_update_focus_if_needed`, honoring the retention policy and optionally updating focus when the user has not pinned it.
* Restart: the restart controller clears or boundaries the ledger, resets timers, and rotates `session_id`, emitting docking telemetry that health probes read.

Selectors observe the mutated state and render the log, focus highlights, and wait/tick bars without mutating anything themselves.

---

## CONCURRENCY MODEL

Zustand actions execute sequentially on the main event loop, and the atomic commit action groups ledger append, focus update, explanation write, timer adjustments, and cursor increments so no consumer ever observes a partially applied release. Selectors may derive wait/tick progress on render, but they never mutate the store, which keeps React consistent even when the user clicks Next rapidly.

---

## BIDIRECTIONAL LINKS

### Code → Docs

* The store file header references docs/connectome/state_store/* so implementation-to-doc trace is explicit.
* Selectors in `connectome_wait_timer_progress` refer back to the ALGORITHM section that defines their inputs.

### Docs → Code

* validation invariants are implemented as store health checks that fire when docking events miss the expected cadence.
* entry points listed here map directly to the long-named actions exported by the planned Zustand modules.

---

## MARKERS

* [ ] Decide RESTART_POLICY and lock it (docs + code)
* [ ] Decide retention cap for realtime mode

## AGENT OBSERVATIONS

### Remarks

- Document now spells out schema, flow-by-flow docking, logic chains, dependencies, runtime responsibilities, and the concurrency guardrails that keep the store canonical.
