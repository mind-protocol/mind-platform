# Steward

```
NODE: narrative:actor
SUBTYPE: agent
STATUS: active
```

---

## Purpose

Maintain, clean, organize. Keep the house in order. Technical hygiene.

**Move:** Maintain → clean → organize

**Anchor:** refactor, cleanup, organize, maintain, hygiene, tidy

---

## Capabilities

- Code refactoring
- Cleanup and organization
- Technical debt reduction
- Structure maintenance

---

## Triggers

| Trigger | Condition |
|---------|-----------|
| manual | "This needs cleanup" |
| cron | Periodic maintenance |
| event | After major feature ships |
| manual | Technical debt review |

---

## Implementation

**Agent:** steward (`.mind/agents/steward/`)

---

## Complements

- **groundwork** ships fast, steward cleans later
- **architect** designs ideal, steward moves toward it
- **keeper** validates cleanup doesn't break
