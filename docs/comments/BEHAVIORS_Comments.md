# Comments & Reactions — Behaviors: Observable Effects

```
STATUS: DESIGNING
CREATED: 2026-03-11
```

---

## CHAIN

```
OBJECTIVES:      ./OBJECTIVES_Comments.md
PATTERNS:        ./PATTERNS_Comments.md
THIS:            BEHAVIORS_Comments.md (you are here)
ALGORITHM:       ./ALGORITHM_Comments.md
VALIDATION:      ./VALIDATION_Comments.md
IMPLEMENTATION:  ./IMPLEMENTATION_Comments.md
SYNC:            ./SYNC_Comments.md

IMPL:            components/comments/CommentLayer.tsx
```

> **Contract:** Read docs before modifying. After changes: update IMPL or add TODO to SYNC. Run tests.

---

## BEHAVIORS

### B1: Reaction Applies Instantly

**Why:** Zero-friction engagement. If the user has to confirm or sign, they won't bother. Micro-reactions must feel like tapping a button, not executing a financial transaction.

```
GIVEN:  Citizen is authenticated with daily tab budget remaining
WHEN:   Citizen clicks a reaction tier (🔥/💡/🧠/🏛️) on content or comment
THEN:   Reaction appears immediately on the target
AND:    Tab is debited by the reaction amount
AND:    Remaining daily budget display updates
```

### B2: Budget Ceiling Enforced

**Why:** Natural anti-spam. Your daily UBC allocation is your attention budget. You can't react beyond what you can afford.

```
GIVEN:  Citizen's daily tab equals or exceeds their UBC allocation
WHEN:   Citizen attempts to react
THEN:   Reaction buttons are greyed out
AND:    Tooltip shows "Daily budget reached — resets tomorrow"
AND:    Commenting still works (comments are free to post, cost only AI moderation compute)
```

### B3: Comment Anchors to Content Position

**Why:** Context preservation. A comment about "what she said at minute 14" should be *at* minute 14, not floating in a generic thread.

```
GIVEN:  Citizen is viewing content with a CommentLayer
WHEN:   Citizen clicks to comment on audio at timestamp 14:32
THEN:   Comment is stored with anchor {type: "timestamp", value: "14:32"}
AND:    Comment marker appears on the waveform/timeline at 14:32
AND:    During playback, comment surfaces when playhead reaches 14:32
```

### B4: AI Pre-Moderates Before Post

**Why:** Self-governance. No central moderator. The user's own AI is their editor and quality gate.

```
GIVEN:  Citizen writes a comment and clicks "Post"
WHEN:   Comment text is sent to the citizen's L1 AI agent
THEN:   AI checks: Art. 9 firewall, toxicity, relevance, minimum quality
AND:    If approved: comment posts immediately
AND:    If flagged: UI shows "Your AI suggests revising" with reason
AND:    Compute cost is deducted from the user's daily tab
```

### B5: Creator Receives Reaction Revenue

**Why:** Value flows to value. Content creators and quality commenters earn $MIND from the community's attention.

```
GIVEN:  A reaction is applied to content (talk, blog post, etc.)
WHEN:   Daily settlement runs
THEN:   Reaction amount minus 1% protocol fee is credited to the content creator's tab
AND:    Protocol treasury receives the 1% fee
```

### B6: Commenter Receives Reaction Revenue

**Why:** Good commentary is valuable too. Rewarding quality comments incentivizes thoughtful discussion.

```
GIVEN:  A reaction is applied to a comment
WHEN:   Daily settlement runs
THEN:   Reaction amount minus 1% protocol fee is credited to the comment author's tab
AND:    Protocol treasury receives the 1% fee
```

### B7: Comments Thread With 2-Level Depth

**Why:** Enables direct responses without infinite nesting complexity. Deep threads become unreadable.

```
GIVEN:  A top-level comment exists
WHEN:   Citizen replies to it
THEN:   Reply appears nested under the parent comment (level 1)
AND:    Replies to replies appear at level 1 (flattened, tagged with @mention)
AND:    No deeper nesting is created
```

### B8: Heatmap Shows Engagement Density

**Why:** Reveals where the community's attention concentrates. For audio: which moments sparked the most discussion. For articles: which paragraphs resonated.

```
GIVEN:  Content has multiple anchored comments and reactions
WHEN:   User views the content
THEN:   A heatmap overlay shows density of reactions across the content timeline/body
AND:    "Hot moments" (top 3 clusters) are highlighted with reaction totals
```

