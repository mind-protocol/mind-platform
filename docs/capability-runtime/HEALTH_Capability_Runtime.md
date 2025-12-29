# Capability Runtime — Health

```
STATUS: DESIGNING
MODULE: capability-runtime
```

---

## CHAIN

```
PREV:            ./IMPLEMENTATION_Capability_Runtime.md
THIS:            HEALTH_Capability_Runtime.md (you are here)
NEXT:            ./SYNC_Capability_Runtime.md
```

---

## HEALTH SIGNALS

### H1: Capability Load Success

**Signal:** `capability_runtime.load_success`

**Healthy when:** All capabilities in `.mind/runtime/capabilities/` load without error.

**Check:**
```python
def check_load_success(runtime_dir: Path) -> HealthResult:
    cap_dir = runtime_dir / "capabilities"
    if not cap_dir.exists():
        return HealthResult(healthy=True)  # No capabilities is fine

    issues = []
    for subdir in cap_dir.iterdir():
        if subdir.is_dir() and not subdir.name.startswith("_"):
            cap = load_capability(subdir)
            if cap is None:
                issues.append(f"Failed to load: {subdir.name}")

    return HealthResult(
        healthy=len(issues) == 0,
        issues=issues
    )
```

**On failure:**
- Log which capabilities failed
- Continue with working capabilities

---

### H2: Handler Registration

**Signal:** `capability_runtime.handlers_registered`

**Healthy when:** At least one handler is registered (if capabilities exist).

**Check:**
```python
def check_handlers_registered(registry: TriggerRegistry) -> HealthResult:
    triggers = registry.get_all_triggers()
    if not triggers:
        return HealthResult(
            healthy=False,
            issues=["No handlers registered"]
        )
    return HealthResult(healthy=True)
```

**On failure:**
- Capabilities exist but no handlers → investigate HANDLERS exports

---

### H3: Trigger Response Time

**Signal:** `capability_runtime.trigger_latency`

**Healthy when:** Average trigger dispatch time < 100ms.

**Check:**
```python
def check_trigger_latency(metrics: DispatchMetrics) -> HealthResult:
    avg_latency = metrics.average_dispatch_time()
    if avg_latency > 100:  # ms
        return HealthResult(
            healthy=False,
            issues=[f"High trigger latency: {avg_latency:.0f}ms"]
        )
    return HealthResult(healthy=True)
```

**On failure:**
- Investigate slow handlers
- Consider async dispatch for slow handlers

---

### H4: Handler Error Rate

**Signal:** `capability_runtime.handler_errors`

**Healthy when:** Handler error rate < 5% over last 100 invocations.

**Check:**
```python
def check_handler_errors(metrics: DispatchMetrics) -> HealthResult:
    error_rate = metrics.error_rate(window=100)
    if error_rate > 0.05:
        return HealthResult(
            healthy=False,
            issues=[f"High handler error rate: {error_rate:.1%}"]
        )
    return HealthResult(healthy=True)
```

**On failure:**
- Check logs for error patterns
- Investigate failing capabilities

---

### H5: Task Creation Success

**Signal:** `capability_runtime.task_creation`

**Healthy when:** TaskRun creation succeeds for valid TaskRuns.

**Check:**
```python
def check_task_creation(metrics: TaskMetrics) -> HealthResult:
    failures = metrics.creation_failures(window=50)
    if failures > 2:  # More than 2 failures in last 50
        return HealthResult(
            healthy=False,
            issues=[f"Task creation failures: {failures}"]
        )
    return HealthResult(healthy=True)
```

**On failure:**
- Check graph connectivity
- Verify TaskRun templates exist

---

## HEALTH MATRIX

| Signal | Frequency | Severity | Recovery |
|--------|-----------|----------|----------|
| H1 | Startup | Warning | Skip bad capabilities |
| H2 | Startup | Warning | Check HANDLERS exports |
| H3 | Continuous | Warning | Profile slow handlers |
| H4 | Continuous | Error | Fix failing handlers |
| H5 | On dispatch | Error | Check graph/templates |

---

## MONITORING IMPLEMENTATION

```python
class CapabilityRuntimeMonitor(HealthMonitor):
    """Health monitor for the capability runtime itself."""

    capability = "capability-runtime"
    signal_id = "capability_runtime"

    def __init__(self, runtime_dir: Path, registry: TriggerRegistry):
        self.runtime_dir = runtime_dir
        self.registry = registry
        self.metrics = DispatchMetrics()

    def check(self, context: dict) -> HealthResult:
        issues = []

        # H1: Load success
        load_result = check_load_success(self.runtime_dir)
        issues.extend(load_result.issues)

        # H2: Handlers registered
        reg_result = check_handlers_registered(self.registry)
        issues.extend(reg_result.issues)

        # H3: Latency
        latency_result = check_trigger_latency(self.metrics)
        issues.extend(latency_result.issues)

        # H4: Error rate
        error_result = check_handler_errors(self.metrics)
        issues.extend(error_result.issues)

        return HealthResult(
            healthy=len(issues) == 0,
            issues=issues
        )
```

---

## DASHBOARD OUTPUT

```
Capability Runtime Health
=========================

Capabilities:
  ✓ create-doc-chain (3 handlers)
  ✓ sync-state (2 handlers)
  ✗ custom-lint (failed to load: missing HANDLERS)

Triggers:
  init.startup: 2 handlers
  init.after_module_scan: 1 handler
  file.deleted: 1 handler
  cron.daily: 2 handlers

Metrics (last 100 dispatches):
  Avg latency: 23ms
  Error rate: 1%
  TaskRuns created: 12

Status: HEALTHY (1 warning)
```
