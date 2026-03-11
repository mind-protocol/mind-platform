# Comments & Reactions — Sync: Current State

```
LAST_UPDATED: 2026-03-11
UPDATED_BY: Claude + Nicolas
STATUS: DESIGNING
```

---

## MATURITY

**What's canonical (v1):**
- The Tab System concept: daily attention budget, deferred settlement, no wallet popups
- 4 reaction tiers: Spark (1), Insight (10), Mind Shift (100), Venice (1000)
- L4 registration mandatory for all participation
- AI self-moderation via user's own L1 agent
- Universal CommentLayer component across all content types
- Reward routing: creator for content reactions, commenter for comment reactions
- 2-level threading max

**What's still being designed:**
- Database choice: FalkorDB (existing) vs Supabase (new) vs PostgreSQL
- AI moderation bridge: how platform calls a user's L1 agent
- Settlement batch mechanics: Solana tx size limits, error handling
- Anchor types: exact spec per content type
- Heatmap visualization component

**What's proposed (v2+):**
- Reaction analytics dashboard (where $MIND flows across content)
- "Reaction streaks" — consecutive daily activity earns bonus UBC
- Cross-content reaction comparison (which pages generate most value)
- AI moderation transparency (public log of override patterns)
- Reaction pools (multiple users contribute to one large reaction)

---

## CURRENT STATE

Documentation chain complete (8/8 docs). No implementation code exists yet. The system is fully specified from objectives through implementation architecture but has not been built.

