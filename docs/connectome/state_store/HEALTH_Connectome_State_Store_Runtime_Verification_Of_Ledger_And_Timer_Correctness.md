
# state_store — Health: Verification Mechanics and Coverage

STATUS: DRAFT
CREATED: 2025-12-20

---

## PURPOSE OF THIS FILE

This HEALTH file ensures that the Connectome state_store keeps the ledger, focus, timers, explanations, and export pipeline coherent during human or telemetry-driven interactions so agents can trust the runtime despite rapid clicking, telemetry surges, or manual restarts. It limits verification to runtime docking hooks and explicitly defers rendering aesthetics, backend ingestion correctness, or upstream architecture changes to their own health documentation.

## WHY THIS PATTERN

The HEALTH pattern is appropriate here because the state_store needs a lightweight, throttled instrumentation layer that checks runtime invariants without mutating implementation code. By anchoring every check to VALIDATION invariants and the docking points already exposed by the state flows, this pattern catches issues that unit tests or static analysis miss while keeping the checks close to the live experience.

## HOW TO USE THIS TEMPLATE

1. Read the OBJECTIVES → BEHAVIORS → PATTERNS → ALGORITHM → VALIDATION → IMPLEMENTATION → SYNC chain so you understand what the module is supposed to do before designing indicators.
2. Inspect the implementation entry points inside `app/connectome/lib` and the long-named actions so you can map triggers to the docking points listed below.
3. Determine which signals matter most (ledger append, singular focus, timer precision, export fidelity, restart policy) and make sure each indicator references the relevant VALIDATION ID.
4. For every flow, bind a health indicator to a docking event or metric and verify the input/output pair against the validation criteria.
5. Keep throttling low and forward results only to the mind health stream so we do not overwhelm the Connectome UI.
6. After adjusting the indicators, update this document, the module SYNC, and rerun `mind validate`.
7. Record the completed indicator story in the AGENT OBSERVATIONS section so future agents can see why each flow and dock mattered.

---

## CHAIN

```
PATTERNS:        ./PATTERNS_Connectome_State_Store_Single_Source_Of_Truth_For_Events_Focus_And_Timers.md
BEHAVIORS:       ./BEHAVIORS_Connectome_State_Store_Observable_State_Consistency_Effects.md
ALGORITHM:       ./ALGORITHM_Connectome_State_Store_Atomic_Commits_For_Step_Releases_And_Realtime.md
VALIDATION:      ./VALIDATION_Connectome_State_Store_Invariants_For_Ledger_Ordering_And_Focus.md
IMPLEMENTATION:  ./IMPLEMENTATION_Connectome_State_Store_Code_Structure_And_Zustand_Actions.md
THIS:            HEALTH_Connectome_State_Store_Runtime_Verification_Of_Ledger_And_Timer_Correctness.md
SYNC:            ./SYNC_Connectome_State_Store_Sync_Current_State.md

IMPL:            ? (planned) scripts/connectome/health/state_store_health_check_runner.ts
```

---

## FLOWS ANALYSIS (TRIGGERS + FREQUENCY)

