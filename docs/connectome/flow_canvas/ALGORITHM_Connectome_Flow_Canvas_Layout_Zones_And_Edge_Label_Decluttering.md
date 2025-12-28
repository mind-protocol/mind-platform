```

# flow_canvas — Algorithm: Zones, Layout, and Label Decluttering

STATUS: DRAFT
CREATED: 2025-12-20
VERIFIED: 2025-12-20 against ?
```

---

## CHAIN

```
PATTERNS:        ./PATTERNS_Connectome_Flow_Canvas_Pannable_Zoomable_Zoned_System_Map_Rendering_Patterns.md
BEHAVIORS:       ./BEHAVIORS_Connectome_Flow_Canvas_Readable_Stable_Interaction_Effects.md
THIS:            ALGORITHM_Connectome_Flow_Canvas_Layout_Zones_And_Edge_Label_Decluttering.md (you are here)
VALIDATION:      ./VALIDATION_Connectome_Flow_Canvas_Invariants_For_Readability_And_Stability.md
IMPLEMENTATION:  ./IMPLEMENTATION_Connectome_Flow_Canvas_Code_Structure_With_React_Flow_And_Zones.md
HEALTH:          ./HEALTH_Connectome_Flow_Canvas_Runtime_Verification_Of_Render_Stability_And_Perf_Budgets.md
SYNC:            ./SYNC_Connectome_Flow_Canvas_Sync_Current_State.md
```

---

## OVERVIEW

The canvas renders a stable projection:

* zones are rectangles with titles
* nodes are positioned by force-directed layout (seeded by zones)
* edges route between nodes with stable ids
* label placement is consistent and avoids overlap as much as possible

---

## OBJECTIVES AND BEHAVIORS

The connectome flow canvas must feel like a reliable operating console: readout labels stay legible while zooming, simultaneous pan/zoom gestures keep the focus locked to the current step, and the projection keeps the runtime intent explicit instead of fading into a static graph. By honoring these objectives we reinforce the BEHAVIORS contract (readability, stable glow, anti-disappearance) and allow the canvas to behave predictably whenever the engine state changes or the user commands a reset.

The surface should also reflect instrumentation demand: rendering refreshes log the active camera state so health checks can replay where edges *should* be, while focus glows & energy pulses keep the runtime traceable to the steps listed in the stepper panel.

---

## ALGORITHM: `render_flow_canvas_frame(store_state, camera, interaction_queue)`

1. Read the latest `nodes`, `edges`, `zones`, and `active_focus` from `store_state` selectors so the projection matches the runtime stepper.
2. Invoke `compute_zone_layout(viewport)` to anchor the contextual backdrops, then call `place_nodes_with_force_layout` with zonal seeds to compute stable node coordinates.
3. Run `route_edges_and_place_labels` so every connector has a deterministic curve and label candidate, applying declutter offsets before the renderer touches the edge layer.
4. Apply `apply_camera_transform(camera, world_coords)` to produce screen coordinates, draw zones first, then nodes, and finally edges so interactions hit nodes last while lines remain visible.
5. Feed `interaction_queue` events (pan/zoom/resets) back to the state store so the next tick starts with updated camera deltas and the proven objectives continue to hold.

Each step also emits telemetry events (`flow_canvas.render.commit`, `flow_canvas.camera.delta`) so the health probes have a docking point when verifying no edges disappeared or camera resets jump.

---

## DATA STRUCTURES

### `ZoneLayout`

```
ZoneLayout:
zone_id: FRONTEND|BACKEND|GRAPH|AGENTS
x: number
y: number
width: number
height: number
title: string
```

### `NodeLayout`

```
NodeLayout:
node_id: string
zone_id: ZoneLayout.zone_id
x: number
y: number
width: number
height: number
```

### `EdgeLayout`

```
EdgeLayout:
edge_id: string
from_node_id: string
to_node_id: string
label_anchor: {x,y}
route: polyline|bezier (implementation choice)
```

---

## ALGORITHM: `compute_zone_layout(viewport)`

V1 deterministic zone coordinates:

```
FRONTEND: x=40,  y=40,  w=420, h=520
BACKEND:  x=520, y=40,  w=520, h=720
GRAPH:    x=1080,y=40,  w=420, h=520
AGENTS:   x=1080,y=600, w=420, h=260
```

