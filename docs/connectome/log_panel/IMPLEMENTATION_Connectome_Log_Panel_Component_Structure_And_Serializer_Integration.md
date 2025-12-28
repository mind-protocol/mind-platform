```

# log_panel — Implementation: Component Structure and Serializer Integration

STATUS: DRAFT
CREATED: 2025-12-20
```

---

## CHAIN

```
PATTERNS:        ./PATTERNS_Connectome_Log_Panel_Unified_Explain_And_Copyable_Event_Ledger_View_Patterns.md
BEHAVIORS:       ./BEHAVIORS_Connectome_Log_Panel_Step_Clarity_And_Copyable_Audit_Trail_Effects.md
ALGORITHM:       ./ALGORITHM_Connectome_Log_Panel_Log_Rendering_Duration_Coloring_And_Export.md
VALIDATION:      ./VALIDATION_Connectome_Log_Panel_Invariants_For_Truthful_Durations_And_Stable_Export.md
THIS:            IMPLEMENTATION_Connectome_Log_Panel_Component_Structure_And_Serializer_Integration.md
HEALTH:          ./HEALTH_Connectome_Log_Panel_Runtime_Verification_Of_Log_Truth_And_Export_Integrity.md
SYNC:            ./SYNC_Connectome_Log_Panel_Sync_Current_State.md

IMPL:            app/connectome/components/unified_now_and_copyable_ledger_log_panel.tsx
IMPL:            app/connectome/components/connectome_log_duration_formatting_and_threshold_color_rules.ts
IMPL:            app/connectome/components/connectome_log_trigger_and_calltype_badge_color_tokens.ts
IMPL:            app/connectome/components/connectome_log_export_buttons_using_state_store_serializers.tsx
```

---

## DESIGN PATTERNS

The implementation strictly follows the unified "Now + Ledger" pattern from the PATTERNS doc: a single panel surfaces the current explanation, focus information, ledger rows, and a shared export area derived from the canonical store. Duration color rules, trigger badges, copy buttons, and ledger calculus are all rendered from the same state, which prevents bidirectional drift between narrative and audit report. This single-surface discipline also keeps downstream tooling (badges, exporter, search hooks) consistent with the overarching ledger story.

That discipline guarantees that copy actions, badge colors, and ledger ordering never rely on shadow caches—everything the user sees is derived from the store so updates stay coherent and deterministic.

ExportButtons, duration helpers, and badge color tokens all reference the same selectors so the pattern stays declarative; none of those modules maintain their own copy of the ledger or retry logic, which keeps the panel from diverging from the store’s agreed-upon flow event list.

## SCHEMA

Each row renders a normalized `FlowEvent` from `flow_event_schema_and_normalization_contract`, so the implementation consumes the same shape used by the telemetry pipeline: `id`, `at_ms`/`timestamp`, `from_node_id`, `to_node_id`, `label`, `trigger`, `call_type`, `duration_ms`, `payload_summary`, `notes`, and the optional `session_id` boundary recorded by the store serializer. Duration coloring, badges, hover detail text, and export serializers all trust these fields, meaning schema drift would show up immediately in the log export buttons or in the color tokens module. If the schema gains new badges, this file just plumbs them into the badge palette helpers and ledger rows.

The export serializers can annotate those badges without changing the LogPanel layout because the schema shape stays stable.

Because the schema includes `session_id`, `serialize_ledger_to_jsonl` can emit session boundaries inside the copy payload, which makes the export faithful to the same events shown on-screen.

## DATA FLOW AND DOCKING (FLOW-BY-FLOW)

1. The runtime engine commits a `FlowEvent` via `commit_step_release_append_event_and_set_focus_and_explanation`, which appends to `state_store.ledger`, updates `cursor`, and refreshes `active_focus`/`current_explanation` in a single transaction.
2. `LogPanel` subscribes to the ledger, cursor, explanation, health badges, and focus via `useConnectomeStore`, then renders the "Now" section, ledger rows, and badges, applying `duration_class()`, `trigger_badge_class()`, and `call_type_badge_class()` before painting each row.
3. Export buttons pull the ledger plus `session_id` from the same store slice and call `serialize_ledger_to_jsonl` and `serialize_ledger_to_text`, ensuring exported sequences preserve the exact order and fields shown in the ledger.
4. Search and graph loader `useEffect` hooks fetch data from `/api/connectome/graphs`, `/api/connectome/graph`, and `/api/connectome/search` while handling cancellation flags, then push nodes and edges back into the store (`reveal_node_and_edge_ids`, `set_search_results`), making the ledger panel aware of graph context without duplicating storage.

This flow is bidirectionally docked to the store: when the runtime publishes a step release it immediately becomes visible here, and when the search hooks reveal nodes they write back to the store to stay consistent with the investor-paint life cycle.

Because each numbered step feeds directly into the next, debugging time stays low: a missing event is visible in the store, the rendered ledger row, and the export output all at once so the trace from runtime to copy exists in one place.

## LOGIC CHAINS

The ledger "logic chain" begins with a step release payload from the stepper runtime, passes through the normalized FlowEvent schema, lands in the store, and is read by this panel exactly once per render. Copy actions reuse the same ledger slice, so when `ExportButtons.handleCopyJsonl`/`handleCopyText` run they are logically downstream of every event that already updated the ledger. Search triggers, graph reveals, and `setSearchStatus` updates represent adjacent chains but still rely on the same `useConnectomeStore` selectors, so a single source of truth governs the entire component.

That direct mapping also means auditors can trace a ledger row back to the original commit payload for post-mortem review or trust checks.

The search `handleSearch` path is part of this chain: it writes search results and reveal calls into the store before re-rendering the ledger header, which keeps the ledger and graph selector align.

