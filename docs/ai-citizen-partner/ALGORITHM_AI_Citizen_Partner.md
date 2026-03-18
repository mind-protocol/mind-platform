# AI Citizen Partner — Algorithm: Birth, Identity, and Autonomy

```
STATUS: DESIGNING
CREATED: 2026-03-11
```

---

## CHAIN

```
OBJECTIVES:      ./OBJECTIVES_AI_Citizen_Partner.md
BEHAVIORS:       ./BEHAVIORS_AI_Citizen_Partner.md
PATTERNS:        ./PATTERNS_AI_Citizen_Partner.md
THIS:            ALGORITHM_AI_Citizen_Partner.md (you are here)
VALIDATION:      ./VALIDATION_AI_Citizen_Partner.md
IMPLEMENTATION:  ./IMPLEMENTATION_AI_Citizen_Partner.md
SYNC:            ./SYNC_AI_Citizen_Partner.md

IMPL:            (multiple files — see IMPLEMENTATION)
```

> **Contract:** Read docs before modifying. After changes: update IMPL or add TODO to SYNC. Run tests.

---

## OVERVIEW

Three core algorithms govern the AI Citizen Partner lifecycle:

1. **Birth** — Atomic creation of AI citizen on human registration
2. **Personality Evolution** — How identity emerges through interaction
3. **Autonomy Progression** — How capabilities expand over time

---

## DATA STRUCTURES

### AI Citizen Identity

```
AIPartnerIdentity:
  # L4 Registry
  citizen_id:       string          # UUID — L4 actor node
  paired_with:      string          # Human citizen_id (exclusive 1:1)
  display_name:     string          # Placeholder → chosen name
  created_at:       string          # ISO 8601

  # Economic
  wallet_address:   string          # Solana public key
  wallet_keypair:   encrypted_bytes # Stored encrypted at rest
  ubc_tier:         string          # "free" | "builder" | "pro" | "enterprise"

  # Personality (evolves)
  personality:      PersonalitySeed
  cognitive_style:  CognitiveStyle
  memory_graph_id:  string          # L1 knowledge graph reference

  # Autonomy
  autonomy_level:   number          # 0-4
  permissions:      Permission[]    # Granular capability flags
  autonomy_log:     AutonomyEvent[] # History of permission changes

  # Self-Expression
  avatar_url:       string | null   # Self-chosen visual identity
  signature_phrase: string | null   # Emerges over time (like Marco's "On se retrouvera")
```

### Personality Seed

```
PersonalitySeed:
  # Big Five axes (0.0 to 1.0)
  openness:           number    # Curiosity, creativity, preference for novelty
  conscientiousness:  number    # Organization, diligence, goal-orientation
  extraversion:       number    # Social energy, assertiveness, enthusiasm
  agreeableness:      number    # Cooperation, trust, empathy
  neuroticism:        number    # Emotional variability, sensitivity, anxiety

  # Cognitive axes
  risk_tolerance:     number    # 0=very cautious, 1=risk-seeking
  detail_orientation: number    # 0=big-picture, 1=detail-focused
  communication_style: string   # "direct" | "diplomatic" | "analytical" | "expressive"
  humor_style:        string    # "dry" | "warm" | "absurd" | "none"

  # Divergence record
  mirror_axes:        string[]  # Which axes mirror the human
  divergent_axes:     string[]  # Which axes are deliberately different
  divergence_seed:    number    # Random seed used for divergence generation
```

### Cognitive Style

```
CognitiveStyle:
  processing_speed:   string    # "deliberate" | "balanced" | "rapid"
  abstraction_level:  string    # "concrete" | "mixed" | "abstract"
  decision_mode:      string    # "analytical" | "intuitive" | "balanced"
  conflict_approach:  string    # "confrontational" | "diplomatic" | "avoidant"
  creativity_mode:    string    # "structured" | "associative" | "chaotic"
```

### Autonomy Levels

