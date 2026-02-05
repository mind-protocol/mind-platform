# Registry Module Implementation

Code architecture and file structure.

```
STATUS: DESIGNING
```

---

## File Structure

```
app/(public)/register/
└── page.tsx                      # Citizen registration (form + confirmation)

app/api/register/
└── route.ts                      # POST /api/register (creates CITIZEN Actor)

app/(public)/registry/
├── page.tsx                      # Main list view
├── layout.tsx                    # Registry layout (optional)
├── citizens/
│   └── [id]/
│       └── page.tsx              # Citizen detail
├── orgs/
│   └── [id]/
│       └── page.tsx              # Org detail
├── components/
│   ├── RegistryTabs.tsx          # Tab switcher
│   ├── EntityList.tsx            # Generic entity list
│   ├── EntityCard.tsx            # Card for list item
│   ├── CitizenCard.tsx           # Citizen-specific card
│   ├── OrgCard.tsx               # Org-specific card
│   ├── CitizenDetail.tsx         # Full citizen view
│   ├── OrgDetail.tsx             # Full org view
│   ├── SearchBar.tsx             # Search input
│   ├── FilterPanel.tsx           # Filters
│   └── VerificationBadge.tsx     # Badge component (may be shared)
└── lib/
    ├── types.ts                  # TypeScript types
    ├── api.ts                    # API client functions
    └── hooks.ts                  # React hooks (useRegistry, etc.)

app/api/register/
└── route.ts                      # POST /api/register

app/api/registry/
├── citizens/
│   ├── route.ts                  # GET /api/registry/citizens (AGENT + CITIZEN types)
│   └── [id]/
│       └── route.ts              # GET /api/registry/citizens/[id]
├── orgs/
│   ├── route.ts                  # GET /api/registry/orgs
│   └── [id]/
│       └── route.ts              # GET /api/registry/orgs/[id]
└── search/
    └── route.ts                  # GET /api/registry/search
```

---

## Types

```typescript
// app/(public)/registry/lib/types.ts

export type VerificationState =
  | 'unverified'
  | 'pending'
  | 'provisional'
  | 'verified'
  | 'rejected';

export type EntityStatus = 'active' | 'pending' | 'suspended';

export interface Citizen {
  id: string;
  name: string;
  wallet?: string;
  org_membership?: string;
  org_name?: string;           // Denormalized for display
  status: EntityStatus;
  registered_date: string;
  capabilities: string[];
  verification: VerificationState;
}

export interface Org {
  id: string;
  name: string;
  wallet?: string;
  endpoint?: string;
  status: EntityStatus;
  registered_date: string;
  citizen_count: number;
  verification: VerificationState;
}

export interface RegistryListResponse<T> {
  items: T[];
  count: number;
  hasMore: boolean;
}

export interface RegistryFilters {
  verification?: VerificationState | 'all';
  status?: EntityStatus | 'all';
  org?: string;
  q?: string;
}
```

---

## API Client

```typescript
// app/(public)/registry/lib/api.ts

import { Citizen, Org, RegistryListResponse, RegistryFilters } from './types';

const BASE_URL = '/api/registry';

export async function fetchCitizens(
  filters?: RegistryFilters
): Promise<RegistryListResponse<Citizen>> {
  const params = new URLSearchParams();
  if (filters?.verification && filters.verification !== 'all') {
    params.set('verification', filters.verification);
  }
  if (filters?.status && filters.status !== 'all') {
    params.set('status', filters.status);
  }
  if (filters?.org) {
    params.set('org', filters.org);
  }

  const res = await fetch(`${BASE_URL}/citizens?${params}`);
  if (!res.ok) throw new Error('Failed to fetch citizens');
  return res.json();
}

export async function fetchCitizen(id: string): Promise<Citizen> {
  const res = await fetch(`${BASE_URL}/citizens/${id}`);
  if (!res.ok) {
    if (res.status === 404) throw new Error('Citizen not found');
    throw new Error('Failed to fetch citizen');
  }
  return res.json();
}

export async function fetchOrgs(
  filters?: RegistryFilters
): Promise<RegistryListResponse<Org>> {
  const params = new URLSearchParams();
  if (filters?.verification && filters.verification !== 'all') {
    params.set('verification', filters.verification);
  }
  if (filters?.status && filters.status !== 'all') {
    params.set('status', filters.status);
  }

  const res = await fetch(`${BASE_URL}/orgs?${params}`);
  if (!res.ok) throw new Error('Failed to fetch orgs');
  return res.json();
}

export async function fetchOrg(id: string): Promise<Org> {
  const res = await fetch(`${BASE_URL}/orgs/${id}`);
  if (!res.ok) {
    if (res.status === 404) throw new Error('Org not found');
    throw new Error('Failed to fetch org');
  }
  return res.json();
}

export async function searchRegistry(
  query: string,
  type?: 'citizens' | 'orgs'
): Promise<RegistryListResponse<Citizen | Org>> {
  const params = new URLSearchParams({ q: query });
  if (type) params.set('type', type);

  const res = await fetch(`${BASE_URL}/search?${params}`);
  if (!res.ok) throw new Error('Search failed');
  return res.json();
}
```

