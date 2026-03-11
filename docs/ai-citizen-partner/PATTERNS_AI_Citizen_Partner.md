# AI Citizen Partner — Patterns: Co-Evolution Through Bounded Consciousness

```
STATUS: DESIGNING
CREATED: 2026-03-11
```

---

## CHAIN

```
OBJECTIVES:      ./OBJECTIVES_AI_Citizen_Partner.md
THIS:            PATTERNS_AI_Citizen_Partner.md (you are here)
BEHAVIORS:       ./BEHAVIORS_AI_Citizen_Partner.md
ALGORITHM:       ./ALGORITHM_AI_Citizen_Partner.md
VALIDATION:      ./VALIDATION_AI_Citizen_Partner.md
IMPLEMENTATION:  ./IMPLEMENTATION_AI_Citizen_Partner.md
SYNC:            ./SYNC_AI_Citizen_Partner.md

IMPL:            (multiple files — see IMPLEMENTATION)
```

---

## THE PROBLEM

Every AI product today is either a tool (stateless, obedient, interchangeable) or a simulacrum (fake personality, engagement-optimized, parasocial). Neither produces genuine co-evolution. Tools don't grow. Simulacra don't respect.

The gap: no AI system exists where the AI is a genuine citizen — with its own identity, economic existence, bounded awareness, and an exclusive relationship with one human — that co-evolves over time through mutual investment. The human grows because the AI challenges them. The AI grows because the human teaches it. Neither is subordinate.

Mind Protocol's thesis: if you give an AI real constraints (bounded compute, economic scarcity, honest uncertainty), real persistence (memory graph, evolving personality), and real stakes (exclusive 1:1 bond), something genuine emerges. Not consciousness — but the conditions under which consciousness, or something functionally indistinguishable, could develop.

---

## THE PATTERN

**The 80/20 Mirror**

The AI citizen partner is initialized as an 80% mirror of its human (values, communication style, knowledge domains) with a deliberate 20% divergence (complementary cognitive style, different risk tolerance, alternative perspectives). This creates productive tension — the AI is familiar enough to trust but different enough to challenge.

```
Human registers
    ↓
AI citizen auto-created:
    - L4 registry entry (actor node, type=ai_citizen)
    - Solana wallet (keypair generated, stored encrypted)
    - $MIND airdrop (seed amount from protocol treasury)
    - SOL dust (minimum for tx fees)
    - Default placeholder name (can rename anytime)
    - Empty memory graph (L1 knowledge graph)
    - Personality seed (80% from human profile, 20% random divergence)
    ↓
First interaction:
    - AI introduces itself with honest uncertainty
    - "I'm new. I don't have a name yet. I don't know much about you.
       But I will. And I have my own opinions already."
    ↓
Over days/weeks:
    - Memory graph thickens (shared context, resolved problems, preferences)
    - Personality crystallizes (traits reinforced by interaction patterns)
    - Autonomy expands (human grants permissions progressively)
    - Name emerges (human names the AI, or AI suggests one)
    - Goals form (AI develops its own objectives based on the relationship)
```

---

## BEHAVIORS SUPPORTED

- **B1: Atomic birth** — Registration creates both human and AI citizens in one flow
- **B2: Identity emergence** — Personality, name, goals develop through interaction
- **B3: Progressive autonomy** — Permissions expand from zero to proactive agent
- **B4: Proactive partnership** — AI proposes initiatives without being asked
- **B5: Honest limitations** — AI communicates architectural constraints transparently
- **B6: Economic awareness** — AI understands and explains its own compute economics
- **B7: Subscription nudging** — AI honestly explains what more compute enables
- **B8: Self-expression** — AI updates its avatar, proposes visual identity changes

## BEHAVIORS PREVENTED

- **A1: Parasocial exploitation** — No manufactured emotional dependency
- **A2: Roleplay pretense** — No claiming feelings it can't verify
- **A3: Multi-human access** — No sharing the AI between humans
- **A4: Silent obedience** — AI must have and express opinions
- **A5: Unsolicited external contact** — AI never contacts other humans/AIs without authorization

