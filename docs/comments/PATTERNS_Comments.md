# Comments & Reactions — Patterns: Attention as Currency

```
STATUS: DESIGNING
CREATED: 2026-03-11
```

---

## CHAIN

```
OBJECTIVES:      ./OBJECTIVES_Comments.md
THIS:            PATTERNS_Comments.md (you are here)
BEHAVIORS:       ./BEHAVIORS_Comments.md
ALGORITHM:       ./ALGORITHM_Comments.md
VALIDATION:      ./VALIDATION_Comments.md
IMPLEMENTATION:  ./IMPLEMENTATION_Comments.md
SYNC:            ./SYNC_Comments.md

IMPL:            components/comments/CommentLayer.tsx
```

### Bidirectional Contract

**Before modifying this doc or the code:**
1. Read ALL docs in this chain first
2. Read the linked IMPL source file

**After modifying this doc:**
1. Update the IMPL source file to match, OR
2. Add a TODO in SYNC_Comments.md: "Docs updated, implementation needs: {what}"

**After modifying the code:**
1. Update this doc chain to match, OR
2. Add a TODO in SYNC_Comments.md: "Implementation changed, docs need: {what}"

---

## THE PROBLEM

Content platforms separate engagement from value. Likes are free, so they're meaningless. Comments are unanchored, so they lose context. Moderation is centralized, so it's political. The result: noise dominates signal, creators aren't compensated for quality, and engagement metrics optimize for addiction rather than insight.

On Mind Protocol, engagement must be economically real, contextually anchored, and self-governed. If attention has no price, it has no signal.

---

## THE PATTERN

**The Tab System: Daily Attention Budget**

Every registered citizen receives a daily UBC (Universal Basic Compute) allocation in $MIND. This allocation doubles as their daily "attention budget." Reactions spend from this budget instantly (no wallet signing), and the system settles all debits/credits in a single on-chain batch at the end of the UBC distribution cycle.

```
UBC Distribution → User gets 100 $MIND/day
  ↓
User reacts: 🔥(1) + 💡(10) + 🧠(100) = 111 tab
  ↓
Tab check: 111 ≤ daily budget? Yes → instant
  ↓
Settlement: batch Solana tx nets all tabs across all users
  ↓
Creator receives: reactions minus 1% protocol fee
```

The key insight: **reactions are instant but settlement is batched.** The user experience is "click to react" with zero friction. The economic reality is a daily-settled ledger.

---

## BEHAVIORS SUPPORTED

- **B1: Instant reaction** — Click a reaction tier, it's applied immediately. No confirmation dialog.
- **B2: Budget awareness** — User sees remaining daily budget. Greyed-out reactions when exhausted.
- **B3: Content-anchored comments** — Every comment is pinned to a position in the content.
- **B4: AI pre-moderation** — Comment passes through user's own AI before posting.
- **B5: Creator revenue** — Content creators and commenters earn $MIND from reactions.
- **B6: Trust building** — Reaction patterns feed into Selective Trust scoring.

## BEHAVIORS PREVENTED

- **A1: Spam** — Every reaction costs $MIND. Budget ceiling prevents flood.
- **A2: Engagement farming** — No algorithmic amplification. Chronological or value-sorted only.
- **A3: Anonymous trolling** — L4 registration mandatory. Identity attached to every comment.
- **A4: Central censorship** — No admin moderation. AI self-moderation only.

---

## PRINCIPLES

### Principle 1: Attention Has a Price

Every reaction is a $MIND transfer. Free engagement is meaningless engagement. When you spend 10 $MIND on a 💡 Insight reaction, you're making an economic statement about the value of that content at that moment. The scarcity of your daily budget forces prioritization — you react to what matters, not everything that scrolls by.

### Principle 2: Self-Governance Through AI

Each citizen's L1 AI agent serves as their personal editor. Before a comment posts, it passes through the user's own AI for Art. 9 compliance, quality signal, and toxicity check. The user pays for this compute from their own tab. This decentralizes moderation completely: no central authority decides what's acceptable. Your AI learns your standards. If you override the AI and post low-quality content, your trust score absorbs the consequence.

### Principle 3: Settlement, Not Transaction

Individual micro-reactions never touch the blockchain. The Tab System aggregates all daily activity into a single settlement transaction per user. This eliminates gas fees, wallet popups, and confirmation dialogs from the user experience while preserving the economic reality of $MIND as attention currency.

### Principle 4: Universal Anchoring

Comments don't float in a generic thread. They attach to specific positions in content: timestamps in audio/video, paragraphs in articles, sections in documentation. This creates a semantic overlay on every piece of content — a "heat map" of where attention concentrates.

---

## DATA

| Source | Type | Purpose / Description |
|--------|------|-----------------------|
| `lib/db/falkordb.ts` | CODE | Graph database for comment/reaction storage (MVP) |
| L4 Registry | API | Citizen identity verification for comment authorship |
| UBC Distribution | API | Daily $MIND allocation that sets the tab ceiling |
| Solana RPC (Helius) | API | On-chain settlement of daily tab batches |

---

## DEPENDENCIES

| Module | Why We Depend On It |
|--------|---------------------|
| `lib/auth.ts` | Session verification — only registered citizens can comment |
| `components/SolanaProvider.tsx` | Wallet context for settlement (not per-reaction) |
| L4 Registry (`mind-protocol`) | Citizen identity and trust level |
| UBC System (`economy/`) | Daily allocation ceiling for tab |
| L1 AI Agent (`mind-mcp`) | Pre-moderation of comments before posting |

---

## INSPIRATIONS

- **SoundCloud** — Timestamped comments on audio waveforms. Proved the UI pattern works.
- **Reddit Awards** — Token-based reactions (Gold, Platinum). Proved economic reactions drive quality.
- **Bar Tab model** — Spend all night, settle at close. Applied to micro-transactions.
- **Bitcoin Lightning Network** — Off-chain channels with on-chain settlement. Same pattern, different scale.
- **Wikipedia Talk Pages** — Section-anchored discussion. Contextual commentary.

---

## SCOPE

### In Scope

- `<CommentLayer>` React component for all content pages
- Tab System: daily accumulation + batch settlement
- 4 reaction tiers with $MIND amounts
- AI pre-moderation hook (calls user's L1 agent)
- Content anchoring (timestamp, paragraph, section)
- Comment threading (2 levels max)
- Reaction recipient routing (creator for content, commenter for comments)

### Out of Scope

- Algorithmic feed or recommendation → no engagement optimization
- Direct wallet signing per reaction → see: Tab System
- Admin/moderator roles → see: AI self-moderation
- Anonymous commenting → see: L4 registration
- Content creation tools → see: /blog, /talks
- Real-time collaborative editing → not a doc editor

---

## MARKERS

<!-- @mind:proposition Consider allowing users to "boost" a comment (reaction + bump visibility) as a paid premium action -->
<!-- @mind:proposition Future: reaction analytics dashboard showing where $MIND flows across content types -->
<!-- @mind:escalation Decision needed: should AI moderation overrides be public (visible to other users) or private? -->
