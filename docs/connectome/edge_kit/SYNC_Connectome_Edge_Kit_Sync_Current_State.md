```

# edge_kit — Sync: Current State

LAST_UPDATED: 2025-12-20
UPDATED_BY: codex
STATUS: DESIGNING
```

---

## MATURITY

**Canonical (v1 intent):**

* strict trigger→dash mapping
* strict call_type→color mapping
* labels not bold, readable with halo
* stream edges show gentle directional animation
* active edge persists until next step

**In design:**

* graphLink subtype tint (ABOUT vs THEN yellow/orange)
* arrowhead policy (hover only)

---

## CURRENT STATE

Implemented edge components for React Flow that map trigger to dash styles and call_type to color. Labels render with halo and normal weight. Active edges receive a stronger stroke and glow.

---

## RECENT CHANGES

### 2026-05-04: Expand edge kit behavior template (#11)

* **What:** Documented `OBJECTIVES SERVED` plus `INPUTS / OUTPUTS`, expanded each behavior/anti description, and highlighted the telemetry tie-ins so the edge behavior narrative clearly states the goals, contract-rich I/O story, and verified signals before downstream edits happen.
* **Why:** DOC_TEMPLATE_DRIFT #11 flagged the missing sections and short prose; the new narrative ensures the behavior doc now explains what the edge visuals aim to achieve and how the canonical signals flow through the kit.
* **Files:** `docs/connectome/edge_kit/BEHAVIORS_Connectome_Edge_Kit_Readable_Directional_And_Truthful_Link_Effects.md`, `docs/connectome/edge_kit/SYNC_Connectome_Edge_Kit_Sync_Current_State.md`
* **Validation:** `mind validate` *(fails: the existing `docs/connectome/health` module still lacks its canonical PATTERNS/BEHAVIORS/ALGORITHM/VALIDATION/IMPLEMENTATION/HEALTH/SYNC chain, `docs/mind/membrane/PATTERN_Membrane_Modulation.md` needs the plural naming, and the longstanding CHAIN-link warnings remain; no new regressions introduced).*

### 2026-05-05: Expand edge kit implementation architecture (#11)

* **What:** Expanded the implementation doc with precise FlowEvent schema references, flow-by-flow docking steps, logic chains, module dependencies, state management, runtime behavior, concurrency notes, and bidirectional link guidance so the architecture narrative now references `event_model`, `state_store`, `flow_canvas`, `runtime_engine`, the helper modules, and the health probes before downstream edits occur.
* **Why:** DOC_TEMPLATE_DRIFT #11 required richer prose above fifty characters for each section; this revision keeps the canonical writeup aligned with the PATTERNS and behavior narratives while clarifying how FlowEvent releases ripple through React Flow rendering and health instrumentation.
* **Files:** `docs/connectome/edge_kit/IMPLEMENTATION_Connectome_Edge_Kit_Component_Map_And_Render_Tokens.md`, `docs/connectome/edge_kit/SYNC_Connectome_Edge_Kit_Sync_Current_State.md`
* **Validation:** `mind validate` *(fails: the existing `docs/connectome/health` module still lacks its canonical PATTERNS/BEHAVIORS/ALGORITHM/VALIDATION/IMPLEMENTATION/HEALTH/SYNC chain, `docs/mind/membrane/PATTERN_Membrane_Modulation.md` needs the plural naming, and the longstanding CHAIN-link warnings remain; no new regressions introduced).*

### 2026-05-05: Complete edge kit validation template (#11)

* **What:** Added BEHAVIORS GUARANTEED, OBJECTIVES COVERED, PROPERTIES, and SYNC STATUS so every required validation block now exceeds 50 characters while linking each invariant directly to the documented behaviors, property guards, and verification steps.
* **Why:** DOC_TEMPLATE_DRIFT #11 flagged those empty validation sections; this narrative makes the semantic/dash/pulse guarantees traceable to the behavior doc and the health checks before downstream edits touch the edge kit.
* **Files:** `docs/connectome/edge_kit/VALIDATION_Connectome_Edge_Kit_Invariants_For_Color_Dash_And_Pulse_Truth.md`, `docs/connectome/edge_kit/SYNC_Connectome_Edge_Kit_Sync_Current_State.md`
* **Validation:** `mind validate` *(fails: known `docs/connectome/health` chain gaps, `docs/mind/membrane/PATTERN_Membrane_Modulation.md` plural naming mismatch, and longstanding CHAIN-link warnings remain; no new failures introduced).*

### 2025-12-21: Complete PATTERNS template sections for edge styling (#11)

* **What:** Added BEHAVIORS SUPPORTED/PREVENTED narratives plus DATA and INSPIRATIONS sections so the pattern doc now meets the DOC_TEMPLATE_DRIFT length expectations.
* **Why:** DOC_TEMPLATE_DRIFT #11 flagged the missing blocks; supplying concrete behaviors and data keeps downstream editors aligned on edge semantics before they touch the implementation.
* **Files:** `docs/connectome/edge_kit/PATTERNS_Connectome_Edge_Kit_Color_Coded_Trigger_Typed_Directional_Link_Styling_Patterns.md`
* **Validation:** `mind validate` *(fails: existing docs/connectome/health chain gaps, docs/mind/membrane naming mismatch, and longstanding CHAIN warnings remain; no new regressions introduced).*

### 2025-12-20: Retuned edge colors to semantic palette

