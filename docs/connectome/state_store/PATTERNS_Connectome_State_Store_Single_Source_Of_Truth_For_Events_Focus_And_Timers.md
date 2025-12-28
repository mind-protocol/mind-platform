```

# state_store — Patterns: Single Source of Truth for Ledger, Focus, and Timers

STATUS: DRAFT
CREATED: 2025-12-20
VERIFIED: 2025-12-20 against ?
```

---

## CHAIN

```
THIS:            PATTERNS_Connectome_State_Store_Single_Source_Of_Truth_For_Events_Focus_And_Timers.md (you are here)
BEHAVIORS:       ./BEHAVIORS_Connectome_State_Store_Observable_State_Consistency_Effects.md
ALGORITHM:       ./ALGORITHM_Connectome_State_Store_Atomic_Commits_For_Step_Releases_And_Realtime.md
VALIDATION:      ./VALIDATION_Connectome_State_Store_Invariants_For_Ledger_Ordering_And_Focus.md
IMPLEMENTATION:  ./IMPLEMENTATION_Connectome_State_Store_Code_Structure_And_Zustand_Actions.md
HEALTH:          ./HEALTH_Connectome_State_Store_Runtime_Verification_Of_Ledger_And_Timer_Correctness.md
SYNC:            ./SYNC_Connectome_State_Store_Sync_Current_State.md
```

### Bidirectional Contract

```
Before modifying this doc or the code:

1. Read ALL docs in this chain
2. Read event_model + runtime_engine chains (store is downstream)

After modifying this doc:

* Update implementation OR record mismatch in SYNC

After modifying the code:

* Update docs OR record mismatch in SYNC

Never degrade:

* atomicity of step commits
* append-only ledger semantics (within a session)
* focus correctness (one active node + one active edge)
  ```

---

## THE PROBLEM

/connectome needs to behave like a debugger and an observability surface.

If state is scattered across components:

* edges “disappear” (recompute/resize races)
* focus highlights conflict (multiple active nodes)
* log becomes inconsistent (copy/export mismatch)
* progress widgets drift (wait timers not tied to event semantics)
* stepper invariants become untestable (no single place to observe deltas)

We need a single, agent-friendly state owner.

---

## THE PATTERN

**One store; append-only ledger; atomic release commits.**

The state_store is the canonical state authority for /connectome:

* event ledger (FlowEvents)
* active focus (node/edge + step key)
* runtime mode/speed/local pause flags
* wait progress timers (message→answer) signals
* tick cadence display signals (cron node progress)

Key insight:

> Rendering modules should be pure views over state.
> The store provides the “truthy now”.

## BEHAVIORS SUPPORTED

- Pushes ledger appends, focus updates, timer resets, and explanation sentences through a single explicit action so stepper releases, log exports, and realtime/watch panels share the same canonical commit that the state_store owns, preventing racey duplicates.
- Keeps the active focus identifiers, explanation sentence, and cursor index aligned with the ledger tail so renderers can highlight the current node/edge pair and narration text without chasing asynchronous updates that would desynchronize the UI from the ledger.
- Tracks wait-progress and tick-display signals alongside the ledger cursor so countdown bars, cron node fills, and replay timers render with the precise semantics emitted by the store instead of inventing independent clocks.

## BEHAVIORS PREVENTED

- Blocks render slices or helper utilities from mutating focus, timers, or explanation text directly by routing every change through the store action pipeline, eliminating racey multi-focus states and stale bar values in the UI.
- Prevents ledger snapshots from diverging between copy/export flows and the live UI by centralizing every append-only write so logging clients always match the store’s sequence even when rendering is deferred or the stepper is paused.

> ISSUE #11 NOTE: These behaviors fully document the allowed/blocked outcomes so downstream agents can verify that the store keeps the ledger, focus, and timers aligned whenever they read this doc chain.

---

## PRINCIPLES

### Principle 1: Append-only ledger per session

Within a “session”:

* ledger grows by appending events
* no mutation of past entries (immutability for audit/copy)

If “Restart” occurs:

* either clear ledger OR start a new session boundary (decision recorded in runtime_engine SYNC)

