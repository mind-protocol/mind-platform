# UX Patterns

Interaction patterns and principles for Mind Platform.

```
STATUS: DESIGNING
```

---

## Core Principles

### 1. Exploration Over Instruction

Users learn by doing, not by reading.

- No modal tutorials
- No forced flows
- Every screen is explorable
- Undo available for mistakes

### 2. Context is King

Users always know where they are and what they can do.

- Layer indicator visible
- Breadcrumbs for depth
- Action buttons labeled clearly
- State persisted in URL

### 3. Progressive Disclosure

Simple by default, powerful when needed.

- Essential controls visible
- Advanced controls behind "..." or expand
- Keyboard shortcuts for power users
- Settings for customization

### 4. Fast Feedback

UI responds immediately, even before server.

- Optimistic updates where safe
- Skeleton states on load
- Inline errors, not modals
- Toast for background completion

---

## Navigation Patterns

### Global Navigation

```
┌──────────────────────────────────────────────────────────────────┐
│  [Logo]   Registry   Schema   Connectome   Templates   [Account] │
└──────────────────────────────────────────────────────────────────┘
```

- Always visible
- Current route highlighted
- Account shows auth state

### Module Navigation

```
┌──────────────────────────────────────────────────────────────────┐
│  Module Title                                      [Search] [+]  │
├──────────────────────────────────────────────────────────────────┤
│  [Tab 1] [Tab 2] [Tab 3]                                         │
└──────────────────────────────────────────────────────────────────┘
```

- Tabs for peer views
- Search scoped to module
- Primary action top-right

### Breadcrumb Navigation

```
Registry > Organizations > Acme AI > Settings
```

- Click any segment to navigate
- Current segment not linked
- Truncate long paths with "..."

---

## Selection Patterns

### List Selection

- Click row to select
- Click again to deselect
- Shift+click for range (if multi-select)
- Cmd/Ctrl+click for toggle (if multi-select)

### Graph Selection

- Click node to select
- Click edge to select
- Click canvas to deselect
- Drag for pan (not select)

### Keyboard Selection

- Arrow keys to move focus
- Enter to select/activate
- Escape to deselect/close
- Tab to move between sections

---

## Action Patterns

### Destructive Actions

```
[Delete] → Confirmation Dialog → [Cancel] [Delete]
```

- Always confirm
- Explain consequence
- Default to cancel

### Non-Destructive Actions

```
[Save] → Optimistic update → (Success toast or inline check)
```

- Immediate feedback
- Subtle confirmation
- No modal

### Long-Running Actions

```
[Start Sync] → Progress indicator → Completion state
```

- Show progress
- Allow background
- Notify on complete

---

## Feedback Patterns

### Loading States

| Context | Pattern |
|---------|---------|
| Page load | Skeleton |
| Button action | Spinner in button |
| Background fetch | Subtle indicator |
| Graph load | Progressive render |

### Error States

| Type | Pattern |
|------|---------|
| Inline field | Red border + message |
| Form submit | Error banner + field highlights |
| API failure | Inline retry option |
| Fatal error | Error boundary fallback |

### Empty States

```
┌──────────────────────────────────────────────────────────────────┐
│                                                                  │
│                          [Icon]                                  │
│                                                                  │
│                    No citizens yet                               │
│                                                                  │
│         Register your first AI agent to get started             │
│                                                                  │
│                     [Get Started]                                │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

- Friendly message
- Clear next action
- Not just "No data"

### Success States

- Inline checkmark for saves
- Toast for background operations
- Redirect for major completions

---

## Form Patterns

### Inline Editing

```
Label: [Value         ] [✓] [✗]
```

- Click to edit
- Enter to save
- Escape to cancel

### Modal Editing

```
┌─────────────────────────────────────┐
│  Edit Profile                    [✗] │
├─────────────────────────────────────┤
│                                     │
│  Name: [_________________________]  │
│                                     │
│  Bio:  [_________________________]  │
│        [_________________________]  │
│                                     │
├─────────────────────────────────────┤
│              [Cancel] [Save]        │
└─────────────────────────────────────┘
```

- Clear title
- Cancel always available
- Primary action right

### Validation

- Validate on blur, not on type
- Show errors after first submit attempt
- Clear errors on valid input

---

## Graph-Specific Patterns

### Pan and Zoom

| Action | Effect |
|--------|--------|
| Drag canvas | Pan |
| Scroll wheel | Zoom |
| Pinch (touch) | Zoom |
| Double-click canvas | Zoom in |
| Fit button | Fit all to view |

### Node Interaction

| Action | Effect |
|--------|--------|
| Click node | Select, show info panel |
| Double-click node | Expand neighborhood |
| Hover node | Show tooltip |
| Drag node | Reposition |

### Search Integration

```
[Search: "project"]
   ↓
[Matching nodes highlighted]
[Non-matching nodes dimmed]
[Click result to focus]
```

---

## Responsive Patterns

### Desktop (>1024px)

- Full navigation
- Side panels
- Multi-column layouts
- Keyboard shortcuts

### Tablet (768-1024px)

- Condensed navigation
- Full-screen panels
- Single/two column
- Touch gestures

### Mobile (<768px)

- Hamburger navigation
- Bottom sheets instead of side panels
- Single column
- Large touch targets

---

## Accessibility Patterns

### Focus Management

- Visible focus ring
- Logical tab order
- Focus trap in modals
- Skip links for navigation

### Screen Reader

- ARIA labels on interactive elements
- Announce dynamic content changes
- Describe graph structure textually
- Status messages announced

### Reduced Motion

- Check `prefers-reduced-motion`
- Disable animations
- Use instant transitions
- Keep functionality

---

## Related

- `docs/design-language/` — Visual design system
- `docs/landing/BEHAVIORS_Landing_UX.md` — Landing-specific UX
- `docs/registry/BEHAVIORS_Registry_UX.md` — Registry-specific UX
