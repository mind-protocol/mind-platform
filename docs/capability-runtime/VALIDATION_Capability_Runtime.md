# Capability Runtime — Validation

```
STATUS: DESIGNING
MODULE: capability-runtime
```

---

## CHAIN

```
PREV:            ./ALGORITHM_Capability_Runtime.md
THIS:            VALIDATION_Capability_Runtime.md (you are here)
NEXT:            ./IMPLEMENTATION_Capability_Runtime.md
```

---

## INVARIANTS

### V1: Capability Structure

**Statement:** Every loaded capability has valid structure.

**Check:**
```python
def check_capability_structure(cap_dir: Path) -> bool:
    init_file = cap_dir / "__init__.py"
    if not init_file.exists():
        return False

    module = import_module(cap_dir)
    if not hasattr(module, "HANDLERS"):
        return False

    handlers = module.HANDLERS
    if not isinstance(handlers, dict):
        return False

    return True
```

**When violated:** Capability skipped with warning log.

---

### V2: Handler Signature

**Statement:** All handlers accept `context: dict` and return `List[TaskRun]` or `[]`.

**Check:**
```python
def check_handler_signature(handler: Callable) -> bool:
    sig = inspect.signature(handler)
    params = list(sig.parameters.keys())
    return "context" in params or len(params) >= 1
```

**When violated:** Handler invocation wrapped in try/catch; type errors logged.

---

### V3: TaskRun Validity

**Statement:** Every TaskRun has a non-empty `task_template` pointing to an existing task.

**Check:**
```python
def check_task_run(task_run: TaskRun, graph: GraphOps) -> bool:
    if not task_run.task_template:
        return False

    node = graph.get_node(task_run.task_template)
    return node is not None and node.type == "task"
```

**When violated:** TaskRun skipped, error logged.

---

### V4: Trigger Format

**Statement:** Trigger names follow `{type}.{name}` format where type is one of: `init`, `file`, `cron`, `signal`, `graph`, `manual`.

**Check:**
```python
VALID_TRIGGER_TYPES = {"init", "file", "cron", "signal", "graph", "manual"}

def check_trigger_format(trigger: str) -> bool:
    parts = trigger.split(".", 1)
    if len(parts) != 2:
        return False
    return parts[0] in VALID_TRIGGER_TYPES
```

**When violated:** Handler not registered, warning logged.

---

### V5: Capability Isolation

**Statement:** Failure in one capability does not affect others.

**Check:**
```python
def check_isolation(capabilities: List[Path]) -> bool:
    # Load each capability independently
    for cap in capabilities:
        try:
            load_capability(cap)
        except Exception:
            pass  # Expected for some

    # Verify other capabilities still work
    for cap in capabilities:
        if is_valid_capability(cap):
            assert can_invoke_handlers(cap)

    return True
```

**When violated:** Bug in isolation logic; requires fix.

---

### V6: Handler Timeout

**Statement:** Handlers complete within 30 seconds.

**Check:**
```python
def check_handler_timeout(handler: Callable, context: dict) -> bool:
    start = time.time()
    try:
        with timeout(30):
            handler(context)
        return True
    except TimeoutError:
        return False
    finally:
        elapsed = time.time() - start
        if elapsed > 5:
            log.warning(f"Handler slow: {elapsed:.1f}s")
```

**When violated:** Handler killed, TimeoutError logged, other handlers continue.

---

### V7: Monitor Health Contract

**Statement:** Every HealthMonitor has `capability` and `signal_id` attributes.

**Check:**
```python
def check_monitor_contract(monitor: HealthMonitor) -> bool:
    return (
        hasattr(monitor, "capability") and
        hasattr(monitor, "signal_id") and
        hasattr(monitor, "check") and
        callable(monitor.check)
    )
```

**When violated:** Monitor not registered, warning logged.

---

### V8: No Cross-Capability Imports

**Statement:** Capability runtime code does not import from other capabilities.

**Check:**
```python
def check_no_cross_imports(cap_dir: Path) -> bool:
    for py_file in cap_dir.glob("**/*.py"):
        content = py_file.read_text()
        # Check for imports from sibling capabilities
        if re.search(r"from \.\.[\w]+", content):
            return False
        if re.search(r"from mind\.runtime\.capabilities\.\w+", content):
            return False
    return True
```

**When violated:** Design error; requires refactor.

---

## VALIDATION MATRIX

| Invariant | Check Time | Failure Mode | Recovery |
|-----------|------------|--------------|----------|
| V1 | Load | Skip capability | Log warning |
| V2 | Load | Wrap in try/catch | Log error |
| V3 | Dispatch | Skip TaskRun | Log error |
| V4 | Registration | Skip handler | Log warning |
| V5 | Always | N/A (design) | Bug fix |
| V6 | Dispatch | Kill handler | Log error |
| V7 | Load | Skip monitor | Log warning |
| V8 | CI/lint | N/A (design) | Refactor |

---

## TEST SCENARIOS

### T1: Valid Capability Loads

```
GIVEN: capability with valid __init__.py and HANDLERS
WHEN: MCP starts
THEN: capability discovered, handlers registered
```

### T2: Invalid Capability Skipped

```
GIVEN: capability missing __init__.py
WHEN: MCP starts
THEN: capability skipped, warning logged, others load normally
```

### T3: Handler Exception Contained

```
GIVEN: handler that raises Exception
WHEN: trigger dispatched
THEN: exception logged, other handlers still called
```

### T4: Handler Timeout

```
GIVEN: handler that runs > 30s
WHEN: trigger dispatched
THEN: handler killed after 30s, TimeoutError logged
```

### T5: Invalid TaskRun Rejected

```
GIVEN: handler returns TaskRun with empty task_template
WHEN: creating task_runs
THEN: TaskRun skipped, error logged
```

### T6: Duplicate Trigger Warning

```
GIVEN: two capabilities register same trigger
WHEN: MCP starts
THEN: warning logged, last registration wins
```
