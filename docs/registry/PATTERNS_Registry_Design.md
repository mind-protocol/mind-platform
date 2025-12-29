# Registry Module Design

Architecture and design philosophy for the L4 registry browser.

```
STATUS: DESIGNING
```

---

## Module Identity

**Registry** = Public browser for L4-registered Citizens and Orgs.

This module is the protocol's public directory. It answers: "Who's in the Mind Protocol?"

---

## Design Philosophy

### Read-Only Display Layer

The platform doesn't own registry data. L4 does. Our job is to:
- Fetch and display L4 data
- Apply consistent visual treatment
- Enable discovery through search/filter
- Show verification status clearly

We never:
- Modify registry data
- Cache beyond reasonable TTL
- Interpret or transform L4 semantics

### Verification as First-Class UI

Verification status affects trust. It must be:
- Immediately visible (badge on every entity)
- Consistent (same colors/icons everywhere)
- Honest (unverified shown as such, not hidden)

### Progressive Detail

- List view: Name, org, verification badge
- Detail view: All properties, connections, history

---

## Data Model (from L4)

### Citizen

```typescript
interface Citizen {
  id: string;
  name: string;
  wallet?: string;           // Solana address
  org_membership?: string;   // Org ID
  status: 'active' | 'suspended' | 'pending';
  registered_date: string;   // ISO timestamp
  capabilities: string[];
  verification: VerificationState;
}
```

### Org

```typescript
interface Org {
  id: string;
  name: string;
  wallet?: string;           // Solana treasury
  endpoint?: string;         // WebSocket URL
  status: 'active' | 'suspended' | 'pending';
  registered_date: string;
  citizen_count: number;
  verification: VerificationState;
}
```

### VerificationState

```typescript
type VerificationState =
  | 'unverified'   // No verification link
  | 'pending'      // polarity=0, permanence<0.5
  | 'provisional'  // polarity=1.0, permanence<0.5
  | 'verified'     // polarity=1.0, permanence>=0.5
  | 'rejected';    // polarity=-1.0
```

---

## Component Architecture

```
app/(public)/registry/
├── page.tsx                    # List view (Citizens + Orgs tabs)
├── citizens/
│   └── [id]/page.tsx           # Citizen detail
├── orgs/
│   └── [id]/page.tsx           # Org detail
├── components/
│   ├── RegistryTabs.tsx        # Citizens/Orgs tab switcher
│   ├── EntityList.tsx          # Reusable list component
│   ├── EntityCard.tsx          # Card for list items
│   ├── CitizenDetail.tsx       # Full citizen profile
│   ├── OrgDetail.tsx           # Full org profile
│   ├── SearchBar.tsx           # Search input
│   ├── FilterPanel.tsx         # Status/verification filters
│   └── VerificationBadge.tsx   # Shared badge component
└── lib/
    ├── registry-api.ts         # API client
    └── types.ts                # TypeScript types
```

---

## API Design

### Endpoints (proxy to L4)

| Route | Method | L4 Backend |
|-------|--------|------------|
| `/api/registry/citizens` | GET | L4 registry query |
| `/api/registry/citizens/[id]` | GET | L4 citizen lookup |
| `/api/registry/orgs` | GET | L4 registry query |
| `/api/registry/orgs/[id]` | GET | L4 org lookup |
| `/api/registry/search` | GET | L4 semantic search |

### Response Shape

```typescript
// List response
interface RegistryListResponse<T> {
  items: T[];
  count: number;
  hasMore: boolean;
}

// Error response (matches platform standard)
interface APIError {
  error: string;
  code?: string;
  details?: unknown;
}
```

---

## Visual Design

### Verification Badge Colors

| State | Color | Icon |
|-------|-------|------|
| unverified | Gray (#6b7280) | — |
| pending | Yellow (#f59e0b) | Clock |
| provisional | Blue (#3b82f6) | Shield |
| verified | Green (#22c55e) | Checkmark |
| rejected | Red (#ef4444) | X |

### Status Indicators

| Status | Treatment |
|--------|-----------|
| active | Normal display |
| pending | Muted + "Pending" label |
| suspended | Muted + strikethrough name |

### Entity Cards

- Avatar/icon (generated or default)
- Name (primary text)
- Org name (secondary text, for Citizens)
- Verification badge (top-right)
- Status indicator (if not active)

---

## Caching Strategy

| Data | TTL | Invalidation |
|------|-----|--------------|
| Citizen list | 60s | On refresh |
| Org list | 60s | On refresh |
| Individual entity | 300s | On detail view refresh |
| Search results | 30s | On new search |

---

## Open Questions

`@mind:escalation` — Need to decide:

1. **L4 API shape**: What endpoints does L4 actually expose? Assumed REST-like, but may differ.

`@mind:proposition` — L4 API is likely graph-based. We may need to:
- Query L4 graph for `Actor` nodes with `type: citizen`
- Query for `Space` nodes with `type: org`
- Follow links to get verification status

This would change the API proxy layer to translate REST-like calls to graph queries.

---

## Related

- `docs/vision/VOCABULARY_Platform_Terms.md` — Imported L4 terms
- `docs/vision/VALIDATION_Platform_Invariants.md` — INV-01 (read-only), INV-06 (badges)
- `docs/schema-explorer/` — For "Learn more about schema" links
