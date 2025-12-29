# Capabilities — Validation

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
THIS:            VALIDATION_Capabilities.md (you are here)
IMPLEMENTATION:  ./IMPLEMENTATION_Capabilities.md
```

---

## PURPOSE

Invariants that define a valid capability. If violated, the capability is malformed.

---

## INVARIANTS

### V1: Complete Doc Chain

```
INVARIANT: Capability folder must contain all required docs

REQUIRED:
  - OBJECTIVES.md
  - PATTERNS.md
  - VOCABULARY.md
  - BEHAVIORS.md
  - ALGORITHM.md
  - VALIDATION.md
  - IMPLEMENTATION.md
  - HEALTH.md
  - SYNC.md

CHECK: ls docs/capabilities/{name}/*.md | wc -l >= 9
```

### V2: Problem Definitions

```
INVARIANT: VOCABULARY.md must define at least one problem

REQUIRED:
  - At least one PROBLEM section
  - Each problem has: id, severity, definition, detection, resolves_with

CHECK: grep -c "^### PROBLEM:" VOCABULARY.md >= 1
```

### V3: Health Indicators

```
INVARIANT: HEALTH.md must define at least one indicator

REQUIRED:
  - At least one indicator (H1, H2, etc.)
  - Each indicator has: name, priority, mechanism, signals, on_problem

CHECK: grep -c "^### H[0-9]:" HEALTH.md >= 1
```

### V4: Dock Points

```
INVARIANT: HEALTH.md must define how capability is triggered

REQUIRED:
  - docks section exists
  - At least one dock with: point, type, payload

CHECK: grep -c "point:" HEALTH.md >= 1
```

### V5: Task Resolution Path

```
INVARIANT: Every problem must have a resolution path

REQUIRED:
  - resolves_with references existing task template
  - Task template exists in tasks/

CHECK: For each problem.resolves_with, task file exists
```

### V6: Self-Description

```
INVARIANT: Capability must be understandable from its docs alone

REQUIRED:
  - OBJECTIVES explains why it exists
  - PATTERNS explains the approach
  - No external references required for basic understanding

CHECK: Manual review — can new agent operate from docs?
```

---

## VALIDATION CHECKS

| Check | Pass Condition |
|-------|----------------|
| Doc chain complete | All 9 files present |
| Problems defined | VOCABULARY has problems |
| Indicators defined | HEALTH has indicators |
| Docks defined | HEALTH has triggers |
| Resolution paths | All problems have resolves_with |
| Self-contained | No broken references |

---

## ERROR MESSAGES

| Violation | Message |
|-----------|---------|
| Missing doc | `Capability '{name}' missing {file}` |
| No problems | `Capability '{name}' defines no problems in VOCABULARY` |
| No indicators | `Capability '{name}' defines no health indicators` |
| No docks | `Capability '{name}' has no trigger points` |
| Broken resolution | `Problem '{id}' references non-existent task '{task}'` |
