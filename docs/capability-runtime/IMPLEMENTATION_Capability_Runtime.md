# Capability Runtime — Implementation

```
STATUS: DESIGNING
MODULE: capability-runtime
```

---

## CHAIN

```
PREV:            ./VALIDATION_Capability_Runtime.md
THIS:            IMPLEMENTATION_Capability_Runtime.md (you are here)
NEXT:            ./HEALTH_Capability_Runtime.md
```

---

## CODE LOCATIONS

### Core Runtime

| Component | Path | Purpose |
|-----------|------|---------|
| Capability loader | `runtime/capability/loader.py` | Discovery and import |
| Trigger registry | `runtime/capability/registry.py` | Trigger → handler mapping |
| Base classes | `runtime/capability/base.py` | HealthMonitor, TaskRun |
| Dispatcher | `runtime/capability/dispatch.py` | Trigger dispatch logic |

### MCP Integration

| Component | Path | Purpose |
|-----------|------|---------|
| Server hooks | `mcp/server.py` | Lifecycle integration |
| Health endpoint | `mcp/health.py` | Aggregated health |

### Capabilities (Self-Contained)

```
capabilities/{name}/              # Each capability is self-contained
├── OBJECTIVES.md                 # Specs (agent-readable)
├── PATTERNS.md
├── BEHAVIORS.md
├── ALGORITHM.md
├── VALIDATION.md
├── IMPLEMENTATION.md
├── HEALTH.md
├── SYNC.md
├── tasks/TASK_*.md
├── skills/SKILL_*.md
├── procedures/PROCEDURE_*.yaml
└── runtime/                      # Code (MCP-executable)
    ├── __init__.py               # Exports CHECKS list
    └── checks.py                 # @check decorated functions
```

### Installed Locations

After `mind init`:

```
.mind/capabilities/{name}/        # Full copy (specs + runtime together)
└── [same structure]
```

---

## KEY CLASSES

### Signal (base.py)

```python
class Signal:
    """Health check return values."""
    HEALTHY = "healthy"
    DEGRADED = "degraded"
    CRITICAL = "critical"

    @classmethod
    def healthy(cls) -> dict:
        return {"signal": cls.HEALTHY}

    @classmethod
    def degraded(cls, **data) -> dict:
        return {"signal": cls.DEGRADED, **data}

    @classmethod
    def critical(cls, **data) -> dict:
        return {"signal": cls.CRITICAL, **data}
```

### CheckContext (base.py)

```python
@dataclass
class CheckContext:
    """Read-only context passed to @check functions."""
    trigger: str
    trigger_source: str
    capability: str
    timestamp: datetime
    module_id: str | None = None
    file_path: Path | None = None

    # Injected by MCP
    _target_dir: Path = None
    _graph: GraphOps = None

    def list_files(self, pattern: str) -> list[Path]:
        return list(self._target_dir.glob(pattern))

    def read_file(self, path: Path) -> str:
        return (self._target_dir / path).read_text()

    def query_graph(self, **filters) -> list[Node]:
        return self._graph.query(**filters)
```

### @check Decorator (decorators.py)

```python
def check(id: str, triggers: list, on_problem: str, task: str):
    """Register a health check function."""
    def decorator(fn):
        fn.check_id = id
        fn.triggers = triggers
        fn.on_problem = on_problem
        fn.task = task
        return fn
    return decorator
```

### Capability Loader (loader.py)

```python
def load_checks(checks_file: Path) -> list[Callable]:
    """Load @check decorated functions from checks.py."""
    spec = importlib.util.spec_from_file_location("checks", checks_file)
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)

    # Find CHECKS list or scan for decorated functions
    if hasattr(module, "CHECKS"):
        return module.CHECKS

    return [
        obj for obj in vars(module).values()
        if callable(obj) and hasattr(obj, "check_id")
    ]

def discover_capabilities(caps_dir: Path) -> list[tuple[str, list]]:
    """Discover all capabilities and their checks."""
    results = []
    for cap_dir in sorted(caps_dir.iterdir()):
        if not cap_dir.is_dir() or cap_dir.name.startswith("_"):
            continue
        checks_file = cap_dir / "runtime" / "checks.py"
        if checks_file.exists():
            checks = load_checks(checks_file)
            results.append((cap_dir.name, checks))
            log.info(f"Loaded {len(checks)} checks from {cap_dir.name}")
    return results
```

---

## DATA FLOW

```
[Trigger fires: file.deleted, cron.daily, etc.]
        │
        ▼
[MCP finds matching @check functions]
        │
        ▼
[check_fn(ctx) → Signal]
        │
        ├─► Signal.HEALTHY → No action
        │
        └─► Signal.DEGRADED/CRITICAL
                │
                ▼
        [MCP creates task_run in graph]
        [uses on_problem + task from decorator]
                │
                ▼
        [Agent picks up task_run]
```

---

## CONFIGURATION

No configuration file needed. Convention over configuration:

- Capability code in `capabilities/{name}/runtime/checks.py`
- Export `CHECKS` list or use `@check` decorator
- MCP scans `.mind/capabilities/*/runtime/checks.py` after init

---

## DEPENDENCIES

| Dependency | Purpose | Required |
|------------|---------|----------|
| Python 3.10+ | Dataclasses, type hints | Yes |
| MCP server | Host for capabilities | Yes |
| Graph database | TaskRun storage | Yes |
| Embedding service | TaskRun synthesis | Yes |

---

## IMPLEMENTATION STATUS

| Component | Status | Notes |
|-----------|--------|-------|
| Signal, CheckContext | Not started | base.py |
| @check decorator | Not started | decorators.py |
| triggers namespace | Not started | triggers.py |
| Loader | Not started | loader.py |
| MCP integration | Not started | Server hooks |
| First capability | Done | create-doc-chain |

---

## FILE STRUCTURE (Full)

```
runtime/capability/               # Core capability infrastructure
├── __init__.py                   # Public API: Signal, check, triggers
├── base.py                       # Signal, CheckContext
├── decorators.py                 # @check decorator
├── triggers.py                   # triggers namespace (file, init, cron)
└── loader.py                     # discover_capabilities, load_checks

capabilities/                     # Capability implementations
└── create-doc-chain/
    ├── *.md                      # Specs
    ├── tasks/
    ├── skills/
    ├── procedures/
    └── runtime/                  # MCP-executable code
        ├── __init__.py
        └── checks.py
```
