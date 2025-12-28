```

# node_kit - Behaviors: Visible Clarity and Trust Effects

STATUS: DRAFT
CREATED: 2025-12-20
VERIFIED: 2025-12-20 against ?
```

---

## CHAIN

```
PATTERNS:        ./PATTERNS_Connectome_Node_Kit_Typed_Language_Coded_Energy_Aware_Node_Rendering_Patterns.md
THIS:            BEHAVIORS_Connectome_Node_Kit_Visible_Clarity_And_Trust_Effects.md (you are here)
ALGORITHM:       ./ALGORITHM_Connectome_Node_Kit_Node_Rendering_Spec_And_Energy_Glow_Mapping.md
VALIDATION:      ./VALIDATION_Connectome_Node_Kit_Invariants_For_Node_Readability_And_State_Reflection.md
IMPLEMENTATION:  ./IMPLEMENTATION_Connectome_Node_Kit_Component_Map_And_Styling_Tokens.md
HEALTH:          ./HEALTH_Connectome_Node_Kit_Runtime_Verification_Of_Node_State_And_Visual_Signal_Truth.md
SYNC:            ./SYNC_Connectome_Node_Kit_Sync_Current_State.md
```

---

## OBJECTIVES SERVED

- Keep node framing, energy badges, step highlights, and tooltips coherent so the viewer immediately trusts what they see before reading any text.
- Ensure every glow, wait bar, and cron ring aligns with canonical state_store signals so the connectome canvas never invents its own story about energy or focus.
- Prevent the interface from relying on heuristics by anchoring visible changes to explicit FlowEvent metadata and validated palette mappings before repainting.

## BEHAVIORS

### B1: Node identity is obvious at a glance

```
GIVEN:  the diagram is visible at zoom=1.0
THEN:   a user can instantly distinguish Player vs UI vs Module vs Graph vs Agent nodes
BECAUSE: backgrounds and title styling encode type and language
```

### B2: The title leads; file path is secondary

```
GIVEN:  a node shows a title and a file path
THEN:   the title is prominent and colored
AND:    the path is small, discreet, and not bold
```

### B3: Active step inside a node is clearly highlighted, one-at-a-time

```
GIVEN:  a FlowEvent specifies step_key for a node
WHEN:   the step becomes active
THEN:   exactly one list item is highlighted (bold + colored by call type)
AND:    previous items revert when Next is clicked
```

### B4: Energy feels like energy

```
GIVEN:  a node has an energy value
THEN:   the energy badge glow reflects the value (grey→blue→orange→yellow)
AND:    energy changes cause a brief glow accent (optional)
```

### B5: Wait progress bar is truthful and bounded

```
GIVEN:  player sent a message and no answer arrived
THEN:   PlayerNode shows a progress bar filling over max 4.0s with 0.1 precision seconds display
AND:    color shifts as it approaches max
```

### B6: Tick cron node communicates pacing without requiring reading

```
GIVEN:  speed is pause/1x/2x/3x
THEN:   TickCronNode shows a circular fill aligned to nominal tick interval
AND:    center shows speed label
AND:    color changes with speed
```

### B7: "Flipped" nodes are visually distinct

```
GIVEN:  a node is marked flipped/interrupt=true (source ?)
THEN:   it has a distinct glow ring so it "pops" from normal activation
```

---

## ANTI-BEHAVIORS

### A1: Node rendering re-implements event normalization

```
MUST NOT: infer callType/trigger from raw payload in node rendering
INSTEAD: consume callType/trigger/step_key already normalized/stored
```

### A2: Energy values displayed without consistent mapping

```
MUST NOT: show arbitrary colors for energy without mapping rule
INSTEAD: use deterministic mapping function from ALGORITHM
```

---

## INPUTS / OUTPUTS

**Inputs:** The node kit accepts state_store selectors that include node title, language metadata, energy value, wait progress, cron angle, active_focus, and flipped/interrupt markers, along with event_model call_type and step_key tuples so it never infers semantics from raw payloads.
**Outputs:** The renderer emits node silhouettes, background washes, gradient glows, step highlights, tooltips, wait bars, and tick rings that faithfully animate the incoming signals while preserving the clarity and trust guarantees that give operators confidence before they read the text.

**Documentation note:** This mirrors the store/event_model contract-the node kit is a pure presentation surface whose visible behavior is fully determined by the supplied inputs and whose outputs are purely visual reflections of the validated signals.

---

## EDGE CASES

### E1: Unknowns

```
GIVEN:  a node lacks language/type info
THEN:   it renders with default neutral styling and shows "?" in tooltip
```

---

## MARKERS

* QUESTION: Should we surface multiple energy metrics (weight, salience, momentum) in v1, or keep the kit narrowly focused on the single energy badge that the runtime already normalizes to preserve clarity? (recommend: energy only for now)

---

---
