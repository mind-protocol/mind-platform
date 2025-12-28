# Connectome Health SSE Payload (v0)

Event name: `connectome_health`

```json
{
  "ts": 1730000000,
  "playthrough_id": "pt_123",
  "place_id": "P1_Inn_CommonRoom",
  "runner": {
    "speed": "x1",
    "tick": 9123,
    "last_interrupt": {
      "reason": "spoken|active_changed|active_deactivated|contradicts_visible|none",
      "moment_id": "mom_...",
      "age_ticks": 3
    }
  },
  "status": {
    "state": "OK|WARN|ERROR",
    "score": 0.0,
    "notes": ["..."]
  },
  "counters": {
    "query_write_attempts": 0,
    "dmz_violation_attempts": 0,
    "async_epoch_mismatch": 2
  },
  "attention": {
    "sink_set_size": {"p50": 8, "p95": 21},
    "neighborhood_size": {"nodes": 34, "edges": 68},
    "focus_reconfig_rate_per_min": 3.2,
    "plateau_seconds": 0
  },
  "pressure": {
    "contradiction": 0.34,
    "top_edges": [
      {"from": "narr_A", "to": "narr_B", "polarity": -0.7, "strength": 0.9, "confidence": 0.8, "contrib": 0.50}
    ]
  }
}
```
