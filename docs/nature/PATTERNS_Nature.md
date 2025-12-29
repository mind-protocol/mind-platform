# Nature — Patterns: Semantic Link Vocabulary

```
STATUS: CANONICAL
MODULE: nature
```

---

## CHAIN

```
OBJECTIVES:      ./OBJECTIVES_Nature.md
THIS:            PATTERNS_Nature.md (you are here)
VOCABULARY:      ./VOCABULARY_Nature.md
BEHAVIORS:       ./BEHAVIORS_Nature.md
ALGORITHM:       ./ALGORITHM_Nature.md
VALIDATION:      ./VALIDATION_Nature.md
IMPLEMENTATION:  ./IMPLEMENTATION_Nature.md
HEALTH:          ./HEALTH_Nature.md
SYNC:            ./SYNC_Nature.md
```

---

## THE PROBLEM

Agents need to create meaningful relationships between nodes. Without a shared vocabulary:
- Links have no semantic meaning
- Queries can't filter by relationship type
- Graph structure loses expressiveness

---

## THE PATTERN

A **small, fixed vocabulary** of nature values that cover all common relationships.

Agents write: `nature: "serves"`
The system handles everything else.

---

## PRINCIPLES

### Principle 1: Natural Language

Nature values read like English verbs or phrases. "A serves B" means A supports/helps B.

No codes. No abbreviations. No implementation details.

### Principle 2: Directional

Nature describes the relationship **from A to B**. The direction matters.

- `A -[serves]-> B` = A supports B
- `B -[serves]-> A` = B supports A (different meaning)

### Principle 3: Fixed Vocabulary

Agents cannot invent new nature values. Custom semantics go in node content, not in nature field.

This ensures consistency and queryability.

### Principle 4: One Nature Per Link

Each link has exactly one nature. If a relationship has multiple aspects, create multiple links.

---

## CORE NATURE VALUES

| Nature | Meaning | Example |
|--------|---------|---------|
| `serves` | A supports/helps B | task_run serves task template |
| `concerns` | A is about B | task_run concerns target node |
| `blocks` | A prevents B | blocker blocks feature |
| `includes` | A contains B | space includes subspace |
| `is about` | A describes B | doc is about code |
| `imports` | A depends on B | module imports library |
| `uses` | A employs B | task uses skill |
| `executes` | A runs B | task executes procedure |
| `claims` | A takes ownership of B | actor claims task_run |
| `resolves` | A fixes B | task_run resolves problem |

---

## SCOPE

### In Scope

- Defining the nature vocabulary
- Semantic meaning of each value
- Usage guidelines

### Out of Scope

- How nature is processed internally (transparent)
- Performance characteristics
- Storage format

---

## MARKERS

<!-- @mind:todo Add more nature values as patterns emerge -->
