# Comments & Reactions — Algorithm: Tab System and Settlement

```
STATUS: DESIGNING
CREATED: 2026-03-11
```

---

## CHAIN

```
OBJECTIVES:      ./OBJECTIVES_Comments.md
BEHAVIORS:       ./BEHAVIORS_Comments.md
PATTERNS:        ./PATTERNS_Comments.md
THIS:            ALGORITHM_Comments.md (you are here)
VALIDATION:      ./VALIDATION_Comments.md
IMPLEMENTATION:  ./IMPLEMENTATION_Comments.md
SYNC:            ./SYNC_Comments.md

IMPL:            components/comments/CommentLayer.tsx
```

> **Contract:** Read docs before modifying. After changes: update IMPL or add TODO to SYNC. Run tests.

---

## OVERVIEW

The Comment & Reaction system operates on a **deferred settlement model** called the Tab System. Reactions are applied instantly in the UI and recorded as ledger entries. At the end of each UBC distribution cycle, all tabs are netted and settled in a single on-chain batch transaction. This eliminates per-reaction wallet signing while preserving economic reality.

---

## OBJECTIVES AND BEHAVIORS

| Objective | Behaviors Supported | Why This Algorithm Matters |
|-----------|---------------------|----------------------------|
| Zero-friction | B1 (instant reaction) | Tab debit is a DB write, not a blockchain tx |
| Anti-spam | B2 (budget ceiling) | Tab ceiling checked before every reaction |
| Creator revenue | B5, B6 (revenue) | Settlement routes $MIND to correct recipients |
| Self-governance | B4 (AI moderation) | AI check runs synchronously before comment insert |

---

## DATA STRUCTURES

### Tab

```
Tab:
  citizen_id:     string        # L4 registered citizen
  date:           string        # YYYY-MM-DD (tab resets daily)
  ubc_allocation: number        # Daily UBC amount in $MIND
  spent:          number        # Sum of all reaction debits today
  earned:         number        # Sum of all reaction credits today (informational, not spendable)
  entries:        TabEntry[]    # Individual reaction records
  settled:        boolean       # True after batch settlement runs
```

### TabEntry

```
TabEntry:
  id:             string        # Unique entry ID
  timestamp:      string        # ISO 8601
  type:           "debit" | "credit"
  amount:         number        # $MIND amount
  reaction_tier:  "spark" | "insight" | "mind_shift" | "venice"
  target_type:    "content" | "comment"
  target_id:      string        # Content or comment ID
  counterparty:   string        # Creator/commenter citizen_id (debit) or reactor citizen_id (credit)
  settled:        boolean       # True after batch settlement
  reversed:       boolean       # True if user removed the reaction same day
```

### Comment

```
Comment:
  id:             string
  citizen_id:     string        # Author (L4 registered)
  content_id:     string        # What content this belongs to
  anchor:
    type:         "timestamp" | "paragraph" | "section"
    value:        string        # "14:32" or "p-3" or "section-values"
  parent_id:      string | null # null = top-level, string = reply
  body:           string        # Comment text (max 2000 chars)
  ai_approved:    boolean       # L1 AI pre-moderation result
  ai_cost:        number        # $MIND compute cost of moderation
  created_at:     string        # ISO 8601
  reactions:                    # Aggregated reaction counts
    spark:        number
    insight:      number
    mind_shift:   number
    venice:       number
  total_mind:     number        # Total $MIND received
```

### Reaction Tiers

```
REACTION_TIERS:
  spark:       { emoji: "🔥", amount: 1,    label: "Spark" }
  insight:     { emoji: "💡", amount: 10,   label: "Insight" }
  mind_shift:  { emoji: "🧠", amount: 100,  label: "Mind Shift" }
  venice:      { emoji: "🏛️", amount: 1000, label: "Venice" }
```

---

## ALGORITHM: React to Content

### Step 1: Validate Eligibility

Check that the user can react: authenticated, registered, not self-reacting, budget remaining.

