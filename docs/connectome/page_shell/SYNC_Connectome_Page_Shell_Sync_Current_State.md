```

# page_shell — Sync: Current State

LAST_UPDATED: 2025-12-20
UPDATED_BY: codex
STATUS: DESIGNING
```

---

## MATURITY

**Canonical (v1 intent):**

* /connectome route renders a stable layout with control bar + canvas + log panel
* all UI commands dispatch through runtime_engine
* stepper mode remains the default and is explicit in the UI

**In design:**

* keyboard shortcuts for Next/Restart/Mode (deferred)
* realtime enablement once telemetry_adapter exists

---

## CURRENT STATE

Implemented a Next.js `/connectome` page shell that composes FlowCanvas and LogPanel, wires controls to `runtime_engine.dispatch_runtime_command`, and includes explicit Stepper/Realtime buttons. Next is disabled while in realtime mode (local-only until telemetry adapter ships).

---

## RECENT CHANGES

### 2025-12-20: Added explicit Stepper/Realtime controls and Next gating

* **What:** Replaced the mode select with Stepper/Realtime buttons and disabled Next while in realtime.
* **Why:** Make the “no Next in realtime” requirement explicit and keep the control surface deterministic.
* **Files:** `app/connectome/components/connectome_page_shell_route_layout_and_control_surface.tsx`.

### 2025-12-20: Implemented page shell route and control surface

* **What:** Added a Next.js route for `/connectome` with a control bar and layout grid; dispatches Next/Restart/Speed/Mode through runtime_engine.
* **Why:** Establish the required UI shell and enforce single dispatch path for stepper control semantics.
* **Files:** `app/connectome/page.tsx`, `app/connectome/components/connectome_page_shell_route_layout_and_control_surface.tsx`.

---

## TODO

* [ ] Add keyboard shortcuts once v1 flow is stable
* [ ] Wire realtime controls to telemetry_adapter when it exists (currently local-only)

---

## HANDOFF

**For agents:**

* Keep controls thin; do not bypass runtime_engine or state_store.
* If you add shortcuts, ensure they only call runtime_engine.

**For human:**

* Realtime toggle is present but local-only until telemetry ingestion exists.

---
