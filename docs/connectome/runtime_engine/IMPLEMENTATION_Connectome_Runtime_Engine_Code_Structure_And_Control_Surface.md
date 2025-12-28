```

# runtime_engine — Implementation: Code Architecture and Structure

STATUS: DRAFT
CREATED: 2025-12-20
```

---

## CHAIN

```
PATTERNS:        ./PATTERNS_Connectome_Runtime_Engine_Stepper_And_Realtime_Traversal_Control_Patterns.md
BEHAVIORS:       ./BEHAVIORS_Connectome_Runtime_Engine_User_Controlled_Traversal_Effects.md
ALGORITHM:       ./ALGORITHM_Connectome_Runtime_Engine_Step_Release_And_Realtime_Scheduling.md
VALIDATION:      ./VALIDATION_Connectome_Runtime_Engine_Invariants_For_Stepper_And_Realtime.md
THIS:            IMPLEMENTATION_Connectome_Runtime_Engine_Code_Structure_And_Control_Surface.md
HEALTH:          ./HEALTH_Connectome_Runtime_Engine_Runtime_Verification_Of_Pacing_And_Order.md
SYNC:            ./SYNC_Connectome_Runtime_Engine_Sync_Current_State.md

IMPL:            app/connectome/lib/next_step_gate_and_realtime_playback_runtime_engine (planned) (PROPOSED)
IMPL:            app/connectome/lib/connectome_system_map_node_edge_manifest.ts
```

---

## CODE STRUCTURE

```
app/
└── connectome/
├── lib/
│   ├── next_step_gate_and_realtime_playback_runtime_engine (planned)
│   ├── minimum_duration_clamp_and_speed_based_default_policy (planned)
│   ├── step_script_cursor_and_replay_determinism_helpers (planned)
│   └── connectome_system_map_node_edge_manifest.ts
```

### File Responsibilities

| File                                                       | Responsibility                                                    | Key Exports                                     |
| ---------------------------------------------------------- | ----------------------------------------------------------------- | ----------------------------------------------- |
| `next_step_gate_and_realtime_playback_runtime_engine (planned)`   | command dispatch + step release gate + realtime attach (deferred) | `dispatch_runtime_command`, `release_next_step` |
| `minimum_duration_clamp_and_speed_based_default_policy (planned)` | duration policy + thresholds                                      | `compute_animation_duration_ms`                 |
| `step_script_cursor_and_replay_determinism_helpers (planned)`     | cursor movement + stable ids for stepper                          | `make_stepper_event_id`, `advance_cursor`       |
| `connectome_system_map_node_edge_manifest.ts`             | system map graph definition (nodes/edges)                         | `CONNECTOME_NODE_DEFINITIONS`, `CONNECTOME_EDGE_DEFINITIONS` |

---

## DESIGN PATTERNS

### Architecture Pattern

* Gate + scheduler split by mode (stepper vs realtime)

### Code Patterns in Use

* pure helpers for deterministic outputs
* table-driven speed → default duration mapping

### Anti-Patterns to Avoid

* timers that release events in stepper mode
* direct store mutation from UI components
* duplicating event_model normalization

### Boundaries

| Boundary                 | Inside              | Outside                                 |
| ------------------------ | ------------------- | --------------------------------------- |
| Runtime control boundary | gating + scheduling | rendering, storage, telemetry transport |

---

## SCHEMA

### RuntimeCommand

(see PATTERNS)

### RuntimeReleaseResult

(see PATTERNS)

---

## ENTRY POINTS

| Entry Point                           | Trigger                                                |
| ------------------------------------- | ------------------------------------------------------ |
| `dispatch_runtime_command(cmd)`       | UI actions                                             |
| `release_next_step()`                 | called only from `dispatch_runtime_command(next_step)` |
| `attach_realtime_stream()` (deferred) | telemetry adapter                                      |

---

## DATA FLOW AND DOCKING (FLOW-BY-FLOW)

### stepper_next_step_release: Next click → one event

```
flow:
name: stepper_next_step_release
steps:
- id: cmd_received
file: app/connectome/lib/next_step_gate_and_realtime_playback_runtime_engine (planned)
function: dispatch_runtime_command
trigger: direct
output: RuntimeReleaseResult (released/blocked/end_of_script)
- id: normalize
file: app/connectome/lib/next_step_gate_and_realtime_playback_runtime_engine (planned)
function: release_next_step
trigger: direct
output: FlowEvent
notes: "calls event_model.normalize_flow_event"
- id: store_commit
file: app/connectome/state_store (?)
function: commit_release (?)
trigger: direct
output: state updated
docking_points:
- id: dock_runtime_release_result
type: event
direction: output
file: app/connectome/lib/next_step_gate_and_realtime_playback_runtime_engine (planned)
function: release_next_step
payload: RuntimeReleaseResult
notes: "HEALTH observes one-click-one-event"
```

---

## STATE MANAGEMENT

### Where State Lives

* cursor, mode, speed, pause in `state_store`

### State Transitions

(see runtime_engine PATTERNS)

---

## RUNTIME BEHAVIOR

### Initialization

* bind step script
* set defaults (mode=stepper, speed=pause)

### Main Loop / Request Cycle

* command-driven, synchronous per click

### Shutdown

* detach realtime subscription (deferred)

---

## CONCURRENCY MODEL

* serialize commands
* realtime queue drain policy deferred

---

## CONFIGURATION

| Config           | Default |
| ---------------- | ------- |
| MIN_ANIMATION_MS | 200     |
| DEFAULT_SPEED    | pause   |
| DEFAULT_MODE     | stepper |

---

## LOGIC CHAINS

### LC1: Stepper release authorization chain

