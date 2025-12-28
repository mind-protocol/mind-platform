```

# log_panel — Algorithm: Rendering, Duration Coloring, Trigger Badges, and Export

STATUS: DRAFT
CREATED: 2025-12-20
VERIFIED: 2025-12-20 against ?
```

---

## CHAIN

```
PATTERNS:        ./PATTERNS_Connectome_Log_Panel_Unified_Explain_And_Copyable_Event_Ledger_View_Patterns.md
BEHAVIORS:       ./BEHAVIORS_Connectome_Log_Panel_Step_Clarity_And_Copyable_Audit_Trail_Effects.md
THIS:            ALGORITHM_Connectome_Log_Panel_Log_Rendering_Duration_Coloring_And_Export.md (you are here)
VALIDATION:      ./VALIDATION_Connectome_Log_Panel_Invariants_For_Truthful_Durations_And_Stable_Export.md
IMPLEMENTATION:  ./IMPLEMENTATION_Connectome_Log_Panel_Component_Structure_And_Serializer_Integration.md
HEALTH:          ./HEALTH_Connectome_Log_Panel_Runtime_Verification_Of_Log_Truth_And_Export_Integrity.md
SYNC:            ./SYNC_Connectome_Log_Panel_Sync_Current_State.md
```

---

## OVERVIEW

log_panel is a pure projection of the connectome runtime state_store ledger into a readable narrative ledger.
It derives a “Now” summary, the historical ledger rows, duration coloring/badge tokens, and exports that mirror the
immutable FlowEvent stream.

Inputs:

* `store.ledger` (`FlowEvent[]`)
* `store.current_explanation`
* `store.active_focus`
* `store.cursor` + optional `script_total`
* `store.health_badges`

Outputs:

* Now section content
* Ledger list UI
* Export actions

## OBJECTIVES AND BEHAVIORS

| Objective | Behaviors Supported | Why This Algorithm Matters |
|-----------|---------------------|----------------------------|
| Highlight the current execution step, explanation, and focus context so the operator never wonders what stage is running | Now section updates with the latest step counts, explanation sentence, and focus badges as soon as `cursor` moves | Keeping the active step visible builds trust in the history stream and quickly surfaces stalls |
| Render the ledger rows with concise badges, colored durations, and payload hints so every event's impact is readable | Ledger rows show trigger/call badges, duration fields, rate hints, payload summaries, and hover tooltips that describe each event even when compressed | Consistent ledger rendering prevents misatttributing cause/effect and surfaces energy/latency issues |
| Produce a faithful export of each ledger event so downstream audit or debugging workflows never miss a detail | Copy/export buttons generate JSONL and plain-text records derived solely from the ledger, honoring timestamps, triggers, call types, and durations | Durable exports make the UI provably reproducible and support offline investigation without replaying the live graph |

## DATA STRUCTURES

### `LogPanelRenderState`

```
{
  ledger: FlowEvent[]                     // immutable history of steps
  current_explanation: ExplanationNode    // sentence + metadata supplied by the engine
  active_focus: { from, to, label }       // derived focus window for badges
  cursor: number                          // index of the currently visible step
  script_total?: number                   // optional runtime script length
  health_badges: BadgeToken[]             // badges emitted by health concerns
}
```

### `LedgerRowPayload`

```
{
  timestamp: number                        // event timestamp (ms)
  trigger: string                          // origin of the event (direct, stream, async, etc.)
  call_type: string                        // how the runtime processed the event
  duration_ms?: number                     // measured duration; undefined if missing
  label: string                            // human-readable label
  payload_summary?: string                 // condensed payload description
  rate_hint?: string                       // cadence or frequency note
  notes?: string                           // manual note or fallbacks
  focus?: string                           // derived focus reference
}
```

This data modeling keeps the `render_log_panel` pipeline aligned with FlowEvent fields so rendering, badges, and exports reuse consistent terminology.

## ALGORITHM: `render_log_panel(store_state)`

### Step 1: Snapshot and normalize inputs

Capture the ledger slice, explanation sentence, focus, cursor, and optional `script_total`. Build derived
values such as `step_index`, `step_total`, and `duration_thresholds` so downstream rendering can read static
values instead of recomputing them per row.

```
step_index = min(store.cursor, ledger.length)
step_total = store.script_total ?? ledger.length
current_event = ledger[step_index - 1] ?? null
threshold_colors = duration_color_class_map()
```

### Step 2: Render the Now section

Use `render_now_section` to surface the step count, explanation sentence (falling back to `current_event` metadata),
and focus badges. Include the focus summary’s “from → to : label” string, and append any health badges tied to the
active step.

### Step 3: Render the ledger list

For each FlowEvent in the ledger, call `render_ledger_list` so each row prints timestamps, badges, duration text, the
payload summary, rate hints, and notes. Persist the derived color class from `duration_color_class` and guard missing
durations by using muted/placeholder styling.

### Step 4: Wire up export actions

Swap the ledger entries into two serialized outputs: stable JSONL (including optional session headers) and plain
text lines that mirror what appears in the UI. The export helpers must only read `store.ledger`.


## KEY DECISIONS

### D1: Duration coloring thresholds

```
IF duration_ms is undefined:
    render muted duration text / badge
ELSE IF duration_ms < 1000:
    use blue badge (ms-driven override)
ELSE IF duration_ms < 2000:
    yellow-orange gradient badge
ELSE IF duration_ms < 3000:
    orange badge with urgency accent
ELSE:
    red badge to signal escalation
```

The thresholds come from the palette spec and keep the 1s “green” spirit while honoring the user request for ms-level blue bars.

### D2: Ledger-driven exports

