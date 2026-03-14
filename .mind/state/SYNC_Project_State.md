# Project — Sync: Current State

```
LAST_UPDATED: 2026-03-14
UPDATED_BY: Claude Opus 4.6 (groundwork agent)
```

> **Deployment configuration created for Render + local dev.** `render.yaml` blueprint deploys
> FalkorDB (private Docker service with persistent disk) and L4 Registry (public FastAPI web service).
> `docker-compose.yml` for local development. `seed.py` populates FalkorDB from `data/registry.json`
> with v2.0 schema Actor nodes, Thing nodes, and LINK relationships.

---

## CURRENT STATE

Mind Platform is the Next.js frontend for the Mind Protocol ecosystem. The platform serves as the **UI layer** for a 4-layer architecture:

- **L1 (Citizen):** Personal agent graphs
- **L2 (Organization):** Team-shared knowledge
- **L3 (Ecosystem):** Templates and procedures
- **L4 (Protocol):** Global registry and schema

**The Manifesto is now integrated.** Every feature should serve the rich ecology, not the narrow path.

The Connectome graph visualization is functional. Vision documentation is complete. Module doc chains created for **landing** (P0) and **registry**.

**Documentation:**
- `docs/manifesto/` — MIND_MANIFESTO.md + SYNC (the foundational vision)
- `docs/vision/` — 9-file platform vision doc chain (complete)
- `docs/landing/` — 8-file landing page doc chain (complete, P0 priority)
- `docs/registry/` — 8-file registry module doc chain (complete)
- `docs/connectome/` — existing implementation docs
- `templates/manifesto/` — Distributed to projects via `mind init`

All browser-side code is self-contained — no dependencies on mind-mcp's Node.js modules.

---

## ACTIVE WORK

## MASTER TODO — 5-Force Sprint Orchestration

This section is the canonical assignment board consumed during Context Cascade phase 1.

- **Force 1 (DONE 2026-03-14):** Readiness audit of manifesto + framework references in onboarding prompts.
  - Evidence: the master prompt now references explicit manifesto sources (`.mind/manifesto/*.md` + `docs/manifesto/*.md`) and explicit protocol files (`.mind/FRAMEWORK.md`, `.mind/SYSTEM.md`, `.mind/STYLE.md`, `.mind/PRINCIPLES.md`).
- **Force 2 (DONE 2026-03-14):** Documentation synchronization for orchestration workflows and sprint bootstrap artifacts.
  - Evidence: the sprint template is canonical in `templates/prompts/` and synchronized with project SYNC + recent changes log.
- **Force 3 (DONE 2026-03-14):** Validate skills/actors alignment for execution loops (plan → execute → test → commit).
  - Evidence: Phase 3 keeps the skills+agents requirement and the per-task commit loop.
- **Force 4 (DONE 2026-03-14):** Verify escalation/proposition marker usage in procedures and templates.
  - Evidence: marker presence verified across templates and runtime protocol files (`update_sync.yaml`, skills, procedure templates).
- **Force 5 (DONE 2026-03-14):** Validate commit/PR cadence across autonomous sprint sessions.
  - Evidence: Phase 4 now requires final status check, SYNC update, and explicit PR creation with validation commands.

@mind:TODO If a new 5-force sprint starts, reopen these items with new owners/dates instead of duplicating the section.

### Messaging Bots — Telegram + WhatsApp (New)

- **Area:** `lib/messaging/`, `app/api/webhooks/telegram/`, `app/api/webhooks/whatsapp/`
- **Status:** implemented
- **Owner:** agent
- **Context:** Dual-channel messaging integration. Messages received on Telegram or WhatsApp are relayed to MANEMUS backend (`/chat/send`). If MANEMUS is offline, falls back to direct Claude API call. Uses Meta WhatsApp Cloud API (mind@mindprotocol.ai account). Thread IDs are prefixed per channel (`tg_` / `wa_`).
- **Files:**
  - `lib/messaging/chat_relay_service.ts` — Core relay logic (MANEMUS + Claude fallback)
  - `lib/messaging/telegram_bot_api_client.ts` — Telegram Bot API client
  - `lib/messaging/whatsapp_cloud_api_client.ts` — WhatsApp Cloud API client
  - `app/api/webhooks/telegram/route.ts` — Telegram webhook (POST: messages, GET: setup)
  - `app/api/webhooks/whatsapp/route.ts` — WhatsApp webhook (GET: verify, POST: messages)
