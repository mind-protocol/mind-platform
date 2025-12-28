```

# node_kit — Health: Runtime Verification of Node Signal Truthfulness

STATUS: DRAFT
CREATED: 2025-12-20
```

---

## PURPOSE OF THIS FILE

node_kit HEALTH ensures that nodes do not lie:

* active step highlight matches store.active_focus
* energy mapping buckets match deterministic rules
* wait/tick widgets respect bounds and precision
* node identity styling remains deterministic

This is not an aesthetics judge; it verifies trust signals.

---

## WHY THIS PATTERN

The node surface is the primary operator interface for Connectome, so runtime inconsistencies are immediately visible and therefore distracting. HEALTH keeps a small verification harness near the node rendering stack so we can detect when visual cues diverge from the validated invariants without changing production code. Anchoring every check to VALIDATION and IMPLEMENTATION docking points keeps the failure mode “tests pass but UI misleads” far away.

## HOW TO USE THIS TEMPLATE

1. Follow the full chain (OBJECTIVES → BEHAVIORS → PATTERNS → ALGORITHM → VALIDATION → IMPLEMENTATION → SYNC) to understand intent, invariants, and docking locations before writing checks.
2. Read each IMPLEMENTATION entry listed under this HEALTH doc so you know where selector data (active_focus, energy buckets, wait/tick values) flows through the render tree.
3. Pick flows where divergence would confuse humans (highlight singularity, energy buckets, timers) and design probes that compare rendered widgets back to VALIDATION V3–V6.
4. Throttle these probes, log outcomes to a dedicated stream or file, and equip CHECKERS with precise default actions so regression hunters can remedy issues quickly.
5. Document every indicator below so the next agent can follow the validation → indicator → checker chain without reading the code again.

---

## CHAIN

```
PATTERNS:        ./PATTERNS_Connectome_Node_Kit_Typed_Language_Coded_Energy_Aware_Node_Rendering_Patterns.md
BEHAVIORS:       ./BEHAVIORS_Connectome_Node_Kit_Visible_Clarity_And_Trust_Effects.md
ALGORITHM:       ./ALGORITHM_Connectome_Node_Kit_Node_Rendering_Spec_And_Energy_Glow_Mapping.md
VALIDATION:      ./VALIDATION_Connectome_Node_Kit_Invariants_For_Node_Readability_And_State_Reflection.md
IMPLEMENTATION:  ./IMPLEMENTATION_Connectome_Node_Kit_Component_Map_And_Styling_Tokens.md
THIS:            HEALTH_Connectome_Node_Kit_Runtime_Verification_Of_Node_State_And_Visual_Signal_Truth.md
SYNC:            ./SYNC_Connectome_Node_Kit_Sync_Current_State.md

IMPL:            ? (planned) scripts/connectome/health/node_kit_health_check_runner.ts
```

---

## FLOWS ANALYSIS (TRIGGERS + FREQUENCY)

```
flows_analysis:

* flow_id: node_focus_highlight_updates
  purpose: ensure active step highlight matches store state
  triggers:

  * type: manual
    source: runtime_engine Next click
    frequency:
    expected_rate: "human driven"
    risks:
  * "multiple active steps"
  * "highlight stuck on previous step"

* flow_id: node_energy_display_updates
  purpose: ensure energy mapping is deterministic and bounded
  triggers:

  * type: event
    source: state_store energy updates (derived from FlowEvents)
    frequency:
    expected_rate: "per step in stepper; high in realtime"
    risks:
  * "bucket mismatch"
  * "unbounded energy values"
```

---

## HEALTH INDICATORS SELECTED

```
health_indicators:

* name: node_active_step_singularity_integrity
  flow_id: node_focus_highlight_updates
  priority: high

* name: node_energy_color_bucket_integrity
  flow_id: node_energy_display_updates
  priority: med

* name: node_wait_progress_clamp_integrity
  flow_id: node_focus_highlight_updates
  priority: high

* name: node_tick_cron_progress_clamp_integrity
  flow_id: node_focus_highlight_updates
  priority: med
```

---

## OBJECTIVES COVERAGE

