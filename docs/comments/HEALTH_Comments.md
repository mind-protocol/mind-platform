# Comments & Reactions — Health: Runtime Verification

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
ALGORITHM:       ./ALGORITHM_Comments.md
VALIDATION:      ./VALIDATION_Comments.md
IMPLEMENTATION:  ./IMPLEMENTATION_Comments.md
THIS:            HEALTH_Comments.md (you are here)
SYNC:            ./SYNC_Comments.md

IMPL:            components/comments/CommentLayer.tsx
```

---

## WHEN TO USE HEALTH (VS TESTS)

- **Tests** verify behavior at build time: "does canReact() reject self-reactions?"
- **Health** verifies invariants at runtime: "are all tabs balanced right now?"

Health checks run periodically (cron) or on-demand to catch drift between expected and actual state.

---

## FLOWS ANALYSIS

| Flow | Trigger | Frequency | Risk |
|------|---------|-----------|------|
| Reaction | User click | High (100s/day) | Budget exceeded, self-deal |
| Comment | User submit | Medium (10s/day) | AI bypass, unanchored |
| Settlement | Daily cron | 1/day | Conservation violation, failed tx |
| Erasure | User delete | Low | Incomplete deletion |

---

## HEALTH INDICATORS

### H1: Tab Conservation

**Value:** $MIND in the system is always conserved. Debits = Credits + Fees.

**Check:** `SELECT SUM(amount) FROM tab_entries WHERE type='debit' AND date=today()` vs `SELECT SUM(amount) FROM tab_entries WHERE type='credit' AND date=today()` + `SUM(protocol_fees)`

**Signal:** FAIL if abs(debits - credits - fees) > 0.001

**Frequency:** Every hour + before settlement

### H2: Budget Integrity

**Value:** No tab has spent more than its allocation.

**Check:** `SELECT citizen_id FROM tabs WHERE spent > ubc_allocation AND date=today()`

**Signal:** FAIL if any results returned. CRITICAL — means validation bypassed.

**Frequency:** Every 15 minutes

### H3: Self-Reaction Absence

**Value:** No citizen has reacted to their own content.

**Check:** Join reactions with content/comments, check reactor_id != creator_id.

**Signal:** FAIL if any self-reactions found. CRITICAL.

**Frequency:** Every hour

### H4: AI Moderation Coverage

**Value:** Every posted comment has been AI-reviewed.

**Check:** `SELECT id FROM comments WHERE ai_approved IS NULL OR ai_approved = false`

**Signal:** FAIL if any unreviewed posted comments exist.

**Frequency:** Every 30 minutes

### H5: Settlement Success

**Value:** Daily settlement completed without errors.

**Check:** After settlement cron: verify all tabs for yesterday are marked settled. Verify Solana tx confirmed.

**Signal:** WARN if settlement pending >2h past schedule. FAIL if >6h.

**Frequency:** After each settlement run

### H6: Anchor Validity

**Value:** All comments reference valid positions in their content.

**Check:** For timestamp anchors: verify value < content duration. For paragraph anchors: verify index exists.

**Signal:** WARN if invalid anchors found (data migration issue, not security).

**Frequency:** Daily

---

## CHECKER INDEX

| ID | Indicator | Priority | Frequency | Auto-Remediate? |
|----|-----------|----------|-----------|-----------------|
| H1 | Tab Conservation | CRITICAL | 1h | No — alert + halt settlement |
| H2 | Budget Integrity | CRITICAL | 15m | No — alert + investigate |
| H3 | Self-Reaction | CRITICAL | 1h | Yes — auto-remove + alert |
| H4 | AI Moderation | HIGH | 30m | Yes — quarantine unreviewed |
| H5 | Settlement Success | HIGH | Post-settlement | No — retry once, then alert |
| H6 | Anchor Validity | MEDIUM | Daily | No — log for cleanup |

---

## MANUAL RUN

```bash
# Run all health checks
curl -X POST https://mindprotocol.ai/api/comments/health

# Run specific check
curl -X POST https://mindprotocol.ai/api/comments/health?check=conservation
curl -X POST https://mindprotocol.ai/api/comments/health?check=budget
curl -X POST https://mindprotocol.ai/api/comments/health?check=settlement
```

---

## MARKERS

<!-- @mind:todo Implement health check API route -->
<!-- @mind:proposition Expose health metrics on /api/health for monitoring dashboard -->
<!-- @mind:escalation H1 conservation check: floating point precision across thousands of 1% fee calculations -->