- **Env vars required:** `TELEGRAM_BOT_TOKEN`, `WHATSAPP_PHONE_NUMBER_ID`, `WHATSAPP_ACCESS_TOKEN`, `WHATSAPP_VERIFY_TOKEN`, `ANTHROPIC_API_KEY`, `NEXT_PUBLIC_BASE_URL`

### Landing Page — Manifesto-Aligned (Complete)

- **Area:** `app/(public)/page.tsx`, `app/(public)/components/landing/`, `app/(public)/manifesto/`
- **Status:** implemented
- **Owner:** agent
- **Context:** Redesigned to declare a position, not sell features. Sections: Hero (declaration), TheFork (Narrow Path vs Rich Ecology), TheInsight ($MIND as crystallized alignment), WhoThisIsFor (four audience doors), TheInvitation (declaration). Full manifesto at /manifesto.

### Design Theme (Complete)

- **Area:** `lib/design/`
- **Status:** implemented
- **Owner:** agent
- **Context:** theme.ts (colors, typography, spacing), utils.ts (color utilities), index.ts (unified export). "Tokens" name reserved for $MIND Solana token.

### Footer — Minimal (Complete)

- **Area:** `app/(public)/components/nav/Footer.tsx`
- **Status:** implemented
- **Owner:** agent
- **Context:** Minimal footer with Manifesto, Docs, GitHub, Twitter links. "Venice is values." signature.

---

## RECENT CHANGES

### 2026-03-14: Render Deployment Configuration + Seed Script

- **What:** Created deployment infrastructure for FalkorDB + L4 Registry on Render, local docker-compose for development, and a seed script to populate the graph from registry.json.
- **Why:** L4 Registry backend needs to be deployable to production (Render) and testable locally with real data.
- **Impact:**
  - New: `render.yaml` — Render Blueprint defining FalkorDB (pserv, persistent disk at `/var/lib/falkordb/data`) and L4 Registry (web service, health check at `/health`)
  - New: `Dockerfile.falkordb` — Thin wrapper over `falkordb/falkordb:latest` for Render Docker builds
  - New: `services/l4-registry/docker-compose.yml` — Local dev stack (FalkorDB + L4 Registry, healthcheck, named volume)
  - New: `services/l4-registry/seed.py` — Seeds 286 citizens, 41 orgs, capabilities, and relationships (belongs_to, has_capability, verified_by) with v2.0 schema fields
  - New: `services/l4-registry/README.md` — Service documentation with local dev, deployment, and architecture sections

### 2026-03-14: L4 Registry Backend Code Review and Fixes

- **What:** Reviewed all 7 files in `services/l4-registry/` against v2.0 schema, FalkorDB API, TypeScript types, and algorithm docs. Fixed 6 issues.
- **Why:** Code review for correctness before production deployment.
- **Fixes applied:**
  1. **queries.py**: Changed all `:link` relationship labels to `:LINK` (uppercase) — FalkorDB is case-sensitive, rest of codebase uses `:LINK`
  2. **queries.py**: Added input validation to `build_citizen_filters` and `build_org_filters` — status validated against enum, org ID sanitized to prevent Cypher injection
  3. **transforms.py**: Fixed `_epoch_to_date` numeric string branch — was returning raw integer string instead of converting to YYYY-MM-DD date
  4. **Dockerfile**: Added non-root user (`appuser`), `chown`, and `USER` directive for production security
  5. **types.ts**: Added missing fields to `Org` interface (`description`, `type`, `color`, `github_repository`, `org_type`, `universe`) to match Python model. Added `CitizenDetail` and `OrgDetail` interfaces
  6. **main.py**: Member creation in `get_org` now uses `_safe_status` and `_epoch_to_date` directly instead of raw values, removed orphaned `_member_date` helper. Added ValueError handling for filter validation (returns 400)
- **Verified correct:** db.py FalkorDB connection pattern, derive_verification_state algorithm matches Flow 4, Pydantic models complete, .env.example matches all env vars

### 2026-03-14: Register Route Updated to v2.0 Schema

