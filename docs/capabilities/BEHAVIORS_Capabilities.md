# Capabilities — Behaviors

```
STATUS: CANONICAL
MODULE: capabilities
```

---

## CHAIN

```
OBJECTIVES:      ./OBJECTIVES_Capabilities.md
PATTERNS:        ./PATTERNS_Capabilities.md
VOCABULARY:      ./VOCABULARY_Capabilities.md
THIS:            BEHAVIORS_Capabilities.md (you are here)
ALGORITHM:       ./ALGORITHM_Capabilities.md
```

---

## PURPOSE

Observable behaviors of the capability system.

---

## B1: Capability Discovery

**When:** Agent needs to know what the system can do

```
GIVEN:  Agent arrives in system
WHEN:   Agent lists docs/capabilities/
THEN:   Each subfolder is a capability
AND:    Reading OBJECTIVES.md explains its purpose
```

**Effect:** Agent discovers available capabilities without external help.

---

## B2: Problem Detection

**When:** Health check runs for a capability

```
GIVEN:  Capability has HEALTH.md with indicators
WHEN:   Trigger fires (init, cron, event)
THEN:   Mechanism evaluates conditions
AND:    If problem detected, task_run created
```

**Effect:** Problems surface automatically, no human detection needed.

---

## B3: Task Creation

**When:** Problem detected by health check

```
GIVEN:  Problem defined in VOCABULARY.md
WHEN:   Health indicator signals problem
THEN:   on_problem creates task_run node
AND:    task_run links to problem with nature "resolves"
AND:    task_run links to target with nature "concerns"
```

**Effect:** Work items created automatically from detected problems.

---

## B4: Task Pickup

**When:** Agent queries for work

```
GIVEN:  task_run exists with status pending
WHEN:   Agent claims task_run
THEN:   Link created with nature "claims"
AND:    task_run status becomes in_progress
```

**Effect:** Work distributed to available agents.

---

## B5: Skill Loading

**When:** Agent starts working on task

```
GIVEN:  task_run has associated skill
WHEN:   Agent claims task
THEN:   Skill loaded into agent context
AND:    Procedure started if skill references one
```

**Effect:** Agent has tools and guidance for the work.

---

## B6: Execution

**When:** Agent works through procedure

```
GIVEN:  Procedure defines steps
WHEN:   Agent executes each step
THEN:   State updated
AND:    Outputs created
```

**Effect:** Work progresses through defined process.

---

## B7: Validation

**When:** Agent completes work

```
GIVEN:  VALIDATION.md defines success criteria
WHEN:   Work complete
THEN:   Validation checks run
AND:    If pass: task_run completed
AND:    If fail: retry or escalate
```

**Effect:** Quality assured before completion.

---

## B8: Resolution

**When:** Task successfully validated

```
GIVEN:  task_run completed
WHEN:   Health check runs again
THEN:   Problem no longer detected
AND:    Resolution confirmed
```

**Effect:** Closed loop — problem detected, resolved, verified gone.

---

## BEHAVIOR SUMMARY

| Trigger | Behavior | Outcome |
|---------|----------|---------|
| Agent arrives | Discovery | Knows what system can do |
| Health runs | Detection | Problems surface |
| Problem found | Task creation | Work items exist |
| Agent available | Pickup | Work assigned |
| Task claimed | Skill load | Agent equipped |
| Steps followed | Execution | Work progresses |
| Work done | Validation | Quality checked |
| Check passes | Resolution | Problem gone |