**Purpose:** Guarantee that a Next button click triggers a single normalized `FlowEvent`, updates focus/explanation, and writes the event into the ledger so downstream panels, telemetry, and the health suite all see the same deterministic story.

```
Next button handler in `app/connectome/page.tsx`
  → `dispatch_runtime_command({ kind: "next_step" })`
    → `release_next_step()`
      → `make_stepper_event_id()` + `normalize_flow_event(raw_event)`
        → `compute_animation_duration_ms()` (speed + min clamp)
          → `commit_step_release_append_event_and_set_focus_and_explanation()` on `state_store`
            → Ledger/focus/explanation slices update (visible to `log_panel`, canvas, health observers)
              → `RuntimeReleaseResult` returns released event id for callers such as telemetry adapters or health checks
```

**Data transformation:**
- Input: `RuntimeCommand` from the UI — Next clicks launch the deterministic gating logic that owns authorization.
- After step 1: `FlowEvent` gains a replay-safe id plus normalized fields, guaranteeing the same payload for UI, exports, and telemetry even on reruns.
- After step 2: Duration is clamped by `minimum_duration_clamp_and_speed_based_default_policy` using the current speed setting so pacing stays readable.
- Output: `RuntimeReleaseResult` plus a committed ledger entry, updated `cursor`, and new `active_focus`/`current_explanation` that downstream viewers render immediately.

### LC2: Pace and mode adjustment chain

**Purpose:** Keep speed, mode, and local-pause commands aligned with the store’s tick display, wait timers, and boundary services so playback remains consistent without accidentally releasing extra steps.

```
Playback control (speed/mode/pause) in the UI
  → `dispatch_runtime_command({ kind: "set_speed"|"set_mode"|"set_local_pause", payload })`
    → `set_speed_and_update_nominal_tick_interval()` or `set_mode_and_reset_buffers_if_needed()` or `set_local_pause()`
      → `state_store` updates `speed`, `mode`, `tick_display`, and `wait_progress`
        → Health runners and tick indicators read the new values and adjust pacing meters
          → Future `release_next_step()` calls reuse the updated settings without violating the “one event per click” guardrail
```

**Data transformation:**
- Input: playback control commands capture user intent (pause, faster speed, realtime mode) without releasing FlowEvents themselves.
- After step 1: `speed`, `mode`, and `wait_progress` store slices change, causing the tick display to recompute nominal intervals and the health runners to reset their heartbeat checks.
- Output: pacing metadata that downstream timers and indicators read so the runtime engine orchestrates release cadence with the updated configuration.

---

## MODULE DEPENDENCIES

| Module                                                                                                    | Dependency Type     | Why It Matters                                                                                                                                    |
| --------------------------------------------------------------------------------------------------------- | ------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| `app/connectome/state_store`                                                                               | runtime dependency  | Persists cursor, mode, speed, ledger, and focus metadata; every release writes through the store so the runtime engine never duplicates its view. |
| `app/connectome/lib/step_script_cursor_and_replay_determinism_helpers`                                     | helper module       | Supplies deterministic event ids and cursor helpers that ensure `release_next_step()` can advance scripts without replay drift.                       |
| `app/connectome/lib/connectome_step_script_sample_sequence.ts`                                             | helper module       | Provides the ordered `CONNECTOME_STEP_SCRIPT` and `CONNECTOME_STEP_TOTAL` that the runtime gate consumes to know what event to release next.         |
| `app/connectome/lib/flow_event_schema_and_normalization_contract`                                         | helper module       | Normalizes raw script steps (call, trigger, duration) into canonical `FlowEvent` objects that every downstream consumer shares.                     |
| `app/connectome/lib/minimum_duration_clamp_and_speed_based_default_policy`                                 | helper module       | Centralizes duration clamping and speed defaults so stepper pulses, replay, and planned realtime streaming all share pacing invariants.              |
| `app/connectome/lib/connectome_session_boundary_and_restart_policy_controller`                             | helper module       | Lets `restart` commands either clear the ledger or insert session boundaries, which ties the runtime engine to session-aware health and export logic. |
| `app/connectome/log_panel`                                                                                 | consumer module     | Reads the ledger, focus, explanation, and pacing fields that `commit_step_release_*` updates so the runtime engine’s releases are immediately visible. |
| `app/connectome/lib/connectome_wait_timer_progress_and_tick_display_signal_selectors.ts`                    | observer module     | Reads the runtime store slices (wait progress, tick display, speed) to drive health meters and pacing indicators that confirm gating invariants.   |

`initialize_connectome_runtime()` uses the manifest (defined in this module) to reveal the instrumentation nodes/edges listed in the graph definition, guaranteeing the runtime gate, log panel, and telemetry health signals share the same canonical node/edge graph before any Next click runs.

### External Dependencies

| Package | Used For | Imported By |
| ------- | -------- | ----------- |
| `zustand` | Provides the shared store hook consumed by `dispatch_runtime_command()` via `useConnectomeStore`. | `app/connectome/lib/next_step_gate_and_realtime_playback_runtime_engine.ts` |

The `zustand` binding drives the shared store hook so both the logic chain and UI snapshot consumers (log panel, telemetry adapters, health monitors) read from the same orchestrated runtime state.

---
## BIDIRECTIONAL LINKS

### Code → Docs

* add doc pointer headers to the TS files

### Docs → Code

* V1 invariants enforced by release_next_step

---

## MARKERS

### Extraction Candidates

* if realtime introduces buffering complexity → extract buffer policy to a separate helper

### Missing Implementation

* [ ] implement runtime engine TS files
* [ ] add health runner (scripts/connectome/health/runtime_engine_health_check_runner (planned))

### Ideas

* IDEA: session boundaries for restart, preserve previous logs

### Questions

* QUESTION: Should restart clear ledger or mark boundary? (pending human decision)
