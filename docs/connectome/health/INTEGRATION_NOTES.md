# Integration Notes — Connectome Health (v0)

## Backend wiring (minimal)

- Instantiate `ConnectomeHealth` for each playthrough (or each runner scope).
- During each tick (or immediately after attention-split computation), feed:
  - `record_sink_size(n)`
  - `record_focus_change(changed)`
  - `record_interrupt(reason, moment_id, age_ticks)`
- When you already have neighborhood sizes and contradiction pressure computed, build the event.

Emit (throttled):
- `if health.should_emit(): health.emit(health.build_event(...), publish_fn)`

### Hard invariants (counters)
- Wrap GraphOps writes with a context flag `in_query_context` to bump `query_write_attempts`.
- Wrap WorldBuilder graph writes with DMZ guard; bump `dmz_violation_attempts` on attempted write.
- Tag async jobs with epoch/tick; bump `async_epoch_mismatch` when dropping stale results.

## Frontend wiring (minimal)

- Subscribe to SSE event `connectome_health`
- Save last payload in state
- Render <ConnectomeHealthPanel ev={health} />

Example (pseudo):

```ts
const [health, setHealth] = useState(null);
useEffect(() => {
  const es = new EventSource("/api/sse");
  es.addEventListener("connectome_health", (e) => setHealth(JSON.parse((e as MessageEvent).data)));
  return () => es.close();
}, []);
```
