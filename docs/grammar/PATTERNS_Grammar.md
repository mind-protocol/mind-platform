# Grammar — Patterns

```
STATUS: CANONICAL
MODULE: templates/grammar
```

---

## CHAIN

```
OBJECTIVES:      ./OBJECTIVES_Grammar.md
THIS:            PATTERNS_Grammar.md (you are here)
VOCABULARY:      ./VOCABULARY_Grammar.md
BEHAVIORS:       ./BEHAVIORS_Grammar.md
ALGORITHM:       ./ALGORITHM_Grammar.md
```

---

## DESIGN PHILOSOPHY

### State Machine, Not Workflow

The grammar defines **state transitions**, not step-by-step workflows. Each entity (task_run, actor) has defined states and valid transitions between them.

```
task_run: pending → running → completed
                 → failed

actor: ready → running → ready
```

The grammar says what transitions are valid. Procedures say how to make them happen.

### Graph as Truth

All state is in the graph. The grammar operates on graph state:
- Read nodes/links to evaluate conditions
- Write nodes/links to record transitions
- Never hold state outside the graph

### Separation: What vs How vs When

| Layer | Defines | Example |
|-------|---------|---------|
| VOCABULARY | What exists | "PROBLEM_MISSING_DOC is a problem" |
| HEALTH | When to check | "Check on init and file_delete" |
| ALGORITHM | How to respond | "Create task_run linked to problem" |

This separation means:
- Add new problem → only touch VOCABULARY
- Change detection timing → only touch HEALTH
- Change response behavior → only touch ALGORITHM

### Template + Instance Pattern

Everything uses template/instance:

| Template | Instance | Created |
|----------|----------|---------|
| `narrative:task` | `narrative:task_run` | At detection |
| `narrative:actor` | `actor` | At init |
| `narrative:skill` | — | No instance |
| `space:procedure` | `space:run` | At execution |

Templates define the pattern. Instances are created when work happens.

---

## CORE PATTERNS

### P1: Problem Detection Pattern

```
TRIGGER fires
  → HEALTH indicator evaluates
    → condition met?
      → yes: create task_run from problem.resolves_with
      → no: do nothing
```

Detection is **passive observation**. It doesn't fix anything—it creates task_runs for actors to claim.

### P2: Task Claim Pattern

```
Actor queries for pending task_runs matching its capabilities
  → Claims task_run (sets claimed_by, status=running)
    → Loads skill from task template
      → Executes procedure
        → Updates task_run status
```

Actors **pull** work, work isn't pushed to them.

### P3: Resolution Pattern

```
Procedure completes successfully
  → task_run.status = completed
    → Link: task_run -[RESOLVED]→ target
      → Problem no longer detected on next check
```

Resolution is verified by **re-running detection**. If problem still detected, resolution failed.

### P4: Failure Pattern

```
Procedure fails OR timeout
  → task_run.status = failed
    → task_run.error = reason
      → Problem remains, new task_run may be created
```

Failed tasks don't retry automatically. Detection will create a new task_run if problem persists.

---

## ANTI-PATTERNS

### ❌ Inline Resolution

```
# WRONG: Detection directly fixes
if missing_doc:
    create_doc()  # NO! Detection shouldn't fix
```

Detection creates task_runs. Resolution is separate.

### ❌ Stateless Checks

```
# WRONG: Check result not persisted
issues = check_problems()
return issues  # NO! Must be in graph
```

All detected problems must create persistent task_runs.

### ❌ Actor Push

```
# WRONG: Assigning work to actors
actor.assign(task_run)  # NO! Actors pull
```

Actors query and claim. Nothing pushes work to them.

---

## SCOPE

**In scope:**
- Problem detection and task creation
- Task claiming and execution
- State transitions and persistence

**Out of scope:**
- Procedure step definitions (that's in procedures/*.yaml)
- Skill cognitive patterns (that's in skills/SKILL_*.md)
- Specific problem definitions (that's in VOCABULARY)
