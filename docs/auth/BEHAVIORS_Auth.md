# Auth — Behaviors

```
STATUS: DESIGNING
```

---

## User-Facing Behaviors

### B1: Connect Wallet

**Trigger:** User clicks "Connect Wallet" button

**Observable:**
1. Wallet popup appears (MetaMask, Phantom, etc.)
2. User approves connection
3. UI shows connected address (truncated)
4. "Sign In" button becomes active

**Edge cases:**
- No wallet installed → Show install prompt
- User rejects → Button remains "Connect Wallet"
- Multiple wallets → User selects which one

---

### B2: Sign In

**Trigger:** User clicks "Sign In" with connected wallet

**Observable:**
1. Wallet popup shows message to sign
2. Message format: `Sign in to Mind Protocol\nNonce: {uuid}`
3. User signs
4. JWT returned and stored
5. UI updates to authenticated state

**Edge cases:**
- User rejects signature → Remain unauthenticated
- Wallet not in registry → Error: "Register first"
- Signature invalid → Error: "Verification failed"

---

### B3: Authenticated Request

**Trigger:** Any API call while authenticated

**Observable:**
1. JWT attached as Bearer token
2. Request processed if valid
3. 401 if expired/invalid

**Edge cases:**
- Token expired → Prompt re-sign
- Token invalid → Clear state, show sign-in
- Insufficient caps → 403 Forbidden

---

### B4: Sign Out

**Trigger:** User clicks "Sign Out"

**Observable:**
1. JWT cleared from storage
2. UI returns to unauthenticated state
3. Wallet remains connected (optional disconnect)

---

## System Behaviors

### B5: JWT Verification (Membrane)

**Trigger:** Request with Authorization header

**Internal:**
1. Extract Bearer token
2. Verify signature with public key
3. Check expiration
4. Extract claims
5. Attach to request context

**Outputs:**
- Valid → Proceed with claims
- Invalid → 401 Unauthorized
- Expired → 401 with `token_expired` code

---

### B6: Registry Lookup

**Trigger:** Sign-in request for address

**Internal:**
1. Query graph for Actor with matching wallet
2. Return citizen/org info if found
3. Include capabilities and org membership

**Outputs:**
- Found → Include in JWT claims
- Not found → 404 "Not registered"
