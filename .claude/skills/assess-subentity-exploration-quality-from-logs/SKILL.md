---
name: Assess SubEntity Exploration Quality From Logs
---

# Skill: `mind.assess_subentity_exploration`
@mind:id: SKILL.PHYSICS.SUBENTITY.ASSESS_EXPLORATION_QUALITY

## Maps to VIEW
`(diagnostic assessment of exploration quality)`

---

## Context

When exploration produces suboptimal results, the problem could live anywhere in the stack:

```
┌─────────────────────────────────────────────────────────────────┐
│  OUTPUT QUALITY                                                 │
│    ↑ Actor got wrong/incomplete/irrelevant answers              │
├─────────────────────────────────────────────────────────────────┤
│  SUBENTITY BEHAVIORS                                            │
│    ↑ State machine made bad transitions, missed findings        │
├─────────────────────────────────────────────────────────────────┤
│  GRAPH PHYSICS                                                  │
│    ↑ Energy/weight wrong, link scoring miscalibrated            │
├─────────────────────────────────────────────────────────────────┤
│  PROTOCOL DESIGN                                                │
│    ↑ Exploration triggered wrong, parameters misconfigured      │
├─────────────────────────────────────────────────────────────────┤
│  AGENT SKILL                                                    │
│    ↑ Agent loaded wrong context, misunderstood task             │
└─────────────────────────────────────────────────────────────────┘
```

This skill diagnoses WHERE in the stack a problem originates, not just WHETHER metrics are healthy.

**Key insight:** Symptoms appear at output layer; causes often live deeper.

---

## Purpose
Diagnose suboptimal exploration outcomes by tracing symptoms through behaviors, physics, protocols, and skills to identify root causes and improvements.

---

## Inputs
```yaml
exploration_id: "<id>"                    # string
symptom: "<what went wrong>"              # string, observed problem
actor_context: "<what actor was doing>"   # string, original task
expected_outcome: "<what should happen>"  # string, success criteria
```

## Outputs
```yaml
diagnosis:
  layer: "output|behaviors|physics|protocol|skill"
  root_cause: "<explanation>"
  evidence: [{source, finding}]

improvements:
  - layer: "<which layer>"
    change: "<what to change>"
    rationale: "<why this fixes it>"

follow_up:
  - action: "<specific next step>"
    owner: "<agent or human>"
```

---

## Gates

**Diagnosis quality:**
- Root cause identified with evidence (not speculation)
- Layer correctly attributed (not just "something's wrong")
- Evidence traceable to log lines or code

**Improvement quality:**
- Each improvement addresses identified cause
- Changes are specific (not "make it better")
- Layer of change matches layer of cause

---

## Diagnostic Layers

### Layer 1: Output Quality

**Symptoms:**
- Actor got wrong answer
- Actor got incomplete answer
- Actor got irrelevant information
- Crystallized narrative is nonsense

**Evidence to gather:**
```yaml
from_log:
  - found_narratives: What was returned?
  - crystallized: What was created?
  - satisfaction: Did exploration think it succeeded?
  - alignment_scores: How confident was it?

compare_to:
  - expected_outcome: What should have been found?
  - graph_state: Did the right narratives exist?
```

**Diagnostic questions:**
1. Did the right narratives exist in the graph?
   - YES → problem is finding them (Layer 2+)
   - NO → problem is graph content (outside exploration)

2. Were right narratives found but ranked low?
   - YES → scoring problem (Layer 3)
   - NO → traversal didn't reach them (Layer 2)

3. Was crystallization triggered when it shouldn't be?
   - YES → satisfaction/novelty thresholds wrong (Layer 3)

---

### Layer 2: SubEntity Behaviors

**Symptoms:**
- Exploration terminated too early
- Exploration ran too long
- Branching didn't happen when it should
- Wrong state transitions
- Findings lost during merge

**Evidence to gather:**
```yaml
from_log:
  - state_transitions: What states did it visit?
  - branching_decisions: When did it branch? How many children?
  - merge_results: What did children find vs parent receive?
  - depth_reached: How deep did it go?
  - termination_reason: Why did it stop?
```

**Diagnostic questions:**
1. Did state machine follow valid transitions?
   - NO → V1 violation, bug in exploration.py
   - YES → transitions valid but suboptimal

2. Did branching happen at moments?
   - NO when should → min_branch_links too high, or scoring issue
   - YES when shouldn't → threshold too low

