"""
Cypher queries for L4 Registry.

All queries target the FalkorDB graph.  Actor nodes have:
  - node_type label (Actor in FalkorDB)
  - type field: "CITIZEN" or "ORGANIZATION"
  - Standard NodeBase fields: id, name, synthesis, content, created_at_s, etc.

Links use a single `LINK` type with semantics in the `nature` field
(belongs_to, verified_by, has_capability, etc.) and physics properties
(polarity, permanence, weight).

DOCS: docs/registry/ALGORITHM_Registry_Flows.md
"""

# ---------------------------------------------------------------------------
# Citizens
# ---------------------------------------------------------------------------

LIST_CITIZENS = """
MATCH (c:Actor)
WHERE c.type = 'CITIZEN'
{filters}
RETURN c.id AS id,
       c.name AS name,
       c.synthesis AS description,
       c.content AS content,
       c.status AS status,
       c.created_at_s AS created_at_s,
       c.wallet AS wallet,
       c.emoji AS emoji
ORDER BY c.name ASC
SKIP $offset
LIMIT $limit
"""

COUNT_CITIZENS = """
MATCH (c:Actor)
WHERE c.type = 'CITIZEN'
{filters}
RETURN count(c) AS total
"""

GET_CITIZEN = """
MATCH (c:Actor)
WHERE c.id = $citizen_id AND c.type = 'CITIZEN'
RETURN c.id AS id,
       c.name AS name,
       c.synthesis AS description,
       c.content AS content,
       c.status AS status,
       c.created_at_s AS created_at_s,
       c.wallet AS wallet,
       c.emoji AS emoji
"""

# Fetch the org a citizen belongs to (via link with nature = 'belongs_to')
GET_CITIZEN_ORG = """
MATCH (c:Actor)-[l:LINK]->(o:Actor)
WHERE c.id = $citizen_id
  AND c.type = 'CITIZEN'
  AND o.type = 'ORGANIZATION'
  AND l.nature = 'belongs_to'
RETURN o.id AS org_id,
       o.name AS org_name
LIMIT 1
"""

# Fetch capabilities linked to a citizen
GET_CITIZEN_CAPABILITIES = """
MATCH (c:Actor)-[l:LINK]->(cap:Thing)
WHERE c.id = $citizen_id
  AND c.type = 'CITIZEN'
  AND l.nature = 'has_capability'
RETURN cap.name AS capability
"""

# Verification links pointing at a citizen (from verifiers)
GET_CITIZEN_VERIFICATION_LINKS = """
MATCH (verifier)-[l:LINK]->(c:Actor)
WHERE c.id = $citizen_id
  AND c.type = 'CITIZEN'
  AND l.nature = 'verified_by'
RETURN l.polarity AS polarity,
       l.permanence AS permanence
"""

# ---------------------------------------------------------------------------
# Organizations
# ---------------------------------------------------------------------------

LIST_ORGS = """
MATCH (o:Actor)
WHERE o.type = 'ORGANIZATION'
{filters}
RETURN o.id AS id,
       o.name AS name,
       o.synthesis AS description,
       o.content AS content,
       o.status AS status,
       o.created_at_s AS created_at_s,
       o.wallet AS wallet,
       o.org_type AS org_type,
       o.color AS color,
       o.github_repository AS github_repository,
       o.universe AS universe
ORDER BY o.name ASC
SKIP $offset
LIMIT $limit
"""

COUNT_ORGS = """
MATCH (o:Actor)
WHERE o.type = 'ORGANIZATION'
{filters}
RETURN count(o) AS total
"""

GET_ORG = """
MATCH (o:Actor)
WHERE o.id = $org_id AND o.type = 'ORGANIZATION'
RETURN o.id AS id,
       o.name AS name,
       o.synthesis AS description,
       o.content AS content,
       o.status AS status,
       o.created_at_s AS created_at_s,
       o.wallet AS wallet,
       o.org_type AS org_type,
       o.color AS color,
       o.github_repository AS github_repository,
       o.universe AS universe
"""