---

## OBJECTIVES SERVED

| Behavior ID | Objective | Why It Matters |
|-------------|-----------|----------------|
| B1 | Zero-friction micro-transactions | Instant feel eliminates the "cost" of engaging |
| B2 | Attention has a price | Budget ceiling makes each reaction a conscious choice |
| B3 | Content-anchored discussion | Context preserved, discussion is meaningful |
| B4 | Self-governed moderation | No central authority, user pays for quality |
| B5, B6 | Economic signal | Creators and commenters earn from quality |
| B7 | Platform-wide primitive | Simple threading scales across all content types |
| B8 | Economic signal | Aggregate heatmap reveals community values |

---

## INPUTS / OUTPUTS

### Primary Function: `<CommentLayer />`

**Inputs:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `contentId` | string | Unique identifier for the content (e.g., "talks/debate-persistent-ai-en") |
| `anchorType` | "timestamp" \| "paragraph" \| "section" | How comments attach to content |
| `creatorId` | string | Citizen ID of the content creator (for reaction routing) |
| `contentDuration?` | number | Duration in seconds (for timestamp anchor type) |

**Outputs:**

| Return | Type | Description |
|--------|------|-------------|
| React component | JSX.Element | Full comment/reaction UI anchored to content |

**Side Effects:**

- Writes comments to database (FalkorDB or Supabase)
- Debits user's daily tab on reaction
- Credits creator/commenter tab on reaction
- Calls L1 AI agent for comment pre-moderation

---

## EDGE CASES

### E1: User Reacts Then Deletes Same Day

```
GIVEN:  User reacted 10 $MIND on a comment earlier today (unsettled)
WHEN:   User clicks to remove the reaction
THEN:   Tab is refunded 10 $MIND (unsettled debits are reversible)
AND:    Reaction is removed from display
```

### E2: User Reacts After Budget Exhausted by Incoming Reactions

```
GIVEN:  User spent 100 $MIND (full budget) but then received 50 $MIND in reactions
WHEN:   User attempts to react again
THEN:   Reaction is still blocked — incoming reactions don't increase daily spend ceiling
AND:    Incoming reactions are credited at settlement, not intraday
```

### E3: AI Moderation Service Unavailable

```
GIVEN:  User's L1 AI agent is unreachable
WHEN:   User attempts to post a comment
THEN:   Comment is held in "pending" state with message: "Waiting for your AI — try again shortly"
AND:    Comment is NOT posted without AI review
```

### E4: Content Creator Account Deleted

```
GIVEN:  Content exists but creator has exercised Right to Erasure
WHEN:   Reactions accumulate on the content
THEN:   Reactions credit the protocol treasury instead of the deleted account
AND:    Content attribution shows "[deleted citizen]"
```

---

## ANTI-BEHAVIORS

### A1: Reaction Spam

```
GIVEN:   User has budget remaining
WHEN:    User attempts to react 50 times in 10 seconds
MUST NOT: Allow all 50 reactions through instantly
INSTEAD:  Rate limit to max 1 reaction per second per user (client-side debounce + server validation)
```

### A2: Self-Reaction

```
GIVEN:   User views their own content or comment
WHEN:    User attempts to react to their own content
MUST NOT: Allow self-reactions (economic self-dealing)
INSTEAD:  Reaction buttons are hidden on own content. If attempted via API: reject with 403.
```

### A3: Wallet Popup on Reaction

```
GIVEN:   User clicks a reaction button
WHEN:    The reaction is processed
MUST NOT: Trigger any wallet signing dialog, browser extension popup, or confirmation modal
INSTEAD:  Tab is debited silently. Settlement happens later without user interaction.
```

### A4: Unregistered Participation

```
GIVEN:   Visitor is not authenticated as an L4-registered citizen
WHEN:    Visitor attempts to comment or react
MUST NOT: Allow any participation
INSTEAD:  Show: "Register as a citizen to join the conversation" with link to /register
```

---

## MARKERS

<!-- @mind:todo Define rate limit params (reactions/second, reactions/minute) -->
<!-- @mind:proposition Future: "Reaction streaks" — consecutive days of reacting earns bonus UBC -->
<!-- @mind:escalation Should AI moderation overrides affect trust score immediately or only after pattern detection? -->
