# Project — Sync: Current State

```
LAST_UPDATED: 2025-12-29
UPDATED_BY: Claude (agent)
```

---

## CURRENT STATE

Mind Platform is the Next.js frontend for the Mind Protocol ecosystem. The platform serves as the **UI layer** for a 4-layer architecture:

- **L1 (Citizen):** Personal agent graphs
- **L2 (Organization):** Team-shared knowledge
- **L3 (Ecosystem):** Templates and procedures
- **L4 (Protocol):** Global registry and schema

The Connectome graph visualization is functional. Vision documentation is complete. Module doc chains created for **landing** (P0) and **registry**.

**Documentation:**
- `docs/vision/` — 9-file platform vision doc chain (complete)
- `docs/landing/` — 8-file landing page doc chain (complete, P0 priority)
- `docs/registry/` — 8-file registry module doc chain (complete)
- `docs/connectome/` — existing implementation docs

All browser-side code is self-contained — no dependencies on mind-mcp's Node.js modules.

---

## ACTIVE WORK

### Landing Page (Complete)

- **Area:** `app/(public)/page.tsx`, `app/(public)/components/landing/`
- **Status:** implemented
- **Owner:** agent
- **Context:** Hero, HowItWorks (4-layer cards), WhatYouCanDo, LiveStats sections. Uses design tokens.

### Design Theme (Complete)

- **Area:** `lib/design/`
- **Status:** implemented
- **Owner:** agent
- **Context:** theme.ts (colors, typography, spacing), utils.ts (color utilities), index.ts (unified export). "Tokens" name reserved for $MIND Solana token.

### Next: Navigation + Footer

- **Area:** `app/(public)/components/nav/`
- **Status:** pending
- **Owner:** agent
- **Context:** TopNav and Footer components for public layout.

---

## RECENT CHANGES

### 2025-12-29: Updated Doc Templates with Nature Vocabulary