# Members of an org
GET_ORG_MEMBERS = """
MATCH (c:Actor)-[l:LINK]->(o:Actor)
WHERE o.id = $org_id
  AND o.type = 'ORGANIZATION'
  AND c.type = 'CITIZEN'
  AND l.nature = 'belongs_to'
RETURN c.id AS id,
       c.name AS name,
       c.synthesis AS description,
       c.status AS status,
       c.created_at_s AS created_at_s,
       c.emoji AS emoji,
       c.wallet AS wallet
ORDER BY c.name ASC
"""

# Count members of an org
COUNT_ORG_MEMBERS = """
MATCH (c:Actor)-[l:LINK]->(o:Actor)
WHERE o.id = $org_id
  AND o.type = 'ORGANIZATION'
  AND c.type = 'CITIZEN'
  AND l.nature = 'belongs_to'
RETURN count(c) AS total
"""

# Verification links pointing at an org
GET_ORG_VERIFICATION_LINKS = """
MATCH (verifier)-[l:LINK]->(o:Actor)
WHERE o.id = $org_id
  AND o.type = 'ORGANIZATION'
  AND l.nature = 'verified_by'
RETURN l.polarity AS polarity,
       l.permanence AS permanence
"""

# ---------------------------------------------------------------------------
# Search
# ---------------------------------------------------------------------------

SEARCH_ENTITIES = """
MATCH (e:Actor)
WHERE (e.type = 'CITIZEN' OR e.type = 'ORGANIZATION')
  AND (toLower(e.name) CONTAINS toLower($query)
       OR toLower(e.synthesis) CONTAINS toLower($query))
RETURN e.id AS id,
       e.name AS name,
       e.type AS entity_type,
       e.synthesis AS description,
       e.status AS status,
       e.created_at_s AS created_at_s,
       e.wallet AS wallet,
       e.emoji AS emoji,
       e.org_type AS org_type,
       e.color AS color,
       e.github_repository AS github_repository,
       e.universe AS universe
ORDER BY e.name ASC
LIMIT $limit
"""


# ---------------------------------------------------------------------------
# Filter builder
# ---------------------------------------------------------------------------

_VALID_STATUSES = {"active", "pending", "suspended"}


def build_citizen_filters(
    verification: str | None,
    status: str | None,
    org: str | None,
) -> str:
    """Build WHERE clause fragments for citizen list queries.

    Returns a string of AND clauses to inject into the {filters} placeholder.
    Verification filtering is done post-query (it requires link traversal),
    so only status and org generate Cypher filters here.

    Status is validated against the known enum to prevent injection.
    Org ID is sanitized to alphanumeric + underscore + hyphen.
    """
    clauses: list[str] = []
    if status and status != "all":
        if status.lower() not in _VALID_STATUSES:
            raise ValueError(f"Invalid status filter: {status}")
        clauses.append(f"AND c.status = '{status.lower()}'")
    # Org filter requires a subquery match
    if org and org != "all":
        safe_org = _sanitize_id(org)
        clauses.append(
            f"AND EXISTS {{ MATCH (c)-[bl:LINK]->(org:Actor) "
            f"WHERE org.id = '{safe_org}' AND bl.nature = 'belongs_to' }}"
        )
    return "\n".join(clauses)


def build_org_filters(
    verification: str | None,
    status: str | None,
) -> str:
    """Build WHERE clause fragments for org list queries."""
    clauses: list[str] = []
    if status and status != "all":
        if status.lower() not in _VALID_STATUSES:
            raise ValueError(f"Invalid status filter: {status}")
        clauses.append(f"AND o.status = '{status.lower()}'")
    return "\n".join(clauses)


def _sanitize_id(value: str) -> str:
    """Strip characters that could escape a Cypher string literal."""
    import re
    return re.sub(r"[^a-zA-Z0-9_\-.]", "", value)
