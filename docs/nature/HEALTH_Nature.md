# Nature — Health: Verifying Correct Usage

```
STATUS: CANONICAL
MODULE: nature
```

---

## CHAIN

```
VALIDATION:      ./VALIDATION_Nature.md
IMPLEMENTATION:  ./IMPLEMENTATION_Nature.md
THIS:            HEALTH_Nature.md (you are here)
SYNC:            ./SYNC_Nature.md
```

---

## PURPOSE

Health checks for nature usage across the graph.

---

## INDICATORS

### H1: Unknown Nature Values

```yaml
name: Unknown Nature Check
priority: critical
rationale: Invalid nature values break queries

mechanism: |
  Scan all links.
  Flag any where nature ∉ vocabulary.

signals:
  healthy: All natures are valid
  degraded: 1-5 invalid natures
  critical: >5 invalid natures
```

### H2: Missing Nature on Links

```yaml
name: Missing Nature Check
priority: critical
rationale: Links without nature have no semantic meaning

mechanism: |
  Scan all links.
  Flag any where nature is null/empty.

signals:
  healthy: All links have nature
  degraded: 1-5 missing
  critical: >5 missing
```

### H3: Direction Consistency

```yaml
name: Direction Check
priority: medium
rationale: Wrong direction makes queries return wrong results

mechanism: |
  For each link:
    Check if FROM/TO types match nature semantics.
    e.g., serves should be instance→template

signals:
  healthy: All directions valid
  degraded: Some mismatches
  critical: Many mismatches
```

### H4: Nature Distribution

```yaml
name: Nature Distribution
priority: low
rationale: Unbalanced usage may indicate problems

mechanism: |
  Count links by nature.
  Flag if any nature has 0 usage (dead code).
  Flag if one nature has >90% usage (overuse).

signals:
  healthy: Balanced distribution
  degraded: Some imbalance
  critical: Major imbalance
```

---

## HOW TO RUN

```bash
# Check nature health (via MCP)
health_check --module nature
```

---

## MARKERS

<!-- @mind:todo Implement automated nature validation -->
