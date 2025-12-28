
# log_panel — Health: Verification of Log Truth and Export Integrity

STATUS: DRAFT
CREATED: 2025-12-20

---

## PURPOSE OF THIS FILE

log_panel HEALTH verifies that:

* Now section corresponds to the last event
* duration coloring follows strict rules
* export equals ledger

This is critical because /connectome is meant for debugging and agent audits.

---

## WHY THIS PATTERN

The log_panel pattern is the canonical "truth window" in Connectome. Every operator glance, export copy, or agent audit now reads through this unified view, so a health harness that monitors its story prevents the whole experience from looking like a lie. Verifying the "Now" sentence, duration colors, and serializer output lets us keep PATTERNS and VALIDATION aligned with the lived UI instead of letting drift creep in.

---

## HOW TO USE THIS TEMPLATE

1. Walk the chain from PATTERNS through VALIDATION and IMPLEMENTATION before you add checks so you know what the invariants demand (Now vs. ledger truth, duration buckets, export ordering, and human-friendly Step labels).
2. Use the flows above to pick the signals you will observe—State store ledger updates for Now and duration badges, the serializer layers for exports—and capture both the store value and rendered output in every probe.
3. Treat each indicator as a declarative contract: document its inputs, how it maps to VALIDATION IDs, how it surfaces metrics, and which manual or automated runner touches it when something fails.
4. Throttle runs to avoid noise and keep the manual CLI available for regressions; the `CHECKER INDEX` entries describe the pieces that the `pnpm connectome:health log_panel` runner exercises.

---

## CHAIN

```
PATTERNS:        ./PATTERNS_Connectome_Log_Panel_Unified_Explain_And_Copyable_Event_Ledger_View_Patterns.md
BEHAVIORS:       ./BEHAVIORS_Connectome_Log_Panel_Step_Clarity_And_Copyable_Audit_Trail_Effects.md
ALGORITHM:       ./ALGORITHM_Connectome_Log_Panel_Log_Rendering_Duration_Coloring_And_Export.md
VALIDATION:      ./VALIDATION_Connectome_Log_Panel_Invariants_For_Truthful_Durations_And_Stable_Export.md
IMPLEMENTATION:  ./IMPLEMENTATION_Connectome_Log_Panel_Component_Structure_And_Serializer_Integration.md
THIS:            HEALTH_Connectome_Log_Panel_Runtime_Verification_Of_Log_Truth_And_Export_Integrity.md
SYNC:            ./SYNC_Connectome_Log_Panel_Sync_Current_State.md

IMPL:            ? (planned) scripts/connectome/health/log_panel_health_check_runner.ts
```

---

## FLOWS ANALYSIS (TRIGGERS + FREQUENCY)

```
flows_analysis:

* flow_id: log_panel_updates_on_step_release
  purpose: ensure Now and ledger stay synchronized
  triggers:

  * type: manual
    source: runtime_engine Next click
    frequency:
    expected_rate: "human driven"
    risks:
  * "Now sentence drift"
  * "wrong step count formatting"

* flow_id: log_panel_export
  purpose: ensure export is exact
  triggers:

  * type: manual
    source: Copy buttons
    frequency:
    expected_rate: "occasional"
    risks:
  * "missing events"
  * "wrong ordering"
```

---

## HEALTH INDICATORS SELECTED

```
health_indicators:

* name: log_now_matches_last_event_integrity
  flow_id: log_panel_updates_on_step_release
  priority: high

* name: log_duration_color_mapping_integrity
  flow_id: log_panel_updates_on_step_release
  priority: med

* name: log_export_equals_ledger_integrity
  flow_id: log_panel_export
  priority: high
```

---

## OBJECTIVES COVERAGE

| Objective | Indicators | Why These Signals Matter |
|-----------|------------|--------------------------|
| Keep the visible "Now" story consistent with the last ledger event and the expressed step count so operators never read stale explanations or shorthand step labels. | log_now_matches_last_event_integrity | A single, trustworthy "Now" sentence keeps every analyst confident that the panel is not lying about the active step or the reader count, which protects follow-up actions and audits. |
| Keep duration colors and export payloads faithful to the ledger so performance intuition and copy/paste audits stay actionable even under high churn. | log_duration_color_mapping_integrity, log_export_equals_ledger_integrity | Duration colors and export results are the two downstream touchpoints most likely to be copied into reports or automation tools; maintaining their fidelity stops cascading trust issues. |

Each objective links the indicator back to the validation contracts above. When you rerun the harness, confirm the same coverage still answers the question in the table before calling the panel healthy.

---

## STATUS (RESULT INDICATOR)

```
status:
  stream_destination: mind-marker:connectome.health.log_panel
  result:
    representation: binary
    value: 1
    updated_at: 2026-03-28T00:00:00Z
    source: log_now_matches_last_event_integrity
```

