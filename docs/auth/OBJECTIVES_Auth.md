# Auth — Objectives

```
STATUS: DESIGNING
PRIORITY: P0
```

---

## Primary Objective

**Verify identity without storing secrets.**

The platform authenticates citizens and orgs via cryptographic proof, not passwords. Wallet signatures prove ownership. JWTs carry claims. The graph records existence, not credentials.

---

## Ranked Goals

| Rank | Goal | Tradeoff |
|------|------|----------|
| 1 | **Stateless verification** | JWT + wallet sig = no session store |
| 2 | **L4 registry integration** | Existence in registry = identity exists |
| 3 | **Membrane-only access** | Single gate, auditable |
| 4 | **Zero password storage** | Wallet = identity, no breach risk |

---

## Non-Goals

- Password authentication (use wallet signatures)
- Session management (stateless JWTs)
- OAuth/OIDC provider (we verify, not issue external tokens)
- Rate limiting (handled at infrastructure layer)

---

## Success Metrics

| Metric | Target |
|--------|--------|
| Auth latency | < 100ms |
| JWT validation | Crypto-verified, no DB lookup |
| Failed auth logging | 100% captured in membrane |

---

## Dependencies

- L4 Registry (citizen/org existence)
- Wallet infrastructure (signature verification)
- Membrane (single auth gate)
