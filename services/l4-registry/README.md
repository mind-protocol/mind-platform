# L4 Registry Backend (REFERENCE COPY)

> **The canonical version of this service now lives in the [mind-protocol](https://github.com/mind-protocol/mind-protocol) repository at `api/registry/`.**
> This copy is kept for reference only. All new development should happen in mind-protocol.
> Deployment configuration: `mind-protocol/render.yaml`
> Entry point: `uvicorn api.registry.app:app`
> Custom domain: `l4.mindprotocol.ai`

FastAPI service that serves Mind Protocol registry data (citizens, organizations) from a FalkorDB graph database.

This is the **L4 (Protocol) layer** backend. The Next.js frontend (L3) proxies to this service. All reads are public (no auth required).

## Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/health` | Health check (pings FalkorDB) |
| GET | `/registry/citizens` | List citizens with filters + pagination |
| GET | `/registry/citizens/{id}` | Citizen detail with org + capabilities |
| GET | `/registry/orgs` | List orgs with filters + pagination |
| GET | `/registry/orgs/{id}` | Org detail with member list |
| GET | `/registry/search?q=` | Text search across citizens and orgs |

## Canonical Location

The service has been moved to:
- **Repository:** `mind-protocol/mind-protocol`
- **Path:** `api/registry/` (app.py, db.py, models.py, queries.py, transforms.py, seed.py)
- **Dockerfile:** root `Dockerfile`
- **Render Blueprint:** root `render.yaml`
- **Seed script:** `python -m api.registry.seed --json data/registry.json`

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `FALKORDB_HOST` | `localhost` | FalkorDB hostname (on Render: the pserv internal hostname) |
| `FALKORDB_PORT` | `6379` | FalkorDB port |
| `FALKORDB_GRAPH` | `mind_protocol` | Graph name in FalkorDB |
| `HOST` | `0.0.0.0` | Bind address for the FastAPI server |
| `PORT` | `8766` | Listen port for the FastAPI server |
| `CORS_ORIGINS` | `http://localhost:3000,https://mindprotocol.ai,https://www.mindprotocol.ai` | Comma-separated allowed CORS origins |
