# IMPLEMENTATION — Connectome Graph API

## Source of Truth

- `app/api/connectome/graph/route.ts`

## Implementation Notes

- Current implementation is an explicit `501` response until graph backend wiring is completed.
- `DOCS:` marker present in implementation for bidirectional doc linkage.
- The endpoint is intentionally loud about missing integration to avoid silent failure semantics.
