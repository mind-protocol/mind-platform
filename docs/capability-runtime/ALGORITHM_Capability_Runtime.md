# Capability Runtime — Algorithm

```
STATUS: DESIGNING
MODULE: capability-runtime
```

---

## CHAIN

```
PREV:            ./BEHAVIORS_Capability_Runtime.md
THIS:            ALGORITHM_Capability_Runtime.md (you are here)
NEXT:            ./VALIDATION_Capability_Runtime.md
```

---

## A1: Capability Discovery

```
FUNCTION discover_capabilities(mind_dir: Path) -> List[Path]:
    cap_dir = mind_dir / "capabilities"

    IF NOT cap_dir.exists():
        RETURN []

    capabilities = []
    FOR each subdirectory in cap_dir:
        checks_py = subdirectory / "runtime" / "checks.py"
        IF checks_py.exists():
            capabilities.append(subdirectory)
            LOG "Discovered capability: {subdirectory.name}"
        ELSE:
            LOG warning "Capability {subdirectory.name} missing runtime/checks.py"

    RETURN capabilities
```

---

## A2: Load Checks from Capability

```
FUNCTION load_checks(checks_py: Path) -> List[CheckFunction]:
    TRY:
        # Dynamic import
        spec = importlib.util.spec_from_file_location("checks", checks_py)
        module = importlib.util.module_from_spec(spec)
        spec.loader.exec_module(module)

        # Collect @check decorated functions
        checks = getattr(module, "__checks__", [])
        LOG "Loaded {len(checks)} checks from {checks_py}"
        RETURN checks

    CATCH Exception as e:
        LOG error "Failed to load {checks_py}: {e}"
        RETURN []
```

---

## A3: Check Registration

```
FUNCTION register_checks(capabilities: List[Path]) -> TriggerRegistry:
    registry = TriggerRegistry()

    FOR cap_dir in capabilities:
        checks_py = cap_dir / "runtime" / "checks.py"
        checks = load_checks(checks_py)

        FOR check_fn in checks:
            meta = check_fn.__check_meta__

            FOR trigger in meta["triggers"]:
                registry.register(
                    trigger_type=trigger["type"],
                    trigger_match=trigger.get("match"),
                    check_fn=check_fn,
                    capability=cap_dir.name
                )
                LOG "Registered: {meta['id']} on {trigger['type']}"

    RETURN registry
```

---

## A4: Trigger Dispatch

```
FUNCTION dispatch_trigger(trigger_type: str, payload: dict, registry: TriggerRegistry) -> List[Signal]:
    matching_checks = registry.get_checks(trigger_type, payload)
    results = []

    LOG "Trigger: {trigger_type} → {len(matching_checks)} checks"

    FOR check_fn, capability in matching_checks:
        TRY:
            # Build context
            ctx = CheckContext(
                trigger=trigger_type,
                capability=capability,
                payload=payload,
                # ... read-only accessors
            )

            # Call check with timeout
            WITH timeout(30):
                signal = check_fn(ctx)

            results.append((check_fn, signal))

        CATCH TimeoutError:
            LOG error "Check {check_fn.__check_meta__['id']} timed out"
        CATCH Exception as e:
            LOG error "Check failed: {e}"

    RETURN results
```

---

## A5: Task Creation from Signal

```
FUNCTION create_task_runs(results: List[Tuple[CheckFn, Signal]], graph: GraphOps) -> List[str]:
    created_ids = []

    FOR check_fn, signal in results:
        IF signal.level == "HEALTHY":
            CONTINUE

        meta = check_fn.__check_meta__

        # Create task_run node
        node_id = f"narrative:task_run:{uuid()}"

        graph.create_node(
            id=node_id,
            node_type="narrative",
            type="task_run",
            content=f"Problem: {meta['on_problem']}\nSignal: {signal.level}\nData: {signal.data}",
            synthesis=f"Fix {meta['on_problem']} ({signal.level})"
        )

        # Link to task template
        task_node = find_task_node(meta["capability"], meta["task"])
        graph.create_link(source=node_id, target=task_node, nature="executes")

        # Link to problem
        problem_node = find_problem_node(meta["on_problem"])
        IF problem_node:
            graph.create_link(source=node_id, target=problem_node, nature="addresses")

        created_ids.append(node_id)
        LOG "Created task_run: {node_id} for {meta['on_problem']}"

    RETURN created_ids
```

