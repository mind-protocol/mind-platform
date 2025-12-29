# Repository Map: mind-platform/app

*Generated: 2025-12-29 02:13*

## Statistics

- **Files:** 10
- **Directories:** 21
- **Total Size:** 62.7K
- **Doc Files:** 0
- **Code Files:** 10
- **Areas:** 6 (docs/ subfolders)
- **Modules:** 16 (subfolders in areas)
- **DOCS Links:** 2 (0.2 avg per code file)

### By Language

- typescript: 7
- tsx: 2
- css: 1

## File Tree

```
├── (dashboard)/ (244)
│   ├── citizen/ (62)
│   │   └── (..1 more files)
│   ├── membrane/ (63)
│   │   └── (..1 more files)
│   ├── org/ (58)
│   │   └── (..1 more files)
│   └── wallet/ (61)
│       └── (..1 more files)
├── (public)/ (348)
│   ├── docs/
│   │   └── (..1 more files)
│   ├── registry/ (63)
│   │   └── (..1 more files)
│   ├── schema/ (61)
│   │   └── (..1 more files)
│   ├── templates/ (64)
│   │   └── (..1 more files)
│   └── (..1 more files)
├── api/ (4.9K)
│   ├── connectome/ (3.3K)
│   │   ├── graph/ (903)
│   │   │   └── route.ts (903)
│   │   ├── graphs/ (702)
│   │   │   └── route.ts (702)
│   │   ├── search/ (1.2K)
│   │   │   └── route.ts (1.2K)
│   │   └── tick/ (429)
│   │       └── (..1 more files)
│   └── sse/ (1.6K)
│       └── route.ts (1.6K)
└── connectome/ (58.5K)
    ├── components/ (35.3K)
    │   ├── connectome_page_shell_route_layout_and_control_surface.tsx (13.8K) →
    │   └── pannable_zoomable_zoned_flow_canvas_renderer.tsx (21.5K) →
    ├── lib/ (16.6K)
    │   ├── connectome_system_map_node_edge_manifest.ts (3.6K)
    │   ├── next_step_gate_and_realtime_playback_runtime_engine.ts (3.1K)
    │   └── zustand_connectome_state_store_with_atomic_commit_actions.ts (10.0K)
    ├── connectome.css (6.3K)
    └── (..1 more files)
```

## File Details

### `api/connectome/graph/route.ts`

**Definitions:**
- `GET()`

### `api/connectome/graphs/route.ts`

**Definitions:**
- `GET()`

### `api/connectome/search/route.ts`

**Definitions:**
- `GET()`

### `api/sse/route.ts`

**Definitions:**
- `GET()`

### `connectome/components/connectome_page_shell_route_layout_and_control_surface.tsx`

**Docs:** `docs/connectome/page_shell/PATTERNS_Connectome_Page_Shell_Route_Composition_And_User_Control_Surface_Patterns.md`

**Definitions:**
- `connect()`
- `loadGraphs()`
- `loadGraph()`
- `runTick()`
- `handleNext()`
- `handleRestart()`
- `handleSpeedChange()`
- `handleModeChange()`
- `handleSearch()`
- `nodeIds()`
- `edgeIds()`

### `connectome/components/pannable_zoomable_zoned_flow_canvas_renderer.tsx`

**Docs:** `docs/connectome/flow_canvas/PATTERNS_Connectome_Flow_Canvas_Pannable_Zoomable_Zoned_System_Map_Rendering_Patterns.md`

**Definitions:**
- `mapLabelToNodeType()`
- `CanvasInner()`
- `from()`
- `to()`
- `from()`
- `to()`
- `linkType()`
- `initFit()`
- `cx()`
- `cy()`
- `cx()`
- `cy()`
- `sx()`
- `sy()`
- `tx()`
- `ty()`
- `sx()`
- `sy()`
- `radius()`
- `sx()`
- `sy()`
- `handleWheel()`
- `handleMouseDown()`
- `handleMouseMove()`
- `worldX()`
- `worldY()`
- `handleMouseUp()`
- `handleClick()`
- `cx()`
- `cy()`
- `cx()`
- `cy()`

### `connectome/lib/connectome_system_map_node_edge_manifest.ts`

**Definitions:**
- `getEnergyBucket()`
- `formatEnergy()`

### `connectome/lib/next_step_gate_and_realtime_playback_runtime_engine.ts`

**Definitions:**
- `initialize_connectome_runtime()`
- `dispatch_runtime_command()`
- `releaseNextStep()`
- `release_next_step()`

### `connectome/lib/zustand_connectome_state_store_with_atomic_commit_actions.ts`

**Definitions:**
- `generateSessionId()`
- `speedToMs()`
- `extractFocusFromEvent()`
- `extractExplanationFromEvent()`