| Objective | Indicators | Why These Signals Matter |
|-----------|------------|--------------------------|
| Keep node highlight fidelity and badge colors in sync with the store so the canvas never lies about what function is active. | node_active_step_singularity_integrity, node_energy_color_bucket_integrity | Operators read the canvas first; these signals keep the map trustworthy even under churn. |
| Keep wait timers and tick cron indicators bounded and precise so pacing and chrono insights stay readable. | node_wait_progress_clamp_integrity, node_tick_cron_progress_clamp_integrity | Pacing decisions depend on these numbers; drift here would mislead message timing and physics pacing tools. |

Each objective explains why the corresponding indicators matter to humans and automation alike. When you rerun the harness, make sure every listed indicator still supplies the coverage promised here—highlight, energy, wait, and tick—before you call the node kit healthy again.

---

## STATUS (RESULT INDICATOR)

```
status:
  stream_destination: mind-marker:connectome.health.node_kit
  result:
    representation: binary
    value: 1
    updated_at: 2026-03-16T00:00:00Z
    source: node_active_step_singularity_integrity
```

The `binary` result flag is emitted by the CLI runner and forwarded to the `connectome.health.node_kit` stream so dashboards can spot regressions quickly; `1` means every checker passed and `0` means at least one indicator tripped. Update `updated_at` each time you re-run the CLI so topic subscribers know which run produced the current status.

---

## DOCK TYPES (COMPLETE LIST)

* `event` — listens to state_store active_focus, energy, and timer deltas.
* `process` — manual `pnpm connectome:health node_kit` probe execution.
* `metrics` — logs indicator results to the health stream for downstream monitoring.
* `stream` — health transcript output that feeds `connectome.health` dashboards.

The `event` docks tag the store selectors (`active_focus`, `energy_value`, `wait_progress`, `tick_display`) so every indicator knows where to read its inputs. The `metrics` and `stream` docks propagate binary/warn/error outcomes to dashboards and log files, letting the durability team watch for trends. Add `graph_ops` or `cache` docks later only if you need to read persisted snapshots or caching layers; the current harness focuses on runtime state so these four docks cover the observable signal paths.

Use `custom` only if standard types are insufficient (none needed here).

---

## CHECKER INDEX

```
checkers:

* name: health_check_only_one_step_is_highlighted_per_node
  purpose: "Assert V3: singular highlight."
  status: pending
  priority: high

* name: health_check_energy_value_maps_to_correct_bucket
  purpose: "Assert V4: energy->color mapping correct."
  status: pending
  priority: med

* name: health_check_wait_progress_seconds_bounded_and_precision
  purpose: "Assert V5: 0..4 and one decimal."
  status: pending
  priority: high

* name: health_check_tick_cron_progress_bounded
  purpose: "Assert V6: 0..1 and speed label correct."
  status: pending
  priority: med
```

---

## INDICATOR: node_active_step_singularity_integrity

### VALUE TO CLIENTS & VALIDATION MAPPING

```
value_and_validation:
  indicator: node_active_step_singularity_integrity
  client_value: Keeps each node step list readable so agents and humans can see which function owns the active focus without chasing multiple highlights.
  validation:
    - validation_id: V3
      criteria: At most one step per node is highlighted and only when active_step_key matches an actual step_id.
```

### HEALTH REPRESENTATION

```
representation:
  allowed:
    - binary
    - enum
  selected:
    - binary
  semantics:
    binary: 1 = exactly one step matches active_focus, 0 = multiple or no match (except when no step_key exists).
  aggregation:
    method: fail-fast (any 0 aborts the check)
    display: health console alert with red badge when 0.
```

### DOCKS SELECTED

```
docks:
  input:
    id: state_store_active_focus
    method: connectome_node_step_list_and_active_step_highlighter.StepList → useConnectomeStore
    location: app/connectome/components/node_kit/connectome_node_step_list_and_active_step_highlighter.tsx:29-45
  output:
    id: rendered_step_list
    method: StepList.rendered node-step DOM classes
    location: app/connectome/components/node_kit/connectome_node_step_list_and_active_step_highlighter.tsx:33-44
```

### ALGORITHM / CHECK MECHANISM

