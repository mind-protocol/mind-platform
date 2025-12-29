# Capability Runtime — Behaviors

```
STATUS: DESIGNING
MODULE: capability-runtime
```

---

## CHAIN

```
PREV:            ./PATTERNS_Capability_Runtime.md
THIS:            BEHAVIORS_Capability_Runtime.md (you are here)
NEXT:            ./ALGORITHM_Capability_Runtime.md
```

---

## B1: Capability Discovery

**When:** MCP starts or `mind init` runs

**Input:** `.mind/runtime/capabilities/` directory

**Output:** List of capability modules with their HANDLERS

**Observable:**
- Log: `Discovered capability: {name}`
- Each capability with valid `__init__.py` and `HANDLERS` is loaded
- Invalid capabilities logged but skipped

---

## B2: Handler Registration

**When:** After capability discovery

**Input:** HANDLERS dict from each capability

**Output:** Trigger → handler mapping in MCP

**Observable:**
- Log: `Registered handler: {trigger} → {capability}.{handler}`
- Triggers become active immediately
- Duplicate triggers from different capabilities: last wins (with warning)

---

## B3: Trigger Dispatch

**When:** Trigger event occurs (file change, cron, init phase, etc.)

**Input:**
- Trigger name (e.g., `file.deleted`)
- Context (source, timestamp, metadata)

**Output:** Handler invocation with context

**Observable:**
- Log: `Trigger: {trigger} → dispatching to {n} handlers`
- Handlers called sequentially (not parallel)
- Handler exceptions caught, logged, don't affect other handlers

---

## B4: Task Creation

**When:** Handler returns TaskRun objects

**Input:** List of TaskRun from handler

**Output:** task_run nodes in graph

**Observable:**
- Graph: New `narrative:task_run` nodes created
- Links: task_run → task template, task_run → target
- Log: `Created task_run: {id} for {target}`

---

## B5: Health Check Integration

**When:** `mind doctor` or MCP health endpoint called

**Input:** Request for health status

**Output:** Aggregated health from all capability monitors

**Observable:**
- Each monitor's `check()` called
- Results aggregated: healthy / degraded / critical
- Issues listed with source capability

---

## B6: Graceful Degradation

**When:** Capability runtime has errors

**Input:** Exception during load or execution

**Output:** Capability disabled, others continue

**Observable:**
- Log: `Capability {name} disabled: {error}`
- MCP continues running
- Health status shows degraded capability
- Specs (docs) still readable, only runtime affected

---

## BEHAVIOR MATRIX

| Trigger | Handler Response | MCP Action |
|---------|-----------------|------------|
| `init.*` | `[]` | Nothing, healthy |
| `init.*` | `[TaskRun]` | Create task_runs |
| `file.*` | `[]` | Nothing |
| `file.*` | `[TaskRun]` | Create task_runs |
| `cron.*` | `[]` | Nothing |
| `cron.*` | `[TaskRun]` | Create task_runs |
| Any | Exception | Log, skip handler, continue |

---

## ERROR BEHAVIORS

| Error | Behavior |
|-------|----------|
| Capability missing `__init__.py` | Skip, log warning |
| Capability missing `HANDLERS` | Skip, log warning |
| Handler raises exception | Log error, continue to next handler |
| Handler returns invalid TaskRun | Log error, skip that TaskRun |
| Handler hangs (>30s) | Timeout, log error, continue |
