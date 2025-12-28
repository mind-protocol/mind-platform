# Connectome Graph API — Patterns: RESTful Graph Data Exposure

```
STATUS: DESIGNING
CREATED: 2023-11-20
VERIFIED: 2023-11-20 against Initial Documentation Commit
```

---

## CHAIN

```
OBJECTIVES:      ./OBJECTIVES_Graph_API.md
BEHAVIORS:      ./BEHAVIORS_Graph_API.md
THIS:            PATTERNS_Graph_API.md (you are here)
ALGORITHM:       ./ALGORITHM_Graph_API.md
VALIDATION:      ./VALIDATION_Graph_API.md
HEALTH:          ./HEALTH_Graph_API.md
IMPLEMENTATION:  ./IMPLEMENTATION_Graph_API.md
SYNC:            ./SYNC_Graph_API.md

IMPL:            app/api/connectome/graph/route.ts
```

### Bidirectional Contract

**Before modifying this doc or the code:**
1. Read ALL docs in this chain first
2. Read the linked IMPL source file

**After modifying this doc:**
1. Update the IMPL source file to match, OR
2. Add a TODO in SYNC_Graph_API.md: "Docs updated, implementation needs: {what}"
3. Run tests: `npm test`

**After modifying the code:**
1. Update this doc chain to match, OR
2. Add a TODO in SYNC_Graph_API.md: "Implementation changed, docs need: {what}"
3. Run tests: `npm test`

---

## THE PROBLEM

The Connectome UI requires dynamic graph data to render connections and relationships between different entities. Without a well-defined and efficient API, the UI would struggle to retrieve, process, and display this complex interconnected data, leading to poor user experience and difficult maintenance.

---

## THE PATTERN

The core design approach is to expose graph data through a RESTful API. This involves defining clear endpoints for retrieving nodes and edges, potentially with filtering and aggregation capabilities. The API will act as a facade, abstracting the underlying graph data storage and processing mechanisms.

---

## BEHAVIORS SUPPORTED

- `GET_GRAPH_DATA` — Enables clients to request the entire graph or subgraphs based on parameters.
- `FILTER_GRAPH_DATA` — Allows clients to retrieve specific subsets of graph nodes and edges.

## BEHAVIORS PREVENTED

- `DIRECT_DB_ACCESS` — Prevents direct interaction with the graph database, enforcing a controlled access layer.
- `UNAUTHORIZED_GRAPH_MODIFICATION` — The API is read-only for general graph data, preventing unintended modifications through this interface.

---

## PRINCIPLES

### Principle 1: Simplicity

Keep API endpoints and data structures as simple as possible to facilitate easy consumption by the UI and other services. This reduces cognitive load for developers and speeds up integration.

### Principle 2: Performance

Optimize data retrieval and serialization to ensure fast response times, especially for potentially large graph datasets. This directly impacts the responsiveness of the Connectome UI.

### Principle 3: Abstraction

Abstract the underlying graph database implementation from the API consumers. This allows for changes to the persistence layer without affecting API clients.

---

## DATA

| Source | Type | Purpose / Description |
|--------|------|-----------------------|
| N/A | INTERNAL | Graph data structure, managed internally within the connectome system. |

---

## DEPENDENCIES

| Module | Why We Depend On It |
|--------|---------------------|
| connectome_core | To access the underlying graph data logic and structures. |

---

## INSPIRATIONS

- **RESTful API Design Principles:** Standard practices for building scalable and maintainable web APIs.
- **GraphQL (conceptual):** While not using GraphQL directly, the idea of flexible data querying influenced thinking about data exposure.

---

## SCOPE

### In Scope

- Defining API endpoints for graph data retrieval.
- Serializing graph data into a consumable format (e.g., JSON).
- Basic filtering and query parameters for graph data.

### Out of Scope

- Graph database integration details (handled by `connectome_core`).
- Real-time graph updates (future enhancement).
- Complex graph algorithms (handled by `connectome_analysis`).

---

## API ENDPOINTS

### GET /api/connectome/graph

Fetches the complete graph data for visualization in the Connectome UI.

**Query Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `graph` | string | `"seed"` | Name of the FalkorDB graph to fetch |

**Response (200):**
```json
{
  "nodes": [
    {"id": "char_player", "label": "Character", "name": "Player", ...},
    {"id": "place_tavern", "label": "Place", "name": "The Rusty Tankard", ...}
  ],
  "edges": [
    {"source": "char_player", "target": "place_tavern", "type": "AT", ...}
  ]
}
```

**Error Response (500):**
```json
{
  "error": "Graph fetch failed"
}
```

**Implementation:** Delegates to `engine.physics.graph.connectome_read_cli` Python CLI via subprocess.

---

## MARKERS

<!-- @mind:todo
title: "Add remaining doc chain files"
priority: low
context: |
  Only PATTERNS exists. The full chain (BEHAVIORS, ALGORITHM, VALIDATION, HEALTH, IMPLEMENTATION) would help future maintainers.
task: |
  Create remaining documentation files when expanding this module.
-->
