// =============================================================================
// DESIGN THEME — Mind Protocol Design Language
// =============================================================================
// Note: "tokens" reserved for $MIND token (Solana)

// Color primitives (Zinc scale for neutrals)
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

  // Layers (4-layer architecture)
  layer: {
    L1: '#3b82f6', // Blue — Citizen
    L2: '#22c55e', // Green — Organization
    L3: '#8b5cf6', // Purple — Ecosystem
    L4: '#f59e0b', // Amber — Protocol
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

  // Accent (brand = L4 amber)
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
// SPACING (8px base unit)
// =============================================================================

export const spacing = {
  px: '1px',
  0: '0',
  0.5: '0.125rem', // 2px
  1: '0.25rem', // 4px
  2: '0.5rem', // 8px
  3: '0.75rem', // 12px
  4: '1rem', // 16px
  5: '1.25rem', // 20px
  6: '1.5rem', // 24px
  8: '2rem', // 32px
  10: '2.5rem', // 40px
  12: '3rem', // 48px
  16: '4rem', // 64px
  20: '5rem', // 80px
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
  sm: '0.25rem', // 4px
  md: '0.5rem', // 8px
  lg: '0.75rem', // 12px
  full: '9999px',
} as const;

// =============================================================================
// TYPE EXPORTS
// =============================================================================

export type Layer = keyof typeof colors.layer;
export type NodeType = keyof typeof colors.nodeType;
export type VerificationState = keyof typeof colors.verification;
