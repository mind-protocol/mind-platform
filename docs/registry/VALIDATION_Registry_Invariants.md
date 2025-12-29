# Registry Module Invariants

Conditions that must hold for registry to function correctly.

```
STATUS: DESIGNING
```

---

## Data Invariants

### REG-INV-01: L4 Data Unchanged

Registry displays L4 data exactly as received. No transformation of semantics.

**Verification:**
- No field renaming that changes meaning
- Verification state derived, not interpreted
- Timestamps displayed as-is or formatted consistently

### REG-INV-02: Entity IDs Stable

Entity IDs from L4 are used as-is for URLs and references.

**Verification:**
- `/registry/citizens/{id}` uses L4 citizen ID
- No ID remapping or encoding
- Links between entities use original IDs

### REG-INV-03: Verification State Derivation Correct

Verification state derived correctly from L4 link properties.

| L4 Link State | Derived State |
|---------------|---------------|
| No verification link | `unverified` |
| polarity=0, permanence<0.5 | `pending` |
| polarity>0, permanence<0.5 | `provisional` |
| polarity>0, permanence>=0.5 | `verified` |
| polarity<0 | `rejected` |

**Verification:**
- Unit tests for derivation function
- Edge cases covered (multiple links, conflicting states)

---

## UI Invariants

### REG-INV-04: Verification Badges Consistent

Verification badges use platform design tokens.

| State | Color | Matches |
|-------|-------|---------|
| unverified | `#6b7280` | `VERIFICATION_COLORS.unverified` |
| pending | `#f59e0b` | `VERIFICATION_COLORS.pending` |
| provisional | `#3b82f6` | `VERIFICATION_COLORS.provisional` |
| verified | `#22c55e` | `VERIFICATION_COLORS.verified` |
| rejected | `#ef4444` | `VERIFICATION_COLORS.rejected` |

**Verification:**
- Badge component imports from shared tokens
- No hardcoded colors in registry module

### REG-INV-05: All Entities Visible

Every registered entity appears in the list (unless filtered).

**Verification:**
- No hidden entities based on verification status
- Unverified entities shown (not hidden)
- Suspended entities shown (with indicator)

### REG-INV-06: Links Navigate Correctly

All internal links work and preserve state.

**Verification:**
- Citizen → Org link navigates to correct org
- Org → Citizen list shows correct citizens
- Back button returns to previous view with filters

---

## API Invariants

### REG-INV-07: API Errors Structured

All API errors follow platform error shape.

```typescript
interface APIError {
  error: string;
  code?: string;
  details?: unknown;
}
```

**Verification:**
- No unstructured error responses
- HTTP status codes semantic (404 for not found, etc.)

### REG-INV-08: Cache Coherence

Cached data doesn't contradict fresher data.

**Verification:**
- Detail view shows at least as fresh as list view
- Navigating between views doesn't show conflicting data
- Refresh always fetches fresh data

### REG-INV-09: L4 Proxy Transparent

API routes proxy to L4 without adding business logic.

**Verification:**
- No filtering based on platform preferences
- No data augmentation
- Errors from L4 passed through (with wrapping)

---

## Performance Invariants

### REG-INV-10: List Loads Fast

Registry list loads in < 2s on 3G.

**Verification:**
- Lighthouse performance audit
- Bundle size for registry route < 50KB

### REG-INV-11: Search Responsive

Search results appear within 500ms of query completion.

**Verification:**
- Debounce is 300ms
- API call completes in < 200ms
- Total perceived latency < 500ms

---

## Security Invariants

### REG-INV-12: No Sensitive Data Exposed

Registry doesn't expose data that shouldn't be public.

**Verification:**
- Wallet addresses masked (show first/last 4 chars)
- JWT public keys not exposed in UI
- Endpoints shown only if intentionally public

### REG-INV-13: No XSS

User-controlled content (names, etc.) is escaped.

**Verification:**
- React handles escaping by default
- No `dangerouslySetInnerHTML` with L4 data
- Search queries sanitized before display

---

## Related Invariants

From `docs/vision/VALIDATION_Platform_Invariants.md`:

| Invariant | Relevance |
|-----------|-----------|
| INV-01 (L4 read-only) | Registry must not modify L4 |
| INV-02 (Layer attribution) | All data marked as L4 |
| INV-06 (Verification badges) | Badges consistent platform-wide |
| INV-09 (Public routes) | Registry works without auth |
| INV-13 (Structured errors) | API error format |
