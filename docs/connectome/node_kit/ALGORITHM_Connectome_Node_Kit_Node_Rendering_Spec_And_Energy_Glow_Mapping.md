```

# node_kit — Algorithm: Node Rendering Spec and Energy Glow Mapping

STATUS: DRAFT
CREATED: 2025-12-20
VERIFIED: 2025-12-20 against ?
```

---

## CHAIN

```
PATTERNS:        ./PATTERNS_Connectome_Node_Kit_Typed_Language_Coded_Energy_Aware_Node_Rendering_Patterns.md
BEHAVIORS:       ./BEHAVIORS_Connectome_Node_Kit_Visible_Clarity_And_Trust_Effects.md
THIS:            ALGORITHM_Connectome_Node_Kit_Node_Rendering_Spec_And_Energy_Glow_Mapping.md (you are here)
VALIDATION:      ./VALIDATION_Connectome_Node_Kit_Invariants_For_Node_Readability_And_State_Reflection.md
IMPLEMENTATION:  ./IMPLEMENTATION_Connectome_Node_Kit_Component_Map_And_Styling_Tokens.md
HEALTH:          ./HEALTH_Connectome_Node_Kit_Runtime_Verification_Of_Node_State_And_Visual_Signal_Truth.md
SYNC:            ./SYNC_Connectome_Node_Kit_Sync_Current_State.md
```

---

## OVERVIEW

Node rendering is deterministic: given node metadata and store state the kit produces consistent visuals that match the behavior guarantees for clarity, trust, and signal truth.

Inputs:

* node metadata: type, language, title, path, steps list, tooltip text
* state signals: active_focus, energy value, wait/tick progress, flipped flag (?)

Outputs:

* rendered node component with correct background, layout, highlighted step, and widgets

---

## OBJECTIVES AND BEHAVIORS

This algorithm keeps the renderer honest by tying every painted pixel back to the Objectives listed in the BEHAVIORS doc: identity, step clarity, energy glow, wait timers, and tick pacing must all match the canonical state_store values so viewers trust what appears in the viz even before they read the legend. By documenting the behavior linkage here we also satisfy the DOC_TEMPLATE_DRIFT requirement and leave a traceable contract between what we render and the observable outcomes B1-B7 describe.

---

## DATA STRUCTURES

### `ConnectomeNodeViewModel`

```
ConnectomeNodeViewModel:
node_id: string
node_type:
Player|UI|Module|GraphQueries|Moment|Agent|TickCron
language: TS|PY|GRAPH|AGENT|UNKNOWN
title: string
file_path: string|null
steps:
- step_key: string
label: string
call_type: code|graphQuery|llm|graphLink|moment
energy_value: number|null
flipped: boolean|null
tooltip: {summary: string, notes: string|null}
```

---

## ALGORITHM: render_node

`render_node(view_model, store_state)` orchestrates every visible detail for a node by consuming typed metadata, active focus, energy metrics, wait/tick signals, and flipped flags to emit the final component props.

### Step 1: Determine background theme

`background_theme = theme_for(node_type, language)` picks the palette described in PATTERNS so each variant remains distinguishable even before labels are read.

Rules (v1):

* Player: warm neutral with a vibrant accent that keeps it approachable and human.
* UI: cool grey/blue palette so interface nodes recede visually from the player.
* Module TS: tinted TS-blue to align with TypeScript branding.
* Module PY: shaded purple that echoes Python tooling without stealing attention.
* GraphQueries: purple background tint that signals read-only graph operations.
* Moment: yellow tint to match the bright cues used for moment highlights.
* Agent: resilient green tone to make agents feel alive and separate from modules.
* TickCron: speed-coded tint that hints at pacing and encourages quick reflexes.

### Step 2: Title and path

Render the title prominently, color it by `node_type`, and keep the file path subdued so the viewer can orient immediately even when zoomed out.

### Step 3: Steps list (if present)

Render every step label, resolve `active_step_key = store_state.active_focus.active_step_key`, and when the view_model defines a matching step, mark that item bold and color it by its `call_type` so only one step ever appears highlighted.

### Step 4: Energy badge

If `energy_value` exists, format it with two decimals, compute `energy_color = map_energy_to_color(energy_value)`, and layer the glow so the badge feels like a contained burst of energy instead of a flat label.

### Step 5: Widgets per node type

* PlayerNode: render the wait progress bar plus the seconds display from `store_state.wait_progress` so the countdown and color shifts described in BEHAVIORS appear instantly.
* TickCronNode: draw a circular progress ring driven by `store_state.tick_display.progress_0_1`, center the current speed label, and color the ring to match the preset speed hues so pacing reads without extra text.

### Step 6: Flipped ring

If `view_model.flipped` is `true`, draw an outer glow ring with a distinct white/pink tint, add extra blur, and trigger the animation immediately so flipped nodes visually pop from the layout.

