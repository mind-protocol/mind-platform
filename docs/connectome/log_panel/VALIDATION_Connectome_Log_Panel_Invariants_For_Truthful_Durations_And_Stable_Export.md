```

# log_panel — Validation: Invariants for Truthful Durations and Stable Export

STATUS: DRAFT
CREATED: 2025-12-20
VERIFIED: 2025-12-20 against ?
```

--- 

## BEHAVIORS GUARANTEED

| Behavior ID | Behavior | Why This Validation Matters |
|-------------|----------|-----------------------------|
| B1 | The “Now” sentence always paraphrases the latest ledger event id and visible payload so readers can orient without guessing what step is current. | Prevents operators from being misled by stale explanations and keeps trust high when quickly scanning the ledger during a run. |
| B2 | The step tracker never renders shorthand like “#9/16” but consistently shows “Step X of Y” or “Step X” so contextual metadata is explicit. | Keeps human and automated consumers from misinterpreting implied progress, letting downstream checks rely on the same unambiguous wording. |
| B3 | Duration badges and JSON/Text exports follow the curated duration-color rules and retain each ledger row in the same order. | Ensures observers and auditors see the same visual cues and serialized history so intake scripts can depend on the exported story matching the live log. |

## OBJECTIVES COVERED

| Objective | Validations | Rationale |
|-----------|-------------|-----------|
| Keep the “Now” narrative synchronized with the ledger so the panel always highlights the freshest work item. | V1, E1 | Anchors explanation parity to the canonical event, making copy/export trustable without a second lookup. |
| Keep progress summaries explicit by using full “Step” wording instead of shorthand. | V2, E2 | Prevents viewers from reading partial counts as authorization of completion and stops automated trackers from misreading condensed labels. |
| Preserve color-coded durations and exported entries so performance intuition and data export integrity are aligned. | V3, V4, E2 | Makes sure both the visual story and the serialized ledger comply with exactly the same duration thresholds so audits and analytics stay in sync. |


## CHAIN

```
PATTERNS:        ./PATTERNS_Connectome_Log_Panel_Unified_Explain_And_Copyable_Event_Ledger_View_Patterns.md
BEHAVIORS:       ./BEHAVIORS_Connectome_Log_Panel_Step_Clarity_And_Copyable_Audit_Trail_Effects.md
ALGORITHM:       ./ALGORITHM_Connectome_Log_Panel_Log_Rendering_Duration_Coloring_And_Export.md
THIS:            VALIDATION_Connectome_Log_Panel_Invariants_For_Truthful_Durations_And_Stable_Export.md (you are here)
IMPLEMENTATION:  ./IMPLEMENTATION_Connectome_Log_Panel_Component_Structure_And_Serializer_Integration.md
HEALTH:          ./HEALTH_Connectome_Log_Panel_Runtime_Verification_Of_Log_Truth_And_Export_Integrity.md
SYNC:            ./SYNC_Connectome_Log_Panel_Sync_Current_State.md
```

---

## INVARIANTS

### V1: Explanation matches last event

```
If ledger non-empty:
Now.explanation corresponds to last ledger event (same id or derived from it)
```

### V2: “Step X of Y” formatting is unambiguous

```
Panel never shows shorthand like "#9/16"
It shows "Step X of Y" or "Step X" only
```

### V3: Duration color mapping matches rules

```
duration_ms undefined => muted
duration_ms < 1000    => blue
duration_ms < 2000    => yellow
duration_ms < 3000    => orange
duration_ms >= 3000   => red
```

### V4: Export equals ledger

```
Export JSONL contains all ledger events in order (plus optional session header)
Export Text contains all ledger events in order (plus optional session header)
```

---

## PROPERTIES

### P1: Ledger pairing stays in sync

```
For every ledger row emitted into the store, the “Now” sentence references that row’s id or a deterministic paraphrase of its payload before the next step renders.
```

### P2: Step indicator wording is explicit

```
The component never renders shorthand like “#x/y”; whenever totals are known it emits “Step x of y” and otherwise simply shows “Step x.”
```

### P3: Duration coloring decisions are deterministic

```
Crossing a duration threshold flips both the visual badge color and the export text token to the rule-defined value within the same digest cycle.
```

## ERROR CONDITIONS

### E1: Export mismatch

* severity: ERROR
* meaning: copy/paste debugging is broken

### E2: Duration colored incorrectly

* severity: WARN/ERROR depending on frequency
* meaning: log cannot be trusted for performance intuition

---

## HEALTH COVERAGE

| Validation | Health Indicator                     |
| ---------- | ------------------------------------ |
| V1         | log_now_matches_last_event_integrity |
| V3         | log_duration_color_mapping_integrity |
| V4         | log_export_equals_ledger_integrity   |

---

## VERIFICATION PROCEDURE

### Manual

```
[ ] Step once → Now sentence describes that step
[ ] Look at Step indicator → “Step X of Y” (no shorthand)
[ ] Confirm ms durations appear blue
[ ] Copy JSONL and paste: event count equals ledger count
```

### Automated

```
pnpm connectome:health log_panel
```

---

## SYNC STATUS

```
LAST_VERIFIED: 2025-12-21
VERIFIED_AGAINST:
  docs: docs/connectome/log_panel/BEHAVIORS_Connectome_Log_Panel_Step_Clarity_And_Copyable_Audit_Trail_Effects.md
  code: app/connectome/components/unified_now_and_copyable_ledger_log_panel.tsx
VERIFIED_BY: manual review (cross-doc alignment)
RESULT:
  V1: PASS (documentation match)
  V2: PASS (documentation match)
  V3: PASS (documentation match + quick UI spot-check)
  V4: PASS (documentation match + export study)
```

## MARKERS

* QUESTION: Should “call_type” also have a badge in export text? (likely yes for readability)

---

---
