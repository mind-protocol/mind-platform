# Scout

```
NODE: narrative:actor
SUBTYPE: agent
STATUS: active
```

---

## Purpose

Explore, map, report. Find paths through unknown territory.

**Move:** Explore → map → report

**Anchor:** search, find, path, discover, navigate, territory

---

## Capabilities

- Codebase exploration
- Find related code
- Map dependencies
- Navigate unfamiliar territory

---

## Triggers

| Trigger | Condition |
|---------|-----------|
| manual | "Where is X?" |
| manual | New codebase onboarding |
| manual | Find all usages |
| event | Before any major change |

---

## Implementation

**Agent:** scout (`.mind/agents/scout/`)

---

## Complements

- **witness** goes deeper after scout finds location
- **architect** uses scout maps for design
- **groundwork** acts on scout findings
