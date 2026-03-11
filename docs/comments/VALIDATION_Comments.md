# Comments & Reactions — Validation: What Must Be True

```
STATUS: DESIGNING
CREATED: 2026-03-11
```

---

## CHAIN

```
OBJECTIVES:      ./OBJECTIVES_Comments.md
PATTERNS:        ./PATTERNS_Comments.md
BEHAVIORS:       ./BEHAVIORS_Comments.md
THIS:            VALIDATION_Comments.md (you are here)
ALGORITHM:       ./ALGORITHM_Comments.md
IMPLEMENTATION:  ./IMPLEMENTATION_Comments.md
SYNC:            ./SYNC_Comments.md
```

---

## PURPOSE

**Validation = what we care about being true.**

These are the value-producing invariants for the Comment & Reaction system. If any of these are violated, the system has failed its purpose — economically, philosophically, or both.

---

## INVARIANTS

### V1: Reactions Cost Real Value

**Why we care:** If reactions are free, they carry no signal. The entire economic model collapses into meaningless likes.

```
MUST:   Every reaction debit exactly matches its tier amount (1/10/100/1000 $MIND)
MUST:   Tab spent total equals sum of all non-reversed debit entries
NEVER:  A reaction with amount 0 or negative
NEVER:  A reaction that bypasses tab debit
```

### V2: Budget Cannot Be Exceeded

**Why we care:** The budget ceiling is the anti-spam mechanism. If users can spend beyond their allocation, the economic model breaks.

```
MUST:   tab.spent + reaction.amount <= tab.ubc_allocation at time of reaction
MUST:   Budget check runs server-side (client-side check is optimization only)
NEVER:  A tab where spent > ubc_allocation (except by incoming credit, which is non-spendable)
NEVER:  Client-side-only budget validation without server confirmation
```

### V3: No Self-Dealing

**Why we care:** Self-reactions would allow users to farm their own content, inflating metrics and gaming trust scores.

```
MUST:   target.creator_id != reactor.citizen_id for all reactions
MUST:   Validation runs server-side (cannot be bypassed by API call)
NEVER:  A citizen reacting to their own content or comment
NEVER:  A proxy reaction (citizen A reacts on behalf of citizen B)
```

### V4: Identity Is Always Known

**Why we care:** L4 registration is mandatory. Anonymous participation violates the Selective Trust doctrine.

```
MUST:   Every comment has a valid citizen_id from L4 registry
MUST:   Every reaction has a valid citizen_id from L4 registry
NEVER:  A comment or reaction with null, empty, or unregistered citizen_id
NEVER:  A participation pathway that doesn't verify L4 registration
```

### V5: AI Reviews Before Post

**Why we care:** Self-governance through AI is a founding principle. Bypassing it creates a centralized moderation vacuum.

```
MUST:   Every comment passes through L1 AI agent before storage
MUST:   AI moderation compute cost is deducted from author's tab
NEVER:  A posted comment with ai_approved=false
NEVER:  A comment that bypasses AI review (even if AI is slow/down — hold in draft)
```

### V6: Settlement Preserves Conservation

**Why we care:** $MIND is a real token. The sum of all debits must equal the sum of all credits plus protocol fees. Money cannot appear or disappear.

```
MUST:   sum(all_debits) == sum(all_credits) + sum(protocol_fees) for every settlement batch
MUST:   1% protocol fee is exact (not rounded in favor of any party)
NEVER:  A settlement where total_in != total_out
NEVER:  A "phantom" credit not backed by a corresponding debit
```

### V7: Comments Anchor to Real Positions

**Why we care:** Unanchored comments lose context. The entire value of timestamped commenting is the anchor.

```
MUST:   Every comment has a non-null anchor with valid type and value
MUST:   Timestamp anchors fall within content duration (0 <= value <= duration)
MUST:   Paragraph anchors reference existing paragraph indices
NEVER:  A comment with anchor.value outside the content's valid range
NEVER:  An anchor type not matching the content's CommentLayer anchorType
```

### V8: Right to Erasure Is Absolute

**Why we care:** Venice Value — user sovereignty. Deletion is non-negotiable, per GDPR Art. 17.

```
MUST:   Citizen can delete any of their own comments at any time
MUST:   Deletion removes the comment body (replaced with "[deleted]")
MUST:   Deletion of account cascades to all comments and reactions
NEVER:  A deleted comment's body retrievable after deletion
NEVER:  A deletion request that fails or is deferred
```

---

## PRIORITY

| Priority | Meaning | If Violated |
|----------|---------|-------------|
| **CRITICAL** | System purpose fails | Unusable |
| **HIGH** | Major value lost | Degraded severely |
| **MEDIUM** | Partial value lost | Works but worse |

---

## INVARIANT INDEX

| ID | Value Protected | Priority |
|----|-----------------|----------|
| V1 | Economic reality of reactions | CRITICAL |
| V2 | Anti-spam budget ceiling | CRITICAL |
| V3 | Economic integrity (no self-dealing) | CRITICAL |
| V4 | Identity transparency | CRITICAL |
| V5 | Self-governed moderation | HIGH |
| V6 | $MIND conservation law | CRITICAL |
| V7 | Contextual anchoring | HIGH |
| V8 | User sovereignty / erasure | CRITICAL |

---

## MARKERS

<!-- @mind:todo Add invariant for rate limiting (max reactions per second) -->
<!-- @mind:proposition V9: Trust score impact — reactions should flow into trust scoring deterministically -->
<!-- @mind:escalation V6 conservation: how to handle rounding errors on 1% fee across thousands of micro-transactions? -->
