```

# state_store — Algorithm: Atomic Commits for Releases, Focus, and Timers

STATUS: DRAFT
CREATED: 2025-12-20
VERIFIED: 2025-12-20 against ?
```

---

## CHAIN

```
PATTERNS:        ./PATTERNS_Connectome_State_Store_Single_Source_Of_Truth_For_Events_Focus_And_Timers.md
BEHAVIORS:       ./BEHAVIORS_Connectome_State_Store_Observable_State_Consistency_Effects.md
THIS:            ALGORITHM_Connectome_State_Store_Atomic_Commits_For_Step_Releases_And_Realtime.md (you are here)
VALIDATION:      ./VALIDATION_Connectome_State_Store_Invariants_For_Ledger_Ordering_And_Focus.md
IMPLEMENTATION:  ./IMPLEMENTATION_Connectome_State_Store_Code_Structure_And_Zustand_Actions.md
HEALTH:          ./HEALTH_Connectome_State_Store_Runtime_Verification_Of_Ledger_And_Timer_Correctness.md
SYNC:            ./SYNC_Connectome_State_Store_Sync_Current_State.md
```

---

## OVERVIEW

state_store owns:

* the append-only ledger of FlowEvents
* the active focus (node/edge/step key)
* the current explanation sentence
* mode/speed flags and time signals (wait/tick widgets)

All updates for one release must occur in a single commit to prevent visual/log desync.

## OBJECTIVES AND BEHAVIORS

The state_store objective is to keep every release, log export, and realtime tick
in lockstep with the ledger/focus/timer state so downstream renderers, auditors,
and health checks always see the same narrative. Behaviorally, this algorithm
commits a single interlocked bundle (ledger append, focus override, explanation
sentence, and timer state) for each release while simultaneously preventing helper
components from emitting their own inconsistent focus/timer transitions outside
that bundle.

By tying focus, timers, and ledger writes to a single long-lived store action,
the behavior contract ensures UI renderers can read a canonical state without
compensating for asynchronous mutations.

This algorithm also forbids untethered timer or focus changes from appearing in
auxiliary helpers: each atomic commit self-documents the ledger append, focus
highlight, and timer signal so realtime clients and log exporters always view the
same released sequence even when latency tries to push updates out of order.

Every rendered release, telemetry export, and realtime tick now aligns to this
store so downstream readers never chase divergent focus or timer values while
observability surfaces relay the same ledger sequence recorded here.

Health and telemetry dashboards rely on these objectives so they can replay the
same ordering, cursor, and timer signals before any analyst raises a consistency
flag, keeping inspectors confident that the commit they review matches the live
stepper story.

---

## DATA STRUCTURES

The store intentionally keeps the schema lean so serialization, cloning, and
inspection remain predictable when health tooling or replay exports read the
state snapshot.

### `ConnectomeStoreState`

```
ConnectomeStoreState:
session_id: string
mode: stepper|realtime
speed: pause|1x|2x|3x
local_pause: boolean
cursor: number
ledger: FlowEvent[]
active_focus:
active_node_id: string|null
active_edge_id: string|null
active_step_key: string|null
current_explanation:
sentence: string
notes: string|null
wait_progress:
started_at_ms: number|null
stopped_at_ms: number|null
max_seconds: 4.0
tick_display:
nominal_interval_ms: number|Infinity
progress_0_1: number
speed_label: string
health_badges:
[module_name]: {status: OK|WARN|ERROR|UNKNOWN, tooltip: string}
```

Each field is intentionally minimal so serialization, replay export, and health
inspections can consume the state as a simple JSON blob with predictable keys.

---

## ALGORITHM: `commit_step_release_append_event_and_set_focus_and_explanation(release)`

Input: `release` contains:

* `event: FlowEvent`
* `focus: {node_id, edge_id, step_key}`
* `explanation_sentence: string`
* `wait_timer_action?: start|stop|none`
* `cursor_next: number`

Steps:

1. Validate the release payload shape (coerce missing fields rather than throwing)
2. Append event to `ledger` with immutability so audit exports replay the exact
   history
3. Set `active_focus` to the focus identifiers so renderers always highlight the
   node/edge pair we just committed
4. Update `current_explanation` sentence and optional notes so narrative
   surfaces match the store’s voice
5. Apply wait timer updates atomically:

   * start: set started_at_ms=now, stopped_at_ms=null
   * stop: set stopped_at_ms=now (or set started_at_ms=null if reset policy)
6. Update `cursor` to `cursor_next` to keep the store cursor in sync with the
   ledger order
7. Emit any docking events (health, telemetry, retention) tied to this commit so
   downstream listeners can react before the next render frame
8. Return the canonical snapshot so callers can read a fresh ledger/focus/timer
   bundle without another read cycle

