# Nature — Validation: What Makes Valid Nature Usage

```
STATUS: CANONICAL
MODULE: nature
```

---

## CHAIN

```
OBJECTIVES:      ./OBJECTIVES_Nature.md
PATTERNS:        ./PATTERNS_Nature.md
VOCABULARY:      ./VOCABULARY_Nature.md
BEHAVIORS:       ./BEHAVIORS_Nature.md
ALGORITHM:       ./ALGORITHM_Nature.md
THIS:            VALIDATION_Nature.md (you are here)
IMPLEMENTATION:  ./IMPLEMENTATION_Nature.md
```

---

## PURPOSE

Rules that define valid nature usage. If violated, the link/node is malformed.

---

## INVARIANTS

### V1: Known Nature Values Only

```
INVARIANT: nature must be one of the defined values

VALID:   serves, concerns, blocks, includes, is about,
         imports, uses, executes, claims, resolves

INVALID: "my_custom_nature", "related_to", "linked"
```

### V2: Nature is Required on Links

```
INVARIANT: every link must have a nature field

VALID:
  link:
    from: a
    to: b
    nature: serves

INVALID:
  link:
    from: a
    to: b
    # missing nature
```

### V3: Direction Consistency

```
INVARIANT: nature semantics match direction

VALID:   instance -[serves]-> template
INVALID: template -[serves]-> instance

VALID:   actor -[claims]-> task_run
INVALID: task_run -[claims]-> actor
```

### V4: One Nature Per Link

```
INVARIANT: each link has exactly one nature

VALID:
  - from: a, to: b, nature: serves
  - from: a, to: c, nature: uses

INVALID:
  - from: a, to: b, nature: [serves, concerns]
```

### V5: Appropriate Nature for Node Types

```
INVARIANT: nature makes semantic sense for node types

VALID:   task_run -[serves]-> task (instance to template)
INVALID: task_run -[includes]-> task (wrong semantic)

VALID:   actor -[claims]-> task_run (owner to work)
INVALID: task -[claims]-> actor (wrong direction)
```

---

## VALIDATION CHECKS

| Check | Pass Condition |
|-------|----------------|
| Known nature | nature ∈ vocabulary |
| Has nature | link.nature is not null |
| Direction valid | FROM/TO types match nature semantics |
| Single nature | typeof nature is string, not array |

---

## ERROR MESSAGES

| Violation | Message |
|-----------|---------|
| Unknown nature | `Invalid nature '{value}'. Use: serves, concerns, blocks, ...` |
| Missing nature | `Link requires nature field` |
| Wrong direction | `Nature '{nature}' expects {expected_from} -> {expected_to}` |
| Multiple natures | `Link can only have one nature` |

---

## MARKERS

<!-- @mind:todo Add validation for node character natures -->
