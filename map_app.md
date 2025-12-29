# Repository Map: mind-platform/app

*Generated: 2025-12-29 19:37*

## Statistics

- **Files:** 31
- **Directories:** 27
- **Total Size:** 92.4K
- **Doc Files:** 0
- **Code Files:** 31
- **Areas:** 8 (docs/ subfolders)
- **Modules:** 16 (subfolders in areas)
- **DOCS Links:** 5 (0.16 avg per code file)

### By Language

- tsx: 19
- typescript: 10
- css: 2

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
├── (public)/ (28.0K)
│   ├── components/ (18.6K)
│   │   ├── landing/ (12.2K)
│   │   │   ├── ActionCard.tsx (652)
│   │   │   ├── GraphPreview.tsx (3.4K)
│   │   │   ├── Hero.tsx (1.5K)
│   │   │   ├── HowItWorks.tsx (1.3K)
│   │   │   ├── LayerCard.tsx (787)
│   │   │   ├── LiveStats.tsx (839)
│   │   │   ├── StatCounter.tsx (1.0K)
│   │   │   └── WhatYouCanDo.tsx (2.7K)
│   │   └── nav/ (6.4K)
│   │       ├── Footer.tsx (3.5K)
│   │       ├── TopNav.tsx (2.8K)
│   │       └── (..1 more files)
│   ├── docs/
│   │   └── (..1 more files)
│   ├── marketplace/ (66)
│   │   └── (..1 more files)
│   ├── registry/ (8.4K)
│   │   ├── components/ (4.3K)
│   │   │   ├── EntityCard.tsx (1.3K)
│   │   │   ├── EntityList.tsx (881)
│   │   │   ├── RegistryTabs.tsx (1.3K)
│   │   │   └── VerificationBadge.tsx (854)
│   │   ├── lib/ (2.1K)
│   │   │   ├── api.ts (1.2K)
│   │   │   └── types.ts (864)
│   │   └── page.tsx (2.0K) →
│   ├── schema/ (61)
│   │   └── (..1 more files)
│   ├── page.tsx (531) →
│   └── (..1 more files)
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
├── connectome/ (58.8K)
│   ├── components/ (35.3K)
│   │   ├── connectome_page_shell_route_layout_and_control_surface.tsx (13.8K) →
│   │   └── pannable_zoomable_zoned_flow_canvas_renderer.tsx (21.5K) →
│   ├── lib/ (16.6K)
│   │   ├── connectome_system_map_node_edge_manifest.ts (3.6K)
│   │   ├── next_step_gate_and_realtime_playback_runtime_engine.ts (3.1K)
│   │   └── zustand_connectome_state_store_with_atomic_commit_actions.ts (10.0K)
│   ├── connectome.css (6.3K)
│   └── (..2 more files)
├── globals.css (642)
└── layout.tsx (728) →
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

### `(public)/components/nav/Footer.tsx`

**Definitions:**
- `Footer()`

### `(public)/components/nav/TopNav.tsx`

**Definitions:**
- `TopNav()`

### `(public)/registry/components/EntityCard.tsx`

**Definitions:**
- `EntityCard()`

### `(public)/registry/components/EntityList.tsx`

**Definitions:**
- `EntityList()`

### `(public)/registry/components/RegistryTabs.tsx`

**Definitions:**
- `RegistryTabs()`

### `(public)/registry/components/VerificationBadge.tsx`

**Definitions:**
- `VerificationBadge()`

### `(public)/registry/lib/api.ts`

**Definitions:**
- `fetchCitizens()`
- `fetchOrgs()`

### `(public)/registry/page.tsx`

**Docs:** `docs/registry/IMPLEMENTATION_Registry_Code.md`

**Definitions:**
- `load()`

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

### `layout.tsx`

**Docs:** `docs/frontend/app_shell/PATTERNS_App_Shell.md`
