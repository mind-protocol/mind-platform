# flow_canvas — Patterns: Graph Node Visualization

```
STATUS: DRAFT
CREATED: 2025-12-20
UPDATED: 2025-12-23
```

---

## CHAIN

```
THIS:            PATTERNS_Connectome_Flow_Canvas_Pannable_Zoomable_Zoned_System_Map_Rendering_Patterns.md (you are here)
BEHAVIORS:       ./BEHAVIORS_Connectome_Flow_Canvas_Readable_Stable_Interaction_Effects.md
ALGORITHM:       ./ALGORITHM_Connectome_Flow_Canvas_Layout_Zones_And_Edge_Label_Decluttering.md
VALIDATION:      ./VALIDATION_Connectome_Flow_Canvas_Invariants_For_Readability_And_Stability.md
IMPLEMENTATION:  ./IMPLEMENTATION_Connectome_Flow_Canvas_Code_Structure_With_React_Flow_And_Zones.md
HEALTH:          ./HEALTH_Connectome_Flow_Canvas_Runtime_Verification_Of_Render_Stability_And_Perf_Budgets.md
SYNC:            ./SYNC_Connectome_Flow_Canvas_Sync_Current_State.md
```

---

## THE PROBLEM

The connectome must visualize the **actual graph data** from FalkorDB — the nodes and edges that represent the narrative world (Actors, Spaces, Things, Narratives, Moments).

Previous failure: The canvas showed system architecture (Frontend/Backend/Agents zones) instead of the graph content. Users saw an empty canvas because no system events were occurring, even though hundreds of graph nodes existed.

---

## THE PATTERN

**Force-directed graph visualization of FalkorDB nodes and edges.**

Node types from Schema v1.2:
- **Actor** — Characters in the world
- **Space** — Locations and places
- **Thing** — Objects and items
- **Narrative** — Beliefs, memories, oaths, rumors
- **Moment** — Discrete story beats

Edge types:
- **BELIEVES** — Actor → Narrative (with strength)
- **AT** — Actor/Thing → Space (presence)
- **OWNS** — Actor → Thing
- **RELATES_TO** — Narrative → Narrative
- **FOLLOWS** — Moment → Moment (sequence)

Layout:
- Force-directed for automatic clustering
- Node color by type (Actor=gold, Space=blue, Narrative=purple, etc.)
- Edge color by relationship type
- Pan/zoom for navigation

---

## PRINCIPLES

### Principle 1: Graph data is the source of truth

The canvas renders nodes and edges from `GET /api/connectome/graph?graph={name}`.
No hardcoded system architecture nodes. The graph IS the visualization.

### Principle 2: Force layout for organic clustering

Related nodes cluster naturally:
- Characters near their locations
- Narratives near their believers
- Moments near their speakers

### Principle 3: Type-based visual encoding

Each node type has distinct appearance:

| Type | Color | Shape |
|------|-------|-------|
| Actor | Gold (#b8860b) | Circle |
| Space | Blue (#4a90d9) | Square |
| Thing | Gray (#808080) | Diamond |
| Narrative | Purple (#9b59b6) | Hexagon |
| Moment | Orange (#e67e22) | Rounded rect |

### Principle 4: Energy as visual weight

Node energy (0-1) maps to:
- Size: higher energy = larger node
- Glow: high energy nodes have visible aura
- Opacity: low energy nodes fade slightly

---

## DATA

| Data | Source | Description |
|------|--------|-------------|
| `nodes[]` | `/api/connectome/graph` | Graph nodes with id, name, type, energy |
| `links[]` | `/api/connectome/graph` | Graph edges with from_id, to_id, type |
| `camera` | Local state | Pan (x,y) and zoom level |
| `selected` | Local state | Currently selected node/edge for detail view |

---

## DEPENDENCIES

| Module | Why We Depend On It |
|--------|---------------------|
| `connectome_read_cli.py` | Fetches graph data from FalkorDB |
| `state_store` | Holds current graph selection and camera |
| `node_kit` | Renders typed nodes with energy glow |
| `edge_kit` | Renders typed edges with labels |

---

## SCOPE

### In Scope

- Rendering all nodes from selected graph
- Force-directed layout with D3
- Pan/zoom camera controls
- Node selection and detail panel
- Edge visibility based on zoom level
- Search highlighting

### Out of Scope

- System architecture visualization (removed)
- Runtime event tracing (separate feature)
- Graph mutations (read-only view)

---

## ENTRY POINTS

| Entry | Purpose |
|-------|---------|
| `GET /api/connectome/graph?graph={name}` | Fetch nodes and edges |
| `GET /api/connectome/graphs` | List available graphs |
| `GET /api/connectome/search?q={query}&graph={name}` | Semantic search |

---

## MARKERS

<!-- @mind:todo Add node type filtering (show/hide by type) -->
<!-- @mind:todo Add edge type filtering -->
<!-- @mind:todo Add minimap for large graphs -->
<!-- @mind:todo Add node clustering for dense regions -->
