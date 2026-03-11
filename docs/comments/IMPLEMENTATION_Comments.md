# Comments & Reactions — Implementation: Code Architecture and Structure

```
STATUS: DRAFT
CREATED: 2026-03-11
```

---

## CHAIN

```
OBJECTIVES:      ./OBJECTIVES_Comments.md
BEHAVIORS:       ./BEHAVIORS_Comments.md
PATTERNS:        ./PATTERNS_Comments.md
ALGORITHM:       ./ALGORITHM_Comments.md
VALIDATION:      ./VALIDATION_Comments.md
THIS:            IMPLEMENTATION_Comments.md (you are here)
SYNC:            ./SYNC_Comments.md

IMPL:            components/comments/CommentLayer.tsx
```

> **Contract:** Read docs before modifying. After changes: update IMPL or add TODO to SYNC. Run tests.

---

## CODE STRUCTURE

```
components/comments/              # Client-side comment system
├── CommentLayer.tsx              # Main component (mounts on any content page)
├── CommentThread.tsx             # Threaded comment display (2-level max)
├── CommentInput.tsx              # Comment editor with AI moderation status
├── ReactionBar.tsx               # 4-tier reaction buttons with budget display
├── AnchorMarker.tsx              # Visual marker on waveform/timeline/paragraph
├── HeatmapOverlay.tsx            # Engagement density visualization
├── TabBudget.tsx                 # Daily budget indicator (remaining/total)
└── types.ts                      # Shared TypeScript types

lib/comments/                     # Server-side logic
├── tab.ts                        # Tab system: create, debit, credit, ceiling check
├── settlement.ts                 # Daily batch settlement + Solana tx builder
├── moderation.ts                 # L1 AI agent moderation bridge
└── reactions.ts                  # Reaction CRUD + counter updates

app/api/comments/                 # API routes
├── route.ts                      # GET (list), POST (create comment)
├── [id]/route.ts                 # GET (single), DELETE (erasure)
├── [id]/react/route.ts           # POST (add reaction), DELETE (remove reaction)
└── settlement/route.ts           # POST (trigger daily settlement — cron)

stores/
└── comments.ts                   # Zustand store for client-side comment state
```

### File Responsibilities

| File | Purpose | Key Functions/Classes | Lines | Status |
|------|---------|----------------------|-------|--------|
| `CommentLayer.tsx` | Mount point for any content page | `<CommentLayer>` | ~200 | OK |
| `ReactionBar.tsx` | 4 reaction buttons + budget | `<ReactionBar>`, `useReact()` | ~150 | OK |
| `CommentThread.tsx` | Nested comments (2 levels) | `<CommentThread>` | ~180 | OK |
| `CommentInput.tsx` | Text input + AI moderation UX | `<CommentInput>`, `useModerate()` | ~200 | OK |
| `lib/comments/tab.ts` | Tab CRUD + budget enforcement | `getTab()`, `debit()`, `credit()` | ~150 | OK |
| `lib/comments/settlement.ts` | Batch Solana settlement | `settleTabs()`, `buildBatch()` | ~200 | OK |
| `app/api/comments/route.ts` | REST endpoint for comments | `GET`, `POST` handlers | ~150 | OK |

---

## DESIGN PATTERNS

### Architecture Pattern

**Pattern:** Optimistic UI + Deferred Settlement

**Why this pattern:** Reactions must feel instant (optimistic UI update), but economic settlement is batched (deferred to daily cycle). This separates UX concerns from financial concerns.

### Code Patterns in Use

| Pattern | Applied To | Purpose |
|---------|------------|---------|
| Optimistic Update | `ReactionBar.tsx` | Show reaction immediately, reconcile on server response |
| Zustand Store | `stores/comments.ts` | Client-side state for comments, reactions, tab budget |
| API Route Handlers | `app/api/comments/` | Next.js App Router API for CRUD operations |
| Cron Job | `settlement/route.ts` | Daily settlement triggered by external cron (Render/Vercel) |

