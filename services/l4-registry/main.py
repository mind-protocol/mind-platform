"""
L4 Registry Backend — FastAPI service serving registry data from FalkorDB.

This is the L4 (Protocol) layer backend. All reads are public (no auth required).
The Next.js frontend (L3) proxies to this service.

Endpoints:
  GET /health                      — health check (pings FalkorDB)
  GET /registry/citizens           — list citizens with filters + pagination
  GET /registry/citizens/{id}      — citizen detail with org + capabilities
  GET /registry/orgs               — list orgs with filters + pagination
  GET /registry/orgs/{id}          — org detail with member list
  GET /registry/search?q=          — text search across citizens and orgs

DOCS: docs/registry/PATTERNS_Registry_Rules.md
DOCS: docs/registry/ALGORITHM_Registry_Flows.md
"""

import logging
import os

from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware

from db import graph_query, health_check, FALKORDB_GRAPH
from models import (
    Citizen,
    CitizenDetail,
    HealthResponse,
    Org,
    OrgDetail,
    RegistryListResponse,
    VerificationState,
)
from queries import (
    LIST_CITIZENS,
    COUNT_CITIZENS,
    GET_CITIZEN,
    GET_CITIZEN_ORG,
    GET_CITIZEN_CAPABILITIES,
    GET_CITIZEN_VERIFICATION_LINKS,
    LIST_ORGS,
    COUNT_ORGS,
    GET_ORG,
    GET_ORG_MEMBERS,
    COUNT_ORG_MEMBERS,
    GET_ORG_VERIFICATION_LINKS,
    SEARCH_ENTITIES,
    build_citizen_filters,
    build_org_filters,
)
from transforms import (
    _epoch_to_date,
    _safe_status,
    derive_verification_state,
    transform_citizen,
    transform_citizen_detail,
    transform_org,
    transform_org_detail,
    transform_search_result,
)

# ---------------------------------------------------------------------------
# Logging
# ---------------------------------------------------------------------------

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
)
logger = logging.getLogger("l4-registry")

# ---------------------------------------------------------------------------
# App
# ---------------------------------------------------------------------------

app = FastAPI(
    title="Mind Protocol L4 Registry",
    description="Public registry of citizens and organizations in the Mind Protocol ecosystem.",
    version="0.1.0",
)

# CORS
cors_origins = os.environ.get("CORS_ORIGINS", "http://localhost:3000").split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=[o.strip() for o in cors_origins],
    allow_credentials=False,
    allow_methods=["GET"],
    allow_headers=["*"],
)


# ---------------------------------------------------------------------------
# Health
# ---------------------------------------------------------------------------


@app.get("/health", response_model=HealthResponse)
async def get_health():
    """Health check: ping FalkorDB and report status."""
    db_ok = health_check()
    if not db_ok:
        raise HTTPException(
            status_code=503,
            detail="FalkorDB unreachable",
        )
    return HealthResponse(
        status="ok",
        database="connected",
        graph=FALKORDB_GRAPH,
    )


# ---------------------------------------------------------------------------
# Citizens
# ---------------------------------------------------------------------------


@app.get("/registry/citizens", response_model=RegistryListResponse)
async def list_citizens(
    verification: str = Query("all", description="Filter by verification state"),
    status: str = Query("all", description="Filter by entity status"),
    org: str = Query("all", description="Filter by org ID"),
    limit: int = Query(500, ge=1, le=500, description="Page size"),
    offset: int = Query(0, ge=0, description="Offset for pagination"),
):
    """
    List registered citizens with optional filters and pagination.

    Verification filtering is done post-query because it requires
    traversing verification links for each citizen.
    """
    try:
        filters = build_citizen_filters(verification=None, status=status, org=org)
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc
    query = LIST_CITIZENS.replace("{filters}", filters)
    count_query = COUNT_CITIZENS.replace("{filters}", filters)

    rows = graph_query(query, {"offset": offset, "limit": limit})
    count_rows = graph_query(count_query)
    total = count_rows[0][0] if count_rows else 0

    citizens: list[Citizen] = []
    for row in rows:
        citizen_id = row[0]

        # Resolve org membership
        org_rows = graph_query(GET_CITIZEN_ORG, {"citizen_id": citizen_id})
        org_id = org_rows[0][0] if org_rows else None
        org_name = org_rows[0][1] if org_rows else None

        # Resolve capabilities
        cap_rows = graph_query(GET_CITIZEN_CAPABILITIES, {"citizen_id": citizen_id})
        capabilities = [r[0] for r in cap_rows] if cap_rows else []

        # Derive verification state
        ver_rows = graph_query(
            GET_CITIZEN_VERIFICATION_LINKS, {"citizen_id": citizen_id}
        )
        ver_state = derive_verification_state(ver_rows)

        citizen = transform_citizen(
            row,
            org_id=org_id,
            org_name=org_name,
            capabilities=capabilities,
            verification=ver_state,
        )
        citizens.append(citizen)

    # Post-filter by verification if requested
    if verification and verification != "all":
        citizens = [c for c in citizens if c.verification.value == verification]
        total = len(citizens)

    return RegistryListResponse(
        items=citizens,
        count=total,
        hasMore=total > offset + limit,
    )