---

## A6: MCP Startup Integration

```
FUNCTION initialize_capability_runtime(mcp: MCPServer, mind_dir: Path):
    # Phase 1: Discovery
    capabilities = discover_capabilities(mind_dir)
    LOG "Discovered {len(capabilities)} capabilities"

    # Phase 2: Registration
    mcp.check_registry = register_checks(capabilities)

    # Phase 3: Run init triggers
    results = dispatch_trigger("init.after_scan", {}, mcp.check_registry)
    create_task_runs(results, mcp.graph)

    # Phase 4: Setup file watcher
    setup_file_watcher(mind_dir, mcp.check_registry, mcp.graph)

    # Phase 5: Setup cron
    setup_cron_triggers(mcp.check_registry, mcp.graph)
```

---

## DATA STRUCTURES

```python
@dataclass
class Signal:
    level: str          # "HEALTHY", "DEGRADED", "CRITICAL"
    data: dict = None   # Optional context (e.g., {missing: ["OBJECTIVES"]})

    @classmethod
    def HEALTHY(cls):
        return cls(level="HEALTHY")

    @classmethod
    def DEGRADED(cls, **data):
        return cls(level="DEGRADED", data=data)

    @classmethod
    def CRITICAL(cls, **data):
        return cls(level="CRITICAL", data=data)


@dataclass
class CheckContext:
    trigger: str
    capability: str
    payload: dict

    # Convenience accessors
    @property
    def module_id(self) -> str | None:
        return self.payload.get("module_id")

    @property
    def file_path(self) -> Path | None:
        return self.payload.get("file_path")

    # Read-only methods
    def list_files(self, pattern: str) -> list[Path]: ...
    def read_file(self, path: Path) -> str: ...
    def query_nodes(self, **filters) -> list[Node]: ...


class TriggerRegistry:
    def __init__(self):
        self.checks: dict[str, list] = defaultdict(list)

    def register(self, trigger_type: str, trigger_match: str, check_fn, capability: str):
        self.checks[trigger_type].append((trigger_match, check_fn, capability))

    def get_checks(self, trigger_type: str, payload: dict) -> list:
        results = []
        for match, check_fn, capability in self.checks.get(trigger_type, []):
            if match is None or fnmatch(payload.get("path", ""), match):
                results.append((check_fn, capability))
        return results
```

---

## SEQUENCE: Full Trigger Flow

```
1. Event occurs (file delete, cron tick, init phase)
         │
2. MCP identifies trigger type + builds payload
         │
3. dispatch_trigger(type, payload, registry)
         │
4. FOR each matching @check function:
   ├── Build CheckContext (read-only)
   ├── check_fn(ctx) → Signal
   └── Exceptions caught, logged
         │
5. Collect (check_fn, Signal) pairs
         │
6. create_task_runs(results, graph)
   └── Only for DEGRADED/CRITICAL signals
         │
7. Agent picks up task_run
         │
8. Agent reads TASK_*.md, SKILL_*.md
         │
9. Agent executes, marks complete
```

---

## DECORATOR IMPLEMENTATION

```python
# mind/capability/decorators.py

def check(id: str, triggers: list, on_problem: str, task: str):
    """Decorator to register a health check function."""
    def decorator(fn):
        fn.__check_meta__ = {
            "id": id,
            "triggers": triggers,
            "on_problem": on_problem,
            "task": task,
            "capability": None,  # Set by loader
        }

        # Register in module's __checks__ list
        import sys
        module = sys.modules[fn.__module__]
        if not hasattr(module, "__checks__"):
            module.__checks__ = []
        module.__checks__.append(fn)

        return fn
    return decorator


class triggers:
    """Trigger builders with IDE autocomplete."""

    class file:
        @staticmethod
        def on_delete(match: str):
            return {"type": "file.on_delete", "match": match}

        @staticmethod
        def on_create(match: str):
            return {"type": "file.on_create", "match": match}

        @staticmethod
        def on_modify(match: str):
            return {"type": "file.on_modify", "match": match}

    class init:
        @staticmethod
        def after_scan():
            return {"type": "init.after_scan"}

        @staticmethod
        def startup():
            return {"type": "init.startup"}

    class cron:
        @staticmethod
        def daily():
            return {"type": "cron.daily"}

        @staticmethod
        def hourly():
            return {"type": "cron.hourly"}
```