### Anti-Patterns to Avoid

- **Per-reaction blockchain tx**: Never sign a Solana transaction for a single reaction. Always batch.
- **Client-side-only validation**: Always validate budget/auth/self-react server-side. Client checks are UX optimization only.
- **God Component**: CommentLayer orchestrates, but delegates to sub-components. Don't let it grow beyond 300 lines.

### Boundaries

| Boundary | Inside | Outside | Interface |
|----------|--------|---------|-----------|
| CommentLayer | All comment/reaction UI | Content page layout | `<CommentLayer contentId anchorType creatorId />` |
| Tab System | Budget tracking, debit/credit | Solana settlement | `tab.ts` functions |
| Settlement | Batch tx building | Individual reactions | `settlement.ts` cron |

---

## SCHEMA

### Comment (Database)

```yaml
Comment:
  required:
    - id: string                # UUID
    - citizen_id: string        # L4 registered author
    - content_id: string        # Target content identifier
    - anchor_type: string       # "timestamp" | "paragraph" | "section"
    - anchor_value: string      # "14:32" | "p-3" | "section-values"
    - body: string              # Comment text (max 2000 chars)
    - ai_approved: boolean      # L1 AI pre-moderation result
    - created_at: string        # ISO 8601
  optional:
    - parent_id: string         # null for top-level
    - ai_cost: number           # Moderation compute cost
    - reactions_spark: number   # Count of 🔥 reactions
    - reactions_insight: number # Count of 💡 reactions
    - reactions_mind_shift: number  # Count of 🧠 reactions
    - reactions_venice: number  # Count of 🏛️ reactions
    - total_mind: number        # Total $MIND received
  constraints:
    - body.length <= 2000
    - anchor_value must be valid for anchor_type
    - parent depth <= 1 (2-level max threading)
```

### Tab (Database)

```yaml
Tab:
  required:
    - citizen_id: string
    - date: string              # YYYY-MM-DD
    - ubc_allocation: number    # Daily ceiling
    - spent: number             # Running total of debits
    - earned: number            # Running total of credits (informational)
    - settled: boolean          # True after batch settlement
  relationships:
    - entries: TabEntry[]
```

### TabEntry (Database)

```yaml
TabEntry:
  required:
    - id: string
    - tab_id: string            # Parent tab
    - timestamp: string         # ISO 8601
    - type: string              # "debit" | "credit" | "moderation"
    - amount: number            # $MIND amount
    - target_id: string         # Content or comment ID
    - counterparty: string      # Other citizen_id
  optional:
    - reaction_tier: string     # "spark" | "insight" | "mind_shift" | "venice"
    - reversed: boolean         # Same-day reversal
    - settled: boolean
```

---

## ENTRY POINTS

| Entry Point | File:Line | Triggered By |
|-------------|-----------|--------------|
| CommentLayer mount | `CommentLayer.tsx:1` | Any content page rendering |
| POST /api/comments | `app/api/comments/route.ts` | User submits comment |
| POST /api/comments/[id]/react | `app/api/comments/[id]/react/route.ts` | User clicks reaction |
| POST /api/comments/settlement | `app/api/comments/settlement/route.ts` | Daily cron job |
| DELETE /api/comments/[id] | `app/api/comments/[id]/route.ts` | User deletes comment |

---

## DATA FLOW AND DOCKING (FLOW-BY-FLOW)

### Reaction Flow: User Reacts to Content

The most critical flow — transforms a click into an economic signal.