```
function canReact(citizen_id, target):
  if not authenticated(citizen_id): return REJECT("Not authenticated")
  if not l4_registered(citizen_id): return REJECT("L4 registration required")
  if target.creator_id == citizen_id: return REJECT("Cannot self-react")
  tab = getOrCreateTab(citizen_id, today())
  if tab.spent + reaction.amount > tab.ubc_allocation: return REJECT("Budget exhausted")
  return OK
```

### Step 2: Debit Tab

Instant local operation — no blockchain involved.

```
function debitTab(citizen_id, reaction):
  tab = getOrCreateTab(citizen_id, today())
  entry = TabEntry(
    type="debit",
    amount=reaction.amount,
    target_id=reaction.target_id,
    counterparty=reaction.creator_id
  )
  tab.entries.push(entry)
  tab.spent += reaction.amount
  save(tab)
```

### Step 3: Credit Creator Tab

The recipient sees the credit immediately (informational), but it's not spendable until settlement.

```
function creditTab(creator_id, reaction, reactor_id):
  tab = getOrCreateTab(creator_id, today())
  entry = TabEntry(
    type="credit",
    amount=reaction.amount * 0.99,  # minus 1% protocol fee
    target_id=reaction.target_id,
    counterparty=reactor_id
  )
  tab.entries.push(entry)
  tab.earned += entry.amount
  save(tab)

  # Protocol fee entry
  creditProtocolTreasury(reaction.amount * 0.01)
```

### Step 4: Update Reaction Count

Increment the reaction counter on the target content or comment.

```
function updateReactionCount(target_id, tier):
  target = getTarget(target_id)  # content or comment
  target.reactions[tier] += 1
  target.total_mind += REACTION_TIERS[tier].amount
  save(target)
```

---

## ALGORITHM: Post Comment

### Step 1: AI Pre-Moderation

Comment text is sent to the user's L1 AI agent for review.

```
function moderateComment(citizen_id, body):
  agent = getL1Agent(citizen_id)
  result = agent.moderate(body, checks=["art9", "toxicity", "relevance", "quality"])
  cost = computeCost(body.length)  # ~0.1-0.5 $MIND
  debitTab(citizen_id, {amount: cost, type: "moderation"})
  return { approved: result.approved, reason: result.reason, cost }
```

### Step 2: Insert Comment (if approved)

```
function postComment(citizen_id, content_id, anchor, body, parent_id=null):
  moderation = moderateComment(citizen_id, body)
  if not moderation.approved:
    return { status: "flagged", reason: moderation.reason }

  # Flatten deep nesting: replies to replies become level-1 with @mention
  effective_parent = parent_id
  if parent_id and getComment(parent_id).parent_id:
    effective_parent = getComment(parent_id).parent_id  # flatten to level 1

  comment = Comment(
    citizen_id=citizen_id,
    content_id=content_id,
    anchor=anchor,
    parent_id=effective_parent,
    body=body,
    ai_approved=true,
    ai_cost=moderation.cost
  )
  save(comment)
  return { status: "posted", comment }
```

---

## ALGORITHM: Daily Settlement

### Step 1: Collect All Unsettled Tabs

```
function settleTabs():
  tabs = getAllTabs(date=today(), settled=false)

  # Net per citizen: total debits - total credits
  ledger = {}
  for tab in tabs:
    for entry in tab.entries where not entry.reversed:
      if entry.type == "debit":
        ledger[tab.citizen_id] = (ledger[tab.citizen_id] or 0) - entry.amount
      elif entry.type == "credit":
        ledger[entry.counterparty_target] = ... + entry.amount  # already net of 1%
```

### Step 2: Batch Solana Transaction

```
function batchSettle(ledger):
  instructions = []
  for citizen_id, net_amount in ledger:
    if net_amount < 0:  # net spender
      instructions.push(transfer(from=citizen_wallet, to=protocol_escrow, amount=abs(net_amount)))
    elif net_amount > 0:  # net earner
      instructions.push(transfer(from=protocol_escrow, to=citizen_wallet, amount=net_amount))

  # Single Solana transaction with all instructions
  tx = buildTransaction(instructions)
  sign(tx, protocol_escrow_keypair)
  submit(tx)

  # Mark all tabs as settled
  markSettled(tabs)
```

