# Grammar — Validation

```
STATUS: CANONICAL
MODULE: templates/grammar
```

---

## CHAIN

```
OBJECTIVES:      ./OBJECTIVES_Grammar.md
PATTERNS:        ./PATTERNS_Grammar.md
VOCABULARY:      ./VOCABULARY_Grammar.md
BEHAVIORS:       ./BEHAVIORS_Grammar.md
ALGORITHM:       ./ALGORITHM_Grammar.md
THIS:            VALIDATION_Grammar.md (you are here)
IMPLEMENTATION:  ./IMPLEMENTATION_Grammar.md
```

---

## PURPOSE

Invariants that must hold. If violated, the grammar implementation is broken.

---

## INVARIANTS

### I1: Single Active Task Per Target-Problem

```
INVARIANT: For any (problem_id, target) pair, at most ONE task_run
           can have status IN ['pending', 'running']

VIOLATION: Multiple active task_runs for same problem+target

CHECK:
  MATCH (tr1:narrative {type: 'task_run', status: 'pending'})
        -[:TARGET]-> (t) <-[:TARGET]-
        (tr2:narrative {type: 'task_run', status: 'pending'})
  WHERE tr1 <> tr2
  AND tr1.problem_id = tr2.problem_id
  RETURN count(*) = 0
```

### I2: Claimed Task Has Actor

```
INVARIANT: If task_run.status = 'running', then CLAIMED_BY link exists

VIOLATION: Running task_run without actor claim

CHECK:
  MATCH (tr:narrative {type: 'task_run', status: 'running'})
  WHERE NOT (tr)-[:CLAIMED_BY]->(:actor)
  RETURN count(*) = 0
```

### I3: Running Actor Has Task

```
INVARIANT: If actor.status = 'running', then actor has claimed a task_run

VIOLATION: Running actor without claimed task

CHECK:
  MATCH (a:actor {status: 'running'})
  WHERE NOT (:narrative {type: 'task_run', status: 'running'})-[:CLAIMED_BY]->(a)
  RETURN count(*) = 0
```

### I4: Completed Task Has Resolution

```
INVARIANT: If task_run.status = 'completed', then RESOLVED link exists

VIOLATION: Completed task without resolution link

CHECK:
  MATCH (tr:narrative {type: 'task_run', status: 'completed'})
  WHERE NOT (tr)-[:RESOLVED]->()
  RETURN count(*) = 0
```

### I5: Task Run Has Template

```
INVARIANT: Every task_run has [OF] link to task template

VIOLATION: Orphan task_run

CHECK:
  MATCH (tr:narrative {type: 'task_run'})
  WHERE NOT (tr)-[:OF]->(:narrative {type: 'task'})
  RETURN count(*) = 0
```

### I6: Task Run Has Target

```
INVARIANT: Every task_run has [TARGET] link

VIOLATION: Task_run without target

CHECK:
  MATCH (tr:narrative {type: 'task_run'})
  WHERE NOT (tr)-[:TARGET]->()
  RETURN count(*) = 0
```

### I7: Actor Has Template

```
INVARIANT: Every actor has [OF] link to actor template

VIOLATION: Orphan actor

CHECK:
  MATCH (a:actor)
  WHERE NOT (a)-[:OF]->(:narrative {type: 'actor'})
  RETURN count(*) = 0
```

### I8: Terminal States Are Final

```
INVARIANT: task_run in ['completed', 'failed'] never changes status

VIOLATION: Status change after terminal state

CHECK: (Requires temporal tracking - verify via audit log)
```

### I9: Pending Precedes Running

```
INVARIANT: task_run must pass through 'pending' before 'running'

VIOLATION: Direct creation in running state

CHECK: created_at < claimed_at for all running task_runs
```

### I10: No Circular Claims

```
INVARIANT: An actor cannot claim a task_run that targets itself

VIOLATION: Self-referential task

CHECK:
  MATCH (tr:narrative {type: 'task_run'})-[:TARGET]->(a:actor)
        <-[:CLAIMED_BY]-(tr)
  RETURN count(*) = 0
```

---

## BEHAVIORAL INVARIANTS

### B1: Detection Idempotence

```
INVARIANT: Running detection twice with same state produces same result
           (no duplicate task_runs)

TEST: Run detection, run again immediately, verify no new task_runs
```

### B2: Claim Atomicity

```
INVARIANT: Claiming is atomic - no partial claims

TEST: Concurrent claim attempts result in exactly one success
```

### B3: Resolution Verification

```
INVARIANT: After task_run completed, re-running detection for same
           problem+target should not detect problem

TEST: Complete task, run detection, verify no new task_run
```

---

## VALIDATION SCHEDULE

| Invariant | Check Frequency |
|-----------|-----------------|
| I1-I7 | Every health_check |
| I8-I10 | On state transitions |
| B1-B3 | Integration tests |
