# Capabilities — Implementation

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
ALGORITHM:       ./ALGORITHM_Capabilities.md
VALIDATION:      ./VALIDATION_Capabilities.md
THIS:            IMPLEMENTATION_Capabilities.md (you are here)
HEALTH:          ./HEALTH_Capabilities.md
SYNC:            ./SYNC_Capabilities.md
```

---

## PURPOSE

Where capability system code lives and how it's structured.

---

## FILE STRUCTURE

### Platform (source of truth)

```
docs/capabilities/                     # Capability SYSTEM docs (this chain)
├── OBJECTIVES_Capabilities.md
├── PATTERNS_Capabilities.md
├── VOCABULARY_Capabilities.md
├── BEHAVIORS_Capabilities.md
├── ALGORITHM_Capabilities.md
├── VALIDATION_Capabilities.md
├── IMPLEMENTATION_Capabilities.md
├── HEALTH_Capabilities.md
└── SYNC_Capabilities.md

capabilities/                          # Capability implementations
└── {name}/
    ├── OBJECTIVES.md                  # Doc chain (specs)
    ├── PATTERNS.md
    ├── VOCABULARY.md
    ├── BEHAVIORS.md
    ├── ALGORITHM.md
    ├── VALIDATION.md
    ├── IMPLEMENTATION.md
    ├── HEALTH.md
    ├── SYNC.md
    ├── tasks/                         # Task templates
    ├── skills/                        # Agent skills
    ├── procedures/                    # Step-by-step procedures
    └── runtime/                       # Python code (MCP-executable)
        ├── __init__.py                # Exports CHECKS list
        └── checks.py                  # @check decorated functions
```

### Project (after `mind init`)

```
.mind/capabilities/                    # Installed capabilities (full copy)
└── {name}/
    ├── *.md
    ├── tasks/
    ├── skills/
    ├── procedures/
    └── runtime/
```

---

## KEY COMPONENTS

### Capability Folder Structure

Each capability follows this structure:

```
{capability-name}/
├── OBJECTIVES.md          # Why this capability exists
├── PATTERNS.md            # Design approach
├── VOCABULARY.md          # Terms and problems it handles
├── BEHAVIORS.md           # Observable effects
├── ALGORITHM.md           # How it works
├── VALIDATION.md          # Success criteria
├── IMPLEMENTATION.md      # Code locations
├── HEALTH.md              # Triggers and detection
├── SYNC.md                # Current state
├── tasks/                 # Task templates
│   └── {task}.yaml
├── skills/                # Skills for agents
│   └── SKILL_{name}.md
└── procedures/            # Execution procedures
    └── {procedure}.yaml
```

---

## INTEGRATION POINTS

### Health System

```yaml
# HEALTH.md triggers health checks
indicators:
  - mechanism runs periodically
  - signals evaluated
  - on_problem creates tasks

# Connects to: .mind/mind/health/
```

### Task System

```yaml
# tasks/ folder contains task templates
# on_problem references these templates
# task_run instances created when problems detected

# Connects to: .mind/mind/tasks/
```

### Skill System

```yaml
# skills/ folder contains skill definitions
# Tasks reference skills
# Agents load skills when claiming tasks

# Connects to: .mind/skills/
```

### Procedure System

```yaml
# procedures/ folder contains procedure definitions
# Skills reference procedures
# Procedures guide step-by-step execution

# Connects to: .mind/procedures/
```

---

## CLI COMMANDS

```bash
# List capabilities
mind capabilities list

# Validate a capability
mind capabilities validate {name}

# Run capability health check
mind capabilities health {name}

# Create new capability from template
mind capabilities create {name}
```

---

## MCP TOOLS

```yaml
# Query capabilities
capability_list:
  returns: list of available capabilities

# Get capability details
capability_info:
  params:
    name: capability name
  returns: full capability docs

# Trigger capability check
capability_check:
  params:
    name: capability name
  returns: health status, any problems detected
```