```
Export = ledger.map(serializeRow)
IF session metadata available:
    prepend session record header
```

Exports must never reference UI-only state such as hover hints or buttons in order to produce deterministic output for audit consumers.

### D3: Focus summary narrative

```
IF active_focus exists:
    summary = `Active: ${from} → ${to} : ${label}`
ELSE:
    summary = `Active: ?`
```

The focus string helps operators read the in-flight event chain without hunting through the graph panel.

## DATA FLOW

```
state_store (FlowEvent ledger + explanation + focus + badges)
    ↓ render_now_section, render_ledger_list helpers
ConnectomeLogPanel UI (Now row + ledger list + export buttons)
    ↓ user interactions trigger severity badges, export helpers
Export serializers (JSONL, Text) ← ledger array
```

## COMPLEXITY

**Time:** O(N) where N = `store.ledger.length`, because rendering the Now section and ledger rows (and the export serializers) each iterate once over the ledger.

**Space:** O(N) for the serialized export buffers and derived badge arrays, plus a small constant for the “Now” section metadata.

**Bottlenecks:**
- Rendering very large ledgers can hurt paint performance, so the panel relies on virtualization or pagination from the host UI.
- Exporting gigabytes of ledger data can stall if the serializer buffers are not chunked; memory pressure is mitigated by streaming the JSONL copy.
- Badge rendering and focus summaries are constant-time, but deriving payload summaries can become expensive if payloads are deeply nested, so they are cached or trimmed.

## HELPER FUNCTIONS

### `format_duration_text(duration_ms)`

**Purpose:** Turn raw duration values into human-friendly strings for the ledger and export text.

**Logic:** If `undefined`, return “?”. If less than 1,000, format as `"{ms}ms"`. Otherwise, return seconds with two decimals.

### `duration_color_class(duration_ms)`

**Purpose:** Map durations to palette-aware severity classes used by both badges and export annotations.

**Logic:** Apply the threshold table from D1 while honoring the user preference that sub-second durations render blue instead of green.

### `collect_export_records(ledger)`

**Purpose:** Serialize ledger rows into JSONL and plain-text payloads so copy buttons can stream or drop them into the clipboard.

**Logic:** Iterate the ledger, include optional session metadata, and emit strings that match the ledger UI formatting.

### `render_badges(event)`

**Purpose:** Derive the trigger and call_type badge colors referenced by the ledger rows.

**Logic:** Look up the deterministic palette for trigger/call_type combos and add a fallback for unknown values.

## INTERACTIONS

| Module | What We Call | What We Get |
|--------|--------------|-------------|
| `app/connectome/components/unified_now_and_copyable_ledger_log_panel.tsx` | `render_now_section`, `render_ledger_list` | UI-ready rows and badges that mirror the ledger |
| `app/connectome/connectome.css` | CSS variables for duration colors and badge palettes | Consistent visual treatment for trigger/call badges and duration colors |
| `app/connectome/components/connectome_log_export_buttons_using_state_store_serializers.tsx` | `collect_export_records` | JSONL and textual blower exports that only read `store.ledger` |
| `state_store` | selectors like `logPanelStore.getState()` | Ledger array, explanation, focus, cursor, badges that feed the algorithm |
| `app/api/connectome/graph/route.ts` | `loadGraphForActiveLog` (indirect) | Graph data that drives the FlowEvent stream the ledger represents |


---



## ALGORITHM: `render_now_section(store_state)`

1. Determine step index:

* step_index = store.cursor (or ledger length)
* step_total = runtime_engine script total if known else `?`

2. Determine current event:

* current_event = last element of ledger OR null

3. Render:

* Step label: “Step X of Y” (if Y known) else “Step X”
* Explanation sentence:

  * store.current_explanation.sentence
  * if missing: derive from current_event label/from/to else “?”

4. Render focus summary:

* “Active: from → to : label”
* badges for trigger + call_type

---

## ALGORITHM: `render_ledger_list(store_state)`

For each event e in ledger:

* render header row:

  * timestamp (or at_ms formatted)
  * trigger badge (colored)
  * call_type badge (colored)
  * duration field (colored by thresholds)
* render body:

  * label text (not bold)
  * payload_summary (if present)
  * rate_hint (if present)
  * notes (if “?”)

---

## ALGORITHM: duration formatting and coloring

### `format_duration_text(duration_ms)`

* if undefined: return “?”
* if <1000: return `${ms}ms`
* else: return `${(ms/1000).toFixed(2)}s`

### `duration_color_class(duration_ms)`

User rules:

```
IF duration_ms is undefined:
class = muted
ELSE IF duration_ms < 1000:
class = blue
ELSE IF duration_ms < 2000:
class = yellow
ELSE IF duration_ms < 3000:
class = orange
ELSE:
class = red
AND:
NOTE: <1s is “green” by severity, but user explicitly wants ms in blue.
Therefore:
duration_ms < 1000 => blue (unit-driven override)
```

Trigger badge colors (deterministic palette):

```
direct => blue-ish badge
stream => cyan-ish badge
async  => purple-ish badge
hook   => grey/teal badge (?)
timer  => grey/orange badge (?)
```

---

## ALGORITHM: export

### Export JSONL

* one JSON object per line
* includes session_id header line optionally:

  * `{"type":"session","session_id":"...","started_at_ms":...}`
* then events in order

### Export Text

* stable human-friendly lines:

  * `[tstamp] [trigger] [call_type] [duration] from→to label — payload_summary — rate_hint — notes`

Export must be derived from ledger only (no UI-only state).

---

## MARKERS

* QUESTION: Should export include cursor and speed changes as synthetic events? (nice-to-have; possibly represented as call_type=code)

---
