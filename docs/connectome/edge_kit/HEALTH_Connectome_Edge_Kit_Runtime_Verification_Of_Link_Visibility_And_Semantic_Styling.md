```

# edge_kit — Health: Link Visibility and Semantic Styling Verification

STATUS: DRAFT
CREATED: 2025-12-20
```

---

## PURPOSE OF THIS FILE

edge_kit HEALTH ensures links do not lie or vanish:

* correct dash for trigger
* correct color for call type
* labels readable and not bold
* pulses obey min duration and boundary clamps
* active edge persistence

---

## WHY THIS PATTERN

Edge kit HEALTH locks the runtime verification narrative to the semantic palette, trigger-to-dash rules, and pulse invariants that the PATTERNS and VALIDATION chains promise. When flows become real and edges pulse across the canvas, the signals that operators read must stay aligned with the canonical story; this doc defends that promise by describing what to monitor, which indicators map back to V1–V6, and how to surface alerts before a node or flow can lie about energy transfer.

## HOW TO USE THIS TEMPLATE

1. Read the full chain (PATTERNS → BEHAVIORS → ALGORITHM → VALIDATION → IMPLEMENTATION → SYNC) before adding probes so you understand the lexicon of triggers, call types, and pulse motion this health file references.
2. Follow the IMPLEMENTATION docking map to locate the selectors, tokens, and render helpers mentioned above; every probe should sample the same data path the front-end already relies on.
3. Choose flows whose breakage would confuse operators—trigger color, call type, active persistence, and boundary clamping—and describe the indicators you will emit for them in the sections below.
4. Document each indicator, dock, and mechanism so the next agent can trace a failing checker back to the validation criterion it violated.
5. Keep the CHECKER INDEX, STATUS, and DOCK TYPES lists synced with the detection harness that emits the `connectome.health.edge_kit` stream.

---

## CHAIN

```
PATTERNS:        ./PATTERNS_Connectome_Edge_Kit_Color_Coded_Trigger_Typed_Directional_Link_Styling_Patterns.md
BEHAVIORS:       ./BEHAVIORS_Connectome_Edge_Kit_Readable_Directional_And_Truthful_Link_Effects.md
ALGORITHM:       ./ALGORITHM_Connectome_Edge_Kit_Edge_Rendering_Pulse_Shine_And_Label_Placement_Rules.md
VALIDATION:      ./VALIDATION_Connectome_Edge_Kit_Invariants_For_Color_Dash_And_Pulse_Truth.md
IMPLEMENTATION:  ./IMPLEMENTATION_Connectome_Edge_Kit_Component_Map_And_Render_Tokens.md
THIS:            HEALTH_Connectome_Edge_Kit_Runtime_Verification_Of_Link_Visibility_And_Semantic_Styling.md
SYNC:            ./SYNC_Connectome_Edge_Kit_Sync_Current_State.md

IMPL:            ? (planned) scripts/connectome/health/edge_kit_health_check_runner.ts
```

---

## FLOWS ANALYSIS (TRIGGERS + FREQUENCY)

```
flows_analysis:

* flow_id: edge_render_on_step_release
  purpose: verify active edge styling and pulse behavior
  triggers:

  * type: manual
    source: runtime_engine Next click
    frequency:
    expected_rate: "human driven"
    risks:
  * "edge disappears"
  * "wrong dash/color"
  * "pulse too fast"
  * "pulse goes through nodes"
    ```

---

## HEALTH INDICATORS SELECTED

```
health_indicators:

* name: edge_semantic_style_mapping_integrity
  flow_id: edge_render_on_step_release
  priority: high

* name: edge_visibility_integrity
  flow_id: edge_render_on_step_release
  priority: high

* name: edge_pulse_endpoint_clamp_integrity
  flow_id: edge_render_on_step_release
  priority: med
  ```

---


## OBJECTIVES COVERAGE

| Objective | Indicators | Why These Signals Matter |
|-----------|------------|--------------------------|
| Preserve the trigger-to-dash and call type color determinism so link styles never lie about the semantic vocabulary they promise. | `edge_semantic_style_mapping_integrity` | Operators read call_type colors and trigger dashes to infer author intent; this indicator keeps that semantic shorthand trustworthy even when pulses animate rapidly. |
| Keep pulses clamped to node boundaries and long enough for directionality so the energy transfer remains visible while respecting topology. | `edge_pulse_endpoint_clamp_integrity` | When pulses bleed through or vanish too soon, viewers can no longer trace energy flows; clamping and duration ensure the canvas still matches the VALIDATION invariants. |
| Ensure active edges stay visible until the next step and no edges vanish between renders so the persistence story is intact. | `edge_visibility_integrity` | Persistent visibility and survivable renders keep analysts confident that they are watching the latest energy transfer instead of a stale or missing edge. |

## STATUS (RESULT INDICATOR)

```
status:
  stream_destination: mind-marker:connectome.health.edge_kit
  result:
    representation: binary
    value: 1
    updated_at: 2026-05-05T00:00:00Z
    source: edge_visibility_integrity
```

The `binary` status stream is emitted by the health runner and pushed to `connectome.health.edge_kit`; `1` signals every indicator passed and `0` flags at least one failing signal. Keep `updated_at` current so dashboards know how fresh the observation is, and update `source` to the most influential indicator when you run new checks.

## DOCK TYPES (COMPLETE LIST)

* `event` — captures selector deltas (`trigger`, `call_type`, `active_focus`, `pulse_geometry`) before the renderer picks colors and dash styles.
* `process` — manual `pnpm connectome:health edge_kit` probes that snapshot rendered edges, logs, and result codes.
* `metrics` — health stream payloads or files that downstream monitors consume to trace indicator flips over time.
* `stream` — the `connectome.health.edge_kit` topic where the binary status and per-indicator detail are published for dashboards.

These dock types cover the data ingress (events), the probe execution, and the outputs that instruments and dashboards consume. Add additional dock types (e.g., `graph_ops` or `cache`) only when new sources beyond the renderer are probed.

---

## CHECKER INDEX

```
checkers:

* name: health_check_trigger_maps_to_correct_dash_style
  purpose: "V1: direct/stream/async mapping."
  status: pending

* name: health_check_calltype_maps_to_correct_color
  purpose: "V2: color mapping."
  status: pending

* name: health_check_edge_labels_not_bold_and_have_halo
  purpose: "V3: readability."
  status: pending

* name: health_check_pulse_duration_minimum
  purpose: "V4: >=200ms."
  status: pending

* name: health_check_pulse_stops_at_node_boundary
  purpose: "V5: boundary clamp."
  status: pending

* name: health_check_active_edge_persists_until_next_step
  purpose: "V6: persistence."
  status: pending

* name: health_check_no_edges_disappear_on_step
  purpose: "E2: visibility integrity."
  status: pending
  ```

---

## HOW TO RUN

Run this from the repo root while `npm run dev` (or the production preview) keeps the Connectome canvas alive; the CLI needs live rendering to read styles, pulse paths, and active edge flags, then it ships the result into `logs/connectome_health` plus the `connectome.health.edge_kit` stream.

```
pnpm connectome:health edge_kit
```

---

## KNOWN GAPS

* [ ] Requires a render-probe to extract computed edge styles and label font weight.
* [ ] Boundary intersection checks need geometry probes from flow_canvas.

---

## MARKERS

* IDEA: expose a debug object per rendered edge to avoid brittle DOM tests.

---

---