### Step 3: Adjust UBC Distribution

Alternatively to explicit settlement, the Tab can be netted directly against the next day's UBC distribution:

```
function adjustUBC(citizen_id):
  yesterday_tab = getTab(citizen_id, yesterday())
  net = yesterday_tab.earned - yesterday_tab.spent
  today_ubc = base_ubc_allocation + net  # carry forward
  # If net is negative: user spent more than earned → reduced UBC today
  # If net is positive: user earned more than spent → bonus UBC today
```

---

## KEY DECISIONS

### D1: Tab Ceiling Source

```
IF citizen has staked $MIND (beyond UBC):
    tab_ceiling = ubc_allocation + staked_available_balance
    (power users can react beyond UBC)
ELSE:
    tab_ceiling = ubc_allocation
    (standard users limited to daily UBC)
```

### D2: Same-Day Reversal

```
IF user removes a reaction on the same day (before settlement):
    refund tab, decrement reaction count
    (reversible — tab hasn't settled yet)
ELSE (after settlement):
    no refund — the on-chain tx already executed
    (user can remove the display, but $MIND is transferred)
```

### D3: AI Moderation Failure

```
IF L1 AI agent is unreachable after 5s timeout:
    hold comment in "pending" state
    retry up to 3 times with backoff
    (never post without AI review)
IF still unreachable:
    show "Your AI is offline — comment saved as draft"
    (user can retry later)
```

---

## DATA FLOW

```
User clicks 🔥 on comment
    ↓
canReact() validates eligibility + budget
    ↓
debitTab() writes TabEntry (DB only)
    ↓
creditTab() writes TabEntry for recipient
    ↓
updateReactionCount() increments counters
    ↓
UI updates instantly (optimistic)
    ↓
... (end of day) ...
    ↓
settleTabs() collects all unsettled entries
    ↓
batchSettle() builds single Solana tx
    ↓
Tabs marked settled, UBC adjusted
```

---

## COMPLEXITY

**Time (per reaction):** O(1) — single DB write + counter increment

**Time (daily settlement):** O(n) where n = total unsettled entries across all users

**Space:** O(u * r) where u = active users, r = avg reactions per user per day

**Bottlenecks:**
- Settlement batch size: Solana transaction size limit (~1232 bytes). May need multiple txs if >100 users settle same day.
- AI moderation latency: ~1-3s per comment. Async but blocking on the comment flow.

---

## HELPER FUNCTIONS

### `getOrCreateTab(citizen_id, date)`

**Purpose:** Retrieve or initialize a citizen's daily tab.

**Logic:** Look up tab by (citizen_id, date). If not found, create with ubc_allocation from UBC system, spent=0, earned=0.

### `computeCost(body_length)`

**Purpose:** Calculate AI moderation compute cost in $MIND.

**Logic:** Base cost 0.1 $MIND + 0.001 per character over 200 chars. Cap at 0.5 $MIND.

### `creditProtocolTreasury(amount)`

**Purpose:** Record the 1% protocol fee from each reaction.

**Logic:** Append to protocol treasury tab. Settled in same batch transaction.

---

## INTERACTIONS

| Module | What We Call | What We Get |
|--------|--------------|-------------|
| `lib/auth.ts` | `requireSession()` | Authenticated citizen_id |
| L4 Registry | `getCitizen(id)` | Citizen record + trust level |
| L1 AI Agent | `agent.moderate(text)` | Approval/rejection + reason |
| UBC System | `getAllocation(citizen_id)` | Daily $MIND allocation |
| Solana RPC | `sendTransaction(tx)` | Settlement confirmation |

---

## MARKERS

<!-- @mind:todo Define exact Solana transaction batching strategy for >100 users -->
<!-- @mind:proposition Consider "reaction pools" where multiple users contribute to a single large reaction -->
<!-- @mind:escalation Settlement timing: end-of-day UTC? Or rolling 24h from user's first reaction? -->
