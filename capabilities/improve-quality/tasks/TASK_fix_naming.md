# Task: fix_naming

```
NODE: narrative:task
STATUS: active
```

---

## Purpose

Rename files, classes, functions, or variables to follow project naming conventions.

---

## Resolves

| Problem | Severity |
|---------|----------|
| NAMING_CONVENTION | low |

---

## Inputs

```yaml
inputs:
  target: file_path       # File with naming violations
  violations: string[]    # List of names and expected format
  problem: problem_id     # NAMING_CONVENTION
```

---

## Outputs

```yaml
outputs:
  renames_completed: int  # Number of renames done
  imports_updated: int    # Number of import statements updated
  references_updated: int # Number of references updated
  tests_pass: bool        # Do tests still pass
```

---

## Executor

```yaml
executor:
  type: script
  script: rename_to_convention
  fallback: agent (steward)
```

---

## Uses

```yaml
uses:
  skill: SKILL_refactor
```

---

## Process

1. **Identify** — List all naming violations
2. **Determine correct name** — Apply convention rules
3. **Rename** — Update the name at definition
4. **Update references** — Find and update all usages
5. **Update imports** — Fix import statements
6. **Test** — Verify nothing broken

---

## Convention Rules

### Python
- Files: `snake_case.py`
- Classes: `PascalCase`
- Functions: `snake_case`
- Constants: `UPPER_SNAKE_CASE`
- Variables: `snake_case`

### TypeScript/JavaScript
- Files: `kebab-case.ts` or `camelCase.ts`
- Classes: `PascalCase`
- Functions: `camelCase`
- Constants: `UPPER_SNAKE_CASE`
- Variables: `camelCase`

---

## Validation

Complete when:
1. All violations fixed
2. All imports resolve
3. All references updated
4. No new naming violations introduced
5. Tests pass
6. Health check no longer detects NAMING_CONVENTION

---

## Instance (task_run)

Created by runtime when HEALTH.on_signal fires:

```yaml
node_type: narrative
type: task_run
nature: "optionally concerns"

links:
  - nature: serves
    to: TASK_fix_naming
  - nature: concerns
    to: "{target}"
  - nature: resolves
    to: NAMING_CONVENTION
```
