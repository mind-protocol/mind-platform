# Capabilities — Algorithm

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
BEHAVIORS:       ./BEHAVIORS_Capabilities.md
THIS:            ALGORITHM_Capabilities.md (you are here)
VALIDATION:      ./VALIDATION_Capabilities.md
```

---

## PURPOSE

How the capability system works — the execution flow.

---

## CAPABILITY LIFECYCLE

```
┌──────────────────────────────────────────────────────────────┐
│                    CAPABILITY LIFECYCLE                       │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  1. DETECTION                                                │
│     └── Trigger fires (init | cron | event | file_watch)    │
│     └── Dock receives payload                                │
│     └── Mechanism evaluates → problem detected?              │
│                                                              │
│  2. TASK CREATION                                            │
│     └── Lookup problem in VOCABULARY                         │
│     └── Get resolves_with → task template                    │
│     └── Create task_run instance                             │
│     └── Link: task_run -[serves]-> task                      │
│     └── Link: task_run -[concerns]-> target                  │
│     └── Link: task_run -[resolves]-> problem                 │
│                                                              │
│  3. PICKUP                                                   │
│     └── Agent queries pending tasks                          │
│     └── Agent claims task_run                                │
│     └── Link: agent -[claims]-> task_run                     │
│     └── Load associated skill                                │
│                                                              │
│  4. EXECUTION                                                │
│     └── Start procedure (if skill references one)            │
│     └── Execute steps                                        │
│     └── Update state                                         │
│     └── Create outputs                                       │
│                                                              │
│  5. VALIDATION                                               │
│     └── Check VALIDATION criteria                            │
│     └── If pass → complete                                   │
│     └── If fail → retry or escalate                          │
│                                                              │
│  6. RESOLUTION                                               │
│     └── Health check runs again                              │
│     └── Problem no longer detected                           │
│     └── Capability cycle complete                            │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

---

## STEP 1: DETECTION

```yaml
input:
  trigger: init | cron | event | file_watch
  payload: context from trigger

process:
  1. Trigger fires
  2. Find capability HEALTH.md
  3. Locate matching indicator
  4. Run mechanism check
  5. Evaluate signals (healthy | degraded | critical)

output:
  if problem_detected:
    proceed to TASK CREATION
  else:
    done (no action needed)
```

---

## STEP 2: TASK CREATION

```yaml
input:
  problem_id: from detection
  target_node: what the problem affects

process:
  1. Lookup problem in VOCABULARY.md
  2. Get resolves_with task template
  3. Create task_run node:
     - node_type: narrative
     - type: task_run
     - content: problem description
     - nature: from problem severity
  4. Create links:
     - task_run -[serves]-> task_template
     - task_run -[concerns]-> target_node
     - task_run -[resolves]-> problem_node

output:
  task_run: ready for pickup
```

---

## STEP 3: PICKUP

```yaml
input:
  agent: available agent
  query: pending tasks matching agent skills

process:
  1. Agent queries task system
  2. Filter by agent capabilities
  3. Select task (priority ordering)
  4. Claim task:
     - Link: agent -[claims]-> task_run
     - Update task_run status: in_progress
  5. Load skill if task references one

output:
  agent: working on task
  skill: loaded in context
```

---

## STEP 4: EXECUTION

```yaml
input:
  task_run: claimed task
  skill: loaded skill
  procedure: optional procedure from skill

process:
  if procedure exists:
    1. Start procedure session
    2. For each step:
       - Present step to agent
       - Agent executes
       - Record output
    3. End procedure
  else:
    1. Agent works using skill guidance
    2. Creates outputs

output:
  work_complete: true
  outputs: created artifacts
```

---

## STEP 5: VALIDATION

```yaml
input:
  task_run: completed work
  validation_criteria: from VALIDATION.md

process:
  1. Load VALIDATION.md for capability
  2. Run each invariant check
  3. Evaluate results

output:
  if all_pass:
    task_run.status = completed
    proceed to RESOLUTION
  if any_fail:
    if retryable:
      return to EXECUTION
    else:
      escalate to human
```

---

## STEP 6: RESOLUTION

```yaml
input:
  task_run: validated complete
  original_problem: what triggered this

process:
  1. Health check runs again
  2. Evaluate same indicator
  3. Check if problem persists

output:
  if problem_gone:
    resolution confirmed
    cycle complete
  if problem_persists:
    investigate (new task or escalation)
```

---

## DECISION TREE: TRIGGER ROUTING

```
Trigger received
│
├── What type?
│   ├── init → Run all indicators marked "init"
│   ├── cron → Run indicators matching schedule
│   ├── event → Route to indicators watching that event
│   └── file_watch → Route to indicators watching that path
│
├── For each matching indicator:
│   ├── Run mechanism
│   ├── Evaluate signals
│   └── If problem → create task
│
└── Done
```
