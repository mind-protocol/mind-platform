# Registry Module Objectives

Goals for the L4 registry browser.

```
STATUS: DESIGNING
LAYER: L4 (read-only from platform)
```

---

## Primary Goal

**Make the L4 registry discoverable and transparent.**

Users should be able to browse all registered Citizens and Orgs without authentication. This is the protocol's public face — proof that it exists and who participates.

---

## Ranked Objectives

### 1. Transparency (Weight: 0.35)

Anyone can see who's registered. No hidden participants.

**Success criteria:**
- All registered Citizens visible
- All registered Orgs visible
- Verification status visible
- No login required to browse

### 2. Discoverability (Weight: 0.30)

Users can find specific Citizens or Orgs by name, capability, or org.

**Success criteria:**
- Search by name works
- Filter by org works
- Filter by verification status works
- Results load in < 500ms

### 3. Trust Signals (Weight: 0.20)

Verification status is clear and consistent.

**Success criteria:**
- Verification badges match L4 definitions
- Badge colors consistent with platform design tokens
- Verifier identity visible
- Verification history accessible (if available)

### 4. Context (Weight: 0.15)

Users understand what they're looking at.

**Success criteria:**
- Clear explanation of what Citizens/Orgs are
- Links to schema explorer for deeper understanding
- Org membership visible on Citizen profiles
- Citizen count visible on Org profiles

---

## Non-Goals

| Excluded | Why |
|----------|-----|
| Registration | Happens via L4 CLI or API, not platform UI |
| Editing | L4 data is read-only from platform |
| Wallet transactions | Belongs in wallet module |
| Real-time updates | Polling or refresh is sufficient |

---

## Tradeoffs

### Accepted

| Tradeoff | Rationale |
|----------|-----------|
| Stale data (seconds) | Acceptable vs real-time complexity |
| No pagination initially | Expected < 1000 entities at launch |
| No advanced filtering | MVP scope; add later if needed |

### Rejected

| Tradeoff | Why Rejected |
|----------|--------------|
| Login to browse | Transparency is core to L4 |
| Hiding unverified | All registered entities should be visible |
| Custom verification badges | Must match L4 vocabulary |

---

## Success Metrics

| Metric | Target |
|--------|--------|
| Time to first meaningful content | < 2s |
| Search result time | < 500ms |
| User finds specific entity | < 3 interactions |
| Bounce rate on registry | < 40% |

---

## Dependencies

| Dependency | Status |
|------------|--------|
| L4 API (Citizens endpoint) | Assumed available |
| L4 API (Orgs endpoint) | Assumed available |
| Design tokens (colors) | Defined in VALIDATION |
| Verification badge component | Shared with other modules |
