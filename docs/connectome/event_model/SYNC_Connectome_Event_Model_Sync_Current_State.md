```

# event_model — Sync: Current State

LAST_UPDATED: 2025-12-20
UPDATED_BY: codex
STATUS: DESIGNING
```

---

## MATURITY

**What's canonical (v1):**

* FlowEvent schema is the single contract for connectome semantics.
* Normalization is deterministic and never drops events; unknowns become "?".

**What's still being designed:**

* exact backend SSE event list and payload shapes
* ordering policy under out-of-order realtime arrivals
* whether raw_payload is stored by default

**What's proposed (v2+):**

* parent_event_id causal tracing
* OpenTelemetry-style export/import

---

## CURRENT STATE

FlowEvent schema and normalization helpers are implemented in TypeScript. Call type and trigger inference rules live in a dedicated helper, and duration formatting uses the canonical bucket rules.

---

## RECENT CHANGES

### 2025-12-20: Implemented FlowEvent schema + normalization

* **What:** Added FlowEvent types, normalize_flow_event(), trigger/callType inference, and duration bucketing utilities.
* **Why:** Establish a single canonical event contract for stepper and future realtime ingestion.
* **Files:**
  * `app/connectome/lib/flow_event_schema_and_normalization_contract.ts`
  * `app/connectome/lib/flow_event_trigger_and_calltype_inference_rules.ts`
  * `app/connectome/lib/flow_event_duration_bucket_color_classifier.ts`

---

## KNOWN ISSUES

* SSE event mapping remains partial because backend event names are not finalized.

---

## TODO

* [ ] Decide ordering policy for realtime arrival (arrival vs at_ms)
* [ ] Decide raw_payload storage policy

Run:

```
pnpm connectome:health event_model
```

---