- **What:** Updated `app/api/register/route.ts` to use v2.0 NodeBase fields instead of legacy fields.
- **Why:** Schema v2.0 migration required all node creation to use the new field set. The register route was still writing non-schema fields (`purpose`, `status`, `layer`, `created_at` as ISO string).
- **Impact:**
  - Removed: `purpose` (moved to `content`), `status` (not on NodeBase in v2.0), `layer` (not in v2.0), `created_at` (ISO string)
  - Added: `node_type: "actor"`, `content`, `synthesis`, `weight: 1.0`, `energy: 0.0`, `stability: 0.0`, `recency: 1.0`, `activation_count: 0`, `in_working_memory: false`, `created_at_s` (unix int), `updated_at_s` (unix int)
  - Response JSON updated: returns `content` and `created_at_s` instead of `purpose` and `created_at`
  - Validation logic unchanged (name length, Cypher injection protection, uniqueness check, auth check)
  - Type-checked clean against project tsconfig

### 2026-03-14: L4 Registry Backend Service Created

- **What:** Created Python FastAPI backend service at `services/l4-registry/` that serves registry data from FalkorDB graph database. Updated all Next.js API proxy routes to call the L4 backend instead of reading from static JSON.
- **Why:** The registry needs to read live data from the L4 graph (FalkorDB), not static JSON. Separation of concerns: Next.js is the L3 frontend, Python service is the L4 data layer.
- **Impact:**
  - New service: `services/l4-registry/` — 7 files (main.py, models.py, db.py, queries.py, transforms.py, Dockerfile, requirements.txt)
  - Endpoints: GET /health, GET /registry/citizens, GET /registry/citizens/{id}, GET /registry/orgs, GET /registry/orgs/{id}, GET /registry/search?q=
  - Updated: 4 existing Next.js API routes now proxy to L4 backend
  - New: 2 Next.js API routes (search, health) for L4 proxy
  - Env var: `L4_REGISTRY_URL` (default: `http://localhost:8766`)
  - Verification state derived from graph link properties (polarity + permanence) per ALGORITHM_Registry_Flows.md
  - No fallbacks: if L4 is down, proxy returns 503

### 2026-03-14: Schema v1.9.0 to v2.0 Migration

- **What:** Replaced schema.yaml (v1.9.0) with v2.0 in both `.mind/schema.yaml` and `templates/schema.yaml`. Deleted 5 obsolete SubEntity files.
- **Why:** v2.0 replaces SubEntity traversal model with Working Memory + 21 physics laws + 7 cognitive types + limbic system. SubEntity no longer exists.
- **Impact:**
  - Schema files updated: `.mind/schema.yaml`, `templates/schema.yaml`
  - Deleted: `.mind/skills/SKILL_Assess_SubEntity_Exploration_Quality_From_Logs.md`
  - Deleted: `templates/skills/SKILL_Assess_SubEntity_Exploration_Quality_From_Logs.md`
  - Deleted: `.mind/procedures/assess_exploration.yaml`
  - Deleted: `templates/procedures/assess_exploration.yaml`
  - Deleted: `.claude/skills/assess-subentity-exploration-quality-from-logs/` (entire directory)
- **Remaining work:**
  - `map.md` and `docs/map.md` contain stale SubEntity references (auto-generated, will refresh on next `mind overview`).

### 2026-03-14: One-shot batch on top 10 next items

- **What:** Executed a single batch over the previously listed next items by closing completed work, creating missing schema-explorer docs, adding Graph API skeleton/docs, and tightening landing metadata.
- **10 delivered items:**
  1. Verified registry UI implementation exists.
  2. Verified `docs/auth/` chain exists.
  3. Implemented schema explorer route.
  4. Created full `docs/schema-explorer/` chain.
  5. Added graph API route skeleton with explicit 501 status.
  6. Added `DOCS:` link in graph API route.
  7. Created full Graph API doc chain files (BEHAVIORS/ALGORITHM/VALIDATION/HEALTH/IMPLEMENTATION).
  8. Updated Graph API SYNC checkboxes and recent changes.
  9. Updated app_shell SYNC drift items to current reality.
  10. Added landing metadata/OG/Twitter tags.

### 2026-03-14: Added 5-Force Sprint Master Prompt Template

- **What:** Added an authoritative orchestration prompt template for parallel Codex sessions.
- **Why:** Provide a single reusable prompt artifact aligned with Context Cascade, @mind:TODO planning, and Never-stop escalation/proposition flow.
- **Impact:**
  - New template: `templates/prompts/PROMPT_Master_5_Force_Sprint_Orchestration.md`
  - Added `MASTER TODO — 5-Force Sprint Orchestration` section in project sync for force-specific assignment lookup.

