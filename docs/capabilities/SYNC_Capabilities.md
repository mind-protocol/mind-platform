# Capabilities — Sync

```
STATUS: CANONICAL
LAST_UPDATED: 2025-12-29
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
IMPLEMENTATION:  ./IMPLEMENTATION_Capabilities.md
HEALTH:          ./HEALTH_Capabilities.md
THIS:            SYNC_Capabilities.md (you are here)
```

---

## CURRENT STATE

### Maturity

| Component | Status |
|-----------|--------|
| OBJECTIVES | Canonical |
| PATTERNS | Canonical |
| VOCABULARY | Canonical |
| BEHAVIORS | Canonical |
| ALGORITHM | Canonical |
| VALIDATION | Canonical |
| IMPLEMENTATION | Canonical |
| HEALTH | Canonical |

### Capabilities Defined

This doc chain defines the **capability system itself** — what capabilities are and how they work.

Capabilities are **self-contained** — specs AND runtime live together.

| Location | Contents |
|----------|----------|
| `capabilities/{name}/` | Full capability (docs, tasks, skills, procedures, runtime/) |
| `.mind/capabilities/{name}/` | Installed capability (after `mind init`) |

---

## RECENT CHANGES

### 2025-12-29: Simplified to Self-Contained Capabilities

- Capabilities live at `capabilities/{name}/` (not in templates/)
- Each capability is self-contained: specs + runtime together
- After `mind init`, copied to `.mind/capabilities/{name}/`
- System docs stay at `docs/capabilities/`

### 2025-12-29: Initial Creation

- Created full doc chain for capability system
- Defined capability as "autonomous, self-describing functional organ"
- Established 4 problems: MISSING, ORPHAN, INCOMPLETE, DRIFT
- Defined 4 health indicators with on_problem handlers
- Documented lifecycle: detection → task creation → pickup → execution → validation → resolution

---

## NEXT STEPS

1. **Create standard capabilities** in templates/capabilities/
   - create-doc-chain
   - ingest-docs
   - embed-nodes
   - monitor-health
   - sync-state

2. **Implement CLI commands**
   - `mind capabilities list`
   - `mind capabilities validate`
   - `mind capabilities health`

3. **Add MCP tools**
   - capability_list
   - capability_info
   - capability_check

---

## HANDOFF

**For next agent:**

The capability system doc chain is complete. It defines what capabilities are (autonomous functional organs), how they work (detection → execution → validation cycle), and how to validate them.

Next work is creating actual capability implementations in templates/capabilities/.

**Agent posture:** architect (designing capability implementations) or groundwork (building them)
