# Platform Vision — Sync

```
LAST_UPDATED: 2025-01-06
UPDATED_BY: Claude (groundwork agent)
```

---

## Current State

Platform vision doc chain complete. **Manifesto integrated.** 4-layer architecture context documented. Vocabulary synced with L4 (mind-protocol).

**Recent additions:**
- `docs/manifesto/` — MIND_MANIFESTO.md + SYNC
- `templates/manifesto/` — Distributed to projects via `mind init`

**Doc chains completed:**
- `docs/registry/` — 8 files, full chain
- `docs/landing/` — 8 files, full chain (P0 priority)
- `docs/manifesto/` — 2 files (manifesto + sync)

---

## Doc Chain Status

| Document | Status | Key Content |
|----------|--------|-------------|
| OBJECTIVES | Complete | Ranked goals, tradeoffs, success criteria |
| PATTERNS | Complete | 4-layer architecture, repo ecosystem, design principles |
| VOCABULARY | Complete | L4 imports + platform terms, synced with mind-protocol |
| BEHAVIORS | Complete | Layer navigation, graph interaction, auth states |
| ALGORITHM | Complete | Core flows: graph loading, search, auth, marketplace |
| VALIDATION | Complete | 18 invariants covering data, UI, navigation, security |
| IMPLEMENTATION | Complete | Module architecture, data flow, API structure |
| HEALTH | Complete | Monitoring signals, health endpoints, error tracking |
| SYNC | This file | Current state, emerging modules |

---

## Emerging Modules

From vocabulary clustering and algorithm flows, these modules need their own doc chains:

### Priority 0: Critical (First)

| Module | Route | Why |
|--------|-------|-----|
| **landing** | `/` | First impression, explains platform purpose |

### Priority 1: High (Next Implementation)

| Module | Route | Why |
|--------|-------|-----|
| **auth** | `lib/auth/` | Required for all dashboard features |
| **registry** | `/registry` | First public L4 feature, validates integration |
| **schema-explorer** | `/schema` | Helps users understand the protocol |

### Priority 2: Medium

| Module | Route | Why |
|--------|-------|-----|
| **marketplace** | `/templates` | Enables L3 ecosystem participation |
| **wallet** | `/wallet` | Enables $MIND token usage |
| **citizen-dashboard** | `/citizen` | L1 personal graph management |
| **org-dashboard** | `/org` | L2 organization management |

### Priority 3: Low

| Module | Route | Why |
|--------|-------|-----|
| **membrane-ui** | `/membrane` | Advanced feature, requires membrane runtime |

### Already Complete

| Module | Route | Status |
|--------|-------|--------|
| **connectome** | `/connectome` | Implemented, has full doc chain |
| **registry** | `/registry` | Doc chain complete, awaiting implementation |
| **landing** | `/` | Doc chain complete, awaiting implementation |

---

## Module Doc Chain Template

Each emerging module should have:

```
docs/{module}/
├── OBJECTIVES_{Module}_Goals.md
├── PATTERNS_{Module}_Design.md
├── VOCABULARY_{Module}_Terms.md       # If adds new terms
├── BEHAVIORS_{Module}_UX.md
├── ALGORITHM_{Module}_Flows.md
├── VALIDATION_{Module}_Invariants.md
├── IMPLEMENTATION_{Module}_Code.md
├── HEALTH_{Module}_Monitoring.md
└── SYNC_{Module}_State.md
```

---

## Next Actions

### Immediate
1. Create `docs/landing/` doc chain (P0)
2. Create `docs/auth/` doc chain
3. Implement landing page

### This Sprint
4. Implement `/api/registry/*` routes
5. Create `docs/schema-explorer/` doc chain
6. Implement registry UI components
7. Add auth middleware

### Backlog
- Marketplace doc chain and implementation
- Wallet integration
- Dashboard implementations
- Membrane UI

---

## Vocabulary Contributions

Platform adds these terms to the Mind Protocol ecosystem:

### To propose to L4 (mind-protocol)

| Term | Definition | Rationale |
|------|------------|-----------|
| **Marketplace** | L3 template browser and contribution UI | Standard term for ecosystem participation |
| **Pull** | Import template from L3 to L2 | Verb for template acquisition |
| **Contribution** | Template submission to L3 | Verb for ecosystem giving |

### Platform-only terms (not for L4)

| Term | Definition |
|------|------------|
| Connectome | Graph visualization module |
| Canvas | Rendering surface |
| Stepper Mode | Debug traversal mode |
| Control Surface | Header controls |

---

## Architecture Decisions

### ADR-001: Browser-Safe Code
**Decision:** Inline browser code rather than import from mind-mcp.
**Rationale:** mind-mcp uses Node.js modules (fs, child_process) that can't run in browser.
**Consequence:** Some code duplication; need browser-safe exports in mind-mcp eventually.

### ADR-002: Canvas over WebGL
**Decision:** Use Canvas 2D for Connectome, not WebGL.
**Rationale:** Simpler, debuggable, good enough for 1000+ nodes.
**Consequence:** May need WebGL if we support 10k+ nodes.

### ADR-003: API Routes as Proxy
**Decision:** API routes proxy to backend rather than direct calls.
**Rationale:** Enables server-side auth, CORS handling, error normalization.
**Consequence:** Additional latency; but better security and control.

---

## Open Questions

1. **Auth flow:** JWT from L4? Wallet signature? OAuth?
2. **Wallet integration:** Direct Solana RPC or via L4 API?
3. **Real-time:** SSE for all updates or WebSocket for specific features?
4. **Offline support:** Cache registry/schema for offline browsing?

---

## Handoff Notes

**For agents continuing this work:**
- Vision doc chain is complete in `docs/vision/`
- **Manifesto integrated** — see `docs/manifesto/MIND_MANIFESTO.md`
- Emerging modules identified with priorities
- Next step: Implement auth flow
- Then: Registry UI implementation

**Key context:**
- **Every feature should align with the manifesto** — ask "rich ecology or narrow path?"
- Vocabulary synced with `mind-protocol/docs/TAXONOMY.md`
- L4 terms are imported, platform terms are local
- Browser code must be self-contained (no mind-mcp imports)
- Manifesto distributed to projects via `templates/manifesto/`
