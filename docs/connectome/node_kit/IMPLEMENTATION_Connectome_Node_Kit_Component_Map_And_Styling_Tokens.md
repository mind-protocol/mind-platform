```

# node_kit — Implementation: Component Map and Styling Tokens

STATUS: DRAFT
CREATED: 2025-12-20
```

---

## CHAIN

```
PATTERNS:        ./PATTERNS_Connectome_Node_Kit_Typed_Language_Coded_Energy_Aware_Node_Rendering_Patterns.md
BEHAVIORS:       ./BEHAVIORS_Connectome_Node_Kit_Visible_Clarity_And_Trust_Effects.md
ALGORITHM:       ./ALGORITHM_Connectome_Node_Kit_Node_Rendering_Spec_And_Energy_Glow_Mapping.md
VALIDATION:      ./VALIDATION_Connectome_Node_Kit_Invariants_For_Node_Readability_And_State_Reflection.md
THIS:            IMPLEMENTATION_Connectome_Node_Kit_Component_Map_And_Styling_Tokens.md
HEALTH:          ./HEALTH_Connectome_Node_Kit_Runtime_Verification_Of_Node_State_And_Visual_Signal_Truth.md
SYNC:            ./SYNC_Connectome_Node_Kit_Sync_Current_State.md

IMPL:            app/connectome/components/node_kit/typed_connectome_node_components_with_energy_and_step_highlighting.tsx
IMPL:            app/connectome/components/node_kit/connectome_node_frame_with_title_path_and_tooltip_shell.tsx
IMPL:            app/connectome/components/node_kit/connectome_energy_badge_bucketed_glow_and_value_formatter.tsx
IMPL:            app/connectome/components/node_kit/connectome_player_wait_progress_bar_with_four_second_cap.tsx
IMPL:            app/connectome/components/node_kit/connectome_tick_cron_circular_progress_ring_with_speed_label.tsx
IMPL:            app/connectome/components/node_kit/connectome_node_background_theme_tokens_by_type_and_language.ts
IMPL:            app/connectome/components/node_kit/connectome_node_step_list_and_active_step_highlighter.tsx
```

---

## CODE STRUCTURE

```
app/connectome/components/node_kit/typed_connectome_node_components_with_energy_and_step_highlighting.tsx
app/connectome/components/node_kit/connectome_node_frame_with_title_path_and_tooltip_shell.tsx
app/connectome/components/node_kit/connectome_energy_badge_bucketed_glow_and_value_formatter.tsx
app/connectome/components/node_kit/connectome_player_wait_progress_bar_with_four_second_cap.tsx
app/connectome/components/node_kit/connectome_tick_cron_circular_progress_ring_with_speed_label.tsx
app/connectome/components/node_kit/connectome_node_background_theme_tokens_by_type_and_language.ts
app/connectome/components/node_kit/connectome_node_step_list_and_active_step_highlighter.tsx
```

### File Responsibilities

| File                                                                     | Responsibility                                         | Key Exports                                                                                         |
| ------------------------------------------------------------------------ | ------------------------------------------------------ | --------------------------------------------------------------------------------------------------- |
| `app/connectome/components/node_kit/typed_connectome_node_components_with_energy_and_step_highlighting.tsx` | exports node variants used by flow_canvas              | `PlayerNode`, `UiNode`, `ModuleNode`, `GraphQueriesNode`, `MomentNode`, `AgentNode`, `TickCronNode` |
| `app/connectome/components/node_kit/connectome_node_frame_with_title_path_and_tooltip_shell.tsx`           | shared rounded frame (“more circled”) + tooltip anchor | `NodeFrame`                                                                                         |
| `app/connectome/components/node_kit/connectome_energy_badge_bucketed_glow_and_value_formatter.tsx`         | energy value display + deterministic glow mapping      | `EnergyBadge`                                                                                       |
| `app/connectome/components/node_kit/connectome_player_wait_progress_bar_with_four_second_cap.tsx`          | wait progress bar widget                               | `PlayerWaitProgressBar`                                                                             |
| `app/connectome/components/node_kit/connectome_tick_cron_circular_progress_ring_with_speed_label.tsx`      | tick cron ring widget                                  | `TickCronRing`                                                                                      |
| `app/connectome/components/node_kit/connectome_node_background_theme_tokens_by_type_and_language.ts`       | token tables for background + title colors             | `theme_for_node`, `title_color_for_node`                                                            |
| `app/connectome/components/node_kit/connectome_node_step_list_and_active_step_highlighter.tsx`             | renders steps list + active highlight                  | `StepList`                                                                                          |

