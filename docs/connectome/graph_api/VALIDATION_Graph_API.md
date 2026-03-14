# VALIDATION — Connectome Graph API

## Invariants

- Endpoint must always return JSON payload.
- `graph` parameter is echoed for debugging context.
- While backend is not integrated, endpoint must fail loudly with status `501`.
