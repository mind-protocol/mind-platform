# Registry Module Algorithms

Core flows and procedures.

```
STATUS: DESIGNING
```

---

## Flow 1: Load Registry List

```
START
├── User navigates to /registry
├── Check URL for tab param (?tab=orgs)
│   ├── If tab=orgs → activeTab = "orgs"
│   └── Else → activeTab = "citizens"
├── Fetch list for activeTab
│   ├── GET /api/registry/{activeTab}
│   ├── On success → items = response.items
│   └── On error → show error state
├── Render list with items
└── END
```

### API Proxy Flow

```
Browser                    Next.js API             L4 Backend
   │                           │                       │
   │  GET /api/registry/       │                       │
   │  citizens?verified=true   │                       │
   ├──────────────────────────►│                       │
   │                           │  Query L4 graph for   │
   │                           │  Actor nodes where    │
   │                           │  type=citizen         │
   │                           ├──────────────────────►│
   │                           │                       │
   │                           │◄──────────────────────┤
   │                           │  Graph nodes + links  │
   │                           │                       │
   │                           │  Transform to         │
   │                           │  Citizen[]            │
   │                           │                       │
   │◄──────────────────────────┤                       │
   │  { items: Citizen[] }     │                       │
```

---

## Flow 2: Search Registry

```
START
├── User types in search bar
├── Debounce 300ms
├── If query.length < 2 → clear results, END
├── Fetch search results
│   ├── GET /api/registry/search?q={query}
│   ├── On success → results = response.items
│   └── On error → show error state
├── Update list with results
└── END
```

### Search Algorithm (L4 side)

```
1. Embed query using same model as nodes
2. Vector similarity search across:
   - Citizen synthesis fields
   - Org synthesis fields
3. Return top-k matches with scores
4. Platform filters by type (citizens/orgs) client-side
```

---

## Flow 3: View Entity Detail

```
START
├── User clicks entity card OR navigates to /registry/{type}/{id}
├── Fetch entity detail
│   ├── GET /api/registry/{type}/{id}
│   ├── On success → entity = response
│   ├── On 404 → show "Not found" state
│   └── On error → show error state
├── If entity has org_membership:
│   └── Fetch org summary (for display)
├── If entity is org:
│   └── Fetch citizen count
├── Render detail view
└── END
```

---

## Flow 4: Derive Verification State

Given an entity from L4, derive its verification state:

```python
def derive_verification_state(entity, verification_links):
    """
    Derive verification state from L4 data.

    verification_links: Links from verifiers to this entity
    """
    if not verification_links:
        return "unverified"

    # Find the most authoritative link
    # (highest permanence among positive polarity)
    best_link = None
    for link in verification_links:
        if link.polarity > 0:
            if best_link is None or link.permanence > best_link.permanence:
                best_link = link

    if best_link is None:
        # Check for rejection
        for link in verification_links:
            if link.polarity < 0:
                return "rejected"
        return "pending"

    # Determine verified vs provisional
    if best_link.permanence >= 0.5:
        return "verified"
    else:
        return "provisional"
```

---

## Flow 5: Filter List

```
START
├── User changes filter (verification, status, org)
├── Build filter params
│   ├── verification → ?verified=true/false
│   ├── status → ?status=active/pending/suspended
│   └── org → ?org={orgId}
├── Update URL with params (for bookmarking)
├── Fetch filtered list
│   └── GET /api/registry/citizens?{params}
├── Update list with results
└── END
```

### Client-Side vs Server-Side Filtering

| Filter | Side | Rationale |
|--------|------|-----------|
| Verification | Server | May affect query efficiency |
| Status | Server | Simple filter on field |
| Org | Server | Join/lookup needed |
| Name search | Server | Needs embedding |
| Sort order | Client | Small result sets |

---

## Flow 6: Navigate to Related Entity

```
START
├── User clicks related entity link
│   ├── Citizen's org → /registry/orgs/{orgId}
│   └── Org's citizen → /registry/citizens/{citizenId}
├── Push to browser history
├── Load new entity (Flow 3)
└── END
```

---

## Flow 7: Open in Connectome

```
START
├── User clicks "View in Connectome" on entity detail
├── Build Connectome URL
│   ├── /connectome?focus={entityId}
│   └── OR /connectome?graph={orgGraph}&focus={entityId}
├── Navigate to Connectome
│   └── Connectome loads with entity focused
└── END
```

---

## Data Transformation

### L4 Graph → Platform Types

```typescript
function transformCitizen(node: GraphNode, links: GraphLink[]): Citizen {
  // Node is Actor with type=citizen
  // Properties are in linked Thing nodes

  const properties = getLinkedThings(node.id, links);
  const verificationLinks = getVerificationLinks(node.id, links);

  return {
    id: node.id,
    name: node.name,
    wallet: properties.find(p => p.type === 'wallet')?.content,
    org_membership: properties.find(p => p.type === 'org_ref')?.content,
    status: deriveStatus(node, links),
    registered_date: node.created_at_s,
    capabilities: deriveCapabilities(node, links),
    verification: deriveVerificationState(node, verificationLinks),
  };
}

function transformOrg(node: GraphNode, links: GraphLink[]): Org {
  // Node is Space with type=org

  const properties = getLinkedThings(node.id, links);
  const verificationLinks = getVerificationLinks(node.id, links);
  const memberLinks = links.filter(l =>
    l.type === 'member_of' && l.node_b === node.id
  );

  return {
    id: node.id,
    name: node.name,
    wallet: properties.find(p => p.type === 'wallet')?.content,
    endpoint: properties.find(p => p.type === 'endpoint')?.content,
    status: deriveStatus(node, links),
    registered_date: node.created_at_s,
    citizen_count: memberLinks.length,
    verification: deriveVerificationState(node, verificationLinks),
  };
}
```

---

## Caching Logic

```typescript
const CACHE_TTL = {
  list: 60_000,      // 1 minute
  detail: 300_000,   // 5 minutes
  search: 30_000,    // 30 seconds
};

async function fetchWithCache<T>(
  key: string,
  ttl: number,
  fetcher: () => Promise<T>
): Promise<T> {
  const cached = cache.get(key);
  if (cached && Date.now() - cached.timestamp < ttl) {
    return cached.data;
  }

  const data = await fetcher();
  cache.set(key, { data, timestamp: Date.now() });
  return data;
}
```
