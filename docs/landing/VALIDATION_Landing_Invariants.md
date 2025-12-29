# Landing Page Invariants

Conditions that must hold for the landing page to function correctly.

```
STATUS: DESIGNING
```

---

## Content Invariants

### LAND-INV-01: Above-Fold Content Visible

Core value proposition visible without scrolling on standard viewports.

**Verification:**
- Headline visible at 1024x768
- Primary CTA visible at 1024x768
- No content blocked by fixed headers

### LAND-INV-02: No Jargon Without Context

Protocol-specific terms explained or linked.

**Verification:**
- "L1/L2/L3/L4" explained in How It Works section
- "Citizen", "Org" defined in context
- "Membrane" linked to explanation
- "Connectome" self-evident from graph visual

### LAND-INV-03: All Links Valid

No broken links on landing page.

**Verification:**
- Internal links resolve
- External links return 200
- CTAs lead to implemented routes

---

## Data Invariants

### LAND-INV-04: Stats Reflect Reality

Displayed numbers match actual L4 registry counts.

**Verification:**
- Stats API returns actual counts
- No hardcoded numbers in UI
- Zero shown if data unavailable (not fake numbers)

### LAND-INV-05: Activity Is Real

Activity feed shows actual recent events.

**Verification:**
- Events pulled from L4
- Timestamps accurate
- No placeholder/mock events in production

### LAND-INV-06: Graceful Degradation

Page functions if APIs fail.

**Verification:**
- Stats section shows dashes, not errors
- Activity section hides or shows placeholder
- Graph preview shows fallback
- Navigation still works

---

## UI Invariants

### LAND-INV-07: Layer Colors Consistent

L1-L4 colors match platform design tokens.

| Layer | Color |
|-------|-------|
| L1 | Blue (#3b82f6) |
| L2 | Green (#22c55e) |
| L3 | Purple (#8b5cf6) |
| L4 | Amber (#f59e0b) |

**Verification:**
- How It Works section uses correct colors
- Colors imported from shared tokens

### LAND-INV-08: Node Colors Consistent

Graph preview uses correct node type colors.

| Type | Color |
|------|-------|
| Actor | Pink (#f472b6) |
| Moment | Blue (#60a5fa) |
| Narrative | Purple (#a78bfa) |
| Space | Green (#4ade80) |
| Thing | Amber (#fbbf24) |

**Verification:**
- Graph preview imports from shared tokens

### LAND-INV-09: Responsive Breakpoints Work

Page renders correctly at all breakpoints.

| Breakpoint | Requirement |
|------------|-------------|
| Desktop (>1024px) | Full layout |
| Tablet (768-1024px) | Adapted layout, readable |
| Mobile (<768px) | Single column, touch-friendly |

**Verification:**
- Manual testing at each breakpoint
- No horizontal scroll
- All CTAs accessible

---

## Performance Invariants

### LAND-INV-10: Fast Initial Load

Landing page loads fast.

| Metric | Target |
|--------|--------|
| First Contentful Paint | < 1s |
| Largest Contentful Paint | < 2.5s |
| Time to Interactive | < 3s |

**Verification:**
- Lighthouse performance audit
- Bundle size < 100KB for landing route

### LAND-INV-11: Animations Smooth

Animations don't drop frames.

**Verification:**
- Graph preview maintains 60fps
- Count-up animation smooth
- Scroll animations don't jank

### LAND-INV-12: Reduced Motion Respected

Users with `prefers-reduced-motion` see no animations.

**Verification:**
- Check `prefers-reduced-motion` media query
- Graph shows static or simplified state
- No scroll animations
- Count-up shows final values immediately

---

## Accessibility Invariants

### LAND-INV-13: Keyboard Navigable

All interactive elements reachable via keyboard.

**Verification:**
- Tab order logical
- Focus visible on all focusable elements
- Enter/Space activate buttons
- Escape closes any modals

### LAND-INV-14: Screen Reader Compatible

Content accessible to screen readers.

**Verification:**
- Semantic HTML (h1, h2, nav, main, etc.)
- ARIA labels on interactive elements
- Alt text on images
- Skip link available

### LAND-INV-15: Sufficient Contrast

Text readable against backgrounds.

**Verification:**
- WCAG AA contrast ratios
- Primary text: 4.5:1 minimum
- Large text: 3:1 minimum

---

## Navigation Invariants

### LAND-INV-16: CTAs Lead Somewhere

All buttons navigate to implemented pages.

**Verification:**
- "Explore Connectome" → `/connectome` (exists)
- "Browse Registry" → `/registry` (exists)
- "Get Started" → valid destination
- No buttons lead to 404

### LAND-INV-17: Logo Returns Home

Clicking logo returns to landing page.

**Verification:**
- Logo in nav links to `/`
- Works from any page

---

## Security Invariants

### LAND-INV-18: No Sensitive Data

Landing page doesn't expose sensitive information.

**Verification:**
- No API keys in client bundle
- No private wallet addresses
- Stats are public information only

---

## Related Invariants

From `docs/vision/VALIDATION_Platform_Invariants.md`:

| Invariant | Relevance |
|-----------|-----------|
| INV-04 (Layer colors) | LAND-INV-07 |
| INV-05 (Node type colors) | LAND-INV-08 |
| INV-09 (Public routes) | Landing is public |
| INV-12 (Initial load) | LAND-INV-10 |