The binary result flag is emitted by the CLI runner and written to the `connectome.health.log_panel` stream. `1` means every checker passed in the latest run and `0` means at least one indicator has tripped; update `updated_at` each time you rerun the suite so subscribers know which run produced the current status.

Failure events also log a short explanation to `logs/connectome_health/log_panel.log` plus the CLI output so you can see which indicator and validation fired before you rerun the suite.

Metadata (indicator name, event id, duration bucket) is also sent through the `connectome.health.log_panel` stream so dashboards can correlate the binary `0` result with the failing validation without parsing raw logs.

---

## DOCK TYPES (COMPLETE LIST)

* `event` — reads from `state_store.ledger`, `state_store.current_explanation`, and `state_store.cursor` so each indicator knows where the raw data originates. These selectors also surface the FlowEvent metadata that anchors every explanation sentence.
* `process` — the manual `pnpm connectome:health log_panel` probe execution that drives the checkers and knobs for inspection. Shell wrappers can call these probes from CI so long as the same selectors are available.
* `metrics` — emits the binary indicator/clamp values to the `connectome.health.log_panel` stream and the CLI metrics log for dashboards. Include extra metadata (event id, duration bucket, checker name) so dashboards can correlate `0` readings with the broken validation.
* `display` — the CLI/marker dashboards and log surface that surface failures so humans can act quickly. The display dock also writes to `logs/connectome_health/log_panel.log` so reviewers can replay failure details later.

These docks cover every input/output path in the health harness. Add `custom` docks only if you need to ingest a new data source outside the state store (none needed right now).
Record any new dock here so future agents can track which signals feed which health indicator.

---

## CHECKER INDEX

```
checkers:

* name: health_check_now_sentence_corresponds_to_last_ledger_event
  purpose: "V1: Now corresponds to last event id/label and step label is explicit."
  status: pending

* name: health_check_duration_color_class_matches_thresholds
  purpose: "V3: duration -> color mapping correct."
  status: pending

* name: health_check_export_contains_all_ledger_events_in_order
  purpose: "V4: export equals ledger."
  status: pending
```

---

## INDICATOR: log_now_matches_last_event_integrity

### VALUE TO CLIENTS & VALIDATION MAPPING

```
value_and_validation:
  indicator: log_now_matches_last_event_integrity
  client_value: Keeps the "Now" sentence and Step X indicator tied to the most recent ledger event so humans and agents know exactly which step is active.
  validation:
    - validation_id: V1
      criteria: Now.explanation matches the last ledger event (same id/label).
    - validation_id: V2
      criteria: Step counter reads "Step X of Y" instead of shorthand that could mislead readers.
```

### HEALTH REPRESENTATION

```
representation:
  allowed:
    - binary
  selected:
    - binary
  semantics:
    binary: 1 = Now sentence maps to the last ledger entry and the Step summary uses the explicit wording; 0 = mismatch.
  aggregation:
    method: fail-fast (first mismatch triggers failure)
    display: health console badge + metrics stream.
```

### DOCKS SELECTED

```
docks:
  input:
    id: state_store_ledger_and_cursor
    method: useConnectomeStore().ledger and cursor selectors
    location: app/connectome/components/unified_now_and_copyable_ledger_log_panel.tsx:38-76
  output:
    id: rendered_now_sentence_and_step_label
    method: LogPanel.nowSection render
    location: app/connectome/components/unified_now_and_copyable_ledger_log_panel.tsx:80-110
```

### ALGORITHM / CHECK MECHANISM

```
mechanism:
  summary: Capture the store.cursor + ledger tail, derive the expected "Now" sentence and Step wording, and then compare them to the rendered text and classes in the Now section.
  steps:
    - capture the last ledger FlowEvent id/label when the cursor advances.
    - compute the expected explanation and "Step X of Y" text from the store.
    - inspect the rendered Now sentence + Step label for identical strings.
    - if anything diverges, mark the indicator as 0 and emit a failure.
  data_required: ledger tail, rendered Now DOM/text.
  failure_mode: mismatched sentences or shorthand step counters that mislead readers and automation alike.
```

### MANUAL RUN

```
manual_run:
  command: pnpm connectome:health log_panel --checker health_check_now_sentence_corresponds_to_last_ledger_event
  notes: run when the explanation sentence or Step label code changes (e.g., runtime_engine, flow events, or log panel rendering).
```

---

## INDICATOR: log_duration_color_mapping_integrity

### VALUE TO CLIENTS & VALIDATION MAPPING

```
value_and_validation:
  indicator: log_duration_color_mapping_integrity
  client_value: Ensures duration color cues never misreport latency so operators keep trusting the palette for pacing decisions.
  validation:
    - validation_id: V3
      criteria: duration_ms buckets map to the defined colors (muted/blue/yellow/orange/red).
```

### HEALTH REPRESENTATION