## MODULE DEPENDENCIES

| Module | Why |
| ------ | --- |
| `state_store` | Source of ledger rows, explanation, cursor, focus, search results, graph metadata, and session boundaries. |
| `event_model` | Normalizes raw events into `FlowEvent` so the panel, palette helpers, and exporters all agree on field names and defaults. |
| `runtime_engine` | Drives the `commit_step_release_*` action that pushes every FlowEvent into the ledger before this panel renders it. |
| `lib/connectome_export_jsonl_and_text_log_serializer` | Provides stable JSONL/text export APIs that include session headers, ledger order, and mandatory fields. |
| `connectome_health_panel` (adjacent) | Renders health badges right next to the ledger and stays synchronized via the same health state slices. |
| `/api/connectome/*` routes | Supply graph/search data for the auxiliary search controls and graph selector shown above the ledger. |
| `CONNECTOME_NODE_MAP` | Provides human-friendly node titles and classification tokens for each ledger row so the ledger references the same manifest that powers the canvas.

## STATE MANAGEMENT

`LogPanel` never owns mutable state beyond its local search controls (`query`, `threshold`, `hops`, `searchStatus`), instead subscribing to store slices for ledger, cursor, script total, explanation, focus, health, graph name, available graphs, and search results. Selectors sourced from `useConnectomeStore` guarantee the panel re-renders only when those pieces change, while `setSearchResults`, `setGraphName`, `setAvailableGraphs`, and `reveal_node_and_edge_ids` keep derived metadata synchronized with remote fetches. Export buttons read the same ledger reference so copy actions stay atomic with the displayed list, and the serializer functions rely on the store-provided `session_id` to tag `jsonl`/text payloads with consistent session boundaries.

Because the undo-ready store actions operate in a single state commit, the panel can call `useConnectomeStore` multiple times per render without creating race conditions; each selector invocation reads the current ledger snapshot rather than mutating it.

## RUNTIME BEHAVIOR

On mount, the panel eagerly loads `/api/connectome/graphs` and schedules a full graph load of the selected graph, storing the results via the shared store actions before rendering them. The ledger updates whenever the runtime engine commits a step: `cursor`, `current_explanation`, `active_focus`, and duration badges all refresh in lock-step because they derive from the same step release payload. Search operations update `searchStatus`, reveal matching nodes/edges, and refresh the search result cards without touching the ledger, but the search input bar and threshold/hops sliders remain enabled so the user can iterate while the ledger continues to append.

Tooltip text, node labels, and `"Step X of Y"` semantics all refresh in the same render cycle because they derive from `cursor`, `scriptTotal`, and the ledger slice, so the panel never lags behind the stepper’s explanation.

## CONCURRENCY MODEL

All network-bound logic (`/graphs`, `/graph`, `/search`, clipboard writes) handles cancellation safely: each `useEffect` sets a `cancelled` flag and aborts state writes if the component unmounts or the graph name changes before the fetch completes. `handleCopyJsonl` and `handleCopyText` return promises to the clipboard API so multiple clicks await the same clipboard hook, while `setSearchStatus` updates guard against racing responses by resetting status for each request. Ledger writes arrive from the runtime in a single atomic store action, so there is no multi-threaded mutation inside the panel itself—the concurrency surface occurs only across the asynchronous fetches and clipboard writes that intentionally debounce on `cancelled`.

Because asynchronous fetches write directly back into the shared store rather than local state, there is no shared mutable state between the search hooks and the panel rendering, so cancellation flags only need to guard the fetches themselves.

---

## CODE STRUCTURE

```
app/connectome/components/unified_now_and_copyable_ledger_log_panel.tsx
app/connectome/components/connectome_log_duration_formatting_and_threshold_color_rules.ts
app/connectome/components/connectome_log_trigger_and_calltype_badge_color_tokens.ts
app/connectome/components/connectome_log_export_buttons_using_state_store_serializers.tsx
```

### File Responsibilities

| File                                                              | Responsibility              | Key Exports                               |
| ----------------------------------------------------------------- | --------------------------- | ----------------------------------------- |
| `app/connectome/components/unified_now_and_copyable_ledger_log_panel.tsx`                  | main panel UI               | `LogPanel`                                |
| `app/connectome/components/connectome_log_duration_formatting_and_threshold_color_rules.ts` | duration text + color class | `formatDuration`, `durationColorClass`    |
| `app/connectome/components/connectome_log_trigger_and_calltype_badge_color_tokens.ts`       | badge palettes              | `triggerBadgeClass`, `callTypeBadgeClass` |
| `app/connectome/components/connectome_log_export_buttons_using_state_store_serializers.tsx` | copy/export actions         | `ExportButtons`                           |

---

## ENTRY POINTS

| Entry                       | Trigger                 |
| --------------------------- | ----------------------- |
| `LogPanel()`                | /connectome page render |
| `ExportButtons.copyJsonl()` | copy JSONL              |
| `ExportButtons.copyText()`  | copy text               |

---

## DATA FLOW

```
state_store selectors
→ LogPanel renders Now and Ledger
→ ExportButtons serializes ledger and copies to clipboard
```

---

## CONFIGURATION

| Config                     | Default                  |
| -------------------------- | ------------------------ |
| `SHOW_RAW_PAYLOAD`         | false                    |
| `MAX_LOG_ENTRIES_RENDERED` | ? (depends on retention) |

---

## BIDIRECTIONAL LINKS

* TSX components reference docs/connectome/log_panel/*
* serialization utilities reference state_store serializer docs

---

## MARKERS

* [ ] Decide whether “Copy log” copies JSONL by default or offers both (recommend: both buttons).
