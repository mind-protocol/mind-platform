# Capability Runtime — Patterns

```
STATUS: DESIGNING
MODULE: capability-runtime
```

---

## CHAIN

```
PREV:            ./OBJECTIVES_Capability_Runtime.md
THIS:            PATTERNS_Capability_Runtime.md (you are here)
NEXT:            ./BEHAVIORS_Capability_Runtime.md
```

---

## CORE PATTERN: Self-Contained Capabilities

Each capability is a self-contained folder with specs AND runtime together:

```
capabilities/{name}/              # Self-contained capability
├── OBJECTIVES.md                 # SPECS (readable by agents)
├── PATTERNS.md
├── BEHAVIORS.md
├── ALGORITHM.md
├── VALIDATION.md
├── IMPLEMENTATION.md
├── HEALTH.md
├── SYNC.md
├── tasks/
│   └── TASK_*.md
├── skills/
│   └── SKILL_*.md
├── procedures/
│   └── PROCEDURE_*.yaml
└── runtime/                      # CODE (executed by MCP)
    ├── __init__.py               # Module init, exports HANDLERS
    └── monitor.py                # HealthMonitor implementations
```

After `mind init`, copied to `.mind/capabilities/{name}/`.

**Why together?**
- Capability is one unit — copy folder, it works
- Specs and runtime evolve together
- Single source of truth per capability

---

## PATTERN: Decorator-Based Health Checks

Health checks use decorators — Python is the single source of truth (no YAML drift):

```python
# capabilities/create-doc-chain/runtime/checks.py

from mind.capability import check, Signal, triggers

@check(
    id="chain_completeness",
    triggers=[
        triggers.file.on_delete("docs/**/*.md"),
        triggers.init.after_scan(),
        triggers.cron.daily(),
    ],
    on_problem="INCOMPLETE_CHAIN",
    task="TASK_create_doc",
)
def chain_completeness(ctx) -> Signal:
    """Check if module has complete doc chain."""
    expected = {"OBJECTIVES", "PATTERNS", "BEHAVIORS", "ALGORITHM",
                "VALIDATION", "IMPLEMENTATION", "HEALTH", "SYNC"}
    module = ctx.module_id
    found = {f.stem.split("_")[0].upper()
             for f in ctx.list_files(f"docs/{module}/*.md")}
    missing = expected - found

    if not missing:
        return Signal.HEALTHY
    if {"OBJECTIVES", "PATTERNS"} & missing:
        return Signal.CRITICAL(missing=list(missing))
    return Signal.DEGRADED(missing=list(missing))
```

MCP loader scans `.mind/capabilities/*/runtime/checks.py` and collects `@check` decorated functions.

---

## PATTERN: Trigger Types

| Type | Format | When |
|------|--------|------|
| `init.*` | `init.{phase}` | During MCP startup |
| `file.*` | `file.{event}` | File system changes |
| `cron.*` | `cron.{schedule}` | Scheduled intervals |
| `signal.*` | `signal.{name}` | Health signal fires |
| `graph.*` | `graph.{event}` | Graph mutations |
| `manual.*` | `manual.{name}` | Explicit invocation |

---

## PATTERN: Signal Return Values

Check functions return Signal with optional data:

```python
from mind.health import Signal

# Simple returns
return Signal.HEALTHY
return Signal.DEGRADED
return Signal.CRITICAL

# With context data (for task creation)
return Signal.DEGRADED(missing=["BEHAVIORS", "ALGORITHM"])
return Signal.CRITICAL(missing=["OBJECTIVES"], module="auth")
```

MCP uses the signal to decide whether to create a task_run.

---

## PATTERN: Check Context

MCP injects a context object with read-only accessors:

```python
class CheckContext:
    payload: dict              # Trigger payload (module, path, etc.)

    def list_files(self, pattern: str) -> list[Path]: ...
    def read_file(self, path: Path) -> str: ...
    def query_nodes(self, **filters) -> list[Node]: ...
    def query_links(self, **filters) -> list[Link]: ...
    def get_config(self, key: str) -> any: ...
    def log(self, level: str, msg: str): ...
```

Context is read-only. Checks cannot write to graph or filesystem.

---

## PATTERN: Task Creation Flow

```
Trigger fires (file.deleted, cron.daily, etc.)
    │
    ▼
MCP finds matching @check functions
    │
    ▼
check_fn(context) → Signal
    │
    ├─► Signal.HEALTHY → No action
    │
    └─► Signal.DEGRADED/CRITICAL
            │
            ▼
        MCP creates task_run in graph
        (uses on_problem + task from decorator)
            │
            ▼
        Agent picks up task_run
        (reads TASK_*.md, SKILL_*.md)
```

---

## PATTERN: Capability Isolation

Each capability loads in its own namespace:

```python
# MCP loader (runtime/capability/loader.py)
for cap_dir in discover_capabilities():
    try:
        checks = load_checks(cap_dir / "runtime" / "checks.py")
        for check_fn in checks:
            register_check(check_fn)
            log.info(f"Registered: {check_fn.id} from {cap_dir.name}")
    except Exception as e:
        log.error(f"Capability {cap_dir.name} failed: {e}")
        # Continue loading other capabilities
```

Failure in one capability doesn't affect others.

---

## PATTERN: Context Propagation

Check functions receive a `CheckContext` with trigger info and read-only accessors:

```python
@dataclass
class CheckContext:
    # Trigger info
    trigger: str                    # e.g. "file.deleted"
    trigger_source: str             # e.g. "docs/auth/PATTERNS.md"
    capability: str                 # e.g. "create-doc-chain"
    timestamp: datetime

    # Payload (varies by trigger type)
    module_id: str | None           # For module-related triggers
    file_path: Path | None          # For file triggers

    # Read-only accessors (see Check Context section)
    def list_files(self, pattern: str) -> list[Path]: ...
    def read_file(self, path: Path) -> str: ...
    def query_graph(self, **filters) -> list[Node]: ...
```

---

## ANTI-PATTERNS

| Avoid | Instead |
|-------|---------|
| YAML config + Python code | Decorator pattern (single source) |
| Checks that poll | Use triggers |
| Writing to graph/files in checks | Return Signal, let MCP handle |
| Cross-capability imports | Keep capabilities independent |
| Slow checks (>1s) | Keep fast, defer work to tasks |
| Hardcoded paths | Use ctx.list_files() with patterns |

---

## DESIGN RATIONALE

**Why decorators over YAML?**
- Single source of truth (no config/code drift)
- IDE autocomplete on triggers
- Type-safe, refactor-friendly

**Why checks return Signal not TaskRun?**
- Simpler API: just healthy/degraded/critical
- MCP handles task creation from decorator metadata
- Checks don't need to know graph structure

**Why read-only context?**
- Checks detect, they don't fix
- Side effects belong in tasks executed by agents

**Why Python only?**
- MCP is Python
- Shared runtime, no IPC overhead
- Easier to maintain one language
