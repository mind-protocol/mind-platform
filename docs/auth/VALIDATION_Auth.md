# Auth — Validation

```
STATUS: DESIGNING
```

---

## Invariants

### I1: No Password Storage

```
FORALL users U:
  NOT EXISTS password_hash(U)

Verification:
- Grep codebase for password/hash storage
- Schema has no password field
- No bcrypt/argon2 imports
```

### I2: JWT Expiration Required

```
FORALL tokens T:
  T.exp EXISTS AND
  T.exp <= T.iat + 86400  # Max 24 hours

Verification:
- JWT issuance always sets exp
- No token without expiration
- Max lifetime enforced
```

### I3: Wallet-Identity Binding

```
FORALL citizens C:
  C.wallet IS UNIQUE AND
  C.wallet IS IMMUTABLE after registration

Verification:
- Graph constraint: wallet unique
- No wallet update endpoint
```

### I4: Membrane-Only Auth

```
FORALL auth_requests R:
  R.path STARTS WITH "/membrane" OR
  R.path IN ["/auth/verify", "/auth/nonce"]

Verification:
- No direct graph auth
- All protected routes through membrane
```

---

## Security Invariants

### S1: Signature Verification Before JWT

```
FORALL sign_in_requests R:
  verify_signature(R) BEFORE issue_jwt(R)

Verification:
- Code path analysis
- No JWT without prior signature check
```

### S2: Nonce Single-Use

```
FORALL nonces N:
  used(N) => invalidated(N)

Verification:
- Nonce deleted after use
- Replay returns error
```

### S3: JWT Signature Valid

```
FORALL jwt_verifications V:
  V.signature MATCHES V.public_key

Verification:
- No verify-skip options
- Algorithm explicit (ES256)
```

---

## Test Cases

| ID | Invariant | Test |
|----|-----------|------|
| T1 | I1 | Attempt password login → 404 |
| T2 | I2 | Issue token → has exp < 24h |
| T3 | I3 | Register duplicate wallet → error |
| T4 | I4 | Direct graph query without JWT → 401 |
| T5 | S1 | Invalid signature → no JWT issued |
| T6 | S2 | Reuse nonce → error |
| T7 | S3 | Tampered JWT → 401 |
