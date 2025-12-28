```

# node_kit — Patterns: Typed, Language-Coded, Energy-Aware Node Rendering

STATUS: DRAFT
CREATED: 2025-12-20
VERIFIED: 2025-12-20 against ?
```

---

## CHAIN

```
THIS:            PATTERNS_Connectome_Node_Kit_Typed_Language_Coded_Energy_Aware_Node_Rendering_Patterns.md (you are here)
BEHAVIORS:       ./BEHAVIORS_Connectome_Node_Kit_Visible_Clarity_And_Trust_Effects.md
ALGORITHM:       ./ALGORITHM_Connectome_Node_Kit_Node_Rendering_Spec_And_Energy_Glow_Mapping.md
VALIDATION:      ./VALIDATION_Connectome_Node_Kit_Invariants_For_Node_Readability_And_State_Reflection.md
IMPLEMENTATION:  ./IMPLEMENTATION_Connectome_Node_Kit_Component_Map_And_Styling_Tokens.md
HEALTH:          ./HEALTH_Connectome_Node_Kit_Runtime_Verification_Of_Node_State_And_Visual_Signal_Truth.md
SYNC:            ./SYNC_Connectome_Node_Kit_Sync_Current_State.md
```

### Bidirectional Contract

```
Before modifying this doc or the code:

1. Read ALL docs in this chain
2. Read state_store + event_model chains (node_kit renders their semantics)

After modifying this doc:

* Update implementation OR record mismatch in SYNC

After modifying the code:

* Update docs OR record mismatch in SYNC

Never degrade:

* node readability at zoom=1.0
* correct reflection of active_focus and step_key
* energy display truthfulness (colors correspond to values)
  ```

---

## THE PROBLEM

/connectome nodes must do three jobs simultaneously:

1. **Identify what the node is** (player vs UI vs module vs graph entity vs agent)
2. **Communicate how it behaves** (typed steps inside the node that highlight one-by-one)
3. **Show live quantitative signals** (energy, wait progress, tick cron fill) without clutter

Failure modes we already hit:

* nodes look too similar → cognitive blur
* file paths dominate titles → the wrong thing is salient
* energy numbers don’t “feel” like energy → no immediate intuition
* active focus does not clearly illuminate the active function in the node
* “graph links” accidentally look like nodes (must be avoided)

---

## THE PATTERN

**Typed node variants + consistent internal step list + truthful signal widgets.**

Node rendering is treated as a kit:

* a small set of node variants
* each variant has stable layout rules
* internal “steps list” exists where relevant, and highlights one step at a time
* quantitative signals (energy, wait, cron) render consistently everywhere

Key insight:

> The map is only as understandable as its nodes.
> Node identity must be immediate even before you read labels.

---

## PRINCIPLES

### Principle 1: Title is what matters; path is discreet

* Node **title** is prominent and colored
* Node **file path** is small, low-contrast, non-bold
* Node should be readable from “title only” at zoom=1.0

### Principle 2: Node background reflects type and language

We must visually distinguish:

* PLAYER vs UI (different nodes)
* TS/React vs PY/FastAPI
* Graph entities vs Moments vs Agents

This reduces “where am I?” errors.

### Principle 3: Energy is a first-class signal

Energy display must:

* be legible
* map color to value (grey → blue → orange → yellow)
* optionally pulse glow when energy changes
* make magnitude feel real without requiring reading numbers

### Principle 4: Active step highlight is precise and singular

Within a node:

* only the current step_key is highlighted
* previous step does not remain highlighted
* highlight is bold + colored by call type (owned by event_model semantics)

### Principle 5: Agent nodes are explicit and separate

We always show separate nodes:

* `LLM CLI Agent — Narrator`
* `LLM CLI Agent — World Builder`

No combined “LLM” blob.

---

## BEHAVIORS SUPPORTED

- Keep node titles, type badges, and step highlights synchronized with state_store metadata so the active focus is obvious before any energy badges are inspected.
- Surface authentic energy, wait, and tick values through gradient glows and progress instrumentation that mirror the backend payloads instead of invented heuristics.
- Maintain typed call semantics by coloring active steps with call_type hues so viewers can tell the difference between player work, module recomputations, and agent-led rewrites at a glance.

## BEHAVIORS PREVENTED

- Prevent nodes from morphing into ambiguous cards by forbidding duplicate highlights or background mappings that could mimic edge kits or other node types.
- Block stale energy colors by requiring the last known state_store value before repainting so the glow never drifts apart from the actual magnitude.

## NODE TYPES (V1)

### Primary nodes

* `PlayerNode` — the human player entity (click to “send message” in stepper)
* `UiNode` — FE UI elements (buttons, hooks) distinct from player
* `ModuleNode` — backend/frontend modules (TS/PY-coded)
* `GraphQueriesNode` — graph read operations (purple-coded)
* `MomentNode` — moment entity (yellow-coded)
* `AgentNode` — each agent separately (green-coded)
* `TickCronNode` — physics tick wait/cron circle (speed-coded)

### Non-nodes (explicitly excluded)

* Graph link entities should NOT be rendered as card nodes in v1.

  * Graph links are edges (edge_kit).
  * If needed, show a fuzzy halo at edge midpoint (edge_kit responsibility).

---

## DEPENDENCIES

| Module        | Why                                                    |
| ------------- | ------------------------------------------------------ |
| `state_store` | provides node states, energy values, wait/tick signals |
| `event_model` | provides callType and step_key semantics for coloring  |
| `flow_canvas` | places nodes; node_kit renders them                    |
| `edge_kit`    | link visuals; node_kit must not duplicate them         |

---

## DATA

Node rendering relies on state_store for titles, step lists, energy, wait progress, cron angle, and active_focus plus the language and call_type metadata that flows out of event_model so every hue, highlight, and meter exactly matches what the runtime reports.

## INSPIRATIONS

- Inspired by instrument panels that keep energy, tempo, and tension signals clustered near the controls so operators can react without scanning multiple screens.
- Borrowed from typed node diagrams in data-flow visualizers where identity, path, and metrics live inside a single frame so each card stands on its own without extra captions.

## SCOPE

### In Scope

* node background rules by type + language
* internal step list rendering + active step highlighting
* energy badge formatting + gradient glow mapping
* wait progress bar widget in PlayerNode
* tick cron widget in TickCronNode
* “flipped” node glow (when a flip/interrupt is present) (source = FlowEvent notes or store signal ?)

### Out of Scope

* pan/zoom and zones (flow_canvas)
* edge styling and pulses (edge_kit)
* event normalization (event_model)
* step authorization and timing (runtime_engine)

---

## MARKERS

* [ ] Define “flipped node” signal source (FlowEvent flag? derived from backend event?) → `?`
* QUESTION: Do we show node “language” as a badge (TS/PY) or infer from background only? (prefer: both, subtle)
* IDEA: Add a “pin node focus” affordance (but state_store must own pinning policy).

---

---
