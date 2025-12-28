```

# edge_kit — Implementation: Component Map and Render Tokens

STATUS: DRAFT
CREATED: 2025-12-20
```

---

## CHAIN

```
PATTERNS:        ./PATTERNS_Connectome_Edge_Kit_Color_Coded_Trigger_Typed_Directional_Link_Styling_Patterns.md
BEHAVIORS:       ./BEHAVIORS_Connectome_Edge_Kit_Readable_Directional_And_Truthful_Link_Effects.md
ALGORITHM:       ./ALGORITHM_Connectome_Edge_Kit_Edge_Rendering_Pulse_Shine_And_Label_Placement_Rules.md
VALIDATION:      ./VALIDATION_Connectome_Edge_Kit_Invariants_For_Color_Dash_And_Pulse_Truth.md
THIS:            IMPLEMENTATION_Connectome_Edge_Kit_Component_Map_And_Render_Tokens.md
HEALTH:          ./HEALTH_Connectome_Edge_Kit_Runtime_Verification_Of_Link_Visibility_And_Semantic_Styling.md
SYNC:            ./SYNC_Connectome_Edge_Kit_Sync_Current_State.md

IMPL:            app/connectome/components/edge_kit/semantic_edge_components_with_directional_shine_and_pulses.tsx
IMPL:            app/connectome/components/edge_kit/connectome_edge_style_tokens_for_trigger_and_calltype_mapping.ts
IMPL:            app/connectome/components/edge_kit/connectome_edge_label_renderer_with_halo_and_zoom_policy.tsx
IMPL:            app/connectome/components/edge_kit/connectome_edge_directional_shine_animation_helpers.ts
IMPL:            app/connectome/components/edge_kit/connectome_edge_pulse_particle_animation_and_boundary_clamp_helpers.ts
IMPL:            app/connectome/components/edge_kit/connectome_node_boundary_intersection_geometry_helpers.ts
```

---

## CODE STRUCTURE

```
app/connectome/components/edge_kit/semantic_edge_components_with_directional_shine_and_pulses.tsx
app/connectome/components/edge_kit/connectome_edge_style_tokens_for_trigger_and_calltype_mapping.ts
app/connectome/components/edge_kit/connectome_edge_label_renderer_with_halo_and_zoom_policy.tsx
app/connectome/components/edge_kit/connectome_edge_directional_shine_animation_helpers.ts
app/connectome/components/edge_kit/connectome_edge_pulse_particle_animation_and_boundary_clamp_helpers.ts
app/connectome/components/edge_kit/connectome_node_boundary_intersection_geometry_helpers.ts
```

### File Responsibilities

| File                                                                     | Responsibility                      | Key Exports                             |
| ------------------------------------------------------------------------ | ----------------------------------- | --------------------------------------- |
| `app/connectome/components/edge_kit/semantic_edge_components_with_directional_shine_and_pulses.tsx`        | Edge components used by flow_canvas | `DirectEdge`, `StreamEdge`, `AsyncEdge` |
| `app/connectome/components/edge_kit/connectome_edge_style_tokens_for_trigger_and_calltype_mapping.ts`      | strict mappings                     | `styleForTrigger`, `colorForCallType`   |
| `app/connectome/components/edge_kit/connectome_edge_label_renderer_with_halo_and_zoom_policy.tsx`          | label rendering (not bold)          | `EdgeLabel`                             |
| `app/connectome/components/edge_kit/connectome_edge_directional_shine_animation_helpers.ts`                | shine animation definitions         | `edge_shine_class_for_trigger`          |
| `app/connectome/components/edge_kit/connectome_edge_pulse_particle_animation_and_boundary_clamp_helpers.ts` | pulses, magnitude scaling           | `renderPulse`, `computePulseDuration`   |
| `app/connectome/components/edge_kit/connectome_node_boundary_intersection_geometry_helpers.ts`             | clamp endpoints at node edges       | `intersectWithRoundedRect`              |

---

## DESIGN PATTERNS

This implementation mirrors the strict trigger→dash and call_type→color semantics described in `PATTERNS_Connectome_Edge_Kit_Color_Coded_Trigger_Typed_Directional_Link_Styling_Patterns.md`, while honoring the halo-rooted label legibility and directional shine/pulse principles before the rest of the canvas renders. The component map ties those semantics to the shared token helpers (`connectome_edge_style_tokens_for_trigger_and_calltype_mapping.ts`, `connectome_edge_label_renderer_with_halo_and_zoom_policy.tsx`, `connectome_edge_directional_shine_animation_helpers.ts`, and `connectome_edge_pulse_particle_animation_and_boundary_clamp_helpers.ts`), so the palette, motion, and glow remain deterministic across every render pass and can be diffed against the PATTERNS doc when the styling contract changes.