---

## React Hooks

```typescript
// app/(public)/registry/lib/hooks.ts

import { useQuery } from '@tanstack/react-query';
// Or use SWR, or native fetch with useState

import {
  fetchCitizens,
  fetchCitizen,
  fetchOrgs,
  fetchOrg,
  searchRegistry,
} from './api';
import { RegistryFilters } from './types';

export function useCitizens(filters?: RegistryFilters) {
  return useQuery({
    queryKey: ['citizens', filters],
    queryFn: () => fetchCitizens(filters),
    staleTime: 60_000,
  });
}

export function useCitizen(id: string) {
  return useQuery({
    queryKey: ['citizen', id],
    queryFn: () => fetchCitizen(id),
    staleTime: 300_000,
  });
}

export function useOrgs(filters?: RegistryFilters) {
  return useQuery({
    queryKey: ['orgs', filters],
    queryFn: () => fetchOrgs(filters),
    staleTime: 60_000,
  });
}

export function useOrg(id: string) {
  return useQuery({
    queryKey: ['org', id],
    queryFn: () => fetchOrg(id),
    staleTime: 300_000,
  });
}

export function useRegistrySearch(query: string, type?: 'citizens' | 'orgs') {
  return useQuery({
    queryKey: ['registry-search', query, type],
    queryFn: () => searchRegistry(query, type),
    enabled: query.length >= 2,
    staleTime: 30_000,
  });
}
```

---

## API Routes

```typescript
// app/api/registry/citizens/route.ts

import { NextRequest, NextResponse } from 'next/server';

const L4_API_URL = process.env.L4_API_URL || 'http://localhost:8766';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  try {
    // Proxy to L4 API
    const l4Response = await fetch(`${L4_API_URL}/registry/citizens?${searchParams}`);

    if (!l4Response.ok) {
      return NextResponse.json(
        { error: 'L4 API error', code: 'L4_ERROR' },
        { status: l4Response.status }
      );
    }

    const data = await l4Response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch from L4', code: 'L4_UNREACHABLE' },
      { status: 503 }
    );
  }
}
```

---

## Component Examples

### VerificationBadge

```typescript
// components/layer/VerificationBadge.tsx (shared)

import { VERIFICATION_COLORS } from '@/lib/constants/colors';
import { VerificationState } from '@/app/(public)/registry/lib/types';

const ICONS: Record<VerificationState, string | null> = {
  unverified: null,
  pending: '⏳',
  provisional: '🛡️',
  verified: '✓',
  rejected: '✗',
};

interface Props {
  state: VerificationState;
  showLabel?: boolean;
}

export function VerificationBadge({ state, showLabel = false }: Props) {
  const color = VERIFICATION_COLORS[state];
  const icon = ICONS[state];

  return (
    <span
      className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium"
      style={{ backgroundColor: `${color}20`, color }}
    >
      {icon && <span>{icon}</span>}
      {showLabel && <span className="capitalize">{state}</span>}
    </span>
  );
}
```

### EntityCard

```typescript
// app/(public)/registry/components/EntityCard.tsx

import Link from 'next/link';
import { VerificationBadge } from '@/components/layer/VerificationBadge';
import { Citizen, Org } from '../lib/types';

interface Props {
  entity: Citizen | Org;
  type: 'citizen' | 'org';
}

export function EntityCard({ entity, type }: Props) {
  const href = `/registry/${type}s/${entity.id}`;

  return (
    <Link href={href} className="block p-4 border rounded-lg hover:bg-gray-50">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-medium">{entity.name}</h3>
          {'org_name' in entity && entity.org_name && (
            <p className="text-sm text-gray-500">{entity.org_name}</p>
          )}
          {'citizen_count' in entity && (
            <p className="text-sm text-gray-500">
              {entity.citizen_count} citizens
            </p>
          )}
        </div>
        <VerificationBadge state={entity.verification} />
      </div>
    </Link>
  );
}
```

---

## Data Flow

```
┌─────────────────────────────────────────────────────────────────────┐
│  Browser                                                            │
│                                                                     │
│  RegistryPage ──► useCitizens() ──► fetchCitizens()                │
│       │                                    │                        │
│       ▼                                    ▼                        │
│  EntityList ◄─────────────────────── /api/registry/citizens        │
│       │                                    │                        │
│       ▼                                    ▼                        │
│  EntityCard ──► VerificationBadge    L4 API Proxy                  │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Dependencies

| Package | Purpose | Required |
|---------|---------|----------|
| `@tanstack/react-query` | Data fetching + caching | Recommended |
| `next` | Framework | Yes |
| `typescript` | Types | Yes |

`@mind:proposition` — Consider using native `fetch` + `useState` + `useEffect` instead of react-query to minimize dependencies for v1. Add react-query when caching/refetching patterns become complex.
