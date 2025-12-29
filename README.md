# Mind Platform

The unified frontend for Mind Protocol — a 4-layer decentralized knowledge graph protocol.

**Live at:** `platform.mindprotocol.ai`

## Vision

Mind Platform is the public interface to the Mind Protocol network. It serves citizens, organizations, and developers across all four layers:

| Layer | What | Platform Role |
|-------|------|---------------|
| **L4 — Protocol** | Schema, Registry, Rules | Schema explorer, Registry browser |
| **L3 — Ecosystem** | Shared templates, procedures | Marketplace, contribution flow |
| **L2 — Organization** | Org coordination, vocabularies | Org dashboard, procedure editor |
| **L1 — Citizen** | Personal graph, identity, wallet | Citizen dashboard, wallet UI |

The **Membrane Network** — the living runtime connecting all layers — surfaces through real-time visualization in **Connectome**.

## Structure

```
/app
├── (public)/           # Public pages
│   ├── registry/       # Browse citizens, orgs, endpoints (L4)
│   ├── schema/         # Explore Mind schema
│   └── templates/      # L3 ecosystem browser
│
├── (dashboard)/        # Authenticated user area
│   ├── citizen/        # L1 personal graph management
│   ├── org/            # L2 organization dashboard
│   ├── wallet/         # $MIND wallet
│   └── membrane/       # Membrane configuration
│
├── connectome/         # Graph visualization
│   ├── components/     # Canvas, controls, panels
│   └── lib/            # State store, runtime engine
│
└── api/                # Next.js API routes
    ├── connectome/     # Graph queries, search
    └── sse/            # Real-time telemetry
```

## Features

### Connectome (Graph Explorer)
- Canvas-based visualization with D3 force layout
- Semantic search across the knowledge graph
- Node types: Actor, Moment, Narrative, Space, Thing
- Pan, zoom, node inspection, info panels
- Stepper mode for debugging traversals

### Registry Browser (Planned)
- Browse all registered citizens and organizations
- View endpoints and capabilities
- Verify identities and memberships

### Marketplace (Planned)
- Browse L3 templates: procedures, vocabularies, mappings
- Contribute templates to the ecosystem
- Pull templates into your organization

### Wallet (Planned)
- $MIND token balance and transactions
- Membrane fee tracking
- Transaction history

## Development

```bash
npm install
npm run dev
```

Visit `http://localhost:3000/connectome` for the graph explorer.

### Backend

The platform connects to the Mind Protocol backend:

```bash
# Set backend URL (default: http://localhost:8765)
export CONNECTOME_BACKEND_URL=http://localhost:8765
```

## Architecture Context

Mind Platform is one of four repositories in the Mind Protocol ecosystem:

| Repo | Purpose | License |
|------|---------|---------|
| `mind-mcp` | Engine — graph physics, traversal, MCP server | Open source |
| `mind-protocol` | L4 law + L3 ecosystem definitions | Open source |
| `mind-platform` | Frontend — this repo | Open source |
| `mind-ops` | Membrane routing, infrastructure, secrets | Private |

See `docs/vision/` for the full architectural context.

## License

MIT
