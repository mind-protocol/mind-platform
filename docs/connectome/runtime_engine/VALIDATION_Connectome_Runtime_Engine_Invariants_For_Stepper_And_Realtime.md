```

# runtime_engine — Validation: Invariants for Stepper Gating and Realtime Playback

STATUS: DRAFT
CREATED: 2025-12-20
VERIFIED: 2025-12-20 against ?
```

---

## CHAIN

```
PATTERNS:        ./PATTERNS_Connectome_Runtime_Engine_Stepper_And_Realtime_Traversal_Control_Patterns.md
BEHAVIORS:       ./BEHAVIORS_Connectome_Runtime_Engine_User_Controlled_Traversal_Effects.md
ALGORITHM:       ./ALGORITHM_Connectome_Runtime_Engine_Step_Release_And_Realtime_Scheduling.md
THIS:            VALIDATION_Connectome_Runtime_Engine_Invariants_For_Stepper_And_Realtime.md (you are here)
IMPLEMENTATION:  ./IMPLEMENTATION_Connectome_Runtime_Engine_Code_Structure_And_Control_Surface.md
HEALTH:          ./HEALTH_Connectome_Runtime_Engine_Runtime_Verification_Of_Pacing_And_Order.md
SYNC:            ./SYNC_Connectome_Runtime_Engine_Sync_Current_State.md
```

---

## BEHAVIORS GUARANTEED

| Behavior ID | Behavior | Why This Validation Matters |
|-------------|----------|-----------------------------|
| B1 | Next in stepper mode increments the ledger length and cursor by exactly one FlowEvent release, then keeps the gate closed until an explicit command arrives. | Validating this ties each ledger entry to a deliberate click, maintains deterministic replay, and keeps autoplayer toggles from sneaking extra events into the history when operators retry. |
| B2 | Speed adjustments only change animation duration defaults and presentation pacing; they never mutate ledger length, cursor, or FlowEvent cadence even when autoplayer controls are touched. | Confirming this guarantees that the authorization boundary stays separate from animation tweaks so the runtime never stealthily advances while speeding up visual feedback. |
| B3 | Every release obeys the 200ms minimum duration clamp so realtime playback cannot collapse into imperceptibly fast bursts that disguise rapid autoplayer pulses. | The pacing guard keeps telemetry, UIs, and health probes aligned with a perceptible flow, making it obvious when autoplayer bursts try to masquerade as valid steps. |
| B4 | Autoplay mode still requires explicit gating signals before dribbling events to FlowEvent archives, so the runtime never emits data without a preceding command. | This validation makes sure the autoplayer telemetry and health probes match the manual step gating path so nothing drifts when the runtime switches into realtime mode. |

## OBJECTIVES COVERED

| Objective | Validations | Rationale |
|-----------|-------------|-----------|
| Keep Next clicks deterministic by allowing exactly one release per press so ledger updates, cursors, and logs stay predictable before the loop continues. | V1, P1 | This objective prevents multiple FlowEvents per command, preserves replay reproducibility, and keeps autoplayer triggers from corrupting ordered script traces. |
| Keep speed adjustments purely as duration knobs and block autoplay leaks so stepper mode never advances without explicit user consent. | V2, E1, E2 | Validating the speed and error invariants ensures downstream tooling can detect any boundary violation that would let autoplay or unauthorized releases slip through and mislead health dashboards. |
| Maintain human-scale pacing by enforcing the 200ms minimum duration clamp so observers always see the same perceptible cadence before the next command. | V3 | The clamp keeps pacing aligned with telemetry and narrative expectations, preventing autoplayer bursts from rushing through events and confusing auditors. |
| Keep realtime/autoplay gating observable so any emission outside the stepper path triggers a detectable health violation before it reaches downstream logs. | E1, E2 | This objective explicitly tracks the autoplayer guardrails and ensures validation storms fire whenever the runtime tries to skirt the canonical release route. |

---

## INVARIANTS

### V1: One Next click releases exactly one event (stepper mode)

```
IF mode==stepper AND command==next_step AND not end_of_script:
ledger_length increases by exactly 1
cursor increases by exactly 1
```

### V2: Speed does not change authorization (stepper mode)

```
IF mode==stepper:
changing speed must not change ledger_length or cursor
only affects computed animation duration defaults
```

### V3: Minimum duration clamp

```
FOR every released event:
animation_duration_ms >= 200ms
```

---

## PROPERTIES

### P1: Deterministic replay (stepper)

```
Given same step_script and same starting state:
sequence of released FlowEvents is identical (ignoring timestamps)
```

### P2: End-of-script is stable

```
After reaching end_of_script:
further next_step commands do not append events
```

---

## ERROR CONDITIONS

### E1: Double release per click

```
SYMPTOM: ledger_length increases by >1 for a single Next command
SEVERITY: ERROR
```

### E2: Autoplay leak in stepper mode

```
SYMPTOM: events released without a Next command when mode==stepper
SEVERITY: ERROR
```

---

## HEALTH COVERAGE

| Validation | Health Indicator                                 |
| ---------- | ------------------------------------------------ |
| V1         | runtime_stepper_single_step_integrity            |
| V2         | runtime_speed_authorization_separation           |
| V3         | runtime_min_duration_enforced                    |
| P1         | runtime_stepper_replay_determinism (optional v1) |
| E1/E2      | runtime_autoplay_leak_detector                   |

---

## VERIFICATION PROCEDURE

### Manual Checklist

```
[ ] Click Next once → exactly one new log entry
[ ] Switch speed to 3x → click Next once → still exactly one entry
[ ] Run to end → click Next → no new entry; UI says end reached
[ ] Set a step duration to 10ms → animation still takes >=200ms
```

### Automated

```
pnpm connectome:health runtime_engine
```

---

# Run tests

```
pnpm connectome:health runtime_engine
```

# Run with coverage

```
pnpm connectome:health runtime_engine --coverage
```

---

## SYNC STATUS

```
LAST_VERIFIED: 2025-12-20
VERIFIED_AGAINST:
impl: ?
health: ?
RESULT:
V1: NOT RUN
V2: NOT RUN
V3: NOT RUN
```

---

## MARKERS

* QUESTION: Do we treat “Restart” as a new session boundary in determinism checks?
* IDEA: Add a “command ledger” (Next/Restart/Mode changes) for auditability (v2)

---

---