---

## KEY DECISIONS

* Treat each node variant as a discrete visual kit so the renderer can switch palettes by checking `node_type` and `language` before laying out anything.
* Keep the file path low contrast and non-bold because clarity depends on the title being the first thing spotted; paths only appear when analysts inspect the node closely.
* Map energy to color deterministically via a helper so the glow never lies about the numeric value, which preserves the trust guarantees.
* Highlight exactly one step at a time by consulting `active_focus` and `call_type`, preventing the confusion that duplicate highlights used to cause.
* Render progress widgets only when the runtime state explicitly enables them (PlayerNode wait bars, TickCron rings) so we never over-render or duplicate signals.
* Align every palette change with the PATTERNS doc so designers can audit node themes without reverse-engineering runtime logic.
* Always pull live focus, energy, wait, tick, and flipped selectors from the state_store before rendering so the ledger remains the single source of truth for what the canvas may show.

---

## DATA FLOW

Metadata and `call_type` information flow from `event_model` into the `ConnectomeNodeViewModel`, which the renderer consumes along with `state_store` selectors for energy, wait progress, tick display, and flipped status. `render_node` stitches this data into component props, delegates step rendering to `render_steps_list`, sources colors from `map_energy_to_color`, and eventually hands the payload to presentation components so the canvas always reflects the active state without inventing signals.
The instrumentation logs which selectors fired so downstream health tooling can replay the same signals when it verifies palette/hotspot invariants.
Flow instrumentation also records which selectors were used so health checks can confirm the animation stems from the same data the store exposes.

---

## HELPER FUNCTIONS

* `map_energy_to_color(energy_value)`: deterministically maps a numeric energy to a palette color (see below) and is shared across badges.
* `render_steps_list(steps, active_step_key)`: walks the provided steps, looks for the active key, and returns list items with the correct bold + call_type hue.
* `determine_background_theme(node_type, language)`: centralizes palette decisions so adding new node variations only requires updating one table.
* `render_widget_for_node_type(node_type, store_state)`: dispatches to wait progress or tick cron renders, ensuring only supported widgets appear for each variant.
* `render_flipped_ring(flipped)` adds the pink/white glow and extra blur when the ledger marks a node as flipped so mirrored states are visible.
* `format_energy_value(energy_value)` picks the rounding precision that keeps the badge legible without reformatting mid-stream.
* `resolve_step_call_type_color(call_type)` returns the accent token defined in PATTERNS for the linked call type so helpers never invent new colors without an update.

---

## ALGORITHM: map_energy_to_color

`map_energy_to_color(energy_value)` returns the glow hue for the energy badge and is invoked from `render_node`.

Deterministic thresholds (v1 initial):

```
IF energy_value is null:
    color = neutral_grey
ELSE IF energy_value < 0.10:
    color = grey
ELSE IF energy_value < 0.30:
    color = blue
ELSE IF energy_value < 0.60:
    color = orange
ELSE:
    color = yellow
```

Notes:

* Thresholds may be tuned later but must remain deterministic so the badge never lies.
* Every change to this mapping must be documented in VALIDATION so the glow keeps provenance.

---

## ALGORITHM: wait_progress_display

`wait_progress_display(store_state)` renders the PlayerNode wait bar using selectors that deliver seconds and 0-1 progress while applying colors that signal urgency aligned with the BEHAVIORS milestones.

Inputs from store selector:

* `seconds_display`: formatted single decimal (0.0..4.0).
* `value_0_1`: normalized progress value between 0 and 1.

Color thresholds (v1) as described in BEHAVIORS:

* `<1.0s`: green.
* `<2.0s`: yellow.
* `<3.0s`: orange.
* `>=3.0s`: red.

---

## INTERACTIONS

Node rendering depends on `state_store` selectors for live focus, energy, wait, tick, and flip signals, while `event_model` supplies step metadata and call_type hues. `flow_canvas` handles placement but leaves rendering to this kit, `edge_kit` owns every link so nodes never draw edges, and the component map / implementation tokens document the actual styles applied to each palette, glow, and widget.

Health checks read the same colors, step highlights, and timers through `VALIDATION_Connectome_Node_Kit_Invariants_For_Node_Readability_And_State_Reflection.md` so any divergence between visuals and the store is immediately flaggable.

The health doc reuses the same selectors so automated tests can confirm the canvas only paints what the invariant script expects.

---

## COMPLEXITY

O(k) where k = number of steps in the node (typically small). Rendering is fast because each view_model is painted once per frame and helper lookups remain constant time.

---

## MARKERS

* [ ] Define exact title color tokens per node_type so the palette table can be audited.
* QUESTION: Is energy normalized 0..1 or unbounded? mapping assumes “small-ish”; mark `?` until telemetry defines it.
* IDEA: Show a tiny “TS/PY” badge in corner for Module nodes.

---
