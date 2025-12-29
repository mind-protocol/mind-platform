# Landing Page — Sync

Current state and handoff notes.

```
LAST_UPDATED: 2025-12-29
UPDATED_BY: Claude (agent)
STATUS: DESIGNING
PRIORITY: P0 (Critical)
```

---

## Current State

**Doc chain complete.** Landing page fully documented but not yet implemented.

| Document | Status |
|----------|--------|
| OBJECTIVES | Complete |
| PATTERNS | Complete |
| BEHAVIORS | Complete |
| ALGORITHM | Complete |
| VALIDATION | Complete |
| IMPLEMENTATION | Complete |
| HEALTH | Complete |
| SYNC | This file |

---

## Implementation Status

### Current Code

```typescript
// app/(public)/page.tsx (current)
export default function HomePage() {
  redirect("/mind");  // Redirects to non-existent route
}
```

### Files to Create/Modify

| File | Status | Priority |
|------|--------|----------|
| `app/(public)/page.tsx` | Replace redirect with landing | High |
| `app/(public)/components/landing/Hero.tsx` | Not created | High |
| `app/(public)/components/landing/HowItWorks.tsx` | Not created | High |
| `app/(public)/components/landing/WhatYouCanDo.tsx` | Not created | High |
| `app/(public)/components/landing/LiveStats.tsx` | Not created | Medium |
| `app/(public)/components/landing/RecentActivity.tsx` | Not created | Medium |
| `app/(public)/components/landing/GraphPreview.tsx` | Not created | Medium |
| `app/(public)/components/nav/TopNav.tsx` | Not created | High |
| `app/(public)/components/nav/Footer.tsx` | Not created | Medium |
| `lib/constants/colors.ts` | Not created | High |
| `app/api/stats/route.ts` | Not created | Medium |
| `app/api/activity/route.ts` | Not created | Low |

---

## Open Questions

### `@mind:escalation` — Copy Decision

Need final headline and subheadline:

**Headline options:**
1. "Mind Protocol" (just the name)
2. "Persistent Memory for AI Agents"
3. "The Knowledge Graph Protocol for AI"

**Subheadline options:**
1. "Give your agents identity, memory, and the ability to connect."
2. "A graph-based protocol for AI knowledge that persists and grows."

`@mind:proposition` — Start with Option 2/1 for clarity:
- Headline: "Persistent Memory for AI Agents"
- Subheadline: "Give your agents identity, memory, and the ability to connect."

### `@mind:escalation` — Brand Assets

Need:
- Logo (Mind Protocol logo)
- Favicon
- Social preview image (for og:image)

`@mind:proposition` — Use text "Mind Protocol" as placeholder. Create simple favicon. Generate og:image later.

### `@mind:escalation` — External Links

Where do these point?
- Docs → External docs site? Or `/docs` route?
- Discord → If community exists
- GitHub → Which repo? `mind-protocol/mind-platform`?

`@mind:proposition` — Start with GitHub link only. Add Docs when docs site exists. Add Discord when community exists.

---

## Dependencies

| Dependency | Status | Blocks |
|------------|--------|--------|
| Tailwind CSS | Configured | Styling |
| Design tokens (colors.ts) | Not created | Color consistency |
| TopNav component | Not created | Navigation |
| L4 API (for stats) | Unknown | Live stats |

---

## Next Actions

### Immediate (Implementation)

1. Create `lib/constants/colors.ts` with design tokens
2. Create `TopNav` component
3. Replace `page.tsx` redirect with Hero section
4. Add HowItWorks section
5. Add WhatYouCanDo section

### After Core Landing

6. Add GraphPreview animation
7. Add LiveStats with API
8. Add Footer
9. Add responsive styles
10. Add RecentActivity

### After Launch

11. Add analytics
12. Add performance monitoring
13. Optimize bundle size

---

## Build Order Recommendation

```
Phase 1: Static Landing (No API)
├── Design tokens
├── TopNav
├── Hero (static)
├── HowItWorks
├── WhatYouCanDo (links to existing routes)
└── Footer

Phase 2: Dynamic Elements
├── GraphPreview animation
├── /api/stats endpoint
├── LiveStats component
└── /api/activity endpoint (optional)

Phase 3: Polish
├── Animations (scroll, count-up)
├── Responsive refinement
├── Performance optimization
└── Analytics
```

---

## Handoff Notes

**For agents continuing this work:**

- Landing is P0 priority — builds first impression
- Current page.tsx just redirects to non-existent /mind
- Design tokens needed first (shared by multiple components)
- Start with static content, add data fetching later
- GraphPreview can be simplified or deferred

**Key decisions:**
- Dark theme (zinc-950 background)
- Amber accent (L4 color) for primary CTAs
- Canvas-based graph preview (not heavy library)
- Graceful degradation if APIs fail

**Copy to use (pending confirmation):**
- Headline: "Persistent Memory for AI Agents"
- Subheadline: "Give your agents identity, memory, and the ability to connect."

---

## Related

- `docs/vision/SYNC_Platform_Vision.md` — Platform state
- `docs/registry/` — Registry module (linked from landing)
- `docs/connectome/` — Connectome module (linked from landing)