```
mechanism:
  summary: Compare the store.active_focus.active_step_key with the DOM class used for node steps and ensure exactly one match per node instance.
  steps:
    - capture active_step_key from the node_kit selector that the renderer already uses.
    - scan the rendered node-steps for `.node-step-active` classes.
    - assert that exactly one node-step matches the active_step_key per node and no duplicates appear.
  data_required: recorded active_step_key, rendered DOM step list.
  failure_mode: multiple active highlights or stuck highlights that contradict the store.
```

### INDICATOR

```
indicator:
  error:
    - name: highlight_confusion
      linked_validation: [V3]
      meaning: Two steps claim the active focus or no highlighted step appears while one should.
      default_action: stop automation, surface log to console, and raise `node_active_step_singularity_integrity` to 0.
  warning:
    - name: highlight_lag
      linked_validation: [V3]
      meaning: active_focus lagged by more than one render frame (highlight dirty bit not cleared).
      default_action: warn in health log and flag for manual review.
  info:
    - name: highlight_warmup
      linked_validation: [V3]
      meaning: render warmed up but not yet engaged with a step (expected after navigation).
      default_action: log only.
```

### THROTTLING STRATEGY

```
throttling:
  trigger: manual `pnpm connectome:health node_kit` or slow cron (1/min) so manual inspection remains responsive.
  max_frequency: 1/min
  burst_limit: 3
  backoff: exponential (double interval after consecutive failures).
```

### FORWARDINGS & DISPLAYS

```
forwarding:
  targets:
    - location: ./logs/connectome_health/node_kit.log
      transport: file
      notes: persisted record for regression review.
display:
  locations:
    - surface: CLI
      location: pnpm connectome:health node_kit output
      signal: warn/red when binary = 0
      notes: the log lines include node id + step label.
```

### MANUAL RUN

```
manual_run:
  command: pnpm connectome:health node_kit --checker health_check_only_one_step_is_highlighted_per_node
  notes: run whenever a node render change touches StepList or active_focus wiring.
```

---

## INDICATOR: node_energy_color_bucket_integrity

### VALUE TO CLIENTS & VALIDATION MAPPING

```
value_and_validation:
  indicator: node_energy_color_bucket_integrity
  client_value: Ensures energy badges never misreport intensity so attention can be routed to the true hot nodes.
  validation:
    - validation_id: V4
      criteria: Energy values map to deterministic colors and glow buckets.
```

### HEALTH REPRESENTATION

```
representation:
  allowed:
    - enum
    - tuple
  selected:
    - enum
  semantics:
    enum: OK = bucket matches store thresholds, WARN = bucket off by one, ERROR = bucket outside defined ranges.
  aggregation:
    method: worst-case (any ERROR surfaces immediately).
    display: thresholded color indicator in health logs.
```

### DOCKS SELECTED

```
docks:
  input:
    id: state_store_energy_values
    method: EnergyBadge → props.energy
    location: app/connectome/components/node_kit/connectome_energy_badge_bucketed_glow_and_value_formatter.tsx:1-60
  output:
    id: rendered_energy_badge
    method: EnergyBadge.glow + bucket class
    location: app/connectome/components/node_kit/connectome_energy_badge_bucketed_glow_and_value_formatter.tsx:20-60
```

### ALGORITHM / CHECK MECHANISM

```
mechanism:
  summary: Recompute the deterministic bucket for the store energy value and compare it with the rendered glow class or color.
  steps:
    - bucketize the store energy using ENERGY_BUCKET_THRESHOLDS (0.10 / 0.30 / 0.60).
    - sample the EnergyBadge DOM or rendered props to detect the applied bucket color/halo.
    - assert they agree; if not, mark indicator as WARN/ERROR depending on drift.
  data_required: store energy, rendered badge color.
  failure_mode: energy visual diverges from actual magnitude, confusing operators.
```

### INDICATOR

```
indicator:
  error:
    - name: bucket_mismatch
      linked_validation: [V4]
      meaning: Rendered badge confuses operators by showing a different bucket than the store.
      default_action: escalate to health log and block automation until the badge is fixed.
  warning:
    - name: bucket_off_by_one
      linked_validation: [V4]
      meaning: Rendering lags by 0.1 energy (one bucket) but still in the deterministic palette.
      default_action: log + notify telemetry team for timing tuning.
  info:
    - name: bucket_in_sync
      linked_validation: [V4]
      meaning: buckets match; nothing to do.
      default_action: log success.
```

