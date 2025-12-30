# Auth — Implementation

```
STATUS: DESIGNING
```

---

## File Structure

```
app/
├── api/
│   └── auth/
│       ├── nonce/route.ts      # GET - generate sign-in message
│       └── verify/route.ts     # POST - verify sig, issue JWT
├── (public)/
│   └── components/
│       └── auth/
│           ├── ConnectButton.tsx
│           ├── SignInButton.tsx
│           └── UserMenu.tsx
lib/
├── auth/
│   ├── jwt.ts                  # JWT sign/verify
│   ├── wallet.ts               # Signature verification
│   └── hooks.ts                # useAuth, useWallet
.mind/
└── runtime/
    └── client/
        └── auth.py             # Python auth utilities
```

---

## API Routes

### GET /api/auth/nonce

```typescript
// Request
{ address: string }

// Response
{
  message: string,  // "Sign in to Mind Protocol\nNonce: {uuid}"
  nonce: string     // UUID for verification
}
```

### POST /api/auth/verify

```typescript
// Request
{
  address: string,
  signature: string,
  nonce: string
}

// Response
{
  token: string,    // JWT
  citizen: {
    id: string,
    name: string,
    org: string | null,
    capabilities: string[]
  }
}
```

---

## Components

### ConnectButton

```typescript
// States: disconnected → connecting → connected
// Uses: wagmi/viem for Ethereum, @solana/wallet-adapter for Solana
```

### SignInButton

```typescript
// Visible when: wallet connected, not signed in
// Action: request nonce, sign message, verify, store JWT
```

### UserMenu

```typescript
// Shows: truncated address, org badge, sign out option
// Avatar: generated from address (jazzicon/blockies)
```

---

## State Management

```typescript
// lib/auth/hooks.ts

interface AuthState {
  status: 'disconnected' | 'connected' | 'authenticated';
  address: string | null;
  citizen: Citizen | null;
  token: string | null;
}

// Persist token in localStorage
// Clear on sign out or expiration
// Auto-refresh on page load if valid
```

---

## JWT Configuration

```typescript
// lib/auth/jwt.ts

const JWT_SECRET = process.env.JWT_SECRET;  // ES256 private key
const JWT_PUBLIC = process.env.JWT_PUBLIC;  // ES256 public key
const JWT_EXPIRY = '24h';
const JWT_ALGORITHM = 'ES256';
```

---

## Membrane Integration

Auth tokens flow through membrane for protected operations:

```typescript
// Middleware checks Authorization header
// Decodes JWT, attaches claims to request
// Membrane procedures access claims via context

// Example in procedure:
// ctx.auth.sub → "CITIZEN_Alice"
// ctx.auth.caps → ["create-doc-chain"]
```

---

## Dependencies

| Package | Purpose |
|---------|---------|
| `jose` | JWT signing/verification |
| `viem` | Ethereum signature verification |
| `@solana/web3.js` | Solana signature verification |
| `wagmi` | React wallet hooks (Ethereum) |
| `@solana/wallet-adapter-react` | React wallet hooks (Solana) |
