# Platform Implementation

Code architecture and module structure.

```
STATUS: DESIGNING
```

---

## Repository Structure

```
mind-platform/
│
├── app/                              # Next.js App Router
│   │
│   ├── (public)/                     # Public routes (no auth)
│   │   ├── page.tsx                  # Landing
│   │   ├── registry/                 # L4 registry browser
│   │   ├── schema/                   # L4 schema explorer
│   │   └── templates/                # L3 marketplace
│   │
│   ├── (dashboard)/                  # Protected routes (auth required)
│   │   ├── citizen/                  # L1 dashboard
│   │   ├── org/                      # L2 dashboard
│   │   ├── wallet/                   # $MIND wallet
│   │   └── membrane/                 # Membrane config
│   │
│   ├── connectome/                   # Graph visualization (special route)
│   │   ├── page.tsx                  # Page shell
│   │   ├── components/               # Connectome-specific components
│   │   └── lib/                      # State store, runtime engine
│   │
│   ├── api/                          # API routes
│   │   ├── connectome/               # Graph queries
│   │   │   ├── graphs/route.ts
│   │   │   ├── graph/route.ts
│   │   │   ├── search/route.ts
│   │   │   └── tick/route.ts
│   │   │
│   │   ├── registry/                 # L4 registry proxy (planned)
│   │   ├── ecosystem/                # L3 templates proxy (planned)
│   │   ├── wallet/                   # Wallet API (planned)
│   │   ├── auth/                     # Auth endpoints (planned)
│   │   └── sse/route.ts              # Server-sent events
│   │
│   ├── layout.tsx                    # Root layout
│   └── globals.css                   # Global styles
│
├── components/                       # Shared components
│   ├── ui/                           # Base UI components
│   │   ├── Button.tsx
│   │   ├── Badge.tsx
│   │   ├── Card.tsx
│   │   └── ...
│   │
│   ├── layer/                        # Layer-aware components
│   │   ├── LayerBadge.tsx
│   │   ├── LayerContext.tsx
│   │   └── VerificationBadge.tsx
│   │
│   └── graph/                        # Graph components (shared)
│       ├── NodeCard.tsx
│       ├── LinkLine.tsx
│       └── GraphMinimap.tsx
│
├── lib/                              # Shared utilities
│   ├── api/                          # API client
│   │   ├── client.ts                 # Base fetch wrapper
│   │   ├── registry.ts               # Registry API
│   │   ├── ecosystem.ts              # Ecosystem API
│   │   └── wallet.ts                 # Wallet API
│   │
│   ├── auth/                         # Auth utilities
│   │   ├── session.ts                # Session management
│   │   └── middleware.ts             # Route protection
│   │
│   └── constants/                    # Shared constants
│       ├── colors.ts                 # Design tokens
│       ├── layers.ts                 # Layer definitions
│       └── node-types.ts             # Schema node types
│
├── docs/                             # Documentation
│   ├── vision/                       # Platform vision chain
│   ├── connectome/                   # Connectome module docs
│   └── ...                           # Other module docs
│
├── l3/                               # L3 ecosystem content
│   ├── templates/                    # Template definitions
│   ├── contributions/                # Contribution staging
│   └── federation/                   # Cross-org sharing
│
└── public/                           # Static assets
    └── ...
```

---

## Module Architecture

### Implemented Modules

#### Connectome (`app/connectome/`)

Graph visualization with D3 force layout.

```
app/connectome/
├── page.tsx                          # Route entry
├── connectome.css                    # Module styles
├── components/
│   ├── connectome_page_shell_*.tsx   # Page layout + controls
│   └── pannable_zoomable_*.tsx       # Canvas renderer
└── lib/
    ├── zustand_connectome_*.ts       # State store
    ├── next_step_gate_*.ts           # Runtime engine
    └── connectome_system_*.ts        # Node/edge manifest
```

**Key decisions:**
- Browser-safe: No imports from mind-mcp (Node.js modules)
- Canvas 2D: Simpler than WebGL, good enough for 1000+ nodes
- Zustand: Lightweight state management
- D3 force: Standard force-directed layout

### Planned Modules

#### Registry (`app/(public)/registry/`)

L4 registry browser.

```
app/(public)/registry/
├── page.tsx                          # List view
├── [id]/page.tsx                     # Detail view
├── components/
│   ├── CitizenList.tsx
│   ├── OrgList.tsx
│   ├── CitizenDetail.tsx
│   ├── OrgDetail.tsx
│   └── VerificationBadge.tsx
└── lib/
    └── registry-api.ts               # API client
```

**API routes:**
- `GET /api/registry/citizens`
- `GET /api/registry/citizens/[id]`
- `GET /api/registry/orgs`
- `GET /api/registry/orgs/[id]`
- `GET /api/registry/search`

#### Schema Explorer (`app/(public)/schema/`)

L4 schema visualization.

```
app/(public)/schema/
├── page.tsx                          # Overview
├── nodes/page.tsx                    # Node types
├── links/page.tsx                    # Link properties
├── components/
│   ├── SchemaTree.tsx
│   ├── NodeTypeCard.tsx
│   ├── PropertyTable.tsx
│   └── SchemaGraph.tsx               # Visual representation
└── lib/
    └── schema-loader.ts              # YAML parsing
```

