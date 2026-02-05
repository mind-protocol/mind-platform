# Registry Module — Sync

Current state and handoff notes.

```
LAST_UPDATED: 2026-02-05
UPDATED_BY: Claude (agent)
STATUS: PARTIALLY IMPLEMENTED
```

---

## Current State

**Citizen registration implemented.** Registration flow (form → FalkorDB node → confirmation) is live. Registry list includes CITIZEN type alongside AGENT.

| Document | Status |
|----------|--------|
| OBJECTIVES | Complete |
| PATTERNS | Complete |
| BEHAVIORS | Complete |
| ALGORITHM | Complete |
| VALIDATION | Complete |
| IMPLEMENTATION | Complete |
| HEALTH | Complete |
| SYNC | This file |

---

## Implementation Status

### Files Created (Registration Flow)

| File | Status | Notes |
|------|--------|-------|
| `app/api/register/route.ts` | **Implemented** | POST endpoint, creates CITIZEN Actor in FalkorDB |
| `app/(public)/register/page.tsx` | **Implemented** | Form + confirmation, matches site design |
| `app/(public)/self/page.tsx` | **Edited** | Step 5 CTA now links to /register |
| `app/(public)/components/nav/TopNav.tsx` | **Edited** | Register link added between self.md and Connectome |
| `app/api/registry/citizens/route.ts` | **Edited** | Now queries CITIZEN + AGENT types |

### Files to Create (Remaining)

| File | Status | Priority |
|------|--------|----------|
| `app/(public)/registry/page.tsx` | Placeholder exists | High |
| `app/(public)/registry/citizens/[id]/page.tsx` | Not created | High |
| `app/(public)/registry/orgs/[id]/page.tsx` | Not created | High |
| `app/(public)/registry/components/*` | Not created | High |
| `app/(public)/registry/lib/types.ts` | Not created | High |
| `app/(public)/registry/lib/api.ts` | Not created | High |
| `app/api/registry/orgs/route.ts` | Not created | High |
| `app/api/registry/search/route.ts` | Not created | Medium |
| `app/api/registry/health/route.ts` | Not created | Medium |

### Shared Components

| Component | Location | Status |
|-----------|----------|--------|
| VerificationBadge | `components/layer/` | Not created |
| VERIFICATION_COLORS | `lib/constants/colors.ts` | Not created |

---

## Open Questions

### `@mind:escalation` — L4 API Shape

The registry doc chain assumes REST-like L4 API endpoints:
- `GET /registry/citizens`
- `GET /registry/citizens/:id`
- `GET /registry/orgs`
- `GET /registry/orgs/:id`

**Actual L4 API may differ.** Need to verify with L4 implementation:
1. Does L4 expose REST endpoints?
2. Or do we need to query the graph directly?
3. What's the response shape?

`@mind:proposition` — Create mock L4 responses for development while L4 API is finalized. This unblocks UI work.

### `@mind:escalation` — Priority Adjustment

User indicated landing page is priority 0.

Current priority order should be:
1. **P0: Landing page** — First impression
2. **P1: Registry, auth, schema-explorer** — Core features
3. **P2: Marketplace, wallet, dashboards** — Ecosystem features

---

## Dependencies

| Dependency | Status | Blocks |
|------------|--------|--------|
| L4 API endpoints | Unknown | API routes |
| Design tokens | Not created | Badge colors |
| Shared components | Not created | VerificationBadge |
| react-query (optional) | Not installed | Data fetching |

---

## Next Actions

### Immediate (Before Implementation)

1. Verify L4 API shape
2. Create shared design tokens (`lib/constants/colors.ts`)
3. Create VerificationBadge component

### Implementation Order

1. Types (`lib/types.ts`)
2. API routes (with mock data if L4 unavailable)
3. API client (`lib/api.ts`)
4. List page (`page.tsx`)
5. Entity cards
6. Detail pages
7. Search
8. Filters

### After Implementation

1. Add health endpoint
2. Add error tracking
3. E2E tests

---

## Handoff Notes

**For agents continuing this work:**

- Registry is a read-only browser for L4 data
- Verification state is derived from L4 link properties (see ALGORITHM)
- Badge colors must match platform design tokens (see VALIDATION)
- Landing page should be built first per user priority

**Key context:**
- L4 API shape is unknown — may need mock data
- Registry is public (no auth required)
- Shared VerificationBadge component should be reusable by other modules

---

## Related

- `docs/vision/SYNC_Platform_Vision.md` — Platform state
- `docs/auth/` — Auth module (to be created)
- `docs/landing/` — Landing page (P0, to be created)
