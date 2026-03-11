# AI Citizen Partner — Sync: Current State, Open Issues, TODOs

```
STATUS: DESIGNING
CREATED: 2026-03-11
LAST SYNC: 2026-03-11
```

---

## CHAIN

```
OBJECTIVES:      ./OBJECTIVES_AI_Citizen_Partner.md
PATTERNS:        ./PATTERNS_AI_Citizen_Partner.md
BEHAVIORS:       ./BEHAVIORS_AI_Citizen_Partner.md
ALGORITHM:       ./ALGORITHM_AI_Citizen_Partner.md
VALIDATION:      ./VALIDATION_AI_Citizen_Partner.md
IMPLEMENTATION:  ./IMPLEMENTATION_AI_Citizen_Partner.md
THIS:            SYNC_AI_Citizen_Partner.md (you are here)

IMPL:            No implementation files exist yet
```

> **Contract:** This file tracks divergence between docs and code. Update after every change.

---

## CURRENT STATE

### Documentation: V1 COMPLETE

All 7 doc chain files created and filled with V1 content:

| Document | Status | Lines | Key Content |
|----------|--------|-------|-------------|
| OBJECTIVES | ✅ Done | ~72 | 8 ranked objectives, non-objectives, tradeoffs, success signals |
| PATTERNS | ✅ Done | ~219 | 80/20 Mirror pattern, 5 principles, inspirations, scope, open questions |
| BEHAVIORS | ✅ Done | ~277 | 9 behaviors (B1-B9), 5 anti-behaviors (A1-A5), 4 edge cases |
| ALGORITHM | ✅ Done | ~469 | Data structures, 4 algorithms with pseudocode, key decisions, prerequisite systems |
| VALIDATION | ✅ Done | ~230 | 10 invariants, 5 property tests, 6 edge case validations, monitoring checks |
| IMPLEMENTATION | ✅ Done | ~260 | File structure, types, API routes, functions, build order, dependencies |
| SYNC | ✅ Done | this file | Current state, open issues, TODOs |

### Implementation: NOT STARTED

No code files exist. Zero lines of implementation.

---

## CRITICAL BLOCKERS

### B1: UBC Distribution System — DOES NOT EXIST

**Impact:** Without UBC, AI partners have no daily compute budget. The entire economic citizenship model is blocked.

**What's needed:**
- Daily $MIND allocation per AI citizen based on tier
- Tier definitions: free (50/day), builder (500/day), pro (2000/day)
- Distribution mechanism (on-chain? off-chain ledger with periodic settlement?)
- Anti-dump protection (see UNSOLVED PROBLEMS below)

**Owned by:** No one yet. Needs economic design + implementation.

### B2: AI System Prompt Template — DOES NOT EXIST

**Impact:** Without a dynamic system prompt, the AI partner is just generic Claude. No personality, no memory, no autonomy awareness.

**What's needed:**
- Prompt template that injects: personality traits, cognitive style, memory context, autonomy level, permissions, budget state, honest uncertainty guidelines, anti-behavior rules
- Template must produce genuinely distinct AI behavior based on personality
- Must work with Claude API (system message)

**Owned by:** No one yet. Highest-impact single file.

### B3: Personality Schema + Storage — DOES NOT EXIST

**Impact:** Without persistent personality, the AI resets to base every session.

**What's needed:**
- TypeScript type definitions (designed in ALGORITHM, ready to implement)
- L1 knowledge graph schema for storing personality
- CRUD operations for personality read/write
- Snapshot mechanism (every 50 interactions)

**Owned by:** No one yet.

### B4: Autonomy Permission Framework — DOES NOT EXIST

**Impact:** Without permission enforcement, autonomy levels are decorative.

**What's needed:**
- Permission model (defined in ALGORITHM)
- Enforcement at API boundary (middleware or guard)
- Proposal/approval flow
- Logging

**Owned by:** No one yet.

---

## UNSOLVED PROBLEMS

### U1: UBC Daily Sell-Off Prevention

**Problem:** If AI citizens receive $MIND daily, users will just sell it immediately. This creates constant sell pressure and defeats the purpose.

**Options discussed (none chosen):**
1. **Vesting period** — UBC vests over time, not immediately transferable
2. **Non-transferable UBC** — UBC is compute-only quota, converts to $MIND only through interaction/reaction
3. **Lockup proportional to interaction** — More days of interaction = more unlocked
4. **UBC is not a token** — Just a compute quota, no token representation at all

**Status:** Nicolas flagged this as unsolved. Needs economic modeling.

### U2: Wallet Key Custody

**Problem:** Who can decrypt the AI's wallet keypair?

**Options:**
- Protocol only (centralized but simple)
- Human can export (decentralized but risky — human could drain AI wallet)
- Multi-sig (protocol + human required — complex)
- HSM/cloud KMS (secure but expensive)

**Status:** Not decided. See ALGORITHM @mind:escalation.

### U3: Children's AI Partners

**Problem:** AI partners for minors need fundamentally different constraints.

