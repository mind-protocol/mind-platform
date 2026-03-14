# L4 Registry Backend

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

## Local Development

### Prerequisites

- Docker and Docker Compose

### Start services

```bash
cd services/l4-registry
docker-compose up -d
```

This starts:
- **FalkorDB** on port 6379 (with append-only persistence)
- **L4 Registry** on port 8766

### Seed data

With services running:

```bash
# From within the l4-registry container
docker-compose exec l4-registry python seed.py

# Or from host (requires falkordb Python package)
pip install falkordb
python seed.py --host localhost --port 6379 --graph mind_protocol
```

The seed script reads `data/registry.json` from the repo root and creates:
- Actor nodes for each citizen (type=CITIZEN) with v2.0 schema fields
- Actor nodes for each organization (type=ORGANIZATION)
- Thing nodes for capabilities
- LINK relationships: belongs_to (citizen->org), has_capability (citizen->capability), verified_by (verifier->entity)

### Run without Docker

```bash
pip install -r requirements.txt
export FALKORDB_HOST=localhost
export FALKORDB_PORT=6379
export FALKORDB_GRAPH=mind_protocol
python main.py
```

### Verify

```bash
# Health check
curl http://localhost:8766/health

# List citizens
curl http://localhost:8766/registry/citizens?limit=5

# Search
curl http://localhost:8766/registry/search?q=venice
```

## Deploy on Render

The repository includes a `render.yaml` blueprint at the project root that defines both services.

### Option A: Blueprint (recommended)

1. Connect the `mind-protocol/mind-platform` repository to Render
2. Render detects `render.yaml` and offers to create the blueprint stack
3. Approve the services: `falkordb` (private) + `l4-registry` (web)
4. After deploy, seed the database:
   ```bash
   # SSH into l4-registry service or use Render shell
   python seed.py --host <falkordb-internal-host> --port 6379
   ```

### Option B: Manual

1. Create a **Private Service** for FalkorDB:
   - Docker image: `falkordb/falkordb:latest`
   - Port: 6379
   - Persistent disk: 10 GB at `/var/lib/falkordb/data`
   - Env: `REDIS_ARGS=--appendonly yes`, `BROWSER=0`

2. Create a **Web Service** for L4 Registry:
   - Docker, context: `services/l4-registry/`
   - Port: 8766
   - Health check: `/health`
   - Env: see table below

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `FALKORDB_HOST` | `localhost` | FalkorDB hostname (on Render: the pserv internal hostname) |
| `FALKORDB_PORT` | `6379` | FalkorDB port |
| `FALKORDB_GRAPH` | `mind_protocol` | Graph name in FalkorDB |
| `HOST` | `0.0.0.0` | Bind address for the FastAPI server |
| `PORT` | `8766` | Listen port for the FastAPI server |
| `CORS_ORIGINS` | `http://localhost:3000` | Comma-separated allowed CORS origins |

## Architecture

```
Next.js (L3 Frontend)
    |
    | HTTP proxy (L4_REGISTRY_URL)
    v
L4 Registry (FastAPI, port 8766)
    |
    | FalkorDB Python client
    v
FalkorDB (Redis-based graph DB, port 6379)
    |
    | Persistent disk
    v
/var/lib/falkordb/data (AOF + RDB)
```

## File Structure

| File | Purpose |
|------|---------|
| `main.py` | FastAPI app, route handlers |
| `db.py` | FalkorDB connection singleton |
| `models.py` | Pydantic response models |
| `queries.py` | Cypher query templates |
| `transforms.py` | Row-to-model transformations |
| `seed.py` | Data seeding from registry.json |
| `Dockerfile` | Production container image |
| `docker-compose.yml` | Local development stack |
| `requirements.txt` | Python dependencies |
