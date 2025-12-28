```

# runtime_engine — Health: Verification Mechanics and Coverage

STATUS: DRAFT
CREATED: 2025-12-20
```

---

## PURPOSE OF THIS FILE

This HEALTH file verifies that runtime_engine preserves the guarantees that make /connectome a trustworthy debugger:

* stepper: one click → one event
* speed: presentation only (no authorization leak)
* minimum animation duration enforced
* no autoplay leaks in stepper mode

This file does not verify:

* edge rendering correctness (edge_kit)
* ledger storage correctness (state_store)
* backend correctness (Tempo/Canon invariants)

---

## WHY THIS PATTERN

Stepper dashboards fail silently: everything “looks animated” but the semantics are wrong.

HEALTH exists to make incorrect semantics visible:

* a double-release becomes a red indicator immediately
* an autoplay leak becomes a red indicator immediately

---

## HOW TO USE THIS TEMPLATE

* Define the flows runtime_engine owns (stepper release; mode switch)
* Define checkers that can sample store state transitions
* Emit a simple enum status: OK/WARN/ERROR

---

## CHAIN

```
PATTERNS:        ./PATTERNS_Connectome_Runtime_Engine_Stepper_And_Realtime_Traversal_Control_Patterns.md
BEHAVIORS:       ./BEHAVIORS_Connectome_Runtime_Engine_User_Controlled_Traversal_Effects.md
ALGORITHM:       ./ALGORITHM_Connectome_Runtime_Engine_Step_Release_And_Realtime_Scheduling.md
VALIDATION:      ./VALIDATION_Connectome_Runtime_Engine_Invariants_For_Stepper_And_Realtime.md
IMPLEMENTATION:  ./IMPLEMENTATION_Connectome_Runtime_Engine_Code_Structure_And_Control_Surface.md
THIS:            HEALTH_Connectome_Runtime_Engine_Runtime_Verification_Of_Pacing_And_Order.md
SYNC:            ./SYNC_Connectome_Runtime_Engine_Sync_Current_State.md

IMPL:            ? (planned) scripts/connectome/health/runtime_engine_health_check_runner.ts
```

---

## FLOWS ANALYSIS (TRIGGERS + FREQUENCY)

```
flows_analysis:

* flow_id: runtime_engine_stepper_next_step_release
  purpose: Guarantee “one Next → one event” and no autoplay.
  triggers:

  * type: manual
    source: UI button "Next step"
    notes: direct user command
    frequency:
    expected_rate: "human-driven: <= 5/min typical; burst <= 5/s"
    peak_rate: "human-driven; bounded"
    burst_behavior: "must remain correct under rapid clicking"
    risks:
  * "double-release bug"
  * "cursor desync"
  * "duration clamp missing"
    notes: "Realtime not required for v1"

* flow_id: runtime_engine_speed_change
  purpose: Ensure speed does not release steps in stepper mode.
  triggers:

  * type: manual
    source: UI speed selector
    frequency:
    expected_rate: "rare"
    peak_rate: "user spam"
    burst_behavior: "must not alter ledger/cursor"
    risks:
  * "autoplay leak due to speed timer"
    notes: "Speed is presentation only in stepper"
    ```

---

## HEALTH INDICATORS SELECTED

```
health_indicators:

* name: runtime_stepper_single_step_integrity
  flow_id: runtime_engine_stepper_next_step_release
  priority: high
  rationale: "If broken, /connectome cannot be trusted."

* name: runtime_speed_authorization_separation
  flow_id: runtime_engine_speed_change
  priority: high
  rationale: "Prevents the most common regression: speed triggers autoplay."

* name: runtime_min_duration_enforced
  flow_id: runtime_engine_stepper_next_step_release
  priority: med
  rationale: "Trust + readability requirement."

* name: runtime_autoplay_leak_detector
  flow_id: runtime_engine_stepper_next_step_release
  priority: high
  rationale: "Any release without Next in stepper is catastrophic."
  ```

---

## OBJECTIVES COVERAGE

