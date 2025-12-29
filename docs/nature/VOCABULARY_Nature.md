# Nature — Vocabulary

```
STATUS: CANONICAL
MODULE: nature
```

---

## CHAIN

```
OBJECTIVES:      ./OBJECTIVES_Nature.md
PATTERNS:        ./PATTERNS_Nature.md
THIS:            VOCABULARY_Nature.md (you are here)
BEHAVIORS:       ./BEHAVIORS_Nature.md
ALGORITHM:       ./ALGORITHM_Nature.md
```

---

## PURPOSE

Define the entities that participate in the nature.

---

## NODE TYPES

### task

**Template node:** `narrative` with `type: task`

Defines a type of work that can be done.

```yaml
node_type: narrative
type: task
id: task_{snake_case_name}

content: |
  Definition, inputs, outputs, skill, procedure
synthesis: "Task: {name} - {one line description}"
```

**Links from task:**
- `[USES]` → skill (narrative:skill)
- `[EXECUTES]` → procedure (space:procedure)

### task_run

**Instance node:** `narrative` with `type: task_run`

A specific execution of a task.

```yaml
node_type: narrative
type: task_run
id: task_run_{uuid}
status: pending | running | completed | failed

content: |
  Execution context, error if failed
synthesis: "Task run: {task_name} on {target} - {status}"
```

**Links from task_run:**
- `[OF]` → task template (narrative:task)
- `[TARGET]` → affected node (thing, narrative, etc.)
- `[CLAIMED_BY]` → actor executing

### actor

**Instance node:** `actor` with `type: {actor_name}`

An entity that executes tasks. Created at init from actor templates.

```yaml
node_type: actor
type: witness | groundwork | monitor | embedder | ...
id: actor_{name}
status: ready | running

content: |
  Current state, last activity
synthesis: "Actor: {name} ({type}) - {status}"
```

**Links from actor:**
- `[OF]` → actor template (narrative:actor)
- `[CLAIMS]` → task_run being executed

### actor template

**Template node:** `narrative` with `type: actor`

Defines an actor's capabilities and triggers.

```yaml
node_type: narrative
type: actor
id: actor_template_{name}

content: |
  Purpose, capabilities, triggers
synthesis: "Actor template: {name} - {purpose}"
```

### skill

**Template node:** `narrative` with `type: skill`

Cognitive pattern for agents. No instances—skills are referenced, not instantiated.

```yaml
node_type: narrative
type: skill
id: skill_{snake_case_name}

content: |
  Gates, process, outputs
synthesis: "Skill: {name} - {purpose}"
```

### procedure

**Template node:** `space` with `type: procedure`

Structured steps. Creates run instances during execution.

```yaml
node_type: space
type: procedure
id: procedure_{name}

content: |
  Steps, branching logic
synthesis: "Procedure: {name} - {purpose}"
```

### run

**Instance node:** `space` with `type: run`

Execution state of a procedure.

```yaml
node_type: space
type: run
id: run_{uuid}
status: active | completed | aborted
current_step: {step_id}

content: |
  Execution context, answers collected
synthesis: "Run: {procedure_name} - step {current_step}"
```

---

## PROBLEMS

Problems are defined in module VOCABULARY docs, not here. This doc defines the **structure** of a problem definition.

### Problem Definition Structure

```yaml
id: PROBLEM_{UPPER_SNAKE_CASE}
definition: |
  Clear description of the abnormal situation.
  What makes this a problem. Why it matters.

severity: critical | warning | info
  # critical = blocks work, must fix immediately
  # warning = degraded state, should fix soon
  # info = notable condition, fix when convenient

resolves_with: TASK_{task_name}
  # Task template that fixes this problem

detection_hint: |
  Brief hint for HEALTH on how to detect this.
  Full detection logic goes in HEALTH.md
```

---

## STATUS VALUES

### task_run.status

| Status | Meaning | Transitions to |
|--------|---------|----------------|
| `pending` | Created, waiting for actor | `running` |
| `running` | Actor claimed and executing | `completed`, `failed` |
| `completed` | Successfully resolved | — (terminal) |
| `failed` | Execution failed | — (terminal) |

### actor.status

| Status | Meaning | Transitions to |
|--------|---------|----------------|
| `ready` | Available to claim tasks | `running` |
| `running` | Executing a task | `ready` |

### run.status (procedure)

| Status | Meaning | Transitions to |
|--------|---------|----------------|
| `active` | Executing steps | `completed`, `aborted` |
| `completed` | All steps done | — (terminal) |
| `aborted` | Cancelled | — (terminal) |

---

## LINK TYPES

All links use the universal `link` type with semantic properties.

| Semantic | From | To | Meaning |
|----------|------|-----|---------|
| `OF` | instance | template | "is instance of" |
| `TARGET` | task_run | any node | "operates on" |
| `CLAIMED_BY` | task_run | actor | "being executed by" |
| `USES` | task | skill | "requires skill" |
| `EXECUTES` | task | procedure | "runs procedure" |
| `RESOLVED` | task_run | target | "fixed this" |