- **What:** Fixed VOCABULARY_TEMPLATE and HEALTH_TEMPLATE to use proper link `nature` vocabulary instead of custom link types.
- **Why:** Schema has single `link` type with semantics in `nature` field. Templates were using `[OF]`, `[TARGET]` notation which doesn't exist.
- **Impact:** Templates now use `serves`, `concerns` nature verbs. HEALTH on_problem creates proper narrative nodes with links.
- **Files:** templates/docs/VOCABULARY_TEMPLATE.md, templates/docs/HEALTH_TEMPLATE.md, .mind/docs/*.md

### 2025-12-29: Membrane Procedures for Registry

- **What:** Created membrane procedures (`registry_list_citizens.yaml`, `registry_list_orgs.yaml`) and deleted REST API routes.
- **Why:** User directive: "pas de calls api, que membrane". Data access through MCP procedures only.
- **Impact:** Registry fetches data via membrane procedures, not HTTP API.
- **Files:** .mind/procedures/registry_*.yaml, deleted app/api/registry/

### 2025-12-29: Documented L4 Registry Rules (P1-P9)

- **What:** Created PATTERNS_Registry_Rules.md documenting the 9 foundational registry rules.
- **Why:** Registry architecture principles need to be explicit and traceable.
- **Impact:** P1-P9 rules documented: registry=existence, JWT verification, hash routing, membrane only, etc.
- **Files:** docs/registry/PATTERNS_Registry_Rules.md

### 2025-12-29: Implemented Landing Page + Design Theme

- **What:** Created design theme system (lib/design/theme.ts) and landing page components (Hero, HowItWorks, WhatYouCanDo, LiveStats).
- **Why:** Landing page is P0. Design theme provides consistent styling. "Tokens" name reserved for $MIND.
- **Impact:** / route now shows full landing page. Design theme ready for use across modules.
- **Files:** lib/design/theme.ts, lib/design/utils.ts, app/(public)/components/landing/*.tsx

### 2025-12-29: Restructured Templates Directory

- **What:** Moved config files to templates/ root, kept MCP system prompts in templates/mcp/, created SYSTEM.md base template.
- **Why:** Cleaner separation between protocol configs and MCP-specific files.
- **Impact:** `mind init` copies templates/ to .mind/. MCP transforms SYSTEM.md → CLAUDE.md/GEMINI.md/AGENTS.md.

### 2025-12-29: Created Landing + Registry Doc Chains

- **What:** Full 8-file doc chains for landing page and registry module.
- **Why:** User indicated landing is P0 priority. Registry is first public L4 feature.
- **Impact:** Clear implementation blueprints for both modules. Vocabulary synced with L4 (mind-protocol).

### 2025-12-29: Created Platform Vision Doc Chain

- **What:** Full 9-file doc chain in `docs/vision/` covering platform objectives, patterns, vocabulary, behaviors, algorithms, invariants, implementation, health, sync.
- **Why:** Document the platform's role in the 4-layer Mind Protocol ecosystem.
- **Impact:** Emerging modules identified with priorities. Architecture decisions documented.

### 2025-12-29: Removed System Map, Made Browser-Safe

- **What:** Removed all System Map visualization components. Inlined browser-safe lib files.
- **Why:** User requested removing System Map entirely. Browser bundle cannot import Node.js modules.
- **Impact:** Connectome UI shows only Graph Explorer. Build passes.

### 2025-12-29: Created API Routes

- **What:** Added `/api/connectome/graphs`, `/api/connectome/graph`, `/api/connectome/search`, `/api/connectome/tick`, `/api/sse`
- **Why:** Browser code calls backend via HTTP, not imports.
- **Impact:** API routes proxy to Python backend

---

## KNOWN ISSUES

| Issue | Severity | Area | Notes |
|-------|----------|------|-------|
| No backend running | Low | `api/` | API routes return empty/default when backend offline |
| Placeholder pages | Low | `app/(dashboard)/` | citizen, membrane, org, wallet are empty placeholders |

---

## HANDOFF: FOR AGENTS

**Likely VIEW for continuing:** groundwork (implementation tasks)

**Current focus:** End-to-end testing with running database

**Key context:**
- Browser lib files are INLINED (not imported from mind-mcp) because mind-mcp uses Node.js modules
- API routes at `/api/connectome/*` proxy to Python backend at `$CONNECTOME_BACKEND_URL` or `http://localhost:8765`
- Canvas renderer uses D3 force simulation, not ReactFlow

**Watch out for:**
- Don't try to import from `@mind-protocol/connectome` in browser code — those modules use fs/child_process
- SSE route must have `export const dynamic = 'force-dynamic'`

---

## HANDOFF: FOR HUMAN

**Executive summary:**
Connectome frontend builds and runs. System Map visualization removed per your request. UI now focuses on graph exploration (semantic search, node visualization). Backend integration ready via API routes.

**Decisions made recently:**
- Inlined browser-safe versions of state store and manifest rather than fixing mind-mcp's browser exports (faster path)
- Removed reactflow CSS import (not using ReactFlow, using Canvas 2D with D3)

**Needs your input:**
- Do you want to run the dev server and test with a database?
- Should we clean up the placeholder pages in (dashboard) and (public) route groups?

**Concerns:**
- mind-mcp/connectome exports are not browser-safe (they import fs/path). If you want platform to import from mind-mcp again, those exports need to be restructured.

---

## TODO

### Immediate (This Sprint)

- [x] Create `lib/design/` design theme
- [x] Implement landing page (P0)
- [x] Create TopNav component
- [x] Create Footer component
- [x] Load Inter + JetBrains Mono fonts
- [x] Create membrane procedures for registry

### High Priority

- [ ] Implement registry UI with membrane procedures
- [ ] Create `docs/auth/` doc chain
- [ ] Test end-to-end with running FalkorDB database

### Backlog

- [ ] Create `docs/schema-explorer/` doc chain
- [ ] Create browser-safe export entry point in mind-mcp
- [ ] Add analytics to landing page
- [ ] Add error states for offline backend

---

## CONSCIOUSNESS TRACE

**Project momentum:**
Good. Major refactor completed. Build passes. Ready for manual testing.

**Architectural concerns:**
The browser/server split in mind-mcp is not clean — schema.ts imports fs. Should consider splitting into `browser/` and `server/` entry points.

**Opportunities noticed:**
Graph Explorer could benefit from keyboard shortcuts for navigation.

---

## AREAS

| Area | Status | SYNC |
|------|--------|------|
| `app/connectome/` | functional | this file |
| `app/api/` | functional | this file |

---

## MODULE COVERAGE

**Mapped modules:**
| Module | Code | Docs | Maturity |
|--------|------|------|----------|
| connectome | `app/connectome/` | `docs/connectome/` | DESIGNING |
| landing | `app/(public)/` | `docs/landing/` | CANONICAL |
| registry | `app/(public)/registry/` | `docs/registry/` | DESIGNING |
| vision | - | `docs/vision/` | DESIGNING |
| design-language | `lib/design/` | `docs/design-language/` | CANONICAL |
| ux | - | `docs/ux/` | DESIGNING |
| api-routes | `app/api/` | - | DESIGNING |

**Unmapped code:**
- `app/(dashboard)/` - placeholder route group (citizen, org, wallet, membrane)
- `app/(public)/schema/` - placeholder (needs schema-explorer doc chain)
- `app/(public)/marketplace/` - placeholder (renamed from templates)

## Init: 2025-12-29 02:13

| Setting | Value |
|---------|-------|
| Version | v0.1.0 |
| Database | falkordb |
| Graph | mind_platform |

**Steps completed:** ecosystem, runtime, ai_configs, skills, database_config, database_setup, file_ingest, seed_inject, env_example, mcp_config, gitignore, overview, embeddings

---

## Init: 2025-12-29 03:12

| Setting | Value |
|---------|-------|
| Version | v0.0.0 |
| Database | falkordb |
| Graph | mind_platform |

**Steps completed:** ecosystem, runtime, ai_configs, skills, database_config, database_setup, file_ingest, seed_inject, env_example, mcp_config, gitignore, overview, embeddings

---

## Init: 2025-12-29 03:24

| Setting | Value |
|---------|-------|
| Version | v0.0.0 |
| Database | falkordb |
| Graph | mind_platform |

**Steps completed:** ecosystem, runtime, ai_configs, skills, database_config, database_setup, file_ingest, seed_inject, env_example, mcp_config, gitignore, overview, embeddings

---

## Init: 2025-12-29 03:59

| Setting | Value |
|---------|-------|
| Version | v0.0.0 |
| Database | falkordb |
| Graph | mind_platform |

**Steps completed:** ecosystem, runtime, ai_configs, skills, database_config, database_setup, file_ingest, seed_inject, env_example, mcp_config, gitignore, overview, embeddings

---

## Init: 2025-12-29 17:51

| Setting | Value |
|---------|-------|
| Version | v0.0.0 |
| Database | falkordb |
| Graph | mind_platform |

**Steps completed:** ecosystem, runtime, ai_configs, skills, database_config, database_setup, file_ingest, seed_inject, env_example, mcp_config, gitignore, overview, embeddings

---

## Init: 2025-12-29 18:02

| Setting | Value |
|---------|-------|
| Version | v0.0.0 |
| Database | falkordb |
| Graph | mind_platform |

**Steps completed:** ecosystem, runtime, ai_configs, skills, database_config, database_setup, file_ingest, seed_inject, env_example, mcp_config, gitignore, overview, embeddings

---

## Init: 2025-12-29 18:02

| Setting | Value |
|---------|-------|
| Version | v0.0.0 |
| Database | falkordb |
| Graph | mind_platform |

**Steps completed:** ecosystem, runtime, ai_configs, skills, database_config, database_setup, file_ingest, seed_inject, env_example, mcp_config, gitignore, overview, embeddings

---

## Init: 2025-12-29 18:15

| Setting | Value |
|---------|-------|
| Version | v0.0.0 |
| Database | falkordb |
| Graph | mind_platform |

**Steps completed:** ecosystem, runtime, ai_configs, skills, database_config, database_setup, file_ingest, seed_inject, env_example, mcp_config, gitignore, overview, embeddings

---

## Init: 2025-12-29 18:31

| Setting | Value |
|---------|-------|
| Version | v0.0.0 |
| Database | falkordb |
| Graph | mind_platform |

**Steps completed:** ecosystem, runtime, ai_configs, skills, database_config, database_setup, file_ingest, seed_inject, env_example, mcp_config, gitignore, overview, embeddings

---

## Init: 2025-12-29 18:44

| Setting | Value |
|---------|-------|
| Version | v0.0.0 |
| Database | falkordb |
| Graph | mind_platform |

**Steps completed:** ecosystem, runtime, ai_configs, skills, database_config, database_setup, file_ingest, seed_inject, env_example, mcp_config, gitignore, overview, embeddings

---

## Init: 2025-12-29 18:50

| Setting | Value |
|---------|-------|
| Version | v0.0.0 |
| Database | falkordb |
| Graph | mind_platform |

**Steps completed:** ecosystem, runtime, ai_configs, skills, database_config, database_setup, file_ingest, seed_inject, env_example, mcp_config, gitignore, overview, embeddings

---

## Init: 2025-12-29 18:54

| Setting | Value |
|---------|-------|
| Version | v0.0.0 |
| Database | falkordb |
| Graph | mind_platform |

**Steps completed:** ecosystem, runtime, ai_configs, skills, database_config, database_setup, file_ingest, seed_inject, env_example, mcp_config, gitignore, overview, embeddings

---

## Init: 2025-12-29 19:38

| Setting | Value |
|---------|-------|
| Version | v0.0.0 |
| Database | falkordb |
| Graph | mind_platform |

**Steps completed:** ecosystem, runtime, ai_configs, skills, database_config, database_setup, file_ingest, seed_inject, env_example, mcp_config, gitignore, overview, embeddings

---
