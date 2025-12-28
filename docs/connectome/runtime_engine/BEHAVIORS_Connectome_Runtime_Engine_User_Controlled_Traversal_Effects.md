```

# runtime_engine — Behaviors: User-Controlled Traversal and Playback Effects

STATUS: DRAFT
CREATED: 2025-12-20
VERIFIED: 2025-12-20 against ?
```

---

## CHAIN

```
PATTERNS:        ./PATTERNS_Connectome_Runtime_Engine_Stepper_And_Realtime_Traversal_Control_Patterns.md
THIS:            BEHAVIORS_Connectome_Runtime_Engine_User_Controlled_Traversal_Effects.md (you are here)
ALGORITHM:       ./ALGORITHM_Connectome_Runtime_Engine_Step_Release_And_Realtime_Scheduling.md
VALIDATION:      ./VALIDATION_Connectome_Runtime_Engine_Invariants_For_Stepper_And_Realtime.md
IMPLEMENTATION:  ./IMPLEMENTATION_Connectome_Runtime_Engine_Code_Structure_And_Control_Surface.md
HEALTH:          ./HEALTH_Connectome_Runtime_Engine_Runtime_Verification_Of_Pacing_And_Order.md
SYNC:            ./SYNC_Connectome_Runtime_Engine_Sync_Current_State.md
```

---

## BEHAVIORS

### B1: Next releases exactly one step, regardless of speed

```
GIVEN:  mode=stepper and user clicks Next
WHEN:   runtime_engine processes the command
THEN:   exactly one FlowEvent is released into the ledger
AND:    exactly one edge + one node-step highlight becomes “active”
AND:    glow persists until the next click
```

### B2: Speed changes animation time, not authorization

```
GIVEN:  mode=stepper and user changes speed (pause/1x/2x/3x)
THEN:   the nominal rate display changes and pulse animation duration changes
BUT:    Next still releases one and only one step
```

### B3: Realtime mode autoplays, stepper never autoplays

```
GIVEN:  mode=realtime
WHEN:   events arrive (SSE or derived)
THEN:   events release automatically unless locally paused

GIVEN:  mode=stepper
THEN:   no event releases without an explicit Next click
```

---

## OBJECTIVES SERVED

| Behavior ID | Objective | Why It Matters |
|-------------|-----------|----------------|
| B1 | Keep the stepper release gate deterministic and explicit. | Prevents accidental replay or skipped nodes by ensuring that control stays strictly in user hands while the runtime engine honors a single FlowEvent at a time. |
| B2 | Let speed (pause/1x/2x/3x) only tune animation pacing. | Ensures the UI pulse stays synchronized with the commanded cadence without compromising the authorization constraint that one click equals a single release. |
| B3 | Separate realtime autoplay from the manual stepper flow. | Keeps the auto stream observable and controllable while the manual path remains blocked until the user explicitly advances.

These objectives connect the behavior IDs to traversal goals so downstream agents can map observable effects to the runtime engine duties before touching the code.

## INPUTS / OUTPUTS

### Primary Function: `dispatch_runtime_command()`

**Inputs**

| Name  | Type           | Notes                                                |
| ----- | -------------- | ---------------------------------------------------- |
| `cmd` | RuntimeCommand | next_step/restart/set_mode/set_speed/set_local_pause |

**Outputs**

| Name     | Type                 | Notes                          |
| -------- | -------------------- | ------------------------------ |
| `result` | RuntimeReleaseResult | released/blocked/end_of_script |

**Side Effects**

- Coordinates animation, highlight, and glow state so every manual release visibly matches the ledger progression and the cursor flicker stays locked to the next node.
- Emits the release banking telemetry that the UI uses to surface paused/buffered indicators and to guard the colored duration pulses from drifting.

This function therefore both gates release events and keeps downstream UI telemetry listeners synchronized with the command history, which is critical for replay and debugging visibility.

---

## EDGE CASES

### E1: End of script

```
GIVEN:  cursor is at last step
WHEN:   user clicks Next
THEN:   result=end_of_script and no new event is appended
AND:    UI explanation states “end reached”
```

This makes sure the UI feeds a positive conclusion rather than letting operators chase invisible events once the script is exhausted.

### E2: Realtime burst while locally paused (deferred)

```
GIVEN:  local_pause=true in realtime
WHEN:   many events arrive quickly
THEN:   events are buffered with bounded retention (policy in state_store ?)
AND:    buffer size is visible as a health signal
```

Buffering also preserves ordering so the runtime_engine can decide when to release while the UI stays consistent with the human pause toggle.

---

## ANTI-BEHAVIORS

### A1: Speed accidentally triggers autoplay in stepper

```
MUST NOT: releasing multiple events because speed=3x
INSTEAD: speed only modifies animation duration + nominal rate text
```

That guard keeps the stepper deterministic even if a user cranks the slider while expecting single-click control.

### A2: UI bypasses runtime_engine and appends to ledger directly

```
MUST NOT: components append events without runtime_engine release
INSTEAD: all user-facing releases go through runtime_engine gate
```

Requiring every release to pass through runtime_engine preserves the ledger invariants and avoids duplicated state updates from rogue components.

---

## STATE MANAGEMENT

### Where State Lives

* cursor, mode, speed, pause flags live in `state_store`
* runtime_engine mutates store through explicit actions only

### State Transitions

(see PATTERNS → State Transitions)

---

## RUNTIME BEHAVIOR

### Initialization

* mode=stepper, speed=pause, cursor=0

### Main Loop / Request Cycle

* command-driven in stepper
* event-driven in realtime (deferred)

### Shutdown

* cleanly detach realtime listener (deferred)

---

## CONCURRENCY MODEL

* stepper commands are serialized
* realtime events are queued and drained (deferred)

---

## CONFIGURATION

* MIN_ANIMATION_MS = 200
* MAX_WAIT_PROGRESS_S = 4.0

---

## BIDIRECTIONAL LINKS

### Code → Docs

* runtime_engine implementation must reference this chain in file header comments

### Docs → Code

* behaviors map to runtime_engine unit-level health checks (see HEALTH)

---

## MARKERS

### Extraction Candidates

* if buffering policies expand: extract to a dedicated buffering policy helper

### Missing Implementation

* [ ] stepper script interface + release logic
* [ ] realtime mode adapter integration (deferred)

### Ideas

* IDEA: “step back” debugging
* IDEA: “jump to step N” with deterministic cursor movement

### Questions

* QUESTION: should realtime mode support “single-step realtime” (consume one buffered event per Next)? (maybe v2)

---

---
