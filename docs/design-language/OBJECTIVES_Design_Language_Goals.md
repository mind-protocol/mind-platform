# Design Language Objectives

Goals for the Mind Platform visual and interaction design system.

```
STATUS: DESIGNING
```

---

## Primary Goal

**Create a coherent visual language that makes the 4-layer architecture intuitive.**

Users should understand what layer they're in, what actions are available, and what data they're seeing — all through visual cues alone.

---

## Ranked Objectives

### 1. Layer Clarity (Weight: 0.35)

Every screen, component, and interaction clearly signals its layer context.

**Success criteria:**
- L1/L2/L3/L4 visually distinct at a glance
- Users can answer "what layer is this?" without reading
- Layer transitions are visible and meaningful

### 2. Semantic Color (Weight: 0.25)

Colors carry meaning, not just aesthetics.

**Success criteria:**
- Layer colors consistent everywhere
- Node type colors match schema semantics
- Verification states have distinct colors
- Color alone never the only signal (accessibility)

### 3. Information Density (Weight: 0.20)

Balance between data richness and cognitive load.

**Success criteria:**
- Power users can see dense information
- New users aren't overwhelmed
- Progressive disclosure for complexity
- Graph visualizations readable at multiple scales

### 4. Consistency (Weight: 0.15)

Same patterns everywhere, learnable once.

**Success criteria:**
- Shared component library
- Predictable interaction patterns
- No "special cases" in UI behavior

### 5. Accessibility (Weight: 0.05)

Usable by everyone.

**Success criteria:**
- WCAG AA compliance
- Keyboard navigation complete
- Screen reader compatible
- Reduced motion support

---

## Non-Goals

| Excluded | Why |
|----------|-----|
| Custom branding per org | Platform identity must be consistent |
| Theme switching (light/dark) | Dark theme only for v1, simplifies design |
| Animation-heavy UI | Substance over flash |
| Mobile-first | Desktop-first for complex graph interactions |

---

## Tradeoffs

### Accepted

| Tradeoff | Rationale |
|----------|-----------|
| Dark theme only | Reduces design surface, better for data viz |
| Fixed color palette | Layer semantics require consistency |
| Minimal animation | Focus on data, not decoration |

### Rejected

| Tradeoff | Why Rejected |
|----------|--------------|
| Monochrome UI | Layers need color distinction |
| Heavy use of icons | Text more precise for protocol concepts |
| Skeuomorphic design | Abstract concepts, abstract UI |

---

## Design Tokens Required

`@mind:escalation` — Need decisions on:

### Color Palette

| Token | Current Proposal | Decision Needed |
|-------|-----------------|-----------------|
| Background | `#0a0a0a` (near-black) | Confirm |
| Surface | `#18181b` (zinc-900) | Confirm |
| Border | `#3f3f46` (zinc-700) | Confirm |
| Text primary | `#ffffff` | Confirm |
| Text secondary | `#a1a1aa` (zinc-400) | Confirm |
| Accent | `#f59e0b` (amber) | Confirm — is amber the brand color? |

### Layer Colors

| Layer | Proposed | Semantic |
|-------|----------|----------|
| L1 | `#3b82f6` (blue) | Personal, individual |
| L2 | `#22c55e` (green) | Organization, team |
| L3 | `#8b5cf6` (purple) | Ecosystem, community |
| L4 | `#f59e0b` (amber) | Protocol, global |

### Node Type Colors (from schema)

| Type | Proposed | Semantic |
|------|----------|----------|
| Actor | `#f472b6` (pink) | Agency, identity |
| Moment | `#60a5fa` (light blue) | Time, events |
| Narrative | `#a78bfa` (light purple) | Meaning, story |
| Space | `#4ade80` (light green) | Context, container |
| Thing | `#fbbf24` (amber) | Artifact, concrete |

---

## Dependencies

| Dependency | Status |
|------------|--------|
| Tailwind CSS | Configured |
| CSS custom properties | To implement |
| Component library | To create |
