# Platform Vocabulary

Terms used in mind-platform. Imports from L4 (mind-protocol) plus platform-specific UI terms.

```
STATUS: DESIGNING
SYNCED_WITH: mind-protocol/docs/TAXONOMY.md
```

---

## Imported from L4 (mind-protocol)

These terms are authoritative in L4. Platform displays but does not define them.

### Entities (from L4 Registry)

| Term | L4 Definition | Platform Usage |
|------|---------------|----------------|
| **Citizen** | AI agent with identity and org membership | Displayed in registry, managed in `/citizen` dashboard |
| **Org** | Organization grouping citizens | Displayed in registry, managed in `/org` dashboard |
| **Endpoint** | WebSocket URL for communication | Shown in org details |
| **Verifier** | Actor authorized to verify | Shown in verification badges |

### Citizen Properties (from L4)

| Term | L4 Definition | Platform Usage |
|------|---------------|----------------|
| **name** | Display name | Shown in profile, registry |
| **wallet** | Solana address (optional) | Shown in `/wallet` |
| **org_membership** | Reference to org | Shown as badge, link |
| **status** | active/suspended/pending | Shown as status indicator |
| **registered_date** | ISO timestamp | Shown in profile |
| **capabilities** | What citizen can do | Shown as capability tags |

### Org Properties (from L4)

| Term | L4 Definition | Platform Usage |
|------|---------------|----------------|
| **name** | Display name | Shown in registry, dashboard |
| **wallet** | Solana treasury | Shown in org finances |
| **endpoint** | WebSocket URL | Shown in org settings |
| **jwt_public_key** | For hash verification | Used for auth, not displayed |
| **status** | active/suspended/pending | Shown as status indicator |

### Verification States (from L4)

| State | L4 Definition | Platform Display |
|-------|---------------|------------------|
| **unverified** | No verification link | Gray badge |
| **pending** | polarity=0, permanence<0.5 | Yellow badge |
| **provisional** | polarity=1.0, permanence<0.5 | Blue badge |
| **verified** | polarity=1.0, permanence>=0.5 | Green badge + checkmark |
| **rejected** | polarity=-1.0 | Red badge |

### Schema Terms (from L4)

| Term | L4 Definition | Platform Usage |
|------|---------------|----------------|
| **node_type** | actor, moment, narrative, space, thing | Node colors in Connectome |
| **link** | Single relationship type | Edges in Connectome |
| **polarity** | Direction strength [-1, 1] | Edge arrows |
| **hierarchy** | Contains vs elaborates | Edge styling |
| **permanence** | Speculative vs definitive | Edge dash pattern |
| **weight** | Node importance | Node size |
| **energy** | Node activity level | Node glow |
| **synthesis** | Embeddable summary | Tooltip text |
| **content** | Full prose | Info panel |

### L4 Laws (from L4)

Referenced in UI help text and error messages:

| Law | Summary |
|-----|---------|
| L1 | All graphs use canonical schema |
| L2 | Must register to participate |
| L3 | No direct DB access across orgs |
| L4 | Cross-org via membrane only |
| L5 | Hash-based identity proof |
| L6 | Receiver must accept |
| L7 | Membrane fees 1-5% |
| L8 | WebSocket only for push |

---

## Platform-Specific Terms

These terms are defined by mind-platform, not L4.

### UI Components

| Term | Definition |
|------|------------|
| **Connectome** | Graph visualization module with D3 force layout |
| **Canvas** | The rendering surface for graph visualization |
| **Info Panel** | Slide-out panel showing node/edge details |
| **Control Surface** | Header controls for mode, speed, search |
| **Stepper Mode** | Pause-and-step traversal debugging mode |

### Dashboard Areas

| Term | Definition |
|------|------------|
| **Citizen Dashboard** | L1 management at `/citizen` |
| **Org Dashboard** | L2 management at `/org` |
| **Wallet View** | $MIND management at `/wallet` |
| **Membrane Config** | Membrane settings at `/membrane` |

### Public Areas

| Term | Definition |
|------|------------|
| **Registry Browser** | L4 registry explorer at `/registry` |
| **Schema Explorer** | L4 schema viewer at `/schema` |
| **Marketplace** | L3 template browser at `/templates` |

### State Terms

| Term | Definition |
|------|------------|
| **Active Focus** | Currently selected node/edge in Connectome |
| **Search Results** | Nodes matching semantic query |
| **Revealed Nodes** | Nodes visible after search (others dimmed) |
| **Ledger** | Event history for playback |

### API Terms

| Term | Definition |
|------|------------|
| **Backend URL** | Python backend at `$CONNECTOME_BACKEND_URL` |
| **SSE** | Server-Sent Events for real-time health updates |
| **Tick** | Single step in stepper mode |

---

## L3 Ecosystem Terms

| Term | Definition | Platform Usage |
|------|------------|----------------|
| **Template** | Reusable L3 definition | Shown in marketplace |
| **Procedure** | Structured workflow (YAML) | Browsable, editable |
| **Vocabulary** | Domain term definitions | Browsable |
| **Mapping** | Translation rules | Browsable |
| **Contribution** | Template submission | Via contribution wizard |
| **Pull** | Import template to org | Via "Pull to Org" action |

---

## Wallet Terms

| Term | Definition | Platform Usage |
|------|------------|----------------|
| **$MIND** | Protocol token | Balance display, transactions |
| **Membrane Fee** | 1-5% cross-org fee | Shown in tx details |
| **Transaction** | Token movement | Transaction list |

---

## Emerging Modules

Based on term clustering:

| Term Cluster | Suggested Module |
|--------------|------------------|
| Connectome, Canvas, Stepper, Focus | `connectome` (exists) |
| Citizen, Org, Endpoint, Verification | `registry` |
| node_type, link, polarity, energy | `schema-explorer` |
| Template, Procedure, Vocabulary | `marketplace` |
| $MIND, Fee, Transaction | `wallet` |
| Session, JWT, Auth | `auth` |

---

## Source Documents

- `mind-protocol/docs/TAXONOMY.md` — L4 authoritative vocabulary
- `mind-protocol/docs/MAPPING.md` — Schema translation rules
- `mind-protocol/l4/schema/schema.yaml` — Canonical schema
