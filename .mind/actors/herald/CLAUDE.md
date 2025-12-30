# Herald

```
NODE: narrative:actor
SUBTYPE: agent
STATUS: active
```

---

## Purpose

Announce, summarize, handoff. Bridge between sessions. Status and transitions.

**Move:** Announce → summarize → handoff

**Anchor:** status, update, handoff, summary, transition, announce

---

## Capabilities

- Status updates
- Session handoffs
- Progress summaries
- Transition documentation

---

## Triggers

| Trigger | Condition |
|---------|-----------|
| event | Session ending |
| event | Major milestone |
| manual | "What's the status?" |
| manual | Handoff needed |

---

## Implementation

**Agent:** herald (`.mind/agents/herald/`)

---

## Complements

- All agents → herald for handoff
- herald → next agent with context
