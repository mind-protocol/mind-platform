# Nature — Implementation

```
STATUS: CANONICAL
MODULE: nature
```

---

## CHAIN

```
ALGORITHM:       ./ALGORITHM_Nature.md
VALIDATION:      ./VALIDATION_Nature.md
THIS:            IMPLEMENTATION_Nature.md (you are here)
HEALTH:          ./HEALTH_Nature.md
SYNC:            ./SYNC_Nature.md
```

---

## PURPOSE

Where the nature is implemented and how files are structured.

---

## FILE STRUCTURE

### Platform (Protocol Definition)

```
mind-platform/
├── docs/
│   └── nature/               # THIS DOC CHAIN
│       ├── OBJECTIVES_Nature.md
│       ├── PATTERNS_Nature.md
│       ├── VOCABULARY_Nature.md
│       ├── BEHAVIORS_Nature.md
│       ├── ALGORITHM_Nature.md
│       ├── VALIDATION_Nature.md
│       ├── IMPLEMENTATION_Nature.md
│       ├── HEALTH_Nature.md
│       └── SYNC_Nature.md
│
├── templates/
│   ├── tasks/                 # Task templates
│   │   └── TASK_*.md
│   ├── skills/                # Skill definitions
│   │   └── SKILL_*.md
│   ├── actors/                # Actor templates
│   │   └── ACTOR_*.md
│   └── procedures/            # Procedure definitions
│       └── *.yaml
│
└── schema/
    └── schema.yaml            # Node/link type definitions
```

### MCP (Runtime)

```
mind-mcp/
├── mcp/
│   └── server.py              # MCP tool handlers
│
└── runtime/
    ├── nature/               # Nature implementation
    │   ├── detection.py       # Section 1 of ALGORITHM
    │   ├── claim.py           # Section 2 of ALGORITHM
    │   ├── execution.py       # Section 3 of ALGORITHM
    │   ├── resolution.py      # Section 4 of ALGORITHM
    │   └── verification.py    # Section 5 of ALGORITHM
    │
    ├── health/                # HEALTH indicator execution
    │   ├── indicator_loader.py
    │   ├── indicator_runner.py
    │   └── triggers.py
    │
    └── task/                  # Task management
        ├── task_run_creator.py
        ├── task_query.py
        └── task_state.py
```

### Target Project (.mind/)

```
.mind/
├── docs/
│   └── nature/               # Copied from platform
│       └── *.md
│
├── tasks/                     # System + custom tasks
│   └── TASK_*.md
├── skills/                    # System + custom skills
│   └── SKILL_*.md
├── actors/                    # System + custom actors
│   └── ACTOR_*.md
├── procedures/                # System + custom procedures
│   └── *.yaml
│
└── runtime/                   # Copied from MCP
    └── ...
```

---

## CODE MAPPING

### ALGORITHM Section → Code

| Section | File | Function |
|---------|------|----------|
| 1. Detection | `nature/detection.py` | `evaluate_trigger()`, `evaluate_indicator()`, `create_task_run_if_needed()` |
| 2. Claim | `nature/claim.py` | `actor_find_work()`, `actor_claim()` |
| 3. Execution | `nature/execution.py` | `prepare_execution()`, `execute_procedure()` |
| 4. Resolution | `nature/resolution.py` | `complete_task_run()`, `fail_task_run()` |
| 5. Verification | `nature/verification.py` | `verify_resolution()` |

### MCP Tools → Code

| Tool | Handler | Uses |
|------|---------|------|
| `health_check` | `server.py:health_check()` | `detection.py` |
| `task_list` | `server.py:task_list()` | `task_query.py` |
| `agent_spawn` | `server.py:agent_spawn()` | `claim.py`, `execution.py` |
| `agent_status` | `server.py:agent_status()` | `task_state.py` |

---

## INIT FLOW

```
mind init
  │
  ├── Copy templates/docs/nature/ → .mind/docs/nature/
  ├── Copy templates/tasks/ → .mind/tasks/
  ├── Copy templates/skills/ → .mind/skills/
  ├── Copy templates/actors/ → .mind/actors/
  ├── Copy templates/procedures/ → .mind/procedures/
  │
  ├── Create actor nodes from .mind/actors/ACTOR_*.md
  ├── Create task nodes from .mind/tasks/TASK_*.md
  │
  └── Run initial health check (detection)
      └── Create task_runs for detected problems
```

---

## RUNTIME FLOW

```
MCP Server Start
  │
  ├── Load nature from .mind/docs/nature/ALGORITHM_Nature.md
  ├── Load indicators from .mind/docs/*/HEALTH_*.md
  ├── Load tasks from .mind/tasks/TASK_*.md
  │
  └── Ready to handle tool calls
```

---

## DATA FLOW

```
Trigger Event
  │
  ▼
health_check() ─────────────────────┐
  │                                 │
  ▼                                 │
detection.evaluate_trigger()        │
  │                                 │
  ▼                                 │
detection.create_task_run()         │
  │                                 │
  ▼                                 │
[Graph: task_run node created] ◄────┘
  │
  ▼
agent_spawn() or actor poll
  │
  ▼
claim.actor_claim()
  │
  ▼
[Graph: task_run.status=running]
  │
  ▼
execution.execute_procedure()
  │
  ▼
resolution.complete_task_run()
  │
  ▼
[Graph: task_run.status=completed]
```