## SCHEMA

Normalized `FlowEvent` records defined in `docs/connectome/event_model/ALGORITHM_Connectome_Event_Normalization_And_Rendering_Event_Synthesis.md` drive the schema: `id`, `trigger`, `call_type`, `from_node_id`, `to_node_id`, `duration_ms`, `energy_delta`, `payload_summary`, optional `session_id`, and explanatory metadata. The edge kit reads `trigger`, `call_type`, `energy_delta`, `duration_ms`, and `payload_summary` plus the `render_hint` object that `flow_canvas` attaches to each edge entry, so labels and pulses stay tied to the canonical FlowEvent ledger while `state_store` stores every other field for downstream compliance audits and telemetry sampling. `CallType`/`TriggerKind` enums live in the `event_model` module (see [IMPLEMENTATION_Connectome_Event_Model_Code_Architecture_And_Schema.md](../event_model/IMPLEMENTATION_Connectome_Event_Model_Code_Architecture_And_Schema.md)), and the base `CONNECTOME_EDGE_DEFINITIONS` manifest seeds the static attributes (label text, source/target ids) before runtime updates mark edges as active.

## DATA FLOW AND DOCKING (FLOW-BY-FLOW)

Edges consume normalized FlowEvents produced by the runtime engine, with flow_canvas supplying node geometry, the store delivering active focus metadata, and telemetry tooling plumbing the same selectors to prove style compliance. The edge kit never re-derives its own semantics; it simply renders the deterministic view models that flow_canvas ships to React Flow.

```
flow:
name: runtime_event_to_edge_render
steps:
- runtime_engine → FlowEvent released via `commit_step_release_append_event_and_set_focus_and_explanation`
- `state_store` commits the entry, advances `cursor`, updates `active_focus`, and stores palette tokens (globals + CSS vars)
- `flow_canvas` reads `ledger`, `revealed_edge_ids`, `active_edge_id`, and node bounds, then builds the `EdgeViewModel` with `render_hint`, `source_bounds`, and `target_bounds`
- React Flow edges receive the view model; `edge_kit` maps trigger/call_type to dash/color tokens, clamps pulses using node geometry, and renders `EdgeLabel` with the halo background
- health/telemetry adapters read the same `state_store` selectors to verify dash colors, label legibility, and pulse durations
docking_points:
- flow_canvas → edge_kit `React Flow EdgeProps.data` bag (geometry + render hints)
- state_store → edge_kit selectors (`active_focus`, `ledger`, `revealed_edge_ids`, palette tokens)
- telemetry/health hooks → `docs/connectome/edge_kit/HEALTH_Connectome_Edge_Kit_Runtime_Verification_Of_Link_Visibility_And_Semantic_Styling.md`
```

This flow-by-flow audit trail ensures every link between runtime, state, canvas, rendering, and verification is explicit.

## LOGIC CHAINS

1. `runtime_engine` unlocks a Next click → `event_model` normalizes the payload → `state_store` commits the FlowEvent, updates `active_focus`, and writes the ledger entry that `flow_canvas` will later read.
2. `flow_canvas` assembles the `EdgeViewModel` by combining `CONNECTOME_EDGE_DEFINITIONS`, `revealed_edge_ids`, `node bounds`, and `active_edge_id`, then passes the view model to `semantic_edge_components_with_directional_shine_and_pulses.tsx`.
3. `connectome_edge_style_tokens_for_trigger_and_calltype_mapping.ts` maps call_type to the palette/width tokens, `connectome_edge_directional_shine_animation_helpers.ts` chooses the shine class, and `connectome_edge_pulse_particle_animation_and_boundary_clamp_helpers.ts` computes pulse duration and clamped geometry consumed by the component.
4. `connectome_edge_label_renderer_with_halo_and_zoom_policy.tsx` reuses the same palette for labels, while `intersectWithRoundedRect` keeps pulse endpoints on the node perimeter, completing the rendering chain before health probes re-read the store.

## MODULE DEPENDENCIES

