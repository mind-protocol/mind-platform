# BEHAVIORS — Connectome Graph API

## Current Observable Behaviors

1. `GET /api/connectome/graph` accepts optional `graph` query parameter.
2. Endpoint responds with `501` and explicit integration message until backend wiring is implemented.
3. Response remains JSON and includes graph identifier for caller diagnostics.

## Planned Behaviors

1. Return graph nodes and edges from canonical connectome source.
2. Preserve read-only API surface.
