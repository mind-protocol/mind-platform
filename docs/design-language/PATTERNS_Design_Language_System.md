# Design Language System

Architecture for the Mind Platform design system.

```
STATUS: DESIGNING
```

---

## System Identity

**Design Language** = The visual vocabulary and grammar that makes Mind Protocol's UI coherent and meaningful.

This is not a component library (that's implementation). This is the design principles, tokens, and patterns that components implement.

---

## Design Philosophy

### 1. Data is the Hero

The UI exists to present data, not to be looked at. Every pixel should serve the information.

- Minimal chrome
- Maximum content density where appropriate
- No decorative elements

### 2. Layers are Primary Navigation

The 4-layer architecture is the mental model. The UI reinforces it constantly.

- Layer indicators always visible
- Layer colors consistent
- Transitions between layers are explicit

### 3. Semantic Color

Color carries meaning. It's not aesthetic — it's information.

- Layer colors = location
- Node type colors = what kind of thing
- Verification colors = trust level
- Energy/weight = activity level (opacity, glow)

### 4. Progressive Disclosure

Show the right amount at the right time.

- Overview first
- Details on demand
- Expert features discoverable, not intrusive

### 5. Dark by Default

Optimized for:
- Long sessions
- Data visualization contrast
- Developer audience
- Reduced eye strain

---

## Token Architecture

```
lib/
└── design/
    ├── tokens/
    │   ├── colors.ts          # Color primitives + semantics
    │   ├── spacing.ts         # Spacing scale
    │   ├── typography.ts      # Font sizes, weights
    │   ├── shadows.ts         # Elevation system
    │   └── animation.ts       # Duration, easing
    ├── themes/
    │   └── dark.ts            # Dark theme (only theme for v1)
    └── index.ts               # Unified export
```

---

## Color System

### Primitives (Raw Values)

```typescript
// Base palette - not used directly
const primitives = {
  zinc: {
    50: '#fafafa',
    100: '#f4f4f5',
    // ...
    900: '#18181b',
    950: '#0a0a0a',
  },
  blue: { /* ... */ },
  green: { /* ... */ },
  purple: { /* ... */ },
  amber: { /* ... */ },
  pink: { /* ... */ },
  red: { /* ... */ },
};
```

### Semantic Tokens (Use These)

```typescript
export const colors = {
  // Backgrounds
  bg: {
    primary: '#0a0a0a',      // Page background
    secondary: '#18181b',    // Card/surface background
    tertiary: '#27272a',     // Hover states
    elevated: '#3f3f46',     // Modals, popovers
  },

  // Text
  text: {
    primary: '#ffffff',
    secondary: '#a1a1aa',
    tertiary: '#71717a',
    inverse: '#0a0a0a',
  },

  // Borders
  border: {
    default: '#3f3f46',
    subtle: '#27272a',
    strong: '#52525b',
  },

  // Layers
  layer: {
    L1: '#3b82f6',
    L2: '#22c55e',
    L3: '#8b5cf6',
    L4: '#f59e0b',
  },

  // Node types
  nodeType: {
    Actor: '#f472b6',
    Moment: '#60a5fa',
    Narrative: '#a78bfa',
    Space: '#4ade80',
    Thing: '#fbbf24',
  },

  // Verification states
  verification: {
    unverified: '#6b7280',
    pending: '#f59e0b',
    provisional: '#3b82f6',
    verified: '#22c55e',
    rejected: '#ef4444',
  },

  // Status
  status: {
    success: '#22c55e',
    warning: '#f59e0b',
    error: '#ef4444',
    info: '#3b82f6',
  },

  // Accent
  accent: {
    primary: '#f59e0b',
    secondary: '#3b82f6',
  },
};
```

---

## Typography

### Scale

| Token | Size | Weight | Use |
|-------|------|--------|-----|
| `display` | 48px | 700 | Hero headlines |
| `h1` | 36px | 700 | Page titles |
| `h2` | 24px | 600 | Section titles |
| `h3` | 18px | 600 | Card titles |
| `body` | 16px | 400 | Default text |
| `small` | 14px | 400 | Secondary text |
| `tiny` | 12px | 400 | Labels, badges |
| `mono` | 14px | 400 | Code, IDs |

### Font Stack

```typescript
export const fonts = {
  sans: 'Inter, system-ui, sans-serif',
  mono: 'JetBrains Mono, Menlo, monospace',
};
```

---

## Spacing

8px base unit.

| Token | Value |
|-------|-------|
| `1` | 4px |
| `2` | 8px |
| `3` | 12px |
| `4` | 16px |
| `5` | 20px |
| `6` | 24px |
| `8` | 32px |
| `10` | 40px |
| `12` | 48px |
| `16` | 64px |
| `20` | 80px |

---

## Component Patterns

### Cards

```
┌──────────────────────────────────────┐
│  [Layer Badge]              [Action] │
│                                      │
│  Title                               │
│  Secondary text                      │
│                                      │
│  [Tag] [Tag] [Tag]                   │
└──────────────────────────────────────┘
```

- Background: `bg.secondary`
- Border: `border.default`
- Hover: `border.strong`
- Padding: `6` (24px)

### Badges

| Type | Background | Text |
|------|------------|------|
| Layer | Layer color @ 20% | Layer color |
| Verification | Verification color @ 20% | Verification color |
| Status | Status color @ 20% | Status color |

### Buttons

| Variant | Background | Text | Border |
|---------|------------|------|--------|
| Primary | `accent.primary` | `text.inverse` | none |
| Secondary | transparent | `text.primary` | `border.default` |
| Ghost | transparent | `text.secondary` | none |

---

## Animation

### Durations

| Token | Value | Use |
|-------|-------|-----|
| `fast` | 100ms | Hover states |
| `normal` | 200ms | Transitions |
| `slow` | 300ms | Modals, panels |
| `graph` | 500ms | Graph animations |

### Easing

| Token | Value | Use |
|-------|-------|-----|
| `default` | `ease-out` | Most transitions |
| `spring` | `cubic-bezier(0.34, 1.56, 0.64, 1)` | Bouncy elements |
| `smooth` | `cubic-bezier(0.4, 0, 0.2, 1)` | Smooth transitions |

---

## Layer Visual Language

### L1 (Citizen) — Blue

- Personal, individual
- "My" prefix in labels
- Solid blue accents
- Private by default

### L2 (Organization) — Green

- Team, shared
- Org name prominent
- Green borders/badges
- Collaborative

### L3 (Ecosystem) — Purple

- Community, templates
- Browse/discover UX
- Purple category tags
- Contribution flows

### L4 (Protocol) — Amber

- Global, authoritative
- Read-mostly
- Amber verification badges
- Source of truth

---

## Graph Visual Language

### Nodes

| Property | Visual |
|----------|--------|
| Type | Fill color |
| Weight | Size (radius) |
| Energy | Glow intensity |
| Selected | Ring highlight |
| Dimmed | Low opacity |

### Edges

| Property | Visual |
|----------|--------|
| Polarity | Arrow direction |
| Weight | Line thickness |
| Hierarchy | Dash pattern (contains=solid, elaborates=dashed) |
| Permanence | Opacity |

---

## Open Questions

`@mind:escalation` — Design decisions needed:

1. **Brand color:** Is amber the primary brand color? Or should we have a distinct "Mind Protocol" brand color?

2. **Logo:** Text "Mind Protocol" or symbol? Need asset.

3. **Icon set:** Use existing (Lucide, Heroicons) or custom?

4. **Font licensing:** Inter and JetBrains Mono are both open source — confirm OK.

`@mind:proposition` — Recommendations:
1. Use amber as brand (matches L4/protocol, establishes hierarchy)
2. Text logo for v1, design symbol later
3. Lucide icons (lightweight, good coverage)
4. Both fonts are OFL licensed, no issues
