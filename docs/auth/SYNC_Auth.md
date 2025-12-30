# Auth — Sync

```
LAST_UPDATED: 2025-12-30
STATUS: DESIGNING
```

---

## Current State

Auth module is **designed but not implemented**.

Doc chain complete:
- ✅ OBJECTIVES — wallet-first, stateless, L4 integrated
- ✅ PATTERNS — three proofs (existence, ownership, authorization)
- ✅ BEHAVIORS — user flows and system behaviors
- ✅ ALGORITHM — pseudocode for all operations
- ✅ VALIDATION — invariants and security tests
- ✅ IMPLEMENTATION — file structure and dependencies
- ✅ HEALTH — monitoring indicators

---

## Implementation Status

| Component | Status | Notes |
|-----------|--------|-------|
| `api/auth/nonce` | not started | |
| `api/auth/verify` | not started | |
| `lib/auth/jwt.ts` | not started | |
| `lib/auth/wallet.ts` | not started | |
| `ConnectButton` | not started | |
| `SignInButton` | not started | |
| `UserMenu` | not started | |
| Membrane integration | not started | |

---

## Dependencies to Install

```bash
npm install jose viem wagmi @tanstack/react-query
# Optional for Solana:
npm install @solana/web3.js @solana/wallet-adapter-react
```

---

## Open Questions

1. **Multi-chain support?** — Ethereum + Solana, or Ethereum only for v1?
2. **Refresh tokens?** — Or just re-sign when JWT expires?
3. **Capability grant flow?** — How do citizens acquire new capabilities?

---

## Next Steps

1. Install dependencies (jose, viem, wagmi)
2. Implement `/api/auth/nonce` and `/api/auth/verify`
3. Create `lib/auth/` utilities
4. Build auth UI components
5. Integrate with membrane for protected routes

---

## Handoff

**For implementation:** Use groundwork posture. Start with API routes, then lib, then UI.

**Watch out for:**
- Wallet adapter setup can be tricky (providers, chains config)
- JWT secret must be ES256 keypair, not symmetric
- Nonce storage needs Redis or similar for production
