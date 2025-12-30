# Auth — Algorithm

```
STATUS: DESIGNING
```

---

## A1: Wallet Signature Verification

```python
def verify_wallet_signature(address: str, message: str, signature: str) -> bool:
    """
    Verify that signature was created by the private key of address.

    For Ethereum (EIP-191):
    1. Prefix message with Ethereum signed message header
    2. Hash the prefixed message
    3. Recover public key from signature
    4. Derive address from public key
    5. Compare with claimed address
    """
    prefixed = f"\x19Ethereum Signed Message:\n{len(message)}{message}"
    message_hash = keccak256(prefixed)
    recovered_address = ecrecover(message_hash, signature)
    return recovered_address.lower() == address.lower()
```

---

## A2: JWT Issuance

```python
def issue_jwt(citizen: Actor, org: Optional[Actor]) -> str:
    """
    Issue JWT after successful wallet verification.

    1. Build claims from registry data
    2. Set expiration (24 hours)
    3. Sign with server private key
    4. Return encoded token
    """
    now = time.time()

    claims = {
        "sub": citizen.id,           # CITIZEN_Alice
        "wallet": citizen.wallet,     # 0x1234...
        "org": org.id if org else None,
        "caps": citizen.capabilities,
        "iat": int(now),
        "exp": int(now + 86400),     # 24 hours
    }

    return jwt.encode(claims, PRIVATE_KEY, algorithm="ES256")
```

---

## A3: JWT Verification

```python
def verify_jwt(token: str) -> Optional[Claims]:
    """
    Verify and decode JWT.

    1. Decode without verification to get header
    2. Verify signature with public key
    3. Check expiration
    4. Return claims if valid
    """
    try:
        claims = jwt.decode(
            token,
            PUBLIC_KEY,
            algorithms=["ES256"],
            options={"require": ["sub", "exp", "wallet"]}
        )
        return Claims(**claims)
    except jwt.ExpiredSignatureError:
        raise AuthError("token_expired")
    except jwt.InvalidTokenError:
        raise AuthError("token_invalid")
```

---

## A4: Registry Lookup

```python
def lookup_citizen(wallet_address: str) -> Optional[Citizen]:
    """
    Find citizen in L4 registry by wallet address.

    1. Query graph for Actor with matching wallet
    2. Follow org membership link if exists
    3. Collect capabilities
    4. Return structured citizen data
    """
    result = graph.query("""
        MATCH (c:Actor {wallet: $wallet, type: "CITIZEN"})
        OPTIONAL MATCH (c)-[:LINK {nature: "belongs_to"}]->(o:Actor {type: "ORG"})
        OPTIONAL MATCH (c)-[:LINK {nature: "has_capability"}]->(cap)
        RETURN c, o, collect(cap.id) as caps
    """, {"wallet": wallet_address})

    if not result:
        return None

    c, o, caps = result[0]
    return Citizen(
        id=c.id,
        wallet=c.wallet,
        org=o.id if o else None,
        capabilities=caps
    )
```

---

## A5: Hash-Based Authorization

```python
def verify_resource_access(jwt_token: str, resource_id: str, proof: str) -> bool:
    """
    Verify request is authorized for specific resource.

    1. Compute expected proof: SHA256(JWT + resource_id)
    2. Compare with provided proof
    3. Also verify JWT is valid
    """
    claims = verify_jwt(jwt_token)
    if not claims:
        return False

    expected = hashlib.sha256(f"{jwt_token}{resource_id}".encode()).hexdigest()
    return hmac.compare_digest(expected, proof)
```

---

## A6: Nonce Generation

```python
def generate_sign_in_message(address: str) -> tuple[str, str]:
    """
    Generate message for wallet to sign.

    1. Create unique nonce (UUID)
    2. Store nonce with expiration (5 minutes)
    3. Return formatted message and nonce
    """
    nonce = str(uuid.uuid4())

    # Store in short-term cache (Redis/memory)
    cache.set(f"nonce:{address}", nonce, ex=300)

    message = f"Sign in to Mind Protocol\nNonce: {nonce}"
    return message, nonce
```
