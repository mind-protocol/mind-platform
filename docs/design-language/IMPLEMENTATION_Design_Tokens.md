# Design Language Implementation

Code structure for design tokens and theme.

```
STATUS: DESIGNING
```

---

## File Structure

```
lib/
├── design/
│   ├── tokens.ts              # All design tokens
│   ├── utils.ts               # Color utilities (alpha, contrast)
│   └── index.ts               # Unified export
├── constants/
│   └── colors.ts              # Legacy (migrate to design/)
└── components/
    └── ui/                    # Shared UI components
```

---

## Token Implementation

```typescript
// lib/design/tokens.ts

// =============================================================================
// COLOR PRIMITIVES
// =============================================================================

const zinc = {
  50: '#fafafa',
  100: '#f4f4f5',
  200: '#e4e4e7',
  300: '#d4d4d8',
  400: '#a1a1aa',
  500: '#71717a',
  600: '#52525b',
  700: '#3f3f46',
  800: '#27272a',
  900: '#18181b',
  950: '#0a0a0a',
} as const;

// =============================================================================
// SEMANTIC COLORS
// =============================================================================

export const colors = {
  // Backgrounds
  bg: {
    primary: zinc[950],
    secondary: zinc[900],
    tertiary: zinc[800],
    elevated: zinc[700],
  },

  // Text
  text: {
    primary: '#ffffff',
    secondary: zinc[400],
    tertiary: zinc[500],
    inverse: zinc[950],
  },

  // Borders
  border: {
    default: zinc[700],
    subtle: zinc[800],
    strong: zinc[600],
  },

  // Layers
  layer: {
    L1: '#3b82f6',  // Blue
    L2: '#22c55e',  // Green
    L3: '#8b5cf6',  // Purple
    L4: '#f59e0b',  // Amber
  },

  // Node types (schema)
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
    hover: '#d97706',
  },
} as const;

// =============================================================================
// TYPOGRAPHY
// =============================================================================

export const fonts = {
  sans: 'Inter, ui-sans-serif, system-ui, sans-serif',
  mono: 'JetBrains Mono, ui-monospace, monospace',
} as const;

export const fontSize = {
  display: ['3rem', { lineHeight: '1.1', fontWeight: '700' }],
  h1: ['2.25rem', { lineHeight: '1.2', fontWeight: '700' }],
  h2: ['1.5rem', { lineHeight: '1.3', fontWeight: '600' }],
  h3: ['1.125rem', { lineHeight: '1.4', fontWeight: '600' }],
  body: ['1rem', { lineHeight: '1.5', fontWeight: '400' }],
  small: ['0.875rem', { lineHeight: '1.5', fontWeight: '400' }],
  tiny: ['0.75rem', { lineHeight: '1.5', fontWeight: '400' }],
} as const;

// =============================================================================
// SPACING
// =============================================================================

export const spacing = {
  px: '1px',
  0: '0',
  0.5: '0.125rem',  // 2px
  1: '0.25rem',     // 4px
  2: '0.5rem',      // 8px
  3: '0.75rem',     // 12px
  4: '1rem',        // 16px
  5: '1.25rem',     // 20px
  6: '1.5rem',      // 24px
  8: '2rem',        // 32px
  10: '2.5rem',     // 40px
  12: '3rem',       // 48px
  16: '4rem',       // 64px
  20: '5rem',       // 80px
} as const;

// =============================================================================
// ANIMATION
// =============================================================================

export const animation = {
  duration: {
    fast: '100ms',
    normal: '200ms',
    slow: '300ms',
    graph: '500ms',
  },
  easing: {
    default: 'ease-out',
    spring: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
    smooth: 'cubic-bezier(0.4, 0, 0.2, 1)',
  },
} as const;

// =============================================================================
// SHADOWS
// =============================================================================

export const shadows = {
  sm: '0 1px 2px 0 rgb(0 0 0 / 0.5)',
  md: '0 4px 6px -1px rgb(0 0 0 / 0.5)',
  lg: '0 10px 15px -3px rgb(0 0 0 / 0.5)',
  glow: (color: string) => `0 0 20px ${color}40`,
} as const;

// =============================================================================
// RADII
// =============================================================================

export const radii = {
  none: '0',
  sm: '0.25rem',    // 4px
  md: '0.5rem',     // 8px
  lg: '0.75rem',    // 12px
  full: '9999px',
} as const;
```

