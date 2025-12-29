# Nature — Implementation: Where Nature Lives

```
STATUS: CANONICAL
MODULE: nature
```

---

## CHAIN

```
ALGORITHM:       ./ALGORITHM_Nature.md
VALIDATION:      ./VALIDATION_Nature.md
THIS:            IMPLEMENTATION_Nature.md (you are here)
HEALTH:          ./HEALTH_Nature.md
SYNC:            ./SYNC_Nature.md
```

---

## PURPOSE

Where to find nature definitions. Implementation details are transparent to agents.

---

## FILE STRUCTURE

```
docs/nature/                  # This doc chain
├── OBJECTIVES_Nature.md
├── PATTERNS_Nature.md
├── VOCABULARY_Nature.md      # Nature values defined here
├── BEHAVIORS_Nature.md
├── ALGORITHM_Nature.md
├── VALIDATION_Nature.md
├── IMPLEMENTATION_Nature.md
├── HEALTH_Nature.md
└── SYNC_Nature.md
```

---

## NATURE IN MCP CALLS

Agents use nature through MCP tools. The interface is simple:

```yaml
# Creating a link
tool: create_link
params:
  from: node_id_a
  to: node_id_b
  nature: serves  # <-- this is all you need
```

The system handles everything else. Agents don't need to know:
- How nature is stored
- How nature affects queries
- What processing happens internally

---

## TRANSPARENCY PRINCIPLE

**Nature is a semantic interface, not an implementation.**

Agents think: "This link serves that template."
System handles: storage, indexing, query optimization.

This separation means:
- Agents focus on meaning
- Implementation can change without breaking agents
- Nature vocabulary is stable while internals evolve

---

## MARKERS

<!-- @mind:todo None - implementation is intentionally minimal -->
