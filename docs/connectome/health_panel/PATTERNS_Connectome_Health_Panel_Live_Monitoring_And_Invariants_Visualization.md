# Connectome Health Panel — Patterns: Live Monitoring and Invariants Visualization

```
STATUS: DESIGNING
CREATED: 2024-02-23
VERIFIED: N/A against N/A
```

---

## CHAIN

```
OBJECTIVES:      ./OBJECTIVES_Connectome_Health_Panel_Metrics_Display_And_Realtime_Feedback.md
THIS:            PATTERNS_Connectome_Health_Panel_Live_Monitoring_And_Invariants_Visualization.md (you are here)
IMPLEMENTATION:  ../../components/connectome_health_panel.tsx
SYNC:            ./SYNC_Connectome_Health_Panel_Sync_Current_State.md

IMPL:            app/connectome/components/connectome_health_panel.tsx
```

### Bidirectional Contract

**Before modifying this doc or the code:**
1. Read ALL docs in this chain first
2. Read the linked IMPL source file

**After modifying this doc:**
1. Update the IMPL source file to match, OR
2. Add a TODO in SYNC_Connectome_Health_Panel_Sync_Current_State.md: "Docs updated, implementation needs: {what}"
3. Run tests: `N/A`

**After modifying the code:**
1. Update this doc chain to match, OR
2. Add a TODO in SYNC_Connectome_Health_Panel_Sync_Current_State.md: "Implementation changed, docs need: {what}"
3. Run tests: `N/A`

---

## THE PROBLEM

The Connectome system requires real-time observability of its operational health and internal invariants. Without a dedicated, easily digestible view, diagnosing issues or understanding performance at a glance is difficult, leading to slower debugging and potential system instability.

---

## THE PATTERN

The Connectome Health Panel employs a **Live Monitoring Grid Pattern** for invariants visualization. It presents key health metrics (status, score, runner activity, attention, pressure, counters) in a compact, organized grid. Each metric provides immediate, color-coded feedback to indicate its current state relative to expected invariants. The panel is designed for at-a-glance comprehension, emphasizing the most critical data points for system health.

---

## BEHAVIORS SUPPORTED

-   **Real-time health status visualization** — The panel updates dynamically to show the Connectome's live state.
-   **Categorization of health signals** — Metrics are grouped logically (e.g., Runner, Attention, Pressure) for easier understanding.
-   **Immediate anomaly detection** — Color-coded badges and scores quickly highlight deviations from healthy invariants.

## BEHAVIORS PREVENTED

-   **Historical trend analysis** — This panel is focused on *current* state, not long-term trends.
-   **Deep-dive diagnostics** — While providing critical signals, it does not offer tools for in-depth root cause analysis directly within the component.

---

## PRINCIPLES

### Principle 1: Clarity Over Density

Prioritize presenting the most important health metrics in an uncluttered, easy-to-read format, even if it means abstracting away less critical details.

### Principle 2: Immediacy of Feedback

Ensure that all displayed metrics reflect the most current state of the system with minimal latency, providing an up-to-the-second snapshot of health.

### Principle 3: Invariants-First Visualization

Design the display around the core invariants of the Connectome, making it clear when those invariants are being upheld or violated through visual cues.

---

## DATA

| Source | Type | Purpose / Description |
|--------|------|-----------------------|
| `ConnectomeHealthEvent` | Type | Data structure for current health metrics, including status, scores, notes, runner state, attention, pressure, and counters. |
| `zustand_connectome_state_store_with_atomic_commit_actions` | Module | Provides the `ConnectomeHealthEvent` data via a subscription/selector for real-time updates. |

---

## DEPENDENCIES

| Module | Why We Depend On It |
|--------|---------------------|
| `zustand_connectome_state_store_with_atomic_commit_actions` | Supplies the `ConnectomeHealthEvent` data for rendering. |

---

## INSPIRATIONS

-   **Health Dashboards (e.g., Grafana, Datadog)**: General patterns for displaying aggregated system health metrics.
-   **Game UI/HUDs**: Principles of conveying critical system status at a glance without distracting from the primary experience.

---

## SCOPE

### In Scope

-   Rendering the current health status and score.
-   Displaying key Connectome operational metrics (runner, attention, pressure, counters).
-   Providing visual indicators (e.g., color-coded badges) for health states.

### Out of Scope

-   Data fetching logic (handled by a separate module/mechanism feeding `ConnectomeHealthEvent`).
-   Historical data storage or graphing.
-   Alerting or notification mechanisms.
-   Interactive controls for the Connectome system itself.

---

## MARKERS
