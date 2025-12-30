# Auth — Patterns

```
STATUS: DESIGNING
```

---

## Core Pattern: Wallet-First Identity

```
Traditional:              Mind Protocol:
─────────────────────────────────────────────
email + password          wallet address
↓                         ↓
hash + salt               public key
↓                         ↓
session cookie            JWT with claims
↓                         ↓
database lookup           stateless verify
```

**No passwords. No sessions. No database lookups for auth.**

---

## The Three Proofs

### 1. Existence Proof (Registry)

```
Is this citizen real?
→ Query L4 registry
→ MATCH (c:Actor {id: $citizen_id, type: "CITIZEN"})
→ Exists or doesn't
```

### 2. Ownership Proof (Wallet Signature)

```
Does this request come from the wallet owner?
→ Message: "Sign in to Mind Protocol: {nonce}"
→ Signature: wallet.sign(message)
→ Verify: ecrecover(message, sig) == claimed_address
```

### 3. Authorization Proof (JWT Claims)

```
What can this identity do?
→ JWT payload: { sub, org, caps, exp }
→ Verify signature with public key
→ Check claims against requested action
```

---

## JWT Structure

```json
{
  "sub": "CITIZEN_Alice",
  "wallet": "0x1234...5678",
  "org": "ORG_Mindforge",
  "caps": ["create-doc-chain", "sync-state"],
  "iat": 1735520000,
  "exp": 1735606400
}
```

| Claim | Purpose |
|-------|---------|
| `sub` | Citizen/Org ID (graph node) |
| `wallet` | Verified wallet address |
| `org` | Organization membership |
| `caps` | Granted capabilities |
| `exp` | Expiration (24h default) |

---

## Hash-Based Routing (P4)

For sensitive operations, prove the request is for a specific resource:

```
proof = SHA256(JWT + node_id)

Attacker can't:
- Reuse JWT for different node
- Forge proof without valid JWT
- Replay without matching node_id
```

---

## Auth Flow

```
┌─────────────────────────────────────────────────────────────┐
│                         CLIENT                               │
│  1. wallet.sign("Sign in: {nonce}")                         │
│  2. POST /auth/verify { address, signature, nonce }         │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                        MEMBRANE                              │
│  3. ecrecover(message, sig) == address?                     │
│  4. registry.exists(address)?                                │
│  5. issue JWT with claims                                    │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                      SUBSEQUENT REQUESTS                     │
│  Authorization: Bearer {jwt}                                 │
│  → Membrane verifies JWT signature                           │
│  → Extracts claims                                           │
│  → Routes to graph operation                                 │
└─────────────────────────────────────────────────────────────┘
```

---

## Anti-Patterns

| ❌ Don't | ✅ Do | Why |
|----------|-------|-----|
| Store passwords | Wallet signatures | No breach risk |
| Session cookies | Stateless JWTs | No session store |
| Direct graph auth | Membrane-only | Single audit point |
| Long-lived tokens | 24h expiry + refresh | Limit blast radius |
| Capability in URL | Capability in JWT | Signed, unforgeable |
