# Platform Algorithms

Procedures and flows that define how the platform operates.

---

## Core Flows

### 1. Graph Loading Flow

```
User navigates to /connectome
    │
    ▼
Page shell mounts
    │
    ├── Initialize runtime engine
    ├── Connect SSE for health telemetry
    └── Fetch available graphs
            │
            ▼
        GET /api/connectome/graphs
            │
            ▼
        Select default graph (or from URL param)
            │
            ▼
        GET /api/connectome/graph?graph={name}
            │
            ▼
        Parse nodes[] and links[]
            │
            ▼
        Initialize D3 force simulation
            │
            ▼
        Render to canvas
            │
            ▼
        Enable interaction (pan, zoom, click)
```

### 2. Semantic Search Flow

```
User types query in search bar
    │
    ▼
Debounce input (300ms)
    │
    ▼
GET /api/connectome/search?q={query}&threshold={t}&hops={h}&graph={g}
    │
    ▼
Backend performs embedding search
    │
    ▼
Returns { matches[], nodes[], links[] }
    │
    ▼
Update search results in state store
    │
    ▼
Reveal matched nodes in canvas
    │
    ▼
Highlight matches, dim others
```

### 3. Node Selection Flow

```
User clicks node in canvas
    │
    ▼
Hit detection (find node under cursor)
    │
    ▼
Update active_focus in state store
    │
    ▼
Pan canvas to center on node
    │
    ▼
Open info panel with node details
    │
    ├── Show: type, title, properties
    ├── Show: connected nodes (in, out)
    └── Show: energy, weight, dates
```

### 4. Stepper Mode Flow

```
User enables stepper mode (speed = pause)
    │
    ▼
Click "Next Step"
    │
    ▼
GET /api/connectome/tick?graph={name}
    │
    ▼
Backend returns next event (or end_of_script)
    │
    ▼
If event:
    ├── Commit to ledger
    ├── Update active focus (node, edge)
    ├── Update explanation text
    └── Trigger canvas re-render
    │
If end_of_script:
    └── Show "End of script" status
```

---

## Authentication Flows

### 5. Login Flow (Planned)

```
User clicks "Sign In"
    │
    ▼
Redirect to L4 auth endpoint
    │
    ▼
User authenticates (wallet signature or OAuth)
    │
    ▼
L4 returns JWT
    │
    ▼
Store JWT in httpOnly cookie
    │
    ▼
Redirect to dashboard
    │
    ▼
Fetch citizen profile from L4
    │
    ▼
Render authenticated UI
```

### 6. Session Validation Flow (Planned)

```
Page load (authenticated route)
    │
    ▼
Check for JWT cookie
    │
    ├── Missing → redirect to login
    │
    ▼
Validate JWT with L4
    │
    ├── Invalid/expired → clear cookie, redirect to login
    │
    ▼
Fetch user context
    │
    ▼
Render page with user data
```

---

## Registry Flows

### 7. Registry Browse Flow (Planned)

```
User navigates to /registry
    │
    ▼
GET /api/registry/citizens?page=1&limit=50
GET /api/registry/orgs?page=1&limit=50
    │
    ▼ (parallel)
Render citizen list, org list
    │
    ▼
User clicks citizen/org
    │
    ▼
GET /api/registry/{type}/{id}
    │
    ▼
Render detail view
    │
    ├── Identity info
    ├── Memberships
    ├── Endpoints
    └── Verification links
```

### 8. Registry Search Flow (Planned)

```
User types in registry search
    │
    ▼
GET /api/registry/search?q={query}
    │
    ▼
Returns matching citizens, orgs, endpoints
    │
    ▼
Render filtered list
```

---

## Marketplace Flows

### 9. Template Browse Flow (Planned)

```
User navigates to /templates
    │
    ▼
GET /api/ecosystem/templates?category={cat}&page=1
    │
    ▼
Render template cards
    │
    ├── Title, author, category
    ├── Usage count, rating
    └── Preview button
    │
    ▼
User clicks template
    │
    ▼
GET /api/ecosystem/templates/{id}
    │
    ▼
Render template detail
    │
    ├── Full definition
    ├── Version history
    ├── Usage examples
    └── "Pull to Org" button (if authed)
```

### 10. Template Contribution Flow (Planned)

```
User clicks "Contribute Template" (authed)
    │
    ▼
Open contribution wizard
    │
    ├── Step 1: Select type (procedure, vocabulary, mapping)
    ├── Step 2: Define content
    ├── Step 3: Add metadata
    └── Step 4: Review
    │
    ▼
POST /api/ecosystem/templates
    │
    ▼
Template enters review queue
    │
    ▼
Reviewers approve/reject
    │
    ▼
If approved → published to L3
```

---

## Wallet Flows

### 11. Wallet View Flow (Planned)

```
User navigates to /wallet (authed)
    │
    ▼
GET /api/wallet/balance
GET /api/wallet/transactions?limit=20
    │
    ▼ (parallel)
Render balance card
Render transaction list
    │
    ▼
User clicks transaction
    │
    ▼
Show detail: amount, parties, memo, on-chain link
```

---

## Emerging Module Identification

Based on these flows, distinct modules emerge:

| Flow Cluster | Module | Priority |
|--------------|--------|----------|
| Graph Loading, Search, Selection, Stepper | `connectome` | Done |
| Login, Session | `auth` | High |
| Registry Browse, Search | `registry` | High |
| Schema exploration | `schema-explorer` | Medium |
| Template Browse, Contribute | `marketplace` | Medium |
| Wallet View | `wallet` | Medium |
| Membrane config | `membrane-ui` | Low |

Each module should have its own doc chain.
