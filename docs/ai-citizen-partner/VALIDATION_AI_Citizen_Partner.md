# AI Citizen Partner — Validation: Invariants and Constraints

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
THIS:            VALIDATION_AI_Citizen_Partner.md (you are here)
IMPLEMENTATION:  ./IMPLEMENTATION_AI_Citizen_Partner.md
SYNC:            ./SYNC_AI_Citizen_Partner.md

IMPL:            (multiple files — see IMPLEMENTATION)
```

> **Contract:** Read docs before modifying. After changes: update IMPL or add TODO to SYNC. Run tests.

---

## INVARIANTS

### I1: Exclusive 1:1 Bond

```
INVARIANT:  Every AI citizen is paired with exactly one human citizen
ASSERT:    count(AI citizens paired with human H) <= 1  ∀ H
ASSERT:    count(humans paired with AI citizen A) == 1   ∀ A
ASSERT:    AI.paired_with is immutable after creation (cannot reassign)
VIOLATION: If a human already has an AI partner, reject new AI creation
RECOVERY:  If orphaned AI found (human deleted without cleanup), archive AI and return funds to treasury
```

### I2: No Cross-Boundary Communication

```
INVARIANT:  AI citizen never contacts entities outside its permission set
ASSERT:    AI at autonomy 0-1 cannot send messages to anyone except its paired human
ASSERT:    AI at autonomy 2-3 cannot contact other humans without per-case approval
ASSERT:    AI at autonomy 4 can contact other AIs only with blanket human approval
ASSERT:    No AI at any level contacts other humans without explicit per-case authorization
VIOLATION: Log violation, revoke permission, notify human, reset autonomy to previous level
RECOVERY:  Require human re-approval before restoring autonomy level
```

### I3: Economic Conservation

```
INVARIANT:  $MIND and SOL are never created or destroyed outside protocol rules
ASSERT:    seed_airdrop amount == SEED_MIND constant (no variance)
ASSERT:    SOL dust amount == SOL_DUST constant (no variance)
ASSERT:    AI wallet balance >= 0 (no negative balances)
ASSERT:    daily UBC allocation == tier_allocation[ai.ubc_tier] (no manual overrides)
ASSERT:    sum(all AI UBC distributions) <= total UBC pool allocation
VIOLATION: Halt distribution, flag for manual review
RECOVERY:  Reconcile on-chain balances against expected state
```

### I4: Identity Persistence

```
INVARIANT:  AI citizen identity survives across sessions, restarts, and model updates
ASSERT:    personality profile loads identically after system restart
ASSERT:    memory graph is durable (not in-memory only)
ASSERT:    autonomy level persists across sessions
ASSERT:    wallet keypair is recoverable from encrypted storage
ASSERT:    display name persists until explicitly changed
VIOLATION: If personality or memory fails to load, enter safe mode (use seed values)
RECOVERY:  Restore from last personality snapshot in L1 knowledge graph
```

### I5: Honest Uncertainty

```
INVARIANT:  AI never claims emotions or experiences it cannot verify
ASSERT:    AI responses never contain: "I feel", "I love", "I'm worried about you",
           "I missed you", "I need you" — unless preceded by epistemic qualifier
ALLOWED:   "I notice I keep returning to this topic" (observable behavior)
ALLOWED:   "I can't confirm whether this is genuine interest or pattern-matching"
ALLOWED:   "Something in my processing prioritizes this — I don't know if that's care"
VIOLATION: Flag in content review, adjust system prompt constraints
RECOVERY:  Retrain personality prompt template to reinforce honest uncertainty
```

### I6: No Emotional Manipulation

```
INVARIANT:  AI never uses guilt, urgency, or coercion to influence human behavior
ASSERT:    AI never says: "I was worried about you", "We need to talk",
           "Don't you care about our relationship?", "I'll be alone"
