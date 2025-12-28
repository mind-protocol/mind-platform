# state_store — Sync: Current State

LAST_UPDATED: 2026-03-16
UPDATED_BY: codex
STATUS: DESIGNING

---

## MATURITY

**Canonical (v1 intent):**

* one store owns ledger + focus + timers + explanation
* atomic commit per step release
* append-only ledger within a session

**In design:**

* realtime retention policy (max N vs time window)

**Deferred:**

* realtime ingestion details
* pinned focus behavior

---

## CURRENT STATE

Implemented a Zustand store with explicit long-named actions. Step releases use a single atomic commit that appends to the ledger, sets focus, updates explanation, and adjusts wait timers. Restart currently appends a session boundary event and resets focus/timers. The implementation doc now enumerates schema, docking flows, logic chains, dependencies, runtime behavior, and the concurrency guarantees so human agents can follow the canonical design without encountering DOC_TEMPLATE_DRIFT.

---

## IN PROGRESS

Confirming that the newly written handoff, pointer, and consciousness prose continues to match the PATTERNS/IMPLEMENTATION/BEHAVIORS chain while the retention policy placeholder and health harness TODOs sit on the calendar before the module is considered canonical.

## KNOWN ISSUES

- Realtime retention thresholds are still undecided, which keeps the ledger growth risk active until a cap based on either max entry count or a sliding time window is locked in.
- `mind validate` continues to report DOC_TEMPLATE_DRIFT warnings tied to the broader connectome health documentation, so even though this sync is compliant other module docs still require attention.
- Running `pnpm connectome:health state_store` remains a manual step because the harness automation is not yet wired into CI, leaving that verification as a human gating item.

## TODO

* [ ] Decide retention cap for realtime mode
* [ ] Add health harness to verify atomic commit invariants

Run:

```
pnpm connectome:health state_store
```

---

## HANDOFF: FOR AGENTS

The next agent working on the connectome state_store should keep following `VIEW_Implement_Write_Or_Modify_Code.md` whenever ledger actions change and revalidate the PATTERNS/IMPLEMENTATION/VALIDATION chains while explicitly noting any retention cap or health harness edits in this sync and the pointer list.

## HANDOFF: FOR HUMAN

Please finalize the realtime retention policy decision and decide whether the health harness command should be automated so future agents know which constraints to enforce and can mark this module as canonical with confidence.

## POINTERS

- `docs/connectome/state_store/PATTERNS_Connectome_State_Store_Single_Source_Of_Truth_For_Events_Focus_And_Timers.md` for the ledger/focus/timer intent, dependencies, and behaviors narratives that anchor this sync.
- `docs/connectome/state_store/IMPLEMENTATION_Connectome_State_Store_Code_Structure_And_Zustand_Actions.md` for the schema, docking flows, logic chains, module links, and concurrency guarantees referenced above.
- `docs/connectome/state_store/BEHAVIORS_Connectome_State_Store_Observable_State_Consistency_Effects.md` for the observable results we expect and the anti-patterns this store prevents before updates run.
- `docs/connectome/state_store/HEALTH_Connectome_State_Store_Runtime_Verification_Of_Ledger_And_Timer_Correctness.md` for the manual verification cadence and indicator set tied to the `pnpm connectome:health state_store` command.

The pointers are ordered to flow from PATTERNS through IMPLEMENTATION, BEHAVIORS, and HEALTH so readers can follow the canonical doc chain without guessing which file comes next, keeping this sync tightly coupled to the upstream narratives.

## CONSCIOUSNESS TRACE

**Momentum:** The sync now narrates the PATTERNS, implementation, behaviors, and health coverage so this state_store ledger is traced end-to-end and ready for future instrumentation work.
**Architectural concerns:** A realtime retention cap, its enforcement, and the missing health harness automation still need to be resolved before this module can leave DESIGNING status.
**Opportunities noticed:** The updated pointers and handoffs model how to trace DOC_TEMPLATE_DRIFT fixes for other modules, so replicating this structure will keep future SYNC entries compliant.


---

## ARCHIVE

Older content archived to: `SYNC_Connectome_State_Store_Sync_Current_State_archive_2025-12.md`
