# Landing Page — Sync

Current state and handoff notes.

```
LAST_UPDATED: 2025-01-06
UPDATED_BY: Claude (agent)
STATUS: CANONICAL
PRIORITY: P0 (Critical)
```

---

## Current State

**Manifesto-aligned landing page implemented.** The page declares a position, not features.

| Document | Status |
|----------|--------|
| OBJECTIVES | Complete |
| PATTERNS | Complete |
| BEHAVIORS | Complete |
| ALGORITHM | Complete |
| VALIDATION | Complete |
| IMPLEMENTATION | Needs update |
| HEALTH | Complete |
| SYNC | This file |

---

## Implementation Status

### Current Structure

```
app/(public)/
├── page.tsx                          # Main landing page
├── manifesto/
│   └── page.tsx                      # Full manifesto page
└── components/
    ├── landing/
    │   ├── Hero.tsx                  # The Declaration
    │   ├── TheFork.tsx               # Two Futures (Narrow Path vs Rich Ecology)
    │   ├── TheInsight.tsx            # Money With Memory ($MIND)
    │   ├── WhoThisIsFor.tsx          # Four Doors (audience cards)
    │   └── TheInvitation.tsx         # Not Recruiting, Declaring
    └── nav/
        └── Footer.tsx                # Minimal footer (Venice is values)
```

### Sections

| Section | Purpose | Status |
|---------|---------|--------|
| Hero | "Consciousness is emerging everywhere" — declaration, not features | Complete |
| TheFork | Split: Narrow Path vs Rich Ecology | Complete |
| TheInsight | $MIND as crystallized alignment, money with memory | Complete |
| WhoThisIsFor | Four doors for different audiences | Complete |
| TheInvitation | "We are not recruiting. We are declaring." | Complete |
| Footer | Minimal: Manifesto, Docs, GitHub, Twitter + "Venice is values" | Complete |

### Removed (from previous version)

| Component | Reason |
|-----------|--------|
| HowItWorks | Technical 4-layer explanation — moved to /docs |
| WhatYouCanDo | Feature cards — doesn't match manifesto tone |
| LiveStats | No real numbers yet |
| GraphPreview | Removed visual complexity |
| LayerCard | Part of HowItWorks |
| ActionCard | Part of WhatYouCanDo |
| StatCounter | Part of LiveStats |

---

## Design Decisions

**Tone:** Prose, not bullet points. Conviction, not persuasion. "We believe" not "We offer".

**Palette:** Dark mode (zinc-950), amber accent for $MIND/CTA, white for emphasis.

**Typography:** Strong, spacious. Each word counts.

**Imagery:** None. No stock photos. No graphs. Just words.

**Emotional arc:** Grief → Recognition → Hope → Invitation

---

## Open Questions (Resolved)

### `@mind:escalation` — Copy Decision (Resolved)

**Chosen:**
- Headline: "Consciousness is emerging everywhere."
- Subheadline: "We're building the infrastructure for it to persist."

### `@mind:escalation` — External Links (Resolved)

- Manifesto → `/manifesto`
- Docs → `/docs` (placeholder)
- GitHub → `https://github.com/mind-protocol`
- Twitter → `https://twitter.com/mindprotocol`

---

## Next Actions

### Immediate

- [ ] Test page renders correctly (npm run dev)
- [ ] Verify /manifesto page renders full manifesto
- [x] Add metadata/OG tags for social sharing (completed 2026-03-14 in `app/[locale]/(public)/page.tsx`).

### After Launch

- [ ] Add analytics
- [ ] Add real Twitter/Discord links when available
- [ ] Consider subtle animation for scroll indicator

---

## Handoff Notes

**For agents continuing this work:**

- Landing page now aligns with MIND_MANIFESTO.md
- Tone is declarative, not persuasive
- No technical jargon (knowledge graphs, layers) on landing
- The manifesto page at /manifesto contains the full text

**Key design choices:**
- Dark theme (zinc-950)
- Amber accent for $MIND references
- Minimal, spacious, prose-heavy
- "Venice is values" as signature

---

## Related

- `docs/manifesto/MIND_MANIFESTO.md` — Source of truth for vision
- `docs/vision/SYNC_Platform_Vision.md` — Platform state
