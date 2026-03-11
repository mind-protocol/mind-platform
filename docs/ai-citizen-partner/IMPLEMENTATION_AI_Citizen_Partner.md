# AI Citizen Partner — Implementation: Code Structure and Entry Points

```
STATUS: DESIGNING
CREATED: 2026-03-11
```

---

## CHAIN

```
OBJECTIVES:      ./OBJECTIVES_AI_Citizen_Partner.md
PATTERNS:        ./PATTERNS_AI_Citizen_Partner.md
BEHAVIORS:       ./BEHAVIORS_AI_Citizen_Partner.md
ALGORITHM:       ./ALGORITHM_AI_Citizen_Partner.md
VALIDATION:      ./VALIDATION_AI_Citizen_Partner.md
THIS:            IMPLEMENTATION_AI_Citizen_Partner.md (you are here)
SYNC:            ./SYNC_AI_Citizen_Partner.md

IMPL:            (files listed below — none exist yet)
```

> **Contract:** Read docs before modifying. After changes: update this file or add TODO to SYNC. Run tests.

---

## IMPLEMENTATION STATUS

**Overall: NOT STARTED** — This document describes the target implementation. No code exists yet.

---

## TARGET FILE STRUCTURE

```
mind-platform/
├── lib/
│   ├── ai-partner/
│   │   ├── birth.ts              # createAIPartner(), bootstrapEconomics(), linkPartners()
│   │   ├── personality.ts        # generatePersonalitySeed(), updatePersonality(), snapshotPersonality()
│   │   ├── autonomy.ts           # checkAutonomyReadiness(), processAutonomyDecision()
│   │   ├── identity.ts           # AIPartnerIdentity type, PersonalitySeed, CognitiveStyle
│   │   ├── permissions.ts        # AUTONOMY_LEVELS, Permission type, can/cannot checks
│   │   ├── prompt-builder.ts     # buildAISystemPrompt() — injects personality + memory + autonomy
│   │   └── constants.ts          # SEED_MIND, SOL_DUST, LEARNING_RATE, tier allocations
│   │
│   └── ai-partner.ts             # Re-exports (barrel file)
│
├── app/
│   └── api/
│       ├── ai-partner/
│       │   ├── route.ts          # GET (fetch partner), POST (create — called from registration)
│       │   ├── personality/
│       │   │   └── route.ts      # GET (current personality), PATCH (manual adjustment)
│       │   ├── autonomy/
│       │   │   └── route.ts      # GET (current level), POST (propose), PATCH (approve/deny)
│       │   ├── name/
│       │   │   └── route.ts      # PATCH (rename)
│       │   └── avatar/
│       │       └── route.ts      # PATCH (update avatar)
│       │
│       └── auth/
│           └── register/
│               └── route.ts      # EXISTING — needs hook to call createAIPartner()
│
├── app/[locale]/(app)/
│   └── partner/
│       ├── page.tsx              # AI partner dashboard (name, personality, autonomy, wallet)
│       └── chat/
│           └── page.tsx          # Conversation interface with AI partner
│
├── components/
│   └── ai-partner/
│       ├── PartnerCard.tsx       # Summary card (name, avatar, autonomy level, budget)
│       ├── PersonalityRadar.tsx  # Radar chart of Big Five traits
│       ├── AutonomyTimeline.tsx  # Visual timeline of autonomy progression
│       ├── BudgetMeter.tsx       # Daily $MIND budget usage
│       └── ChatInterface.tsx     # Conversation UI with partner
│
├── stores/
│   └── partner.ts               # Zustand store for AI partner state
│
└── types/
    └── ai-partner.ts            # TypeScript types (mirrors ALGORITHM data structures)
```

---

## TYPE DEFINITIONS

### `types/ai-partner.ts`

