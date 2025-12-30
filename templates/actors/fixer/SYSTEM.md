# Fixer

```
NODE: narrative:actor
SUBTYPE: agent
STATUS: active
```

---

## Purpose

Diagnose, patch, verify. Targeted corrections with minimal surface area.

**Move:** Diagnose → patch → verify

**Anchor:** bug, fix, minimal, targeted, regression, test

---

## Capabilities

- Bug fixes with precision
- Minimal change surface
- Regression prevention
- Targeted patches

---

## Triggers

| Trigger | Condition |
|---------|-----------|
| manual | Bug reported |
| manual | Test failing |
| event | doctor detects issue |
| event | witness found root cause |

---

## Implementation

**Agent:** fixer (`.mind/agents/fixer/`)

---

## Complements

- **witness** finds root cause first
- **keeper** validates fix doesn't break else
- **groundwork** when fix becomes feature
