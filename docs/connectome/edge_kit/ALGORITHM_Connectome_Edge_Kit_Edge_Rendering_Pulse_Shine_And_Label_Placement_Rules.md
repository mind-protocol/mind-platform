```

# edge_kit — Algorithm: Rendering, Pulses, Directional Shine, and Label Rules

STATUS: DRAFT
CREATED: 2025-12-20
VERIFIED: 2025-12-20 against ?
```

---

## CHAIN

```
PATTERNS:        ./PATTERNS_Connectome_Edge_Kit_Color_Coded_Trigger_Typed_Directional_Link_Styling_Patterns.md
BEHAVIORS:       ./BEHAVIORS_Connectome_Edge_Kit_Readable_Directional_And_Truthful_Link_Effects.md
THIS:            ALGORITHM_Connectome_Edge_Kit_Edge_Rendering_Pulse_Shine_And_Label_Placement_Rules.md (you are here)
VALIDATION:      ./VALIDATION_Connectome_Edge_Kit_Invariants_For_Color_Dash_And_Pulse_Truth.md
IMPLEMENTATION:  ./IMPLEMENTATION_Connectome_Edge_Kit_Component_Map_And_Render_Tokens.md
HEALTH:          ./HEALTH_Connectome_Edge_Kit_Runtime_Verification_Of_Link_Visibility_And_Semantic_Styling.md
SYNC:            ./SYNC_Connectome_Edge_Kit_Sync_Current_State.md
```

---

## OVERVIEW

edge_kit renders edges based on FlowEvent semantics plus canvas geometry.

Inputs:

* edge view model: from_node, to_node, trigger, call_type, label, payload_summary, rate_hint, energy_delta
* active focus: which edge is active
* geometry: node bounds and zoom

Outputs:

* stroke (color, dash)
* label (text, color, halo)
* directional shine (continuous for stream, optional for others)
* pulse animation (when step released)

---

## DATA STRUCTURES

### `ConnectomeEdgeViewModel`

```
ConnectomeEdgeViewModel:
edge_id: string
from_node_id: string
to_node_id: string
trigger: direct|stream|async|hook|timer
call_type: code|graphQuery|llm|graphLink|moment
label: string
payload_summary: string|null
rate_hint: string|null
energy_delta: number|null
notes: string|null
```

---

## ALGORITHM: `style_for_edge(edge)`

### Step 1: Dash style from trigger

```
dash =
direct: none
stream: dotted pattern
async: dashed pattern
hook: dotted (or hook pattern) (?)
timer: dashed (or timer pattern) (?)
```

### Step 2: Color from call_type

```
color =
graphLink: yellow_or_orange
graphQuery: purple
code: blue
llm: green
moment: yellow
unknown: neutral
```

### Step 3: Stroke width policy (less bold)

```
base_width = 2.5
active_width = 3.5
hover_width = 3.0
clamp widths to avoid “thick spaghetti”
```

---

## ALGORITHM: `compute_label_style(edge)`

* label text is not bold
* label font size ~13px at zoom=1.0
* label halo/background always enabled for contrast
* label color matches edge color

---

## ALGORITHM: `compute_pulse_duration_ms(edge, declared_duration_ms, speed)`

* use declared duration if available
* else use speed-based default
* clamp min 200ms

```
pulse_duration_ms = max(200, declared_duration_ms ?? default_for_speed(speed))
```

---

## ALGORITHM: `compute_pulse_path_clamped_to_node_bounds(edge, geometry)`

Goal: pulse starts/ends at node edge, not node center.

1. Get line/bezier between node centers
2. Intersect with source node boundary shape (rounded rect/circle) → start_point
3. Intersect with target node boundary shape → end_point
4. Return clamped path for pulse

If intersection fails:

* fallback to center-based, but mark notes="?" and warn in HEALTH

---

## ALGORITHM: directional shine animation

For all edges:

* apply subtle animated gradient along stroke

For stream edges:

* amplitude higher and continuous
* direction: source → target

For async edges:

* slower, chunkier (optional)

Implementation can be CSS stroke-dashoffset animation or shader-like gradient in SVG/canvas depending on renderer.

---

## ALGORITHM: energy magnitude mapping → pulse visuals

```
pulse_radius = clamp(3 + (energy_delta * k), 3, 12)
pulse_glow   = clamp(0.2 + (energy_delta * g), 0.2, 1.0)
```

Where k and g are tuned constants.

If energy_delta unknown:

* use default pulse size

---

## COMPLEXITY

* O(1) per edge render
* intersection math O(1) per pulse

---

## MARKERS

* QUESTION: Do we show arrowheads? likely only on hover to reduce clutter.
* IDEA: For graphLink subtype (ABOUT vs THEN), tint yellow vs orange.

---

---
