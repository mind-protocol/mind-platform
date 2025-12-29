# Repository Map: mind-platform/app

*Generated: 2025-12-29 03:12*

## Statistics

- **Files:** 20
- **Directories:** 24
- **Total Size:** 76.3K
- **Doc Files:** 0
- **Code Files:** 20
- **Areas:** 8 (docs/ subfolders)
- **Modules:** 16 (subfolders in areas)
- **DOCS Links:** 3 (0.15 avg per code file)

### By Language

- tsx: 11
- typescript: 8
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
├── (public)/ (12.9K)
│   ├── components/ (12.2K)
│   │   └── landing/ (12.2K)
│   │       ├── ActionCard.tsx (652)
│   │       ├── GraphPreview.tsx (3.4K)
│   │       ├── Hero.tsx (1.5K)
│   │       ├── HowItWorks.tsx (1.3K)
│   │       ├── LayerCard.tsx (787)
│   │       ├── LiveStats.tsx (839)
│   │       ├── StatCounter.tsx (1.0K)
│   │       └── WhatYouCanDo.tsx (2.7K)
│   ├── docs/
│   │   └── (..1 more files)
│   ├── marketplace/ (66)
│   │   └── (..1 more files)
│   ├── registry/ (63)
│   │   └── (..1 more files)
│   ├── schema/ (61)
│   │   └── (..1 more files)
│   └── page.tsx (531) →
├── api/ (5.9K)
│   ├── connectome/ (3.3K)
│   │   ├── graph/ (903)
│   │   │   └── route.ts (903)
│   │   ├── graphs/ (702)
│   │   │   └── route.ts (702)
│   │   ├── search/ (1.2K)
│   │   │   └── route.ts (1.2K)
│   │   └── tick/ (429)
│   │       └── (..1 more files)
│   ├── sse/ (1.6K)
│   │   └── route.ts (1.6K)
│   └── stats/ (989)
│       └── route.ts (989)
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

### `(public)/components/landing/ActionCard.tsx`

**Definitions:**
- `ActionCard()`

### `(public)/components/landing/GraphPreview.tsx`

**Definitions:**
- `GraphPreview()`
- `resize()`
- `animate()`
- `generateNodes()`
- `generateEdges()`
- `updatePhysics()`
- `draw()`

### `(public)/components/landing/Hero.tsx`

**Definitions:**
- `Hero()`

### `(public)/components/landing/HowItWorks.tsx`

**Definitions:**
- `HowItWorks()`

### `(public)/components/landing/LayerCard.tsx`

**Definitions:**
- `LayerCard()`

### `(public)/components/landing/LiveStats.tsx`

**Definitions:**
- `LiveStats()`

### `(public)/components/landing/StatCounter.tsx`

**Definitions:**
- `StatCounter()`

### `(public)/components/landing/WhatYouCanDo.tsx`

**Definitions:**
- `WhatYouCanDo()`

### `(public)/page.tsx`

**Docs:** `docs/landing/IMPLEMENTATION_Landing_Code.md`

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

### `api/stats/route.ts`

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