```
flows_analysis:

* flow_id: store_stepper_atomic_commit
  purpose: Keep the ledger, focus, explanation, and wait/tick timers consistent so UI and exports never witness a partial release.
  triggers:
    - type: manual
      source: runtime_engine Next button handler inside `app/connectome/page_shell`
  frequency:
    expected_rate: "Human-driven releases ~1 per 5 seconds during a calm session."
    peak_rate: "Rapid Next clicking bursts reaching 5 commits in 2 seconds."
    burst_behavior: "Pending UI events queue while the atomic commit drains them one at a time."
  risks:
  - "partial commits leave ledger/focus/explanation out of sync (VALIDATION V3)"
  - "ledger order corruption when FlowEvents replay out of order with identical timestamps (VALIDATION V1)"
  - "parallel active focus radiates if focus update is not bound to the same commit (VALIDATION V2)"
  notes: "Atomic commit docking points are the anchor for every health indicator so we guard them with high priority."

* flow_id: store_wait_timer_progress
  purpose: Validate that the wait progress bar and tick display stay within 0-4 seconds at one decimal precision so the player-facing UI reflects real time.
  triggers:
    - type: event
      source: runtime_engine wait timer start/stop helpers in `connectome_wait_timer_progress_and_tick_display_signal_selectors`
  frequency:
    expected_rate: "Approximately 1 per player message (roughly once per minute)."
    peak_rate: "Burst of 5 wait timer updates within ten seconds during fast-paced play."
    burst_behavior: "Selectors reuse the same state slice so timer recalculations happen in lockstep with the ledger commit."
  risks:
  - "timer drift beyond the 4.0s clamp or precision drops to >0.1s (VALIDATION V4)"
  notes: "Timer integrity is driven by the commit action so we use the same docking telemetry to confirm the displayed progress."

* flow_id: store_realtime_ingestion_append_and_retention
  purpose: Keep telemetry-driven appends honest while retention logic trims excess entries so the ledger stays append-only and focus remains singular.
  triggers:
    - type: event
      source: telemetry_adapter → event_model normalization pipeline that feeds the store
  frequency:
    expected_rate: "Realtime telemetry averages 2 events per minute in steady-state."
    peak_rate: "Debug telemetry storms deliver 20 events per minute."
    burst_behavior: "Retention logic fires when thresholds exceed `RETENTION_MAX_EVENTS`, ensuring we do not spill over memory."
  risks:
  - "retention logic removes the wrong entries, breaking V1 and V2."
  - "focus refresh beats the pinned flag because telemetry updates bypass the normal flow (VALIDATION V2)."
  notes: "This flow documents the retention/docking path so future experiments know which telemetry sources inform the health checks."

* flow_id: store_restart_session_clear_or_boundary
  purpose: Assert that manual restarts and runtime boundary policies emit the expected `session_id` rotation, cursor reset, and focus/timer clear operations tied to the configured policy.
  triggers:
    - type: manual
      source: user Restart button or the runtime boundary controller in `connectome_session_boundary_and_restart_policy_controller`
  frequency:
    expected_rate: "Audience-level restart actions occur less than once per minute."
    peak_rate: "Tuning/debugging bursts can hit three restarts per minute."
    burst_behavior: "Restart controller first writes a boundary marker, then clears focus/timers so downstream selectors stay predictable."
  risks:
  - "cursor or focus is left stale when the policy expects a clean ledger reset (VALIDATION P2)"
  notes: "The restart dock is the only place the policy touches session_id so we monitor it with the health harness."
```

---

## HEALTH INDICATORS SELECTED

```
health_indicators:

* name: store_ledger_append_only_integrity
  flow_id: store_stepper_atomic_commit
  priority: high
  rationale: "Append-only ledger integrity keeps exports verbatim and matches VALIDATION V1 and P1 constraints."

* name: store_atomic_commit_integrity
  flow_id: store_stepper_atomic_commit
  priority: high
  rationale: "Atomic commits guard ledger, focus, and explanation updates simultaneously so VALIDATION V2 and V3 hold under rapid clicks."

* name: store_single_focus_integrity
  flow_id: store_realtime_ingestion_append_and_retention
  priority: high
  rationale: "Exactly one focus stops duplicate-glow confusion and ensures V2 is always satisfied across telemetry and steppers."

* name: store_wait_timer_clamp_integrity
  flow_id: store_wait_timer_progress
  priority: med
  rationale: "Clamping the wait timer to 4.0 seconds at one decimal precision keeps the UI truthful, satisfying VALIDATION V4."

* name: store_export_equals_ledger
  flow_id: store_stepper_atomic_commit
  priority: high
  rationale: "Export outcomes must equal the ledger so copy/paste and debugging rely on P1-level guarantees."

* name: store_restart_policy_consistency
  flow_id: store_restart_session_clear_or_boundary
  priority: med
  rationale: "Restart actions must respect the configured policy and rotate session IDs so P2 remains provably true."
```

---

## OBJECTIVES COVERAGE

