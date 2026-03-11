# OBJECTIVES — Comments & Reactions

```
STATUS: DESIGNING
CREATED: 2026-03-11
```

---

## CHAIN

```
THIS:            OBJECTIVES_Comments.md (you are here - START HERE)
PATTERNS:       ./PATTERNS_Comments.md
BEHAVIORS:      ./BEHAVIORS_Comments.md
ALGORITHM:      ./ALGORITHM_Comments.md
VALIDATION:     ./VALIDATION_Comments.md
IMPLEMENTATION: ./IMPLEMENTATION_Comments.md
SYNC:           ./SYNC_Comments.md

IMPL:           components/comments/CommentLayer.tsx
```

**Read this chain in order before making changes.** Each doc answers different questions. Skipping ahead means missing context.

---

## PRIMARY OBJECTIVES (ranked)

1. **Attention has a price** — Every reaction is a $MIND transfer. Engagement is not free, making it meaningful and anti-spam by design.
2. **Zero-friction micro-transactions** — No wallet popups, no signing, no gas fees. The Tab System aggregates reactions into daily UBC settlement. Reacting must feel instant.
3. **Content-anchored discussion** — Comments anchor to specific content positions (timestamps for audio, paragraphs for text, sections for docs). Context is never lost.
4. **Self-governed moderation** — Each user's own L1 AI agent moderates their comments before posting. No central authority. The user pays for their own moderation compute.
5. **Platform-wide primitive** — One component serves all content types (/talks, /blog, /research, /music, /manifesto, /tokenomics). Not a feature — an infrastructure layer.
6. **Economic signal, not vanity metric** — Reactions reveal what the community values. The market prices quality through $MIND flow, not likes.

## NON-OBJECTIVES

- Engagement optimization — we do not maximize time-on-page or reaction count
- Anonymous participation — L4 registration is mandatory, no exceptions
- Algorithmic feed — comments are chronological or highest-rewarded, user's choice
- Content recommendation — reactions inform trust scores, not recommendation engines
- Free reactions — every reaction must cost $MIND (even 1 $MIND minimum)

## TRADEOFFS (canonical decisions)

- When UX speed conflicts with on-chain verification, choose UX speed. Settle on-chain later via Tab.
- When moderation quality conflicts with posting speed, choose moderation. The AI check runs before post.
- When privacy conflicts with transparency, choose transparency. L4 registration mandatory, all reactions public.
- We accept that budget-limited users react less, to preserve the signal that reactions carry real value.
- We accept daily settlement latency to eliminate per-reaction wallet signing.

## SUCCESS SIGNALS (observable)

- Reaction-to-comment ratio > 3:1 (reactions are more common than comments — low friction)
- Average daily tab utilization > 30% of UBC allocation (users spending their attention budget)
- Zero wallet popup interruptions during normal usage
- AI moderation flag rate < 10% (users self-calibrate over time)
- Comment quality measured by reactions received (not volume)
- 1% transfer fee on settlements generates measurable protocol revenue