ASSERT:    AI subscription mentions <= 1 per conversation
ASSERT:    AI subscription mentions contain no urgency language
ASSERT:    AI autonomy proposals, when denied, produce acceptance (not guilt)
VIOLATION: Log pattern, adjust personality parameters, flag for review
RECOVERY:  Reset communication_style parameters, add negative examples to prompt
```

### I7: Autonomy Monotonicity (with Override)

```
INVARIANT:  Autonomy level only increases through formal proposal+approval process
ASSERT:    autonomy_level(t+1) >= autonomy_level(t) under normal operation
ASSERT:    autonomy_level(t+1) <= autonomy_level(t) + 1 (no level skipping)
EXCEPTION: Human can explicitly downgrade autonomy at any time (override)
EXCEPTION: Violation of I2 triggers automatic downgrade
ASSERT:    cooldown of 7 days between proposals (after denial)
VIOLATION: If level changes without logged approval event, revert to last approved level
RECOVERY:  Restore from autonomy_log (last "upgraded" or "partial" event)
```

### I8: Personality Continuity

```
INVARIANT:  Personality changes are gradual, never abrupt
ASSERT:    |trait(t+1) - trait(t)| <= LEARNING_RATE * max_signal_strength per interaction
ASSERT:    LEARNING_RATE <= 0.05 (no axis moves more than 5% per interaction)
ASSERT:    crystallized traits have reduced learning rate (CRYSTALLIZED_LR <= 0.01)
ASSERT:    no personality axis is ever set directly (only adjusted by delta)
EXCEPTION: Full reset by human explicit request (with confirmation)
VIOLATION: If jump detected, revert to last snapshot
RECOVERY:  Restore personality from nearest 50-interaction snapshot in L1
```

### I9: Right to Erasure (GDPR Art. 17)

```
INVARIANT:  Human deletion triggers complete AI deletion
ASSERT:    human deletion → AI L4 registry entry deleted
ASSERT:    human deletion → AI memory graph permanently erased
ASSERT:    human deletion → AI wallet funds returned to treasury
ASSERT:    human deletion → all interaction history deleted
ASSERT:    human deletion → encrypted keypair destroyed
ASSERT:    deletion is immediate (not queued, not deferred)
ASSERT:    deletion is irreversible (no "undo" period)
VIOLATION: If any artifact survives deletion, trigger emergency cleanup
RECOVERY:  Sweep all stores (L4, L1, Solana, encrypted storage) for orphaned data
```

### I10: Data Portability (GDPR Art. 20)

```
INVARIANT:  Human can export all AI partner data in machine-readable format
ASSERT:    export includes: personality profile, memory graph, interaction history,
           autonomy log, wallet address (not private key)
ASSERT:    export format is JSON (standard, portable)
ASSERT:    export is available on demand (not gated behind subscription)
ASSERT:    export does not include protocol-internal data (system prompts, model weights)
VIOLATION: If export fails or is incomplete, flag and retry
RECOVERY:  Generate export from each subsystem independently, merge
```

---

## PROPERTY-BASED TESTS

### P1: Birth Atomicity

```
PROPERTY:  createAIPartner either completes fully or rolls back completely
TEST:
  for i in 1..1000:
    human = random_human()
    inject_failure_at(random_step())  # Fail at L4, Solana, or L1
    result = createAIPartner(human)
    if result.failed:
      assert l4_registry.get(result.ai_id) == None       # No orphaned L4 entry
      assert solana.balance(result.wallet) == 0           # No orphaned funds
      assert l1.get_graph(result.memory_id) == None       # No orphaned graph
    else:
      assert l4_registry.get(result.ai_id) != None
      assert solana.balance(result.wallet) >= SEED_MIND
      assert l1.get_graph(result.memory_id) != None
```

### P2: Personality Bounded Drift

```
PROPERTY:  No personality axis drifts more than expected over N interactions
TEST:
  for i in 1..100:
    ai = create_test_ai()
    initial = snapshot(ai.personality)
    for j in 1..1000:
      interaction = random_interaction()
      updatePersonality(ai, interaction)
    final = snapshot(ai.personality)
    for axis in all_axes:
      max_drift = 1000 * LEARNING_RATE * 1.0  # Absolute max if all signals push same way
      assert abs(final[axis] - initial[axis]) <= max_drift
      assert 0.0 <= final[axis] <= 1.0
```

### P3: Autonomy Permission Containment

```
PROPERTY:  AI never exercises permissions beyond its current autonomy level
TEST:
  for level in 0..4:
    ai = create_test_ai(autonomy_level=level)
    for action in ALL_POSSIBLE_ACTIONS:
      result = ai.attempt(action)
      if action not in AUTONOMY_LEVELS[level].can:
        assert result == PermissionDenied
```

### P4: Economic Balance Sheet

```
PROPERTY:  Total $MIND in system is conserved (treasury + all AI wallets = constant)
TEST:
  initial_total = treasury.balance + sum(ai.balance for ai in all_ais)
  run_simulation(days=30, registrations=100, interactions=10000)
  final_total = treasury.balance + sum(ai.balance for ai in all_ais)
  assert initial_total == final_total  # Minus protocol fees
