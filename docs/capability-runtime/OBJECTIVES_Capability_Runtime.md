# Capability Runtime — Objectives

```
STATUS: DESIGNING
MODULE: capability-runtime
```

---

## PURPOSE

Enable capabilities to ship executable code alongside specs, making them self-contained plugins that the MCP loads and runs automatically.

---

## RANKED OBJECTIVES

### O1: Self-Containment (Weight: 5)

Everything a capability needs lives in one folder: specs, tasks, skills, procedures, AND runtime code.

**Success:** Copy a capability folder → it works. No external dependencies beyond mind core.

### O2: Automatic Registration (Weight: 4)

MCP discovers and loads capability runtimes at startup without manual configuration.

**Success:** Drop a capability in `.mind/capabilities/` → its handlers are active.

### O3: Trigger-Based Activation (Weight: 4)

Handlers respond to well-defined triggers (events, schedules, signals) rather than polling.

**Success:** Trigger fires → handler executes → task_run created if needed.

### O4: Client Extensibility (Weight: 3)

Clients can create custom capabilities with their own runtime code using the same patterns.

**Success:** Client creates `.mind/capabilities/my-thing/runtime/` → MCP loads it.

### O5: Isolation (Weight: 3)

Capability runtimes can't interfere with each other or crash the MCP.

**Success:** Bad capability code → that capability fails, others continue.

---

## NON-OBJECTIVES

- **Not a general plugin system** — Only for capabilities, not arbitrary MCP extensions
- **Not hot-reloading** — Restart MCP to pick up changes (V1)
- **Not sandboxed execution** — Trust the code, it runs in MCP process
- **Not distributed** — Runs locally, no remote capability loading

---

## TRADEOFFS

| Choice | Over | Rationale |
|--------|------|-----------|
| Convention over config | Explicit registration | Less boilerplate, capabilities just work |
| In-process execution | Subprocess isolation | Simpler, faster, shared state |
| Python only | Multi-language | MCP is Python, keep it simple |
| File-based triggers | Message queue | No infra dependency, fits mind's file-centric model |

---

## DEPENDENCIES

- `mcp/server.py` — MCP server that hosts capabilities
- `runtime/ingest/docs.py` — Ingests capability specs to graph
- `templates/capabilities/` — Source capabilities in mind-platform