| Objective | Indicators | Why These Signals Matter |
|-----------|------------|--------------------------|
| Keep each manual step release deterministic so single-step debugging and logging remain trustworthy. | runtime_stepper_single_step_integrity, runtime_min_duration_enforced | These indicators verify the ledger/cursor deltas and animation duration clamp stay aligned with VALIDATION V1 and V3, preventing confusing double releases or blinking timelines. |
| Ensure speed selections are purely presentation controls so playback experiments never alter the ledger or cursor without user consent. | runtime_speed_authorization_separation | This signal proves that changing speed leaves the authorization boundary intact and only adjusts animation defaults, protecting VALIDATION V2 from regressions. |
| Prevent autoplay leaks so the stepper experience cannot drift into hidden automation that silently modifies the ledger. | runtime_autoplay_leak_detector | This indicator catches any event append that occurs without an explicit Next command, keeping the STEP/NO-STEP semantics intact for analysts and telemetry consumers. |
| Keep instrumentation and log streams aligned so runtime gating telemetry never falls out of sync with Next commands. | runtime_autoplay_leak_detector | This column documents that autoplay detection is the definitive indicator dashboards consult before trusting runtime_state, so the telemetry, log panel, and health badges all share the same grounding signal. |

## STATUS (RESULT INDICATOR)

```
status:
  stream_destination: "file:?/var/connectome/health/runtime_engine_status.json"
result:
representation: enum
value: UNKNOWN
updated_at: "2025-12-20T00:00:00+01:00"
source: runtime_stepper_single_step_integrity
```

---

## DOCK TYPES (COMPLETE LIST)

* event (Next click, speed change)
* file (exported status JSON)
* config (MIN_ANIMATION_MS)
* metric (ledger length deltas, cursor deltas)

---

## CHECKER INDEX

```
checkers:

* name: health_check_stepper_one_click_one_event
  purpose: "Assert V1: ledger+cursor increments exactly 1 per Next."
  status: pending
  priority: high

* name: health_check_speed_does_not_release_steps
  purpose: "Assert V2: speed changes do not change ledger/cursor."
  status: pending
  priority: high

* name: health_check_min_duration_clamp_applied
  purpose: "Assert V3: duration >= 200ms for all releases."
  status: pending
  priority: med

* name: health_check_autoplay_leak_in_stepper_mode
  purpose: "Assert E2: no events appended without Next command."
  status: pending
  priority: high
  ```

---

## INDICATOR: runtime_stepper_single_step_integrity

### VALUE TO CLIENTS & VALIDATION MAPPING

```
value_and_validation:
indicator: runtime_stepper_single_step_integrity
client_value: "Agents can single-step the pipeline and trust semantics."
validation:
- validation_id: V1
criteria: "One Next releases exactly one event and advances cursor by 1."
```

### HEALTH REPRESENTATION

```
representation:
selected: [enum]
semantics:
enum: "OK=always 1; WARN=rare mismatch but detected; ERROR=double-release or cursor desync"
aggregation:
method: "worst_state"
```

### DOCKS SELECTED

```
docks:
input:
- id: dock_next_command_received
type: event
location: connectome/runtime_engine:dispatch_runtime_command (?)
output:
- id: dock_ledger_length_after_release
type: metric
location: connectome/state_store:append_event (?)
- id: dock_cursor_after_release
type: metric
location: connectome/state_store:set_cursor (?)
```

### ALGORITHM / CHECK MECHANISM

```
mechanism:
steps:
- "On each Next command, record ledger_length_before and cursor_before"
- "After release completes, record ledger_length_after and cursor_after"
- "Assert deltas are exactly 1 unless end_of_script"
- "Emit OK/WARN/ERROR"
```

### INDICATOR

```
indicator:
error:
- name: double_release_detected
linked_validation: [V1]
meaning: "More than one event released for one Next"
default_action: page
warning:
- name: cursor_mismatch_detected
linked_validation: [V1]
meaning: "Cursor did not match ledger increment"
default_action: warn/log
info:
- name: single_step_ok
linked_validation: [V1]
meaning: "Deltas correct"
default_action: log
```

### THROTTLING STRATEGY

```
throttling:
trigger: event
max_frequency: "1/0s"   # evaluate every Next click
burst_limit: 100
backoff: "none"
```

### FORWARDINGS & DISPLAYS

```
forwarding:
targets:
- location: "/connectome UI header badge — runtime_engine"
transport: event
display:
locations:
- surface: UI
location: "Log panel header"
signal: "OK/WARN/ERROR badge with tooltip counts"
```

