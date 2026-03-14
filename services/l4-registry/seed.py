"""
Seed FalkorDB with registry data from data/registry.json.

Creates Actor nodes (CITIZEN and ORGANIZATION types) with v2.0 schema fields,
Thing nodes for capabilities, and LINK relationships between them.

Usage:
    python seed.py                          # defaults: localhost:6379, mind_protocol
    python seed.py --host falkordb --port 6379 --graph mind_protocol
    python seed.py --json /path/to/registry.json

Environment variables (override defaults):
    FALKORDB_HOST   (default: localhost)
    FALKORDB_PORT   (default: 6379)
    FALKORDB_GRAPH  (default: mind_protocol)

DOCS: docs/registry/ALGORITHM_Registry_Flows.md
"""

import argparse
import json
import os
import sys
import time
from datetime import datetime, timezone
from pathlib import Path

from falkordb import FalkorDB


# ---------------------------------------------------------------------------
# Defaults
# ---------------------------------------------------------------------------

DEFAULT_JSON = str(Path(__file__).resolve().parent.parent.parent / "data" / "registry.json")
DEFAULT_HOST = os.environ.get("FALKORDB_HOST", "localhost")
DEFAULT_PORT = int(os.environ.get("FALKORDB_PORT", "6379"))
DEFAULT_GRAPH = os.environ.get("FALKORDB_GRAPH", "mind_protocol")


# ---------------------------------------------------------------------------
# Date helpers
# ---------------------------------------------------------------------------


def _date_to_epoch(date_str: str) -> int:
    """Convert YYYY-MM-DD string to unix epoch seconds."""
    try:
        dt = datetime.strptime(date_str, "%Y-%m-%d").replace(tzinfo=timezone.utc)
        return int(dt.timestamp())
    except (ValueError, TypeError):
        return int(datetime.now(timezone.utc).timestamp())


def _now_epoch() -> int:
    return int(datetime.now(timezone.utc).timestamp())


# ---------------------------------------------------------------------------
# Cypher: Create nodes
# ---------------------------------------------------------------------------

CREATE_ACTOR = """
MERGE (a:Actor {id: $id})
ON CREATE SET
    a.name = $name,
    a.node_type = 'actor',
    a.type = $type,
    a.content = $content,
    a.synthesis = $synthesis,
    a.weight = $weight,
    a.energy = $energy,
    a.stability = $stability,
    a.recency = $recency,
    a.activation_count = $activation_count,
    a.in_working_memory = false,
    a.created_at_s = $created_at_s,
    a.updated_at_s = $updated_at_s,
    a.status = $status,
    a.wallet = $wallet,
    a.emoji = $emoji
ON MATCH SET
    a.name = $name,
    a.content = $content,
    a.synthesis = $synthesis,
    a.status = $status,
    a.wallet = $wallet,
    a.emoji = $emoji,
    a.updated_at_s = $updated_at_s
"""

CREATE_ORG_ACTOR = """
MERGE (a:Actor {id: $id})
ON CREATE SET
    a.name = $name,
    a.node_type = 'actor',
    a.type = $type,
    a.content = $content,
    a.synthesis = $synthesis,
    a.weight = $weight,
    a.energy = $energy,
    a.stability = $stability,
    a.recency = $recency,
    a.activation_count = $activation_count,
    a.in_working_memory = false,
    a.created_at_s = $created_at_s,
    a.updated_at_s = $updated_at_s,
    a.status = $status,
    a.org_type = $org_type,
    a.color = $color,
    a.github_repository = $github_repository,
    a.universe = $universe
ON MATCH SET
    a.name = $name,
    a.content = $content,
    a.synthesis = $synthesis,
    a.status = $status,
    a.org_type = $org_type,
    a.color = $color,
    a.github_repository = $github_repository,
    a.universe = $universe,
    a.updated_at_s = $updated_at_s
"""

CREATE_CAPABILITY = """
MERGE (t:Thing {id: $id})
ON CREATE SET
    t.name = $name,
    t.node_type = 'thing',
    t.type = 'CAPABILITY',
    t.content = $name,
    t.synthesis = $name,
    t.weight = 0.5,
    t.energy = 0.0,
    t.stability = 0.5,
    t.recency = 0.5,
    t.activation_count = 0,
    t.in_working_memory = false,
    t.created_at_s = $created_at_s,
    t.updated_at_s = $updated_at_s
"""

# ---------------------------------------------------------------------------
# Cypher: Create links
# ---------------------------------------------------------------------------

LINK_CITIZEN_TO_ORG = """
MATCH (c:Actor {id: $citizen_id}), (o:Actor {id: $org_id})
MERGE (c)-[l:LINK {nature: 'belongs_to'}]->(o)
ON CREATE SET
    l.relation_kind = 'belongs_to',
    l.polarity = $polarity,
    l.hierarchy = $hierarchy,
    l.permanence = $permanence,
    l.stability = $stability,
    l.recency = $recency,
    l.weight = 0.8,
    l.created_at_s = $created_at_s,
    l.updated_at_s = $updated_at_s
"""