| Objective | Indicators | Why These Signals Matter |
|-----------|------------|--------------------------|
| Ledger truth and export parity | store_ledger_append_only_integrity, store_atomic_commit_integrity, store_export_equals_ledger | These indicators confirm that every release writes a new event, updates focus/explanation atomically, and that exports mirror the ledger so audits and user-facing summaries stay accurate. |
| Focus and timer coherence | store_single_focus_integrity, store_wait_timer_clamp_integrity | These signals keep the visible focus, glow, and timer bars in sync with the underlying state even during telemetry ingestion or fast clicking. |
| Restart policy fidelity | store_restart_policy_consistency | This indicator proves that manual restarts honor the configured boundary policy, reset the cursor, and rotate session identifiers so stale state never leaks. |

---

## STATUS (RESULT INDICATOR)

```
status:
  stream_destination: mind-marker:connectome/state_store/health
  result:
    representation: enum
    value: UNKNOWN
    updated_at: 2025-12-20T00:00:00Z
    source: health_check_ledger_is_append_only
```

This status entry is emitted to the Doctor health stream and is refreshed whenever the ledger integrity checker completes, so downstream tooling knows whether the metric is stable.

---

## DOCK TYPES (COMPLETE LIST)

- `event` — `dock_store_commit_action_invoked`, `dock_store_realtime_focus_updates`, `dock_store_session_restart` emit the timeline hooks that health listeners inspect before and after commits and restarts.
- `metric` — `dock_store_ledgers_synced` and `dock_store_retention_evictions` provide counters for exported ledger alignment and retention trimming.

These are the only dock types required for the state_store health harness, so we do not introduce custom categories beyond the standard ones above.

The explicit dock taxonomy above keeps the Doctor aligned with runtime signal sources, so every future health tweak should restate the dock IDs that feed the indicator ledger.

---

## CHECKER INDEX

```
checkers:

* name: health_check_ledger_is_append_only
  purpose: "Ensure ledger length never decreases and that no existing entry mutates around commit events."
  status: pending
  priority: high

* name: health_check_single_active_focus
  purpose: "Confirm that exactly one focus entry is published per commit or telemetry update."
  status: pending
  priority: high

* name: health_check_atomic_commit_updates_all_fields
  purpose: "Verify that ledger, focus, explanation, and timer data update within the same transaction."
  status: pending
  priority: high

* name: health_check_wait_timer_clamps_to_max_4_seconds
  purpose: "Assert that the wait timer respects the 4.0s clamp and 0.1 precision defined in VALIDATION V4."
  status: pending
  priority: med

* name: health_check_export_equals_ledger
  purpose: "Compare exported JSONL/text blobs against the ledger array to guarantee P1."
  status: pending
  priority: high

* name: health_check_restart_policy_consistency
  purpose: "Check that restart actions either clear the ledger or emit a boundary marker as dictated by the configured policy (P2)."
  status: pending
  priority: med
```

---

## INDICATOR: store_ledger_append_only_integrity

### VALUE TO CLIENTS & VALIDATION MAPPING

```yaml
value_and_validation:
  indicator: store_ledger_append_only_integrity
  client_value: "Operations and automation rely on the ledger never losing or rewriting entries so exports remain auditably correct."
  validation:
    - validation_id: V1
      criteria: "Within a session_id, ledger length never decreases and past entries never mutate."
    - validation_id: P1
      criteria: "Copy/export output equals store.ledger plus optional formatting metadata."
```

### HEALTH REPRESENTATION

```yaml
representation:
  allowed:
    - binary
    - enum
  selected:
    - binary
  semantics:
    binary: "1 = append-only holds, 0 = mutation or trimming detected."
  aggregation:
    method: "Binary AND across checkpoints; a single zero forces an alert."
    display: "The Doctor health badge surfaces green when the metric is 1 and red when 0."
```

### DOCKS SELECTED

```yaml
docks:
  input:
    id: dock_store_commit_action_invoked
    method: commit_step_release_append_event_and_set_focus_and_explanation
    location: docs/connectome/state_store/IMPLEMENTATION_Connectome_State_Store_Code_Structure_And_Zustand_Actions.md:102-117
  output:
    id: dock_store_ledgers_synced
    method: serializeLedgerToJsonl
    location: docs/connectome/state_store/IMPLEMENTATION_Connectome_State_Store_Code_Structure_And_Zustand_Actions.md:70-83
```

