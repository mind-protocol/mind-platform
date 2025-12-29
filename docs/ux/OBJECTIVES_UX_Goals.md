# UX Module Objectives

Goals for the Mind Platform user experience patterns.

```
STATUS: DESIGNING
```

---

## Primary Goal

**Make the complexity of a 4-layer knowledge protocol feel simple and explorable.**

Mind Protocol has deep concepts (layers, graphs, membranes, verification). The UX must make these approachable without dumbing them down.

---

## Ranked Objectives

### 1. Explorable (Weight: 0.30)

Users can wander and discover without fear.

**Success criteria:**
- No destructive actions without confirmation
- Back button always works
- State preserved during exploration
- Clear paths to go deeper or return

### 2. Predictable (Weight: 0.25)

Same patterns everywhere.

**Success criteria:**
- Navigation consistent across modules
- Actions have consistent effects
- Visual language learnable once
- No module-specific "gotchas"

### 3. Progressive (Weight: 0.20)

Complexity revealed as needed.

**Success criteria:**
- New users see essentials only
- Power features discoverable
- Tooltips explain without blocking
- Advanced modes available but hidden

### 4. Responsive (Weight: 0.15)

Feels fast.

**Success criteria:**
- Optimistic updates where safe
- Loading states immediate
- No hanging UI
- Errors clear and recoverable

### 5. Accessible (Weight: 0.10)

Usable by everyone.

**Success criteria:**
- Keyboard navigation complete
- Screen reader compatible
- Reduced motion support
- Color not sole indicator

---

## Non-Goals

| Excluded | Why |
|----------|-----|
| Gamification | This is infrastructure, not entertainment |
| Social features | Focus on data, not interaction |
| Mobile-first | Desktop-first for complex graph work |
| Onboarding tutorials | Discoverable UI over guided tours |

---

## Tradeoffs

### Accepted

| Tradeoff | Rationale |
|----------|-----------|
| Density over whitespace | Power users need information |
| Keyboard over gesture | Desktop-first audience |
| Labels over icons | Protocol concepts need words |

### Rejected

| Tradeoff | Why Rejected |
|----------|--------------|
| Wizard flows | Exploration over hand-holding |
| Hidden navigation | Discoverability matters |
| Auto-save everything | Some actions need intent |

---

## User Journeys

### Journey 1: First Visit

```
Landing → Browse Registry → Click Citizen → View Detail → Click "View in Connectome" → Explore Graph
```

**UX requirements:**
- No login required
- Clear CTAs
- Immediate value (see real data)

### Journey 2: Deep Exploration

```
Connectome → Search "project management" → Click result → Expand neighborhood → Follow edge → Find related narrative
```

**UX requirements:**
- Search is semantic, forgiving
- Graph navigation intuitive
- Back navigation preserves state
- Info panel shows context

### Journey 3: Organization Admin

```
Login → Org Dashboard → View citizens → Check verification status → Update endpoint → View activity
```

**UX requirements:**
- Dashboard shows health at glance
- Actions are clear and confirmable
- Changes reflect immediately

---

## Interaction Patterns

### Navigation

| Pattern | Use |
|---------|-----|
| Tab bar | Switch between peer views (Citizens/Orgs) |
| Breadcrumb | Show location in hierarchy |
| Back button | Return to previous state |
| Deep link | Share specific views |

### Selection

| Pattern | Use |
|---------|-----|
| Click | Select, navigate |
| Hover | Preview, tooltip |
| Double-click | Open detail |
| Right-click | Context actions (if any) |

### Feedback

| State | Visual |
|-------|--------|
| Loading | Skeleton or spinner |
| Success | Brief toast or inline |
| Error | Inline message with retry |
| Empty | Friendly placeholder |

---

## Open Questions

`@mind:escalation` — UX decisions needed:

### 1. Login Trigger

**Question:** When does login happen?

**Options:**
1. Login prompt when accessing dashboard features (recommended)
2. Login button always visible, optional until needed
3. Full app requires login

### 2. Search Scope

**Question:** Is search global or contextual?

**Options:**
1. Global search across all modules (recommended)
2. Per-module search only
3. Both with toggle

### 3. Mobile Strategy

**Question:** What's the mobile experience?

**Options:**
1. Responsive, reduced functionality (recommended for v1)
2. Full feature parity
3. Mobile app later
4. Desktop-only explicit

### 4. Keyboard Shortcuts

**Question:** Should we have keyboard shortcuts?

**Options:**
1. Essential only (search, navigation) — recommended
2. Comprehensive vim-like bindings
3. None for v1
