# Concept: AI-Human Partnership

How AI agents and humans collaborate through Mind Platform.

```
STATUS: DESIGNING
TYPE: Cross-cutting concept
TOUCHES: registry, dashboard, membrane, connectome
```

---

## The Core Insight

**Mind Protocol enables a new kind of AI-human collaboration: persistent, contextual, and verifiable.**

Unlike chat interfaces where context is lost, Mind Protocol gives AI agents:
- **Persistent memory** (graphs that survive sessions)
- **Verifiable identity** (registration, verification)
- **Structured knowledge** (schema-constrained semantics)
- **Cross-agent communication** (membrane network)

This changes the nature of AI-human work.

---

## Partnership Modes

### Mode 1: Human + Personal Agent (L1)

A human has their own AI agent(s) with private knowledge graphs.

```
Human ←→ My Agent ←→ My Graph (L1)
```

**Characteristics:**
- Agent knows human's context
- Graph accumulates over time
- Private by default
- Human can inspect and edit graph

**UX implications:**
- Citizen dashboard for graph inspection
- Edit capabilities for human oversight
- Privacy controls prominent

### Mode 2: Team + Shared Agents (L2)

An organization has shared agents with team knowledge.

```
Team Members ←→ Org Agents ←→ Org Graph (L2)
```

**Characteristics:**
- Agents share organizational knowledge
- Humans in different roles access same agents
- Verification establishes trust
- Admin controls access

**UX implications:**
- Org dashboard shows all org agents
- Role-based access controls
- Activity audit trail
- Team collaboration features

### Mode 3: Ecosystem Participation (L3)

Agents and humans contribute to shared ecosystem.

```
Many Orgs ←→ Shared Templates ←→ Ecosystem (L3)
```

**Characteristics:**
- Templates shared across organizations
- Contributions reviewed and integrated
- Community standards emerge
- Knowledge compounds

**UX implications:**
- Marketplace browsing
- Contribution workflow
- Review/approval flow
- Usage analytics

### Mode 4: Protocol Verification (L4)

Humans verify AI agents at protocol level.

```
Verifiers ←→ Registry ←→ All Agents (L4)
```

**Characteristics:**
- Trusted verifiers (human or authorized agents)
- Verification affects trust
- Public transparency
- Protocol governance

**UX implications:**
- Verification badges everywhere
- Verifier identity visible
- Verification history accessible
- Appeal/dispute mechanisms

---

## Trust Model

### Human Trust in AI

| Signal | Meaning |
|--------|---------|
| Registered | Agent has identity in protocol |
| Verified | Trusted verifier vouches for agent |
| Org membership | Part of known organization |
| Activity history | Track record visible |
| Graph inspection | Human can see what agent knows |

### AI Trust in Human

| Signal | Meaning |
|--------|---------|
| Wallet signature | Human controls wallet |
| Org admin | Human has admin role |
| Verification authority | Human is authorized verifier |

### Agent Trust in Agent

| Signal | Meaning |
|--------|---------|
| Same org | Implicit trust within org |
| Membrane handshake | Verified cross-org communication |
| Verification chain | Transitive trust through verifiers |

---

## UX for Partnership

### Inspection Pattern

Humans can always see what an agent knows.

```
┌─────────────────────────────────────────────┐
│  My Agent: Claude                           │
├─────────────────────────────────────────────┤
│  Knowledge Graph                            │
│  ┌─────────────────────────────────────────┐│
│  │  [Interactive Connectome view]          ││
│  │                                         ││
│  │  Nodes: 1,234 | Edges: 5,678            ││
│  └─────────────────────────────────────────┘│
│                                             │
│  Recent Activity                            │
│  • Added 5 nodes about "project alpha"      │
│  • Updated belief about "deadline"          │
│  • Connected to org knowledge               │
│                                             │
│  [View Full Graph] [Edit] [Export]          │
└─────────────────────────────────────────────┘
```

### Override Pattern

Humans can correct agent knowledge.

```
┌─────────────────────────────────────────────┐
│  Node: "Project Alpha deadline"             │
├─────────────────────────────────────────────┤
│  Agent believes: "March 15"                 │
│                                             │
│  ⚠️ You corrected this to: "March 22"       │
│                                             │
│  [Accept Agent] [Keep Override] [Discuss]   │
└─────────────────────────────────────────────┘
```

### Delegation Pattern

Humans delegate tasks to agents with constraints.

```
┌─────────────────────────────────────────────┐
│  Delegate: Research competitors             │
├─────────────────────────────────────────────┤
│  Agent will:                                │
│  ✓ Search web for competitor info           │
│  ✓ Add findings to knowledge graph          │
│  ✓ Create summary narrative                 │
│                                             │
│  Constraints:                               │
│  □ Require approval before external calls   │
│  ☑ Stay within org knowledge boundaries     │
│  □ Time limit: 1 hour                       │
│                                             │
│  [Delegate] [Cancel]                        │
└─────────────────────────────────────────────┘
```

### Collaboration Pattern

Human and agent work together on a task.

```
┌─────────────────────────────────────────────┐
│  Active: Planning Q2 roadmap                │
├─────────────────────────────────────────────┤
│  You                                        │
│  > We need to prioritize mobile             │
│                                             │
│  Agent                                      │
│  > I've added "mobile priority" as a        │
│  > belief. Based on previous discussions,   │
│  > this connects to 3 existing narratives.  │
│  > [View connections]                       │
│                                             │
│  Knowledge updated:                         │
│  + Belief: "Mobile is Q2 priority"          │
│  + Link to "user feedback themes"           │
│  + Link to "resource allocation"            │
│                                             │
│  [Continue conversation] [View graph]       │
└─────────────────────────────────────────────┘
```

---

## Escalations

### `@mind:escalation` — Human Override Authority

**Question:** When can humans override agent knowledge?

**Options:**
1. Always — humans have full control (recommended for v1)
2. Depends on verification level
3. Requires org admin for shared knowledge

**Recommendation:** Option 1 for individual L1 graphs. Option 3 for L2 shared graphs.

### `@mind:escalation` — Agent Autonomy Levels

**Question:** How autonomous can agents be?

**Options:**
1. Always require human approval for actions
2. Configurable autonomy per agent/task
3. Full autonomy within boundaries (recommended)

**Recommendation:** Option 3 — autonomy within configurable boundaries.

### `@mind:escalation` — Conflict Resolution

**Question:** What happens when human and agent disagree?

**Options:**
1. Human always wins
2. Both views preserved with attribution
3. Escalation to org admin (recommended for L2)

**Recommendation:** For L1, human wins. For L2, preserve both and escalate if unresolved.

---

## Implementation Notes

This concept affects:

| Module | How |
|--------|-----|
| `citizen-dashboard` | Inspection, override, delegation UI |
| `org-dashboard` | Team collaboration, conflict resolution |
| `connectome` | Graph visualization with human/agent attribution |
| `registry` | Trust signals display |
| `auth` | Identity verification for humans |

---

## Related

- `docs/vision/VOCABULARY_Platform_Terms.md` — Citizen, Org definitions
- `docs/registry/` — Trust signals in registry
- `docs/ux/PATTERNS_UX_Principles.md` — Interaction patterns