### MANUAL RUN

```
manual_run:
command: "pnpm connectome:health runtime_engine"
```

---

## INDICATOR: runtime_speed_authorization_separation

### VALUE TO CLIENTS & VALIDATION MAPPING

```
value_and_validation:
indicator: runtime_speed_authorization_separation
client_value: "Speed controls stay presentation-only so analysts can ramp playback faster without ledger drift or cursor jumps."
validation:
- validation_id: V2
  criteria: "In stepper mode, toggling speed leaves ledger_length and cursor untouched while only animation duration defaults adjust."
```

### HEALTH REPRESENTATION

```
representation:
selected: [enum]
semantics:
enum: "OK=speed change is presentation only; WARN=ledger/cursor shifted but release is recoverable; ERROR=extra release occurred."
aggregation:
method: "worst_state"
```

### DOCKS SELECTED

```
docks:
input:
- id: dock_speed_change_command_received
  type: event
  location: app/connectome/lib/minimum_duration_clamp_and_speed_based_default_policy.ts:32-75
output:
- id: dock_ledger_cursor_snapshot_after_speed_change
  type: metric
  location: app/connectome/lib/next_step_gate_and_realtime_playback_runtime_engine.ts:90-150
```

### ALGORITHM / CHECK MECHANISM

```
mechanism:
steps:
- "When the speed selector fires, capture ledger_length_before, cursor_before, and requested_duration_ms."
- "After the runtime_engine applies the new speed, sample ledger_length_after and cursor_after."
- "Assert deltas remain zero and the applied animation duration respects the computed defaults."
- "Emit OK/WARN/ERROR depending on the ledger/cursor drift."
```

### INDICATOR

```
indicator:
error:
- name: speed_change_triggered_release
  linked_validation: [V2]
  meaning: "Ledger or cursor changed simply because speed changed."
  default_action: page
warning:
- name: speed_change_cursor_drift
  linked_validation: [V2]
  meaning: "Cursor moved without logging an explicit release."
  default_action: warn/log
info:
- name: presentation_only_speed_change
  linked_validation: [V2]
  meaning: "Speed change left ledger/cursor untouched."
  default_action: log
```

### THROTTLING STRATEGY

```
throttling:
trigger: event
max_frequency: "1/0s"
burst_limit: 60
backoff: "linear"
```

### FORWARDINGS & DISPLAYS

```
forwarding:
targets:
- location: "/connectome UI badge — runtime_engine"
  transport: event
display:
locations:
- surface: UI
  location: "Speed controls tooltip + log panel badge"
  signal: "OK/WARN/ERROR description with last cursor/legal change"
```

### MANUAL RUN

```
manual_run:
command: "pnpm connectome:health runtime_engine --checker health_check_speed_does_not_release_steps"
```

---

## INDICATOR: runtime_min_duration_enforced

### VALUE TO CLIENTS & VALIDATION MAPPING

```
value_and_validation:
indicator: runtime_min_duration_enforced
client_value: "Every released event respects the 200ms clamp so visual pacing stays readable and avoids stutter for storytellers."
validation:
- validation_id: V3
  criteria: "Animation duration for each release is at least 200 milliseconds regardless of the speed selector."
```

### HEALTH REPRESENTATION

```
representation:
selected: [enum]
semantics:
enum: "OK=clamp satisfied; WARN=duration nudged below 200ms but clamped; ERROR=clamp violation registered."
aggregation:
method: "worst_state"
```

### DOCKS SELECTED

```
docks:
input:
- id: dock_requested_duration_ms
  type: config
  location: app/connectome/lib/minimum_duration_clamp_and_speed_based_default_policy.ts:12-48
output:
- id: dock_applied_duration_ms
  type: metric
  location: app/connectome/lib/runtime_stepper_duration_clamp.ts:10-42
```

### ALGORITHM / CHECK MECHANISM

```
mechanism:
steps:
- "Record the requested animation_duration when a release command starts."
- "After duration normalization, read the applied animation_duration from the runtime engine."
- "Assert applied duration >= MIN_ANIMATION_MS (200ms) and clamp values are stable under repeated quick clicks."
- "Emit OK if clamped properly, WARN if we nudged the clamp back up, ERROR when the clamp is ignored."
```

### INDICATOR