### ALGORITHM / CHECK MECHANISM

```yaml
mechanism:
  summary: "Compare the ledger before and after commit and ensure the exported blob equals the in-memory ledger."
  steps:
    - "Record the ledger length and hash exposed by the commit docking event before running the action."
    - "Allow the commit action to append the new FlowEvent and capture the metric the export serializer emits."
    - "Validate that the ledger length increased by exactly one, the previous entries still match their hashes, and the exported copy equals the ledger."
  data_required: "Ledger snapshots from docking telemetry and the JSONL/text serializer payload at export time."
  failure_mode: "Any deviation sets the indicator to 0 and triggers the `ledger_mutation` error."
```

### INDICATOR

```yaml
indicator:
  error:
    - name: ledger_mutation
      linked_validation: [V1]
      meaning: "Ledger entry mutated or removed after the commit action."
      default_action: page/alert/stop
  warning:
    - name: ledger_append_delay
      linked_validation: [V1]
      meaning: "Commit completed but the ledger length did not increase within two seconds, indicating backpressure."
      default_action: warn/log
  info:
    - name: ledger_append_snapshot
      linked_validation: [P1]
      meaning: "Ledger snapshot matches exported JSONL contents."
      default_action: log
```

### THROTTLING STRATEGY

```yaml
throttling:
  trigger: dock_store_commit_action_invoked
  max_frequency: 60/min
  burst_limit: 200
  backoff: "Double the delay after each consecutive failure to avoid log storms."
```

### FORWARDINGS & DISPLAYS

```yaml
forwarding:
  targets:
    - location: mind-marker:connectome/state_store/health
      transport: event
      notes: "Doctor reads the binary indicator from this stream."
display:
  locations:
    - surface: CLI / Doctor badge
      location: connectome health dashboard
      signal: green/red
      notes: "Green indicates append-only and red indicates mutating history."
```

### MANUAL RUN

```yaml
manual_run:
  command: pnpm connectome:health state_store --checker health_check_ledger_is_append_only
  notes: "Run after replaying Next clicks to confirm the ledger never shrinks and the export matches the in-memory copy."
```

---

## INDICATOR: store_atomic_commit_integrity

### VALUE TO CLIENTS & VALIDATION MAPPING

```yaml
value_and_validation:
  indicator: store_atomic_commit_integrity
  client_value: "UI coherence depends on ledger, focus, and explanation updating together so users never see mismatched states."
  validation:
    - validation_id: V2
      criteria: "active focus remains a single definitive selection."
    - validation_id: V3
      criteria: "Each step release appends to the ledger, updates focus, and updates explanation in the same commit."
```

### HEALTH REPRESENTATION

```yaml
representation:
  allowed:
    - enum
    - binary
  selected:
    - enum
  semantics:
    enum: "OK=all fields in sync, WARN=delayed commit, ERROR=partial field updates."
  aggregation:
    method: "ERROR dominates WARN and OK, ensuring partial commits bubble up immediately."
    display: "Status surfaces as OK/WARN/ERROR in the Connectome health timeline."
```

### DOCKS SELECTED

```yaml
docks:
  input:
    id: dock_store_commit_action_invoked
    method: commit_step_release_append_event_and_set_focus_and_explanation
    location: docs/connectome/state_store/IMPLEMENTATION_Connectome_State_Store_Code_Structure_And_Zustand_Actions.md:102-117
  output:
    id: dock_store_realtime_focus_updates
    method: commit_step_release_append_event_and_set_focus_and_explanation
    location: docs/connectome/state_store/IMPLEMENTATION_Connectome_State_Store_Code_Structure_And_Zustand_Actions.md:102-131
```

### ALGORITHM / CHECK MECHANISM

