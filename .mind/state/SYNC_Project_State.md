# mind-platform — Sync: Current State

```
LAST_UPDATED: 2025-12-28
UPDATED_BY: claude
STATUS: DESIGNING
```

---

## CURRENT STATE

mind-platform is the frontend + L3 (Ecosystem) layer for Mind Protocol. Contains the web UI, shared templates, and organization-level coordination.

**Reality check:** Extensive Connectome UI components exist with full documentation chains, but the core runtime files that drive them are NOT implemented. The app cannot run without `app/connectome/lib/` files.

---

## MATURITY

**What's canonical (documented + implemented):**
- Connectome UI components (node_kit, edge_kit, flow canvas, log panel, health panel)
- Extensive documentation for all connectome modules
- Next.js app shell and route structure

**What's documented but NOT implemented:**
- `app/connectome/lib/` — runtime engine, state store, event model
- `app/api/` — SSE, search, graph endpoints
- `lib/mind-client.ts` — L4 WebSocket + GraphQL client

**What's skeleton/placeholder:**
- Dashboard pages (org, membrane, citizen, wallet)
- Public pages (templates, schema, registry, docs)
- L3 ecosystem logic (federation, contributions)

---

## KNOWN ISSUES

| Issue | Severity | Area | Notes |
|-------|----------|------|-------|
| Runtime lib missing | **BLOCKER** | `app/connectome/lib/` | State store, runtime engine not created |
| API routes missing | critical | `app/api/` | No endpoints for SSE, search, graph |
| L4 client empty | high | `lib/mind-client.ts` | WebSocket + GraphQL not implemented |
| L3 stubs empty | medium | `l3/` | federation/contributions are empty files |
| SYNC was outdated | fixed | `.mind/state/` | Now reflects reality |

---

## ARCHITECTURE ALIGNMENT

Per `mind-protocol-architecture-v1.md`:

| Architecture Component | Platform Role | Status |
|------------------------|---------------|--------|
| L4 connection | WebSocket client in `lib/mind-client.ts` | ❌ Not started |
| L3 ecosystem | Templates browser, federation | 🔲 Stubs only |
| Connectome | Graph visualization | 🟡 UI built, runtime missing |
| Dashboard | Citizens, org, wallet, graph | 🔲 Skeletons |

---

## TODO

### BLOCKER — Must fix before app runs

- [ ] Create `app/connectome/lib/zustand_connectome_state_store_with_atomic_commit_actions.ts`
- [ ] Create `app/connectome/lib/next_step_gate_and_realtime_playback_runtime_engine.ts`
- [ ] Create supporting lib files (event model, step script, duration policy)

### High Priority — Core functionality

- [ ] Create `app/api/sse/route.ts` — SSE endpoint for telemetry
- [ ] Create `app/api/connectome/search/route.ts` — Semantic search
- [ ] Create `app/api/connectome/graph/route.ts` — Graph loading
- [ ] Create `app/api/connectome/graphs/route.ts` — Available graphs list
- [ ] Implement `lib/mind-client.ts` — L4 WebSocket + GraphQL

### Medium Priority — Platform features

- [ ] Implement dashboard pages (org, membrane, citizen, wallet)
- [ ] Implement public pages (templates, schema, registry)
- [ ] Implement L3 federation (publish, pull)
- [ ] Implement L3 contributions (submit, review)

### Low Priority — Polish

- [ ] Add keyboard shortcuts to Connectome
- [ ] Add realtime telemetry adapter
- [ ] Add authentication
- [ ] Add template marketplace

---

## AREAS

