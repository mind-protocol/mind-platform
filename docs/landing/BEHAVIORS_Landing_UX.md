# Landing Page Behaviors

Observable user experience patterns.

```
STATUS: DESIGNING
```

---

## Entry Points

### Direct Navigation

User types `platform.mindprotocol.ai` or clicks link from external source.

**Expected state:**
- Full landing page renders
- Above-fold content visible immediately
- Graph preview loads/animates

### From Search Engine

User finds page via search for "mind protocol" or similar.

**Expected state:**
- Meta description matches page content
- No jarring mismatch between search snippet and page

### Return Visit

User has visited before, returns.

**Expected state:**
- Page loads (no special "welcome back")
- May have wallet connection persisted

---

## Scroll Behaviors

### Progressive Reveal

| Scroll Position | Visible Content |
|-----------------|-----------------|
| 0% | Hero + nav |
| 25% | How it works (layer diagram) |
| 50% | What you can do (action cards) |
| 75% | Live stats + activity |
| 100% | Footer |

### Scroll Indicators

- Subtle down-arrow or scroll hint at bottom of hero
- No persistent scroll progress bar (too heavy)

### Animation Triggers

| Element | Trigger | Animation |
|---------|---------|-----------|
| Layer cards | Enter viewport | Fade in, stagger 100ms |
| Action cards | Enter viewport | Fade in, stagger 100ms |
| Stats numbers | Enter viewport | Count up from 0 |
| Activity feed | Enter viewport | Slide in |

---

## Navigation Behaviors

### Top Nav

| Action | Result |
|--------|--------|
| Click logo | Scroll to top (or refresh if at top) |
| Click Registry | Navigate to `/registry` |
| Click Schema | Navigate to `/schema` |
| Click Connectome | Navigate to `/connectome` |
| Click Docs | Open docs (external or `/docs`) |
| Click Connect | Open wallet connection modal (future) |

### Mobile Nav

| Action | Result |
|--------|--------|
| Click hamburger | Open slide-out menu |
| Click outside menu | Close menu |
| Click nav item | Navigate + close menu |

### CTA Buttons

| Button | Location | Destination |
|--------|----------|-------------|
| "Explore Connectome" | Hero | `/connectome` |
| "Browse Registry" | Hero | `/registry` |
| "Connectome" | Action card | `/connectome` |
| "Get Started" | Action card | `/docs/getting-started` or `/registry` |
| "Learn More" | Action card | `/docs/membrane` or scroll to section |

---

## Interactive Elements

### Graph Preview (Hero)

| Action | Result |
|--------|--------|
| Hover | Nodes brighten slightly |
| Click | Navigate to `/connectome` |
| Touch (mobile) | Navigate to `/connectome` |

### Layer Diagram

| Action | Result |
|--------|--------|
| Hover L1-L4 card | Highlight, show brief tooltip |
| Click L1 | Navigate to `/citizen` (if auth) or info modal |
| Click L2 | Navigate to `/org` (if auth) or info modal |
| Click L3 | Navigate to `/templates` |
| Click L4 | Navigate to `/registry` |

### Stats

| Action | Result |
|--------|--------|
| Click citizen count | Navigate to `/registry?tab=citizens` |
| Click org count | Navigate to `/registry?tab=orgs` |
| Click node count | Navigate to `/connectome` |

### Activity Feed

| Action | Result |
|--------|--------|
| Click activity item | Navigate to relevant detail page |
| Hover | Highlight row |

---

## Loading States

### Initial Page Load

```
1. HTML shell renders (immediate)
2. CSS applies (immediate)
3. Static content visible (< 100ms)
4. Graph preview loads (< 500ms)
5. Stats fetch + count up (< 1s)
6. Activity feed populates (< 1s)
```

### Graph Preview Loading

```
[Placeholder with subtle pulse animation]
     ↓ (on load)
[Animated graph appears with fade-in]
```

### Stats Loading

```
[— Citizens]  [— Orgs]  [— Nodes]
     ↓ (on data fetch)
[42 Citizens] [5 Orgs]  [1.2K Nodes]
     ↑ (count-up animation)
```

---

## Error States

### Stats API Error

```
Instead of numbers:
[— Citizens]  [— Orgs]  [— Nodes]

No error message shown (degrades gracefully)
```

### Activity Feed Error

```
Section hidden or shows:
"Activity temporarily unavailable"
```

### Graph Preview Error

```
Fallback to static SVG or:
[Abstract pattern placeholder]
```

---

## Responsive Behaviors

### Desktop → Tablet

- Nav items compress, may move some to overflow
- Hero text sizes down
- Layer cards become 2x2 grid

### Tablet → Mobile

- Nav becomes hamburger
- Hero full-width, stacked
- Layer cards become vertical stack
- Action cards become vertical stack
- Stats stack vertically

### Touch Interactions

- All hover states have touch equivalents
- Buttons have sufficient touch targets (44px min)
- Swipe not used (simple scroll page)

---

## Accessibility

| Requirement | Implementation |
|-------------|----------------|
| Screen reader | Semantic HTML, ARIA labels |
| Keyboard nav | Tab order logical, focus visible |
| Color blindness | Icons accompany color, sufficient contrast |
| Reduced motion | `prefers-reduced-motion` disables animations |
| Skip link | "Skip to main content" for keyboard users |

---

## Performance Targets

| Metric | Target |
|--------|--------|
| First Contentful Paint | < 1s |
| Largest Contentful Paint | < 2.5s |
| Time to Interactive | < 3s |
| Cumulative Layout Shift | < 0.1 |
| Total bundle size | < 100KB (landing route) |