```yaml
mechanism:
  summary: "Ensure the commit action writes ledger entries and focus/explanation within a single transaction observable via docking telemetry."
  steps:
    - "Capture the post-commit focus/explanation payload emitted alongside the docking event."
    - "Compare that payload to the ledger entry and ensure both share the same `flow_event_id`."
    - "Mark the indicator WARN if the ledger entry arrives more than 500ms before the focus/explanation update, and ERROR if any field is missing."
  data_required: "Docking telemetry for commit action and the explanation payload that the store writes."
  failure_mode: "Partial commits set the enum to ERROR, which drives downstream tooling to halt renders until fixed."
```

### INDICATOR

```yaml
indicator:
  error:
    - name: atomic_commit_gap
      linked_validation: [V3]
      meaning: "Ledger, focus, and explanation did not update in the same commit."
      default_action: stop
  warning:
    - name: atomic_commit_lag
      linked_validation: [V2]
      meaning: "Focus or explanation lagged more than 500ms behind the ledger append."
      default_action: warn/log
  info:
    - name: atomic_commit_ok
      linked_validation: [V2, V3]
      meaning: "All required fields updated together."
      default_action: log
```

### THROTTLING STRATEGY

```yaml
throttling:
  trigger: dock_store_commit_action_invoked
  max_frequency: 60/min
  burst_limit: 120
  backoff: "After three consecutive WARN levels, back off to 1/min to allow manual investigation."
```

### FORWARDINGS & DISPLAYS

```yaml
forwarding:
  targets:
    - location: mind-marker:connectome/state_store/health
      transport: event
      notes: "Atomic commit states feed the same health stream as ledger integrity."
display:
  locations:
    - surface: CLI / log panel
      location: connectome health timeline
      signal: OK/WARN/ERROR
      notes: "Renderers pause updates when ERROR is surfaced so humans can diagnose."
```

### MANUAL RUN

```yaml
manual_run:
  command: pnpm connectome:health state_store --checker health_check_atomic_commit_updates_all_fields
  notes: "Trigger multiple Next clicks and confirm ledger, focus, and explanation remain coupled."
```

---

## INDICATOR: store_single_focus_integrity

### VALUE TO CLIENTS & VALIDATION MAPPING

```yaml
value_and_validation:
  indicator: store_single_focus_integrity
  client_value: "Observers must see exactly one focus entry so the viewer never highlights conflicting nodes or edges."
  validation:
    - validation_id: V2
      criteria: "active_focus.active_node_id and active_focus.active_edge_id stay singular unless explicitly pinned."
```

### HEALTH REPRESENTATION

```yaml
representation:
  allowed:
    - enum
  selected:
    - enum
  semantics:
    enum: "OK=exactly one focus, WARN=focus jitter, ERROR=multiple focus hints detected."
  aggregation:
    method: "ERROR outranks WARN so duplicates are immediately fatal."
    display: "Health timeline uses amber for WARN and red for ERROR."
```

### DOCKS SELECTED

```yaml
docks:
  input:
    id: dock_store_realtime_focus_updates
    method: append_realtime_event_and_update_focus_if_needed
    location: docs/connectome/state_store/IMPLEMENTATION_Connectome_State_Store_Code_Structure_And_Zustand_Actions.md:119-131
  output:
    id: dock_store_commit_action_invoked
    method: commit_step_release_append_event_and_set_focus_and_explanation
    location: docs/connectome/state_store/IMPLEMENTATION_Connectome_State_Store_Code_Structure_And_Zustand_Actions.md:102-117
```

### ALGORITHM / CHECK MECHANISM

```yaml
mechanism:
  summary: "Track focus updates from telemetry or commit actions and verify that only one node/edge remains marked active."
  steps:
    - "Listen for docking events that emit the new `active_focus` payload."
    - "Ensure there is no simultaneous non-null node_id and edge_id pair unless the focus is pinned."
    - "If a second focus arrives before the previous one clears, raise a WARN; if multiple persist, escalate to ERROR."
  data_required: "Docking telemetry for realtime focus updates and commit actions."
  failure_mode: "Duplicate focus entries set the enum to ERROR, which triggers an alert."
```

### INDICATOR

