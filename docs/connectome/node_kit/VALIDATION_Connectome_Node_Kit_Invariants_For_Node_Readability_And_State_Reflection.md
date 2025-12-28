```

# node_kit — Validation: Invariants for Readability and Correct State Reflection

STATUS: DRAFT
CREATED: 2025-12-20
VERIFIED: 2025-12-20 against ?
```

---

## CHAIN

```
PATTERNS:        ./PATTERNS_Connectome_Node_Kit_Typed_Language_Coded_Energy_Aware_Node_Rendering_Patterns.md
BEHAVIORS:       ./BEHAVIORS_Connectome_Node_Kit_Visible_Clarity_And_Trust_Effects.md
ALGORITHM:       ./ALGORITHM_Connectome_Node_Kit_Node_Rendering_Spec_And_Energy_Glow_Mapping.md
THIS:            VALIDATION_Connectome_Node_Kit_Invariants_For_Node_Readability_And_State_Reflection.md (you are here)
IMPLEMENTATION:  ./IMPLEMENTATION_Connectome_Node_Kit_Component_Map_And_Styling_Tokens.md
HEALTH:          ./HEALTH_Connectome_Node_Kit_Runtime_Verification_Of_Node_State_And_Visual_Signal_Truth.md
SYNC:            ./SYNC_Connectome_Node_Kit_Sync_Current_State.md
```

---

## BEHAVIORS GUARANTEED

| Behavior ID | Behavior | Why This Validation Matters |
|-------------|----------|-----------------------------|
| B1 | Node titles always stay larger, sharper, and semi-highlighted compared to file paths so the textual hierarchy remains readable across languages and dense canvases. | This guarantee prevents future tweaks from shrinking the title or bolding the path, which would blur the readability safety net designers, operators, and health tests rely on for quick scans. |
| B2 | Energy badges render consistent glow colors and intensities for each bucket regardless of render order or active step churn, matching the store’s deterministic thresholds. | Having a documented guarantee makes downstream tooling and health indicators able to trace the visible badge back to one bucket, preventing contradictory RGB states from advertising false energy levels. |
| B3 | Each node highlights at most one step at a time, and the highlight only appears when the runtime `active_step_key` matches a real `step_key`. | Naming this behavior keeps the “one function per step” debugging intent intact even when telemetry dumps multiple updates per frame, so the UI never flashes conflicting highlights. |
| B4 | Player wait timers and tick cron rings clamp to their defined spans while mirroring the store-provided speed label on each render. | This ensures pacing widgets behave predictably so that human readers and automation counters always read the same countdown and cron speed without chasing drifting animations. |

## OBJECTIVES COVERED

| Objective | Validations | Rationale |
|-----------|-------------|-----------|
| Keep node readability, palette guidance, and tooltip emphasis aligned with language-specific styling tokens so every node surface communicates intent without overwhelming the user. | V1, V2, B1 | Pairing deterministic theming with enforced title hierarchy ensures human readability stays stable, which is exactly why the UI can keep being trusted under pressure. |
| Guarantee deterministic energy badges and step highlights so observability tools focus on a single active function with consistent color meaning. | V3, V4, B2, B3 | Explicitly citing these invariants tells the doctor which checks guard the highlight and badge mapping, making regression signals traceable to concrete UI contracts. |
| Keep wait, tick, and speed label displays grounded in store-reported values so pacing and cron indicators never drift from what the runtime actually tracks. | V5, V6, B4 | Documenting this objective reminds future agents to keep the timer clamps and label mirroring intact so runtime telemetry continues to match player-facing meters. |

## PROPERTIES

### P1: Node palette selection depends only on declared type and language

```
FORALL node_type, language:
    node_theme = palette.lookup(node_type, language)
    node_title.font_size > node_path.font_size
    node_path.font_style == normal
```

This property locks the visual hierarchy to the palette tokens emitted by the store so render order or active triggers cannot break readability by changing font sizes or emphasis.

### P2: Energy badges consistently map store energies to glow buckets

```
FOR energy in node_energy:
    bucket = bucket_lookup(energy)
    badge_color = theme_bucket_colors[bucket]
    glow_intensity = theme_bucket_intensities[bucket]
```

Writing this property makes the badge wiring traceable to the deterministic bucket lookup so tests and operators know the glow always matches the documented energy ranges and never drifts. 

### P3: Timer indicators clamp to their documented precision and ranges

```
wait_progress.seconds = clamp(store_wait(node), 0.0, 4.0)
tick_progress.progress = clamp(store_tick(node), 0.0, 1.0)
speed_label = store_speed_label(node)
```

Documenting this property links the visual widgets back to the single-source-of-truth store values that the health harness checks, ensuring automation can validate the same clamps and precision observed by humans.

---

## INVARIANTS

### V1: Type and language styling is deterministic

```
Given (node_type, language):
background theme is stable and does not depend on render order
```

### V2: Title prominence invariant

```
Title is visually dominant over file_path:
title font size > path font size
path is not bold
```

### V3: Active step highlight singularity

```
At any time:
in a given node, at most one step is highlighted
if active_step_key does not match any step_key, none are highlighted
```

### V4: Energy mapping invariant

```
Given energy value e:
mapped color is deterministic per thresholds
glow intensity corresponds to bucket
```

### V5: Player wait progress bounded

```
Displayed wait seconds:
0.0 <= seconds <= 4.0
one decimal precision
```

### V6: Tick cron bounded

```
Tick progress:
0.0 <= progress_0_1 <= 1.0
Speed label matches store speed
```

---

## ERROR CONDITIONS

### E1: Multiple active steps highlighted

* severity: ERROR
* meaning: the “one function per step” debugging intent is broken

### E2: Energy color mapping inconsistent

* severity: WARN/ERROR depending on impact
* meaning: energy stops being interpretable

---

## HEALTH COVERAGE

| Validation | Health Indicator                        |
| ---------- | --------------------------------------- |
| V3         | node_active_step_singularity_integrity  |
| V4         | node_energy_color_bucket_integrity      |
| V5         | node_wait_progress_clamp_integrity      |
| V6         | node_tick_cron_progress_clamp_integrity |

---

## VERIFICATION PROCEDURE

### Manual

```
[ ] Step through events: each node highlights only one internal step at a time
[ ] Energy changes: badge glow changes bucket correctly
[ ] Wait bar never exceeds 4.0s and shows 0.1 precision
[ ] Cron ring stays within 0..1 and matches speed label
```

### Automated

```
pnpm connectome:health node_kit
```

---

## SYNC STATUS

```
LAST_VERIFIED: 2025-12-20
VERIFIED_AGAINST:
impl: ?
health: ?
RESULT:
V1..V6: NOT RUN
```

---

## MARKERS

* QUESTION: Should we assert minimum contrast ratios (WCAG-ish) for title readability? (nice-to-have)

---

---