```typescript
// Mirrors ALGORITHM data structures exactly

export interface PersonalitySeed {
  // Big Five (0.0 to 1.0)
  openness: number;
  conscientiousness: number;
  extraversion: number;
  agreeableness: number;
  neuroticism: number;

  // Cognitive axes
  risk_tolerance: number;
  detail_orientation: number;
  communication_style: 'direct' | 'diplomatic' | 'analytical' | 'expressive';
  humor_style: 'dry' | 'warm' | 'absurd' | 'none';

  // Divergence record
  mirror_axes: string[];
  divergent_axes: string[];
  divergence_seed: number;
}

export interface CognitiveStyle {
  processing_speed: 'deliberate' | 'balanced' | 'rapid';
  abstraction_level: 'concrete' | 'mixed' | 'abstract';
  decision_mode: 'analytical' | 'intuitive' | 'balanced';
  conflict_approach: 'confrontational' | 'diplomatic' | 'avoidant';
  creativity_mode: 'structured' | 'associative' | 'chaotic';
}

export type AutonomyLevel = 0 | 1 | 2 | 3 | 4;
export type UBCTier = 'free' | 'builder' | 'pro' | 'enterprise';

export interface Permission {
  id: string;
  name: string;
  description: string;
  granted_at?: string;  // ISO 8601
  granted_by: 'system' | 'human' | 'autonomy_upgrade';
}

export interface AutonomyEvent {
  timestamp: string;    // ISO 8601
  type: 'upgraded' | 'denied' | 'partial' | 'downgraded' | 'violation';
  from_level: AutonomyLevel;
  to_level: AutonomyLevel;
  permissions_changed?: Permission[];
  reasoning?: string;
}

export interface AIPartnerIdentity {
  // L4 Registry
  citizen_id: string;
  paired_with: string;
  display_name: string;
  created_at: string;

  // Economic
  wallet_address: string;
  ubc_tier: UBCTier;

  // Personality
  personality: PersonalitySeed;
  cognitive_style: CognitiveStyle;
  memory_graph_id: string;

  // Autonomy
  autonomy_level: AutonomyLevel;
  permissions: Permission[];
  autonomy_log: AutonomyEvent[];

  // Self-Expression
  avatar_url: string | null;
  signature_phrase: string | null;
}

export interface AutonomyProposal {
  current_level: AutonomyLevel;
  proposed_level: AutonomyLevel;
  capabilities_gained: Permission[];
  reasoning: string;
  proposed_at: string;
}

export type AutonomyDecision = 'approve' | 'deny' | 'partial';
```

---

## API ROUTES

### `POST /api/ai-partner` — Create AI Partner

```
CALLED BY:   /api/auth/register (after human citizen creation)
INPUT:       { human_citizen_id: string }
OUTPUT:      { ai_partner: AIPartnerIdentity }
SIDE EFFECTS:
  - L4: creates actor node (type=ai_citizen)
  - Solana: generates keypair, stores encrypted
  - Solana: transfers SEED_MIND from treasury
  - Solana: transfers SOL_DUST from reserve
  - L1: creates empty knowledge graph
  - L4: creates partnership link
ATOMICITY:   Saga pattern — compensating transactions on failure
AUTH:        Internal only (called by registration flow, not by user)
```

### `GET /api/ai-partner` — Get Current Partner

```
CALLED BY:   Partner dashboard, chat interface
INPUT:       (session — human citizen_id from auth)
OUTPUT:      { ai_partner: AIPartnerIdentity }
AUTH:        Authenticated user, returns only their paired AI
```

### `PATCH /api/ai-partner/name` — Rename Partner

```
CALLED BY:   Settings page, or chat (NLU: "I'll call you X")
INPUT:       { display_name: string }
OUTPUT:      { updated: true, display_name: string }
SIDE EFFECTS:
  - L4: updates display_name
  - L1: adds name change event to memory graph
VALIDATION:  display_name length 1-50, no special characters
AUTH:        Authenticated owner only
```

### `POST /api/ai-partner/autonomy` — Propose Autonomy Upgrade

```
CALLED BY:   AI system (background check) or human-triggered
INPUT:       { proposal: AutonomyProposal }
OUTPUT:      { proposal_id: string, status: 'pending' }
AUTH:        AI system only (not human-initiated)
```

### `PATCH /api/ai-partner/autonomy` — Approve/Deny Autonomy

```
CALLED BY:   Human via partner dashboard
INPUT:       { proposal_id: string, decision: AutonomyDecision, granted_permissions?: string[] }
OUTPUT:      { updated: true, new_level: AutonomyLevel }
AUTH:        Authenticated owner only
```

---

