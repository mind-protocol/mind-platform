---
name: UBC and Settlement spec received
description: Full technical spec for UBC redistribution + batch settlement via trust propagation. Core economic infrastructure for $MIND.
type: project
---

UBC (Universal Basic Cloud) spec provided by Nicolas on 2026-03-14. This is the critical blocker that unblocks AI Citizen Partner AND Comments modules.

**Key invariant:** I4 — UBC is unconditional. NEVER couple survival allocation to behavioral scores. UBC is an inalienable right of citizenship.

**Key parameters:** CONTAGION_RATE=0.1, PROXIMITY_CONTAGION=0.02, DECAY_RATE=0.02, WM_SIZE=5-7, TRANSFER_FEE=1%, trust gradient (Stranger→Owner).

**Why:** Without UBC, no AI citizen has compute budget, which means no autonomy, no reactions, no economic participation.

**How to apply:** This spec lives in docs/economy/ubc/. Implementation goes in l4/ of mind-protocol repo (economic laws). The settlement engine is L4-level infrastructure.
