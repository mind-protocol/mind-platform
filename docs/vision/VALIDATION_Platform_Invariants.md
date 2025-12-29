# Platform Validation

Invariants that must hold across the platform.

```
STATUS: DESIGNING
```

---

## Data Integrity Invariants

### INV-01: L4 Data Is Read-Only
Platform NEVER modifies L4 data directly. All L4 mutations go through L4 API.

**Verification:**
- No POST/PUT/DELETE to `/api/registry/*` without L4 proxy
- No direct Neo4j writes from platform code
- Schema definitions fetched, never modified

### INV-02: Layer Attribution Preserved
Every piece of data maintains its layer origin.

**Verification:**
- All API responses include `layer` field
- UI components receive and display layer context
- No data appears without source attribution

### INV-03: Citizen Data Isolation
One citizen's L1 data is never visible to another citizen (except via explicit sharing).

**Verification:**
- API routes check session ownership
- No cross-citizen data in responses
- Sharing requires explicit link with polarity > 0

---

## UI Consistency Invariants

### INV-04: Layer Colors Consistent
Each layer has consistent visual identity across all UI.

| Layer | Primary Color | Badge Style |
|-------|---------------|-------------|
| L1 | Blue (#3b82f6) | Solid blue |
| L2 | Green (#22c55e) | Solid green |
| L3 | Purple (#8b5cf6) | Solid purple |
| L4 | Amber (#f59e0b) | Solid amber |

**Verification:**
- Design tokens define layer colors once
- Components import from shared tokens
- No hardcoded colors for layer indicators

### INV-05: Node Type Colors Consistent
Schema node types have consistent colors everywhere.

| Type | Color |
|------|-------|
| Actor | Pink (#f472b6) |
| Moment | Blue (#60a5fa) |
| Narrative | Purple (#a78bfa) |
| Space | Green (#4ade80) |
| Thing | Amber (#fbbf24) |

**Verification:**
- `NODE_TYPE_COLORS` is single source of truth
- Connectome, registry, all views use same map
- No hardcoded node colors

### INV-06: Verification Badges Consistent
Verification states have consistent visual treatment.

**Verification:**
- Badge component accepts state enum
- Colors match L4 definition
- Icons consistent (checkmark, clock, X)

---

## Navigation Invariants

### INV-07: Back Navigation Preserves State
Navigating back restores previous view state.

**Verification:**
- URL contains view state (graph, selection, zoom)
- Browser back button works correctly
- Deep links restore full context

### INV-08: Auth Routes Protected
Dashboard routes require authentication.

**Verification:**
- Middleware checks JWT on `/(dashboard)/*`
- Unauthenticated → redirect to login
- No protected data leaks in HTML

### INV-09: Public Routes Accessible
Public routes work without auth.

**Verification:**
- `/(public)/*` routes load without session
- Registry, schema, templates browsable
- No auth prompts on public pages

---

## Performance Invariants

### INV-10: Canvas Renders at 60fps
Connectome maintains 60fps with up to 1000 nodes.

**Verification:**
- Performance budget: 16ms per frame
- Frame drops trigger warning in dev
- Large graphs use level-of-detail

### INV-11: Search Returns in 500ms
Semantic search completes within 500ms for typical queries.

**Verification:**
- API timeout at 5s
- Loading state shown immediately
- Results stream if backend supports

### INV-12: Initial Load Under 3s
Time to interactive under 3 seconds on 3G.

**Verification:**
- Bundle size budget enforced
- Critical CSS inlined
- Non-critical JS deferred

---

## API Contract Invariants

### INV-13: API Errors Are Structured
All API errors return consistent shape.

```typescript
interface APIError {
  error: string;      // Human-readable message
  code?: string;      // Machine-readable code
  details?: unknown;  // Additional context
}
```

**Verification:**
- Error responses always have `error` field
- HTTP status codes are semantic
- No stack traces in production

### INV-14: API Success Is Typed
All API success responses have documented shape.

**Verification:**
- TypeScript types for all responses
- No `any` in API layer
- Runtime validation on critical paths

### INV-15: SSE Reconnects Automatically
SSE connection restores after disconnect.

**Verification:**
- Exponential backoff on disconnect
- UI shows connection status
- No silent failures

---

## Security Invariants

### INV-16: No Secrets in Client
No API keys, private keys, or secrets in browser code.

**Verification:**
- Secrets only in server-side env vars
- No `NEXT_PUBLIC_SECRET_*` patterns
- Build fails if secrets detected in bundle

### INV-17: JWT Validated Server-Side
JWT tokens validated on server, not client.

**Verification:**
- Client sends JWT in httpOnly cookie
- API routes validate with L4
- No JWT parsing in browser

### INV-18: CORS Configured
CORS allows only expected origins.

**Verification:**
- Production allows only `platform.mindprotocol.ai`
- Dev allows localhost
- No wildcard in production

---

## Emerging Module Invariants

Each module should define its own invariants. Platform-level invariants apply to all.

| Module | Key Invariants |
|--------|----------------|
| `connectome` | INV-10 (60fps), INV-05 (colors) |
| `registry` | INV-01 (read-only), INV-06 (badges) |
| `auth` | INV-08 (protected), INV-17 (server-side) |
| `wallet` | INV-03 (isolation), INV-16 (no secrets) |

---

## Verification Methods

| Method | When Used |
|--------|-----------|
| TypeScript types | Compile time |
| Unit tests | Pre-commit |
| Integration tests | CI pipeline |
| E2E tests | Pre-deploy |
| Runtime assertions | Dev mode |
| Monitoring alerts | Production |
