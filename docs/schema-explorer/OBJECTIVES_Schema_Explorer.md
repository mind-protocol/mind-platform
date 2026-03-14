# OBJECTIVES — Schema Explorer

## Purpose

Provide a public-facing page that makes the fixed MIND schema legible to humans before they dive into raw YAML.

## Ranked Goals

1. **Clarity first** — explain the 5 node types + 1 link model in plain language.
2. **Protocol fidelity** — never contradict `docs/schema/schema.yaml` semantics.
3. **Fast loading** — static render with no backend dependency.
4. **Extensible structure** — content blocks can grow without redesigning routing.

## Non-goals

- Full graph introspection from live database.
- Editing schema from UI.