```yaml
indicator:
  error:
    - name: focus_duplicate_edge
      linked_validation: [V2]
      meaning: "Multiple focus entries exist concurrently."
      default_action: stop
  warning:
    - name: focus_jitter
      linked_validation: [V2]
      meaning: "Focus flips faster than 200ms, indicating jitter."
      default_action: warn/log
  info:
    - name: focus_singleton
      linked_validation: [V2]
      meaning: "Exactly one focus entry is visible."
      default_action: log
```

### THROTTLING STRATEGY

```yaml
throttling:
  trigger: dock_store_realtime_focus_updates
  max_frequency: 120/min
  burst_limit: 300
  backoff: "After five WARNs in a row, drop to 30/min to avoid log storms."
```

### FORWARDINGS & DISPLAYS

```yaml
forwarding:
  targets:
    - location: mind-marker:connectome/state_store/health
      transport: event
      notes: "Focus health events share the same stream as ledger checks."
display:
  locations:
    - surface: React Flow focus badge
      location: connectome focus overlay
      signal: OK/WARN/ERROR
      notes: "Displays amber jitter warnings directly on the node badge."
```

### MANUAL RUN

```yaml
manual_run:
  command: pnpm connectome:health state_store --checker health_check_single_active_focus
  notes: "Flip between telemetry and manual Next interactions to ensure focus never duplicates."
```

---

## INDICATOR: store_wait_timer_clamp_integrity

### VALUE TO CLIENTS & VALIDATION MAPPING

```yaml
value_and_validation:
  indicator: store_wait_timer_clamp_integrity
  client_value: "The wait timer needs to stay capped at 4.0 seconds and show one decimal place so the UI never lies to players."
  validation:
    - validation_id: V4
      criteria: "When wait_progress.started_at_ms is set, elapsed seconds are clamped to [0, 4.0] and display uses 0.1 precision."
```

### HEALTH REPRESENTATION

```yaml
representation:
  allowed:
    - enum
    - binary
  selected:
    - binary
  semantics:
    binary: "1 = timer within boundaries, 0 = drift or precision failure."
  aggregation:
    method: "Any drift sets the indicator to 0, signaling the UI to pause."
    display: "Binary state shows as green/red on the timer health panel."
```

### DOCKS SELECTED

```yaml
docks:
  input:
    id: dock_store_commit_action_invoked
    method: commit_step_release_append_event_and_set_focus_and_explanation
    location: docs/connectome/state_store/IMPLEMENTATION_Connectome_State_Store_Code_Structure_And_Zustand_Actions.md:102-117
  output:
    id: dock_store_realtime_focus_updates
    method: connectome_wait_timer_progress_and_tick_display_signal_selectors
    location: docs/connectome/state_store/IMPLEMENTATION_Connectome_State_Store_Code_Structure_And_Zustand_Actions.md:170-208
```

### ALGORITHM / CHECK MECHANISM

```yaml
mechanism:
  summary: "Compute elapsed seconds after each commit and ensure 0 ≤ value ≤ 4.0 with one decimal precision."
  steps:
    - "Capture the `wait_progress.started_at_ms` timestamp and current `now_ms` from docking telemetry."
    - "Clamp the computed seconds to [0, 4.0] and round to one decimal place."
    - "Compare the clamped value to what the selectors expose and flag mismatches."
  data_required: "Commit docking telemetry plus selector state that feeds the wait/tick widgets."
  failure_mode: "Any out-of-bound timer switches the indicator to 0 and marks the error state."
```

### INDICATOR

```yaml
indicator:
  error:
    - name: timer_drift
      linked_validation: [V4]
      meaning: "Elapsed seconds exceed 4.0 or are not rounded to one decimal."
      default_action: stop
  warning:
    - name: timer_clamp_warning
      linked_validation: [V4]
      meaning: "Timer was at the edge of the clamp and needs inspection."
      default_action: warn/log
  info:
    - name: timer_clamp_ok
      linked_validation: [V4]
      meaning: "Timer stays between 0 and 4.0 seconds with one decimal."
      default_action: log
```

### THROTTLING STRATEGY

```yaml
throttling:
  trigger: dock_store_commit_action_invoked
  max_frequency: 60/min
  burst_limit: 240
  backoff: "After the first ERROR, drop to 1/min to allow manual verification."
```

