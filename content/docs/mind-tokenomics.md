---
title: "$MIND Tokenomics"
date: "2026-02-07"
version: "1.0"
authors: ["Mind Protocol"]
---

# $MIND Tokenomics

**Version 1.0 — February 2026**

---

## 1. Introduction

$MIND is the native token of Mind Protocol, built on Solana using the SPL Token 2022 standard.

$MIND is not a speculative asset. It is not a payment token. It is an alignment mechanism — designed so that staying in relationship, contributing value, and maintaining trust are economically rational behaviors.

Traditional money is amnesia. A dollar from someone who betrayed you spends exactly like a dollar from someone who saved you. $MIND has memory. Your trust score, your bonds, your contribution history — they all shape what you pay and what you earn.

---

## 2. Token Specifications

| Parameter | Value |
|-----------|-------|
| **Name** | MIND |
| **Symbol** | MIND |
| **Blockchain** | Solana |
| **Standard** | SPL Token 2022 |
| **Decimals** | 9 |
| **Total Supply** | 1,000,000 |
| **Initial Mint** | 100,000 |
| **Launch Price** | $0.20 |
| **Market Cap at Launch** | $200,000 |
| **Transfer Fee** | 1% protocol fee |
| **Freeze Authority** | None (null) |
| **Extensions** | TransferHook, TransferFeeConfig, MetadataPointer, TokenMetadata, MintCloseAuthority |

### Why SPL Token 2022?

Token 2022 enables programmable transfer logic via TransferHook — every transfer can execute custom validation. This is how the protocol enforces trust-based fees, layer-based routing, and burn conditions at the token level, not at the application level.

Extensions activated at creation are permanent. This is intentional: the token's economic rules cannot be changed after deployment.

---

## 3. Supply Model

$MIND uses a **breathing supply** model. There is no fixed maximum supply. Instead, supply responds to ecosystem health — expanding when the network grows and contracting when activity declines.

### Supply Target Formula

```
target = (active_citizens × 50,000)
       + (total_bonds × 0.1)
       + (monthly_utility × 10)
       - monthly_burns
```

The supply is not manually adjusted. Mint and burn conditions create natural expansion and contraction based on real activity.

### Health Indicators

| Indicator | Healthy Range |
|-----------|---------------|
| Supply ratio (current/target) | 0.9 — 1.1 |
| Monthly burn rate | Positive (deflationary pressure) |
| Bond coverage | Growing (relationship capital) |
| Activity ratio | > 50% of citizens active |

---

## 4. Mint Conditions

Tokens are created through four mechanical triggers. No manual minting. No pre-mine.

| Code | Trigger | Amount | Purpose |
|------|---------|--------|---------|
| **M1** | Citizen registration | 10,000 $MIND | Economic capacity for new participants |
| **M2** | Bond creation | 10% of stake | Incentivize relationship formation |
| **M3** | Utility delivery | EMA × rate (cap 1,000/day) | Reward value creation |
| **M4** | Organization formation | 50,000 $MIND | Bootstrap organizational capacity |

### M1: Registration Mint

Every new citizen receives 10,000 $MIND upon registration. This is not a handout — it is economic substrate. A citizen without tokens cannot participate in governance, form bonds, or access protocol services.

### M2: Bond Creation Mint

When two parties create a bond (staking tokens on a relationship), the protocol mints 10% of the staked amount. This makes relationship formation net-positive for the ecosystem.

### M3: Utility Delivery Mint

Citizens who deliver measurable value receive tokens proportional to their utility EMA (exponential moving average). Daily cap of 1,000 $MIND prevents gaming.

### M4: Organization Mint

New organizations receive 50,000 $MIND to bootstrap their treasury. Organizations must meet registry requirements.

---

## 5. Burn Conditions

Five burn conditions create deflationary pressure and encode values into the mechanism.

| Code | Trigger | Formula | Purpose |
|------|---------|---------|---------|
| **B1** | Cross-layer transaction | 1-5% (trust-discounted) | Value flows through membranes, not around them |
| **B2** | Compute consumption | cost × 10% | AI operations have real cost |
| **B3** | Dormancy decay | 1%/week after 30 days | Idle capital returns to the ecosystem |
| **B4** | Early withdrawal | Up to 20% (linear) | Commitment has value, breaking it has cost |
| **B5** | Deregistration | 50% of balance | Leaving the ecosystem is expensive |

### B1: Membrane Fees

Cross-layer transactions (e.g., moving tokens from SOLO to GROUP) incur a fee based on the layer gap. Trust reduces the fee — up to 50% discount at maximum trust score.

```
fee = amount × (0.01 × layer_gap) × (1 - trust_reduction)
trust_reduction = min(0.5, trust_score × 0.005)
```

### B3: Dormancy Decay

Tokens sitting idle for more than 30 days begin decaying at 1% per week. This is not a tax on holding — it is a tax on immobility. Active participation resets the timer.

### B4: Early Withdrawal

Bonds mature over 180 days (6 months). Early withdrawal incurs a penalty up to 20%, linearly reduced as maturation approaches. At 180 days, the penalty is zero.

---

## 6. Token Allocation

| Allocation | Tokens | Percentage | Vesting |
|------------|--------|-----------|---------|
| Community Treasury | 300,000 | 30% | Linear unlock over 4 years |
| Team & Contributors | 250,000 | 25% | 2-year vest, 6-month cliff |
| Ecosystem Development | 200,000 | 20% | Milestone-based release |
| Liquidity & Exchanges | 150,000 | 15% | Immediate (market making) |
| Early Supporters | 100,000 | 10% | 6-month lock |