### THROTTLING STRATEGY

```
throttling:
  trigger: event-driven (state_store energy update)
  max_frequency: 10/min (energy updates are frequent; coalesce by node)
  burst_limit: 20
  backoff: drop subsequent runs until the next level shift if repeated WARNs occur.
```

### FORWARDINGS & DISPLAYS

```
forwarding:
  targets:
    - location: mind-marker:connectome.health.energy
      transport: metrics
      notes: streaming status for dashboards.
display:
  locations:
    - surface: CLI
      location: pnpm connectome:health node_kit
      signal: green/yellow/red matching enum
      notes: includes node id + energy value + bucket.
```

### MANUAL RUN

```
manual_run:
  command: pnpm connectome:health node_kit --checker health_check_energy_value_maps_to_correct_bucket
  notes: run before deploying palette or energy-threshold tweaks.
```

---

## INDICATOR: node_wait_progress_clamp_integrity

### VALUE TO CLIENTS & VALIDATION MAPPING

```
value_and_validation:
  indicator: node_wait_progress_clamp_integrity
  client_value: Guarantees the player wait bar stays in [0.0,4.0] with one decimal so pacing signals never lie.
  validation:
    - validation_id: V5
      criteria: Wait progress clamps to 0..4 and renders with one decimal precision.
```

### HEALTH REPRESENTATION

```
representation:
  allowed:
    - binary
  selected:
    - binary
  semantics:
    binary: 1 = wait_time in range with correct precision, 0 = out-of-range or wrong decimal.
  aggregation:
    method: all nodes must pass; any failure flags the indicator.
    display: CLI result line showing 0/1 per node.
```

### DOCKS SELECTED

```
docks:
  input:
    id: state_store_wait_seconds
    method: PlayerWaitProgressBar → useConnectomeStore
    location: app/connectome/components/node_kit/connectome_player_wait_progress_bar_with_four_second_cap.tsx:1-28
  output:
    id: rendered_wait_bar
    method: PlayerWaitProgressBar DOM meter
    location: app/connectome/components/node_kit/connectome_player_wait_progress_bar_with_four_second_cap.tsx:29-45
```

### ALGORITHM / CHECK MECHANISM

```
mechanism:
  summary: Clamp the store wait seconds in 0..4, format to one decimal, and compare to the rendered meter text.
  steps:
    - clamp store value using WAIT_MAX_SECONDS = 4.0.
    - format to one decimal.
    - verify rendered text/meter matches formatted value and range.
  data_required: wait seconds from state_store, displayed text/meter value.
  failure_mode: wait value drifts outside range or loses precision, confusing pacing decisions.
```

### INDICATOR

```
indicator:
  error:
    - name: wait_out_of_bounds
      linked_validation: [V5]
      meaning: Wait bar exceeds 4.0 or drops below 0.0.
      default_action: fail and log with node id + deviating value.
  warning:
    - name: wait_precision_loss
      linked_validation: [V5]
      meaning: Rendered text has more than one decimal or rounds incorrectly.
      default_action: log for manual verification.
```

### THROTTLING STRATEGY

```
throttling:
  trigger: manual or low-frequency cron (30s) since timer updates are frequent but the clamp check is cheap.
  max_frequency: 2/min
  burst_limit: 4
  backoff: freeze after error until manual acknowledgement (health script flag).
```

### FORWARDINGS & DISPLAYS

```
forwarding:
  targets:
    - location: ./logs/connectome_health/node_kit.log
      transport: file
      notes: include node id + wait text for offline analysis.
display:
  locations:
    - surface: CLI
      location: pnpm connectome:health node_kit
      signal: red when wait_out_of_bounds fires.
```

### MANUAL RUN

```
manual_run:
  command: pnpm connectome:health node_kit --checker health_check_wait_progress_seconds_bounded_and_precision
  notes: run after changing player pacing or wait bar styling.
```

---

## INDICATOR: node_tick_cron_progress_clamp_integrity

### VALUE TO CLIENTS & VALIDATION MAPPING

