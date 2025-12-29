# Capabilities — Patterns

```
STATUS: CANONICAL
MODULE: capabilities
```

---

## CHAIN

```
OBJECTIVES:      ./OBJECTIVES_Capabilities.md
THIS:            PATTERNS_Capabilities.md (you are here)
VOCABULARY:      ./VOCABULARY_Capabilities.md
BEHAVIORS:       ./BEHAVIORS_Capabilities.md
ALGORITHM:       ./ALGORITHM_Capabilities.md
```

---

## THE PROBLEM

Mind Protocol gives AI persistence, memory, identity. The graph is the externalized brain.

But a brain isn't enough. You need **capabilities** — systems that know how to do specific things, detect when to act, and execute.

Without capabilities:
- Agents don't know what they can do
- Problems go undetected
- Work requires human initiation
- System can't maintain itself

---

## THE PATTERN

**A capability = a functional organ of the system.**

Each capability is a complete doc chain that includes:
- WHY it exists (OBJECTIVES)
- HOW it works (PATTERNS, ALGORITHM)
- WHAT to watch for (VOCABULARY — problems)
- WHEN to activate (HEALTH — triggers, docks)
- WITH WHAT to execute (tasks, skills, procedures)

---

## ORGAN METAPHORS

| Capability | Organ | Function |
|------------|-------|----------|
| `create-doc-chain` | Memory | Crystallizes knowledge |
| `ingest-docs` | Digestion | Absorbs external information |
| `embed-nodes` | Comprehension | Semantic understanding |
| `monitor-health` | Immune system | Detects dysfunction |
| `sync-state` | Homeostasis | Maintains coherence |

---

## PRINCIPLES

### Principle 1: Self-Contained

A capability folder contains everything needed to understand and operate it. No external lookups required.

### Principle 2: Detection-Driven

Capabilities don't wait to be called. They detect conditions and activate. HEALTH defines what triggers them.

### Principle 3: Problem-Centric

Each capability exists to resolve a class of problems. VOCABULARY defines these problems. HEALTH detects them.

### Principle 4: Validated Completion

Work isn't done until validated. VALIDATION defines success. Health checks confirm resolution.

---

## ARCHITECTURE

```
┌─────────────────────────────────────────────────────────┐
│  PROJECT (.mind/docs/capabilities/)                     │
│      └── scrape-leads/        ← custom capability       │
│      └── enrich-contacts/     ← custom capability       │
├─────────────────────────────────────────────────────────┤
│  PLATFORM (templates/docs/capabilities/)                │
│      └── create-doc-chain/    ← standard capability     │
│      └── ingest-docs/         ← standard capability     │
│      └── embed-nodes/         ← standard capability     │
└─────────────────────────────────────────────────────────┘
```

**Platform** provides base capabilities — system maintenance.
**Projects** add custom capabilities — domain-specific.

---

## SCOPE

### In Scope

- Defining what a capability is
- How capabilities are structured
- How capabilities activate and execute
- How capabilities compose

### Out of Scope

- Specific capability implementations (each has its own chain)
- Task system details (separate module)
- Skill system details (separate module)