---

## ALGORITHM: `restart_session_clear_or_boundary()`

Policy must match runtime_engine.

Option A (clear):

* new session_id
* ledger=[]
* cursor=0
* clear focus/explanation
* reset timers

Option B (boundary):

* new session_id
* preserve ledger but insert a boundary marker event (call_type=code, label="SESSION_BOUNDARY") (?)
* cursor=0
* reset focus/explanation/timers

Mark the chosen policy in SYNC once decided.

---

## ALGORITHM: `append_realtime_event_and_update_focus_if_needed(event)` (deferred)

1. Append event
2. Decide focus update policy:

   * either focus latest event always
   * or focus only if user has not pinned focus
3. Apply retention policy
4. Done

---

## KEY DECISIONS

- Prefer append-only ledger growth within a session so exported logs always match
  the UI sequence even when renders lag or telemetry replays run later.
- Keep the store as the single writer of focus and timer state so renderers cannot
  race to override each other when the runtime_engine adjusts the stepper.
- Emit health and telemetry docking events after the commit finishes so those
  modules see a settled snapshot rather than an intermediate state.
- Lock cursor updates into the commit so transitions between releases never need
  extra repaint synchronization.
- Let the retention policy remain configurable (max entries vs time window) in
  SYNC notes so runtime_engine can decide without touching the algorithm.
- Signal the manual `pnpm connectome:health state_store` harness and telemetry
  exports that this document series now describes the exact commit path they must
  validate so future agents can trace the green-check verification back to this
  section.

## DATA FLOW

- `runtime_engine` dispatches a release object; the store applies the commit and
  relays the new snapshot to telemetry adapters and health checks.
- Realtime ingestion travels through `telemetry_adapter` → `event_model` →
  `append_realtime_event_and_update_focus_if_needed`, with retention trimming
  before focus updates when necessary.
- Export helpers read `ledger`, `current_explanation`, and `active_focus` to
  materialize logs that mirror the committed sequence.
- UI selectors rely on `active_focus`, `wait_progress`, `tick_display`, and
  `cursor` without writing back, trusting the store for focus/timer consistency.
- Health harness listeners tie into the docking events emitted after each
  commit so the manual `pnpm connectome:health state_store` check always reads a
  complete ledger/focus/timer bundle before asserting invariants.

## HELPER FUNCTIONS

- `infer_release_payload(release)` fills missing focus/explanation fields so the
  commit proceeds even with partial telemetry data.
- `apply_wait_timer_action(store, action)` converts `start`/`stop` semantics into
  `wait_progress` timestamp mutations that follow the store’s duration policy.
- `emit_store_snapshot_to_health(store)` dispatches docking events after the
  commit so health tooling can validate invariants before the next render tick.
- `serialize_ledger_export(store)` reuses the immutable `ledger` array to build
  JSONL/text outputs without reordering or filtering events.
- `notify_retention_policy(store)` checks eviction thresholds and trims `ledger`
  entries without mutating focus or explanation state prematurely.
- `log_commit_transition(store, release)` records the action identifiers used by
  telemetry and documentation exports so analysts can correlate commits with the
  stepper release that produced them.

## INTERACTIONS

- `runtime_engine` drives atomic releases and depends on this algorithm to finish
  commits before downstream renderers rerun.
- `telemetry_adapter` and `health` gateways consume the emitted snapshots to
  produce observability signals that synchronize with the ledger order.
- `flow_canvas`, `log_panel`, and `stepper` selectors read the store but never
  write so they stay aligned with canonical focus/timers.
- `mind` doc export utilities replay the immutable ledger produced here to keep
  documentation and replay tools consistent with releases.
- Connectome CLI helpers that snapshot the store expect these helper functions
  to keep serialization, export, and retention semantics predictable.
- The manual `pnpm connectome:health state_store` harness watches the docking
  events emitted after this algorithm’s commits so that health assertions only
  run against fully consistent ledgers and timer signals.

## ALGORITHM: wait progress computation (selector)

Given:

* started_at_ms
* now_ms
  Compute:
* elapsed_s = clamp((now-start)/1000, 0, 4.0)
* value_0_1 = elapsed_s / 4.0
* display = round(elapsed_s, 1)

Store does not “tick” this; a selector can compute on render, or a lightweight interval can update tick_display only (but must not release steps).

---

## COMPLEXITY

* append: O(1) per event
* export: O(n) over ledger
* retention: O(k) evictions (bounded)

---

## MARKERS

* [ ] Decide focus policy in realtime mode (auto-focus newest vs pinned).
* QUESTION: Should store include a “pinned_focus” that prevents realtime from overriding focus?
* IDEA: Provide a derived selector to produce “duration color class” for the log panel to avoid duplicating rules.

---

---