3. Were child findings merged correctly?
   - NO → V7 violation, merge bug
   - YES → children didn't find right things (recurse to their logs)

4. Did it terminate on satisfaction or timeout?
   - Timeout → too slow, needs optimization
   - Low satisfaction → didn't find enough, scoring or graph issue

---

### Layer 3: Graph Physics

**Symptoms:**
- Wrong links selected (high-scoring but irrelevant)
- Right links ignored (low-scoring but relevant)
- Energy not accumulating on hot paths
- Crystallization embedding doesn't represent exploration

**Evidence to gather:**
```yaml
from_log:
  - link_scores: Full breakdown (semantic, polarity, permanence, novelty)
  - energy_injection: How much injected where?
  - crystallization_embedding: How it evolved step by step
  - sibling_divergence: Were parallels actually divergent?

from_code:
  - INTENTION_WEIGHTS: Are weights appropriate for intention_type?
  - STATE_MULTIPLIER: Are multipliers balanced?
  - scoring formula: Any component dominating unfairly?
```

**Diagnostic questions:**
1. Is semantic alignment correct but overridden?
   - Check if polarity or permanence dominating
   - Check if self_novelty killing good options

2. Is sibling divergence too aggressive?
   - Siblings avoiding good paths because similar to each other
   - May need to reduce divergence weight

3. Is energy injection proportional to value?
   - High energy on useless nodes → STATE_MULTIPLIER wrong
   - Low energy on valuable nodes → state detection wrong

4. Does intention_type match the actual intent?
   - SUMMARIZE when should be VERIFY → wrong weights applied

---

### Layer 4: Protocol Design

**Symptoms:**
- Exploration triggered with wrong parameters
- Query/intention mismatch
- Wrong intention_type selected
- Origin moment inappropriate

**Evidence to gather:**
```yaml
from_log:
  - query: What was the search query?
  - intention: What was the stated intention?
  - intention_type: Which type was selected?
  - origin_moment: What triggered this?

from_protocol:
  - parameter_selection: How did protocol choose these?
  - preconditions: Were they satisfied?
```

**Diagnostic questions:**
1. Does query match what actor actually wanted?
   - NO → protocol extracted wrong query
   - YES → query is fine, problem downstream

2. Does intention accurately describe WHY?
   - Vague intention → poor intention_embedding
   - Wrong intention → selecting wrong paths

3. Is intention_type appropriate?
   - SUMMARIZE for contradiction-finding → wrong type
   - VERIFY for breadth search → wrong type

4. Should exploration have been triggered at all?
   - Maybe actor needed something else (memory lookup, direct retrieval)

---

### Layer 5: Agent Skill

**Symptoms:**
- Agent triggered exploration when inappropriate
- Agent used wrong protocol
- Agent misunderstood task context
- Agent didn't use exploration results correctly

**Evidence to gather:**
```yaml
from_context:
  - actor_task: What was the original request?
  - skill_loaded: Which skill guided the agent?
  - protocol_selected: Which protocol was invoked?

from_skill:
  - gates: Did agent satisfy skill gates?
  - process: Did agent follow skill process?
  - never_stop: Did agent handle blocks correctly?
```

**Diagnostic questions:**
1. Was exploration the right tool for this task?
   - Maybe direct graph query was better
   - Maybe synthesis was needed, not exploration

2. Did skill guide agent to right protocol?
   - Skill missing exploration guidance
   - Skill has wrong protocol mapping

3. Did agent understand skill correctly?
   - Skill ambiguous → multiple interpretations
   - Skill incomplete → missing context

---

## Process

### 1. Identify symptom layer
```yaml
start_at: Output layer
observe: What exactly went wrong?
classify:
  - wrong_answer → trace backward
  - incomplete → trace backward
  - slow → likely Layer 2/3
  - crashed → likely Layer 2 bug
```

### 2. Gather evidence from log
```yaml
read: traversal_{exploration_id}.jsonl
extract:
  - All STEP records
  - All anomalies
  - Final summary
  - State transition sequence
  - Link scoring details
```

### 3. Test hypotheses top-down
```yaml
for_each_layer:
  - Form hypothesis: "Problem is X at Layer N"
  - Find evidence: "Log shows Y which supports/refutes X"
  - Conclude: "Layer N is/isn't the cause"
  - If not cause: Move to next layer down
```

