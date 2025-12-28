# OBJECTIVES — Connectome Health

```
STATUS: DRAFT
CREATED: 2025-12-21
```

## PRIMARY OBJECTIVES (ranked)
1. Runtime truthfulness — signals must reflect real engine invariants, not UI guesses.
2. Low overhead — health probes must be O(1) per tick and throttleable.
3. Actionable diagnostics — surface issues that guide tuning without narrative fiat.

## NON-OBJECTIVES
- Automatic correction or mutation of canon state.
- Real-time exhaustive tracing of all events.

## TRADEOFFS (canonical decisions)
- Prefer lower signal resolution over hot-path latency.
- Prefer safety (no writes) over convenience (invasive probes).

## SUCCESS SIGNALS (observable)
- query_write_attempts stays at 0 under load.
- interrupt reasons align with focus reconfiguration or spoken events.
- dmz_violation_attempts remains at 0 in steady state.