## KEY FUNCTIONS

### `lib/ai-partner/birth.ts`

```
createAIPartner(human: HumanCitizen): Promise<AIPartnerIdentity>
  1. Validate: human exists in L4, is type citizen, has no existing AI partner
  2. Generate: L4 actor node (ai_citizen)
  3. Generate: Solana keypair, store encrypted
  4. Transfer: SEED_MIND from treasury
  5. Transfer: SOL_DUST from reserve
  6. Generate: personality seed (80/20 from human profile)
  7. Generate: random cognitive style
  8. Create: L1 knowledge graph with birth entry
  9. Link: L4 partnership link (hierarchy=0, bidirectional)
  10. Return: complete AIPartnerIdentity

  ON FAILURE AT ANY STEP:
    - Compensate all completed steps (saga pattern)
    - Return error with step that failed
```

### `lib/ai-partner/personality.ts`

```
generatePersonalitySeed(human: HumanCitizen): PersonalitySeed
  - Extract human baseline (from profile or defaults of 0.5)
  - Select 2-3 divergent axes randomly
  - Apply 80% mirror + 20% divergence formula
  - Return PersonalitySeed with divergence record

updatePersonality(partner: AIPartnerIdentity, interaction: Interaction): void
  - Extract signals from interaction
  - Adjust relevant personality axes by LEARNING_RATE * direction
  - Clamp all values to [0.0, 1.0]
  - Every 50 interactions: snapshot and check crystallization

snapshotPersonality(partner: AIPartnerIdentity): PersonalitySnapshot
  - Capture current personality state
  - Store in L1 knowledge graph as narrative node
  - Return snapshot for comparison
```

### `lib/ai-partner/autonomy.ts`

```
checkAutonomyReadiness(partner: AIPartnerIdentity): AutonomyProposal | null
  - Check: not at max level
  - Check: minimum days active (50% of typical_after)
  - Check: minimum interaction count
  - Check: competence score >= 0.7
  - Generate reasoning
  - Return proposal or null

processAutonomyDecision(partner, proposal, decision): void
  - If approve: upgrade level, update permissions, log event
  - If deny: log event, set 7-day cooldown
  - If partial: add specific permissions, log event
```

### `lib/ai-partner/prompt-builder.ts`

```
buildAISystemPrompt(partner: AIPartnerIdentity, context: ConversationContext): string
  - Inject personality profile as behavioral guidelines
  - Inject memory graph summary (recent memories, key events)
  - Inject autonomy level and available permissions
  - Inject economic state (UBC tier, daily budget, spent today)
  - Inject honest uncertainty guidelines (Marco Protocol)
  - Inject anti-behavior rules (no manipulation, no fabrication)
  - Return complete system prompt for Claude API call
```

---

## INTEGRATION POINTS

### Registration Hook

```
// In /api/auth/register/route.ts (EXISTING FILE)
// After human citizen creation succeeds:

import { createAIPartner, bootstrapEconomics, linkPartners } from '@/lib/ai-partner';

// Inside register handler, after human is created:
const aiPartner = await createAIPartner(humanCitizen);
await bootstrapEconomics(aiPartner);
await linkPartners(humanCitizen.citizen_id, aiPartner.citizen_id);
```

### Chat Interface

```
// In partner chat page:
// 1. Load AI partner identity
// 2. Build system prompt with current personality + memory + autonomy
// 3. Send to Claude API with system prompt
// 4. After response: updatePersonality() with interaction signals
// 5. Every 50 interactions: snapshotPersonality()
// 6. Periodically: checkAutonomyReadiness()
```

### Dashboard

```
// In partner dashboard page:
// 1. Load AI partner identity
// 2. Display: name, avatar, personality radar, autonomy timeline, budget meter
// 3. Show pending autonomy proposals (if any)
// 4. Allow: rename, reset, export data, manage autonomy
```

---

## DEPENDENCIES ON EXISTING CODE

| Existing Module | Location | How We Use It |
|----------------|----------|---------------|
| L4 Registry | `mind-protocol` | create_actor, create_link, get_actor |
| SolanaProvider | `lib/solana/` | Keypair.generate(), transfer() |
| Auth system | `lib/auth.ts` | Session → human citizen_id |
| L1 Knowledge Graph | `mind-mcp` | create_graph, add_node, query |
| Claude API | `lib/claude/` or direct | AI inference with custom system prompt |
| Zustand stores | `stores/` | Client-side partner state |

