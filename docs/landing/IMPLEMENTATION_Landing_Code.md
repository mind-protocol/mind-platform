# Landing Page Implementation

Code architecture and file structure.

```
STATUS: DESIGNING
```

---

## File Structure

```
app/(public)/
├── page.tsx                      # Landing page entry
├── layout.tsx                    # Public layout (nav, footer)
├── components/
│   ├── landing/
│   │   ├── Hero.tsx              # Hero section
│   │   ├── HowItWorks.tsx        # Layer explanation
│   │   ├── LayerCard.tsx         # Individual layer card
│   │   ├── WhatYouCanDo.tsx      # Action cards section
│   │   ├── ActionCard.tsx        # Individual action card
│   │   ├── LiveStats.tsx         # Stats display
│   │   ├── StatCounter.tsx       # Animated counter
│   │   ├── RecentActivity.tsx    # Activity feed
│   │   ├── ActivityItem.tsx      # Individual activity
│   │   └── GraphPreview.tsx      # Animated graph canvas
│   └── nav/
│       ├── TopNav.tsx            # Top navigation
│       ├── MobileNav.tsx         # Mobile hamburger menu
│       └── Footer.tsx            # Footer
└── lib/
    └── landing-api.ts            # Stats + activity fetching

app/api/
├── stats/
│   └── route.ts                  # GET /api/stats
└── activity/
    └── route.ts                  # GET /api/activity
```

---

## Page Component

```typescript
// app/(public)/page.tsx

import { Hero } from './components/landing/Hero';
import { HowItWorks } from './components/landing/HowItWorks';
import { WhatYouCanDo } from './components/landing/WhatYouCanDo';
import { LiveStats } from './components/landing/LiveStats';
import { RecentActivity } from './components/landing/RecentActivity';

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <Hero />
      <HowItWorks />
      <WhatYouCanDo />
      <LiveStats />
      <RecentActivity />
    </main>
  );
}
```

---

## Hero Component

```typescript
// app/(public)/components/landing/Hero.tsx

import Link from 'next/link';
import { GraphPreview } from './GraphPreview';

export function Hero() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-4">
      {/* Background graph */}
      <div className="absolute inset-0 opacity-30">
        <GraphPreview />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center max-w-3xl">
        <h1 className="text-5xl md:text-6xl font-bold mb-6">
          Mind Protocol
        </h1>
        <p className="text-xl md:text-2xl text-zinc-400 mb-8">
          Persistent Memory for AI Agents
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/connectome"
            className="px-8 py-3 bg-amber-500 text-black font-medium rounded-lg hover:bg-amber-400 transition"
          >
            Explore Connectome
          </Link>
          <Link
            href="/registry"
            className="px-8 py-3 border border-zinc-700 rounded-lg hover:border-zinc-500 transition"
          >
            Browse Registry
          </Link>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 animate-bounce">
        <svg className="w-6 h-6 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>
    </section>
  );
}
```

---

## Graph Preview Component

```typescript
// app/(public)/components/landing/GraphPreview.tsx
'use client';

import { useEffect, useRef } from 'react';
import { NODE_TYPE_COLORS } from '@/lib/constants/colors';

interface Node {
  x: number;
  y: number;
  vx: number;
  vy: number;
  type: string;
  radius: number;
}

interface Edge {
  source: number;
  target: number;
}

export function GraphPreview() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Setup
    const resize = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };
    resize();
    window.addEventListener('resize', resize);

    // Generate nodes and edges
    const nodes: Node[] = generateNodes(30, canvas.offsetWidth, canvas.offsetHeight);
    const edges: Edge[] = generateEdges(nodes.length, 40);

    // Animation loop
    let animationId: number;
    const animate = () => {
      updatePhysics(nodes, edges, canvas.offsetWidth, canvas.offsetHeight);
      draw(ctx, nodes, edges, canvas.offsetWidth, canvas.offsetHeight);
      animationId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full"
      style={{ opacity: 0.6 }}
    />
  );
}

function generateNodes(count: number, width: number, height: number): Node[] {
  const types = Object.keys(NODE_TYPE_COLORS);
  return Array.from({ length: count }, () => ({
    x: Math.random() * width,
    y: Math.random() * height,
    vx: 0,
    vy: 0,
    type: types[Math.floor(Math.random() * types.length)],
    radius: 4 + Math.random() * 4,
  }));
}

function generateEdges(nodeCount: number, edgeCount: number): Edge[] {
  const edges: Edge[] = [];
  for (let i = 0; i < edgeCount; i++) {
    edges.push({
      source: Math.floor(Math.random() * nodeCount),
      target: Math.floor(Math.random() * nodeCount),
    });
  }
  return edges;
}

function updatePhysics(nodes: Node[], edges: Edge[], width: number, height: number) {
  // Gentle force simulation
  const centerX = width / 2;
  const centerY = height / 2;

  nodes.forEach(node => {
    // Centering force
    node.vx += (centerX - node.x) * 0.0001;
    node.vy += (centerY - node.y) * 0.0001;

    // Apply velocity
    node.x += node.vx;
    node.y += node.vy;

    // Damping
    node.vx *= 0.99;
    node.vy *= 0.99;

    // Bounds
    if (node.x < 0 || node.x > width) node.vx *= -0.5;
    if (node.y < 0 || node.y > height) node.vy *= -0.5;
  });
}

function draw(
  ctx: CanvasRenderingContext2D,
  nodes: Node[],
  edges: Edge[],
  width: number,
  height: number
) {
  ctx.clearRect(0, 0, width, height);

  // Draw edges
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
  ctx.lineWidth = 1;
  edges.forEach(edge => {
    const source = nodes[edge.source];
    const target = nodes[edge.target];
    ctx.beginPath();
    ctx.moveTo(source.x, source.y);
    ctx.lineTo(target.x, target.y);
    ctx.stroke();
  });

  // Draw nodes
  nodes.forEach(node => {
    const color = NODE_TYPE_COLORS[node.type as keyof typeof NODE_TYPE_COLORS] || '#fff';
    ctx.beginPath();
    ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();
  });
}
```

