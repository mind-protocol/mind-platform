# Grammar — Health

```
STATUS: CANONICAL
MODULE: templates/grammar
```

---

## CHAIN

```
VALIDATION:      ./VALIDATION_Grammar.md
IMPLEMENTATION:  ./IMPLEMENTATION_Grammar.md
THIS:            HEALTH_Grammar.md (you are here)
SYNC:            ./SYNC_Grammar.md
```

---

## PURPOSE

Health indicators for the grammar system itself. Monitors that the grammar is being followed correctly.

---

## FLOWS

### F1: Grammar Execution Flow

```
trigger: on_tool_call
frequency: every MCP tool invocation
risk: high (grammar violations corrupt state)
```

### F2: State Consistency Flow

```
trigger: cron:hourly, on_health_check
frequency: hourly + on demand
risk: medium (inconsistent state causes confusion)
```

---

## INDICATORS

### H1: Invariant Compliance

```yaml
name: Invariant Compliance
priority: critical
rationale: Grammar invariants must hold at all times

docks:
  - point: health_check.start
    type: event
    payload: {}

mechanism: |
  Run all invariant checks from VALIDATION_Grammar.md
  For each violation: log error, create incident

signals:
  healthy: All invariants pass
  degraded: Info-level violations only
  critical: Any critical invariant violated

throttling: Run full check max once per hour
```

### H2: Task Run Lifecycle

```yaml
name: Task Run Lifecycle Health
priority: high
rationale: Task runs should complete, not stall

docks:
  - point: cron.hourly
    type: schedule
    payload: {}

mechanism: |
  Query task_runs with status='running' AND claimed_at < (now - 1 hour)
  These are potentially stuck tasks
  Alert if count > 0

signals:
  healthy: No stuck task_runs
  degraded: 1-3 stuck task_runs
  critical: >3 stuck task_runs

throttling: Alert max once per hour per stuck task
```

### H3: Actor Availability

```yaml
name: Actor Availability
priority: high
rationale: Work can't progress without ready actors

docks:
  - point: health_check.start
    type: event
    payload: {}

mechanism: |
  Query actors with status='ready'
  Query pending task_runs
  If pending > 0 AND ready actors = 0: problem

signals:
  healthy: Ready actors available OR no pending work
  degraded: Pending work, few ready actors
  critical: Pending work, zero ready actors

throttling: None
```

### H4: Detection Consistency

```yaml
name: Detection Consistency
priority: medium
rationale: Same input should produce same detection result

docks:
  - point: after_detection
    type: event
    payload: {indicator_id, result}

mechanism: |
  Track last N detection results per indicator
  Flag if results flip-flop (detect, not-detect, detect)
  Flapping indicates unstable condition

signals:
  healthy: Stable detection results
  degraded: Occasional flapping
  critical: Persistent flapping

throttling: Track over 1 hour window
```

### H5: Resolution Success Rate

```yaml
name: Resolution Success Rate
priority: medium
rationale: Tasks should resolve problems, not just complete

docks:
  - point: after_resolution
    type: event
    payload: {task_run_id, verified}

mechanism: |
  Track verification results after task completion
  Calculate success rate over last 24 hours
  Flag if rate drops below threshold

signals:
  healthy: >90% resolution success
  degraded: 70-90% resolution success
  critical: <70% resolution success

throttling: Calculate hourly
```

---

## GAPS

| Gap | Risk | Mitigation |
|-----|------|------------|
| No real-time invariant checking | Violations detected late | Hourly checks catch most issues |
| No distributed lock for claims | Race conditions possible | Single MCP instance assumption |
| No timeout enforcement | Stuck tasks accumulate | H2 indicator alerts |

---

## COVERAGE

| Objective | Covered By |
|-----------|------------|
| O1: Deterministic Behavior | H4 (detection consistency) |
| O2: Separation of Concerns | (Structural, not runtime) |
| O3: Graph-Native | H1 (invariant checks verify graph state) |
| O4: Executable Specification | (Verified by tests, not runtime) |