* **What:** Mapped edge call types to the ecological gothic palette and updated label halo colors to match the dark substrate.
* **Why:** Ensure energy flow reads as physical stream and preserve readability on the stone-like background.
* **Files:**
  * `app/connectome/components/edge_kit/connectome_edge_style_tokens_for_trigger_and_calltype_mapping.ts`
  * `app/connectome/components/edge_kit/connectome_edge_label_renderer_with_halo_and_zoom_policy.tsx`
  * `app/connectome/components/edge_kit/semantic_edge_components_with_directional_shine_and_pulses.tsx`

### 2025-12-20: Applied tension-release easing to edge pulses

* **What:** Updated active edge pulse animation to use the tension-release easing curve.
* **Why:** Align energy transfer motion with the physics-based easing rules.
* **Files:** `app/connectome/components/edge_kit/semantic_edge_components_with_directional_shine_and_pulses.tsx`, `app/globals.css`.

### 2025-12-20: Clamped energy pulses to node boundaries

* **What:** Clamped pulse paths to node boundary intersections and modulated stroke width by energy intensity.
* **Why:** Keep energy transfer visible without bleeding through node bodies.
* **Files:**
  * `app/connectome/components/edge_kit/semantic_edge_components_with_directional_shine_and_pulses.tsx`
  * `app/connectome/components/pannable_zoomable_zoned_flow_canvas_renderer.tsx`

### 2025-12-20: Added edge hover tooltips and energy packet animation

* **What:** Added edge hover tooltips (trigger/call/duration/energy) and animated energy packets along active edges.
* **Why:** Provide readable, directional energy transfer cues and hoverable remarks.
* **Files:** `app/connectome/components/edge_kit/semantic_edge_components_with_directional_shine_and_pulses.tsx`.

### 2025-12-20: Added edge pulse animation keyframes and layering hooks

* **What:** Added the edge pulse animation keyframes and edge-over-node layering hooks in the connectome stylesheet.
* **Why:** Keep active edge pulses visible and persistent without edges disappearing under nodes.
* **Files:** `app/connectome/connectome.css`.

### 2025-12-20: Implemented edge kit components

* **What:** Added semantic edge components, style token mapping, label renderer, and simple shine animation classes.
* **Why:** Provide semantic, readable edges in the connectome canvas.
* **Files:**
  * `app/connectome/components/edge_kit/semantic_edge_components_with_directional_shine_and_pulses.tsx`
  * `app/connectome/components/edge_kit/connectome_edge_style_tokens_for_trigger_and_calltype_mapping.ts`
  * `app/connectome/components/edge_kit/connectome_edge_label_renderer_with_halo_and_zoom_policy.tsx`
  * `app/connectome/components/edge_kit/connectome_edge_directional_shine_animation_helpers.ts`
  * `app/connectome/components/edge_kit/connectome_edge_pulse_particle_animation_and_boundary_clamp_helpers.ts`
  * `app/connectome/components/edge_kit/connectome_node_boundary_intersection_geometry_helpers.ts`

### 2025-12-21: Disabled edge labels/animations in heavy graphs

* **What:** Edge rendering now hides labels and reduces motion when graph size or zoom requires it.
* **Why:** Preserve frame rate for large graphs.
* **Files:**
  * `app/connectome/components/edge_kit/semantic_edge_components_with_directional_shine_and_pulses.tsx`
  * `app/connectome/components/edge_kit/connectome_edge_label_renderer_with_halo_and_zoom_policy.tsx`

---

## TODO

* [ ] Add explicit pulse travel visualization if needed beyond active glow
* [ ] Add health probes for dash/color correctness

Run:

```
pnpm connectome:health edge_kit
```

---

## IN PROGRESS

Document completeness continues: verifying the edge kit template sections remain aligned with the runtime graph behavior while ensuring dash/color prose references the latest palette and animation policies in the canvas docs.

## KNOWN ISSUES

| Issue | Severity | Notes |
|-------|----------|-------|
| Edge health probe automation | medium | The CLI probe still requires manual invocation; no verification script ties into `pnpm connectome:health edge_kit` yet. |
| Heavy graph readability | medium | Labels and pulses are hidden for performance, but we need a canonical narrative explaining when the suppression toggles fire. |

## HANDOFF: FOR AGENTS

Next agent should verify whether the Connectome health command gained automation and then update this SYNC if the probe script now records status; also consider linking the hover tooltip behavior to any new runtime telemetry sections.

## HANDOFF: FOR HUMAN

Please confirm if we want automated runs of `pnpm connectome:health edge_kit` in the pipeline and whether the suppressed-label behavior needs additional design guidance before we document it in PATTERNS or BEHAVIORS.

## CONSCIOUSNESS TRACE

Observed that the edge kit sync now reflects the implementation pace but lacks references to upstream telemetry goals; the template drift fix feels stable and ready for downstream agents once the remaining health automation story is verified.

## POINTERS

- `app/connectome/components/edge_kit/semantic_edge_components_with_directional_shine_and_pulses.tsx` (code implementing color pulses and suppression logic)
- `app/connectome/components/edge_kit/connectome_edge_style_tokens_for_trigger_and_calltype_mapping.ts` (call_type → palette mapping)
- `docs/connectome/edge_kit/PATTERNS_Connectome_Edge_Kit_Color_Coded_Trigger_Typed_Directional_Link_Styling_Patterns.md` (pattern rationale with behavior and inspiration sections)
