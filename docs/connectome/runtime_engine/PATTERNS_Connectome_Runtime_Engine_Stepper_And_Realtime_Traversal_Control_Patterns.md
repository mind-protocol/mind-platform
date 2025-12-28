```

# runtime_engine — Patterns: Stepper-Gated Traversal and Realtime Playback Control

STATUS: DRAFT
CREATED: 2025-12-20
VERIFIED: 2025-12-20 against ?
```

---

## CHAIN

```
THIS:            PATTERNS_Connectome_Runtime_Engine_Stepper_And_Realtime_Traversal_Control_Patterns.md (you are here)
BEHAVIORS:       ./BEHAVIORS_Connectome_Runtime_Engine_User_Controlled_Traversal_Effects.md
ALGORITHM:       ./ALGORITHM_Connectome_Runtime_Engine_Step_Release_And_Realtime_Scheduling.md
VALIDATION:      ./VALIDATION_Connectome_Runtime_Engine_Invariants_For_Stepper_And_Realtime.md
IMPLEMENTATION:  ./IMPLEMENTATION_Connectome_Runtime_Engine_Code_Structure_And_Control_Surface.md
HEALTH:          ./HEALTH_Connectome_Runtime_Engine_Runtime_Verification_Of_Pacing_And_Order.md
SYNC:            ./SYNC_Connectome_Runtime_Engine_Sync_Current_State.md
```

### Bidirectional Contract

```
Before modifying this doc or the code:

1. Read ALL docs in this chain
2. Read event_model chain (runtime_engine depends on FlowEvent)

After modifying this doc:

* Update implementation OR record mismatch in SYNC

After modifying the code:

* Update docs OR record mismatch in SYNC

Never degrade:

* Stepper determinism
* “One step per Next click” guarantee
* No uncontrolled autoplay in stepper mode
  ```

---

## THE PROBLEM

/connectome has two incompatible “truth rhythms” unless we enforce them explicitly:

1. **Stepper mode:** user advances *exactly one function/event* per Next click.
2. **Realtime mode:** system advances as events arrive (SSE / timers), optionally paused locally.

Without a dedicated runtime engine:

* speed controls accidentally auto-advance the stepper
* edge pulses and log entries drift out of sync
* “Next step” becomes meaningless because multiple events land per click
* animation timing becomes arbitrary and untrustworthy
* logs cannot be replayed (no determinism)

---

## THE PATTERN

**Stepper-Gated Event Release + Realtime Playback Scheduler**

The runtime_engine is a **gate** and a **clock**, but never both at the same time:

* In **stepper**: gate controls release, clock does not advance simulation
* In **realtime**: clock schedules rendering (and optional local pause), gate is disabled

Key insight:

> “Speed” is a **presentation rate**, not an authorization to advance state.
> The authorization to advance in stepper mode is only the Next button.

## BEHAVIORS SUPPORTED

- **B1:** Each Next click dispatches exactly one normalized FlowEvent into the ledger so the scripted cursor and highlight progression stay deterministic regardless of presentation rate changes.
- **B2:** Speed settings only alter animation duration and rate widgets while the gate logic keeps authorization limited to the Next command, preventing accidental multi-event releases in stepper mode.
- **B3:** Realtime mode continues to consume arriving telemetry streams automatically while stepper mode remains silent until an explicit Next command, preserving the two separate truth rhythms.

## BEHAVIORS PREVENTED

- **A1:** Speed adjustments do not trigger autoplay or multi-event releases, so increasing the rate to 3x still leaves the gate firmly at one FlowEvent per Next press.
- **A2:** UI components cannot bypass runtime_engine to append ledger entries directly, keeping all focus/highlight and log updates traceable through the same controlled release pipeline.

---

## PRINCIPLES

### Principle 1: Authorization vs pacing are separate

* Authorization to advance:

  * stepper: Next button only
  * realtime: event arrival + local pause toggle
* Pacing:

  * affects animation duration and progress indicators
  * must not change how many steps are released per user action in stepper mode

### Principle 2: Minimum truthful time

Every visible traversal animation must:

* reflect measured/declared duration when known
* never be shorter than 200ms (trust and readability)
* never imply “instant” when the system is slow (progress widgets handle waiting)

### Principle 3: Deterministic replay

Stepper playback must be replayable:

* same step script → same event sequence
* timestamps may differ, ordering must not

---

## DATA

| Data            | Description                                          |
| --------------- | ---------------------------------------------------- |
| `FlowEvent`     | canonical normalized event object (from event_model) |
| `StepScript`    | ordered list of raw steps (simulator)                |
| `RuntimeMode`   | `stepper` | `realtime`                               |
| `SpeedSetting`  | `pause` | `1x` | `2x` | `3x` (presentation)          |
| `PlaybackState` | cursor, paused flag, buffers, active highlights      |

---

## DEPENDENCIES

| Module              | Dependency Type        | Why                                                                         |
| ------------------- | ---------------------- | --------------------------------------------------------------------------- |
| `event_model`       | required               | runtime_engine releases FlowEvents only                                     |
| `state_store`       | required               | runtime_engine writes “current step”, “active highlight”, “progress timing” |
| `telemetry_adapter` | optional (v1 deferred) | realtime event source                                                       |
| `log_panel`         | required               | UI must reflect exactly what runtime released                               |

---

## INSPIRATIONS

* debuggers (single-step vs run)
* trace viewers (spans with durations)
* event-sourcing (immutable ledger, deterministic replay)

---

## SCOPE

### In Scope