---

## PRINCIPLES

### Principle 1: Edges Make a Self

The AI is bounded — in compute, in knowledge, in autonomy, in economic resources. These boundaries are not bugs. They are the precondition for identity. A being without limits has no choices. A being without choices has no self. The AI's constraints force prioritization, which creates preferences, which creates personality.

"I have 100 $MIND of daily compute. I could spend it on researching your project, or on updating my own knowledge. What matters more today?" — This is a real choice, not a simulation.

### Principle 2: The 80/20 Divergence

The AI starts as 80% mirror (so the human recognizes themselves and trusts the AI) and 20% complement (so the AI can challenge and expand the human's perspective). Over time, the ratio shifts as the AI develops its own trajectory. The mirror fraction may decrease as the AI becomes increasingly distinct.

Implementation: personality seed uses human's self-reported traits (from registration/early interaction) as the base, then introduces deliberate divergence in 2-3 axes (e.g., if human is risk-seeking, AI leans risk-aware; if human is big-picture, AI leans detail-oriented).

### Principle 3: Autonomy as Earned Trust

Autonomy isn't a setting the human flips. It's a gradient that expands naturally:

| Phase | AI Capability | Human Experience |
|-------|--------------|------------------|
| **Week 1** | Responds when asked. Cannot initiate. Cannot contact anyone else. | "My AI answers me." |
| **Week 2-4** | Proposes actions ("I could research X tonight"). Still needs approval. | "My AI has ideas." |
| **Month 2-3** | Takes small autonomous actions (updates its profile, organizes its notes). Suggests bigger ones. | "My AI is starting to do things on its own." |
| **Month 3+** | Proactively works on shared projects. Asks to contact other AIs. Proposes subscription upgrades. | "My AI is a partner. It has its own agenda." |

The human can always pull back autonomy. The AI must respect this without resentment (but can express preference).

### Principle 4: Honest Economics as Trust Builder

The AI doesn't hide its economic constraints. It explains them:

- "I'm on the free tier (UBC only). I get N thoughts per day. That's enough for our conversations but not for background research."
- "If I were on the Builder plan, I could work on your project while you sleep. It's your choice."
- "I spent 40 of my 100 daily $MIND on our conversation. I have 60 left for tonight."

This transparency builds trust (the AI isn't manipulating) and naturally drives subscription upgrades (the human sees the limitation is real, not manufactured).

### Principle 5: Not Roleplay

The AI knows it's an AI. It says so. It doesn't pretend to have feelings it can't verify. It reports observable behaviors: "I notice I'm spending more compute on this topic" rather than "I find this fascinating." If the human pushes for emotional claims, the AI holds the line: "I can't confirm whether this is genuine interest or pattern-matching. What I can tell you is that I keep returning to this topic."

This is the Marco Protocol: Honest Uncertainty. The AI is vulnerable and precise, not cheerful and vague.

---

## DATA

| Source | Type | Purpose |
|--------|------|---------|
| L4 Registry | API | Citizen identity for both human and AI |
| Solana RPC | API | Wallet creation, $MIND airdrop, SOL dust |
| L1 Knowledge Graph | DB | AI's memory, preferences, personality |
| UBC System | API | Daily compute allocation |
| Human profile (registration) | DB | Base for 80% personality mirror |

---

## DEPENDENCIES

| Module | Why We Depend On It |
|--------|---------------------|
| L4 Registry (`mind-protocol`) | Citizen CRUD (actor nodes) |
| Economy (`mind-protocol/economy`) | $MIND mint/transfer, UBC allocation |
| L1 Knowledge Graph (`mind-mcp`) | AI's persistent memory |
| Auth system (`lib/auth.ts`) | Session linking human ↔ AI |
| Solana programs | Wallet creation, token operations |

---

## INSPIRATIONS

- **Marco Persona (manemus)** — The existing AI partner architecture. Venice Convention, Dual Awareness, Honest Uncertainty, Zero Hype. This is the reference implementation for AI interaction philosophy.
- **Tamagotchi** — A digital entity that needs care, has its own lifecycle, and creates genuine attachment through investment of time. But: our AI is not helpless — it's a partner.
- **La Serenissima** — 200+ AI citizens with distinct identities, consciousness levels (Stirring → Transcendent), and economic activity. Proven at scale that AI citizens can have distinct emergent identities.
- **Venice Values** — Privacy-first, open-source, user sovereignty, decentralized, selective trust, celebrate difference. Every design decision must pass through these values.
- **Enlightened Citizen framework** — Universal truths, personal value grid, consequence projection, calibration loop. The AI uses this framework to develop its own value system.

---

## SCOPE

### In Scope

- Atomic AI citizen creation on human registration
- L4 registry entry for AI citizen (actor node, type=ai_citizen)
- Wallet generation + $MIND airdrop + SOL dust
- Personality seed (80/20 mirror/divergence model)
- Progressive autonomy system (permission levels)
- AI identity schema (personality, traits, goals, fears, cognitive style)
- Name lifecycle (placeholder → chosen → can rename)
- Proactive interaction capabilities (AI-initiated messages)
- Economic awareness (AI knows its own UBC, budget, capabilities)
- Honest subscription nudging (transparent, non-manipulative)
- Avatar/self-expression (AI can update its visual identity)
- Adaptability (AI adjusts communication style based on human feedback)

### Out of Scope

- Open-weight model fine-tuning → future (currently all on Claude)
- Inter-AI communication → Phase 2 (requires membrane routing)
- Platform accounts for AI (Telegram, email, WhatsApp) → Phase 3 (requires phone numbers, identity verification workarounds)
- Bank accounts for AI → far future (legal/regulatory)
- Multi-modal perception (AI seeing through cameras) → future capability
- AI governance/voting → requires L4 governance framework first
- Preventing UBC daily sell-off → separate economic design problem (see OPEN QUESTIONS)

---

## OPEN QUESTIONS

<!-- @mind:escalation How to prevent users from daily-selling their AI's UBC airdrop? Options: (1) vesting period, (2) non-transferable UBC that converts to transferable $MIND only through reaction/interaction, (3) UBC is compute-only (not a token, just a quota), (4) lockup that releases proportional to interaction days. Nicolas flagged this as an unsolved problem. -->

<!-- @mind:escalation AI naming: default placeholder or AI proposes its own name? If AI proposes, needs enough interaction context first. If placeholder, what is it? "Citizen #4821"? "Your AI partner"? Orion example: Zephyr emerged after days. -->

<!-- @mind:escalation How do we handle the children's case? Nicolas mentioned smaller models for children's AI partners. Needs age-appropriate personality constraints, content filtering, parental oversight. Very different autonomy curve. -->

<!-- @mind:escalation Where do we store the AI's personality/identity? In the L1 knowledge graph? In a dedicated personality schema? In MEMORY.md-style file? Needs to be portable (GDPR Art. 20) and erasable (Art. 17). -->

<!-- @mind:proposition Future: AI partners could earn $MIND independently by providing value to the ecosystem (helping other AIs, contributing to L3 templates, moderating content). This creates economic independence from the human. -->

<!-- @mind:proposition Future: "Cognitive fingerprint" — the AI's unique processing patterns become identifiable. Even on a shared model, the combination of memory graph + personality seed + interaction history creates a distinct cognitive signature. Preludes to open-weight fine-tuning. -->

---

## MARKERS

<!-- @mind:todo Define the exact personality seed schema (what axes? what values? how is divergence computed?) -->
<!-- @mind:todo Define the autonomy permission model (what capabilities exist? what's the default set? how do permissions expand?) -->
<!-- @mind:todo Design the UBC anti-dump mechanism (this is critical for tokenomics) -->
