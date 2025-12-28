```

# runtime_engine — Algorithm: Step Release Gate and Realtime Scheduling

STATUS: DRAFT
CREATED: 2025-12-20
VERIFIED: 2025-12-20 against ?
```

---

## CHAIN

```
PATTERNS:        ./PATTERNS_Connectome_Runtime_Engine_Stepper_And_Realtime_Traversal_Control_Patterns.md
BEHAVIORS:       ./BEHAVIORS_Connectome_Runtime_Engine_User_Controlled_Traversal_Effects.md
THIS:            ALGORITHM_Connectome_Runtime_Engine_Step_Release_And_Realtime_Scheduling.md (you are here)
VALIDATION:      ./VALIDATION_Connectome_Runtime_Engine_Invariants_For_Stepper_And_Realtime.md
IMPLEMENTATION:  ./IMPLEMENTATION_Connectome_Runtime_Engine_Code_Structure_And_Control_Surface.md
HEALTH:          ./HEALTH_Connectome_Runtime_Engine_Runtime_Verification_Of_Pacing_And_Order.md
SYNC:            ./SYNC_Connectome_Runtime_Engine_Sync_Current_State.md
```

---

## OVERVIEW

runtime_engine is a small controller that:

* receives UI commands (Next/Restart/Mode/Speed)
* releases exactly one FlowEvent per Next in stepper mode
* schedules continuous release in realtime mode (deferred)
* applies minimum animation duration policy (>=200ms)

It does not render and does not store ledgers directly.

## OBJECTIVES AND BEHAVIORS

### Objectives

- Guard every manual traversal command so the UI can trust that `next_step` and realtime inputs always emit exactly one canonical FlowEvent release, preventing ledger/focus drift between frames.
- Keep telemetry-friendly metadata synchronized by committing focus, explanation, cursor, and wait timer updates before emitting any RuntimeReleaseResult so dashboards replay the recorded sequence faithfully.

### Observable Behaviors

- When `dispatch_runtime_command` receives a `next_step` while the store is in stepper mode, it routes through `release_next_step`, ensuring a deterministic `released`/`blocked`/`end_of_script` result tied to a single ledger append.
- Realtime scheduling defers every release loop until `mode` remains realtime and the minimum animation duration clamp passes, so background ticks cannot crowbar extra events or bypass manual pacing.

These observable behaviors pair with the `state_store` atomic commit so log panels, telemetry adapters, and health guards all sample the same ledger/focus/timer combination before any new event begins, preventing render-time inconsistencies.

## ALGORITHM: `runtime_engine_step_release_and_realtime_scheduler()`

1. Validate the incoming `RuntimeCommand` (mode guard, cursor bounds, pause state) before choosing between stepper or realtime flows.
2. In stepper mode, call `release_next_step()` so normalization, duration computation, and the atomic store commit happen inside one deterministic batch that never exposes partial updates.
3. In realtime mode, reuse the same commit path by scheduling deferred releases with `wait_timer_action`, honoring `local_pause`, speed, and duration limits while aborting if the user switches mode or reaches the script end.
4. Emit the final `RuntimeReleaseResult` immediately after the commit so UI, telemetry, and health readers see the exact ledger/focus snapshot without chasing asynchronous updates.
5. After the commit, broadcast the settled snapshot to telemetry adapters, log panel listeners, and health tooling so they can verify the same ledger/focus/timer values before the next command or deferred tick runs.

---

## DATA STRUCTURES

### `RuntimeCommand`

(see PATTERNS)

### `RuntimeReleaseResult`

(see PATTERNS)

---

## ALGORITHM: `release_next_step()`

### Step 1: Guard conditions

* If mode != stepper → return blocked (wrong mode)
* If cursor at end → return end_of_script

### Step 2: Fetch raw step

* raw_step = step_script[cursor]
* cursor_next = cursor + 1 (store update happens after successful normalization)

### Step 3: Normalize to FlowEvent

* event = event_model.normalize_flow_event(raw_step)
* If event invalid → preserve unknowns “?” and proceed (never drop)

### Step 4: Compute animation duration

* duration_ms = clamp(event.duration_ms ?? default_for_speed, MIN_ANIMATION_MS)

### Step 5: Commit to store (single atomic update)

* append event to ledger
* set “active focus” (active node id, active edge id, active step_key)
* set explanation text for this step
* set cursor=cursor_next

### Step 6: Return result

* return released with event id

---

## ALGORITHM: `dispatch_runtime_command(cmd)`

### Step 1: Switch on cmd.kind

* next_step → call release_next_step()
* restart → reset cursor, clear active focus, clear ledger (or clear view) (policy in state_store)
* set_mode → stepper/realtime
* set_speed → store speed; affects duration defaults + progress widgets
* set_local_pause → only used in realtime

### Step 2: Emit result for UI

* return RuntimeReleaseResult (released/blocked/end_of_script)

---

## KEY DECISIONS

### D1: Duration default policy

```
default_duration_for_speed(speed):
pause: 650ms
1x:    650ms
2x:    450ms
3x:    300ms
and then clamp to MIN_ANIMATION_MS=200ms
```

Rationale:

* speed changes “feel” without changing authorization

### D2: End-of-script behavior

```
When end reached:
do not wrap automatically
require Restart
```

Rationale:

* preserves debugging clarity and prevents surprise loops

---

## DATA FLOW

```
UI command
→ runtime_engine.dispatch_runtime_command
→ (optional) release_next_step
→ event_model.normalize_flow_event
→ state_store.commit_update (append + focus + explanation + cursor)
```

---

## COMPLEXITY

* stepper release: O(1) per click
* realtime (deferred): O(1) per event + optional buffering

---

## HELPER FUNCTIONS

### `compute_animation_duration_ms(event, speed)`

* returns >=200ms
* returns declared duration if available and >200ms

### `build_explanation_sentence(event)`

* produces one truthful sentence for the unified log/explain panel
* if unknown: adds “?” marker

---

## INTERACTIONS

| Module                       | Interaction                               |
| ---------------------------- | ----------------------------------------- |
| event_model                  | normalize raw step/payload → FlowEvent    |
| state_store                  | commit atomic state updates for release   |
| telemetry_adapter (deferred) | provide realtime payload stream           |
| log_panel                    | reads store and displays current + ledger |

---

## MARKERS

* [ ] Decide ledger reset policy on Restart (clear all vs mark new cycle boundary)
* QUESTION: Should “Restart” preserve old logs and start a new session id? (likely yes for copy/export)

---

---
