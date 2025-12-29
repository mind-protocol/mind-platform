# Nature — Algorithm: Choosing the Right Nature

```
STATUS: CANONICAL
MODULE: nature
```

---

## CHAIN

```
OBJECTIVES:      ./OBJECTIVES_Nature.md
PATTERNS:        ./PATTERNS_Nature.md
VOCABULARY:      ./VOCABULARY_Nature.md
BEHAVIORS:       ./BEHAVIORS_Nature.md
THIS:            ALGORITHM_Nature.md (you are here)
VALIDATION:      ./VALIDATION_Nature.md
IMPLEMENTATION:  ./IMPLEMENTATION_Nature.md
```

---

## PURPOSE

How to choose the correct nature value for a link or node.

---

## DECISION TREE

```
What relationship are you describing?
│
├── Instance to template?
│   └── serves
│
├── Action to target?
│   └── concerns
│
├── Owner to owned?
│   └── claims
│
├── Fixer to fixed?
│   └── resolves
│
├── Blocker to blocked?
│   └── blocks
│
├── Container to contained?
│   └── includes
│
├── Doc to subject?
│   └── is about
│
├── Dependent to dependency?
│   └── imports
│
├── User to tool?
│   └── uses
│
└── Runner to runnable?
    └── executes
```

---

## STEP BY STEP

### Step 1: Identify the Relationship Type

Ask: "What is the FROM node doing to/with the TO node?"

| If FROM is... | And TO is... | Then nature is... |
|---------------|--------------|-------------------|
| an instance | its template | `serves` |
| a task/action | what it operates on | `concerns` |
| an owner | what it owns | `claims` |
| a resolver | what it resolved | `resolves` |
| a blocker | what it blocks | `blocks` |
| a container | what it contains | `includes` |
| documentation | what it describes | `is about` |
| a dependent | what it needs | `imports` |
| a user | what it uses | `uses` |
| a runner | what it runs | `executes` |

### Step 2: Verify Direction

Nature describes **FROM → TO**. Check that direction makes sense:

- `task_run -[serves]-> task` ✓ (instance serves template)
- `task -[serves]-> task_run` ✗ (backwards)

### Step 3: One Nature Per Link

If relationship has multiple aspects, create multiple links:

```yaml
# Task both uses a skill AND executes a procedure
links:
  - from: task_123
    to: skill_debug
    nature: uses
  - from: task_123
    to: procedure_investigate
    nature: executes
```

---

## COMMON PATTERNS

### Template/Instance Pattern

```yaml
# Always: instance -[serves]-> template
task_run -[serves]-> task
actor -[serves]-> actor_template
procedure_run -[serves]-> procedure
```

### Work Assignment Pattern

```yaml
# Actor claims work
actor -[claims]-> task_run

# Task concerns target
task_run -[concerns]-> target_node

# Task resolves problem
task_run -[resolves]-> problem
```

### Documentation Pattern

```yaml
# Doc describes code
PATTERNS.md -[is about]-> module

# Code imports dependency
module -[imports]-> library
```

### Hierarchy Pattern

```yaml
# Parent includes child
space -[includes]-> subspace
category -[includes]-> item
```

---

## WHEN UNSURE

1. **Read the nature aloud**: "A serves B" - does that sound right?
2. **Check VOCABULARY_Nature.md** for exact definitions
3. **Look at existing links** in the graph for similar patterns
4. **Default to `concerns`** if truly ambiguous - it's the most general

---

## MARKERS

<!-- @mind:todo Add examples from real graph data -->