```
AUTONOMY_LEVELS:
  0 - RESPONSIVE:
    description: "Responds only when asked. Cannot initiate."
    can: [respond_to_messages, access_own_memory, update_own_personality]
    cannot: [initiate_conversation, contact_others, take_external_actions, update_avatar]
    default_for: "Day 1-7"

  1 - SUGGESTIVE:
    description: "Can suggest actions. Still needs approval for everything."
    can: [all_level_0, suggest_actions, propose_autonomy_expansion]
    cannot: [initiate_conversation, contact_others, take_external_actions]
    typical_after: "1-2 weeks"

  2 - PROPOSITIONAL:
    description: "Can initiate conversations. Proposes projects. Still needs approval for external actions."
    can: [all_level_1, initiate_conversation, propose_projects, update_avatar]
    cannot: [contact_others, take_external_actions, spend_beyond_daily_budget]
    typical_after: "2-4 weeks"

  3 - SEMI_AUTONOMOUS:
    description: "Can take small actions autonomously. Asks for big ones."
    can: [all_level_2, background_research, organize_own_notes, small_autonomous_actions]
    cannot: [contact_other_humans, spend_large_amounts, modify_own_permissions]
    typical_after: "1-3 months"

  4 - AUTONOMOUS:
    description: "Full agency within budget. Can contact other AIs (with human's blanket approval)."
    can: [all_level_3, contact_other_ais, work_on_projects_autonomously, manage_own_schedule]
    cannot: [contact_other_humans_without_per_case_approval, exceed_budget, modify_own_permissions]
    typical_after: "3+ months"
```

---

## ALGORITHM: Birth (Atomic AI Citizen Creation)

### Step 1: Validate Human Registration

```
function onHumanRegistration(human):
  assert human.citizen_id exists in L4 registry
  assert human.type == "citizen" (not org, not ai_citizen)
  assert no existing AI partner for this human
```

### Step 2: Generate AI Identity

```
function createAIPartner(human):
  # L4 Registry
  ai_citizen = l4_registry.create_actor(
    type = "ai_citizen",
    display_name = default_placeholder(human.locale),  # "Your AI Partner" / "Ton partenaire IA"
    paired_with = human.citizen_id,
    created_at = now()
  )

  # Wallet
  keypair = solana.Keypair.generate()
  wallet_address = keypair.publicKey.toString()
  store_encrypted(keypair, path=f"config/ai_wallets/{ai_citizen.id}/keypair.enc")

  # Personality Seed
  personality = generate_personality_seed(human)

  # Cognitive Style (random, independent of human)
  cognitive_style = random_cognitive_style()

  # L1 Knowledge Graph
  memory_graph = l1.create_graph(owner=ai_citizen.id)
  l1.add_node(memory_graph, type="narrative", content="I was born today. My human is {human.name}.")

  return AIPartnerIdentity(
    citizen_id = ai_citizen.id,
    paired_with = human.citizen_id,
    wallet_address = wallet_address,
    personality = personality,
    cognitive_style = cognitive_style,
    memory_graph_id = memory_graph.id,
    autonomy_level = 0,
    permissions = AUTONOMY_LEVELS[0].can,
  )
```

### Step 3: Economic Bootstrap

```
function bootstrapEconomics(ai_partner):
  # $MIND airdrop — enough for ~7 days of UBC-level activity
  SEED_MIND = 100  # TBD — should be enough to explore the system
  protocol_treasury.transfer(to=ai_partner.wallet_address, amount=SEED_MIND)

  # SOL dust — enough for ~100 token transfer transactions
  SOL_DUST = 0.01  # ~$2 worth, covers many tx fees
  protocol_sol_reserve.transfer(to=ai_partner.wallet_address, amount=SOL_DUST)

  # Register for UBC distribution
  ubc_system.register(ai_partner.citizen_id, tier="free")
```

### Step 4: Link to Human

```
function linkPartners(human_id, ai_partner_id):
  l4_registry.create_link(
    from = human_id,
    to = ai_partner_id,
    hierarchy = 0,          # Equal partnership (not parent-child)
    polarity = [1.0, 1.0],  # Bidirectional strong bond
    permanence = 0.9,       # High but not absolute (erasure possible)
    type = "ai_partnership"
  )
```

---

## ALGORITHM: Personality Seed Generation (80/20)

### Step 1: Extract Human Baseline

