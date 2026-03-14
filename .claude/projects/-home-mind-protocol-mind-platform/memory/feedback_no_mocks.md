---
name: No mocks ever
description: Never create mock data layers or fallback to mock. Build the real implementation directly.
type: feedback
---

Never mock. Never create mock L4 clients, mock API layers, or fallback-to-mock patterns. Build the real thing directly.

**Why:** The user considers mocks useless overhead. They mask real integration issues and delay building what actually matters. This aligns with PRINCIPLES.md "No fallbacks" rule.

**How to apply:** When tempted to create a mock layer "for now", instead build the real backend/API directly. If data is needed for development, use the real database with real queries. If the backend doesn't exist yet, build it.
