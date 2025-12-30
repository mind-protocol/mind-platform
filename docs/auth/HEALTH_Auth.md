# Auth — Health

```
STATUS: DESIGNING
```

---

## Health Indicators

### H1: JWT Verification Rate

**Signal:** Percentage of JWT verifications that succeed

| State | Condition | Action |
|-------|-----------|--------|
| healthy | > 95% success | None |
| degraded | 80-95% success | Check for clock skew, key rotation issues |
| critical | < 80% success | Alert: possible attack or misconfiguration |

**Measurement:**
```
success_rate = successful_verifications / total_verifications
```

---

### H2: Nonce Expiration Rate

**Signal:** Percentage of nonces that expire unused

| State | Condition | Action |
|-------|-----------|--------|
| healthy | < 50% expired | Normal user behavior |
| degraded | 50-80% expired | UX issue: users abandoning sign-in |
| critical | > 80% expired | Broken flow or bot activity |

---

### H3: Registry Lookup Latency

**Signal:** Time to query citizen from L4 registry

| State | Condition | Action |
|-------|-----------|--------|
| healthy | < 50ms p95 | None |
| degraded | 50-200ms p95 | Check graph performance |
| critical | > 200ms p95 | Scale or optimize queries |

---

### H4: Failed Signature Rate

**Signal:** Percentage of signature verifications that fail

| State | Condition | Action |
|-------|-----------|--------|
| healthy | < 5% failure | Normal typos/cancels |
| degraded | 5-20% failure | Check wallet compatibility |
| critical | > 20% failure | Possible replay attack |

---

## Monitoring

```yaml
metrics:
  - name: auth_jwt_verify_total
    type: counter
    labels: [status]  # success, expired, invalid

  - name: auth_nonce_total
    type: counter
    labels: [status]  # used, expired

  - name: auth_registry_lookup_seconds
    type: histogram
    buckets: [0.01, 0.05, 0.1, 0.2, 0.5]

  - name: auth_signature_verify_total
    type: counter
    labels: [status, chain]  # success/failure, ethereum/solana
```

---

## Alerts

| Alert | Condition | Severity |
|-------|-----------|----------|
| AuthVerifyHighFailure | jwt_verify failure > 20% for 5m | critical |
| AuthLatencyHigh | registry_lookup p95 > 200ms for 5m | warning |
| AuthSignatureSpike | signature failures spike 10x | critical |
