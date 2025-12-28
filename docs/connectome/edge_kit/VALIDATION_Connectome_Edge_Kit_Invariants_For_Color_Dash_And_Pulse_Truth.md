```

# edge_kit — Validation: Invariants for Color, Dash, Direction, and Pulse Truth

STATUS: DRAFT
CREATED: 2025-12-20
VERIFIED: 2025-12-20 against ?
```

---

## CHAIN

```
PATTERNS:        ./PATTERNS_Connectome_Edge_Kit_Color_Coded_Trigger_Typed_Directional_Link_Styling_Patterns.md
BEHAVIORS:       ./BEHAVIORS_Connectome_Edge_Kit_Readable_Directional_And_Truthful_Link_Effects.md
ALGORITHM:       ./ALGORITHM_Connectome_Edge_Kit_Edge_Rendering_Pulse_Shine_And_Label_Placement_Rules.md
THIS:            VALIDATION_Connectome_Edge_Kit_Invariants_For_Color_Dash_And_Pulse_Truth.md (you are here)
IMPLEMENTATION:  ./IMPLEMENTATION_Connectome_Edge_Kit_Component_Map_And_Render_Tokens.md
HEALTH:          ./HEALTH_Connectome_Edge_Kit_Runtime_Verification_Of_Link_Visibility_And_Semantic_Styling.md
SYNC:            ./SYNC_Connectome_Edge_Kit_Sync_Current_State.md
```

---

## BEHAVIORS GUARANTEED

| Behavior ID | Behavior | Why This Validation Matters |
|-------------|----------|------------------------------|
| B1 | Call_type colors paired with trigger dash styles stay deterministic so every link renders the semantic vocabulary it promised even while pulses animate simultaneously. | Guarantees flow semantics stay trustworthy so analysts can read energy transfers without second-guessing whether styling drifted. |
| B2 | Active edges retain their glow and pulses until the store signals a new focus, keeping the temporal story of each energy transfer visible from start to finish. | Prevents flash-by brightness from concealing the previous step and keeps the viewer confident that highlighted edges still mark the last release. |
| B3 | Pulse streams and glow never encroach on node interiors because endpoints clamp to node boundaries while the color-and-dash palette still frames the passage of energy. | Keeps topology legible and ensures that what looks like energy moving along a path genuinely reflects the canonical FlowEvent route. |

## OBJECTIVES COVERED

| Objective | Validations | Rationale |
|-----------|-------------|-----------|
| Preserve semantic fidelity so every link still reads as its declared call_type/trigger pair. | V1, V2, V3 | A truthful color/dash palette means the connectome never lies about who is speaking or how the event flowed, which is critical for debugging truthfulness. |
| Keep pulse motion readable and persistent long enough to show transfer direction and magnitude. | V4, V6 | Minimum pulse duration plus persistent glow means analysts can follow an event even when multiple pulses overlap or graph motion otherwise distracts. |
| Ensure pulses respect node boundaries so energy never bleeds through nodes' silhouettes. | V5 | Clamping endpoints to node bounds keeps the energy path anchored to topology and preserves the verb-like affordance of edges. |

## PROPERTIES

### P1: Semantic styling determinism

```
FOR:   every FlowEvent with a call_type and trigger
THEN:  its color and dash are looked up from the ecological-gothic tokens and cannot mutate during render
```

Determinism lets downstream health tooling assert that rerenders still produce the same palette/dash combination unless the upstream payload actually changes.

### P2: Persistent active highlight

```
WHEN:   an edge becomes active due to store.active_focus.edge_id
THEN:   its glow and pulse remain visible until a new step replaces the focus
```

This property prevents the highlight from flickering away mid-step, so attention always tracks the most recent energy transfer while pulses keep their configured 200 ms minimum duration.

### P3: Node-boundary respect

```
FOR:   every pulse animation
THEN:  the path starts/ends exactly at the node boundary intersection and never overlaps node interiors
```

This keeps the pulse path honest to the topology and keeps label halos and node silhouettes unobstructed for readability.

## INVARIANTS

### V1: Trigger → dash mapping is strict

```
direct  => solid
stream  => dotted
async   => dashed
```

### V2: Call type → color mapping is strict

```
graphLink  => yellow/orange
graphQuery => purple
code       => blue
llm        => green
moment     => yellow
```

### V3: Label is not bold and remains readable

```
label font weight is normal
label has halo/background for contrast
```

### V4: Pulse duration minimum

```
pulse_duration_ms >= 200ms
```

### V5: Pulse endpoints stop at node edges

```
pulse path start/end must lie on node boundary intersection (within tolerance)
```

### V6: Active edge persists until next step

```
active edge remains active until store.active_focus.edge_id changes
```

---

## SYNC STATUS

```
LAST_VERIFIED: 2026-05-05
VERIFIED_AGAINST:
  docs: docs/connectome/edge_kit/BEHAVIORS_Connectome_Edge_Kit_Readable_Directional_And_Truthful_Link_Effects.md @ local tree
  code: app/connectome/components/edge_kit/semantic_edge_components_with_directional_shine_and_pulses.tsx @ local tree
  code: app/connectome/components/edge_kit/connectome_edge_style_tokens_for_trigger_and_calltype_mapping.ts @ local tree
VERIFIED_BY: manual reasoning while expanding the validation narrative
RESULT:
  V1: PASS (manual reasoning)
  V2: PASS (manual reasoning)
  V3: PASS (manual reasoning)
  V4: PASS (manual reasoning)
  V5: PASS (manual reasoning)
  V6: PASS (manual reasoning)
```

---

## ERROR CONDITIONS

### E1: Color mismatch

* severity: ERROR
* meaning: semantics are lying

### E2: Edge disappears

* severity: ERROR
* meaning: instrument broken

### E3: Pulse goes through node interior

* severity: WARN/ERROR depending on frequency

---

## HEALTH COVERAGE

| Validation | Health Indicator                      |
| ---------- | ------------------------------------- |
| V1/V2      | edge_semantic_style_mapping_integrity |
| V4         | edge_min_pulse_duration_integrity     |
| V5         | edge_pulse_endpoint_clamp_integrity   |
| V6         | edge_active_persistence_integrity     |
| E2         | edge_visibility_integrity             |

---

## VERIFICATION PROCEDURE

### Manual

```
[ ] Compare edge style to trigger badges in log
[ ] Confirm link title not bold
[ ] Stream edges show gentle directional motion
[ ] Pulses stop at node boundaries
[ ] Active edge remains bright until Next
```

### Automated

```
pnpm connectome:health edge_kit
```

---

## MARKERS

* QUESTION: define numerical tolerance for boundary intersection (pixels) → `?`

---

---
