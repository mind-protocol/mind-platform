# ALGORITHM — Connectome Graph API

```text
On GET /api/connectome/graph:
  1. Parse request URL.
  2. Read `graph` query parameter, default to `seed`.
  3. Return JSON 501 with explicit message that backend wiring is pending.
```