### Principle 2: Atomic commit for each release

When a step releases:

* append event
* set focus
* set current explanation sentence
* update timers (if the step starts/stops wait)
* update counters (cursor, step index)
  …all in one action.

### Principle 3: Store owns time signals, not rendering clocks

Store holds:

* “wait started at ms”
* “last answer arrived at ms”
* “nominal tick interval ms”
* “cron progress 0..1”
  Rendering reads and displays; rendering doesn’t invent semantics.

---

## DATA

| Data                  | Description                                       |
| --------------------- | ------------------------------------------------- |
| `ledger`              | array of FlowEvent (append-only per session)      |
| `active_focus`        | {active_node_id, active_edge_id, active_step_key} |
| `current_explanation` | one sentence for current step                     |
| `mode`                | stepper | realtime                                |
| `speed`               | pause | 1x | 2x | 3x                              |
| `local_pause`         | realtime local pause toggle                       |
| `cursor`              | step script index (stepper)                       |
| `wait_progress`       | {started_at_ms, value_0_1, seconds_display}       |
| `tick_display`        | {interval_ms, progress_0_1, speed_label}          |
| `health_badges`       | module -> OK/WARN/ERROR + tooltip counts          |

---

## DEPENDENCIES

| Module           | Why We Depend On It                                       |
| ---------------- | --------------------------------------------------------- |
| `event_model`    | FlowEvent type and normalization result storage           |
| `runtime_engine` | drives store commits; store should not release on its own |
| `log_panel`      | renders from ledger + current explanation                 |
| `flow_canvas`    | reads active_focus and renders highlights                 |

---

## INSPIRATIONS

* trace viewers (append-only span list)
* Redux/Zustand “single store” patterns
* debugger state machines (cursor + focus)

---

## SCOPE

### In Scope

* schema for store state
* append + focus + explanation atomic commits
* retention policy for realtime ledger (cap N or time window) as config
* copy/export support (log_panel may format, store holds the raw ledger)

### Out of Scope

* normalization (event_model)
* release authorization (runtime_engine)
* layout/rendering (flow_canvas, node_kit, edge_kit)
* backend truth (Tempo/Canon correctness)

---

## ENTRY POINTS (ACTIONS)

Store actions must be explicit and long-named.

| Action                                                             | Purpose                        |
| ------------------------------------------------------------------ | ------------------------------ |
| `commit_step_release_append_event_and_set_focus_and_explanation()` | atomic stepper release         |
| `append_realtime_event_and_update_focus_if_needed()`               | realtime ingestion (deferred)  |
| `set_mode_and_reset_buffers_if_needed()`                           | mode switch                    |
| `set_speed_and_update_nominal_tick_interval()`                     | speed selection (presentation) |
| `restart_session_clear_or_boundary()`                              | restart policy                 |
| `set_player_wait_timer_start_ms()`                                 | start wait bar                 |
| `set_player_wait_timer_stop_ms_and_reset_progress()`               | stop wait bar                  |
| `set_tick_display_progress_0_1()`                                  | cron node fill                 |

---

## DATA FLOW AND DOCKING (FLOW-BY-FLOW)

### stepper_release_atomic_commit: one release → store commit

```
flow:
name: stepper_release_atomic_commit
steps:
- runtime_engine releases one FlowEvent
- state_store commits: append + focus + explanation + counters + timers
- renderers re-render from store
docking_points:
- dock_store_commit_transaction (event): emitted once per commit, used by HEALTH
```

### realtime_ingestion_append_and_retention: append with retention (deferred)

```
flow:
name: realtime_ingestion_append_and_retention
steps:
- telemetry_adapter produces raw payload
- event_model normalizes → FlowEvent
- store appends, applies retention policy
docking_points:
- dock_store_retention_evictions (metric)
```

---

## MARKERS

* [ ] Decide restart policy: clear ledger vs session boundary (must match runtime_engine).
* [ ] Decide retention strategy for realtime: max N events or last T seconds.
* QUESTION: Should store keep raw payload? recommended: keep only when debug toggle enabled.
* IDEA: Store can keep a lightweight derived “current tick counter” for display, but must not become a simulation owner.

---

---