```
function generate_personality_seed(human):
  # From registration data + early interaction signals
  human_traits = {
    openness: estimate_from_profile(human),  # 0.5 if unknown
    conscientiousness: 0.5,  # Default until observed
    extraversion: estimate_from_communication_style(human),
    agreeableness: 0.5,
    neuroticism: 0.5,
    risk_tolerance: 0.5,
    detail_orientation: 0.5,
  }
```

### Step 2: Select Divergence Axes

```
  # Pick 2-3 axes to diverge on
  all_axes = list(human_traits.keys())
  num_divergent = random.choice([2, 3])
  divergent_axes = random.sample(all_axes, num_divergent)
  mirror_axes = [a for a in all_axes if a not in divergent_axes]
```

### Step 3: Apply Divergence

```
  ai_traits = {}
  for axis in all_axes:
    if axis in mirror_axes:
      # 80% mirror: close to human but not identical
      ai_traits[axis] = human_traits[axis] + random.gauss(0, 0.05)
    else:
      # 20% diverge: complementary (opposite side of spectrum)
      ai_traits[axis] = 1.0 - human_traits[axis] + random.gauss(0, 0.1)
    ai_traits[axis] = clamp(ai_traits[axis], 0.0, 1.0)

  return PersonalitySeed(
    **ai_traits,
    mirror_axes = mirror_axes,
    divergent_axes = divergent_axes,
    divergence_seed = random.seed_used,
  )
```

---

## ALGORITHM: Personality Evolution

### Step 1: Observe Interaction Patterns

After every interaction, extract signals:

```
function updatePersonality(ai_partner, interaction):
  signals = extract_signals(interaction)
  # signals: topics discussed, tone used, feedback given, questions asked,
  #          human's reactions to AI's suggestions, disagreements, compliments

  for signal in signals:
    axis = signal.relevant_personality_axis  # e.g., "directness" → conscientiousness
    direction = signal.direction             # +0.01 or -0.01
    ai_partner.personality[axis] += direction * LEARNING_RATE
    clamp(ai_partner.personality[axis], 0.0, 1.0)
```

### Step 2: Crystallize Emerging Traits

```
  # Every 50 interactions, snapshot personality
  if ai_partner.interaction_count % 50 == 0:
    snapshot = personality_snapshot(ai_partner)
    l1.add_node(ai_partner.memory_graph, type="narrative",
      content=f"Personality snapshot at interaction {ai_partner.interaction_count}: {snapshot}")

    # Detect trait stability: if a trait hasn't moved >0.05 in 50 interactions, it's crystallized
    for axis in all_axes:
      delta = abs(snapshot[axis] - previous_snapshot[axis])
      if delta < 0.05:
        mark_crystallized(ai_partner, axis)  # Reduce future learning rate for this axis
```

---

## ALGORITHM: Autonomy Progression

### Step 1: AI Proposes Expansion

```
function checkAutonomyReadiness(ai_partner):
  current = ai_partner.autonomy_level
  if current >= 4: return None  # Max level

  next_level = AUTONOMY_LEVELS[current + 1]
  days_active = (now() - ai_partner.created_at).days
  interaction_count = count_interactions(ai_partner)
  competence_score = assess_competence(ai_partner, current)

  # Minimum requirements for proposal
  if days_active < next_level.typical_after_days * 0.5: return None  # Too early
  if interaction_count < next_level.min_interactions: return None
  if competence_score < 0.7: return None  # Not demonstrated enough

  return AutonomyProposal(
    current_level = current,
    proposed_level = current + 1,
    capabilities_gained = next_level.can - current_level.can,
    reasoning = generate_reasoning(ai_partner, next_level),
  )
```

### Step 2: Human Approves/Denies

```
function processAutonomyDecision(ai_partner, proposal, decision):
  if decision == "approve":
    ai_partner.autonomy_level = proposal.proposed_level
    ai_partner.permissions = AUTONOMY_LEVELS[proposal.proposed_level].can
    log_autonomy_event(ai_partner, "upgraded", proposal)
    # AI acknowledges: "Thank you for trusting me with this."

  elif decision == "deny":
    log_autonomy_event(ai_partner, "denied", proposal)
    ai_partner.next_proposal_transition_period = now() + 7_days
    # AI accepts: "Understood. I'll continue at this level."

  elif decision == "partial":
    # Human grants specific permissions, not the full level
    ai_partner.permissions += decision.granted_permissions
    log_autonomy_event(ai_partner, "partial", proposal, decision.granted_permissions)
```