**Data source:**
- Fetch from L4 or load `schema.yaml` directly

#### Marketplace (`app/(public)/templates/`)

L3 ecosystem browser and contribution flow.

```
app/(public)/templates/
├── page.tsx                          # Browse templates
├── [id]/page.tsx                     # Template detail
├── contribute/page.tsx               # Contribution wizard
├── components/
│   ├── TemplateGrid.tsx
│   ├── TemplateCard.tsx
│   ├── TemplateDetail.tsx
│   ├── ContributionWizard.tsx
│   └── CategoryFilter.tsx
└── lib/
    └── ecosystem-api.ts              # API client
```

**API routes:**
- `GET /api/ecosystem/templates`
- `GET /api/ecosystem/templates/[id]`
- `POST /api/ecosystem/templates` (auth required)

#### Auth (`lib/auth/`)

Authentication and session management.

```
lib/auth/
├── session.ts                        # Session read/write
├── middleware.ts                     # Route protection
├── jwt.ts                            # JWT utilities
└── context.tsx                       # Auth React context
```

**Flow:**
1. Login → redirect to L4 auth
2. L4 returns JWT
3. Store in httpOnly cookie
4. Middleware validates on protected routes

#### Wallet (`app/(dashboard)/wallet/`)

$MIND token management.

```
app/(dashboard)/wallet/
├── page.tsx                          # Balance + transactions
├── send/page.tsx                     # Send flow
├── receive/page.tsx                  # Receive address
├── components/
│   ├── BalanceCard.tsx
│   ├── TransactionList.tsx
│   ├── TransactionDetail.tsx
│   └── SendForm.tsx
└── lib/
    └── wallet-api.ts                 # API client
```

**API routes:**
- `GET /api/wallet/balance`
- `GET /api/wallet/transactions`
- `POST /api/wallet/send` (auth required)

---

## Shared Infrastructure

### API Client (`lib/api/client.ts`)

```typescript
interface APIClientConfig {
  baseUrl: string;
  headers?: Record<string, string>;
}

class APIClient {
  constructor(config: APIClientConfig);

  get<T>(path: string, params?: Record<string, string>): Promise<T>;
  post<T>(path: string, body: unknown): Promise<T>;
  // ... other methods
}

// Singleton instances
export const registryAPI = new APIClient({ baseUrl: '/api/registry' });
export const ecosystemAPI = new APIClient({ baseUrl: '/api/ecosystem' });
export const walletAPI = new APIClient({ baseUrl: '/api/wallet' });
```

### Design Tokens (`lib/constants/colors.ts`)

```typescript
// Layer colors
export const LAYER_COLORS = {
  L1: '#3b82f6',  // Blue
  L2: '#22c55e',  // Green
  L3: '#8b5cf6',  // Purple
  L4: '#f59e0b',  // Amber
} as const;

// Node type colors (from L4 schema)
export const NODE_TYPE_COLORS = {
  Actor: '#f472b6',
  Moment: '#60a5fa',
  Narrative: '#a78bfa',
  Space: '#4ade80',
  Thing: '#fbbf24',
} as const;

// Verification badge colors
export const VERIFICATION_COLORS = {
  unverified: '#6b7280',
  pending: '#f59e0b',
  provisional: '#3b82f6',
  verified: '#22c55e',
  rejected: '#ef4444',
} as const;
```

---

## Data Flow

```
┌─────────────────────────────────────────────────────────────────────┐
│  Browser                                                             │
│                                                                      │
│  React Components ──▶ Zustand Store ──▶ API Client                  │
│         ▲                    ▲                │                      │
│         │                    │                ▼                      │
│         └────────────────────┴────── SSE Connection                 │
└───────────────────────────────────────────────────────────────────┬─┘
                                                                    │
                                                                    ▼
┌─────────────────────────────────────────────────────────────────────┐
│  Next.js API Routes                                                  │
│                                                                      │
│  /api/connectome/* ──▶ Python Backend (localhost:8765)              │
│  /api/registry/*   ──▶ L4 API (mind-protocol)                       │
│  /api/ecosystem/*  ──▶ L4 API (mind-protocol)                       │
│  /api/wallet/*     ──▶ L4 API + Solana RPC                          │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Emerging Modules Summary

| Module | Route | Status | Priority |
|--------|-------|--------|----------|
| `connectome` | `/connectome` | Implemented | — |
| `registry` | `/registry` | Scaffolded | High |
| `schema-explorer` | `/schema` | Scaffolded | High |
| `marketplace` | `/templates` | Scaffolded | Medium |
| `auth` | `lib/auth/` | Not started | High |
| `wallet` | `/wallet` | Scaffolded | Medium |
| `citizen-dashboard` | `/citizen` | Scaffolded | Medium |
| `org-dashboard` | `/org` | Scaffolded | Medium |
| `membrane-ui` | `/membrane` | Scaffolded | Low |

Each module should have its own doc chain in `docs/{module}/`.
