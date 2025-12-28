# OBJECTIVES — Connectome Health Panel: Metrics Display and Realtime Feedback

```
STATUS: DESIGNING
CREATED: 2024-02-23
VERIFIED: N/A against N/A
```

## PRIMARY OBJECTIVES (ranked)
1.  **Display critical health metrics clearly** — Users need to quickly grasp the overall health status and key operational indicators of the Connectome.
2.  **Provide real-time feedback** — Metrics should update dynamically to reflect the current state without manual refresh.
3.  **Highlight anomalous states** — Visual cues (e.g., color-coding) should draw attention to health issues or unusual values.

## NON-OBJECTIVES
-   **Not a full monitoring dashboard** — This panel focuses on high-level, immediate health; detailed historical data or complex analytics are out of scope.
-   **Not for configuration or control** — This component is purely for display; it does not allow modification of Connectome settings or behavior.

## TRADEOFFS (canonical decisions)
-   When **display clarity** conflicts with **metric density**, choose **clarity**. Prioritize readability over showing every possible metric.
-   We accept **minimalist design** to preserve **performance** and **responsiveness** for real-time updates.

## SUCCESS SIGNALS (observable)
-   Health status (e.g., "OK", "WARNING", "CRITICAL") is accurately displayed.
-   Key metrics (score, runner speed, attention, pressure, counters) are visible and up-to-date.
-   Visual signals (e.g., red/yellow badges) correctly indicate health deviations.

---

## MARKERS