### FORWARDINGS & DISPLAYS

```yaml
forwarding:
  targets:
    - location: mind-marker:connectome/state_store/health
      transport: event
      notes: "Timer health signals share the same stream to keep the story coherent."
display:
  locations:
    - surface: Wait timer tooltip
      location: Connectome control surface
      signal: green/red
      notes: "Red when the timer drifts beyond four seconds."
```

### MANUAL RUN

```yaml
manual_run:
  command: pnpm connectome:health state_store --checker health_check_wait_timer_clamps_to_max_4_seconds
  notes: "Start and stop the wait timer repeatedly to ensure the clamp and precision hold."
```

---

## INDICATOR: store_export_equals_ledger

### VALUE TO CLIENTS & VALIDATION MAPPING

```yaml
value_and_validation:
  indicator: store_export_equals_ledger
  client_value: "Copy/paste exports must exactly match the ledger so writers and replay tools do not misrepresent events."
  validation:
    - validation_id: P1
      criteria: "Copy/export output equals store.ledger plus optional formatting metadata."
```

### HEALTH REPRESENTATION

```yaml
representation:
  allowed:
    - binary
  selected:
    - binary
  semantics:
    binary: "1 = export mirrors ledger, 0 = mismatch detected."
  aggregation:
    method: "Export comparison is binary because any mismatch invalidates the copy."
    display: "Doctor badge shows green when exports match and red when they diverge."
```

### DOCKS SELECTED

```yaml
docks:
  input:
    id: dock_store_ledgers_synced
    method: serializeLedgerToJsonl
    location: docs/connectome/state_store/IMPLEMENTATION_Connectome_State_Store_Code_Structure_And_Zustand_Actions.md:70-83
  output:
    id: dock_store_ledgers_synced
    method: serializeLedgerToJsonl
    location: docs/connectome/state_store/IMPLEMENTATION_Connectome_State_Store_Code_Structure_And_Zustand_Actions.md:70-83
```

### ALGORITHM / CHECK MECHANISM

```yaml
mechanism:
  summary: "Serialize the ledger and compare it entry-for-entry with the exported JSONL or text blob."
  steps:
    - "Trigger the export path and capture the JSONL/text output."
    - "Compare each serialized entry against the ledger array the store exposes."
    - "Flag a zero when the sequences differ or if metadata mismatches occur."
  data_required: "Ledger data from the store and the export task output."
  failure_mode: "Any discrepancy switches the indicator to 0 and surfaces the `export_mismatch` error."
```

### INDICATOR

```yaml
indicator:
  error:
    - name: export_mismatch
      linked_validation: [P1]
      meaning: "Exported data does not match the ledger entries."
      default_action: page/alert/stop
  warning:
    - name: export_latency
      linked_validation: [P1]
      meaning: "Export took longer than expected but still matched."
      default_action: warn/log
  info:
    - name: export_match
      linked_validation: [P1]
      meaning: "Export and ledger stay in lockstep."
      default_action: log
```

### THROTTLING STRATEGY

```yaml
throttling:
  trigger: dock_store_ledgers_synced
  max_frequency: 20/min
  burst_limit: 50
  backoff: "After a failure, restrict the export-only runs to 1/min until cleared."
```

### FORWARDINGS & DISPLAYS

```yaml
forwarding:
  targets:
    - location: mind-marker:connectome/state_store/health
      transport: event
      notes: "Export health shares the same stream for completeness."
display:
  locations:
    - surface: Copy/export dialog
      location: Connectome log panel
      signal: green/red
      notes: "Red highlight prompts users to retry the export."
```

### MANUAL RUN

```yaml
manual_run:
  command: pnpm connectome:health state_store --checker health_check_export_equals_ledger
  notes: "Run copy/export and compare the output to the live ledger to guarantee parity."
```

---

## INDICATOR: store_restart_policy_consistency

### VALUE TO CLIENTS & VALIDATION MAPPING

```yaml
value_and_validation:
  indicator: store_restart_policy_consistency
  client_value: "Restart actions must reset or boundary the session as configured so operators can rely on the chosen policy."
  validation:
    - validation_id: P2
      criteria: "After restart the cursor is zero, focus cleared, timers reset, session_id changes, and ledger behavior matches the policy."
```