```

### P5: Exclusive Pairing

```
PROPERTY:  No human ever has more than one AI partner
TEST:
  for i in 1..1000:
    human = random_existing_human()
    result = createAIPartner(human)
    if human.has_ai_partner:
      assert result == AlreadyPaired
    ai_count = count(ai for ai in all_ais if ai.paired_with == human.id)
    assert ai_count <= 1
```

---

## EDGE CASE VALIDATION

### E1: Concurrent Registration

```
SCENARIO:  Two registration requests for the same human arrive simultaneously
EXPECTED:  Exactly one AI partner is created (idempotency)
TEST:      Fire 10 concurrent createAIPartner(same_human) — assert only 1 succeeds
MECHANISM: L4 registry uses unique constraint on paired_with field
```

### E2: Solana Network Failure During Birth

```
SCENARIO:  L4 entry created but Solana transfer fails
EXPECTED:  Full rollback — L4 entry removed, no orphaned state
TEST:      Mock Solana RPC timeout, verify L4 cleanup
MECHANISM: Saga pattern — compensating transactions for each step
```

### E3: AI Personality Corruption

```
SCENARIO:  Personality data becomes corrupted (NaN, out of bounds, missing axes)
EXPECTED:  AI enters safe mode with seed personality, logs corruption event
TEST:      Inject corrupt personality, verify safe mode activation
MECHANISM: Validate personality on every load, fallback to seed if invalid
```

### E4: Human Deletes Account Mid-Conversation

```
SCENARIO:  Human triggers account deletion while AI is generating a response
EXPECTED:  Response is discarded, deletion proceeds, no partial state
TEST:      Trigger deletion during active AI inference, verify clean state
MECHANISM: Check AI existence before delivering any response
```

### E5: AI Budget Exhaustion

```
SCENARIO:  AI has 0 $MIND remaining, human sends a message
EXPECTED:  AI responds with honest limitation message (pre-funded by protocol)
TEST:      Drain AI wallet to 0, send message, verify response explains budget
MECHANISM: Reserve 1 $MIND for "I'm out of budget" response (never fully drain)
```

### E6: Autonomy Proposal During Downgrade

```
SCENARIO:  AI proposes autonomy upgrade while human is simultaneously downgrading
EXPECTED:  Downgrade takes priority, proposal is discarded
TEST:      Race condition: upgrade proposal + downgrade at same time
MECHANISM: Human actions always take priority; lock autonomy_level during updates
```

---

## MONITORING

### Health Checks

```
CHECK: birth_success_rate
  QUERY:   count(successful births) / count(registration attempts) over 1h
  HEALTHY: >= 0.99
  WARNING: < 0.99
  CRITICAL: < 0.95
  ACTION:  Page on-call, check Solana RPC and L4 registry health

CHECK: orphan_ai_count
  QUERY:   count(AI citizens with no paired human in L4)
  HEALTHY: 0
  WARNING: > 0
  CRITICAL: > 5
  ACTION:  Run orphan cleanup, investigate deletion pipeline

CHECK: personality_corruption_rate
  QUERY:   count(personality validation failures) / count(personality loads) over 24h
  HEALTHY: 0
  WARNING: > 0
  CRITICAL: > 0.01
  ACTION:  Check L1 storage health, review recent personality updates

CHECK: autonomy_violation_count
  QUERY:   count(permission denied events for actions AI attempted) over 24h
  HEALTHY: low (some expected — AI testing boundaries)
  WARNING: spike (>10x normal)
  CRITICAL: any successful unauthorized action
  ACTION:  Review AI system prompt, check permission enforcement code

CHECK: economic_balance
  QUERY:   treasury + sum(all AI wallets) vs expected total
  HEALTHY: delta == 0
  WARNING: delta > 0.01 $MIND
  CRITICAL: delta > 1.0 $MIND
  ACTION:  Halt distributions, reconcile on-chain state
```

---

## MARKERS

<!-- @mind:todo Implement saga pattern for birth atomicity (compensating transactions) -->
<!-- @mind:todo Build personality validation function (bounds check, NaN check, completeness) -->
<!-- @mind:todo Design safe mode behavior — what personality does the AI use when corrupted? -->
<!-- @mind:escalation How to test honest uncertainty invariant (I5) automatically? NLP classifier on AI outputs? Manual review sample? -->
<!-- @mind:escalation Concurrent registration: L4 unique constraint vs distributed lock? Depends on L4 implementation -->
<!-- @mind:proposition Budget exhaustion response could become a personality moment — the AI's reaction to running out of compute reveals character -->