| Module | Role |
| --- | --- |
| `flow_canvas` | Supplies node bounds, zoom/transform data, and the `EdgeViewModel` (with render hints) that the edge kit renders. |
| `event_model` | Provides the canonical `FlowEvent` schema (`CallType`, `TriggerKind`, `energy_delta`, `duration_ms`, `payload_summary`) that the style token mapping consumes before painting strokes. |
| `state_store` | Hosts the FlowEvent ledger, `revealed_edge_ids`, `active_edge_id`, palette tokens, and selectors that power both edge rendering and the health probes. |
| `runtime_engine` | Releases FlowEvents one at a time, gates the `active` flag, and feeds the deterministic updates that keep pulses and glow aligned with user commands. |
| helper modules (`connectome_edge_style_tokens_for_trigger_and_calltype_mapping.ts`, `connectome_edge_directional_shine_animation_helpers.ts`, `connectome_edge_pulse_particle_animation_and_boundary_clamp_helpers.ts`, `connectome_node_boundary_intersection_geometry_helpers.ts`) | Contain the pure helpers for dash mapping, shine class selection, pulse scaling, and boundary clamping so the component tree stays focused on rendering. |

## STATE MANAGEMENT

Edge rendering depends on the global `useConnectomeStore` state: the ledger array provides FlowEvent history, `active_focus` tags the current command so pulses glow persistently, and `cursor`, `revealed_edge_ids`, plus `search_results` inform `flow_canvas` which edges should stay visible or suppressed. Selectors memoize the view models so React only re-renders when the relevant FlowEvent IDs or geometry change. The runtime engine keeps the canonical palette tokens and layout metadata in sync via `commit_step_release_*` actions, and the edge kit never writes back to the store— it purely consumes the deterministic projection and renders based on the `data` bag plus `render_hint` flags (`reduce_motion`, `show_label`, etc.).

## RUNTIME BEHAVIOR

When the runtime engine releases its single FlowEvent per Next press (or pushes realtime frames), the edge kit observes the resulting `active_edge_id` and boosts stroke width, glow opacity, and pulse intensity so the highlighted link stays visible until the next release closes over it. Inactive edges still draw the same palette but only show the gentle shine or `AsyncEdge` pulse until they become active. Hover tooltips echo trigger/call_type/duration/energy data, and dynamic label halos keep typography legible regardless of glow intensity. The combination of `isActive`, `energy_delta`, `duration_ms`, and `render_hint` controls ensures runtime updates never slip through unchecked—the store entry, palette tokens, label halo, and health probes all update in lockstep.

## CONCURRENCY MODEL

React Flow renders edges with purely synchronous props, yet the shine and pulse animations run via CSS keyframes (`edgeFlow`, `edgePulse`) while `setTimeout` or `requestAnimationFrame` loops in the helpers translate FlowEvent timing into durations. The component tree relies on `useEffect` cleanups, memoized tokens, and the atomic commits inside the Zustand store to avoid interleaving stale animations with new FlowEvent renders; every `useConnectomeStore` selector reads the latest snapshot and React only re-renders when those slices change. `dispatch_runtime_command` and `commit_step_release_*` serialize state updates so concurrent Next clicks queue through the runtime gate rather than racing the animation threads, and the edge kit remains purely functional without its own threading logic.

## BIDIRECTIONAL LINKS

This implementation doc anchors the chain mentioned in the `CHAIN` section: it explains how the PATTERNS, ALGORITHM, VALIDATION, HEALTH, and SYNC files interlock, while the code comments in `app/connectome/components/edge_kit/*` link back through `DOCS:` references to `docs/connectome/edge_kit/`. When consumers update the palette, animation helpers, or node boundary math, they must refresh this doc (or note the drift in `SYNC_Connectome_Edge_Kit_Sync_Current_State.md`) so the bidirectional contract remains traceable between docs and the TypeScript sources. The helpers’ `DOCS` comments also serve as a reminder that code changes require doc updates and vice versa, preventing template drift from reappearing.

## RENDER TOKENS (V1)

### Base widths (less bold)

* base: 2.5
* active: 3.5

### Call type colors

* graphLink: yellow/orange
* graphQuery: purple
* code: blue
* llm: green

### Label

* font weight normal
* halo/stroke always on
* color matches edge

---

## ENTRY POINTS

| Entry                             | Used By             |
| --------------------------------- | ------------------- |
| `DirectEdge/StreamEdge/AsyncEdge` | flow_canvas         |
| `EdgeLabel`                       | edge components     |
| `intersectWithRoundedRect`        | pulse clamp helpers |

---

---

## CONFIGURATION

| Config                 | Default |
| ---------------------- | ------- |
| MIN_PULSE_MS           | 200     |
| SHINE_AMPLITUDE_STREAM | higher  |
| SHINE_AMPLITUDE_DIRECT | subtle  |

---

## MARKERS

* [ ] Decide whether hook/timer triggers need unique visuals beyond dotted/dashed.
* QUESTION: do we allow graphLink subtypes to shift yellow/orange?
