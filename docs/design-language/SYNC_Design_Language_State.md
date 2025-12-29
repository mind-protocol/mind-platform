# Design Language — Sync

Current state and handoff notes.

```
LAST_UPDATED: 2025-12-29
UPDATED_BY: Claude (agent)
STATUS: DESIGNING
```

---

## Current State

**Partial doc chain.** Core design system documented. Focuses on:
- Color system (layers, node types, verification states)
- Typography
- Spacing
- Animation
- Token architecture

---

## Documents

| Document | Status |
|----------|--------|
| OBJECTIVES | Complete |
| PATTERNS | Complete |
| IMPLEMENTATION | Complete |
| SYNC | This file |

---

## Escalations Summary

### `@mind:escalation` — Brand Color Confirmation

**Question:** Is amber (`#f59e0b`) the Mind Protocol brand color?

**Context:** Amber is used for L4 (Protocol layer). Using it as brand creates semantic connection: "Protocol = brand = source of truth."

**Options:**
1. Amber as brand (recommended) — semantic alignment
2. Distinct brand color — separation of concerns
3. No brand color — neutral platform

### `@mind:escalation` — Logo Asset

**Question:** Text "Mind Protocol" or symbol logo?

**Options:**
1. Text logo for v1, symbol later (recommended)
2. Wait for symbol design before launching
3. Generic placeholder

### `@mind:escalation` — Icon Set

**Question:** Which icon library?

**Options:**
1. Lucide (recommended) — lightweight, consistent
2. Heroicons — popular, slightly heavier
3. Custom icons — expensive, delays launch

### `@mind:escalation` — Token Architecture

**Question:** CSS Custom Properties or TypeScript tokens?

**Recommendation:** TypeScript tokens primary, generate CSS vars for globals.

---

## Implementation Status

### Files to Create

| File | Priority |
|------|----------|
| `lib/design/tokens.ts` | High |
| `lib/design/utils.ts` | High |
| `lib/design/index.ts` | High |
| Update `tailwind.config.ts` | Medium |
| Update `app/globals.css` | Medium |

### Migration Needed

- Connectome manifest colors → use tokens
- Landing page colors → use tokens
- Registry colors → use tokens

---

## Dependencies

| Dependency | Status |
|------------|--------|
| Tailwind CSS | Configured |
| Inter font | Not loaded |
| JetBrains Mono font | Not loaded |

---

## Next Actions

1. **Resolve escalations** — get human decisions on brand, logo, icons
2. **Create `lib/design/tokens.ts`** — implement token system
3. **Update Tailwind config** — integrate tokens
4. **Load fonts** — add Inter + JetBrains Mono via next/font

---

## Handoff Notes

**For agents continuing this work:**

- Design language is foundational — affects all UI work
- Wait for escalation decisions before implementing brand-specific elements
- Token file should be created early (blocks landing page, registry)
- Dark theme only for v1

**Key decisions:**
- Layer colors are fixed (L1=blue, L2=green, L3=purple, L4=amber)
- Node type colors match schema semantics
- 8px spacing unit
- Inter for sans, JetBrains Mono for code