```
indicator:
error:
- name: duration_clamp_violated
  linked_validation: [V3]
  meaning: "Released animation finished faster than the 200ms minimum."
  default_action: page
warning:
- name: duration_clamp_edge_case
  linked_validation: [V3]
  meaning: "Clamp nudging detected but result remains above the minimum."
  default_action: warn/log
info:
- name: duration_clamp_respected
  linked_validation: [V3]
  meaning: "Every release met the minimum duration."
  default_action: log
```

### THROTTLING STRATEGY

```
throttling:
trigger: event
max_frequency: "1/0s"
burst_limit: 50
backoff: "none"
```

### FORWARDINGS & DISPLAYS

```
forwarding:
targets:
- location: "logs/connectome_health/runtime_engine_duration.log"
  transport: file
display:
locations:
- surface: UI
  location: "Log panel duration section + badge"
  signal: "WARN/ERROR when duration clamp is not satisfied"
```

### MANUAL RUN

```
manual_run:
command: "pnpm connectome:health runtime_engine --checker health_check_min_duration_clamp_applied"
```

---

## INDICATOR: runtime_autoplay_leak_detector

### VALUE TO CLIENTS & VALIDATION MAPPING

```
value_and_validation:
indicator: runtime_autoplay_leak_detector
client_value: "Runtime never appends an event without an explicit Next click so the stepper experience cannot silently autoplay."
validation:
- validation_id: E2
  criteria: "In stepper mode, events are only emitted when Next is dispatched and not when other controls fire."
- validation_id: V1
  criteria: "Ledger_length and cursor deltas reflect the Next commands seen by the player."
context: "Dashboards consult this indicator so telemetry, logs, and health badges share an explicit Next command anchor before trusting runtime state."
```

### HEALTH REPRESENTATION

```
representation:
selected: [enum]
semantics:
enum: "OK=no extra appends; WARN=unexpected append detected but reverted; ERROR=event committed without Next."
aggregation:
method: "worst_state"
```

### DOCKS SELECTED

```
docks:
input:
- id: dock_runtime_mode_and_command_state
  type: event
  location: app/connectome/lib/runtime_command_dispatch.ts:1-68
output:
- id: dock_ledger_append_event
  type: metric
  location: connectome/state_store:append_event (TODO: file reference pending)
```

### ALGORITHM / CHECK MECHANISM

```
mechanism:
steps:
- "When the runtime mode is stepper, watch for ledger_length increments."
- "Correlate each increment with the most recent command event."
- "If an increment occurs without a Next command, flag WARN and later ERROR if repeated."
- "Forward the status to the health stream and log panel, and keep an evidence blob for reviewing race conditions."
```

### INDICATOR

```
indicator:
error:
- name: autoplay_leak_detected
  linked_validation: [E2]
  meaning: "Ledger advanced without a Next press."
  default_action: page
warning:
- name: autoplay_leak_possible
  linked_validation: [V1, E2]
  meaning: "Command/ledger alignment suspicious but reversible."
  default_action: warn/log
info:
- name: stepper_no_autoplay
  linked_validation: [V1]
  meaning: "No autop events tracked."
  default_action: log
```

### THROTTLING STRATEGY

```
throttling:
trigger: metric
max_frequency: "1/0s"
burst_limit: 20
backoff: "conservative"
```

### FORWARDINGS & DISPLAYS

```
forwarding:
targets:
- location: "connectome.health.runtime_engine stream"
  transport: stream
display:
locations:
- surface: UI
  location: "Log panel + runtime badge"
  signal: "ERROR when autoplay detected, WARN if suspicious cursor drift occurs"
```

### MANUAL RUN

```
manual_run:
command: "pnpm connectome:health runtime_engine --checker health_check_autoplay_leak_in_stepper_mode"
```

---

## HOW TO RUN

```
pnpm connectome:health runtime_engine
pnpm connectome:health runtime_engine --checker health_check_stepper_one_click_one_event
```

---

## KNOWN GAPS

* [ ] Dock locations are unknown until implementation exists (file:line = ?)
* [ ] Realtime-related indicators are deferred for v1

---

## MARKERS

* IDEA: Add a “rapid-click fuzz” mode to stress test V1 quickly.
* QUESTION: Should health checks run in CI, or only as an on-demand dev tool?

---

---