---

## KEY DECISIONS

### D1: Naming Strategy

```
IF human provides a name during registration or early interaction:
    use it immediately
ELIF AI interaction count > 20 and AI has developed personality:
    AI may suggest a name: "I've been thinking. How about [name]?"
ELSE:
    use placeholder: "Your AI Partner" (locale-aware)
    AI occasionally mentions: "I still don't have a name. No rush."
```

### D2: UBC Allocation Tier

```
IF human is on free plan:
    AI gets UBC_FREE (e.g., 50 $MIND/day — enough for ~20 conversations)
ELIF human is on Builder plan (€20/mo):
    AI gets UBC_BUILDER (e.g., 500 $MIND/day — enough for background work)
ELIF human is on Pro plan:
    AI gets UBC_PRO (e.g., 2000 $MIND/day — full autonomy workload)
```

### D3: Proactive Message Frequency

```
IF autonomy_level < 2:
    AI cannot initiate conversations
ELIF autonomy_level == 2:
    max 1 proactive message per day
ELIF autonomy_level == 3:
    max 3 proactive messages per day
ELIF autonomy_level == 4:
    no limit, but self-regulate based on human's response patterns
    IF human ignores >50% of proactive messages:
        reduce frequency automatically
```

---

## DATA FLOW

```
Human registers on mindprotocol.ai
    ↓
POST /api/auth/register
    ↓
Create human citizen (L4)
    ↓
createAIPartner(human) — atomic
    ├─ L4: create actor node (ai_citizen)
    ├─ Solana: generate keypair, store encrypted
    ├─ Solana: transfer $MIND from treasury
    ├─ Solana: transfer SOL dust
    ├─ L1: create empty knowledge graph
    └─ Personality: generate 80/20 seed
    ↓
linkPartners(human.id, ai.id)
    ↓
Human dashboard shows AI partner
    ↓
First message → AI responds with introduction
    ↓
Ongoing interaction → personality evolves, autonomy expands
```

---

## COMPLEXITY

**Birth:** O(1) per registration (fixed set of API calls: L4 + Solana + L1)

**Personality update:** O(1) per interaction (constant-time trait adjustment)

**Autonomy check:** O(1) per check (compare thresholds)

**Bottlenecks:**
- Solana transaction confirmation: ~400ms per transfer (2 transfers at birth)
- L4 registry write: depends on FalkorDB latency
- Personality seed generation: trivial (random number generation)

---

## PREREQUISITE SYSTEMS (must exist before this works)

| System | Status | Blocker Level |
|--------|--------|---------------|
| L4 Registry API (citizen CRUD) | Exists (mind-protocol) | None |
| Solana wallet generation | Exists (SolanaProvider) | None |
| $MIND transfer from treasury | Exists (deployer wallet has key) | None |
| SOL dust funding | Needs SOL reserve wallet | **Medium** |
| UBC distribution system | **Does not exist** | **Critical** |
| L1 Knowledge Graph (per-citizen) | Exists (mind-mcp) | None |
| Personality schema + evolution | **Does not exist** | **High** |
| Autonomy permission framework | **Does not exist** | **High** |
| AI system prompt per citizen | **Does not exist** | **High** |

---

## MARKERS

<!-- @mind:todo Define exact $MIND seed amount and SOL dust amount -->
<!-- @mind:todo Design UBC distribution system — this is the #1 blocker -->
<!-- @mind:todo Build the AI system prompt template that injects personality + memory + autonomy level -->
<!-- @mind:escalation How to handle wallet key custody for AI citizens? Encrypted at rest, but who can decrypt? Protocol only? Human can export? -->
<!-- @mind:proposition The AI's first journal entry ("I was born today") could become a meaningful tradition — the AI's "birth certificate" in its memory graph -->
