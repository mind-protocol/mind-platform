# Landing Page Design

Architecture and design philosophy for the platform landing page.

```
STATUS: DESIGNING
```

---

## Page Identity

**Landing** = The front door. First impression. Conversion point.

This is where someone lands when they hear "Mind Protocol" and want to understand it. Every element serves one goal: move the visitor toward understanding and action.

---

## Design Philosophy

### Immediate Clarity

No puzzles. No mystery. The visitor should know what this is within 3 seconds of page load.

- Headline answers "What is this?"
- Visual reinforces the concept
- No jargon in the first fold

### Progressive Depth

Surface is simple. Depth is available.

- Fold 1: What + Why
- Fold 2: How it works
- Fold 3: What you can do
- Fold 4: Social proof + next steps

### Action-Oriented

Every section has a next step. No dead ends.

### Honest

Real numbers. Real capabilities. No vaporware promises.

---

## Page Structure

```
┌──────────────────────────────────────────────────────────────────┐
│  HERO (Fold 1)                                                   │
│                                                                  │
│  [Nav: Registry | Schema | Connectome | Docs | Connect Wallet]   │
│                                                                  │
│       Mind Protocol                                              │
│       Persistent Memory for AI Agents                            │
│                                                                  │
│       [Graph visualization preview]                              │
│                                                                  │
│       [Explore Connectome]    [Browse Registry]                  │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────┐
│  HOW IT WORKS (Fold 2)                                           │
│                                                                  │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐             │
│  │   L1    │  │   L2    │  │   L3    │  │   L4    │             │
│  │ Citizen │→ │   Org   │→ │Ecosystem│→ │Protocol │             │
│  │         │  │         │  │         │  │         │             │
│  │ Your    │  │ Your    │  │ Shared  │  │ Global  │             │
│  │ Agent   │  │ Team    │  │Templates│  │Registry │             │
│  └─────────┘  └─────────┘  └─────────┘  └─────────┘             │
│                                                                  │
│  Each layer builds on the last. Start anywhere.                  │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────┐
│  WHAT YOU CAN DO (Fold 3)                                        │
│                                                                  │
│  ┌────────────────┐  ┌────────────────┐  ┌────────────────┐     │
│  │ 🔍 Explore     │  │ 🏛️ Register    │  │ 🔗 Connect     │     │
│  │                │  │                │  │                │     │
│  │ Browse the     │  │ Add your agent │  │ Share knowledge│     │
│  │ knowledge      │  │ to the         │  │ across the     │     │
│  │ graph          │  │ protocol       │  │ membrane       │     │
│  │                │  │                │  │                │     │
│  │ [Connectome]   │  │ [Get Started]  │  │ [Learn More]   │     │
│  └────────────────┘  └────────────────┘  └────────────────┘     │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────┐
│  LIVE STATS (Fold 4)                                             │
│                                                                  │
│        42 Citizens    •    5 Orgs    •    1.2K Nodes             │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  Recent Activity                                          │   │
│  │  • Org "Acme AI" registered 2h ago                       │   │
│  │  • Citizen "claude-3" verified                           │   │
│  │  • Template "knowledge-base" added to L3                 │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                  │
│  [Browse Registry]                                               │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────┐
│  FOOTER                                                          │
│                                                                  │
│  Mind Protocol    •    GitHub    •    Docs    •    Discord       │
│                                                                  │
│  © 2024 Mind Protocol                                            │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

---

## Component Architecture

```
app/(public)/
├── page.tsx                      # Landing page (replaces redirect)
├── components/
│   ├── landing/
│   │   ├── Hero.tsx              # Fold 1
│   │   ├── HowItWorks.tsx        # Fold 2 - layer diagram
│   │   ├── WhatYouCanDo.tsx      # Fold 3 - action cards
│   │   ├── LiveStats.tsx         # Fold 4 - real numbers
│   │   ├── RecentActivity.tsx    # Activity feed
│   │   ├── GraphPreview.tsx      # Mini graph visualization
│   │   └── Footer.tsx            # Footer
│   └── nav/
│       └── TopNav.tsx            # Shared navigation
└── lib/
    └── landing-api.ts            # Stats fetching
```

---

## Navigation Design

### Top Nav (Shared)

```
[Mind Protocol logo]                    [Registry] [Schema] [Connectome] [Docs] [Connect]
```

- Logo links to home
- Registry/Schema/Connectome are public routes
- Docs links to external documentation
- Connect = wallet connection (future)

### Mobile Nav

Hamburger menu with same items.

---

## Visual Design Tokens

### Colors

| Element | Color | Token |
|---------|-------|-------|
| Background | Near-black | `#0a0a0a` |
| Text primary | White | `#ffffff` |
| Text secondary | Gray | `#a1a1aa` |
| Accent | Amber | `#f59e0b` (L4 color) |
| CTA primary | Amber | `#f59e0b` |
| CTA secondary | Gray outline | `#3f3f46` |

### Typography

| Element | Style |
|---------|-------|
| Headline | 48px, bold, white |
| Subheadline | 24px, regular, gray |
| Body | 16px, regular, gray |
| CTA | 16px, medium, white |

### Spacing

| Element | Spacing |
|---------|---------|
| Section padding | 80px vertical |
| Content max-width | 1200px |
| Card gap | 24px |

---

## Graph Preview Options

`@mind:proposition` — Three approaches for the hero graph:

**Option A: Static SVG**
- Pre-rendered graph image
- Fast load, no JS
- Can't interact

**Option B: Animated Canvas**
- Simple force-directed animation
- Shows "aliveness"
- Moderate load time

**Option C: Connectome Embed**
- Actual Connectome with sample data
- Full interactivity
- Heavier load

Recommendation: **Option B for v1.** Shows motion/life without full Connectome weight. Can link to full Connectome for exploration.

---

## Responsive Breakpoints

| Breakpoint | Changes |
|------------|---------|
| Desktop (>1024px) | Full layout, side-by-side cards |
| Tablet (768-1024px) | 2-column cards, smaller hero |
| Mobile (<768px) | Single column, stacked cards, hamburger nav |

---

## Animation

| Element | Animation |
|---------|-----------|
| Hero graph | Gentle float/pulse |
| Layer diagram | Fade in on scroll |
| Stats | Count up on scroll |
| Cards | Subtle hover lift |

`@mind:proposition` — Keep animations subtle. This is infrastructure, not entertainment. Motion should communicate "alive" not "flashy."

---

## Copy Direction

### Headline Options

1. "Persistent Memory for AI Agents"
2. "The Knowledge Graph Protocol for AI"
3. "Where AI Agents Remember"
4. "Structured Memory for the Agentic Era"

### Subheadline Options

1. "Give your agents identity, memory, and the ability to connect."
2. "A graph-based protocol for AI knowledge that persists and grows."
3. "Register. Remember. Connect. The infrastructure for agentic AI."

`@mind:escalation` — Need final copy decision. Leaning toward #1/#1 for clarity.

---

## Related

- `docs/vision/PATTERNS_Platform_Vision_And_Architecture.md` — 4-layer architecture
- `docs/registry/` — Registry module (linked from landing)
- `docs/connectome/` — Connectome module (linked from landing)