LINK_CITIZEN_TO_CAPABILITY = """
MATCH (c:Actor {id: $citizen_id}), (t:Thing {id: $cap_id})
MERGE (c)-[l:LINK {nature: 'has_capability'}]->(t)
ON CREATE SET
    l.relation_kind = 'has_capability',
    l.polarity = $polarity,
    l.hierarchy = $hierarchy,
    l.permanence = $permanence,
    l.stability = $stability,
    l.recency = $recency,
    l.weight = 0.6,
    l.created_at_s = $created_at_s,
    l.updated_at_s = $updated_at_s
"""

LINK_VERIFICATION = """
MATCH (verifier:Actor {id: 'mind-protocol'}), (target:Actor {id: $target_id})
MERGE (verifier)-[l:LINK {nature: 'verified_by'}]->(target)
ON CREATE SET
    l.relation_kind = 'verified_by',
    l.polarity = $polarity,
    l.hierarchy = $hierarchy,
    l.permanence = $permanence,
    l.stability = $stability,
    l.recency = $recency,
    l.weight = 1.0,
    l.created_at_s = $created_at_s,
    l.updated_at_s = $updated_at_s
"""


# ---------------------------------------------------------------------------
# Seeding logic
# ---------------------------------------------------------------------------


def seed(json_path: str, host: str, port: int, graph_name: str) -> None:
    """Read registry.json and seed the FalkorDB graph."""
    # Load data
    print(f"Reading registry data from {json_path}")
    with open(json_path, "r", encoding="utf-8") as f:
        data = json.load(f)

    citizens = data.get("citizens", [])
    orgs = data.get("orgs", [])
    print(f"  Found {len(citizens)} citizens, {len(orgs)} orgs")

    # Connect
    print(f"Connecting to FalkorDB at {host}:{port}, graph={graph_name}")
    db = FalkorDB(host=host, port=port)
    graph = db.select_graph(graph_name)

    # Verify connection
    graph.query("RETURN 1")
    print("  Connection verified")

    now = _now_epoch()
    stats = {
        "orgs_created": 0,
        "citizens_created": 0,
        "capabilities_created": 0,
        "links_belongs_to": 0,
        "links_has_capability": 0,
        "links_verification": 0,
    }

    # ------------------------------------------------------------------
    # Phase 1: Create org Actor nodes
    # ------------------------------------------------------------------
    print("\n--- Phase 1: Creating organization nodes ---")
    for org in orgs:
        org_id = org["id"]
        name = org["name"]
        desc = org.get("description", "")
        synthesis = f"{name} — {desc}" if desc else name
        created_at_s = _date_to_epoch("2025-01-01")  # orgs don't have registered_date in JSON

        params = {
            "id": org_id,
            "name": name,
            "type": "ORGANIZATION",
            "content": desc,
            "synthesis": synthesis,
            "weight": 1.0,
            "energy": 0.0,
            "stability": 0.5,
            "recency": 0.5,
            "activation_count": 0,
            "created_at_s": created_at_s,
            "updated_at_s": now,
            "status": org.get("status", "active"),
            "org_type": org.get("org_type"),
            "color": org.get("color"),
            "github_repository": org.get("github_repository"),
            "universe": org.get("universe"),
        }
        graph.query(CREATE_ORG_ACTOR, params)
        stats["orgs_created"] += 1

        if (stats["orgs_created"] % 10) == 0:
            print(f"  {stats['orgs_created']} orgs...")

    print(f"  Total orgs created: {stats['orgs_created']}")

    # ------------------------------------------------------------------
    # Phase 2: Create citizen Actor nodes + capability Thing nodes
    # ------------------------------------------------------------------
    print("\n--- Phase 2: Creating citizen nodes ---")
    capability_ids: set[str] = set()

    for citizen in citizens:
        cit_id = citizen["id"]
        name = citizen["name"]
        desc = citizen.get("description", "")
        synthesis = f"{name} — {desc}" if desc else name
        reg_date = citizen.get("registered_date", "2025-01-01")
        created_at_s = _date_to_epoch(reg_date)

        params = {
            "id": cit_id,
            "name": name,
            "type": "CITIZEN",
            "content": desc,
            "synthesis": synthesis,
            "weight": 1.0,
            "energy": 0.0,
            "stability": 0.5,
            "recency": 0.5,
            "activation_count": 0,
            "created_at_s": created_at_s,
            "updated_at_s": now,
            "status": citizen.get("status", "active"),
            "wallet": citizen.get("wallet"),
            "emoji": citizen.get("emoji"),
        }
        graph.query(CREATE_ACTOR, params)
        stats["citizens_created"] += 1

        # Create capability Thing nodes (deduplicated)
        for cap_name in citizen.get("capabilities", []):
            cap_id = f"cap_{cap_name}"
            if cap_id not in capability_ids:
                graph.query(CREATE_CAPABILITY, {
                    "id": cap_id,
                    "name": cap_name,
                    "created_at_s": now,
                    "updated_at_s": now,
                })
                capability_ids.add(cap_id)
                stats["capabilities_created"] += 1

        if (stats["citizens_created"] % 50) == 0:
            print(f"  {stats['citizens_created']} citizens...")

    print(f"  Total citizens created: {stats['citizens_created']}")
    print(f"  Total capabilities created: {stats['capabilities_created']}")

    # ------------------------------------------------------------------
    # Phase 3: Create LINK relationships
    # ------------------------------------------------------------------
    print("\n--- Phase 3: Creating relationships ---")

    # 3a: belongs_to links (citizen -> org)
    for citizen in citizens:
        cit_id = citizen["id"]
        org_membership = citizen.get("org_membership")
        if not org_membership:
            continue

        link_params = {
            "citizen_id": cit_id,
            "org_id": org_membership,
            "polarity": [0.8, 0.3],
            "hierarchy": -0.5,
            "permanence": 0.7,
            "stability": 0.5,
            "recency": 0.5,
            "created_at_s": now,
            "updated_at_s": now,
        }
        graph.query(LINK_CITIZEN_TO_ORG, link_params)
        stats["links_belongs_to"] += 1

    print(f"  belongs_to links: {stats['links_belongs_to']}")

    # 3b: has_capability links (citizen -> capability)
    for citizen in citizens:
        cit_id = citizen["id"]
        for cap_name in citizen.get("capabilities", []):
            cap_id = f"cap_{cap_name}"
            link_params = {
                "citizen_id": cit_id,
                "cap_id": cap_id,
                "polarity": [0.7, 0.2],
                "hierarchy": -0.3,
                "permanence": 0.8,
                "stability": 0.5,
                "recency": 0.5,
                "created_at_s": now,
                "updated_at_s": now,
            }
            graph.query(LINK_CITIZEN_TO_CAPABILITY, link_params)
            stats["links_has_capability"] += 1

    print(f"  has_capability links: {stats['links_has_capability']}")

    # 3c: verification links (mind-protocol verifier -> entity)
    # Ensure the mind-protocol org exists before creating verification links
    for citizen in citizens:
        if citizen.get("verification") == "verified":
            link_params = {
                "target_id": citizen["id"],
                "polarity": [0.9, 0.5],
                "hierarchy": 0.5,
                "permanence": 0.8,
                "stability": 0.8,
                "recency": 0.5,
                "created_at_s": now,
                "updated_at_s": now,
            }
            graph.query(LINK_VERIFICATION, link_params)
            stats["links_verification"] += 1

    for org in orgs:
        if org.get("verification") == "verified":
            link_params = {
                "target_id": org["id"],
                "polarity": [0.9, 0.5],
                "hierarchy": 0.5,
                "permanence": 0.8,
                "stability": 0.8,
                "recency": 0.5,
                "created_at_s": now,
                "updated_at_s": now,
            }
            graph.query(LINK_VERIFICATION, link_params)
            stats["links_verification"] += 1

    print(f"  verification links: {stats['links_verification']}")

    # ------------------------------------------------------------------
    # Summary
    # ------------------------------------------------------------------
    print("\n=== Seed complete ===")
    for key, value in stats.items():
        print(f"  {key}: {value}")

    total_nodes = stats["orgs_created"] + stats["citizens_created"] + stats["capabilities_created"]
    total_links = stats["links_belongs_to"] + stats["links_has_capability"] + stats["links_verification"]
    print(f"\n  Total nodes: {total_nodes}")
    print(f"  Total links: {total_links}")


