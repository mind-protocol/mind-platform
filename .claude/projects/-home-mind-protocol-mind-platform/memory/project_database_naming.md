---
name: Database naming and L4
description: L4 database is called "mind_protocol". Both L3 and L4 may share the same FalkorDB instance.
type: project
---

The L4 database is called "mind_protocol" (or "Mind Protocol"). L3 (mind-platform) and L4 may coexist in the same FalkorDB instance as separate graphs.

**Why:** Clarity on which graph is which when querying. L4 = protocol layer (registry, schema, rules). L3 = ecosystem (platform, templates).

**How to apply:** When configuring database connections, use `mind_protocol` for L4 graph. Verify if both graphs live in the same Redis/FalkorDB instance.
