# Capabilities — Health

```
STATUS: CANONICAL
MODULE: capabilities
```

---

## CHAIN

```
OBJECTIVES:      ./OBJECTIVES_Capabilities.md
PATTERNS:        ./PATTERNS_Capabilities.md
VOCABULARY:      ./VOCABULARY_Capabilities.md
BEHAVIORS:       ./BEHAVIORS_Capabilities.md
ALGORITHM:       ./ALGORITHM_Capabilities.md
VALIDATION:      ./VALIDATION_Capabilities.md
IMPLEMENTATION:  ./IMPLEMENTATION_Capabilities.md
THIS:            HEALTH_Capabilities.md (you are here)
SYNC:            ./SYNC_Capabilities.md
```

---

## PURPOSE

Health checks for the capability system itself. How do we know capabilities are working?

---

## DOCKS

```yaml
docks:
  - point: mind_init
    type: event
    payload: project initialization

  - point: mind_doctor
    type: hook
    payload: health check run

  - point: capability_scan
    type: schedule
    payload: periodic capability audit
```

---

## INDICATORS

### H1: Capability Completeness

```yaml
name: Capability Completeness Check
priority: critical
rationale: Incomplete capabilities can't function

mechanism: |
  For each folder in docs/capabilities/*/:
    Check for all 9 required docs
    Flag any missing

signals:
  healthy: All capabilities have complete doc chains
  degraded: 1-2 capabilities missing docs
  critical: >2 capabilities missing docs

on_problem:
  problem_id: INCOMPLETE_CAPABILITY
  creates:
    node:
      node_type: narrative
      type: task_run
      nature: "urgently concerns"
      content: |
        # Complete Capability Docs
        Capability {name} is missing: {missing_files}
      synthesis: "Complete missing docs for capability {name}"
    links:
      - nature: "serves"
        to: task_complete_capability_docs
      - nature: "concerns"
        to: "{capability_folder}"
```

### H2: Problem Resolution Paths

```yaml
name: Resolution Path Check
priority: high
rationale: Problems without resolution paths can't be fixed

mechanism: |
  For each capability:
    Parse VOCABULARY.md
    For each problem.resolves_with:
      Check task template exists

signals:
  healthy: All problems have valid resolution paths
  degraded: 1-2 broken paths
  critical: >2 broken paths

on_problem:
  problem_id: BROKEN_RESOLUTION_PATH
  creates:
    node:
      node_type: narrative
      type: task_run
      nature: "critically concerns"
      content: |
        # Fix Resolution Path
        Problem {problem_id} references missing task {task_name}
```

### H3: Orphan Capabilities

```yaml
name: Orphan Capability Check
priority: low
rationale: Unused capabilities waste space and create confusion

mechanism: |
  For each capability:
    Check HEALTH.md has docks defined
    Check at least one trigger type exists

signals:
  healthy: All capabilities have triggers
  degraded: 1-2 orphan capabilities
  critical: >2 orphan capabilities

on_problem:
  problem_id: ORPHAN_CAPABILITY
  creates:
    node:
      node_type: narrative
      type: task_run
      nature: "optionally concerns"
      content: |
        # Review Orphan Capability
        Capability {name} has no triggers. Remove or add triggers.
```

### H4: Capability Drift

```yaml
name: Capability Drift Check
priority: medium
rationale: Out-of-date docs mislead agents

mechanism: |
  For each capability:
    Check SYNC.md LAST_UPDATED
    Compare to code modification times
    Flag if docs older than code

signals:
  healthy: All docs current
  degraded: 1-2 stale capabilities
  critical: >2 stale capabilities

on_problem:
  problem_id: CAPABILITY_DRIFT
  creates:
    node:
      node_type: narrative
      type: task_run
      nature: "importantly concerns"
      content: |
        # Sync Capability Docs
        Capability {name} docs are stale. Last updated: {date}
```

---

## HOW TO RUN

```bash
# Check all capability health
mind doctor --module capabilities

# Check specific capability
mind capabilities health {name}

# Run via MCP
capability_check(name: "create-doc-chain")
```
