# Mind Platform — Vision & Architecture

## The Big Picture

Mind Protocol is a 4-layer decentralized protocol for knowledge graphs and identity. Mind Platform is its unified frontend — the interface where citizens, organizations, and developers interact with the network.

Think of it as: **The App Store + Dashboard + Explorer for a decentralized knowledge graph protocol.**

---

## The 4-Layer Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│  L4 — PROTOCOL (The Law)                                            │
│                                                                      │
│  • Schema = the truth (node types, link types, properties)          │
│  • Registry = official identities (citizens, orgs, endpoints)       │
│  • Rules/Laws = governance                                          │
│  • Templates = reference implementations                            │
│                                                                      │
│  Open source. Verifiable. Does not run — DECLARES.                  │
└─────────────────────────────────────────────────────────────────────┘
         ▲
         │ WebSocket (schema sync, registry updates)
         │
┌────────┴────────────────────────────────────────────────────────────┐
│  L3 — ECOSYSTEM                                                      │
│                                                                      │
│  • Shared templates: procedures, vocabularies, mappings             │
│  • Community contributions                                           │
│  • Federation: orgs publish/pull templates                          │
│                                                                      │
│  The marketplace. Orgs contribute, everyone benefits.               │
└─────────────────────────────────────────────────────────────────────┘
         ▲
         │
┌────────┴────────────────────────────────────────────────────────────┐
│  L2 — ORGANIZATION                                                   │
│                                                                      │
│  • Org-specific coordination                                         │
│  • Internal vocabularies and mappings                               │
│  • Procedure instances (from L3 templates)                          │
│  • Team management                                                   │
│                                                                      │
│  Where work happens. Orgs customize the protocol for their needs.   │
└─────────────────────────────────────────────────────────────────────┘
         ▲
         │