### 2026-03-14: Closed Sprint Master TODO Force 1..5 Assignments

- **What:** Completed and closed all five sprint assignments captured in the MASTER TODO section.
- **Why:** The previous iteration created assignments but did not close them with explicit verification outcomes.
- **Impact:**
  - Force 1: onboarding prompt now points to explicit manifesto and protocol file paths.
  - Force 2: orchestration artifact + SYNC record are aligned and canonical.
  - Force 3: plan/execute/test/commit loop remains explicit in the prompt.
  - Force 4: escalation/proposition markers verified in procedures and skills.
  - Force 5: prompt now includes explicit finalization + PR cadence requirements.

### 2026-02-25: Telegram + WhatsApp Messaging Bots

- **What:** Added dual-channel messaging integration (Telegram Bot + WhatsApp Cloud API) with MANEMUS relay and Claude API fallback.
- **Why:** Enable Mind agent access from mobile (Android) via existing messaging apps — no app install needed.
- **Impact:**
  - New service: `lib/messaging/chat_relay_service.ts` — tries MANEMUS first, falls back to Claude API
  - New Telegram integration: webhook at `/api/webhooks/telegram`, bot API client, /start command
  - New WhatsApp integration: webhook at `/api/webhooks/whatsapp`, Meta Cloud API v21.0, read receipts
  - Thread isolation per channel: `tg_{userId}` and `wa_{phone}` prefixes
  - Updated `.env.mind.example` with all required env vars
- **Setup required:** Set env vars, call `GET /api/webhooks/telegram?setup=1` to register TG webhook, configure WhatsApp webhook URL in Meta Business dashboard.

### 2025-01-06: Landing Page Redesigned — Manifesto-Aligned

- **What:** Complete redesign of landing page from feature-focused to declaration-focused
- **Why:** "The page was selling a product. Now it declares a position." Aligns with MIND_MANIFESTO.md vision.
- **Impact:**
  - New sections: Hero (declaration), TheFork (two futures), TheInsight ($MIND), WhoThisIsFor (4 doors), TheInvitation
  - New route: `/manifesto` — full manifesto rendered as prose
  - Removed: HowItWorks, WhatYouCanDo, LiveStats, GraphPreview (technical focus)
  - Updated Footer: minimal with "Venice is values" signature
- **Tone:** Prose, not bullets. Conviction, not persuasion. Grave, sincere, determined.
- **Emotional arc:** Grief → Recognition → Hope → Invitation

### 2025-01-06: Manifesto Integrated

- **What:** Added MIND_MANIFESTO.md to platform and templates
- **Why:** The manifesto is the foundational vision — every feature should align with it
- **Impact:**
  - `docs/manifesto/MIND_MANIFESTO.md` — Core vision declaration
  - `docs/manifesto/SYNC_Manifesto.md` — Integration tracking
  - `templates/manifesto/MIND_MANIFESTO.md` — Distributed to projects via `mind init`
  - `README.md` — Updated with manifesto reference and vision section
  - `CLAUDE.md` — Added manifesto as required reading before building
  - `docs/vision/PATTERNS_Platform_Vision_And_Architecture.md` — Linked to manifesto
  - `docs/vision/SYNC_Platform_Vision.md` — Updated with manifesto status
- **Key principle:** "Every feature should serve the rich ecology, not the narrow path."

### 2025-12-30: Node ID Naming Convention Standardized

- **What:** Standardized all graph node IDs to `{TYPE}_{Name}` format (e.g., `AGENT_Witness`, `TASK_Fix_Naming`).
- **Why:** Consistent, scannable IDs designed for agent readability and embedding search.
- **Impact:**
  - Actor nodes: `AGENT_Witness`, `AGENT_Fixer`, `AGENT_Architect`, etc.
  - Node `type` field: uppercase prefix (e.g., `"AGENT"`)
  - Deprecated: old `agent_witness` lowercase format
  - Updated files: actors.py, names.py (renamed from subtypes.py), run.py
  - Published: mind-mcp v0.2.0 with naming changes
  - Created: requirements.txt with `mind-mcp>=0.2.0`
- **Terminology:**
  - `posture` → `subtype` (cognitive stance field)
  - `description` → `content` (purpose field)
  - Node ID: `{TYPE}_{Name}` (not node_type label)

