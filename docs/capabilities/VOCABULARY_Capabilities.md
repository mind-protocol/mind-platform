# Capabilities — Vocabulary

```
STATUS: CANONICAL
MODULE: capabilities
```

---

## CHAIN

```
OBJECTIVES:      ./OBJECTIVES_Capabilities.md
PATTERNS:        ./PATTERNS_Capabilities.md
THIS:            VOCABULARY_Capabilities.md (you are here)
BEHAVIORS:       ./BEHAVIORS_Capabilities.md
ALGORITHM:       ./ALGORITHM_Capabilities.md
```

---

## PURPOSE

Define terms used in the capability system and problems this module detects.

---

## TERMS

### capability

An autonomous, self-describing system that knows why it exists, when to activate, and how to solve a class of problems. Contains a full doc chain.

### dock

An entry point where a capability receives triggers. Defined in HEALTH. Types: event, schedule, hook.

### trigger

A condition that causes a capability to activate. Fires when health check detects a problem.

### problem

A detectable condition that a capability can resolve. Defined in VOCABULARY of each capability.

### resolution

The successful completion of work that addresses a problem. Validated by health checks.

---

## PROBLEMS

### PROBLEM: MISSING_CAPABILITY

```yaml
id: MISSING_CAPABILITY
severity: medium
definition: Code or module exists that should have a capability, but doesn't.

detection:
  - Module has tasks but no capability doc chain
  - Health checks reference non-existent capability

resolves_with: task_create_capability
```

### PROBLEM: ORPHAN_CAPABILITY

```yaml
id: ORPHAN_CAPABILITY
severity: low
definition: Capability exists but nothing uses or triggers it.

detection:
  - No docks defined in HEALTH
  - No problems reference this capability

resolves_with: task_review_capability
```

### PROBLEM: INCOMPLETE_CAPABILITY

```yaml
id: INCOMPLETE_CAPABILITY
severity: high
definition: Capability folder missing required doc chain files.

detection:
  - Capability folder exists
  - One or more of OBJECTIVES, PATTERNS, VOCABULARY, BEHAVIORS, ALGORITHM, VALIDATION, IMPLEMENTATION, HEALTH, SYNC missing

resolves_with: task_complete_capability_docs
```

### PROBLEM: CAPABILITY_DRIFT

```yaml
id: CAPABILITY_DRIFT
severity: medium
definition: Capability docs don't match actual behavior.

detection:
  - VERIFIED date older than last code change
  - Behavior tests fail against documented expectations

resolves_with: task_sync_capability_docs
```

---

## USAGE

```yaml
# In a capability's HEALTH.md
on_problem:
  problem_id: INCOMPLETE_CAPABILITY
  creates:
    node:
      node_type: narrative
      type: task_run
      nature: "urgently concerns"
```
