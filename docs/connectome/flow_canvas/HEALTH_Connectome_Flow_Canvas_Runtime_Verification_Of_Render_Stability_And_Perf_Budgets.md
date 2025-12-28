```

# flow_canvas — Health: Render Stability and Performance Budget Checks

STATUS: DRAFT
CREATED: 2025-12-20
```

---

## PURPOSE OF THIS FILE

This HEALTH file ensures the canvas remains a usable diagnostic tool as the diagram grows:

* no disappearing edges
* layout determinism under stepping
* basic performance budgets (frame time and rerender counts) (lightweight)

It does not validate aesthetics in detail (colors/glows are edge_kit/node_kit).

---

## WHY THIS PATTERN

The flow_canvas pattern is the canonical system map for Connectome, so its health signal must guard against layout drift, hidden edges, and broken camera navigation before humans or telemetry assume the canvas is truthful. Tying this health doc back to the VALIDATION invariants keeps camera motion, stepping, and edge rendering aligned instead of letting a graph viewer silently become untrustworthy.

## HOW TO USE THIS TEMPLATE

1. Walk the full PATTERN → BEHAVIORS → ALGORITHM → VALIDATION → IMPLEMENTATION → HEALTH → SYNC chain listed below so you know which invariants and selectors the renderer must honor before adding probes.
2. Review the flows and indicators here to choose the failure scenarios you intend to watch (camera moves, stepper ticks, edge attachments) and document how each field maps to a validation ID.
3. Instrument or stub the renderer outputs mentioned in the IMPLEMENTATION doc and map them back to these indicators; every new probe should reference one or more indicator blocks so future agents understand what the check guards.
4. Run the CLI probe, append structured metadata to `logs/connectome_health/flow_canvas.log`, and publish the binary result so dashboards can correlate `0` readings with the failing indicator.
5. Keep the checker index accurate and update the SYNC file whenever new indicators or checkers land so the chain never drifts.

## OBJECTIVES COVERAGE

| Objective | Indicators | Why These Signals Matter |
|-----------|------------|--------------------------|
| Keep the canvas topology consistent so analysts never chase phantom edges when zooming, panning, or stepping through FlowEvents. | canvas_edge_disappearance_detector, canvas_edge_attachment_and_visibility_integrity | These indicators prove the render target honors the network shape that the validation rules promise before any analysis touches it, keeping debugging grounded. |
| Maintain layout determinism during stepper transitions so reproducible narratives remain believable after each `Next` click. | canvas_layout_determinism_integrity | Determinism guarantees that stable runs, logs, and telemetry point at the same geometry so drift cannot hide regressions or mislead auditors. |

## STATUS (RESULT INDICATOR)

```
status:
  stream_destination: mind-marker:connectome.health.flow_canvas
  result:
    representation: binary
    value: 1
    updated_at: 2026-04-06T00:00:00Z
    source: canvas_edge_disappearance_detector
```

The binary result is emitted by the CLI runner, streamed via the `connectome.health.flow_canvas` topic, and stored in `logs/connectome_health/flow_canvas.log` so dashboards can correlate `0` readings with the causative indicator before rerunning the suite.

## DOCK TYPES (COMPLETE LIST)

* `event` — subscribes to pan/zoom camera transforms, node positions, and revealed edge lists so every indicator reads deterministic geometry directly from the store.
* `process` — the `pnpm connectome:health flow_canvas` CLI probe that drives the checkers, emits structured logs, and reruns the renderer so automated tooling can verify stability.
* `metrics` — forwards indicator names, failure reasons, and binary results to the health stream plus log files so observers can plot trends.
* `display` — the CLI console/marker dashboards that surface failure badges and the WebGL overlay that highlights missing edges when a check fails.
* `stream` — forwards camera transform snapshots and indicator metadata into `connectome.health.flow_canvas` so dashboards can correlate binary flags with the rendered view state.


---

## CHAIN

```
PATTERNS:        ./PATTERNS_Connectome_Flow_Canvas_Pannable_Zoomable_Zoned_System_Map_Rendering_Patterns.md
BEHAVIORS:       ./BEHAVIORS_Connectome_Flow_Canvas_Readable_Stable_Interaction_Effects.md
ALGORITHM:       ./ALGORITHM_Connectome_Flow_Canvas_Layout_Zones_And_Edge_Label_Decluttering.md
VALIDATION:      ./VALIDATION_Connectome_Flow_Canvas_Invariants_For_Readability_And_Stability.md
IMPLEMENTATION:  ./IMPLEMENTATION_Connectome_Flow_Canvas_Code_Structure_With_React_Flow_And_Zones.md
THIS:            HEALTH_Connectome_Flow_Canvas_Runtime_Verification_Of_Render_Stability_And_Perf_Budgets.md
SYNC:            ./SYNC_Connectome_Flow_Canvas_Sync_Current_State.md

IMPL:            ? (planned) scripts/connectome/health/flow_canvas_health_check_runner.ts
```

---

## FLOWS ANALYSIS (TRIGGERS + FREQUENCY)

```
flows_analysis:

* flow_id: canvas_stepper_render_updates
  purpose: ensure stepping never hides edges
  triggers:

  * type: manual
    source: runtime_engine Next click
    frequency:
    expected_rate: "human driven"
    peak_rate: "rapid clicking"
    risks:
  * "edge disappearance"
  * "layout jitter"
  * "label collisions"
    notes: "edge disappearance is the primary v1 failure"

* flow_id: canvas_camera_changes
  purpose: ensure pan/zoom never detaches edges
  triggers:

  * type: manual
    source: pan/zoom gestures + fit-to-view
    frequency:
    expected_rate: "frequent during use"
    risks:
  * "edge endpoint drift"
  * "label misplacement"
    ```

