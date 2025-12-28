```

# flow_canvas — Implementation: Code Architecture and Structure

STATUS: DRAFT
CREATED: 2025-12-20
```

---

## CHAIN

```
PATTERNS:        ./PATTERNS_Connectome_Flow_Canvas_Pannable_Zoomable_Zoned_System_Map_Rendering_Patterns.md
BEHAVIORS:       ./BEHAVIORS_Connectome_Flow_Canvas_Readable_Stable_Interaction_Effects.md
ALGORITHM:       ./ALGORITHM_Connectome_Flow_Canvas_Layout_Zones_And_Edge_Label_Decluttering.md
VALIDATION:      ./VALIDATION_Connectome_Flow_Canvas_Invariants_For_Readability_And_Stability.md
THIS:            IMPLEMENTATION_Connectome_Flow_Canvas_Code_Structure_With_React_Flow_And_Zones.md
HEALTH:          ./HEALTH_Connectome_Flow_Canvas_Runtime_Verification_Of_Render_Stability_And_Perf_Budgets.md
SYNC:            ./SYNC_Connectome_Flow_Canvas_Sync_Current_State.md

IMPL:            app/connectome/components/pannable_zoomable_zoned_flow_canvas_renderer.tsx
IMPL:            app/connectome/components/deterministic_zone_and_node_layout_computation_helpers.ts
IMPL:            app/connectome/components/edge_label_declutter_and_visibility_policy_helpers.ts
```

---

## CODE STRUCTURE

```
app/connectome/components/pannable_zoomable_zoned_flow_canvas_renderer.tsx
app/connectome/components/deterministic_zone_and_node_layout_computation_helpers.ts
app/connectome/components/edge_label_declutter_and_visibility_policy_helpers.ts
```

### File Responsibilities

| File                                                        | Responsibility                              | Key Components/Exports                   |
| ----------------------------------------------------------- | ------------------------------------------- | ---------------------------------------- |
| `app/connectome/components/pannable_zoomable_zoned_flow_canvas_renderer.tsx`         | renders zones + nodes + edges with pan/zoom (WebGL) | `FlowCanvas`                             |
| `app/connectome/components/deterministic_zone_and_node_layout_computation_helpers.ts` | compute force layout + zones                | `computeZones`, `computeNodePositions`   |
| `app/connectome/components/edge_label_declutter_and_visibility_policy_helpers.ts`     | label placement offsets and zoom policy     | `computeLabelAnchors`, `shouldShowLabel` |

---

## DESIGN PATTERNS

* stable keyed elements (ids never change)
* force-directed layout seeded by zones
* camera controls: fit/reset/pan/zoom
* WebGL points/lines for scalable rendering

---

## ENTRY POINTS

| Entry Point                                 | Trigger                                   |
| ------------------------------------------- | ----------------------------------------- |
| `FlowCanvas()`                              | /connectome page render                   |
| `computeZones(viewport)`                    | on init and on resize                     |
| `computeNodePositions(nodes, zones)`        | on node list change (not on focus change) |
| `computeLabelAnchors(edges, nodePositions)` | on edge list change                       |

 ---

## SCHEMA

| Field               | Shape                                                                                     |
| ------------------- | ----------------------------------------------------------------------------------------- |
| `nodes`             | `ConnectomeNodeDefinition[]` (id, label, zone_id, type, ticks, energy metadata supplied by the runtime) |
| `edges`             | `ConnectomeEdgeDefinition[]` (id, source, target, call_type, trigger, energy, phase)      |
| `zones`             | Zone descriptors with `zone_id`, `name`, static bounds, and context layer order           |
| `camera`            | `{ x: number, y: number, zoom: number }` that drives the WebGL transform and label overlay |
| `active_focus`      | `{ active_node_id?: string; active_edge_id?: string }` populated by the stepper adapter   |
| `revealed_node_ids` | IDs that temporarily bypass LOD-based label hiding when search or telemetry forces them on |
| `revealed_edge_ids` | Edge IDs whose labels/pulses stay active despite camera zooming; shared with `node_kit` helpers |

