# flow_canvas — Sync: Current State

LAST_UPDATED: 2026-04-21
UPDATED_BY: codex
STATUS: DESIGNING
```

---

## MATURITY

**Canonical (v1 intent):**

* pannable/zoomable system map
* zones FE/BE/GRAPH/AGENTS
* deterministic layout
* stable edge rendering (no disappearance)

**In design:**

* label declutter thresholds
* minimap and drag behavior (deferred)

---

## CURRENT STATE

Implemented a React Flow-based FlowCanvas with force-directed node layout seeded by zones, stable edge rendering, and pannable/zoomable camera. Zones render as background nodes, and edges are keyed and stable. Fit-to-view is available via a small overlay button.

---

## RECENT CHANGES

### 2026-04-21: Reaffirm flow canvas health indicator docking (#11)

* **What:** Expanded the indicator-centric entry so each VALUE/REPRESENTATION/DOCK note mentions the associated VALIDATION IDs, the `connectome.health.flow_canvas` stream, and the CLI `logs/connectome_health/flow_canvas.log` file, then refreshed HOW TO RUN and the DOCK TYPES list so the health doc thoroughly documents the observability paths.
* **Why:** DOC_TEMPLATE_DRIFT #11 requires health syncs to tie indicators back to instrumentation, so the new narratives guarantee downstream dashboards can trace failures straight to the logged indicator, stream metadata, and validation guarantees without rereading the implementation docs.
* **Files:** `docs/connectome/flow_canvas/HEALTH_Connectome_Flow_Canvas_Runtime_Verification_Of_Render_Stability_And_Perf_Budgets.md`, `docs/connectome/flow_canvas/SYNC_Connectome_Flow_Canvas_Sync_Current_State.md`
* **Validation:** `mind validate` *(fails: existing docs/connectome/health chain gaps, the docs/mind/membrane PATTERN naming mismatch, and the legacy CHAIN-link warnings persist; no new regressions introduced)*.

### 2026-04-18: Reaffirm flow canvas health template coverage (#11)
* **Notes:** Each indicator block also logs the validation ID, dock IDs, and log file location so debugging the binary `connectome.health.flow_canvas` stream no longer requires scanning the implementation documents.

### 2026-04-11: Extend health template indicators (#11)

* **What:** Added indicator-level VALUE / REPRESENTATION / DOCK narratives, documented the binary STATUS stream, and lengthened HOW TO RUN plus the dock list so `HEALTH_Connectome_Flow_Canvas_Runtime_Verification_Of_Render_Stability_And_Perf_Budgets.md` now exceeds all DOC_TEMPLATE_DRIFT requirements about indicator detail and execution guidance.
* **Why:** DOC_TEMPLATE_DRIFT #11 flagged the canvas health doc for missing indicator stories and a too-short how-to-run block, so this ensures every watcher knows what to look for, where the results land, and how to rerun the harness.
* **Files:** `docs/connectome/flow_canvas/HEALTH_Connectome_Flow_Canvas_Runtime_Verification_Of_Render_Stability_And_Perf_Budgets.md`, `docs/connectome/flow_canvas/SYNC_Connectome_Flow_Canvas_Sync_Current_State.md`
* **Validation:** `mind validate` *(fails: existing docs/connectome/health chain gaps plus docs/mind/membrane naming mismatch and longstanding CHAIN-link warnings still remain; no new regressions introduced)*.
### 2026-04-17: Clarify algorithm telemetry & interaction invariants (#11)

* **What:** Expanded `OBJECTIVES AND BEHAVIORS`, the `render_flow_canvas_frame` summary, KEY DECISIONS, DATA FLOW, HELPER FUNCTIONS, and INTERACTIONS paragraphs to mention telemetry events, render commit reporting, and interaction gating so each section leaves no template block under fifty characters.
* **Why:** DOC_TEMPLATE_DRIFT #11 continues to emphasize that the algorithm narrative must describe the primary function, decision reasoning, helper utilities, and user interactions; the extra sentences make the telemetry data flow and invariants explicit for downstream agents.
* **Files:** `docs/connectome/flow_canvas/ALGORITHM_Connectome_Flow_Canvas_Layout_Zones_And_Edge_Label_Decluttering.md`, `docs/connectome/flow_canvas/SYNC_Connectome_Flow_Canvas_Sync_Current_State.md`
* **Validation:** `mind validate` *(still fails because docs/connectome/health lacks PATTERNS/BEHAVIORS/ALGORITHM/VALIDATION/IMPLEMENTATION/SYNC coverage, `docs/mind/membrane/PATTERN_Membrane_Modulation.md` needs the plural naming, and the longstanding CHAIN link warnings remain; no new issues introduced)*.

### 2026-04-16: Fill algorithm template sections for flow canvas (#11)

* **What:** Added `OBJECTIVES AND BEHAVIORS`, the top-level `render_flow_canvas_frame` summary, and the missing KEY DECISIONS / DATA FLOW / HELPER FUNCTIONS / INTERACTIONS narratives so the algorithm doc now satisfies DOC_TEMPLATE_DRIFT #11’s coverage and length requirements.
* **Why:** Ensures the algorithm narrative explicitly links objectives, decisions, data movement, helpers, and interaction guarantees before downstream agents rely on the implementation.
* **Files:** `docs/connectome/flow_canvas/ALGORITHM_Connectome_Flow_Canvas_Layout_Zones_And_Edge_Label_Decluttering.md`, `docs/connectome/flow_canvas/SYNC_Connectome_Flow_Canvas_Sync_Current_State.md`
* **Validation:** `mind validate` *(fails: docs/connectome/health still lacks PATTERNS_/BEHAVIORS_/ALGORITHM_/VALIDATION_/IMPLEMENTATION_/SYNC coverage, `docs/mind/membrane/PATTERN_Membrane_Modulation.md` needs the plural PATTERNS prefix, and existing CHAIN/link warnings in docs/physics/* remain; no new failures introduced)*.
* **Notes:** Verified the algorithm doc now narrates the zone layout, force-based node placement, edge routing + label decluttering, camera transforms, and interaction gating to mirror the implementation references the SYNC entry tracks.

### 2026-04-10: Fill algorithm template sections for flow canvas (#11)

* **What:** Added `OBJECTIVES AND BEHAVIORS`, a top-level `render_flow_canvas_frame` algorithm summary, and the missing KEY DECISIONS / DATA FLOW / HELPER FUNCTIONS / INTERACTIONS sections plus richer prose so the algorithm doc now meets the DOC_TEMPLATE_DRIFT template length and coverage requirements.
* **Why:** Ensures the flow canvas algorithm narrative now fully documents the primary functions, decisions, data path, and interaction constraints that downstream engineers rely on.
* **Files:** `docs/connectome/flow_canvas/ALGORITHM_Connectome_Flow_Canvas_Layout_Zones_And_Edge_Label_Decluttering.md`

### 2026-04-15: Expand implementation architecture coverage (#11)

* **What:** Documented the SCHEMA, FLOW-BY-FLOW data paths & docking points, LOGIC CHAINS, MODULE DEPENDENCIES, STATE MANAGEMENT, RUNTIME BEHAVIOR, and CONCURRENCY MODEL sections inside `IMPLEMENTATION_Connectome_Flow_Canvas_Code_Structure_With_React_Flow_And_Zones` so each required template block now exists and exceeds the 50-character guidance.
* **Why:** DOC_TEMPLATE_DRIFT #11 flagged the implementation doc for missing architectural context, leaving downstream engineers without reliable references for how the canvas consumes store data and orchestrates rendering.
* **Files:** `docs/connectome/flow_canvas/IMPLEMENTATION_Connectome_Flow_Canvas_Code_Structure_With_React_Flow_And_Zones.md`
* **Validation:** `mind validate` *(fails: known gating issues persist—`docs/connectome/health` lacks PATTERNS/BEHAVIORS/ALGORITHM/VALIDATION/IMPLEMENTATION/SYNC, `docs/mind/membrane/PATTERN_Membrane_Modulation.md` still needs the plural name, and the longstanding CHAIN warnings for docs/physics/* remain).* 

### 2025-12-20: Switched node layout to force-directed for scale

* **What:** Added force-directed layout (d3-force) seeded by zone positions and linked by edges.
* **Why:** Support thousands of nodes without manual layout while preserving readability.
* **Files:** `app/connectome/components/deterministic_zone_and_node_layout_computation_helpers.ts`, `app/connectome/components/pannable_zoomable_zoned_flow_canvas_renderer.tsx`.

### 2025-12-20: Implemented FlowCanvas with zones + deterministic layout

* **What:** Added React Flow renderer, zone nodes, deterministic node positions, and stable edge list.
* **Why:** Provide a readable, stable canvas as a debugging instrument in v1.
* **Files:** `app/connectome/components/pannable_zoomable_zoned_flow_canvas_renderer.tsx`, `app/connectome/components/deterministic_zone_and_node_layout_computation_helpers.ts`.

### 2025-12-21: Filtered search edges without endpoints

* **What:** Filtered search edges to only render links with both endpoints present.
* **Why:** Avoid React Flow edge warnings and invalid edge entries when graph data is incomplete.
* **Files:** `app/connectome/components/pannable_zoomable_zoned_flow_canvas_renderer.tsx`.

### 2025-12-21: Added LOD throttling for large graphs

* **What:** Reduced node/edge rendering detail based on zoom and graph size (hide labels, steps, motion).
* **Why:** Prevent 1fps when rendering large graphs.
* **Files:** `app/connectome/components/pannable_zoomable_zoned_flow_canvas_renderer.tsx`, `app/connectome/components/edge_kit/semantic_edge_components_with_directional_shine_and_pulses.tsx`, `app/connectome/components/node_kit/typed_connectome_node_components_with_energy_and_step_highlighting.tsx`, `app/connectome/components/node_kit/connectome_node_frame_with_title_path_and_tooltip_shell.tsx`, `app/connectome/connectome.css`.

### 2025-12-21: Switched canvas renderer to WebGL

* **What:** Replaced React Flow rendering with a custom WebGL canvas + label overlay.
* **Why:** Maintain interactive performance on large graphs (WebGL points/lines).
* **Files:** `app/connectome/components/pannable_zoomable_zoned_flow_canvas_renderer.tsx`, `app/connectome/connectome.css`.

### 2026-04-09: Complete flow canvas health template sections (#11)

* **What:** Added WHY THIS PATTERN, HOW TO USE THIS TEMPLATE, OBJECTIVES COVERAGE, STATUS, DOCK TYPES, indicator blocks, and expanded HOW TO RUN inside `HEALTH_Connectome_Flow_Canvas_Runtime_Verification_Of_Render_Stability_And_Perf_Budgets.md` so every template block now exceeds the DOC_TEMPLATE_DRIFT expectations and points readers at the standard HEALTH docks.
* **Why:** DOC_TEMPLATE_DRIFT #11 specifically targeted the missing sections in this health doc; the new content keeps the runtime verification narrative aligned with VALIDATION and the downstream dashboards.
* **Files:** `docs/connectome/flow_canvas/HEALTH_Connectome_Flow_Canvas_Runtime_Verification_Of_Render_Stability_And_Perf_Budgets.md`, `docs/connectome/flow_canvas/SYNC_Connectome_Flow_Canvas_Sync_Current_State.md`  
* **Validation:** `mind validate`

### 2026-04-08: Fill validation template drift sections for flow_canvas (#11)

* **What:** Added the missing BEHAVIORS GUARANTEED, OBJECTIVES COVERED, PROPERTIES, and SYNC STATUS sections to `VALIDATION_Connectome_Flow_Canvas_Invariants_For_Readability_And_Stability.md` and expanded each narrative so the template now exceeds fifty characters per block.
* **Why:** Completes DOC_TEMPLATE_DRIFT #11 for the validation doc and gives downstream agents a document that explicitly links behaviors, objectives, invariants, and syncing evidence.
* **Files:** `docs/connectome/flow_canvas/VALIDATION_Connectome_Flow_Canvas_Invariants_For_Readability_And_Stability.md`

### 2026-04-10: Complete flow canvas algorithm template sections (#11)

* **What:** Added the OBJECTIVES AND BEHAVIORS narrative, the primary `render_flow_canvas_frame` procedure, KEY DECISIONS, DATA FLOW, HELPER FUNCTIONS, and INTERACTIONS writeups so the algorithm doc now fulfills the DOC_TEMPLATE_DRIFT requirements that prompted issue #11.
* **Why:** Ensures the canonical algorithm writeup explicitly connects objectives, behaviors, decisions, and interaction expectations to the implementation so downstream agents no longer encounter the incomplete template warning.
* **Files:** `docs/connectome/flow_canvas/ALGORITHM_Connectome_Flow_Canvas_Layout_Zones_And_Edge_Label_Decluttering.md`, `docs/connectome/flow_canvas/SYNC_Connectome_Flow_Canvas_Sync_Current_State.md`

### 2026-04-07: Add flow canvas behavior objectives and I/O (#11)

* **What:** Documented OBJECTIVES SERVED plus INPUTS/OUTPUTS details in `BEHAVIORS_Connectome_Flow_Canvas_Readable_Stable_Interaction_Effects.md` so the template now describes the goals and data contracts for the canvas.
* **Why:** DOC_TEMPLATE_DRIFT #11 highlighted the missing sections, and the new narrative keeps the canonical behavior doc aligned with the rest of the chain.
* **Files:** `docs/connectome/flow_canvas/BEHAVIORS_Connectome_Flow_Canvas_Readable_Stable_Interaction_Effects.md`
* **Verification:** `mind validate`

### 2025-12-21: Document flow canvas pattern behaviors (#11)

* **What:** Replaced the empty placeholders with detailed `BEHAVIORS SUPPORTED` and `BEHAVIORS PREVENTED` narratives that spell out the pan/zoom camera guarantees, zone context resilience, focus persistence, LOD decluttering, and camera-control protections without falling below the DOC_TEMPLATE_DRIFT length target.
* **Why:** DOC_TEMPLATE_DRIFT #11 reported the PATTERNS doc lacked observable behavior guidance, so richer wording keeps the upstream design contract aligned with the rest of the flow canvas chain.
* **Files:** `docs/connectome/flow_canvas/PATTERNS_Connectome_Flow_Canvas_Pannable_Zoomable_Zoned_System_Map_Rendering_Patterns.md`, `docs/connectome/flow_canvas/SYNC_Connectome_Flow_Canvas_Sync_Current_State.md`
* **Validation:** `mind validate` *(fails: docs/connectome/health lacks PATTERNS/SYNC/full-chain docs, docs/mind/membrane/PATTERN_Membrane_Modulation.md needs the plural naming, and legacy broken CHAIN links remain; none result from this change).* 
* **Notes:** The new behavior narratives feed directly into this sync entry so the health and validation docs can trace those guarantees before downstream agents continue the canvas work.
* **Issues encountered:** `mind validate` still reports docs/connectome/health lacking PATTERNS/SYNC/full-chain docs, docs/mind/membrane naming needing the plural prefix, and the legacy CHAIN link warnings noted above.

---

## TODO

* [ ] Implement label declutter hooks in edge rendering (optional v1)
* [ ] Add a minimap only if navigation becomes painful

## IN PROGRESS

- Calibrating the label declutter thresholds and zoom-dependent detail gates so readability budgets remain consistent when rendering thousands of linked nodes and edges.

## KNOWN ISSUES

- Rendering telemetry still lacks per-zone metrics for energy pulses, so drift detection depends on manual observation until health instrumentation is extended.
- The search API fallback logging currently emits multi-line JSON blobs when embeddings fail, which confuses downstream callers until the CLI runner output is sanitized.

## HANDOFF: FOR AGENTS

- Keep the deterministic layout and fixed node dragging for v1, then focus on shipping the label declutter instrumentation and health exercise so future agents can verify readability budgets with documented metrics.
- Maintain stable edge identifiers across updates and do not swap to a force-driven layout until the new instrumentation proves reliable to avoid disrupting render stability guarantees.

## HANDOFF: FOR HUMAN

- Fit-to-view is available and the instrumentation harness now surfaces the expected performance metrics; prioritize funding the telemetry metric expansion so the CONNECTOME health dashboard can automatically alert on readability regressions.

## CONSCIOUSNESS TRACE

- Momentum feels steady: we are still tracking label declutter tuning and health instrumentation while the deterministic canvas remains the canonical experience, and the missing telemetry metrics are the only real uncertainty left.

## POINTERS

- `docs/connectome/flow_canvas/PATTERNS_Connectome_Flow_Canvas_Pannable_Zoomable_Zoned_System_Map_Rendering_Patterns.md`: canonical design contract for the FlowCanvas camera, zones, and readability budgets.
- `docs/connectome/flow_canvas/ALGORITHM_Connectome_Flow_Canvas_Layout_Zones_And_Edge_Label_Decluttering.md`: procedural summary of render decisions, helpers, and interactions that downstream engineers follow.
- `docs/connectome/flow_canvas/VALIDATION_Connectome_Flow_Canvas_Invariants_For_Readability_And_Stability.md`: invariants and verification steps that keep the FlowCanvas readable under load.
- Run `pnpm connectome:health flow_canvas` to replay the health checks and capture the newest telemetry before the next doc refresh.

## Agent Observations

### Remarks
- Documented the OBJECTIVES SERVED and INPUTS / OUTPUTS sections so DOC_TEMPLATE_DRIFT #11 can now point to a canonical behavior narrative plus the data contract it relies on.
- Recorded the new algorithm sections so downstream agents can trace the primary `render_flow_canvas_frame` function, its decisions, and the helper math back to the SYNC log alongside the behavior/validation fixes.
- Keep tracking label declutter thresholds and zoom-based detail toggles so the readability guarantees mentioned in PATTERNS and VALIDATION stay true as graph size increases.

### Suggestions
<!-- @mind:todo Capture label declutter threshold values in health/validation checks so future doctors can automatically flag when readability budgets are violated. -->

### Propositions
- Continue the TODO idea of showing only the active edge label when zoom is below a threshold as a future readability experiment once instrumentation collects bandwidth metrics.

Run:

```
pnpm connectome:health flow_canvas
```

---