---

## How It Works Component

```typescript
// app/(public)/components/landing/HowItWorks.tsx

import { LAYER_COLORS } from '@/lib/constants/colors';
import { LayerCard } from './LayerCard';

const LAYERS = [
  {
    id: 'L1',
    name: 'Citizen',
    description: 'Your agent\'s personal knowledge graph',
    color: LAYER_COLORS.L1,
    link: '/citizen',
  },
  {
    id: 'L2',
    name: 'Organization',
    description: 'Shared knowledge within your team',
    color: LAYER_COLORS.L2,
    link: '/org',
  },
  {
    id: 'L3',
    name: 'Ecosystem',
    description: 'Templates and patterns to reuse',
    color: LAYER_COLORS.L3,
    link: '/templates',
  },
  {
    id: 'L4',
    name: 'Protocol',
    description: 'The global registry and schema',
    color: LAYER_COLORS.L4,
    link: '/registry',
  },
];

export function HowItWorks() {
  return (
    <section className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-4">
          How It Works
        </h2>
        <p className="text-zinc-400 text-center mb-12 max-w-2xl mx-auto">
          Mind Protocol organizes knowledge in four layers.
          Each layer builds on the last. Start anywhere.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {LAYERS.map(layer => (
            <LayerCard key={layer.id} {...layer} />
          ))}
        </div>
      </div>
    </section>
  );
}
```

---

## Stats Component

```typescript
// app/(public)/components/landing/LiveStats.tsx
'use client';

import { useEffect, useState } from 'react';
import { StatCounter } from './StatCounter';

interface Stats {
  citizens: number;
  orgs: number;
  nodes: number;
}

export function LiveStats() {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    fetch('/api/stats')
      .then(res => res.json())
      .then(setStats)
      .catch(() => setStats(null));
  }, []);

  return (
    <section className="py-16 border-y border-zinc-800">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex justify-center gap-12 md:gap-24">
          <StatCounter
            value={stats?.citizens}
            label="Citizens"
          />
          <StatCounter
            value={stats?.orgs}
            label="Organizations"
          />
          <StatCounter
            value={stats?.nodes}
            label="Nodes"
          />
        </div>
      </div>
    </section>
  );
}
```

---

## API Routes

```typescript
// app/api/stats/route.ts

import { NextResponse } from 'next/server';

const L4_API_URL = process.env.L4_API_URL || 'http://localhost:8766';

// Simple in-memory cache
let statsCache: { data: any; timestamp: number } | null = null;
const CACHE_TTL = 60_000; // 60 seconds

export async function GET() {
  // Check cache
  if (statsCache && Date.now() - statsCache.timestamp < CACHE_TTL) {
    return NextResponse.json(statsCache.data);
  }

  try {
    const [citizensRes, orgsRes] = await Promise.all([
      fetch(`${L4_API_URL}/registry/citizens?limit=0`),
      fetch(`${L4_API_URL}/registry/orgs?limit=0`),
    ]);

    const citizens = citizensRes.ok ? await citizensRes.json() : { count: 0 };
    const orgs = orgsRes.ok ? await orgsRes.json() : { count: 0 };

    const stats = {
      citizens: citizens.count ?? 0,
      orgs: orgs.count ?? 0,
      nodes: 0, // TODO: Implement when sample graph available
    };

    statsCache = { data: stats, timestamp: Date.now() };
    return NextResponse.json(stats);
  } catch (error) {
    return NextResponse.json({ citizens: 0, orgs: 0, nodes: 0 });
  }
}
```

---

## Shared Constants

```typescript
// lib/constants/colors.ts

export const LAYER_COLORS = {
  L1: '#3b82f6',  // Blue
  L2: '#22c55e',  // Green
  L3: '#8b5cf6',  // Purple
  L4: '#f59e0b',  // Amber
} as const;

export const NODE_TYPE_COLORS = {
  Actor: '#f472b6',
  Moment: '#60a5fa',
  Narrative: '#a78bfa',
  Space: '#4ade80',
  Thing: '#fbbf24',
} as const;

export const VERIFICATION_COLORS = {
  unverified: '#6b7280',
  pending: '#f59e0b',
  provisional: '#3b82f6',
  verified: '#22c55e',
  rejected: '#ef4444',
} as const;
```

---

## Dependencies

| Package | Purpose | Status |
|---------|---------|--------|
| `next` | Framework | Installed |
| `react` | UI | Installed |
| `tailwindcss` | Styling | Installed |

No additional dependencies required for landing page.

---

## Build Considerations

### Bundle Size

- Landing route should be < 100KB
- Graph preview uses Canvas, not heavy libraries
- No external animation libraries

### Code Splitting

```typescript
// Lazy load graph preview if heavy
const GraphPreview = dynamic(
  () => import('./GraphPreview'),
  { ssr: false, loading: () => <div className="animate-pulse" /> }
);
```

### Static Generation

Landing page can be statically generated with ISR:

```typescript
// app/(public)/page.tsx
export const revalidate = 60; // Revalidate every 60 seconds
```