# ---------------------------------------------------------------------------
# CLI
# ---------------------------------------------------------------------------


def main() -> None:
    parser = argparse.ArgumentParser(
        description="Seed FalkorDB with Mind Protocol registry data."
    )
    parser.add_argument(
        "--json",
        default=DEFAULT_JSON,
        help=f"Path to registry.json (default: {DEFAULT_JSON})",
    )
    parser.add_argument(
        "--host",
        default=DEFAULT_HOST,
        help=f"FalkorDB host (default: {DEFAULT_HOST})",
    )
    parser.add_argument(
        "--port",
        type=int,
        default=DEFAULT_PORT,
        help=f"FalkorDB port (default: {DEFAULT_PORT})",
    )
    parser.add_argument(
        "--graph",
        default=DEFAULT_GRAPH,
        help=f"FalkorDB graph name (default: {DEFAULT_GRAPH})",
    )

    args = parser.parse_args()

    if not Path(args.json).exists():
        print(f"Error: registry file not found at {args.json}", file=sys.stderr)
        sys.exit(1)

    t0 = time.monotonic()
    seed(args.json, args.host, args.port, args.graph)
    elapsed = time.monotonic() - t0
    print(f"\n  Elapsed: {elapsed:.1f}s")


if __name__ == "__main__":
    main()
