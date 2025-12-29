# Capabilities — Objectives

```
STATUS: CANONICAL
MODULE: capabilities
```

---

## CHAIN

```
THIS:            OBJECTIVES_Capabilities.md (you are here)
PATTERNS:        ./PATTERNS_Capabilities.md
VOCABULARY:      ./VOCABULARY_Capabilities.md
BEHAVIORS:       ./BEHAVIORS_Capabilities.md
ALGORITHM:       ./ALGORITHM_Capabilities.md
VALIDATION:      ./VALIDATION_Capabilities.md
IMPLEMENTATION:  ./IMPLEMENTATION_Capabilities.md
HEALTH:          ./HEALTH_Capabilities.md
SYNC:            ./SYNC_Capabilities.md
```

---

## PURPOSE

Define the capability system — autonomous, self-describing functional organs of Mind Protocol.

A **capability** is a complete system that knows why it exists, when to activate, and how to solve a class of problems.

---

## RANKED OBJECTIVES

### O1: Self-Description (Priority: Critical)

A capability must be fully understandable by reading its folder alone. No external context required.

**Measure:** New agent can operate capability after reading only its docs.

### O2: Autonomous Activation (Priority: Critical)

Capabilities detect when they should run. No human trigger required.

**Measure:** Health checks fire, tasks created, work happens — automatically.

### O3: Problem Resolution (Priority: High)

Each capability resolves a specific class of problems. Clear scope, clear outcomes.

**Measure:** Problem detected → capability runs → problem resolved.

### O4: Composability (Priority: Medium)

Capabilities can use other capabilities. No circular dependencies.

**Measure:** Complex behaviors emerge from capability composition.

---

## NON-OBJECTIVES

- **NOT skills** — Skills are tools agents use. Capabilities are systems that run.
- **NOT procedures** — Procedures are step sequences. Capabilities include detection, execution, validation.
- **NOT one-shot** — Capabilities run continuously, not once.

---

## TRADEOFFS

- When **simplicity** conflicts with **autonomy**, choose autonomy.
- When **speed** conflicts with **completeness**, choose completeness.
- We accept **more docs** to preserve **self-description**.

---

## SUCCESS SIGNALS

- Agent arrives, reads capability docs, operates it correctly
- Problems auto-detected, tasks auto-created, work auto-validated
- System maintains itself without human intervention