These are tuned for readability and spacing; they scale with viewport.

---

## ALGORITHM: `place_nodes_with_force_layout(nodes, edges, zones)`

* seed nodes near their zone (optional)
* run force-directed layout with Barnes-Hut acceleration
* iteration count scales with node count for performance

```
forceManyBody.strength = -240
forceLink.distance = 220
forceLink.strength = 0.08
iterations =
  if nodes > 800: 120
  else if nodes > 300: 180
  else: 260
```

Place nodes by:

* initial positions from zone seeds
* force simulation ticks to settle
* clamp to view bounds if needed (optional v1)

---

## ALGORITHM: `route_edges_and_place_labels(edges, node_layouts)`

Edge routing choice for v1:

* bezier curves with consistent curvature direction
* label anchored at 55% of curve length
* label background halo provided by edge_kit (render concern)

Label declutter heuristic (v1 minimal, stable):

* if two labels are within radius R, offset the newer one by (+0, +18) repeatedly up to 3 times
* if still colliding: mark `label_visibility="active_only"` when zoomed out (policy)

---

## ALGORITHM: `apply_camera_transform(camera, world_coords)`

* camera: {pan_x, pan_y, zoom}
* world→screen transform applied by rendering library

Must preserve:

* stable edge endpoints at node boundaries
* no viewBox recompute races

---

## KEY DECISIONS

* Deterministic zone rectangles keep semantic context consistent across renders, reinforcing analytics workflows and preventing the layout from jumping when nodes shuffle.
* Force-directed placement seeded near zone centers allows density to grow while still keeping the camera focus predictable, so we do not rely on manual drag-and-drop.
* Label decluttering is handled by adaptive offsets with a final visibility gate rather than hiding entire connections, so the invariant that edges remain readable under zoom is upheld.
* Every render step emits telemetry (camera, nodes, labels) tied to `flow_canvas.render.commit` and `flow_canvas.camera.delta` so downstream health checks can assert the surface stays within the documented invariants.

---

## DATA FLOW

Canvas rendering is driven by a narrow data pipeline: the runtime engine updates `state_store` with `nodes/edges/zones/active_focus`, selectors expose that snapshot to the canvas component, and the algorithm chain here transforms it through layout + routing before the rendering layer writes the results into the WebGL context and overlay DOM labels. Camera events flow back through the same store, keeping the feedback loop tight and traceable.

Telemetry flushes (`flow_canvas.render.commit`, `flow_canvas.camera.delta`) latch onto this pipeline so the health layer can replay the same store snapshot when verifying no edges vanished during a step change.

---

## HELPER FUNCTIONS

* `compute_zone_layout(viewport)` returns anchored rectangles that are reused by both the layout simulation and the WebGL backdrop so zone geometry never drifts.
* `nudge_colliding_labels(active_labels)` tracks recent offsets and applies small vertical shifts until proximity constraints are satisfied, handing off the final text placement to the renderer.
* `project_world_to_screen(world_point, camera)` encapsulates the pan/zoom math so every consumer consistently applies the same transform stack.
* `sync_hover_and_focus(node_or_edge, active_focus)` maintains the glowing state tied to the current runtime step, ensuring interactions match the documented BEHAVIORS.
* `report_render_metrics(render_id, camera, nodes_count)` tags each frame with a telemetry payload so downstream health dashboards can assert the layout did not drop edges or camera fidelity.

---

## INTERACTIONS

User interactions are constrained to pan, zoom, fit-to-view, reset, and focus clicks so the algorithm can preserve the invariants: pointer drags update camera pan/zoom, double-tap resets the viewport through `fit_view_to_zones()`, and node clicks forward the focus event to the runtime engine so the canvas reacts with a glow and logs the selection without rearranging geometry. Interaction events that would mutate the stable layout (dragging nodes, editing edges) are ignored so the canvas never breaks the deterministic projection.

---

## COMPLEXITY

* layout compute: O(n log n + m) (Barnes-Hut force)
* collision offset: O(m) with small constant factor

---

## MARKERS

* IDEA: allow per-zone gravity centers to keep clusters readable at 10k nodes
* QUESTION: do we allow user to drag nodes? (v1: no, to preserve stability)

---

---