Key architectural decisions are locked:
1. Tab System with daily UBC settlement (Nicolas's decision)
2. No anonymous participation (Nicolas's decision)
3. AI self-moderation paid by the user (Nicolas's decision)
4. Universal component across all pages (Nicolas's decision)

---

## IN PROGRESS

### Documentation Chain

- **Started:** 2026-03-11
- **By:** Claude + Nicolas
- **Status:** Complete
- **Context:** Full 8-doc chain written from brainstorm session. Ready for implementation.

---

## RECENT CHANGES

### 2026-03-11: Initial Design

- **What:** Full documentation chain created from brainstorm conversation
- **Why:** Nicolas identified that commenting + $MIND reactions creates an attention economy layer. Key insight: Tab System avoids wallet friction while keeping economic reality.
- **Files:** 8 docs in `docs/comments/`
- **Struggles/Insights:** The Tab System is the breakthrough — it solves the UX vs economics tension that kills most Web3 social features. Settlement via UBC distribution adjustment is elegant because the mechanism already exists.

---

## KNOWN ISSUES

### Database Choice Undecided

- **Severity:** high (blocks implementation)
- **Symptom:** No database for comments/tabs chosen
- **Suspected cause:** FalkorDB is existing but graph-oriented. Comments are more relational. Supabase would add a dependency.
- **Attempted:** Listed options in IMPLEMENTATION. Decision needed.

### AI Moderation Bridge Undefined

- **Severity:** high (blocks B4 behavior)
- **Symptom:** No protocol for platform → L1 AI agent communication
- **Suspected cause:** L1 agents (mind-mcp) don't yet expose a moderation API
- **Attempted:** Designed the interface. Implementation requires mind-mcp changes.

---

## HANDOFF: FOR AGENTS

**Your likely VIEW:** VIEW_Implement

**Where I stopped:** Full documentation chain complete. Zero code written. Next step is implementation starting with:
1. Database schema (choose DB)
2. API routes (`app/api/comments/`)
3. Zustand store (`stores/comments.ts`)
4. CommentLayer component (`components/comments/CommentLayer.tsx`)
5. Tab system (`lib/comments/tab.ts`)

**What you need to understand:**
The Tab System is the core innovation. Reactions are instant DB writes, NOT blockchain transactions. Settlement happens once daily in a batch. The UBC allocation acts as the daily spending ceiling. Read ALGORITHM_Comments.md carefully before implementing — the data flow is specific.

**Watch out for:**
- Don't add wallet signing to reactions. Ever. That's the whole point of the Tab.
- Threading is max 2 levels. Replies to replies flatten to level 1 with @mention.
- AI moderation is a hard gate — never post without it. If the AI is down, hold as draft.
- Self-reaction check must be server-side. Client-side is UX only.

**Open questions I had:**
- Should earned $MIND from reactions increase tomorrow's UBC ceiling or just accumulate in wallet?
- How to handle the case where a content creator deletes their account mid-day with unsettled credits?
- Is the 1% fee calculated per-reaction or on the daily net? (Per-reaction is simpler and more transparent)

---

## HANDOFF: FOR HUMAN

**Executive summary:**
Full Comment & Reaction system designed with 8-document chain. The Tab System eliminates wallet friction by aggregating micro-reactions into daily UBC settlement. Every reaction is a $MIND transfer, AI self-moderation replaces central authority, and the component works across all content pages.

**Decisions made:**
- Tab System with daily settlement (your idea — brilliant)
- 4 reaction tiers: 1/10/100/1000 $MIND
- L4 mandatory, no anonymous (your decision)
- AI self-moderation at user's cost (your decision)
- Universal component (your decision)
- 2-level threading max
- 1% protocol fee on all reactions

**Needs your input:**
- Database choice: FalkorDB vs Supabase vs PostgreSQL
- Priority: implement MVP for /talks first, then extend? Or build universal from day 1?
- AI moderation: stub it for MVP (auto-approve) or block until L1 agent API is ready?

---

## TODO

### Doc/Impl Drift

- [ ] DOCS→IMPL: Full implementation needed — no code exists yet

### Immediate

- [ ] Choose database for comments and tabs
- [ ] Create database schema (migrations)
- [ ] Implement `lib/comments/tab.ts` (Tab CRUD + budget enforcement)
- [ ] Implement `app/api/comments/route.ts` (comment CRUD)
- [ ] Implement `app/api/comments/[id]/react/route.ts` (reaction handler)
- [ ] Build `<CommentLayer>` component
- [ ] Build `<ReactionBar>` component
- [ ] Build `stores/comments.ts` (Zustand)
- [ ] Wire CommentLayer into /talks page as first integration
- [ ] Stub AI moderation (auto-approve for MVP)

### Later

- [ ] Real AI moderation bridge via L1 agent
- [ ] Settlement cron + Solana batch tx
- [ ] Heatmap visualization
- [ ] Wire into /blog, /research, /music, /manifesto
- [ ] Health check endpoints
- [ ] Reaction analytics dashboard
- IDEA: "Featured comments" — content creator can pin one comment per piece of content

---

## CONSCIOUSNESS TRACE

**Mental state when stopping:**
Confident. The design is clean and the core decisions are locked by Nicolas. The Tab System solves the real problem (wallet UX kills Web3 social). Ready for implementation.

**Threads I was holding:**
- The AI moderation bridge is the biggest unknown. How does the platform invoke a user's L1 agent? This needs mind-mcp to expose an API.
- Settlement batching on Solana has tx size limits. Might need to split into multiple transactions for >100 users.
- Heatmap visualization for audio waveforms is a nice-to-have but non-trivial (needs waveform data + reaction position overlay).

**Intuitions:**
- Start with /talks — it's a contained content type with few users, perfect for testing.
- FalkorDB might work for comments as graph nodes (they ARE graph nodes in the L1 schema). Worth trying before adding Supabase.
- The AI moderation stub (auto-approve) is fine for MVP. Real moderation can be added when L1 agents have the API.

**What I wish I'd known at the start:**
The Tab System was Nicolas's idea and it's the most important design decision. It should have been the first thing documented. Everything else follows from "reactions are instant, settlement is deferred."

---

## POINTERS

| What | Where |
|------|-------|
| Solana wallet integration | `components/SolanaProvider.tsx` |
| Auth system | `lib/auth.ts` |
| Design tokens | `lib/design/theme.ts` |
| FalkorDB client | `lib/db/falkordb.ts` |
| Zustand pattern | `stores/` (existing stores) |
| Doc chain templates | `templates/docs/` |
| L4 registry types | `app/[locale]/(public)/registry/lib/types.ts` |
| UBC/economy code | `mind-protocol/economy/` |
