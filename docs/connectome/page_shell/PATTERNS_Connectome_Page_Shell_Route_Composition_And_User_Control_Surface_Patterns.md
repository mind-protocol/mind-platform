```

# page_shell — Patterns: Route Composition and User Control Surface

STATUS: DRAFT
CREATED: 2025-12-20
VERIFIED: 2025-12-20 against ?
```

---

## CHAIN

```
THIS:            PATTERNS_Connectome_Page_Shell_Route_Composition_And_User_Control_Surface_Patterns.md (you are here)
BEHAVIORS:       ./BEHAVIORS_Connectome_Page_Shell_Stable_Workflow_And_Mode_Control_Effects.md
ALGORITHM:       ./ALGORITHM_Connectome_Page_Shell_Control_Dispatch_And_Layout_Composition.md
VALIDATION:      ./VALIDATION_Connectome_Page_Shell_Invariants_For_Control_Correctness_And_No_Drift.md
IMPLEMENTATION:  ./IMPLEMENTATION_Connectome_Page_Shell_Nextjs_Route_And_Component_Wiring.md
HEALTH:          ./HEALTH_Connectome_Page_Shell_Runtime_Verification_Of_Control_Semantics_And_Mode_Gating.md
SYNC:            ./SYNC_Connectome_Page_Shell_Sync_Current_State.md

IMPL:            app/connectome/components/connectome_page_shell_route_layout_and_control_surface.tsx
```

### Bidirectional Contract

```
Before modifying this doc or the code:

1. Read ALL docs in this chain
2. Read runtime_engine + state_store (page_shell must not bypass them)

After modifying this doc:

* Update implementation OR record mismatch in SYNC

After modifying the code:

* Update docs OR record mismatch in SYNC

Never degrade:

* stepper gating (Next = one step only)
* mode gating (realtime vs stepper)
* consistent UI composition (canvas + unified log panel)
  ```

---

## THE PROBLEM

/connectome needs a single place that:

* wires the page route and overall layout
* provides controls (Next, Restart, Speed, Mode toggle)
* dispatches user intent into runtime_mind/state_store
* keeps the dashboard cohesive as modules evolve

Failure modes without a stable page_shell:

* components call store actions directly and bypass runtime_engine
* mode toggles become inconsistent across panels
* “realtime” accidentally advances stepper
* layout regressions destroy readability (log separated from explain again)
* keyboard shortcuts are inconsistent or duplicated

---

## THE PATTERN

**Thin route shell + explicit control surface + composition-only responsibility.**

page_shell is deliberately not “smart”:

* it composes FlowCanvas + LogPanel + ControlsBar
* it dispatches commands to runtime_engine
* it never normalizes events, never stores ledger, never renders edges/nodes itself

Key insight:

> The page shell is the membrane between “user intent” and “system semantics.”
> It must be boring and correct.

---

## PRINCIPLES

### Principle 1: Composition only (no business logic)

page_shell does:

* route definition
* layout grid
* control bar placement
* wiring event handlers to runtime_engine commands

page_shell does NOT:

* normalize events (event_model)
* own state (state_store)
* render graph primitives (flow_canvas/node_kit/edge_kit)

### Principle 2: Single dispatch path for controls

All controls dispatch through:

* `runtime_engine.dispatch_runtime_command(...)`

No direct “append to ledger” or “set focus” calls from page_shell.

### Principle 3: Mode gating is explicit

* Stepper mode: Next enabled, Realtime consumes nothing (or disabled)
* Realtime mode: Next disabled (or becomes local “single drain” in v2), stream plays unless locally paused

---

## DATA

| Data                  | Source                                         | Notes                  |
| --------------------- | ---------------------------------------------- | ---------------------- |
| mode, speed           | state_store selectors                          | displayed in UI        |
| cursor + step total   | state_store + runtime_engine (script metadata) | “Step X of Y”          |
| health badges         | state_store                                    | optional header badges |
| realtime availability | telemetry_adapter status (?)                   | v1 may be “disabled”   |

---

## DEPENDENCIES

| Module              | Why                                              |
| ------------------- | ------------------------------------------------ |
| `flow_canvas`       | main visualization                               |
| `log_panel`         | unified explain + ledger                         |
| `runtime_engine`    | control dispatch (Next/Restart/Mode/Speed)       |
| `state_store`       | selectors for current UI state                   |
| `telemetry_adapter` | optional enablement for realtime mode (reserved) |

---

## INSPIRATIONS

* IDE/debugger “Run vs Step” control bars
* dashboards with “single control surface” pattern
* mind area pattern: stable route + stable module composition

---

## SCOPE

### In Scope

* Next.js route: `/connectome` (not `/health`)
* control bar UI (Next, Restart, Speed, Mode toggle, Copy handled by log_panel)
* keyboard shortcuts (optional v1) for Next/Restart/Mode toggle
* consistent layout: zones canvas + unified log panel (no re-splitting)

### Out of Scope

* node rendering (node_kit)
* edge rendering (edge_kit)
* event normalization (event_model)
* ledger storage (state_store)
* realtime ingestion logic (telemetry_adapter)

---

## MARKERS

* [ ] Decide keyboard shortcuts v1: Next = Space/Enter? Restart = R? Toggle mode = M? → `?`
* QUESTION: Should mode toggle be hidden until telemetry_adapter is implemented? (v1: can show but disabled with tooltip)
* IDEA: add “Fit view” and “Reset view” buttons here (calls flow_canvas camera actions).
