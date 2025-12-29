# Grammar — Behaviors

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
THIS:            BEHAVIORS_Grammar.md (you are here)
ALGORITHM:       ./ALGORITHM_Grammar.md
```

---

## PURPOSE

Observable behaviors of the grammar system. What happens when.

---

## B1: Init Behavior

**When:** `mind init` runs

**What happens:**
1. Actor templates loaded from `.mind/actors/ACTOR_*.md`
2. Actor instances created in graph (one per template)
3. Task templates loaded from `.mind/tasks/TASK_*.md`
4. HEALTH indicators evaluated (initial scan)
5. task_runs created for any detected problems

**Observable:**
- Graph contains actor nodes with status=ready
- Graph contains task nodes (templates)
- Graph may contain task_run nodes (pending problems)

---

## B2: Detection Behavior

**When:** Trigger fires (init, file_watch, cron, manual)

**What happens:**
1. HEALTH indicator condition evaluated
2. If problem detected:
   - Lookup problem in VOCABULARY
   - Get `resolves_with` task
   - Check if task_run already exists for same target
   - If no existing: create task_run (status=pending)
3. If no problem: do nothing

**Observable:**
- New task_run nodes appear when problems detected
- No duplicate task_runs for same problem+target

---

## B3: Claim Behavior

**When:** Actor queries for work

**What happens:**
1. Actor queries: `task_run WHERE status=pending AND task.executor matches actor.type`
2. Actor selects task_run (oldest first, or by priority)
3. Actor creates link: `[CLAIMED_BY]` task_run → actor
4. Actor sets: `task_run.status = running`
5. Actor sets: `actor.status = running`

**Observable:**
- task_run.status changes pending→running
- task_run has CLAIMED_BY link to actor
- actor.status = running

---

## B4: Execution Behavior

**When:** Actor has claimed task_run

**What happens:**
1. Actor loads task template from task_run.[OF]
2. Actor loads skill from task.[USES]
3. Actor starts procedure from task.[EXECUTES]
4. Procedure run created (space:run, status=active)
5. Procedure steps execute
6. On each step: run.current_step updated

**Observable:**
- space:run node exists, linked to procedure
- run.current_step progresses
- Actor performs actions defined in procedure

---

## B5: Completion Behavior

**When:** Procedure completes successfully

**What happens:**
1. run.status = completed
2. task_run.status = completed
3. Link created: task_run -[RESOLVED]→ target
4. actor.status = ready
5. Actor releases claim (CLAIMED_BY link remains for history)

**Observable:**
- task_run.status = completed
- RESOLVED link exists
- actor.status = ready
- Re-running detection should NOT find the problem

---

## B6: Failure Behavior

**When:** Procedure fails or times out

**What happens:**
1. run.status = aborted (if procedure) or remains active
2. task_run.status = failed
3. task_run.error = failure reason
4. actor.status = ready
5. No RESOLVED link created

**Observable:**
- task_run.status = failed
- task_run.error contains reason
- Problem still detectable (may create new task_run)

---

## B7: Retry Behavior

**When:** Problem persists after failed task_run

**What happens:**
1. Next detection cycle runs
2. Problem still detected
3. Existing task_run is failed (terminal)
4. New task_run created (status=pending)
5. New task_run linked to same target

**Observable:**
- Multiple task_runs may exist for same problem+target
- Only one is pending/running at a time
- Failed ones remain in graph (history)

---

## B8: Manual Trigger Behavior

**When:** User requests `health_check` or similar

**What happens:**
1. All HEALTH indicators evaluated
2. task_runs created for detected problems
3. Results returned to user

**Observable:**
- Same as detection behavior
- User sees summary of problems found

---

## B9: Agent Spawn Behavior

**When:** `agent_spawn` called with task_run or problem

**What happens:**
1. If task_run provided: actor claims that task_run
2. If problem provided: find/create task_run, then claim
3. Actor executes (B4)
4. Returns result to caller

**Observable:**
- task_run claimed and executed
- Result contains completion status

---

## TIMING EXPECTATIONS

| Behavior | Expected Duration |
|----------|-------------------|
| Detection (per indicator) | < 100ms |
| Claim | < 50ms |
| Execution | Varies by task (seconds to minutes) |
| Completion/Failure | < 50ms |