* stepper gating logic (Next releases exactly one step)
* realtime playback scheduling (optional local pause/resume)
* animation timing policy (min 200ms, use duration if known)
* progress timing surfaces (player wait bar, tick wait node) as *signals* (not rendering)

### Out of Scope

* storing events ledger (state_store owns)
* rendering edges/nodes (edge_kit/node_kit own)
* SSE ingestion specifics (telemetry_adapter owns)
* backend truth invariants (Tempo/Canon correctness not owned here)

---

## DATA STRUCTURES

### RuntimeCommand

```
RuntimeCommand:
kind: next_step | restart | set_mode | set_speed | set_local_pause
payload: {...} | null
```

### RuntimeReleaseResult

```
RuntimeReleaseResult:
released_event: FlowEvent | null
status: released | blocked | end_of_script
notes: string | null
```

---

## ENTRY POINTS

| Entry Point                            | Purpose                                                    |
| -------------------------------------- | ---------------------------------------------------------- |
| `dispatch_runtime_command(cmd)`        | single entry for UI actions                                |
| `release_next_step()`                  | stepper: release exactly one event                         |
| `attach_realtime_stream(source)`       | realtime: bind event source to release pipeline (deferred) |
| `compute_animation_duration_ms(event)` | unify duration policy                                      |

---

## DATA FLOW AND DOCKING (FLOW-BY-FLOW)

### stepper_next_step_release: user click → one FlowEvent released

```
flow:
name: stepper_next_step_release
purpose: One click releases exactly one event, updates highlight, appends to ledger.
steps:
- read current cursor from state_store
- take next raw step from script
- normalize raw step → FlowEvent (event_model)
- compute animation duration (>=200ms)
- write highlight + explanation + append event to ledger (state_store)
docking_points:
- dock_release_next_step_result (event): emitted after release, used by HEALTH
```

### realtime_event_arrival_release: stream event → release if not locally paused (deferred)

```
flow:
name: realtime_event_arrival_release
purpose: Convert incoming telemetry into FlowEvents and render continuously.
steps:
- receive telemetry payload
- normalize → FlowEvent
- if local_pause=true: buffer
- else: append + animate + update highlights
docking_points:
- dock_realtime_buffer_size (metric): used by HEALTH
```

---

## LOGIC CHAINS

### LC1: Next click (stepper)

```
UI Next click
→ runtime_engine.dispatch_runtime_command(next_step)
→ runtime_engine.release_next_step()
→ event_model.normalize_flow_event(raw_step)
→ state_store.append_event(event)
→ log_panel renders from ledger
```

### LC2: Realtime arrival (deferred)

```
telemetry_adapter.on_event(payload)
→ runtime_engine.try_release_realtime_event(payload)
→ event_model.normalize_flow_event(payload)
→ state_store.append_event(event)
→ flow_canvas animates
```

---

## MODULE DEPENDENCIES

### Internal Dependencies

```
runtime_engine
→ imports event_model (normalize)
→ calls state_store (append + set focus)
→ emits signals consumed by flow_canvas/log_panel (via store)
```

### External Dependencies

None required for v1 (keep it framework-agnostic).
(React timers and requestAnimationFrame live in rendering modules, not here.)

---

## STATE MANAGEMENT

### Where State Lives

State lives in `state_store`. runtime_engine must be stateless except for:

* a private pointer to the active step script (or script id)
* a reference to the realtime subscription handle (deferred)

### State Transitions

```
stepper:
idle → (Next) → released → idle
end_of_script → (Next) → end_of_script
any → (Restart) → idle + cursor=0

realtime:
running → (LocalPause) → paused(buffering)
paused → (Resume) → draining → running
```

---

## RUNTIME BEHAVIOR

### Initialization

* load step script (simulator)
* set mode=stepper, speed=pause by default (presentation only)
* cursor=0, ledger empty

### Main Loop / Request Cycle

* stepper: reacts only to commands (Next/Restart/Mode)
* realtime: reacts to incoming events + local pause toggle (deferred)

### Shutdown

* unsubscribe realtime stream if attached (deferred)
* no other cleanup required

---

## CONCURRENCY MODEL

* stepper: single-threaded, command-serial
* realtime (deferred): events may arrive concurrently; runtime_engine must serialize release into store (queue)

---

## CONFIGURATION

| Config                | Default | Notes                                  |
| --------------------- | ------- | -------------------------------------- |
| `MIN_ANIMATION_MS`    | 200     | clamp for trust                        |
| `MAX_WAIT_PROGRESS_S` | 4.0     | used by progress widgets (signal only) |
| `DEFAULT_MODE`        | stepper | v1 default                             |
| `DEFAULT_SPEED`       | pause   | v1 default                             |

---

## BIDIRECTIONAL LINKS

### Code → Docs

To add during implementation:

* runtime_engine source file should contain:

  * `# DOCS: docs/connectome/runtime_mind/...`

### Docs → Code

* Algorithm maps to `release_next_step()` implementation
* Validation maps to runtime_engine health runner checks

---

## MARKERS

### Extraction Candidates

* If realtime buffering grows complex, split buffering policy into a helper file (still inside runtime_engine module).

### Missing Implementation

* [ ] Implement `dispatch_runtime_command` + `release_next_step`
* [ ] Define step script interface used by simulator (or import from runtime_engine)

### Ideas

* IDEA: support “step back” (reverse) by storing cursor snapshots (v2+)

### Questions

* QUESTION: Should speed selection be stored as part of runtime_engine or purely UI state? (recommended: runtime_engine owns it as a semantic config)
* QUESTION: Do we need separate “visual speed” vs “nominal tick rate” fields? (likely yes)

---

---
