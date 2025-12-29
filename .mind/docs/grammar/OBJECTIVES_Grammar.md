# Grammar — Objectives

```
STATUS: CANONICAL
MODULE: templates/grammar
```

---

## CHAIN

```
THIS:            OBJECTIVES_Grammar.md (you are here)
PATTERNS:        ./PATTERNS_Grammar.md
VOCABULARY:      ./VOCABULARY_Grammar.md
BEHAVIORS:       ./BEHAVIORS_Grammar.md
ALGORITHM:       ./ALGORITHM_Grammar.md
VALIDATION:      ./VALIDATION_Grammar.md
IMPLEMENTATION:  ./IMPLEMENTATION_Grammar.md
HEALTH:          ./HEALTH_Grammar.md
SYNC:            ./SYNC_Grammar.md
```

---

## PURPOSE

Define the rules that govern how Mind Protocol entities interact.

The grammar is the **single source of truth** for:
- How problems are detected
- How tasks are created and executed
- How actors claim and resolve work
- How state transitions happen

---

## RANKED OBJECTIVES

### O1: Deterministic Behavior (Priority: Critical)

Given the same input state, the same output must occur. No ambiguity in how detection leads to task creation, or how execution leads to resolution.

**Measure:** Any two implementations following the grammar produce identical graph mutations.

### O2: Separation of Concerns (Priority: Critical)

- **VOCABULARY** defines WHAT (problems, tasks, actors)
- **HEALTH** defines WHEN (triggers, conditions)
- **ALGORITHM** defines HOW (the grammar rules)
- **IMPLEMENTATION** defines WHERE (file structure, code)

**Measure:** Changes to detection logic don't require changes to task definitions.

### O3: Graph-Native (Priority: High)

All state lives in the graph. No in-memory-only state. Task_runs, problems, resolutions are all nodes with links.

**Measure:** Full system state recoverable from graph query alone.

### O4: Executable Specification (Priority: High)

The grammar is not just documentation—it's the specification that runtime code implements. MCP reads the grammar and executes accordingly.

**Measure:** Grammar changes automatically change runtime behavior.

---

## NON-OBJECTIVES

- **NOT a programming language:** The grammar defines state machines, not arbitrary computation.
- **NOT extensible syntax:** The grammar is fixed. Custom behavior comes from custom tasks/skills/procedures, not grammar extensions.
- **NOT human-executed:** Humans don't follow the grammar manually. Agents and automation do.

---

## SUCCESS CRITERIA

1. MCP runtime implements grammar without hardcoded special cases
2. All problem→task→resolution flows follow the same pattern
3. New problem types require only VOCABULARY entries, not code changes
4. Graph state is always consistent with grammar rules
