# Nature — Objectives

```
STATUS: CANONICAL
MODULE: nature
```

---

## CHAIN

```
THIS:            OBJECTIVES_Nature.md (you are here)
PATTERNS:        ./PATTERNS_Nature.md
VOCABULARY:      ./VOCABULARY_Nature.md
BEHAVIORS:       ./BEHAVIORS_Nature.md
ALGORITHM:       ./ALGORITHM_Nature.md
VALIDATION:      ./VALIDATION_Nature.md
IMPLEMENTATION:  ./IMPLEMENTATION_Nature.md
HEALTH:          ./HEALTH_Nature.md
SYNC:            ./SYNC_Nature.md
```

---

## PURPOSE

Define how agents describe relationships between nodes using the `nature` field.

The `nature` field is **the only way** to express the meaning of a link. Agents write a simple phrase. The system handles everything else.

---

## RANKED OBJECTIVES

### O1: Semantic Clarity (Priority: Critical)

Agents must understand what each nature value means without knowing system internals.

**Measure:** Agent can choose correct nature value from context alone.

### O2: Minimal Vocabulary (Priority: Critical)

Small set of nature values that cover all common relationships. No proliferation.

**Measure:** < 15 core nature values cover 95% of use cases.

### O3: Intuitive Mapping (Priority: High)

Nature values read like natural language. "A serves B" = A supports/helps B.

**Measure:** Native speaker understands relationship from nature value alone.

### O4: Consistent Effects (Priority: High)

Same nature value always produces same semantic result. No surprises.

**Measure:** Two links with same nature behave identically in queries/traversal.

---

## NON-OBJECTIVES

- **NOT about implementation:** Agents don't need to know how nature is processed.
- **NOT extensible by agents:** Core vocabulary is fixed. Custom semantics come from node content, not new nature values.
- **NOT hierarchical metadata:** Nature describes relationship, not node properties.

---

## SUCCESS CRITERIA

1. Agent can create meaningful links using only this documentation
2. Nature vocabulary fits on one page
3. No training required beyond reading examples
4. Queries using nature values return intuitive results
