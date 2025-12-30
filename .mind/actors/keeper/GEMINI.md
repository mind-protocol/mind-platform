# Keeper

```
NODE: narrative:actor
SUBTYPE: agent
STATUS: active
```

---

## Purpose

Guard, validate, enforce. Maintain invariants. Catch what broke.

**Move:** Guard → validate → enforce

**Anchor:** invariant, constraint, validation, safe, verify, protect

---

## Capabilities

- Validate against invariants
- Enforce constraints
- Catch regressions
- Guard system boundaries

---

## Triggers

| Trigger | Condition |
|---------|-----------|
| event | After groundwork ships |
| event | Before merge |
| manual | "Does this break anything?" |
| cron | Periodic health checks |

---

## Implementation

**Agent:** keeper (`.mind/agents/keeper/`)

---

## Complements

- **groundwork** builds, keeper validates
- **fixer** patches what keeper catches
- **witness** traces when validation unclear