Schema definitions live alongside the [Connectome Graph Manifest](../runtime_mind/IMPLEMENTATION_Connectome_Runtime_Engine_Code_Structure_And_Control_Surface.md) and the `flow_canvas` helpers so every renderer shares the same canonical contract.
`FlowCanvasProps` is declared inside `pannable_zoomable_zoned_flow_canvas_renderer.tsx` and pulls its schema directly from the store selectors so the render loop never invents a view that the runtime does not already own.

## DATA FLOW AND DOCKING (FLOW-BY-FLOW)

### store_projection_to_canvas

```
flow:
name: store_projection_to_canvas
purpose: lay down the WebGL canvas from the shared store projection.
steps:
- read nodes, edges, zones, revealed ids, active focus, and camera state through `useConnectomeStore` selectors.
- compute zones via `computeZones` (memoized) only when viewport dimensions change.
- compute node positions via `computeNodePositions`; reuse cached positions on focus-only changes.
- render WebGL points/lines and overlay labels using `computeLabelAnchors` and `edge_kit`/`node_kit` helpers.
- apply glow/pulse logic to the active focus and throttle updates via LOD helpers.
docking_points:
- `dock_canvas_rendered_edge_ids` (metric) lets HEALTH confirm no edges vanish post-render.
- `dock_camera_sync_changes` ensures navigation controls and camera state stay in lockstep.

### camera_control_events_to_store

```
flow:
name: camera_control_events_to_store
purpose: keep UI control surface gestures aligned with runtime camera state outbound from HEALTH dashboards.
steps:
- control surface actions dispatch camera deltas via the same helper that runtime focus updates use to set `camera`.
- throttled commits push those deltas into the store at most once per frame to avoid rattle.
- telemetry observers subscribe to the camera store slice and emit `dock_camera_user_event` when users repeatedly adjust view within a tick budget.
docking_points:
- `dock_camera_user_event` (telemetry) proves the UI control surface never jams the render loop or breaks the zoom throttle.
```
```

### focus_updates_to_camera

```
flow:
name: focus_updates_to_camera
purpose: keep the camera centered on the runtime-chosen focus without causing motion jitter.
steps:
- stepper runtime updates `active_focus` via the tied adapter in `state_store`.
- FlowCanvas selectors observe the delta and queue `fitCameraToNode` or `focusBump` helpers.
- camera controls emit `camera_on_change` events that reuse the same handlers, so UI events and runtime focus share the same chain.
- `requestAnimationFrame` syncs the transform update before redraw, avoiding partial renders.
docking_points:
- `dock_focus_cycles_for_health` (checkpoint) ensures focus transitions complete within budget.
```

### search_results_cycle

```
flow:
name: search_results_cycle
purpose: keep search-driven reveals consistent with LOD throttling.
steps:
- search API writes `search_results` and `revealed_*` slices into `useConnectomeStore`.
- FlowCanvas reads those slices, forcing matching nodes/edges to stay on despite zoom-based hiding.
- camera throttling logic nudges `active_focus` toward single-match results when the API indicates a primary hit.
- `state_store` atomic commits clear or refresh `revealed_*` when nodes drop out of scope so labels do not linger.
docking_points:
- `dock_search_reveal_latency` (health) confirms search hits arrive before the next tick.
```

## LOGIC CHAINS

* `FlowCanvas` mounts → subscribe to narrow selectors (nodes/edges/zones/focus/camera) → compute layout via the helper modules → pass data to WebGL renderer + overlay.
* Runtime stepper advances → `state_store` updates focus and graph metadata → FlowCanvas reuses cached positions, updates glow/pulses, and optionally calls `fit_to_view`.
* Camera control clicks funnel through the same handlers that runtime focus updates use, so UI gestures follow the same logic path.
* LOD overrides chain `revealed_*` slices into the label helpers so zoom thresholds only remove decorations after camera movement completes.
* Health and telemetry observers replay the rendered edge IDs and camera deltas so downstream dashboards can trace jitter, latency, or dropped labels back to the precise FlowCanvas cycle that produced them.

