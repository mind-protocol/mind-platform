```

# edge_kit — Patterns: Color-Coded, Trigger-Typed, Directional Edge Styling

STATUS: DRAFT
CREATED: 2025-12-20
VERIFIED: 2025-12-20 against ?
```

---

## CHAIN

```
THIS:            PATTERNS_Connectome_Edge_Kit_Color_Coded_Trigger_Typed_Directional_Link_Styling_Patterns.md (you are here)
BEHAVIORS:       ./BEHAVIORS_Connectome_Edge_Kit_Readable_Directional_And_Truthful_Link_Effects.md
ALGORITHM:       ./ALGORITHM_Connectome_Edge_Kit_Edge_Rendering_Pulse_Shine_And_Label_Placement_Rules.md
VALIDATION:      ./VALIDATION_Connectome_Edge_Kit_Invariants_For_Color_Dash_And_Pulse_Truth.md
IMPLEMENTATION:  ./IMPLEMENTATION_Connectome_Edge_Kit_Component_Map_And_Render_Tokens.md
HEALTH:          ./HEALTH_Connectome_Edge_Kit_Runtime_Verification_Of_Link_Visibility_And_Semantic_Styling.md
SYNC:            ./SYNC_Connectome_Edge_Kit_Sync_Current_State.md
```

### Bidirectional Contract

```
Before modifying this doc or the code:

1. Read ALL docs in this chain
2. Read event_model (edge styling is entirely driven by FlowEvent.trigger and FlowEvent.call_type)

After modifying this doc:

* Update implementation OR record mismatch in SYNC

After modifying the code:

* Update docs OR record mismatch in SYNC

Never degrade:

* readability of edge labels
* correct mapping of color ↔ call_type
* correct mapping of dash ↔ trigger
* pulse directionality and “stop at node edge”
  ```

---

## THE PROBLEM

Edges carry the meaning of the connectome.

We need to make links:

* readable (labels not lost in glow)
* semantically colored (call type meaning is immediate)
* directionally legible (movement and shine show direction)
* non-overbearing (less bold than earlier, but still visible)
* stable under stepping (no vanishing)

Also: graph links must not look like nodes.

---

## THE PATTERN

**Trigger-typed dash styles + call-type color palette + directional shine + magnitude pulses.**

Each edge is rendered from a normalized FlowEvent:

* trigger → line pattern

  * direct = solid
  * stream = dotted, gently animated in direction
  * async = dashed, gently animated in direction

* call_type → color

  * graphLink = yellow/orange (ABOUT/THEN/SAID/etc.)
  * graphQuery = purple
  * code = blue
  * llm = green
  * moment = yellow (rare as an edge; usually moment is a node behavior)

* activity → glow and persistent highlight

  * active edge remains bright until next step
  * subtle shine animation indicates direction even when inactive (low amplitude)

* energy_delta → pulse magnitude + thickness modulation (bounded)

Key insight:

> Edges are the verbs of the system.
> If you can’t read the edge, you can’t understand the flow.

## BEHAVIORS SUPPORTED

- **B1:** Edge labels remain legible at zoom=1 because halo contrast and consistent non-bold formatting keep the call_type text readable even when pulses or glow layers activate on top of the dark substrate.
- **B2:** Directional shine and magnitude pulses continue to travel correctly along the source→target axis, so viewers always perceive motion direction without needing extra cues.
- **B3:** The strict trigger→dash and call_type→color mapping delivers instant semantics, letting readers identify direct, stream, async, and graphLink/code/llm flow without needing tooltips.

## BEHAVIORS PREVENTED

- **A1:** Labels are never bolded or recolored outside the defined palette, ensuring the halo-based readability system remains the single source of contrast rather than arbitrary typography tricks.
- **A2:** No edge can override the trigger or call_type styling arbitrarily, which keeps the entire link vocabulary deterministic across the graph and prevents visual noise that would dilute meaning.
- **A3:** GraphLink/ABOUT/THEN/SAID edges are kept purely as edges (optionally with halos) and never rendered as node-like cards, so edges retain their verb-like affordance.

## DATA

| Data           | Description                                                                       |
| -------------- | --------------------------------------------------------------------------------- |
| `FlowEvent`    | Normalized event blob that carries `trigger`, `call_type`, and `energy_delta`.    |
| `ColorPalette` | Ecological-gothic palette tokens that anchor call_type colors to the substrate.  |
| `NodeBounds`   | Geometry (circle/rounded rect) used for pulse clamping and shine origin/destination. |
| `ActivityState`| Active focus metadata from `state_store` that drives glow, highlight, and pulse timing. |

## INSPIRATIONS

* Metro diagrams (thin directional strokes + color-coded lines) taught us how to show motion without extra nodes.
* Physics energy pulses from the runtime engine helped constrain pulse timing so transfer magnitude feels kinetic but readable.
* Tooltips with halos from other UI kits remind us to keep labels legible without relying on bold text or heavy strokes.

---

## PRINCIPLES

### Principle 1: Semantic color mapping is strict and deterministic

Color communicates call_type instantly. Never “art direct” per edge.

### Principle 2: Labels are readable and not bold

* label text is NOT bold
* label uses background halo or stroke for contrast
* label font is large enough at zoom=1.0
* label color matches call_type

### Principle 3: Direction is always visible

Two mechanisms:

* subtle “shine” animation moving along the edge in the correct direction
* pulses (when an event occurs) travel from source boundary to target boundary

### Principle 4: Pulses stop at node edges

Pulse particles should not run through node interiors.

Implementation: compute intersection point with node bounds (circle/rounded rect) and clamp endpoints.

### Principle 5: Graph links are edges, not nodes

ABOUT/THEN/SAID are rendered as edges only.
Optional: a fuzzy halo at midpoint to represent “link energy” if needed, but not as a card node.

---

## EDGE TYPES (V1)

### Edge style by trigger

* `DirectEdge` — solid
* `StreamEdge` — dotted + continuous gentle animation
* `AsyncEdge` — dashed + gentle animation

### Edge color by call_type

* graphLink → yellow/orange gradient
* graphQuery → purple
* code → blue
* llm → green

---

## DEPENDENCIES

| Module           | Why                                                |
| ---------------- | -------------------------------------------------- |
| `event_model`    | provides trigger + call_type for strict styling    |
| `state_store`    | provides active_focus and energy_delta             |
| `flow_canvas`    | provides geometry: node bounds, zoom, transforms   |
| `runtime_engine` | determines when edges become active (step release) |

---

## SCOPE

### In Scope

* edge stroke width policy (less bold than prior)
* edge label style policy (not bold, readable)
* directional shine animation (especially for stream edges)
* pulse animation for events (magnitude scaled, min duration 200ms)
* pulse clamping to node boundaries
* active edge persistent highlight until next step
* tooltip content for edges (payload summary, rate, notes, call_type/trigger)

### Out of Scope

* node rendering (node_kit)
* layout + label collision resolution (flow_canvas owns)
* event normalization (event_model)
* log formatting (log_panel)

---

## MARKERS

* [ ] Decide whether graphLink is always yellow OR can be yellow/orange by subtype (ABOUT vs THEN) → `?`
* QUESTION: do we allow edge thickness to vary with energy_delta in v1, or only pulse size? (recommend: pulse size only for readability)
* IDEA: show tiny arrowheads only on hover to reduce clutter.

---

---