```
value_and_validation:
  indicator: node_tick_cron_progress_clamp_integrity
  client_value: Ensures the cron ring stays between 0..1 and copies the store speed label so delivery timing remains consistent.
  validation:
    - validation_id: V6
      criteria: Tick progress within 0..1 and speed label matches store.
```

### HEALTH REPRESENTATION

```
representation:
  allowed:
    - binary
  selected:
    - binary
  semantics:
    binary: 1 when tick progress in range and label matches store_speed_label, 0 otherwise.
  aggregation:
    method: all nodes must comply; aggregated value is logical AND.
    display: CLI summary row with status per node.
```

### DOCKS SELECTED

```
docks:
  input:
    id: state_store_tick_progress
    method: TickCronRing → props.progress + speed_label
    location: app/connectome/components/node_kit/connectome_tick_cron_circular_progress_ring_with_speed_label.tsx:1-50
  output:
    id: rendered_cron_ring
    method: TickCronRing DOM arc + speed label text
    location: app/connectome/components/node_kit/connectome_tick_cron_circular_progress_ring_with_speed_label.tsx:51-90
```

### ALGORITHM / CHECK MECHANISM

```
mechanism:
  summary: Compare store tick progress and speed_label with the rendered cron ring arc percentage and label.
  steps:
    - clamp store progress to 0..1, and capture the stored speed label string.
    - read the rendered arc proportion (e.g., via data attributes) and label text.
    - assert both the arc percentage and label equal the clamped store data.
  data_required: store progress and speed_label, rendered arc+label.
  failure_mode: ring or label drifts, confusing tempo readers.
```

### INDICATOR

```
indicator:
  error:
    - name: cron_out_of_bounds
      linked_validation: [V6]
      meaning: Ring extends beyond 0..1 or label mismatches store_speed_label.
      default_action: halt automation + log error details.
  warning:
    - name: cron_label_lag
      linked_validation: [V6]
      meaning: Label lags but ring still in range.
      default_action: log and watch for repeat.
```

### THROTTLING STRATEGY

```
throttling:
  trigger: manual / 1/min cron; ring updates are tied to physics ticks, so cheap sampling is acceptable.
  max_frequency: 1/min
  burst_limit: 5
  backoff: pause after three consecutive failures until someone acknowledges in health logs.
```

### FORWARDINGS & DISPLAYS

```
forwarding:
  targets:
    - location: mind-marker:connectome.health.tick
      transport: metrics
      notes: aggregated tempo health for dashboards.
display:
  locations:
    - surface: CLI
      location: pnpm connectome:health node_kit
      signal: red when cron_out_of_bounds occurs.
```

### MANUAL RUN

```
manual_run:
  command: pnpm connectome:health node_kit --checker health_check_tick_cron_progress_bounded
  notes: run when cron ring styling, physics tick, or speed label wiring changes.
```

---

## HOW TO RUN

```
# Run all node_kit health checks (highlight, energy, wait, tick)
pnpm connectome:health node_kit

# Run a specific checker when you only touched one widget
pnpm connectome:health node_kit --checker health_check_only_one_step_is_highlighted_per_node
pnpm connectome:health node_kit --checker health_check_energy_value_maps_to_correct_bucket
pnpm connectome:health node_kit --checker health_check_wait_progress_seconds_bounded_and_precision
pnpm connectome:health node_kit --checker health_check_tick_cron_progress_bounded
```

Each command logs results to the CLI and to `./logs/connectome_health/node_kit.log` so you can keep a history of indicator trends.

Set `MIND_HEALTH_LOGS=./logs/connectome_health` or `HEALTH_LOG_DIR=./logs/connectome_health` before running to reroute logs elsewhere, and review the last three entries to confirm the binary/tong states settled before you push the change. If any check returns `0`, the CLI prints a stack trace with the offending node IDs so you can jump straight to the failing indicator (highlight, energy, wait, or cron) before rerunning.

---

## KNOWN GAPS

* [ ] Requires an implementation-level probe to read rendered “active step” state (test harness or DOM query).
* [ ] Energy range assumptions not finalized (may need normalization in state_store).

---

## MARKERS

* IDEA: expose a debug-only “rendered node snapshot” object to simplify HEALTH checks.

---