```yaml
flow:
  name: reaction_flow
  purpose: Process a micro-reaction from click to tab debit
  scope: Client click → API → DB → UI update
  steps:
    - id: click
      description: User clicks reaction tier button
      file: components/comments/ReactionBar.tsx
      function: handleReact()
      input: { tier: string, targetId: string }
      output: optimistic UI update
      trigger: onClick event
      side_effects: Zustand store update (optimistic)
    - id: api_call
      description: POST to reaction endpoint
      file: app/api/comments/[id]/react/route.ts
      function: POST handler
      input: { tier, targetId, citizenId (from session) }
      output: { success, newBudget }
      trigger: fetch from client
      side_effects: DB writes (tab debit, reaction count, creator credit)
    - id: validate
      description: Server-side validation (auth, budget, self-react)
      file: lib/comments/tab.ts
      function: canReact(), debit()
      input: { citizenId, amount }
      output: { allowed: boolean }
      trigger: API handler
      side_effects: Tab entry created
    - id: reconcile
      description: Client reconciles optimistic update with server response
      file: stores/comments.ts
      function: reconcileReaction()
      input: API response
      output: Final UI state
      trigger: API response callback
      side_effects: Revert if server rejected
```

### Comment Flow: User Posts Comment

```yaml
flow:
  name: comment_flow
  purpose: Post a comment with AI pre-moderation
  steps:
    - id: submit
      description: User clicks Post
      file: components/comments/CommentInput.tsx
      function: handleSubmit()
      input: { body, anchor, parentId? }
      output: Loading state
      trigger: form submit
    - id: moderate
      description: AI pre-moderation
      file: lib/comments/moderation.ts
      function: moderate()
      input: { citizenId, body }
      output: { approved, reason?, cost }
      trigger: API handler before insert
      side_effects: Tab debit for moderation compute
    - id: insert
      description: Store comment (if approved)
      file: app/api/comments/route.ts
      function: POST handler
      input: Validated comment data
      output: Stored comment with ID
      trigger: Moderation approval
      side_effects: DB write
```

---

## STATE MANAGEMENT

### Where State Lives

| State | Location | Scope | Lifecycle |
|-------|----------|-------|-----------|
| Comments list | `stores/comments.ts` | Per-content page | Fetched on mount, cleared on unmount |
| Tab budget | `stores/comments.ts` | Global (user session) | Fetched on auth, updated on reaction |
| Reaction counts | `stores/comments.ts` | Per-comment | Optimistic update, reconciled with server |
| Settlement state | `lib/comments/settlement.ts` | Server only | Daily cron cycle |

### State Transitions

```
IDLE ──(user reacts)──▶ OPTIMISTIC ──(server confirms)──▶ CONFIRMED
                                    ──(server rejects)──▶ REVERTED
```

---

## CONFIGURATION

| Config | Location | Default | Description |
|--------|----------|---------|-------------|
| `COMMENT_MAX_LENGTH` | `lib/comments/types.ts` | 2000 | Max comment body characters |
| `MAX_THREAD_DEPTH` | `lib/comments/types.ts` | 1 | Max nesting depth (0=flat, 1=two-level) |
| `REACTION_RATE_LIMIT` | `app/api/comments/[id]/react/route.ts` | 1/sec | Max reactions per second per user |
| `AI_MODERATION_TIMEOUT` | `lib/comments/moderation.ts` | 5000 | Timeout for L1 AI agent (ms) |
| `SETTLEMENT_CRON` | Vercel/Render cron | `0 0 * * *` | Daily at midnight UTC |
| `PROTOCOL_FEE_BPS` | `lib/comments/tab.ts` | 100 | Protocol fee in basis points (100 = 1%) |

---

## EXTERNAL DEPENDENCIES

| Package | Used For | Imported By |
|---------|----------|-------------|
| `@solana/web3.js` | Batch settlement transactions | `lib/comments/settlement.ts` |
| `@solana/spl-token` | $MIND token transfers | `lib/comments/settlement.ts` |
| `zustand` | Client-side state management | `stores/comments.ts` |

---

## MARKERS

<!-- @mind:todo Choose database: FalkorDB (graph, existing) vs Supabase (relational, new dep) vs SQLite (simple) -->
<!-- @mind:todo Design the AI moderation bridge — how does the platform call a user's L1 agent? -->
<!-- @mind:proposition Consider WebSocket for real-time comment updates (new comments appear live) -->
<!-- @mind:escalation Settlement cron: Vercel cron (max 1/day on free tier) or Render cron? -->