---

## HEALTH INDICATORS SELECTED

```
health_indicators:

* name: canvas_edge_disappearance_detector
  flow_id: canvas_stepper_render_updates
  priority: high
  rationale: "If edges vanish, the instrument is broken."

* name: canvas_layout_determinism_integrity
  flow_id: canvas_stepper_render_updates
  priority: high
  rationale: "No node jitter during stepping."

* name: canvas_edge_attachment_and_visibility_integrity
  flow_id: canvas_camera_changes
  priority: high
  rationale: "Pan/zoom must not break attachment."
  ```

---

## CHECKER INDEX

```
checkers:

* name: health_check_edges_present_after_each_step
  purpose: "After each step release, assert all expected edge ids are still rendered."
  status: pending
  priority: high

* name: health_check_node_positions_stable_under_stepper
  purpose: "Assert node positions unchanged while stepping."
  status: pending
  priority: high

* name: health_check_edge_endpoints_attach_to_node_bounds
  purpose: "Sample endpoints and assert they are within tolerance of node bounds."
  status: pending
  priority: high
  ```

---

## INDICATOR: canvas_edge_disappearance_detector

### VALUE TO CLIENTS & VALIDATION MAPPING

```
value_and_validation:
  indicator: canvas_edge_disappearance_detector
  client_value: Keeps every rendered edge present even during frantic stepper or camera updates so operators never chase a topology that vanished.
  validation:
    - validation_id: V1
      criteria: Camera pans/zooms preserve nodes and edges without detached endpoints.
    - validation_id: E1
      criteria: No edge disappears when stepping or rerendering.
```

### HEALTH REPRESENTATION

```
representation:
  allowed:
    - binary
  selected:
    - binary
  semantics:
    binary: 1 = all expected edges remain visible and attached, 0 = any edge id was dropped between renders.
  aggregation:
    method: fail-fast (first missing edge stops the run)
    display: metrics stream + CLI badge (red when 0).
```

### DOCKS SELECTED

```
docks:
  input:
    id: connectome_flow_canvas_expected_edges
    method: revealedEdgeIds + merged edge definitions from the renderer
    location: app/connectome/components/pannable_zoomable_zoned_flow_canvas_renderer.tsx:171-210
  output:
    id: rendered_canvas_edge_index
    method: WebGL draw list and edges[] array before each render flush
    location: app/connectome/components/pannable_zoomable_zoned_flow_canvas_renderer.tsx:200-330
```

## INDICATOR: canvas_layout_determinism_integrity

### VALUE TO CLIENTS & VALIDATION MAPPING

```
value_and_validation:
  indicator: canvas_layout_determinism_integrity
  client_value: Ensures repeated stepper releases reproduce identical node/edge geometry so logs and exports are comparable across sessions.
  validation:
    - validation_id: V2
      criteria: Given identical payloads, node positions remain stable while only styling flags flip during stepper transitions.
```

### HEALTH REPRESENTATION

```
representation:
  allowed:
    - binary
  selected:
    - binary
  semantics:
    binary: 1 = deterministic layout replayed exactly; 0 = geometry drifts without payload changes.
  aggregation:
    method: fail-fast
    display: CLI warning + health stream note on layout delta.
```

### DOCKS SELECTED

```
docks:
  input:
    id: node_layout_positions
    method: compute_node_positions → deterministic_zone_and_node_layout_computation_helpers
    location: app/connectome/components/deterministic_zone_and_node_layout_computation_helpers.ts:1-120
  output:
    id: rendered_node_positions
    method: WebGL vertex buffer snapshot
    location: app/connectome/components/pannable_zoomable_zoned_flow_canvas_renderer.tsx:128-180
```

## INDICATOR: canvas_edge_attachment_and_visibility_integrity

### VALUE TO CLIENTS & VALIDATION MAPPING

```
value_and_validation:
  indicator: canvas_edge_attachment_and_visibility_integrity
  client_value: Verifies that pan/zoom and camera moves never detach edges from their nodes and that they remain within viewable bounds.
  validation:
    - validation_id: V1
      criteria: Camera motions keep nodes and edges coherent without drifting endpoints or disappearing lines.
    - validation_id: V4
      criteria: Zones render behind nodes and never occlude the edges that flow through them.
```

### HEALTH REPRESENTATION

```
representation:
  allowed:
    - binary
  selected:
    - binary
  semantics:
    binary: 1 = edges stay attached and visible; 0 = any edge crosses outside node bounds or vanishes.
  aggregation:
    method: fail-fast
    display: CLI badge + stream metric note linking to the failing edge id.
```

### DOCKS SELECTED

```
docks:
  input:
    id: camera_transform
    method: panned_camera_store.transform → useConnectomeStore
    location: app/connectome/components/pannable_zoomable_zoned_flow_canvas_renderer.tsx:195-240
  output:
    id: visible_edge_buffer
    method: WebGL line batch clipped to viewport
    location: app/connectome/components/pannable_zoomable_zoned_flow_canvas_renderer.tsx:241-320
```

## HOW TO RUN

```
pnpm connectome:health flow_canvas
```

Run this command from the repository root so it resolves the WebGL renderer, then review `logs/connectome_health/flow_canvas.log` plus the CLI console output to see which indicator and validation ID produced the binary status. Repeat after any layout, stepper, or camera change so the probe reflects the latest render state.

---

## KNOWN GAPS

* [ ] requires an implementation-level probe to detect “rendered edges” (React Flow hook or test harness)
* [ ] label overlap measurement not defined yet

---

## MARKERS

* IDEA: instrument render counts per step and warn if too many rerenders
* QUESTION: do we define a frame budget threshold now (e.g., 16ms) or defer?

---

---
