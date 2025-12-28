```

# log_panel — Patterns: Unified Explain + Copyable Event Ledger View

STATUS: DRAFT
CREATED: 2025-12-20
VERIFIED: 2025-12-20 against ?
```

---

## CHAIN

```
THIS:            PATTERNS_Connectome_Log_Panel_Unified_Explain_And_Copyable_Event_Ledger_View_Patterns.md (you are here)
BEHAVIORS:       ./BEHAVIORS_Connectome_Log_Panel_Step_Clarity_And_Copyable_Audit_Trail_Effects.md
ALGORITHM:       ./ALGORITHM_Connectome_Log_Panel_Log_Rendering_Duration_Coloring_And_Export.md
VALIDATION:      ./VALIDATION_Connectome_Log_Panel_Invariants_For_Truthful_Durations_And_Stable_Export.md
IMPLEMENTATION:  ./IMPLEMENTATION_Connectome_Log_Panel_Component_Structure_And_Serializer_Integration.md
HEALTH:          ./HEALTH_Connectome_Log_Panel_Runtime_Verification_Of_Log_Truth_And_Export_Integrity.md
SYNC:            ./SYNC_Connectome_Log_Panel_Sync_Current_State.md
```

### Bidirectional Contract

```
Before modifying this doc or the code:

1. Read ALL docs in this chain
2. Read event_model + state_store (log_panel is a projection)

After modifying this doc:

* Update implementation OR record mismatch in SYNC

After modifying the code:

* Update docs OR record mismatch in SYNC

Never degrade:

* copy/export fidelity (export == ledger)
* duration truthfulness and color rules
* “one step = one explanation sentence”
  ```

---

## THE PROBLEM

/connectome previously had two separate surfaces:

* explanation (“what’s happening now”)
* system log (persistent history)

This split causes drift:

* explanation describes one step while log highlights another
* copying becomes ambiguous (“copy which?”)
* users lose the causal chain

We need one unified panel that is:

* readable and narrative (“what is happening now”)
* auditable and copyable (stable ledger export)
* agent-friendly (colored cues for triggers/call types/durations)

---

## THE PATTERN

**Unified “Now + Ledger” panel.**

One panel contains:

1. **Now** section:

   * step index (“Step 9 of 16” not “#9/16”)
   * one-sentence explanation of the current cycle
   * active focus summary (from→to, label)
2. **Ledger** section:

   * append-only list of normalized FlowEvents
   * per-event badges: trigger, call_type, duration bucket, timestamp
3. **Export** actions:

   * copy as JSONL
   * copy as text (human-friendly)
   * (optional) download file later

Key insight:

> The log panel is the “truth window” of /connectome.
> If it lies or drifts, the entire dashboard becomes decoration.

---

## PRINCIPLES

### Principle 1: Render only from the store ledger

No component-maintained shadow logs.
Everything is derived from `state_store.ledger`.

### Principle 2: Duration coloring is deterministic and meaningful

User asked for:

* duration in logs blue if ms
* green if <1s
* yellow <2s
* orange <3s
* red otherwise

This must be enforced centrally.

### Principle 3: Trigger and call type are visibly encoded in log

Log must show:

* trigger type badge colored per trigger kind
* call_type badge colored per palette (yellow/orange/purple/blue/green)

### Principle 4: Export is stable and copy-pasteable

Export must:

* preserve event ids
* preserve order
* preserve required fields
* include session_id boundaries (policy from state_store)

---

## DATA

| Data                         | Source                                    |
| ---------------------------- | ----------------------------------------- |
| current step index           | state_store cursor / active ledger length |
| current explanation sentence | state_store.current_explanation           |
| active focus                 | state_store.active_focus                  |
| ledger events                | state_store.ledger                        |
| health badges                | state_store.health_badges                 |

---

## DEPENDENCIES

| Module           | Why                                           |
| ---------------- | --------------------------------------------- |
| `state_store`    | single source for ledger and explanation      |
| `event_model`    | FlowEvent schema drives formatting            |
| `runtime_engine` | step index semantics                          |
| `flow_canvas`    | may provide hover selection events (optional) |

---

## BEHAVIORS SUPPORTED

* The panel always derives both the narrative explanation and ledger rows from `state_store.ledger`, ensuring the “Now” state and export payload never contradict one another.
* Export actions preserve session boundaries, FlowEvent ids, badges, and deterministic duration colors so audit trails copied as JSONL or text are truthful and reproducible.

## BEHAVIORS PREVENTED

* Drift between the “Now” explanation and ledger history is blocked by rendering every entry directly from the ledger rather than a component-local cache.
* Silent gaps in trigger, call_type, or duration data are prevented by refusing to render rows that lack the badges required for agent-friendly analysis or the color rules that encode timeliness.

## INSPIRATIONS

* Inspired by analog ledgers and audit trails that keep the source of truth in a single, copyable surface (think expedition field books with labeled badges).
* The badge-driven color system takes cues from control rooms that highlight latency with warm/cold warnings and keeps the palette consistent with the ecological gothic aesthetic already in the Connectome UI.

---

## SCOPE

### In Scope

* unified panel layout: Now + Ledger + Export
* duration formatting and color rules
* trigger/call_type badge coloring
* copy/export functions (integration with state_store serializer)
* “Step X of Y” semantics and end-of-script messaging

### Out of Scope

* node/edge rendering (flow_canvas, node_kit, edge_kit)
* event normalization (event_model)
* ledger storage (state_store)
* health checks for backend invariants (not owned here)

---

## MARKERS

* [ ] Decide whether export includes raw_payload by default (recommended: no; behind debug toggle).
* QUESTION: Should log be filterable by zone/node/call_type in v1? (nice-to-have, likely v1.1)

---

---