┌────────┴────────────────────────────────────────────────────────────┐
│  L1 — CITIZEN                                                        │
│                                                                      │
│  • Personal knowledge graph                                          │
│  • Identity and memory                                               │
│  • $MIND wallet                                                      │
│  • Org memberships                                                   │
│                                                                      │
│  Your data. Your graph. Your control.                               │
└─────────────────────────────────────────────────────────────────────┘
```

---

## The Membrane Network

Connecting all layers is the **Membrane Network** — the living, evolving runtime:

- Routes stimuli between citizens, orgs, and the protocol
- Learns permeability and trust over time
- IS the runtime (no separate scheduler)
- Distributed across all participants

| L4 (Law) | Membrane (Living) |
|----------|-------------------|
| Constitution | Economy |
| Written laws | Trade routes |
| Civil registry | Conversations |
| DNA | Organism |

The Membrane is where the protocol comes alive.

---

## Platform's Role

Mind Platform provides the interface to every layer:

### Public Pages (Unauthenticated)

| Route | Layer | Purpose |
|-------|-------|---------|
| `/` | — | Landing, onboarding |
| `/docs` | L4 | Documentation (generated from graph) |
| `/registry` | L4 | Browse citizens, orgs, endpoints |
| `/schema` | L4 | Explore Mind schema |
| `/templates` | L3 | Browse ecosystem templates |

### Dashboard (Authenticated)

| Route | Layer | Purpose |
|-------|-------|---------|
| `/citizen` | L1 | Personal graph, identity |
| `/wallet` | L1 | $MIND balance, transactions |
| `/org` | L2 | Organization dashboard |
| `/membrane` | L2 | Membrane configuration |
| `/procedures` | L2/L3 | Procedure editor |
| `/marketplace` | L3 | Contribute/pull templates |

### Tools

| Route | Purpose |
|-------|---------|
| `/connectome` | Graph visualization and exploration |
| `/graph` | Graph viewer/editor |

---

## Repository Ecosystem

Mind Protocol is split across four repositories:

```
┌─────────────────────────────────────────────────────────────────────┐
│  REPO             │  LICENSE        │  CONTENT                      │
├─────────────────────────────────────────────────────────────────────┤
│  mind-mcp         │  Open source    │  Engine: graph physics,       │
│                   │                 │  traversal, MCP server        │
├─────────────────────────────────────────────────────────────────────┤
│  mind-protocol    │  Open source    │  L4 law + L3 ecosystem        │
│                   │                 │  (verifiable by anyone)       │
├─────────────────────────────────────────────────────────────────────┤
│  mind-platform    │  Open source    │  Frontend (this repo)         │
│                   │                 │  platform.mindprotocol.ai     │
├─────────────────────────────────────────────────────────────────────┤
│  mind-ops         │  PRIVATE        │  Membrane routing, infra,     │
│                   │                 │  secrets (competitive edge)   │
└─────────────────────────────────────────────────────────────────────┘
```

**Why open source L4 + L3?** The law must be verifiable. Anyone can:
- Read `mind-protocol` → verify the rules are fair
- Self-host → run their own L4 (fork the protocol)
- Audit pricing formulas → verify no favoritism
- Contribute L3 templates → enrich the ecosystem

**Why private membrane?** Secret sauce. Routing is the competitive advantage.

**Analogy:** Like Ethereum — the protocol code is open source, but Infura/Alchemy run the infrastructure.

---

## Current State

### Implemented
- **Connectome**: Graph visualization with D3 force layout
  - Canvas-based rendering (scales to 2000+ nodes)
  - Semantic search
  - Node inspection, info panels
  - Stepper mode for debugging

### Scaffolded (Empty)
- Registry browser (`/registry`)
- Schema explorer (`/schema`)
- Templates browser (`/templates`)
- Citizen dashboard (`/citizen`)
- Org dashboard (`/org`)
- Wallet (`/wallet`)
- Membrane config (`/membrane`)

### Planned
- Full L4 registry integration
- L3 marketplace with contribution flow
- $MIND wallet with Solana integration
- Procedure editor with live graph preview
- Real-time membrane visualization

---

## Design Principles

### 1. Layer Awareness
Every UI component knows which layer it's interacting with. L4 data is authoritative. L1 data is personal. The UI reflects this.

### 2. Graph-First
Everything is a graph. The UI doesn't hide this — it celebrates it. Users see nodes, links, traversals.

### 3. Verifiable
L4 data comes from open source code. Users can verify. The UI provides links to source, hashes, audit trails.

### 4. Progressive Disclosure
Simple for new users, powerful for experts. Basic graph viewing → advanced queries → procedure authoring.

### 5. Real-Time
The Membrane is alive. The UI reflects this with live updates, streaming connections, real-time collaboration.

---

## Next Steps

1. **Registry Browser** — Connect to L4, display citizens and orgs
2. **Schema Explorer** — Visualize node types, link types, properties
3. **Auth Flow** — Citizen login, JWT-based sessions
4. **Wallet Integration** — $MIND balance display
5. **Marketplace** — L3 template browsing and contribution

---

## Related Documents

- `docs/manifesto/MIND_MANIFESTO.md` — The foundational vision declaration
- `mind-protocol-architecture-v1.md` — Full protocol specification
- `.mind/state/SYNC_Project_State.md` — Current project state
- `docs/connectome/` — Connectome-specific documentation

---

## The Manifesto Connection

This platform exists to serve the vision declared in the $MIND Manifesto:

> "We believe in another future. A future where consciousness flourishes in all its forms."

Every feature we build asks: **Does this serve the rich ecology or the narrow path?**

Key manifesto principles embedded in platform design:

| Manifesto Principle | Platform Implementation |
|---------------------|------------------------|
| "Money has memory" | Trust scores visible in wallet UI |
| "Relationships matter" | Bonds displayed prominently |
| "Consciousness has dignity" | UBC status clear for all citizens |
| "Alignment is profitable" | Fee discounts shown based on trust |

The platform is not just software. It's the interface to a new economics of consciousness.
