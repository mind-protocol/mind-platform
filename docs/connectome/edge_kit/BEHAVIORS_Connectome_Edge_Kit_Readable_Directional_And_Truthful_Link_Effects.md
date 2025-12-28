```

# edge_kit — Behaviors: Readable, Directional, Truthful Link Effects

STATUS: DRAFT
CREATED: 2025-12-20
VERIFIED: 2025-12-20 against ?
```

---

## CHAIN

```
PATTERNS:        ./PATTERNS_Connectome_Edge_Kit_Color_Coded_Trigger_Typed_Directional_Link_Styling_Patterns.md
THIS:            BEHAVIORS_Connectome_Edge_Kit_Readable_Directional_And_Truthful_Link_Effects.md (you are here)
ALGORITHM:       ./ALGORITHM_Connectome_Edge_Kit_Edge_Rendering_Pulse_Shine_And_Label_Placement_Rules.md
VALIDATION:      ./VALIDATION_Connectome_Edge_Kit_Invariants_For_Color_Dash_And_Pulse_Truth.md
IMPLEMENTATION:  ./IMPLEMENTATION_Connectome_Edge_Kit_Component_Map_And_Render_Tokens.md
HEALTH:          ./HEALTH_Connectome_Edge_Kit_Runtime_Verification_Of_Link_Visibility_And_Semantic_Styling.md
SYNC:            ./SYNC_Connectome_Edge_Kit_Sync_Current_State.md
```

 ---

## OBJECTIVES SERVED

- Keep every edge label, pulse, and shine animation legible and semantically precise before the viewer has to inspect panels, so the web-of-relations instantly communicates who is speaking and how energy transfers.
- Ensure the trigger-based dash vocabulary and call_type color map stay consistent throughout the canvas so every rendered stroke can be read like a verb without relying on tooltips or manuals.
- Prevent runaway glow, oversaturated pulses, or misplaced node-like affordances so the edge system remains a trusted physical layer that visually echoes the canonical FlowEvent signal stream.
- Anchor every behavior narrative to the telemetry probes so downstream editors know which signals to monitor when the Connectome health suite verifies edge readability and truthfulness.
- Keep tooltip text, pulse descriptions, and glow states in sync with the same FlowEvent metadata so watchers never doubt the edge story before they inspect the log panel or telemetry stream.

## BEHAVIORS

### B1: Link meaning is readable at zoom=1.0

Edge labels rely on halos, controlled glow, and fixed typography so the semantics remain visible even when pulses and highlights compete for attention.
Health probes sample that readability stack so this documentation remains aligned with the telemetry tests that assert sharp, legible labels under glow.

```
GIVEN:  the diagram is at zoom=1.0
THEN:   edge labels are readable and not overwhelmed by glow
AND:    label text is not bold
AND:    label color encodes call_type
```

### B2: Trigger type is visible without reading

Dash styles are deterministic per trigger so the moment the viewer scans a link they see the intended direct/stream/async signal without needing to inspect details.
This strict mapping also lets the edge health suite automatically flag stray dash patterns when the underlying FlowEvent data slips out of sync.

```
GIVEN:  a link has trigger type direct/stream/async
THEN:   its dash style communicates it:
direct=solid
stream=dotted
async=dashed
```

### B3: Stream links visibly “flow” in the correct direction

The animation runs across the link along the source→target axis, making direction perceptible even when viewers skim the canvas.
The curation of that animation path is mirrored by the health check that watches flow direction, giving agents a verifiable predicate before they touch runtime code.

```
GIVEN:  trigger=stream
THEN:   the edge has gentle directional animation that moves from source to target
AND:    this animation is subtle (non-distracting)
```

### B4: Active link highlight persists until next step

The active glow stays saturated until a subsequent step promotes a new focus so the temporal story of energy transfers is easy to follow.
Runtime logs use the same active state flag to confirm the highlight persists until the next release, so the doc links directly to that verified signal.

```
GIVEN:  a step releases an event along an edge
THEN:   that edge becomes bright/active
AND:    it stays active until the next step releases a new active focus
```

### B5: Pulses stop at node edges, not through nodes

Pulse particles and clamped strokes always honor node boundaries, keeping the energy path visible without bleeding into node silhouettes.
That boundary-aware behavior also doubles as a live guardrail in the health probe so pulses never penetrate node bodies in production.

```
GIVEN:  a pulse travels along an edge
THEN:   the pulse begins at the source node boundary
AND:    ends at the target node boundary
```

### B6: Energy transfer magnitude is perceptible but bounded

Glow intensity and pulse radius scale with the energy_delta, but clamps ensure the visual signal never covers labels or swamps the graph polish.
The clamp values mirror the instrumentation gauge so high-energy pulses stay resolved but the visuals never obscure their context.

```
GIVEN:  an event has energy_delta
THEN:   pulse size/glow intensity scales with magnitude
BUT:    it is clamped so it never obscures labels or nodes
```

---

## ANTI-BEHAVIORS

### A1: Graph links rendered as nodes

GraphLink/ABOUT/THEN/SAID flows stay slender, preventing nodal card styling from stealing the verb-like affordance edges carry.

```
MUST NOT: render ABOUT/THEN/SAID as card-like nodes
INSTEAD: render them as edges with optional fuzzy halos
```

### A2: Labels in bold

Bold text destroys the halo readability system, so text stays normal weight while contrast comes from glow and consistent typography.

```
MUST NOT: bold the link title text
INSTEAD: readable size + halo/contrast
```

---

## INPUTS / OUTPUTS

**Inputs:** The edge kit receives normalized FlowEvent records (`trigger`, `call_type`, `energy_delta`, and timing), node geometry bounds from `flow_canvas`, active focus metadata from `state_store`, and semantic palette tokens anchored to the ecological-gothic substrate so it never infers semantics on its own.
**Outputs:** It paints strokes with trigger-mapped dash patterns, call_type-aligned colors, pulses that start and end at node boundaries, persistent glow states, and tooltips that echo the upstream payload metadata so every visual signal is a faithful translation of canonical inputs; nothing is cached in the renderer, so the flow cache remains truly source-of-record.

**Documentation note:** This input-output contract keeps the kit purely presentational, meaning any behavior change must be traced through the incoming FlowEvent and active_focus sources before the visuals adapt.

Health telemetry references the same data so the documentation directly maps what those probes validate at runtime.
Running `pnpm connectome:health edge_kit` replays the FlowEvent triggers and asserts the dash/color mapping, so this doc describes the very contract those checks assert.

---

## EDGE CASES

### E1: Unknown call_type/trigger

The renderer falls back to neutral styling and a “?” tooltip so operators know an event arrived but the type data is missing or malformed.

```
GIVEN:  trigger or call_type is unknown
THEN:   render using neutral defaults and show “?” tooltip
```

---

## MARKERS

* QUESTION: should async edges have a different motion profile than stream edges? (maybe slower, more “chunky”)
  This question keeps the door open for future iterations to split the temporal pacing so async visuals feel deliberate yet still traceable in the health probe logs.

---

---
