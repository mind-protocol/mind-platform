# Grammar — Algorithm: The Protocol Grammar

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
THIS:            ALGORITHM_Grammar.md (you are here)
VALIDATION:      ./VALIDATION_Grammar.md
IMPLEMENTATION:  ./IMPLEMENTATION_Grammar.md
```

---

## PURPOSE

**This is THE grammar.** The single specification that defines how detection, task creation, execution, and resolution work.

MCP runtime implements this specification exactly.

---

## 1. DETECTION

### 1.1 Trigger Evaluation

```
ON trigger(type, payload):
  indicators = load_health_indicators()

  FOR each indicator IN indicators:
    IF indicator.trigger MATCHES type:
      evaluate_indicator(indicator, payload)
```

### 1.2 Indicator Evaluation

```
FUNCTION evaluate_indicator(indicator, payload):
  condition = indicator.condition
  result = evaluate_condition(condition, payload)

  IF result.problem_detected:
    problem_id = result.problem_id
    target = result.target

    create_task_run_if_needed(problem_id, target)
```

### 1.3 Task Run Creation

```
FUNCTION create_task_run_if_needed(problem_id, target):
  # Check for existing pending/running task_run
  existing = QUERY graph:
    MATCH (tr:narrative {type: 'task_run', status: IN ['pending', 'running']})
    -[:TARGET]-> (target)
    -[:OF]-> (t:narrative {type: 'task'})
    WHERE t.resolves = problem_id
    RETURN tr

  IF existing IS NOT NULL:
    RETURN  # Already being handled

  # Get task template from problem definition
  problem = lookup_problem(problem_id)
  task_id = problem.resolves_with
  task = get_node(task_id)

  # Create task_run
  task_run = CREATE node:
    node_type: narrative
    type: task_run
    id: "task_run_" + uuid()
    status: pending
    created_at: now()
    synthesis: "Task run: " + task.name + " on " + target.id

  # Link to template and target
  CREATE link: task_run -[OF]-> task
  CREATE link: task_run -[TARGET]-> target
```

---

## 2. CLAIM

### 2.1 Actor Query

```
FUNCTION actor_find_work(actor):
  actor_type = actor.type
  capabilities = get_actor_capabilities(actor_type)

  # Find pending task_runs this actor can handle
  candidates = QUERY graph:
    MATCH (tr:narrative {type: 'task_run', status: 'pending'})
    -[:OF]-> (t:narrative {type: 'task'})
    WHERE t.executor IN capabilities
    RETURN tr, t
    ORDER BY tr.created_at ASC

  RETURN candidates
```

### 2.2 Claim Task Run

```
FUNCTION actor_claim(actor, task_run):
  # Verify still pending (race condition guard)
  IF task_run.status != 'pending':
    RETURN error("Already claimed")

  # Update task_run
  UPDATE task_run:
    status: running
    claimed_at: now()

  # Create claim link
  CREATE link: task_run -[CLAIMED_BY]-> actor

  # Update actor
  UPDATE actor:
    status: running

  RETURN success
```

---

## 3. EXECUTION

### 3.1 Load Execution Context

```
FUNCTION prepare_execution(task_run):
  task = FOLLOW task_run -[OF]-> task
  target = FOLLOW task_run -[TARGET]-> target
  skill = FOLLOW task -[USES]-> skill (optional)
  procedure = FOLLOW task -[EXECUTES]-> procedure

  RETURN {task, target, skill, procedure}
```

### 3.2 Execute Procedure

```
FUNCTION execute_procedure(procedure, context):
  # Create run instance
  run = CREATE node:
    node_type: space
    type: run
    id: "run_" + uuid()
    status: active
    current_step: procedure.steps[0].id
    context: context

  CREATE link: run -[OF]-> procedure

  # Execute steps
  FOR each step IN procedure.steps:
    UPDATE run.current_step = step.id

    result = execute_step(step, run.context)

    IF result.error:
      RETURN {status: 'failed', error: result.error}

    IF step.branches:
      next_step = evaluate_branches(step.branches, result)
      CONTINUE from next_step

  UPDATE run.status = completed
  RETURN {status: 'completed'}
```

### 3.3 Agent Execution (for executor=agent)

```
FUNCTION agent_execute(actor, task_run, context):
  skill = context.skill

  IF skill IS NOT NULL:
    # Load skill instructions
    instructions = skill.content
    # Agent follows skill cognitive pattern
    # (This happens in the LLM, not in code)

  # Execute procedure with agent interaction
  result = execute_procedure_interactive(context.procedure, context)

  RETURN result
```

### 3.4 Automated Execution (for executor=automated)

```
FUNCTION automated_execute(task_run, context):
  procedure = context.procedure

  # Execute procedure without agent
  # Each step has code_action that runs directly
  result = execute_procedure_automated(procedure, context)

  RETURN result
```

---

## 4. RESOLUTION

### 4.1 Successful Completion

```
FUNCTION complete_task_run(task_run, result):
  target = FOLLOW task_run -[TARGET]-> target
  actor = FOLLOW task_run -[CLAIMED_BY]-> actor

  # Update task_run
  UPDATE task_run:
    status: completed
    completed_at: now()
    result: result

  # Create resolution link
  CREATE link: task_run -[RESOLVED]-> target

  # Release actor
  UPDATE actor:
    status: ready
```

### 4.2 Failed Completion

```
FUNCTION fail_task_run(task_run, error):
  actor = FOLLOW task_run -[CLAIMED_BY]-> actor

  # Update task_run
  UPDATE task_run:
    status: failed
    failed_at: now()
    error: error

  # Release actor
  UPDATE actor:
    status: ready

  # No RESOLVED link - problem persists
```

---

## 5. VERIFICATION

### 5.1 Resolution Verification

```
FUNCTION verify_resolution(task_run):
  target = FOLLOW task_run -[TARGET]-> target
  task = FOLLOW task_run -[OF]-> task
  problem_id = task.resolves

  # Re-run detection for this specific target
  result = evaluate_problem_for_target(problem_id, target)

  IF result.problem_detected:
    RETURN {verified: false, reason: "Problem still exists"}

  RETURN {verified: true}
```

---

## STATE MACHINE SUMMARY

```
         ┌─────────────────────────────────────────┐
         │                                         │
         ▼                                         │
    [pending] ──claim──▶ [running] ──success──▶ [completed]
         │                   │
         │                   │
         │                   └──failure──▶ [failed]
         │                                    │
         │                                    │
         └────────────────────────────────────┘
                   (new task_run on retry)
```

---

## PSEUDOCODE CONVENTIONS

- `QUERY graph:` = Cypher-like graph query
- `CREATE node:` = Create node with properties
- `CREATE link:` = Create link between nodes
- `UPDATE x:` = Update node properties
- `FOLLOW x -[R]-> y` = Traverse link
- `RETURN` = Return value from function