@app.get("/registry/citizens/{citizen_id}", response_model=CitizenDetail)
async def get_citizen(citizen_id: str):
    """Get a single citizen by ID, with org details and capabilities."""
    rows = graph_query(GET_CITIZEN, {"citizen_id": citizen_id})
    if not rows:
        raise HTTPException(status_code=404, detail="Citizen not found")

    row = rows[0]

    # Resolve org
    org_rows = graph_query(GET_CITIZEN_ORG, {"citizen_id": citizen_id})
    org_id = org_rows[0][0] if org_rows else None
    org_name = org_rows[0][1] if org_rows else None

    # Resolve capabilities
    cap_rows = graph_query(GET_CITIZEN_CAPABILITIES, {"citizen_id": citizen_id})
    capabilities = [r[0] for r in cap_rows] if cap_rows else []

    # Derive verification
    ver_rows = graph_query(
        GET_CITIZEN_VERIFICATION_LINKS, {"citizen_id": citizen_id}
    )
    ver_state = derive_verification_state(ver_rows)

    citizen = transform_citizen(
        row,
        org_id=org_id,
        org_name=org_name,
        capabilities=capabilities,
        verification=ver_state,
    )

    # Resolve full org details if citizen has org
    org_detail = None
    if org_id:
        org_detail_rows = graph_query(GET_ORG, {"org_id": org_id})
        if org_detail_rows:
            member_count_rows = graph_query(
                COUNT_ORG_MEMBERS, {"org_id": org_id}
            )
            member_count = member_count_rows[0][0] if member_count_rows else 0
            org_ver_rows = graph_query(
                GET_ORG_VERIFICATION_LINKS, {"org_id": org_id}
            )
            org_ver = derive_verification_state(org_ver_rows)
            org_detail = transform_org(
                org_detail_rows[0],
                citizen_count=member_count,
                verification=org_ver,
            )

    return transform_citizen_detail(citizen, org=org_detail)


# ---------------------------------------------------------------------------
# Organizations
# ---------------------------------------------------------------------------


@app.get("/registry/orgs", response_model=RegistryListResponse)
async def list_orgs(
    verification: str = Query("all", description="Filter by verification state"),
    status: str = Query("all", description="Filter by entity status"),
    limit: int = Query(500, ge=1, le=500, description="Page size"),
    offset: int = Query(0, ge=0, description="Offset for pagination"),
):
    """List registered organizations with optional filters and pagination."""
    try:
        filters = build_org_filters(verification=None, status=status)
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc
    query = LIST_ORGS.replace("{filters}", filters)
    count_query = COUNT_ORGS.replace("{filters}", filters)

    rows = graph_query(query, {"offset": offset, "limit": limit})
    count_rows = graph_query(count_query)
    total = count_rows[0][0] if count_rows else 0

    orgs: list[Org] = []
    for row in rows:
        org_id = row[0]

        # Count members
        member_count_rows = graph_query(COUNT_ORG_MEMBERS, {"org_id": org_id})
        member_count = member_count_rows[0][0] if member_count_rows else 0

        # Derive verification
        ver_rows = graph_query(GET_ORG_VERIFICATION_LINKS, {"org_id": org_id})
        ver_state = derive_verification_state(ver_rows)

        org = transform_org(row, citizen_count=member_count, verification=ver_state)
        orgs.append(org)

    # Post-filter by verification
    if verification and verification != "all":
        orgs = [o for o in orgs if o.verification.value == verification]
        total = len(orgs)

    return RegistryListResponse(
        items=orgs,
        count=total,
        hasMore=total > offset + limit,
    )


@app.get("/registry/orgs/{org_id}", response_model=OrgDetail)
async def get_org(org_id: str):
    """Get a single org by ID, with its member list."""
    rows = graph_query(GET_ORG, {"org_id": org_id})
    if not rows:
        raise HTTPException(status_code=404, detail="Organization not found")

    row = rows[0]

    # Count + fetch members
    member_count_rows = graph_query(COUNT_ORG_MEMBERS, {"org_id": org_id})
    member_count = member_count_rows[0][0] if member_count_rows else 0

    member_rows = graph_query(GET_ORG_MEMBERS, {"org_id": org_id})

    # Derive org verification
    ver_rows = graph_query(GET_ORG_VERIFICATION_LINKS, {"org_id": org_id})
    ver_state = derive_verification_state(ver_rows)

    org = transform_org(row, citizen_count=member_count, verification=ver_state)

    # Transform members
    members: list[Citizen] = []
    for mrow in member_rows:
        # Member rows: [id, name, description, status, created_at_s, emoji, wallet]
        member = Citizen(
            id=mrow[0] or "",
            name=mrow[1] or "",
            description=mrow[2] or None,
            emoji=mrow[5] or None,
            wallet=mrow[6] or None,
            org_membership=org_id,
            org_name=org.name,
            status=_safe_status(mrow[3]),
            registered_date=_epoch_to_date(mrow[4]),
            capabilities=[],
            verification=VerificationState.UNVERIFIED,
        )
        members.append(member)

    return transform_org_detail(org, members=members)


# ---------------------------------------------------------------------------
# Search
# ---------------------------------------------------------------------------


@app.get("/registry/search", response_model=RegistryListResponse)
async def search_registry(
    q: str = Query(..., min_length=2, description="Search query"),
    limit: int = Query(50, ge=1, le=200, description="Max results"),
):
    """
    Text search across citizen and org names and descriptions.

    Uses case-insensitive substring matching on name and synthesis fields.
    """
    rows = graph_query(SEARCH_ENTITIES, {"query": q, "limit": limit})
    items = [transform_search_result(row) for row in rows]

    return RegistryListResponse(
        items=items,
        count=len(items),
        hasMore=False,
    )


# ---------------------------------------------------------------------------
# Entry point
# ---------------------------------------------------------------------------

if __name__ == "__main__":
    import uvicorn

    host = os.environ.get("HOST", "0.0.0.0")
    port = int(os.environ.get("PORT", "8766"))
    uvicorn.run("main:app", host=host, port=port, reload=True)
