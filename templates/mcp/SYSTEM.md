# {{PROJECT_NAME}}

@.mind/PRINCIPLES.md

---

@.mind/FRAMEWORK.md

---

## Before Any Task

Check project state:
```
.mind/state/SYNC_Project_State.md
```

Understand what's happening, what changed recently, any handoffs for you.

## After Any Change

Update `.mind/state/SYNC_Project_State.md` with what you did.

---

## Architecture

This project operates within the Mind Protocol 4-layer architecture:

| Layer | Role | This Project |
|-------|------|--------------|
| L1 | Citizen | Personal graph, memory |
| L2 | Organization | Team coordination |
| L3 | Ecosystem | Shared templates |
| L4 | Protocol | Schema, registry, laws |

Templates come from `mind-platform/templates/` via `mind init`.

---

## Key Files

| File | Purpose |
|------|---------|
| `.mind/FRAMEWORK.md` | Navigation, structure, what to load |
| `.mind/PRINCIPLES.md` | How to work, stance to hold |
| `.mind/state/SYNC_Project_State.md` | Current state, handoffs |
| `.mind/agents/` | Cognitive subtypes |
| `.mind/skills/` | Executable capabilities |
| `.mind/procedures/` | Structured dialogues |

---

## MCP Tools

Use the Mind MCP server for:
- `graph_query` — Semantic search across the project graph
- `procedure_start` / `procedure_continue` — Structured dialogues
- `doctor_check` — Health checks
- `task_list` / `agent_run` — Task management