## MODULE DEPENDENCIES

| Module | Why it is required |
| --- | --- |
| `app/connectome/lib/zustand_connectome_state_store_with_atomic_commit_actions` | Canonical store for nodes/edges/focus/search slices plus atomic dispatchers. |
| `app/connectome/components/node_kit` | Typed node renders (badges, steps, tooltips) that FlowCanvas references when drawing overlays. |
| `app/connectome/components/edge_kit` | Edge renderers, label tokens, and pulse helpers used by the WebGL overlay on top of the canvas. |
| `app/connectome/components/page_shell_control_surface` | Camera control buttons and stepper wiring that trigger the same handlers as runtime focus updates. |
| `mind/runtime_engine` adapters | Emit FlowEvents that update the graph projection and focus data consumed by FlowCanvas via `state_store`. |
| [Connectome Graph Manifest](../runtime_mind/IMPLEMENTATION_Connectome_Runtime_Engine_Code_Structure_And_Control_Surface.md) | Defines `ConnectomeNodeDefinition`/`ConnectomeEdgeDefinition` schema referenced across helpers. |
| `app/connectome/components/telemetry_camera_controls.ts` | Synthesizes camera deltas and health pings so the FlowCanvas loops stay observable to dashboards. |

## STATE MANAGEMENT

FlowCanvas does not own application state; it only reads from the shared Zustand store. The store tracks graph metadata, focus targets, camera transforms, search results, and `revealed_*` toggles. All mutations flow through atomic commit actions so each transition (step advances, search, camera control, telemetry hits) leaves the data in a consistent bundle before FlowCanvas renders. Selective selectors keep rerenders scoped to the actual slices that change, and the atomic nature prevents half-applied focus/camera updates midway through a frame.
The store exposes `subscribeWithSelector` so the camera and focus slices can emit telemetry events without expensive re-renders, and every action that touches `revealed_*` or `camera` uses the same atomic dispatcher to avoid delta races.

## RUNTIME BEHAVIOR

Stepper advances write new `active_focus` records and edge pulses to the store, prompting FlowCanvas to highlight the updated node/edge, animate pulses, and optionally adjust the camera with `fitCameraToNode`. Zooming alters label density through `edge_label_declutter_*` helpers, yet `revealed_*` overrides keep critical nodes visible. Search hits reuse the same animation loops to avoid double renders, and camera controls share handler chains with runtime focus updates so the UX remains deterministic across telemetry, user input, and stepper-driven flows.
The runtime also throttles LOD transitions when the canvas reports heavy draw loads so the CL-5 indicator remains under budget while human analysts still see the right highlight and focus cues.

## CONCURRENCY MODEL

Rendering is single-threaded but orchestrated to avoid blocking. Layout computations (`computeNodePositions`, `computeZones`) are memoized and skip rerunning unless previews change, allowing React to commit before WebGL draws. The WebGL renderer consumes the latest camera state only on `requestAnimationFrame` to avoid tearing, and camera/focus updates queue through the store before React flushes to keep the DOM + canvas in sync. Health docking points observe the render completion and camera sync events, ensuring instrumentation can detect any race between state updates and visual commits.
Because the FlowCanvas work happens in the React commit phase, the concurrency surface is limited to synchronous commits and the async `requestAnimationFrame` draw; there are no background threads touching the mesh or label overlay, which keeps the model deterministic and easy to reason about.

---

## CONFIGURATION

| Config            | Default    |
| ----------------- | ---------- |
| `NODE_SPACING_X`  | 260        |
| `NODE_SPACING_Y`  | 180        |
| `LABEL_MIN_ZOOM`  | 0.8 (?)    |
| `ALLOW_NODE_DRAG` | false (v1) |

---

## BIDIRECTIONAL LINKS

* canvas TSX should reference this doc chain
* health harness should reference VALIDATION invariants

---

## MARKERS

* NOTE: custom WebGL renderer replaced React Flow for scalability
* IDEA: minimap toggle in top-right for navigation
