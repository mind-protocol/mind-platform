# Grammar — Sync

```
STATUS: CANONICAL
LAST_UPDATED: 2024-12-29
MODULE: templates/grammar
```

---

## CHAIN

```
IMPLEMENTATION:  ./IMPLEMENTATION_Grammar.md
HEALTH:          ./HEALTH_Grammar.md
THIS:            SYNC_Grammar.md (you are here)
```

---

## CURRENT STATE

### Maturity

| Component | Status |
|-----------|--------|
| OBJECTIVES | Canonical |
| PATTERNS | Canonical |
| VOCABULARY | Canonical |
| BEHAVIORS | Canonical |
| ALGORITHM | Canonical |
| VALIDATION | Canonical |
| IMPLEMENTATION | Canonical |
| HEALTH | Canonical |

### Implementation Status

| Component | Platform | MCP Runtime |
|-----------|----------|-------------|
| Grammar docs | ✓ Written | — |
| Task templates | ○ TODO | — |
| Detection code | — | ○ TODO |
| Claim code | — | ○ TODO |
| Execution code | — | Partial (procedures exist) |
| Resolution code | — | ○ TODO |

---

## RECENT CHANGES

### 2024-12-29

- Created grammar doc chain in `templates/docs/grammar/`
- Defined detection → task_run → execution → resolution flow
- Established invariants for grammar compliance
- Mapped implementation structure

---

## NEXT STEPS

1. **Create task templates** in `templates/tasks/`
   - TASK_create_doc.md
   - TASK_fix_template.md
   - TASK_update_sync.md
   - TASK_ingest_docs.md

2. **Implement grammar runtime** in MCP
   - `runtime/grammar/detection.py`
   - `runtime/grammar/claim.py`
   - `runtime/grammar/execution.py`
   - `runtime/grammar/resolution.py`

3. **Replace doctor with health**
   - Remove `doctor_check` tool
   - Add `health_check` tool
   - Migrate indicators to HEALTH docs

4. **Update MCP tools**
   - `task_list` queries graph for task_runs
   - `agent_spawn` uses grammar claim/execute

---

## BLOCKERS

None currently.

---

## HANDOFF

**For next agent:**

The grammar doc chain is complete. It defines HOW the protocol works:
- Problems detected → task_runs created
- Actors claim task_runs → execute procedures
- Completion → resolution verified

Next: Write the actual TASK_*.md templates that implement specific work types (create_doc, fix_template, etc.). These go in `templates/tasks/`.

**Agent posture:** groundwork (building new things)
