# Registry Module Behaviors

Observable user experience patterns.

```
STATUS: DESIGNING
```

---

## Entry Points

### From Landing Page

User clicks "Browse Registry" or "See who's building" → `/registry`

**Expected state:**
- Citizens tab active by default
- List populated with registered Citizens
- Search bar visible but empty

### From Direct Link

User navigates to `/registry/citizens/[id]` → Citizen detail page

**Expected state:**
- Full Citizen profile displayed
- Back link to registry list
- Org membership clickable (if present)

### From Connectome

User clicks Citizen/Org node in graph → Link to registry detail

**Expected state:**
- Opens registry detail in new context
- Connectome state preserved for back navigation

---

## List View Behaviors

### Tab Switching

| Action | Result |
|--------|--------|
| Click "Citizens" tab | Show Citizens list, update URL |
| Click "Orgs" tab | Show Orgs list, update URL |
| Browser back | Return to previous tab |

### Scrolling

| Action | Result |
|--------|--------|
| Scroll down | Load more items if available |
| Scroll to top | Show refresh indicator |
| Pull to refresh (mobile) | Reload list |

### Search

| Action | Result |
|--------|--------|
| Type in search bar | Filter after 300ms debounce |
| Clear search | Show full list |
| Search with no results | Show "No matches" message |

### Filtering

| Filter | Options |
|--------|---------|
| Verification | All, Verified only, Unverified only |
| Status | All, Active, Pending, Suspended |
| Org (Citizens only) | Dropdown of known orgs |

---

## Detail View Behaviors

### Citizen Detail

| Section | Behavior |
|---------|----------|
| Header | Name, avatar, verification badge |
| Properties | Wallet (masked, click to copy), registered date |
| Org membership | Click to navigate to org |
| Capabilities | List of capability tags |
| Status | Visual indicator if not active |

### Org Detail

| Section | Behavior |
|---------|----------|
| Header | Name, logo, verification badge |
| Properties | Wallet, endpoint (if public), registered date |
| Citizens | List of member Citizens |
| Status | Visual indicator if not active |

### Navigation

| Action | Result |
|--------|--------|
| Click org on Citizen | Navigate to org detail |
| Click Citizen in org list | Navigate to Citizen detail |
| Click back | Return to list (preserving filters) |
| Click "View in Connectome" | Open Connectome focused on this entity |

---

## Loading States

### Initial Load

```
[Skeleton cards x 6]
```

Three rows of two skeleton cards, pulsing.

### Search/Filter

```
[Dimmed current results]
[Loading indicator top-right]
```

Current results stay visible but dimmed while new results load.

### Detail Page

```
[Header skeleton]
[Property skeletons x 4]
```

Full-width skeleton for header, smaller skeletons for properties.

---

## Error States

### Network Error

```
┌──────────────────────────────────────┐
│  ⚠️  Couldn't load registry          │
│                                      │
│  Check your connection and try again │
│                                      │
│  [Retry]                             │
└──────────────────────────────────────┘
```

### Entity Not Found

```
┌──────────────────────────────────────┐
│  🔍 Citizen not found                │
│                                      │
│  This Citizen may have been removed  │
│  or the link may be incorrect.       │
│                                      │
│  [Back to Registry]                  │
└──────────────────────────────────────┘
```

### L4 API Unavailable

```
┌──────────────────────────────────────┐
│  ⚠️  Registry temporarily unavailable│
│                                      │
│  The L4 API is not responding.       │
│  Data may be from cache.             │
│                                      │
│  [Retry] [View cached data]          │
└──────────────────────────────────────┘
```

---

## Responsive Behavior

### Desktop (>1024px)

- Two-column card grid
- Filters in sidebar
- Detail view with sidebar info

### Tablet (768-1024px)

- Two-column card grid
- Filters in collapsible header
- Full-width detail view

### Mobile (<768px)

- Single-column card list
- Filters behind filter button
- Full-width detail view
- Bottom sheet for entity actions

---

## Keyboard Navigation

| Key | Action |
|-----|--------|
| `/` | Focus search bar |
| `Escape` | Clear search, close filters |
| `Tab` | Navigate between cards |
| `Enter` | Open selected card |
| `←` `→` | Switch tabs |

---

## Accessibility

| Requirement | Implementation |
|-------------|----------------|
| Screen reader | ARIA labels on badges, cards |
| Color blindness | Icons accompany colors |
| Keyboard only | Full keyboard navigation |
| Reduced motion | Disable animations |