---

## DESIGN PATTERNS

Follows the typed language-coded, energy-aware node rendering patterns captured in `docs/connectome/node_kit/PATTERNS_Connectome_Node_Kit_Typed_Language_Coded_Energy_Aware_Node_Rendering_Patterns.md`. Every node variant reuses the shared `NodeFrame`, deterministic energy badge, and step highlight widgets so the clarity and trust guarantees described there stay aligned with the current ecological gothic styling tokens.
The pattern keeps tooltip composition, step highlights, and motion tokens isolated in their own helpers so that the frame can focus on docking, handles, and NodeFlow semantics without leaking details into each entry point.

## SCHEMA

Nodes consume `ConnectomeNodeDefinition` shapes (see [Connectome Graph Manifest](../runtime_mind/IMPLEMENTATION_Connectome_Runtime_Engine_Code_Structure_And_Control_Surface.md)) which bundle `node_id`, `zone_id`, `node_type`, `language`, `title`, optional `file_path`, `steps`, and `energy_value`. The `steps` list contains `{ step_key, label, call_type }` entries used by the `StepList`, while the ledger of normalized `FlowEvent` rows from the `event_model` module (see [IMPLEMENTATION_Connectome_Event_Model_Code_Architecture_And_Schema.md](../event_model/IMPLEMENTATION_Connectome_Event_Model_Code_Architecture_And_Schema.md)) feeds the tooltip updater. Each node also reads `render_hint` metadata (compact, show_path, show_steps) when present so that story-specific renderers can opt in or out of badges, paths, and step lists without changing the schema.

## LOGIC CHAINS

1. Runtime scripts invoke `dispatch_runtime_command`/`release_next_step` in the [Runtime Engine](../runtime_mind/IMPLEMENTATION_Connectome_Runtime_Engine_Code_Structure_And_Control_Surface.md), which normalizes `FlowEvent`s, updates `useConnectomeStore`, and flips `active_focus` so the node kit can highlight the current node and step.
2. Player node clicks call `dispatch_runtime_command({ kind: "player_message" })`, causing the runtime engine to append a ledger event, start the wait timer, and push the new focus so the progress bar and energy badge animate truthfully.
3. Ledger and focus updates propagate to every node via subscriptions to `useConnectomeStore`, keeping the energy palette, tooltip text, and active step highlight consistent with the latest flow events.
4. Tick updates come from `tick_display` mutations in the store; each `TickCronRing` watches the nominal interval and speed label so the circle animation resets on speed or pause changes.

## MODULE DEPENDENCIES

Depends on the [Runtime Engine](../runtime_mind/IMPLEMENTATION_Connectome_Runtime_Engine_Code_Structure_And_Control_Surface.md), the `event_model` module for ledger normalization, the [State Store](../state_store/IMPLEMENTATION_Connectome_State_Store_Code_Structure_And_Zustand_Actions.md), and the theme token map in `connectome_node_background_theme_tokens_by_type_and_language.ts`. The node kit exports are wired into the canvas in `docs/connectome/flow_canvas/IMPLEMENTATION_Connectome_Flow_Canvas_Code_Structure_With_React_Flow_And_Zones.md`.
It also depends on `NodeFrame` for docking and tooltip injection, `EnergyBadge` for bucketed glows, and `StepList` for per-node step rendering.

## STATE MANAGEMENT

Rendering paths draw from `useConnectomeStore`: `active_focus` drives glow classes, `ledger` builds tooltips, `wait_progress` powers the player wait bar, `tick_display` drives the cron ring, and `revealed_node_ids`/`edges` determine what nodes are even minted. The node kit never writes to state—it purely consumes the deterministic projection emitted by the runtime store and relegates all mutations to the runtime engine actions.
Health badges and search results exist in the same store but stay isolated from the node kit until the canvas opens them, keeping this implementation focused on the current run while other panels consume the broader telemetry.