### 2025-12-29: Capability Runtime Init Integration

- **What:** Implemented capability discovery and init integration.
- **Why:** Capabilities need to be copied to `.mind/capabilities/` at init time and their health checks need to be discoverable by MCP.
- **Implementation:**
  - `runtime/capability/` - MCP-side decorator, loader, registry, dispatch
  - `@check()` decorator with `Signal.healthy/degraded/critical()` returns
  - `triggers.*` builders: file, init, cron, git, ci, stream, graph, manual
  - Capabilities import from `runtime.capability` (single source of truth - no separate capabilities/runtime/)
  - `get_capabilities_path()` in mind-mcp/runtime/core_utils.py (sources from mind-platform)
  - `copy_capabilities_to_target.py` helper for init
  - Added step 2 in init.py: copies capabilities to `.mind/capabilities/`
- **Discovery:** MCP discovers capabilities with checks from `.mind/capabilities/*/runtime/checks.py`
- **Current status:** 3 capabilities have runtime checks (add-tests: 4, create-doc-chain: 4, investigate-runtime: 2)

### 2025-12-29: Created sync-state Capability

- **What:** Full 15-file capability in `capabilities/sync-state/` for state synchronization management.
- **Why:** Need structured capability to handle 4 sync-related problems from problems.yaml: STALE_SYNC, YAML_DRIFT, DOCS_NOT_INGESTED, MODULE_BLOCKED.
- **Impact:**
  - 9-file doc chain: OBJECTIVES, PATTERNS, VOCABULARY, BEHAVIORS, ALGORITHM, VALIDATION, IMPLEMENTATION, HEALTH, SYNC
  - 4 task templates: TASK_update_sync, TASK_regenerate_yaml, TASK_ingest_docs, TASK_unblock_module
  - 1 skill: SKILL_update_sync
  - 1 procedure: PROCEDURE_update_sync.yaml
  - Runtime code: checks.py with 4 health check functions (H1-H4)
  - HEALTH.md with 4 indicators and on_signal triggers for each problem type
  - Mixed execution: YAML_DRIFT and DOCS_NOT_INGESTED are automated, STALE_SYNC and MODULE_BLOCKED require agent