```
representation:
  allowed:
    - enum
  selected:
    - enum
  semantics:
    enum: OK = color matches bucket, WARN = bucket off by one, ERROR = color outside defined range.
  aggregation:
    method: worst-case (any ERROR surfaces immediately).
    display: CLI/health stream color-coded text.
```

### DOCKS SELECTED

```
docks:
  input:
    id: state_store_duration_buckets
    method: connectome log duration helper (duration formatting thresholds)
    location: app/connectome/components/connectome_log_duration_formatting_and_threshold_color_rules.ts:1-42
  output:
    id: rendered_duration_badge_color
    method: LogPanel duration badge classes
    location: app/connectome/components/unified_now_and_copyable_ledger_log_panel.tsx:120-170
```

### ALGORITHM / CHECK MECHANISM

```
mechanism:
  summary: Bucket the store duration, compute the expected CSS token, and compare it with the rendered duration badge.
  steps:
    - retrieve the FlowEvent duration_ms from the last ledger batch.
    - apply the duration scratch thresholds (<1s blue, <2s yellow, <3s orange, >=3s red).
    - check the CSS class on the rendered badge or the exported color token.
    - if they disagree, emit WARN or ERROR depending on whether the bucket is off by one or outside defined ranges.
  data_required: duration_ms, rendered color class, CSS token definition.
  failure_mode: colors mislead operators about latency and break timing heuristics.
```

### MANUAL RUN

```
manual_run:
  command: pnpm connectome:health log_panel --checker health_check_duration_color_class_matches_thresholds
  notes: run after adjusting duration thresholds or palette tokens.
```

---

## INDICATOR: log_export_equals_ledger_integrity

### VALUE TO CLIENTS & VALIDATION MAPPING

```
value_and_validation:
  indicator: log_export_equals_ledger_integrity
  client_value: Guarantees that the copy/export buttons produce the same sequence of events as the ledger so audits start from a known-good source.
  validation:
    - validation_id: V4
      criteria: Export JSONL/Text serialize every ledger FlowEvent in order (session header optional).
```

### HEALTH REPRESENTATION

```
representation:
  allowed:
    - binary
  selected:
    - binary
  semantics:
    binary: 1 = export matches ledger; 0 = missing events or reordered entries.
  aggregation:
    method: fail-fast (JSON/Text must both match).
    display: CLI/metrics stream + health log summary.
```

### DOCKS SELECTED

```
docks:
  input:
    id: state_store_ledger_serializer_hooks
    method: state_store.serializer.dump_ledger_as_jsonl + export helpers
    location: app/connectome/components/connectome_log_export_buttons_using_state_store_serializers.tsx:15-60
  output:
    id: clipboard/export payload
    method: copy export formatter
    location: app/connectome/components/connectome_log_export_buttons_using_state_store_serializers.tsx:30-70
```

### ALGORITHM / CHECK MECHANISM

```
mechanism:
  summary: Serialize the ledger exactly as the export buttons do, then compare serialized payloads to the raw ledger from the store.
  steps:
    - capture the latest ledger snapshot from state_store.
    - call the same serializer used for the JSONL/Text copy actions.
    - assert both the count and ordering of events match; include session header if present.
    - fail the indicator if any difference or missing fields appear.
  data_required: ledger snapshot, serializer output.
  failure_mode: copy/paste audits read stale or partial logs.
```

### MANUAL RUN

```
manual_run:
  command: pnpm connectome:health log_panel --checker health_check_export_contains_all_ledger_events_in_order
  notes: run before shipping copy/export changes or after serializer tweaks.
```

Forwarding & Displays:

```
forwarding:
  target: connectome.health.log_panel
  metadata: event_id, indicator, duration_bucket
  transport: marker stream + CLI log
```

Keep the stream entries in sync with the CLI output so the same failure report can be replayed from `logs/connectome_health/log_panel.log`.

Tag both channels (CLI log + marker stream) with the indicator name and event id so automation can replay the metadata from either viewport and tie it back to the ledger entry that triggered the failure.

Also include the `session_id` and `schema_version` fields in the stream metadata so consumers know which exporter version to use when replaying or parsing the log panel history.

---

## HOW TO RUN

```
pnpm connectome:health log_panel
```

Run this command from the repo root after starting the Connectome preview (`pnpm dev`). The CLI spins up the log panel health runner, exercises the Now/duration/export checkers through the same selectors/renderers used in production, and emits diagnostics to `stdout`, the `connectome.health.log_panel` stream, and `./logs/connectome_health`. Add `--checker <name>` to focus on a single indicator during debugging.

---

## KNOWN GAPS

* [ ] Needs DOM/test harness or snapshot probe to inspect rendered duration color classes.
* [ ] Export checks require serializer utilities to exist.

---

## MARKERS

* IDEA: export includes a deterministic header with session_id and schema version.

---
Each export failure also includes the first mismatched event id and serialization path in the logs so you can quickly trace the missing payload before rerunning the command.