## RUNTIME BEHAVIOR

Nodes show an `EnergyBadge` whenever `energy_value` exists, render `StepList` entries when `steps` are present, obey `render_hint` overrides such as `show_steps`/`show_wait`/`show_tick`, and apply language- and call-type-aware title colors to maintain the trust gestures expected by the visual style guide. Player nodes inject the capped four-second wait progress bar while TickCron nodes spin the ring using the provided `tick_display` signal.
The energy badge glow adjusts deterministically through `connectome_energy_badge_bucketed_glow_and_value_formatter.ts`, and `StepList` highlights the active step by comparing the `active_focus.active_step_key` in the store with each `step_key` entry.

## CONCURRENCY MODEL

Each component is `"use client"` to keep React running in the browser thread so it can subscribe to Zustand and manage timer effects. The wait/tick widgets install `window.setInterval` observers and tear them down through `useEffect`, which lets the progress indicators stay synced while the rest of the canvas re-renders via the React event loop. Store updates are memoized with `useMemo`, so even when the ledger appends multiple events quickly, the highlight, badge, and tooltip remain deterministic.
Actions from `dispatch_runtime_command` batch updates through the store before React renders, so popup tooltips and badges never flicker even when `release_next_step` pushes several ledger entries in the same render frame.

## STYLING TOKENS (V1)

### Node background categories

* Player: distinct warm tint (not yellow moment tint)
* UI: cool neutral tint
* Module TS: blue tint
* Module PY: purple tint
* GraphQueries: purple tint (distinct from PY by accent ?)
* Moment: yellow tint
* Agent: green tint
* TickCron: speed-coded tint

### Energy mapping tokens

* grey bucket: low energy
* blue bucket: medium-low
* orange bucket: medium-high
* yellow bucket: high energy

---

## ENTRY POINTS

| Entry Point                           | Used By               |
| ------------------------------------- | --------------------- |
| `PlayerNode`                          | flow_canvas           |
| `ModuleNode`                          | flow_canvas           |
| `AgentNode` (Narrator, World Builder) | flow_canvas           |
| `EnergyBadge`                         | all nodes with energy |
| `StepList`                            | nodes with steps list |

---

## DATA FLOW AND DOCKING

Node kit only consumes selectors from `useConnectomeStore`; it never mutates the runtime store.

### Flow-by-flow
- `next_step` releases from the [Runtime Engine](../runtime_mind/IMPLEMENTATION_Connectome_Runtime_Engine_Code_Structure_And_Control_Surface.md) normalize `FlowEvent` data, update the ledger/focus state, and trigger the node kit to repaint the active node plus badge values.
- Player interactions dispatch runtime commands, bump the ledger, start/stop the wait timer, and cause `PlayerWaitProgressBar` plus the energy badge to reflect the latest seconds and bucketed energy.
- Ledger replays and focus updates drive the tooltip builder, step-list highlight, and tick ring animation through memoized selectors, keeping the UI physics congruent with the runtime story.

### Docking
- React Flow handles injected via `NodeFrame` make sure each node docks cleanly with incoming and outgoing edges so the layout never leaks mouse events.
- Health automation (`pnpm connectome:health node_kit`) probes DOM snapshots of the frame, badge, and timers, so no additional docking anchors are required beyond the handles in `NodeFrame`.

```
flow:
name: node_kit_renders_store_projection
steps:
- flow_canvas passes view model + active focus
- node_kit renders deterministic visuals and widgets
docking_points:
- none required (HEALTH probes DOM/test harness)
```

---

## CONFIGURATION

| Config                     | Default                  |
| -------------------------- | ------------------------ |
| `ENERGY_BUCKET_THRESHOLDS` | [0.10, 0.30, 0.60]       |
| `WAIT_MAX_SECONDS`         | 4.0                      |
| `TITLE_PROMINENCE`         | enforced by style tokens |

---

## BIDIRECTIONAL LINKS

* each node_kit TSX should reference docs/connectome/node_kit/*
* update SYNC when energy threshold tokens change

---

## MARKERS

* [ ] Decide whether GraphQueries node should be a ModuleNode with call_type=graphQuery styling, or a separate node type (currently separate for clarity).
* QUESTION: Do we display both “language” and “call_type” badges, or only one?