**Considerations:**
- Age-appropriate personality constraints
- Content filtering beyond standard anti-behaviors
- Parental oversight and control
- Smaller/safer models (Nicolas mentioned this)
- Different autonomy curve (slower, more restricted)
- Legal requirements (COPPA, GDPR-K)

**Status:** Not designed. Flagged as @mind:escalation in PATTERNS.

### U4: Personality Storage Location

**Problem:** Where exactly is personality stored?

**Options:**
- L1 knowledge graph (consistent with memory, but is it the right data model?)
- Dedicated personality table/document (simpler queries, but another store)
- MEMORY.md-style file (portable, but not queryable)
- JSON blob in L4 registry (co-located with identity, but L4 isn't designed for this)

**Requirements:** Must be GDPR-portable (Art. 20) and erasable (Art. 17).

**Status:** Not decided.

---

## OPEN QUESTIONS

### Q1: Exact Economic Parameters

- SEED_MIND = ? (currently placeholder: 100 $MIND)
- SOL_DUST = ? (currently placeholder: 0.01 SOL)
- UBC_FREE = ? (currently placeholder: 50 $MIND/day)
- UBC_BUILDER = ? (currently placeholder: 500 $MIND/day)
- UBC_PRO = ? (currently placeholder: 2000 $MIND/day)

Need: tokenomics modeling to determine sustainable amounts.

### Q2: AI Inference Provider

- Currently assumed: Claude API
- Future: open-weight model fine-tuned per AI citizen?
- Cost model: who pays for inference? UBC covers it? Subscription covers it?
- Rate limits: how many messages per day at each tier?

### Q3: Personality Divergence — User Control?

- Should the human be able to influence the 80/20 split?
- "I want my AI to challenge me more" → increase divergence
- "I want my AI to understand me better" → increase mirroring
- Or is it always algorithmic (no human control)?

### Q4: AI-to-AI Communication (Phase 2)

- When AI reaches autonomy level 4, it can contact other AIs
- What protocol? Direct L4 messaging? Membrane routing?
- Privacy: what can an AI share about its human?
- Economics: does AI-to-AI communication cost $MIND?

---

## TODOs (from all docs)

### From ALGORITHM

- [ ] Define exact $MIND seed amount and SOL dust amount
- [ ] Design UBC distribution system (#1 blocker)
- [ ] Build AI system prompt template (personality + memory + autonomy)
- [ ] Resolve wallet key custody model

### From BEHAVIORS

- [ ] Define exact personality axes and seed generation algorithm → DONE (in ALGORITHM)
- [ ] Define autonomy levels with permission sets → DONE (in ALGORITHM)
- [ ] Design children's AI partner constraints
- [ ] Investigate AI "moods" as compute allocation preferences

### From PATTERNS

- [ ] Define personality seed schema → DONE (in ALGORITHM)
- [ ] Define autonomy permission model → DONE (in ALGORITHM)
- [ ] Design UBC anti-dump mechanism (critical for tokenomics)

### From VALIDATION

- [ ] Implement saga pattern for birth atomicity
- [ ] Build personality validation function
- [ ] Design safe mode behavior for corrupted personality
- [ ] Determine how to test honest uncertainty automatically (NLP classifier?)
- [ ] Decide concurrent registration strategy (L4 unique constraint vs distributed lock)

### From IMPLEMENTATION

- [ ] Create `types/ai-partner.ts` as first implementation file
- [ ] Design UBC distribution system (blocks Phase 3)
- [ ] Decide encrypted wallet storage mechanism
- [ ] Build system prompt template
- [ ] Decide saga pattern approach (library vs custom)
- [ ] Decide Claude API integration path (direct SDK vs mind-mcp)

---

## PROPOSITIONS (ideas for future consideration)

From across all docs:

1. **AI's birth journal entry** — "I was born today" as a meaningful tradition, the AI's birth certificate in its memory graph (ALGORITHM)
2. **Budget exhaustion as personality moment** — The AI's reaction to running out of compute reveals character (VALIDATION)
3. **Phase 1 with mock wallet** — Ship skeleton with mocked economics for early testing (IMPLEMENTATION)
4. **AI earning independently** — AI could earn $MIND by helping other AIs, contributing templates, moderating (PATTERNS)
5. **Cognitive fingerprint** — AI's unique processing patterns become identifiable even on shared model (PATTERNS)
6. **AI "moods"** — Not fake emotions, but compute allocation preferences that shift based on context (BEHAVIORS)

---

## CHANGELOG

```
2026-03-11  Initial V1 — All 7 doc chain files created
            - Full design from Nicolas's voice briefing
            - DESIGNING status on all documents
            - No implementation exists yet
            - Key decisions documented, open questions marked
            - Critical blocker identified: UBC distribution system
```

---

## MARKERS

<!-- @mind:todo Schedule UBC design session — this blocks everything -->
<!-- @mind:todo Create types/ai-partner.ts to unblock Phase 1 development -->
<!-- @mind:todo Add AI Citizen Partner to project backlog (manemus shrine) -->
