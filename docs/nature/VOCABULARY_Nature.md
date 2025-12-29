# Nature — Vocabulary: The Stimulus Field

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

Define the `nature` field - the unified way to describe stimulus between entities.

**Same vocabulary applies to links AND nodes.**

---

## WHAT IS NATURE

Nature describes **what kind of stimulus** flows between entities.

- On a **link**: nature describes the relationship from A to B
- On a **node**: nature describes the node's inherent character

```yaml
# Link nature
link:
  from: task_run_123
  to: task_template_456
  nature: serves

# Node nature (in content/metadata)
node:
  type: task_run
  nature: execution  # inherent character
```

---

## CORE NATURE VALUES

### Relationship Natures (for links)

| Nature | Meaning | From → To |
|--------|---------|-----------|
| `serves` | supports, helps, works for | instance → template |
| `concerns` | is about, affects | action → target |
| `blocks` | prevents, hinders | blocker → blocked |
| `includes` | contains, encompasses | container → contained |
| `is about` | describes, explains | doc → subject |
| `imports` | depends on, requires | dependent → dependency |
| `uses` | employs, applies | user → tool |
| `executes` | runs, performs | runner → runnable |
| `claims` | takes ownership of | owner → owned |
| `resolves` | fixes, solves | fixer → fixed |

### Character Natures (for nodes)

| Nature | Meaning | Applies To |
|--------|---------|------------|
| `template` | defines pattern | task, actor, procedure |
| `instance` | specific execution | task_run, actor, run |
| `reference` | pointer, not copied | skill, config |
| `event` | point in time | moment |
| `state` | persistent condition | status nodes |

---

## USAGE EXAMPLES

### Creating a task_run

```yaml
# The task_run node
node:
  node_type: narrative
  type: task_run
  nature: instance  # it's an instance, not a template

# Link to template
link:
  from: task_run_123
  to: task_create_doc
  nature: serves  # instance serves template

# Link to target
link:
  from: task_run_123
  to: missing_doc_node
  nature: concerns  # task concerns the target
```

### Actor claiming work

```yaml
link:
  from: actor_groundwork
  to: task_run_123
  nature: claims  # actor claims the task_run
```

### Problem resolution

```yaml
link:
  from: task_run_123
  to: problem_node
  nature: resolves  # task_run resolves the problem
```

---

## CHOOSING NATURE

| Scenario | Use Nature |
|----------|------------|
| Instance to template | `serves` |
| Task operates on X | `concerns` |
| X blocks Y | `blocks` |
| Parent contains child | `includes` |
| Doc describes code | `is about` |
| Module needs library | `imports` |
| Task needs skill | `uses` |
| Task runs procedure | `executes` |
| Actor takes task | `claims` |
| Task fixes problem | `resolves` |

---

## ANTI-PATTERNS

### Creating new nature values

```yaml
# WRONG - inventing nature
nature: "my_custom_relationship"

# RIGHT - use existing vocabulary
nature: "serves"  # or concerns, blocks, etc.
```

Custom semantics go in node content, not in nature field.

### Using nature for metadata

```yaml
# WRONG - nature is not metadata
nature: "high_priority"
nature: "created_2024"

# RIGHT - nature describes stimulus type
nature: "serves"
# Put metadata in node properties
priority: high
created_at: 2024-01-01
```

---

## MARKERS

<!-- @mind:todo Consider: triggers, creates, replaces -->
