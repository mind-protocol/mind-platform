```

# flow_canvas — Validation: Invariants for Readability and Render Stability

STATUS: DRAFT
CREATED: 2025-12-20
VERIFIED: 2026-04-06 against manual reasoning for DOC_TEMPLATE_DRIFT coverage
```

---

## CHAIN

```
PATTERNS:        ./PATTERNS_Connectome_Flow_Canvas_Pannable_Zoomable_Zoned_System_Map_Rendering_Patterns.md
BEHAVIORS:       ./BEHAVIORS_Connectome_Flow_Canvas_Readable_Stable_Interaction_Effects.md
ALGORITHM:       ./ALGORITHM_Connectome_Flow_Canvas_Layout_Zones_And_Edge_Label_Decluttering.md
THIS:            VALIDATION_Connectome_Flow_Canvas_Invariants_For_Readability_And_Stability.md (you are here)
IMPLEMENTATION:  ./IMPLEMENTATION_Connectome_Flow_Canvas_Code_Structure_With_React_Flow_And_Zones.md
HEALTH:          ./HEALTH_Connectome_Flow_Canvas_Runtime_Verification_Of_Render_Stability_And_Perf_Budgets.md
SYNC:            ./SYNC_Connectome_Flow_Canvas_Sync_Current_State.md
```

---

## BEHAVIORS GUARANTEED

| Behavior ID | Behavior | Why This Validation Matters |
|-------------|----------|-----------------------------|
| B1 | Camera motions keep node and edge positions coherent so the canvas never detaches endpoints during pan or zoom. | Ensures analysts can follow paths without chasing disappearing edges, so debugging stays grounded in the rendered topology. |
| B2 | Stepper-driven styling flips do not reflow node coordinates unless the underlying graph payload actually changes. | Keeps the layout deterministic for regression inspections so focus changes remain the only visible variance. |
| B3 | Labels and zone overlays stay legible at the default 100% zoom with no more than one minor permitted overlap event. | Lets operators assess identifiers immediately before filters or zoom adjustments alter the view. |

## OBJECTIVES COVERED

| Objective | Validations | Rationale |
|-----------|-------------|-----------|
| Maintain connectivity visibility across camera updates and step transitions. | V1, V2 | So the canvas reflects stable topology and analysts do not suspect phantom edits while navigating. |
| Ensure the default viewport is immediately legible. | V3 | Readability at zoom=1 gives a reliable starting point for debug storytelling before deeper inspection. |
| Render zones as consistent background structures that never hide edges or labels. | V4 | Keeps spatial grouping cues intact so operators can reason about components instead of chasing layout artifacts. |

## PROPERTIES

### P1: Deterministic layout replay

```
FOR:   repeated stepper advances using identical node/edge payloads
THEN:  node/edge geometry reproduces exactly and only metadata tags shift
```

### P2: Label spacing guardrail

```
WHEN:   viewport is at zoom=1.0
THEN:   label heights stay >= 12px, horizontal padding keeps neighbors 8px apart, and overlap never exceeds the permitted 25% area before decluttering triggers
```

### P3: Zone background precedence

```
FOR:   gradient-filled zone panels
THEN:  they render beneath edges/labels so grouping semantics remain visible while composition still respects contrast thresholds
```

## INVARIANTS

### V1: Pan/zoom always keeps nodes and edges coherent

```
When camera changes:
node positions update consistently
edge endpoints remain attached (no drifting)
no edges disappear
```

### V2: Stable force layout under stepper changes

```
Given identical node/edge list and force parameters:
node positions do not change when stepping
only styling changes (active focus)
```

### V3: Label readability at 100% zoom

```
At zoom=1.0:
label font size >= minimum readable threshold (>=12px)
labels do not overlap more than acceptable threshold (policy)
```

### V4: Zones render behind nodes and edges consistently

```
Zones do not occlude edges and labels
Zones remain visible as grouping structure
```

---

## SYNC STATUS

```
LAST_VERIFIED: 2026-04-06
VERIFIED_AGAINST:
  docs: docs/connectome/flow_canvas/BEHAVIORS_Connectome_Flow_Canvas_Readable_Stable_Interaction_Effects.md @ local tree
  code: app/connectome/components/pannable_zoomable_zoned_flow_canvas_renderer.tsx @ local tree
VERIFIED_BY: manual reasoning during doc refresh
RESULT:
  V1: PASS (manual reasoning)
  V2: PASS (manual reasoning)
  V3: PASS (manual reasoning)
  V4: PASS (manual reasoning)
```

---

## ERROR CONDITIONS

### E1: Edge vanishes during step transition

* severity: ERROR
* meaning: canvas render stability is broken (unacceptable for debugging)

### E2: Label collisions make data unreadable

* severity: WARN
* meaning: declutter policy needs improvement or node spacing too tight

---

## HEALTH COVERAGE

| Validation | Health Indicator                                |
| ---------- | ----------------------------------------------- |
| V1         | canvas_edge_attachment_and_visibility_integrity |
| V2         | canvas_layout_determinism_integrity             |
| V3         | canvas_label_readability_sampling               |
| E1         | canvas_edge_disappearance_detector              |

---

## VERIFICATION PROCEDURE

### Manual

```
[ ] Step repeatedly → no edges disappear
[ ] Resize window → no edges disappear
[ ] Zoom in/out → labels remain readable at zoom=1.0
[ ] Fit-to-view → zones frame correctly
```

### Automated (conceptual)

```
pnpm connectome:health flow_canvas
```

---

## MARKERS

* QUESTION: define measurable label overlap threshold for v1 health checks (pixel-based sampling?).

---

---