| Area | Status | Files | Description |
|------|--------|-------|-------------|
| `app/connectome/components/` | 🟡 UI built | 22 files | React components, need runtime |
| `app/connectome/lib/` | ❌ Missing | 0 files | Runtime engine, state store |
| `app/api/` | ❌ Missing | 0 files | API routes needed |
| `app/(dashboard)/` | 🔲 Skeleton | 4 pages | Placeholder pages |
| `app/(public)/` | 🔲 Skeleton | 5 pages | Placeholder pages |
| `l3/` | 🔲 Empty | 4 files | Empty stubs |
| `lib/` | 🔲 Empty | 1 file | mind-client.ts is empty |
| `docs/` | ✅ Extensive | 80+ files | Full documentation chains |

---

## TECH STACK

- **Framework:** Next.js 14+ (App Router)
- **Styling:** Custom CSS (not Tailwind yet)
- **State:** Zustand (planned, not implemented)
- **Graph Viz:** @xyflow/react (React Flow)
- **API:** GraphQL to L4 (not implemented)
- **Realtime:** WebSocket from L4 (not implemented)

---

## HANDOFF: FOR AGENTS

**Next step:** Implement `app/connectome/lib/` files following the IMPLEMENTATION docs.

**Key files to read:**
- `docs/connectome/state_store/IMPLEMENTATION_*.md`
- `docs/connectome/runtime_engine/IMPLEMENTATION_*.md`
- `docs/connectome/event_model/IMPLEMENTATION_*.md`

**Watch out for:**
- Components import from lib files that don't exist
- Documentation describes intended behavior, not current reality
- The SYNC files in `docs/connectome/*/` are more current than this project-level SYNC was

---

## HANDOFF: FOR HUMAN

**Executive summary:**
Connectome has extensive UI and docs but the runtime core (`app/connectome/lib/`) was never implemented. App cannot run.

**Decisions needed:**
1. Implement missing lib files to make Connectome functional?
2. Or pivot to a simpler approach first?
3. Priority: Connectome vs L4 integration vs L3 ecosystem?

**Concerns:**
- Gap between documentation ambition and implementation reality
- 80+ doc files for features that don't work yet

---

## RECENT CHANGES

### 2025-12-28: SYNC corrected to reflect reality

- **What:** Updated this SYNC to accurately describe project state
- **Why:** Previous SYNC said "skeleton only" but reality is more nuanced — extensive UI exists but runtime is missing
- **Impact:** Clear path forward now visible

### 2024-12-28: Repo Creation

- **What:** Created from ngram split
- **Why:** Platform (UI + L3) is separate from client and protocol
- **Impact:** Clean frontend repo with extensive docs carried over

---

## CROSS-REPO COORDINATION

**Agents are allowed to work across all 4 repos.** This is intentional — the repos form a single system.

### Repo Map

| Repo | Layer | Path | Access |
|------|-------|------|--------|
| `mind-mcp` | L1 Client | `/home/mind-protocol/mind-mcp` | open source |
| `mind-protocol` | L4 Law | `/home/mind-protocol/mind-protocol` | open source |
| `mind-platform` | L3 + UI | `/home/mind-protocol/mind-platform` | open source |
| `mind-ops` | Ops | `/home/mind-protocol/mind-ops` | private |

### Coordination Hub: mind-ops

**`mind-ops` is the main cross-repo organization point.**

- Cross-repo issues go in `mind-ops/runbooks/cross-repo/`
- Deployment orchestration in `mind-ops/ci/`
- Shared secrets configuration in `mind-ops/secrets/`
- Integration tests that span repos in `mind-ops/tests/integration/`

### This Repo's Role

**mind-platform is the UI + L3 ECOSYSTEM:**
- Web interface to the Mind Protocol
- L3 templates (shared patterns, procedures, skills)
- Organization management
- Public graph browser

**Dependencies:**
- Consumes API from `mind-protocol/api/`
- Uses schema types from `mind-protocol/l4/schema/`
- Connects to L4 via WebSocket (implemented in `mind-ops`)

### Sync Protocol

When working on platform features:
1. Check if API exists in `mind-protocol/api/`
2. If not, implement API there first
3. Then implement UI here
4. Update both SYNCs noting the coordination