### 4. Identify root cause
```yaml
root_cause:
  layer: Which layer?
  mechanism: Which specific component?
  evidence: What proves this?
  alternative_hypotheses: What else could explain it?
```

### 5. Propose improvements
```yaml
for_each_cause:
  improvement:
    layer: Same as cause
    change: Specific modification
    rationale: Why this fixes the cause
    risk: What could go wrong
    validation: How to verify it worked
```

### 6. Generate report
```yaml
sections:
  - symptom: What was observed
  - diagnosis: Layer-by-layer analysis
  - root_cause: Primary cause with evidence
  - improvements: Ranked by impact
  - follow_up: Specific next actions
```

---

## Common Patterns

### Pattern: "Found nothing but narratives exist"
```
Symptom: Output empty, but graph has relevant narratives
Layer: Usually 3 (Physics)
Common causes:
  - Semantic alignment low due to embedding mismatch
  - Self-novelty killing path to narrative
  - Permanence too high on links (not traversable)
Fix: Check scoring breakdown, adjust weights or re-embed
```

### Pattern: "Found wrong things confidently"
```
Symptom: High satisfaction, wrong narratives
Layer: Usually 3 or 4
Common causes:
  - Intention embedding too broad (matches many things)
  - Query/intention mismatch (finding what was asked, not what was meant)
  - Polarity reinforcement loop (past mistakes compound)
Fix: Improve query/intention extraction, consider polarity decay
```

### Pattern: "Ran forever, found little"
```
Symptom: Timeout or max_depth, low satisfaction
Layer: Usually 2 or 3
Common causes:
  - No good links from start position (poor origin)
  - Self-novelty too aggressive (can't revisit needed areas)
  - Branching not triggering (min_branch_links too high)
Fix: Check origin selection, tune novelty/branching thresholds
```

### Pattern: "Crystallized garbage"
```
Symptom: New narrative makes no sense
Layer: Usually 3
Common causes:
  - Crystallization embedding drifted badly
  - Novelty gate passed but shouldn't have (threshold issue)
  - Path included irrelevant nodes (scoring issue)
Fix: Check embedding evolution, tighten novelty threshold
```

### Pattern: "Agent shouldn't have explored"
```
Symptom: Exploration triggered, but wrong tool for task
Layer: 5 (Skill)
Common causes:
  - Skill doesn't distinguish exploration from other tools
  - Protocol selection logic flawed
  - Agent lacks context to choose correctly
Fix: Improve skill decision criteria, add protocol selection guidance
```

---

## Report Template

```markdown
# Exploration Diagnosis: {exploration_id}

## Symptom
{What went wrong, in concrete terms}

## Expected Outcome
{What should have happened}

## Diagnosis

### Layer 1: Output Quality
{Analysis or "Output matches expectations - not the problem layer"}

### Layer 2: SubEntity Behaviors
{Analysis or "Behaviors correct - not the problem layer"}

### Layer 3: Graph Physics
{Analysis or "Physics functioning correctly - not the problem layer"}

### Layer 4: Protocol Design
{Analysis or "Protocol appropriate - not the problem layer"}

### Layer 5: Agent Skill
{Analysis or "Skill guidance adequate - not the problem layer"}

## Root Cause
**Layer:** {N}
**Mechanism:** {specific component}
**Evidence:** {log lines, code references}

## Improvements

### Improvement 1: {title}
- **Layer:** {N}
- **Change:** {specific modification}
- **Rationale:** {why this fixes the cause}
- **Validation:** {how to verify}

### Improvement 2: {title}
...

## Follow-up Actions
1. {action} — {owner}
2. {action} — {owner}
```

---

## Procedures Referenced

| Protocol | When | Creates |
|----------|------|---------|
| `protocol:investigate` | Deep dive into specific layer | investigation record |
| `protocol:record_work` | After diagnosis complete | work record |
| `protocol:update_sync` | If improvements made | sync update |

---

## Evidence
- Logs: `engine/data/logs/traversal/`
- Behaviors: `docs/physics/subentity/BEHAVIORS_SubEntity.md`
- Physics: `docs/physics/subentity/ALGORITHM_SubEntity.md`
- Validation: `docs/physics/subentity/VALIDATION_SubEntity.md`

## Never-stop
If diagnosis inconclusive at one layer → document findings → move to next layer → if all layers checked with no cause → `@mind:escalation` with full analysis → `@mind:proposition` for additional investigation approaches.
