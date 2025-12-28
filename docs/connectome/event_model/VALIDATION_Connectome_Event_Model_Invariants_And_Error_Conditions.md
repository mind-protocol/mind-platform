```

# event_model — Validation: Invariants for FlowEvent Correctness

STATUS: DRAFT
CREATED: 2025-12-20
VERIFIED: 2025-12-20 against ?
```

---

## CHAIN

```
PATTERNS:        ./PATTERNS_Connectome_Event_Model_Contract_And_Normalization_Patterns.md
BEHAVIORS:       ./BEHAVIORS_Connectome_Event_Model_Observable_Event_Stream_Effects.md
ALGORITHM:       ./ALGORITHM_Connectome_Event_Normalization_And_Rendering_Event_Synthesis.md
THIS:            VALIDATION_Connectome_Event_Model_Invariants_And_Error_Conditions.md (you are here)
IMPLEMENTATION:  ./IMPLEMENTATION_Connectome_Event_Model_Code_Architecture_And_Schema.md
HEALTH:          ./HEALTH_Connectome_Event_Model_Runtime_Verification_And_Signal_Coverage.md
SYNC:            ./SYNC_Connectome_Event_Model_Sync_Current_State.md

IMPL:            ? (planned TypeScript module under /connectome)
```

> **Contract:** Read docs before modifying. After changes: update IMPL or add TODO to SYNC. Run health.

---

## INVARIANTS

These must ALWAYS be true:

### V1: Schema Completeness (Required Fields)

```
For every FlowEvent e:
e.id is non-empty string
e.at_ms is a finite number
e.from_node_id is non-empty string (or "?")
e.to_node_id is non-empty string (or "?")
e.trigger ∈ {direct, stream, async, hook, timer}
e.call_type ∈ {code, graphQuery, llm, graphLink, moment}
e.label is non-empty string (or "?")
```

**Checked by:** `health_check_event_schema_conformance`

### V2: Deterministic Normalization

```
Given identical raw input and identical normalization config:
normalize_flow_event(raw) produces identical FlowEvent (except at_ms if explicitly set to receipt time)
```

**Checked by:** `health_check_event_normalization_determinism` (stepper replay)

### V3: Animation Duration Safety

```
IF e.duration_ms exists:
e.duration_ms >= 200ms (clamped)
ELSE:
UI uses fallback >= 200ms
```

**Checked by:** `health_check_event_duration_clamping`

### V4: Monotonic Event Ledger (Local Order)

```
For the stored ledger L = [e0, e1, ...]:
at_ms is non-decreasing OR
(if out-of-order arrival happens) then ledger stores arrival_index and UI orders by arrival_index
```

**Checked by:** `health_check_event_ordering_policy` (?)

---

## PROPERTIES

### P1: Trigger ↔ Edge Style Correspondence

```
FORALL e:
e.trigger == direct  => edge style is solid
e.trigger == stream  => edge style is dotted
e.trigger == async   => edge style is dashed
e.trigger == hook    => edge style is dotted or special hook style (must be consistent)
e.trigger == timer   => edge style is dashed or timer style (must be consistent)
```

**Verified by:** `health_check_trigger_to_edge_style_mapping`

### P2: CallType ↔ Color Correspondence

```
FORALL e:
e.call_type == graphLink  => edge color ∈ {yellow, orange}
e.call_type == graphQuery => edge color == purple
e.call_type == code       => edge color == blue
e.call_type == llm        => edge color == green
e.call_type == moment     => node highlight color == yellow
```

**Verified by:** `health_check_calltype_color_mapping`

---

## ERROR CONDITIONS

### E1: Missing Node IDs

```
WHEN:    e.from_node_id == "?" OR e.to_node_id == "?"
THEN:    event is still stored and rendered
SYMPTOM: UI shows “?” in hover and log
```

**Verified by:** `health_check_unknown_nodes_are_not_dropped`

### E2: Unknown SSE Event Name

```
WHEN:    telemetry adapter receives unknown SSE event name
THEN:    event is mapped to trigger=stream, call_type=code, label="?"
SYMPTOM: UI log shows notes="?"
```

**Verified by:** `health_check_unknown_sse_is_preserved`

---

## HEALTH COVERAGE

| Invariant               | Signal             | Status             |
| ----------------------- | ------------------ | ------------------ |
| V1: Schema Completeness | schema_conformance | ⚠ NOT YET VERIFIED |
| V2: Determinism         | determinism        | ⚠ NOT YET VERIFIED |
| V3: Duration Safety     | duration_clamp     | ⚠ NOT YET VERIFIED |
| V4: Ordering Policy     | ordering           | ⚠ NOT YET VERIFIED |

---

## VERIFICATION PROCEDURE

### Manual Checklist

```
[ ] V1 holds — inspect exported log JSONL (required fields present)
[ ] V2 holds — replay stepper steps twice, diff output (except timestamps)
[ ] V3 holds — set duration_ms=10, verify animation uses >=200ms
[ ] V4 holds — simulate out-of-order SSE events, ensure UI stable ordering
[ ] All behaviors from BEHAVIORS file work
[ ] Unknown inputs show “?” rather than disappearing
```

### Automated

```

# Run health checks (module scoped)

pnpm connectome:health event_model
```

---

## SYNC STATUS

```
LAST_VERIFIED: 2025-12-20
VERIFIED_AGAINST:
impl: ? @ ?
health: ? @ ?
VERIFIED_BY: ?
RESULT:
V1: NOT RUN
V2: NOT RUN
V3: NOT RUN
V4: NOT RUN
```

---

## MARKERS

* [ ] Decide exact ordering policy for realtime out-of-order events (by arrival vs by at_ms).
* QUESTION: Should “?” node ids be allowed in production or only in dev?

---
