# UX Module — Sync

Current state and handoff notes.

```
LAST_UPDATED: 2025-12-29
UPDATED_BY: Claude (agent)
STATUS: DESIGNING
```

---

## Current State

**Partial doc chain.** Core UX principles and patterns documented.

| Document | Status |
|----------|--------|
| OBJECTIVES | Complete |
| PATTERNS | Complete |
| SYNC | This file |

---

## Escalations Summary

### `@mind:escalation` — Login Trigger

**Question:** When does login happen?

**Options:**
1. **Login prompt when accessing dashboard features** (recommended)
2. Login button always visible, optional until needed
3. Full app requires login

**Recommendation:** Option 1 — keep public browsing frictionless, prompt only when needed.

### `@mind:escalation` — Search Scope

**Question:** Is search global or contextual?

**Options:**
1. **Global search across all modules** (recommended)
2. Per-module search only
3. Both with toggle

**Recommendation:** Option 1 — Mind Protocol is about connection, search should surface connections.

### `@mind:escalation` — Mobile Strategy

**Question:** What's the mobile experience?

**Options:**
1. **Responsive, reduced functionality** (recommended for v1)
2. Full feature parity
3. Mobile app later
4. Desktop-only explicit

**Recommendation:** Option 1 — browsing works, graph exploration limited.

### `@mind:escalation` — Keyboard Shortcuts

**Question:** Should we have keyboard shortcuts?

**Options:**
1. **Essential only** (search, navigation) — recommended
2. Comprehensive vim-like bindings
3. None for v1

**Recommendation:** Option 1 — `/` for search, `Escape` for close, arrow keys for navigation.

---

## Implementation Status

### Patterns to Implement

| Pattern | Priority | Module |
|---------|----------|--------|
| Global navigation | High | shared |
| Tab navigation | High | registry, dashboard |
| Breadcrumb | Medium | registry detail |
| Loading skeletons | High | all |
| Error states | High | all |
| Empty states | Medium | all |
| Toast notifications | Low | dashboard |

### Components Needed

| Component | Location | Status |
|-----------|----------|--------|
| `TopNav` | `components/nav/` | Not created |
| `TabBar` | `components/ui/` | Not created |
| `Breadcrumb` | `components/ui/` | Not created |
| `Skeleton` | `components/ui/` | Not created |
| `Toast` | `components/ui/` | Not created |
| `EmptyState` | `components/ui/` | Not created |

---

## Next Actions

1. **Resolve escalations** — get human decisions
2. **Create shared UI components** — skeleton, toast, empty state
3. **Implement TopNav** — global navigation
4. **Add keyboard shortcut system**

---

## Related

- `docs/design-language/` — Visual tokens for UX components
- `docs/landing/` — Landing-specific UX
- `docs/registry/` — Registry-specific UX
