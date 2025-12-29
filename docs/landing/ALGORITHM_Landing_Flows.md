# Landing Page Algorithms

Core flows and data fetching.

```
STATUS: DESIGNING
```

---

## Flow 1: Page Load

```
START
├── Request to / (root)
├── Next.js serves landing page
├── HTML + CSS render immediately
├── Client JS hydrates
├── Parallel data fetches:
│   ├── GET /api/stats → citizen_count, org_count, node_count
│   └── GET /api/activity → recent_activity[]
├── On data received:
│   ├── Stats: Trigger count-up animation
│   └── Activity: Populate feed
├── Graph preview: Initialize canvas animation
└── END (page interactive)
```

### Data Fetch Timing

```typescript
// Fetch stats and activity in parallel on mount
useEffect(() => {
  const fetchData = async () => {
    const [stats, activity] = await Promise.all([
      fetch('/api/stats').then(r => r.json()),
      fetch('/api/activity').then(r => r.json()),
    ]);
    setStats(stats);
    setActivity(activity);
  };
  fetchData();
}, []);
```

---

## Flow 2: Stats API

```
GET /api/stats

START
├── Query L4 registry for counts:
│   ├── Citizen count
│   ├── Org count
│   └── (Optional) Node count from sample graph
├── Cache result for 60s
├── Return:
│   {
│     "citizens": 42,
│     "orgs": 5,
│     "nodes": 1234
│   }
└── END
```

### Implementation

```typescript
// app/api/stats/route.ts

export async function GET() {
  // Check cache
  const cached = cache.get('stats');
  if (cached && Date.now() - cached.timestamp < 60_000) {
    return NextResponse.json(cached.data);
  }

  try {
    const [citizensRes, orgsRes] = await Promise.all([
      fetch(`${L4_API_URL}/registry/citizens?limit=0`),
      fetch(`${L4_API_URL}/registry/orgs?limit=0`),
    ]);

    const citizens = await citizensRes.json();
    const orgs = await orgsRes.json();

    const stats = {
      citizens: citizens.count ?? 0,
      orgs: orgs.count ?? 0,
      nodes: 0, // TODO: Get from sample graph
    };

    cache.set('stats', { data: stats, timestamp: Date.now() });
    return NextResponse.json(stats);
  } catch (error) {
    // Return zeros on error (graceful degradation)
    return NextResponse.json({ citizens: 0, orgs: 0, nodes: 0 });
  }
}
```

---

## Flow 3: Activity API

```
GET /api/activity

START
├── Query L4 for recent events:
│   ├── Recent registrations
│   ├── Recent verifications
│   ├── Recent template additions
├── Limit to 5 most recent
├── Format for display:
│   {
│     "items": [
│       { "type": "registration", "entity": "...", "time": "2h ago" },
│       { "type": "verification", "entity": "...", "time": "5h ago" },
│       ...
│     ]
│   }
└── END
```

### Activity Types

| Type | Description | Display |
|------|-------------|---------|
| `registration` | New citizen/org registered | "Org 'X' registered" |
| `verification` | Entity verified | "Citizen 'X' verified" |
| `template` | Template added to L3 | "Template 'X' added" |

---

## Flow 4: Graph Preview Animation

```
START (on component mount)
├── Initialize canvas
├── Create sample nodes (N = 20-30)
│   ├── Random positions within bounds
│   ├── Varied sizes based on "weight"
│   └── Colors based on node_type
├── Create sample edges
├── Start animation loop:
│   LOOP (requestAnimationFrame)
│   ├── Apply gentle force simulation
│   │   ├── Repulsion between nodes
│   │   ├── Attraction along edges
│   │   └── Centering force
│   ├── Apply velocity damping
│   ├── Clear canvas
│   ├── Draw edges (faint lines)
│   ├── Draw nodes (circles)
│   └── Continue loop
│   END LOOP (on unmount)
└── END
```

### Force Simulation Parameters

```typescript
const FORCE_CONFIG = {
  repulsion: 50,        // Strength of node repulsion
  attraction: 0.05,     // Edge attraction factor
  damping: 0.95,        // Velocity damping per frame
  centerStrength: 0.01, // Pull toward center
};
```

### Node Distribution

```typescript
const NODE_TYPES = [
  { type: 'actor', count: 5, color: '#f472b6' },
  { type: 'moment', count: 8, color: '#60a5fa' },
  { type: 'narrative', count: 6, color: '#a78bfa' },
  { type: 'space', count: 4, color: '#4ade80' },
  { type: 'thing', count: 7, color: '#fbbf24' },
];
```

---

## Flow 5: Count-Up Animation

```
START (when stats loaded)
├── For each stat (citizens, orgs, nodes):
│   ├── Start value = 0
│   ├── End value = actual count
│   ├── Duration = 1000ms
│   ├── Easing = ease-out
│   LOOP (animation frame)
│   ├── Calculate progress (0 to 1)
│   ├── Apply easing
│   ├── Display = round(progress * endValue)
│   ├── If progress < 1: continue
│   └── Else: stop
│   END LOOP
└── END
```

### Easing Function

```typescript
function easeOutQuad(t: number): number {
  return 1 - (1 - t) * (1 - t);
}

function animateCount(
  element: HTMLElement,
  endValue: number,
  duration: number = 1000
) {
  const start = performance.now();

  function update(now: number) {
    const progress = Math.min((now - start) / duration, 1);
    const eased = easeOutQuad(progress);
    const current = Math.round(eased * endValue);
    element.textContent = formatNumber(current);

    if (progress < 1) {
      requestAnimationFrame(update);
    }
  }

  requestAnimationFrame(update);
}
```

---

## Flow 6: Navigation

```
User clicks CTA
├── Determine destination:
│   ├── "Explore Connectome" → /connectome
│   ├── "Browse Registry" → /registry
│   ├── "Get Started" → /docs/getting-started
│   └── Layer card → respective route
├── Next.js router.push(destination)
└── END
```

---

## Server-Side Data (Optional)

`@mind:proposition` — Consider server-side rendering for stats:

```typescript
// app/(public)/page.tsx

export default async function LandingPage() {
  // Fetch stats at build time or request time
  const stats = await fetchStats();

  return (
    <>
      <Hero />
      <HowItWorks />
      <WhatYouCanDo />
      <LiveStats initialStats={stats} /> {/* Hydrates with real data */}
      <Footer />
    </>
  );
}
```

Benefits:
- Stats visible immediately (no flash of zeros)
- Better SEO (content in HTML)
- Reduces client-side fetching

Tradeoff:
- Adds server rendering complexity
- Stats may be stale if page is cached

Recommendation: Start with client-side fetch for simplicity. Move to SSR if stats visibility is a priority.

---

## Caching Strategy

| Data | Cache Location | TTL |
|------|----------------|-----|
| Stats | Server (in-memory) | 60s |
| Activity | Server (in-memory) | 30s |
| Graph preview data | None (generated client-side) | — |

---

## Error Handling

| Scenario | Handling |
|----------|----------|
| Stats API fails | Show dashes instead of numbers |
| Activity API fails | Hide section or show placeholder |
| Graph preview errors | Show static SVG fallback |
| Navigation fails | Standard Next.js error handling |