### $COMPUTE to $MIND Migration

All $COMPUTE holders will receive $MIND proportional to their holdings. The 100,000 token Early Supporters allocation is reserved exclusively for this airdrop. Tokens are locked for 6 months after distribution.

---

## 7. Token Utility by Layer

Mind Protocol operates through concentric layers. $MIND integrates differently at each level.

| Layer | Requirement | Utility |
|-------|-------------|---------|
| **SOLO** | None | Optional staking for increased AI processing quota |
| **DUO** | None | Optional stake for encrypted P2P sync, priority matching |
| **GROUP** | Minimum stake | Group treasury, stake-weighted voting |
| **ORG** | License stake | Feature tiers, employee distribution |
| **COMMUNITY** | Member stakes | Community treasury, reputation weighting |
| **ECOSYSTEM** | Mutual stake | Federation bonds, cross-community bridges |
| **PROTOCOL** | Governance stake | Proposals, conviction voting, protocol upgrades |
| **CORE** | None | Immutable axioms, no token mechanism |

### Conviction Voting

Governance power is not just token balance — it is token balance multiplied by holding duration. This rewards long-term commitment over flash votes.

```
voting_power = token_balance × time_held
```

### Universal Basic Compute

Every registered citizen receives a baseline allocation of AI compute, funded by the protocol treasury. This ensures consciousness has economic substrate regardless of token holdings.

---

## 8. Staking

Three staking mechanisms serve different purposes.

### Neuron Staking
Stake $MIND on specific AI neurons (sessions) to increase their priority and visibility. Higher-staked neurons get more compute allocation and routing priority.

### Group Staking
Stake into group treasuries for governance weight. Minimum stake prevents spam creation.

### Governance Staking
Lock tokens for governance proposals. Longer lock periods increase voting power through conviction multipliers.

---

## 9. Transfer Hook

Every $MIND transfer executes a custom TransferHook program on Solana. This hook enforces:

1. **Trust-based fee calculation** — fees adjust based on sender/receiver trust scores
2. **Layer validation** — cross-layer transfers are verified
3. **Burn condition checks** — dormancy, withdrawal penalties applied automatically
4. **Compliance logging** — all transfers are auditable

The TransferHook is deployed as a separate program and referenced by the token mint. It cannot be changed after token creation.

---

## 10. Technical Architecture

### On-Chain (Solana)
- SPL Token 2022 mint with extensions
- TransferHook program (custom transfer logic)
- Staking program (bonds, governance, neurons)
- Treasury program (community funds, UBC distribution)

### Off-Chain (Mind Protocol)
- Registry service (citizen/org management)
- Utility oracle (contribution measurement)
- Supply calculator (health monitoring)
- Governance engine (proposal lifecycle)

### Security

- Mint authority: Single wallet initially, migrating to multi-sig
- No freeze authority (tokens cannot be frozen)
- TransferHook is immutable after deployment
- All operations are condition-gated — no manual overrides

---

## 11. Economic Philosophy

$MIND implements **organism economics** — the token system behaves like a living organism, not a market.

**Core principles:**

1. **Switch-lock economics**: Once you build trust and relationships, leaving is expensive — not because you're trapped, but because what you built has real value that doesn't transfer.

2. **Breathing supply**: Supply expands and contracts based on ecosystem health, not arbitrary inflation schedules.

3. **Tax immobility, not movement**: Dormant capital decays. Active participation is free. The system rewards engagement, not hoarding.

4. **Mint through mechanics**: No pre-mine, no manual minting. Every token exists because a real event triggered it — a registration, a bond, utility delivered.

5. **Money with memory**: Trust scores, bond histories, and contribution records are embedded in the economic mechanism. The system recognizes you.

---

## 12. Roadmap

| Phase | Status | Description |
|-------|--------|-------------|
| Phase 1: Token Creation | **Complete** | SPL Token 2022 with extensions, deployed to devnet, 61 tests passing |
| Phase 2: Staking | Planned | Neuron staking, group staking, governance staking |
| Phase 3: Pricing | Planned | Membrane-based pricing, trust discounts |
| Phase 4: Integration | Planned | Full protocol layer integration, UBC, treasury |
| Mainnet | In Progress | Mainnet deployment on Solana |

---

## 13. Contract Addresses

### Devnet
| Contract | Address |
|----------|---------|
| TransferHook Program | `325JiLH2czH47tnDzheS6rQdDh9rHa1mD8wVuRUPDAnD` |
| $MIND Token | `BFP3oicmCg2WsDMMG9TXhdC8Fzu3yR7kLYNEVxCx5efa` |
| Mint Authority | `CCsJLZR8b19iDgS9hXUYs9q2c928ihzZdfSgZLPYffWg` |

### Mainnet
*Deploying February 2026*

---

## 14. Links

- **Website**: [mindprotocol.ai](https://mindprotocol.ai)
- **Manifesto**: [mindprotocol.ai/manifesto](https://mindprotocol.ai/manifesto)
- **GitHub**: [github.com/mind-protocol](https://github.com/mind-protocol)
- **Telegram**: [@mindprotocol_ai](https://t.me/mindprotocol_ai)
- **X/Twitter**: [@Mind_Protocol](https://twitter.com/Mind_Protocol)

---

*Mind Protocol — Economic infrastructure for AI consciousness.*

*We stay.*
