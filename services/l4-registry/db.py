"""
FalkorDB connection management for L4 Registry.

Uses the falkordb Python package (not raw redis).
Connection is to FALKORDB_HOST:FALKORDB_PORT, graph FALKORDB_GRAPH.

DOCS: docs/registry/PATTERNS_Registry_Rules.md (P6: Registry = Graph)
"""

import logging
import os
from typing import Any

from falkordb import FalkorDB

logger = logging.getLogger(__name__)

# ---------------------------------------------------------------------------
# Configuration
# ---------------------------------------------------------------------------

FALKORDB_HOST = os.environ.get("FALKORDB_HOST", "localhost")
FALKORDB_PORT = int(os.environ.get("FALKORDB_PORT", "6379"))
FALKORDB_GRAPH = os.environ.get("FALKORDB_GRAPH", "mind_protocol")


# ---------------------------------------------------------------------------
# Connection singleton
# ---------------------------------------------------------------------------

_db: FalkorDB | None = None
_graph = None


def _get_connection():
    """Get or create FalkorDB connection. Reconnects on failure."""
    global _db, _graph
    if _db is None or _graph is None:
        _db = FalkorDB(host=FALKORDB_HOST, port=FALKORDB_PORT)
        _graph = _db.select_graph(FALKORDB_GRAPH)
        logger.info(
            "Connected to FalkorDB at %s:%s, graph=%s",
            FALKORDB_HOST,
            FALKORDB_PORT,
            FALKORDB_GRAPH,
        )
    return _graph


def _reset_connection():
    """Force reconnect on next call."""
    global _db, _graph
    _db = None
    _graph = None


# ---------------------------------------------------------------------------
# Public API
# ---------------------------------------------------------------------------


def graph_query(cypher: str, params: dict[str, Any] | None = None) -> list[list[Any]]:
    """
    Execute a Cypher query against the FalkorDB graph.

    Args:
        cypher: Cypher query string.
        params: Optional parameter dict (values substituted for $param_name).

    Returns:
        List of result rows. Each row is a list of column values.

    Raises:
        ConnectionError: If FalkorDB is unreachable after retry.
        RuntimeError: If query execution fails.
    """
    graph = _get_connection()
    try:
        result = graph.query(cypher, params or {})
        return result.result_set if result.result_set else []
    except Exception as exc:
        if _is_connection_error(exc):
            logger.warning("Connection lost, attempting reconnect: %s", exc)
            _reset_connection()
            try:
                graph = _get_connection()
                result = graph.query(cypher, params or {})
                return result.result_set if result.result_set else []
            except Exception as retry_exc:
                raise ConnectionError(
                    f"FalkorDB unreachable after reconnect: {retry_exc}"
                ) from retry_exc
        raise RuntimeError(f"Query execution failed: {exc}") from exc


def health_check() -> bool:
    """
    Ping FalkorDB with a trivial query.

    Returns True if the database responds, False otherwise.
    """
    try:
        graph = _get_connection()
        graph.query("RETURN 1")
        return True
    except Exception:
        _reset_connection()
        return False


def _is_connection_error(error: Exception) -> bool:
    """Heuristic: detect connection-class errors from exception message."""
    msg = str(error).lower()
    return any(
        keyword in msg
        for keyword in ("connection", "refused", "timeout", "reset", "broken pipe")
    )
