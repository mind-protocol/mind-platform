# mind-platform Architecture

## Layer Position: L3 (Ecosystem) + Frontend

mind-platform is the **L3 ecosystem layer** plus the web frontend. Contains shared templates, organization features, and the UI.

```
┌─────────────────────────────────────────────────────────────┐
│ L4: Protocol (mind-protocol)                                │
│     Registry, Economy, Validation, Broadcast                │
├─────────────────────────────────────────────────────────────┤
│ L3: Ecosystem (mind-platform) ◄── YOU ARE HERE              │
│     Templates, Organizations, Public Graph, UI              │
├─────────────────────────────────────────────────────────────┤
│ L2: Organization                                            │
│     Multi-user coordination                                 │
├─────────────────────────────────────────────────────────────┤
│ L1: Citizen (mind-mcp)                                      │
│     Local graph, Physics engine, MCP server                 │
└─────────────────────────────────────────────────────────────┘
```

## Core Responsibilities

### 1. Templates (L3)
- Shared patterns and procedures
- Skills that L1 clients can adopt
- Versioned template marketplace

### 2. Organizations (L3)
- Multi-user coordination
- Team workspaces
- Shared knowledge graphs

### 3. Public Graph (L3)
- Discoverable knowledge (unlike private membrane)
- Community-contributed content
- Template discovery

### 4. Frontend (UI)
- Web interface to Mind Protocol
- Graph visualization (Connectome)
- Real-time updates via WebSocket

## Key Design Decisions

### L3 Has Its Own Database
L3 is not virtual - it has its own graph database. This stores templates, org data, and public content.

### L3 Graph is PUBLIC
Unlike the membrane (private), the L3 graph is public and discoverable. Anyone can browse templates.

### Templates Owned by Platform
Templates live here, not in L4 (protocol). This allows faster iteration without protocol changes.

### WebSocket from L4
The frontend connects to L4 via WebSocket for real-time updates. No polling.

## Module Structure

```
app/                   # Next.js App Router
├── page.tsx           # Home
├── connectome/        # Graph visualization
├── templates/         # Template browser
└── org/               # Organization management

components/            # React components
├── graph/             # Graph visualization
├── template/          # Template cards
└── common/            # Shared UI

l3/                    # L3 Ecosystem logic
├── templates/         # Template CRUD
├── orgs/              # Organization logic
└── public-graph/      # Public graph queries

lib/                   # Utilities
├── hooks/             # React hooks
├── api/               # API clients
└── ws/                # WebSocket client
```

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 14+ (App Router) |
| Styling | Tailwind CSS |
| State | Zustand or React Context |
| Graph Viz | React Flow or custom WebGL |
| API | GraphQL to L4 |
| Realtime | WebSocket from L4 |

## Data Flow

```
User Browser
     │
     ▼
Next.js App (app/)
     │
     ├──► GraphQL ──► L4 API
     │
     └──► WebSocket ◄── L4 Push
            │
            ▼
      Real-time Updates
```

## Frontend Features

### Connectome Visualization
- Interactive graph view
- Pan, zoom, filter
- Node/edge details
- Real-time energy flow

### Template Marketplace
- Browse templates
- Preview before adoption
- Version history
- Usage analytics

### Organization Dashboard
- Team management
- Shared graphs
- Activity feed
- Permissions

## Related Repos

| Repo | Layer | Purpose |
|------|-------|---------|
| mind-mcp | L1 | Client engine |
| mind-protocol | L4 | Protocol law |
| mind-platform | L3 | This repo - frontend + ecosystem |
| mind-ops | - | Private infrastructure, billing |