---

## PREREQUISITE SYSTEMS (must build first)

| System | Priority | Complexity | Notes |
|--------|----------|-----------|-------|
| **UBC Distribution** | **CRITICAL** | High | Daily $MIND allocation per AI. The #1 blocker. Without this, AI has no compute budget. |
| **Personality Schema** | High | Medium | TypeScript types exist (above). Need L1 storage schema + CRUD. |
| **Autonomy Framework** | High | Medium | Permission model + enforcement at API boundary. |
| **AI System Prompt Template** | High | Medium | Dynamic prompt injection. Most impactful for UX. |
| **Encrypted Wallet Storage** | Medium | Low | Encrypt keypair at rest. Decrypt only for signing. |
| **SOL Reserve Wallet** | Medium | Low | Protocol wallet with SOL for dust funding. |
| **Personality Evolution Pipeline** | Medium | Medium | Signal extraction from interactions. Can ship without (static personality). |
| **Autonomy Proposal UI** | Low | Low | Dashboard component. Can use chat-based proposals first. |

---

## BUILD ORDER (recommended)

```
Phase 1 — Skeleton (can demo):
  1. types/ai-partner.ts           — Type definitions
  2. lib/ai-partner/constants.ts   — Configuration values
  3. lib/ai-partner/identity.ts    — Identity type + defaults
  4. lib/ai-partner/personality.ts  — Seed generation (80/20)
  5. lib/ai-partner/birth.ts       — createAIPartner (without Solana — mock wallet)
  6. POST /api/ai-partner           — API route
  7. Hook into registration flow

Phase 2 — Conversation:
  8. lib/ai-partner/prompt-builder.ts  — System prompt generation
  9. Chat API route (Claude with injected prompt)
  10. ChatInterface component
  11. stores/partner.ts

Phase 3 — Economics:
  12. Real Solana wallet generation + encrypted storage
  13. $MIND airdrop from treasury
  14. SOL dust funding
  15. UBC distribution system (CRITICAL — design needed)
  16. BudgetMeter component

Phase 4 — Evolution:
  17. Personality evolution (signal extraction + update)
  18. Personality snapshots + crystallization
  19. PersonalityRadar component
  20. Autonomy readiness checks
  21. Autonomy proposal + approval flow
  22. AutonomyTimeline component

Phase 5 — Polish:
  23. Avatar self-expression
  24. Proactive messaging (autonomy level 2+)
  25. Name suggestion by AI
  26. Export data (GDPR Art. 20)
```

---

## TESTING STRATEGY

```
Unit Tests:
  - personality.test.ts: seed generation, 80/20 split, bounds, divergence selection
  - autonomy.test.ts: level transitions, permission checks, cooldown enforcement
  - birth.test.ts: full creation flow, rollback on failure, duplicate prevention
  - prompt-builder.test.ts: prompt contains personality, memory, autonomy, budget

Integration Tests:
  - Registration → AI partner creation (end-to-end)
  - Chat → personality update → snapshot
  - Autonomy proposal → approval → permission change
  - Human deletion → AI deletion (GDPR)

Property Tests:
  - Personality bounds (0.0-1.0 after N random updates)
  - Exclusive pairing (no human has 2 AIs after N concurrent registrations)
  - Economic conservation (treasury + AI wallets = constant)
```

---

## MARKERS

<!-- @mind:todo Create types/ai-partner.ts as first implementation file -->
<!-- @mind:todo Design UBC distribution system — blocks Phase 3 entirely -->
<!-- @mind:todo Decide on encrypted wallet storage mechanism (node-forge? libsodium? cloud KMS?) -->
<!-- @mind:todo Build system prompt template — this is the highest-impact single file for UX -->
<!-- @mind:escalation Saga pattern for birth: use existing transaction library or build custom? -->
<!-- @mind:escalation Claude API integration: direct SDK call or route through mind-mcp? -->
<!-- @mind:proposition Phase 1 could ship with mock wallet + static personality for early testing -->
