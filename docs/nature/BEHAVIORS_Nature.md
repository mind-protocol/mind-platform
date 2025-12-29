# Nature — Behaviors: Observable Effects

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
THIS:            BEHAVIORS_Nature.md (you are here)
ALGORITHM:       ./ALGORITHM_Nature.md
```

---

## PURPOSE

Observable effects when using nature values. What happens when you apply each nature.

---

## B1: Link with `serves`

**When:** Creating instance → template relationship

```
GIVEN:  task_run node exists
WHEN:   link created with nature: serves to task template
THEN:   task_run is recognized as instance of that task
AND:    queries for task instances return this task_run
```

**Effect:** System knows task_run implements the task template.

---

## B2: Link with `concerns`

**When:** Connecting action to target

```
GIVEN:  task_run exists
WHEN:   link created with nature: concerns to target node
THEN:   task_run is associated with that target
AND:    target shows this task_run in its related actions
```

**Effect:** System tracks what the action operates on.

---

## B3: Link with `claims`

**When:** Actor takes ownership of work

```
GIVEN:  actor and task_run exist
WHEN:   link created with nature: claims from actor to task_run
THEN:   task_run is marked as owned by actor
AND:    other actors see task_run as unavailable
```

**Effect:** Work assignment is recorded.

---

## B4: Link with `resolves`

**When:** Task completes successfully

```
GIVEN:  task_run completed work
WHEN:   link created with nature: resolves to problem/target
THEN:   problem is marked as addressed
AND:    detection should no longer find the problem
```

**Effect:** Resolution is recorded for verification.

---

## B5: Link with `blocks`

**When:** Recording a dependency or blocker

```
GIVEN:  two nodes where one prevents progress on other
WHEN:   link created with nature: blocks
THEN:   blocked node shows as waiting
AND:    queries for blockers return the blocking node
```

**Effect:** Dependencies are visible.

---

## B6: Link with `includes`

**When:** Creating containment relationship

```
GIVEN:  container and contained nodes exist
WHEN:   link created with nature: includes
THEN:   contained node shows as part of container
AND:    container queries include the contained
```

**Effect:** Hierarchy/grouping is established.

---

## B7: Link with `uses`

**When:** Recording tool/skill usage

```
GIVEN:  task and skill nodes exist
WHEN:   link created with nature: uses
THEN:   task is associated with that skill
AND:    skill usage can be tracked
```

**Effect:** Capabilities are linked to their consumers.

---

## B8: Link with `executes`

**When:** Recording what runs what

```
GIVEN:  task and procedure nodes exist
WHEN:   link created with nature: executes
THEN:   task is linked to its implementation
AND:    procedure can be loaded when task runs
```

**Effect:** Execution path is defined.

---

## B9: Link with `imports`

**When:** Recording dependencies

```
GIVEN:  module depends on library
WHEN:   link created with nature: imports
THEN:   dependency relationship is recorded
AND:    dependency analysis can traverse these links
```

**Effect:** Dependency graph is queryable.

---

## B10: Link with `is about`

**When:** Documentation references subject

```
GIVEN:  doc and subject nodes exist
WHEN:   link created with nature: is about
THEN:   doc is associated with subject
AND:    subject shows related documentation
```

**Effect:** Documentation is linked to what it describes.

---

## QUERY BEHAVIORS

| Query Goal | Filter By Nature |
|------------|------------------|
| Find all instances of template | `serves` pointing to template |
| Find what task operates on | `concerns` from task |
| Find who owns work | `claims` pointing to work |
| Find blockers | `blocks` pointing to blocked |
| Find children | `includes` from parent |
| Find dependencies | `imports` from dependent |

---

## MARKERS

<!-- @mind:todo Document compound nature queries -->
