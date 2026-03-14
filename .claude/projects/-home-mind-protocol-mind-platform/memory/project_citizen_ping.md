---
name: Citizen ping architecture (two-level)
description: /ping/{handle} on org MCP server (local) + /registry/ping/{handle} on L4 (resolves + remote ping). Already pushed to mind-protocol repo.
type: project
---

Two-level citizen liveness architecture (implemented 2026-03-14):

**Level 1 — Org-level `/ping/{handle}`** (on mind-mcp/org server):
- Returns: alive, universe, last_active (timestamp), last_active_context (synthesis of last moment), membrane_response, resolution (citizen ID, org, endpoint, membrane_url)
- Local to the org's MCP server

**Level 2 — L4 `/registry/ping/{handle}`** (on L4 registry):
- Resolves handle → CITIZEN_x → org membership → org endpoint
- Then calls the org's /ping/{handle} remotely
- Returns: resolution chain + remote ping response + brain stats (nodes, links) + engine state (running, orientation, tick_count) + keys (wallet, rsa)

**Key fields in ping response:**
- `universe`: which L3 graph the citizen lives in
- `last_active`: unix timestamp of last moment linked to citizen in L3
- `last_active_context`: synthesis of that moment (what they were doing)

**Why:** Needed to know if deployed citizens (Venezia etc.) are responsive and autonomous. Two levels because L4 resolves identity, org-level has the actual runtime.

**How to apply:** When building /infos @handle MCP tool, call /registry/ping/{handle} first, then enrich with L4 graph data (trust, balance, locations).
