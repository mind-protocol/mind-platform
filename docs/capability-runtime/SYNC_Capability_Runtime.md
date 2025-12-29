# Capability Runtime — Sync

```
STATUS: DESIGNING
MODULE: capability-runtime
LAST_UPDATED: 2025-12-29
UPDATED_BY: agent_claude
```

---

## CHAIN

```
PREV:            ./HEALTH_Capability_Runtime.md
THIS:            SYNC_Capability_Runtime.md (you are here)
NEXT:            (none - end of chain)
```

---

## CURRENT STATE

The capability-runtime module is **fully designed** but **not yet implemented**.

Documentation complete:
- OBJECTIVES: 5 ranked objectives defined
- PATTERNS: Core patterns for specs/runtime separation
- BEHAVIORS: 6 behaviors documented (B1-B6)
- ALGORITHM: 7 algorithms with pseudocode (A1-A7)
- VALIDATION: 8 invariants defined (V1-V8)
- IMPLEMENTATION: File structure and key classes specified
- HEALTH: 5 health signals defined (H1-H5)

---

## WHAT'S DESIGNED

### Architecture

- **Specs location:** `.mind/capabilities/{name}/` — agent-readable docs
- **Runtime location:** `.mind/runtime/capabilities/{name}/` — MCP-executable code
- **Templates location:** `templates/capabilities/` and `templates/runtime/capabilities/`

### Key Components

| Component | Purpose | Status |
|-----------|---------|--------|
| `base.py` | TaskRun, HealthMonitor, create_task_run | Designed |
| `loader.py` | discover_capabilities, load_capability | Designed |
| `registry.py` | TriggerRegistry | Designed |
| `dispatch.py` | dispatch_trigger, create_task_runs | Designed |
| MCP hooks | Startup integration | Designed |

### Trigger Types

All 6 trigger types documented:
- `init.*` — MCP startup phases
- `file.*` — File system events
- `cron.*` — Scheduled intervals
- `signal.*` — Health signals
- `graph.*` — Graph mutations
- `manual.*` — Explicit invocation

---

## IMPLEMENTATION PLAN

### Phase 1: Core Infrastructure

1. Create `runtime/capability/` package
2. Implement `base.py` with TaskRun, HealthMonitor
3. Implement `loader.py` with discovery logic
4. Implement `registry.py` with TriggerRegistry

### Phase 2: Dispatch

1. Implement `dispatch.py` with dispatch_trigger
2. Add timeout handling (30s max)
3. Add error containment

### Phase 3: MCP Integration

1. Hook into `mcp/server.py` startup
2. Add lifecycle hooks for init phases
3. Integrate with health endpoint

### Phase 4: First Capability

1. Create `create-doc-chain` capability:
   - Specs in `templates/capabilities/create-doc-chain/`
   - Runtime in `templates/runtime/capabilities/create-doc-chain/`
2. Implement ChainCompletenessMonitor
3. Test full flow: trigger → handler → TaskRun → agent pickup

---

## OPEN QUESTIONS

1. **Timeout handling:** Kill handler or just log and continue?
   - Current design: Kill after 30s
   - Alternative: Log warning, let it finish

2. **Duplicate triggers:** Last wins or merge handlers?
   - Current design: Last wins with warning
   - Alternative: Both handlers called

3. **Hot reload:** Restart MCP or dynamic reload?
   - Current design: Restart required (V1)
   - Future: Could add hot reload

---

## DEPENDENCIES

| Dependency | Status | Notes |
|------------|--------|-------|
| MCP server | Exists | Needs capability hooks |
| Graph operations | Exists | For TaskRun creation |
| Embedding service | Exists | For TaskRun synthesis |
| `mind init` | Exists | Needs capability copy logic |

---

## HANDOFF: FOR IMPLEMENTER

**Start with:** `runtime/capability/base.py`
- Define TaskRun dataclass
- Define HealthMonitor ABC
- Add create_task_run helper

**Then:** `runtime/capability/loader.py`
- discover_capabilities() function
- load_capability() function
- Test with empty capabilities dir

**Then:** `runtime/capability/registry.py`
- TriggerRegistry class
- Simple dict-based implementation

**Then:** `runtime/capability/dispatch.py`
- dispatch_trigger() function
- create_task_runs() function
- Add timeout with signal.alarm or threading

**Finally:** MCP integration
- Hook into server.py startup
- Call discover → register → dispatch(init.startup)

**Test capability:** Create minimal test capability with:
```python
# __init__.py
HANDLERS = {
    "triggers": {
        "init.startup": lambda ctx: [],
    },
    "monitors": [],
}
```

---

## RELATED DOCS

- `docs/mcp-tools/` — MCP tool documentation
- `.mind/FRAMEWORK.md` — Protocol framework
- `templates/capabilities/create-doc-chain/` — First capability (to be created)