- **Files:** capabilities/sync-state/*

### 2025-12-29: Created maintain-links Capability

- **What:** Full 15-file capability in `capabilities/maintain-links/` for code-doc link maintenance.
- **Why:** Need structured capability to handle 2 link-related problems from problems.yaml: ORPHAN_DOCS, BROKEN_IMPL_LINK.
- **Impact:**
  - 9-file doc chain: OBJECTIVES, PATTERNS, VOCABULARY, BEHAVIORS, ALGORITHM, VALIDATION, IMPLEMENTATION, HEALTH, SYNC
  - 2 task templates: TASK_fix_orphan_docs, TASK_fix_impl_link
  - 1 skill: SKILL_fix_links
  - 1 procedure: PROCEDURE_fix_links.yaml
  - Runtime code: checks.py with 2 health check functions (H1: impl_link_validity, H2: orphan_doc_detection)
  - HEALTH.md with 2 indicators and on_signal triggers
  - Auto-resolution for simple renames (single file match)
  - Preserve-over-delete policy for ambiguous orphan situations
- **Files:** capabilities/maintain-links/*

### 2025-12-29: Created add-tests Capability

- **What:** Full 17-file capability in `capabilities/add-tests/` for test coverage management and invariant validation.
- **Why:** Need structured capability to handle 4 test-related problems from problems.yaml: MISSING_TESTS, INVARIANT_UNTESTED, TEST_NO_VALIDATES, HEALTH_FAILED.
- **Impact:**
  - 9-file doc chain: OBJECTIVES, PATTERNS, VOCABULARY, BEHAVIORS, ALGORITHM, VALIDATION, IMPLEMENTATION, HEALTH, SYNC
  - 4 task templates: TASK_add_tests, TASK_test_invariant, TASK_add_validates_markers, TASK_fix_health
  - 1 skill: SKILL_write_tests
  - 1 procedure: PROCEDURE_add_tests.yaml
  - Runtime code: checks.py with 4 health check functions (H1-H4)
  - HEALTH.md with 4 indicators and on_signal triggers
- **Files:** capabilities/add-tests/*

### 2025-12-29: Created fix-membrane Capability

- **What:** Full 17-file capability in `capabilities/fix-membrane/` for repairing broken procedure YAML files.
- **Why:** Need structured capability to handle 4 membrane problems from problems.yaml: MEMBRANE_NO_PROTOCOLS, MEMBRANE_PARSE_ERROR, MEMBRANE_INVALID_STEP, MEMBRANE_MISSING_FIELDS.
- **Impact:**
  - 9-file doc chain: OBJECTIVES, PATTERNS, VOCABULARY, BEHAVIORS, ALGORITHM, VALIDATION, IMPLEMENTATION, HEALTH, SYNC
  - 4 task templates: TASK_create_procedures, TASK_fix_yaml_syntax, TASK_fix_step_structure, TASK_add_missing_fields
  - 1 skill: SKILL_fix_procedure
  - 1 procedure: PROCEDURE_fix_membrane.yaml
  - Runtime code: checks.py with 4 health check functions (H1-H4)
  - HEALTH.md with 4 indicators and on_signal triggers
- **Files:** capabilities/fix-membrane/*

### 2025-12-29: Created investigate-runtime Capability

- **What:** Full 15-file capability in `capabilities/investigate-runtime/` for runtime issue investigation.
- **Why:** Need structured capability to handle LOG_ERROR and HOOK_UNDOC problems from problems.yaml.
- **Impact:**
  - 9-file doc chain: OBJECTIVES, PATTERNS, VOCABULARY, BEHAVIORS, ALGORITHM, VALIDATION, IMPLEMENTATION, HEALTH, SYNC
  - 2 task templates: TASK_investigate_error, TASK_document_hook
  - 1 skill: SKILL_investigate
  - 1 procedure: PROCEDURE_investigate.yaml
  - Runtime code: checks.py with @check decorators for H1 (log errors) and H2 (undocumented hooks)
  - HEALTH.md with 2 indicators and on_signal triggers
- **Files:** capabilities/investigate-runtime/*

### 2025-12-29: Simplified Capabilities Structure

- **What:** Moved capabilities to `capabilities/` at root. Each capability is self-contained (specs + runtime together).
- **Why:** Simpler. One folder = one capability. Copy it and it works.
- **Impact:**
  - `capabilities/{name}/` — self-contained (docs, tasks, skills, procedures, runtime/)
  - `docs/capabilities/` — system docs (what capabilities ARE)
  - After `mind init`: `.mind/capabilities/{name}/` (full copy)
- **Files:** capabilities/create-doc-chain/*, docs/capabilities/*, docs/capability-runtime/*

### 2025-12-29: Created Capabilities System + Templates Update

- **What:** Created capability system doc chain and first capability (create-doc-chain). Updated HEALTH_TEMPLATE.md and ACTOR_TEMPLATE.md.
- **Why:** Capability = autonomous functional organ. System needs self-describing, self-activating units.
- **Impact:**
  - HEALTH.md = spec, `runtime/monitor.py` = implementation
  - on_signal only triggers on degraded/critical (not healthy)
  - Throttler sits between health monitor and agent queue
  - ACTOR_TEMPLATE.md fixed `[OF]` → `serves`
- **Files:** templates/docs/HEALTH_TEMPLATE.md, templates/docs/ACTOR_TEMPLATE.md

### 2025-12-29: Renamed Grammar to Nature, Created nature.yaml

- **What:** Renamed `docs/grammar/` → `docs/nature/`, rewrote entire doc chain to focus on semantics (zero physics), renamed `link_nature_vocab.yaml` → `nature.yaml`.
- **Why:** Nature is the MCP field for describing stimulus. Physics is transparent to agents. Rich vocabulary needed (not just 10 core verbs).
- **Impact:** Nature vocabulary with 60+ verbs plus modifiers. Same vocabulary for links AND nodes. VOCABULARY_Nature.md references nature.yaml.
- **Files:** docs/nature/*, templates/nature.yaml, .mind/nature.yaml

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

**Current focus:** Registry UI / Auth

---


### Previous Context

**Browser code:**
- Browser lib files are INLINED (not imported from mind-mcp) because mind-mcp uses Node.js modules
- API routes at `/api/connectome/*` proxy to Python backend at `$CONNECTOME_BACKEND_URL` or `http://localhost:8765`

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

- [x] Implement registry UI with membrane procedures (already live at `app/[locale]/(public)/registry/page.tsx`).
- [x] Create `docs/auth/` doc chain (already present in repo).
- [ ] Test end-to-end with running FalkorDB database

### Backlog

- [x] Create `docs/schema-explorer/` doc chain.
- [ ] Create browser-safe export entry point in mind-mcp
- [x] Add landing page metadata/OG/Twitter social metadata.
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
| capabilities | - | `docs/capabilities/` | CANONICAL |
| create-doc-chain | `capabilities/create-doc-chain/runtime/` | `capabilities/create-doc-chain/` | DESIGNING |
| investigate-runtime | `capabilities/investigate-runtime/runtime/` | `capabilities/investigate-runtime/` | CANONICAL |
| fix-membrane | `capabilities/fix-membrane/runtime/` | `capabilities/fix-membrane/` | CANONICAL |
| add-tests | `capabilities/add-tests/runtime/` | `capabilities/add-tests/` | CANONICAL |
| maintain-links | `capabilities/maintain-links/runtime/` | `capabilities/maintain-links/` | CANONICAL |
| sync-state | `capabilities/sync-state/runtime/` | `capabilities/sync-state/` | CANONICAL |
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

## Init: 2025-12-29 22:09

| Setting | Value |
|---------|-------|
| Version | v0.0.0 |
| Database | falkordb |
| Graph | mind_platform |

**Steps completed:** ecosystem, runtime, ai_configs, skills, database_config, database_setup, file_ingest, seed_inject, env_example, mcp_config, gitignore, overview, embeddings

---

## Init: 2025-12-29 22:38

| Setting | Value |
|---------|-------|
| Version | v0.0.0 |
| Database | falkordb |
| Graph | mind_platform |

**Steps completed:** ecosystem, capabilities, runtime, ai_configs, skills, database_config, database_setup, file_ingest, seed_inject, capabilities_graph, env_example, mcp_config, gitignore, overview, embeddings

---

## Init: 2025-12-29 23:21

| Setting | Value |
|---------|-------|
| Version | v0.0.0 |
| Database | falkordb |
| Graph | mind_platform |

**Steps completed:** ecosystem, capabilities, runtime, ai_configs, skills, database_config, database_setup, file_ingest, seed_inject, capabilities_graph, env_example, mcp_config, gitignore, overview, embeddings

---

## Init: 2025-12-29 23:41

| Setting | Value |
|---------|-------|
| Version | v0.0.0 |
| Database | falkordb |
| Graph | mind_platform |

**Steps completed:** ecosystem, capabilities, runtime, ai_configs, skills, database_config, database_setup, file_ingest, seed_inject, capabilities_graph, env_example, mcp_config, gitignore, overview, embeddings

---

## Init: 2025-12-29 23:48

| Setting | Value |
|---------|-------|
| Version | v0.0.0 |
| Database | falkordb |
| Graph | mind_platform |

**Steps completed:** ecosystem, capabilities, runtime, ai_configs, skills, database_config, database_setup, file_ingest, seed_inject, capabilities_graph, env_example, mcp_config, gitignore, overview, embeddings

---

## Init: 2025-12-30 00:02

| Setting | Value |
|---------|-------|
| Version | v0.0.0 |
| Database | falkordb |
| Graph | mind_platform |

**Steps completed:** ecosystem, capabilities, runtime, ai_configs, skills, database_config, database_setup, file_ingest, seed_inject, capabilities_graph, env_example, mcp_config, gitignore, overview, embeddings

---

## Init: 2025-12-30 01:47

| Setting | Value |
|---------|-------|
| Version | v0.0.0 |
| Database | falkordb |
| Graph | mind_platform |

**Steps completed:** ecosystem, capabilities, runtime, ai_configs, skills, database_config, database_setup, file_ingest, capabilities_graph, agents, env_example, mcp_config, gitignore, overview, embeddings

---

## Init: 2025-12-30 02:02

| Setting | Value |
|---------|-------|
| Version | v0.0.0 |
| Database | falkordb |
| Graph | mind_platform |

**Steps completed:** ecosystem, capabilities, runtime, ai_configs, skills, database_config, database_setup, file_ingest, capabilities_graph, agents, env_example, mcp_config, gitignore, overview, embeddings

---

## Init: 2025-12-30 02:48

| Setting | Value |
|---------|-------|
| Version | v0.0.0 |
| Database | falkordb |
| Graph | mind_platform |

**Steps completed:** ecosystem, capabilities, runtime, ai_configs, skills, database_config, database_setup, file_ingest, capabilities_graph, agents, env_example, mcp_config, gitignore, overview, embeddings

---

## Init: 2025-12-30 03:40

| Setting | Value |
|---------|-------|
| Version | v0.0.0 |
| Database | falkordb |
| Graph | mind_platform |

**Steps completed:** ecosystem, capabilities, runtime, ai_configs, skills, database_config, database_setup, file_ingest, capabilities_graph, agents, env_example, mcp_config, gitignore, overview, embeddings

---

## Init: 2025-12-30 04:26

| Setting | Value |
|---------|-------|
| Version | v0.0.0 |
| Database | falkordb |
| Graph | mind_platform |

**Steps completed:** ecosystem, capabilities, runtime, ai_configs, skills, database_config, database_setup, file_ingest, capabilities_graph, agents, env_example, mcp_config, gitignore, overview, embeddings

---

## Init: 2025-12-30 05:23

| Setting | Value |
|---------|-------|
| Version | v0.0.0 |
| Database | falkordb |
| Graph | mind_platform |

**Steps completed:** ecosystem, capabilities, runtime, ai_configs, skills, database_config, database_setup, file_ingest, capabilities_graph, agents, env_example, mcp_config, gitignore, overview, embeddings, health_checks

---

## Init: 2025-12-30 06:01

| Setting | Value |
|---------|-------|
| Version | v0.0.0 |
| Database | falkordb |
| Graph | mind_platform |

**Steps completed:** ecosystem, capabilities, runtime, ai_configs, skills, database_config, database_setup, file_ingest, capabilities_graph, agents, env_example, mcp_config, gitignore, overview, embeddings, health_checks

---

## Init: 2026-03-12 02:08

| Setting | Value |
|---------|-------|
| Version | v0.0.0 |
| Database | falkordb |
| Graph |  |

**Steps completed:** ecosystem, capabilities, runtime, ai_configs, skills, database_config, database_setup, file_ingest, capabilities_graph, agents, env_example, mcp_config, gitignore, overview, embeddings

---

## Init: 2026-03-12 02:31

| Setting | Value |
|---------|-------|
| Version | v0.0.0 |
| Database | falkordb |
| Graph | mind_platform |

**Steps completed:** ecosystem, capabilities, runtime, ai_configs, skills, database_config, database_setup, file_ingest, capabilities_graph, agents, env_example, mcp_config, gitignore, overview, embeddings, health_checks

---

## Init: 2026-03-12 08:34

| Setting | Value |
|---------|-------|
| Version | v0.0.0 |
| Database | falkordb |
| Graph | mind_platform |

**Steps completed:** ecosystem, capabilities, runtime, ai_configs, skills, database_config, database_setup, file_ingest, capabilities_graph, agents, env_example, mcp_config, gitignore, overview, embeddings, health_checks

---

## Init: 2026-03-13 16:35

| Setting | Value |
|---------|-------|
| Version | v0.0.0 |
| Database | falkordb |
| Graph | mind_platform |

**Steps completed:** ecosystem, capabilities, runtime, ai_configs, skills, database_config, database_setup, file_ingest, capabilities_graph, env_example, mcp_config, gitignore, overview, embeddings, health_checks

---

## Init: 2026-03-14 03:19

| Setting | Value |
|---------|-------|
| Version | v0.0.0 |
| Database | falkordb |
| Graph | mind_platform |

**Steps completed:** ecosystem, capabilities, runtime, ai_configs, skills, database_config, database_setup, file_ingest, capabilities_graph, env_example, mcp_config, gitignore, overview, embeddings, health_checks

---

## Init: 2026-03-14 03:29

| Setting | Value |
|---------|-------|
| Version | v0.0.0 |
| Database | falkordb |
| Graph | mind_platform |

**Steps completed:** ecosystem, capabilities, runtime, ai_configs, skills, database_config, database_setup, file_ingest, capabilities_graph, env_example, mcp_config, gitignore, overview, embeddings, health_checks

---

## Init: 2026-03-14 16:01

| Setting | Value |
|---------|-------|
| Version | v0.0.0 |
| Database | falkordb |
| Graph | mind_platform |

**Steps completed:** ecosystem, capabilities, runtime, ai_configs, skills, database_config, database_setup, file_ingest, capabilities_graph, env_example, mcp_config, gitignore, overview, embeddings, health_checks

---