---

## Utility Functions

```typescript
// lib/design/utils.ts

/**
 * Add alpha channel to hex color
 */
export function alpha(color: string, opacity: number): string {
  const hex = Math.round(opacity * 255).toString(16).padStart(2, '0');
  return `${color}${hex}`;
}

/**
 * Get layer color by key
 */
export function getLayerColor(layer: 'L1' | 'L2' | 'L3' | 'L4'): string {
  return colors.layer[layer];
}

/**
 * Get node type color
 */
export function getNodeTypeColor(type: string): string {
  return colors.nodeType[type as keyof typeof colors.nodeType] ?? colors.text.secondary;
}

/**
 * Get verification badge color
 */
export function getVerificationColor(state: string): string {
  return colors.verification[state as keyof typeof colors.verification] ?? colors.verification.unverified;
}
```

---

## Tailwind Integration

```typescript
// tailwind.config.ts

import { colors, fonts, spacing, radii } from './lib/design/tokens';

export default {
  theme: {
    extend: {
      colors: {
        bg: colors.bg,
        text: colors.text,
        border: colors.border,
        layer: colors.layer,
        nodeType: colors.nodeType,
        verification: colors.verification,
        status: colors.status,
        accent: colors.accent,
      },
      fontFamily: {
        sans: [fonts.sans],
        mono: [fonts.mono],
      },
      // ... spacing, radii, etc.
    },
  },
};
```

---

## CSS Custom Properties (Alternative)

```css
/* app/globals.css */

:root {
  /* Backgrounds */
  --bg-primary: #0a0a0a;
  --bg-secondary: #18181b;
  --bg-tertiary: #27272a;
  --bg-elevated: #3f3f46;

  /* Text */
  --text-primary: #ffffff;
  --text-secondary: #a1a1aa;
  --text-tertiary: #71717a;

  /* Borders */
  --border-default: #3f3f46;
  --border-subtle: #27272a;

  /* Layers */
  --layer-l1: #3b82f6;
  --layer-l2: #22c55e;
  --layer-l3: #8b5cf6;
  --layer-l4: #f59e0b;

  /* Node types */
  --node-actor: #f472b6;
  --node-moment: #60a5fa;
  --node-narrative: #a78bfa;
  --node-space: #4ade80;
  --node-thing: #fbbf24;

  /* Verification */
  --verify-unverified: #6b7280;
  --verify-pending: #f59e0b;
  --verify-provisional: #3b82f6;
  --verify-verified: #22c55e;
  --verify-rejected: #ef4444;

  /* Accent */
  --accent-primary: #f59e0b;
}
```

---

## Usage Examples

### Component with Tokens

```tsx
import { colors, spacing } from '@/lib/design/tokens';
import { getLayerColor, alpha } from '@/lib/design/utils';

function LayerBadge({ layer }: { layer: 'L1' | 'L2' | 'L3' | 'L4' }) {
  const color = getLayerColor(layer);

  return (
    <span
      style={{
        backgroundColor: alpha(color, 0.2),
        color: color,
        padding: `${spacing[1]} ${spacing[2]}`,
        borderRadius: radii.sm,
      }}
    >
      {layer}
    </span>
  );
}
```

### Tailwind Classes

```tsx
function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-bg-secondary border border-border-default rounded-lg p-6">
      {children}
    </div>
  );
}
```

---

## Migration from Current Code

Current code uses hardcoded colors in:
- `app/connectome/lib/connectome_system_map_node_edge_manifest.ts`
- Various component files

Migration steps:
1. Create `lib/design/tokens.ts`
2. Update Tailwind config to use tokens
3. Replace hardcoded colors with token references
4. Update globals.css with CSS custom properties

---

## Open Questions

`@mind:proposition` — Use CSS custom properties OR TypeScript tokens?

**CSS Custom Properties:**
- Pros: Runtime themeable, CSS native, smaller bundle
- Cons: String-based, less type-safe

**TypeScript Tokens:**
- Pros: Type-safe, IDE autocomplete, computed values
- Cons: Harder to theme at runtime

Recommendation: **TypeScript tokens with CSS custom property fallback.** Use TS tokens in components, generate CSS vars for globals.css.