### HEALTH REPRESENTATION

```yaml
representation:
  allowed:
    - enum
  selected:
    - enum
  semantics:
    enum: "OK=policy satisfied, WARN=partial reset, ERROR=policy ignored."
  aggregation:
    method: "ERROR overrides WARN to ensure only successful restarts are reported as OK."
    display: "Health timeline annotates restart events with the enum state."
```

### DOCKS SELECTED

```yaml
docks:
  input:
    id: dock_store_session_restart
    method: restart_session_clear_or_boundary
    location: docs/connectome/state_store/IMPLEMENTATION_Connectome_State_Store_Code_Structure_And_Zustand_Actions.md:133-144
  output:
    id: dock_store_session_restart
    method: restart_session_clear_or_boundary
    location: docs/connectome/state_store/IMPLEMENTATION_Connectome_State_Store_Code_Structure_And_Zustand_Actions.md:133-144
```

### ALGORITHM / CHECK MECHANISM

```yaml
mechanism:
  summary: "Verify the restart controller respects the selected policy (clear vs boundary) by checking cursor, focus, timers, and session_id after the docking event fires."
  steps:
    - "Listen for the restart docking event and capture the policy choice at the time of the trigger."
    - "After the docking event, confirm cursor==0, focus cleared, timers reset, and session_id rotated."
    - "If the ledger behavior does not match the policy, escalate to WARN or ERROR depending on severity."
  data_required: "Restart docking telemetry plus the resulting ledger and session metadata."
  failure_mode: "Policy mismatches drive the indicator into WARN/ERROR so operators can re-run the restart."
```

### INDICATOR

```yaml
indicator:
  error:
    - name: restart_policy_violation
      linked_validation: [P2]
      meaning: "Restart ignored the configuration and left the ledger or focus inconsistent."
      default_action: stop
  warning:
    - name: restart_partial
      linked_validation: [P2]
      meaning: "Restart cleared focus but left the ledger boundary incorrect."
      default_action: warn/log
  info:
    - name: restart_ok
      linked_validation: [P2]
      meaning: "Restart obeyed the policy and reset session metadata."
      default_action: log
```

### THROTTLING STRATEGY

```yaml
throttling:
  trigger: dock_store_session_restart
  max_frequency: 10/min
  burst_limit: 30
  backoff: "Limiter tracks manual restarts and prevents more than 30 events per minute."
```

### FORWARDINGS & DISPLAYS

```yaml
forwarding:
  targets:
    - location: mind-marker:connectome/state_store/health
      transport: event
      notes: "Restart signals join the main health stream for completeness."
display:
  locations:
    - surface: Restart modal
      location: Connectome UI
      signal: OK/WARN/ERROR
      notes: "Displays policy compliance so operators immediately see the result."
```

### MANUAL RUN

```yaml
manual_run:
  command: pnpm connectome:health state_store --checker health_check_restart_policy_consistency
  notes: "Trigger the restart button under both boundary and clear policies to see the enum state."
```

---

## HOW TO RUN

```
# Run all state_store health checks
pnpm connectome:health state_store

# Run a specific indicator checker only
pnpm connectome:health state_store --checker health_check_atomic_commit_updates_all_fields
```

---

## KNOWN GAPS

<!-- @mind:todo Dock locations are unknown until the runtime implementation wires each telemetry emitter, so the `location` fields above may require later updates when the scripts exist (file:line = ?). -->
<!-- @mind:todo Restart policy wiring is still in flux because policy A/B behavior has not been finalized, so the checks keep toggling between WARN and ERROR when the instrumentation is incomplete. -->

---

## MARKERS

<!-- @mind:todo Add a `commit_id` field that increments per atomic commit to make ledger comparison checks deterministic. -->
<!-- @mind:proposition Emit health status to a persistent log file so the Doctor can replay indicator deltas after crashes. -->
<!-- @mind:escalation Should exports include a `session_id` header to help downstream replay tooling recover after restarts? -->
