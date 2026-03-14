"""
Transform FalkorDB graph rows into API Pydantic models.

Verification state is derived from graph link properties (polarity + permanence)
per the algorithm in docs/registry/ALGORITHM_Registry_Flows.md (Flow 4).

DOCS: docs/registry/ALGORITHM_Registry_Flows.md
"""

from datetime import datetime, timezone
from typing import Any

from models import (
    Citizen,
    CitizenDetail,
    EntityStatus,
    Org,
    OrgDetail,
    VerificationState,
)


# ---------------------------------------------------------------------------
# Verification derivation
# ---------------------------------------------------------------------------


def derive_verification_state(
    verification_links: list[list[Any]],
) -> VerificationState:
    """
    Derive verification state from L4 verification link data.

    Each row in verification_links is [polarity, permanence].
    polarity can be a float or a 2-element list [a->b, b->a].

    Algorithm (from ALGORITHM_Registry_Flows.md Flow 4):
      - No links -> unverified
      - Any positive polarity link with permanence >= 0.5 -> verified
      - Any positive polarity link with permanence < 0.5 -> provisional
      - Only negative polarity links -> rejected
      - Links exist but none positive -> pending
    """
    if not verification_links:
        return VerificationState.UNVERIFIED

    best_permanence: float | None = None
    has_negative = False

    for row in verification_links:
        polarity_raw = row[0]
        permanence = _safe_float(row[1], 0.0)

        # polarity can be a scalar or a 2-element array [a->b, b->a]
        if isinstance(polarity_raw, (list, tuple)):
            polarity = float(polarity_raw[0])
        else:
            polarity = _safe_float(polarity_raw, 0.0)

        if polarity > 0:
            if best_permanence is None or permanence > best_permanence:
                best_permanence = permanence
        elif polarity < 0:
            has_negative = True

    if best_permanence is not None:
        if best_permanence >= 0.5:
            return VerificationState.VERIFIED
        return VerificationState.PROVISIONAL

    if has_negative:
        return VerificationState.REJECTED

    return VerificationState.PENDING


# ---------------------------------------------------------------------------
# Row -> Model transforms
# ---------------------------------------------------------------------------


def transform_citizen(
    row: list[Any],
    org_id: str | None = None,
    org_name: str | None = None,
    capabilities: list[str] | None = None,
    verification: VerificationState = VerificationState.UNVERIFIED,
) -> Citizen:
    """
    Transform a citizen query row into a Citizen model.

    Expected row columns (from LIST_CITIZENS / GET_CITIZEN):
      [id, name, description, content, status, created_at_s, wallet, emoji]
    """
    return Citizen(
        id=_safe_str(row[0]),
        name=_safe_str(row[1]),
        description=_safe_str(row[2]),
        emoji=_safe_str(row[7]) or None,
        wallet=_safe_str(row[6]) or None,
        org_membership=org_id,
        org_name=org_name,
        status=_safe_status(row[4]),
        registered_date=_epoch_to_date(row[5]),
        capabilities=capabilities or [],
        verification=verification,
    )


def transform_citizen_detail(
    citizen: Citizen,
    org: Org | None = None,
) -> CitizenDetail:
    """Wrap a Citizen with its resolved org details."""
    return CitizenDetail(
        **citizen.model_dump(),
        org_details=org,
    )


def transform_org(
    row: list[Any],
    citizen_count: int = 0,
    verification: VerificationState = VerificationState.UNVERIFIED,
) -> Org:
    """
    Transform an org query row into an Org model.

    Expected row columns (from LIST_ORGS / GET_ORG):
      [id, name, description, content, status, created_at_s, wallet,
       org_type, color, github_repository, universe]
    """
    return Org(
        id=_safe_str(row[0]),
        name=_safe_str(row[1]),
        description=_safe_str(row[2]),
        type=_safe_str(row[7]) or None,
        color=_safe_str(row[8]) or None,
        wallet=_safe_str(row[6]) or None,
        endpoint=None,
        status=_safe_status(row[4]),
        registered_date=_epoch_to_date(row[5]),
        citizen_count=citizen_count,
        verification=verification,
        github_repository=_safe_str(row[9]) or None,
        org_type=_safe_str(row[7]) or None,
        universe=_safe_str(row[10]) or None,
    )


def transform_org_detail(
    org: Org,
    members: list[Citizen],
) -> OrgDetail:
    """Wrap an Org with its member list."""
    return OrgDetail(
        **org.model_dump(),
        members=members,
    )


def transform_search_result(
    row: list[Any],
) -> Citizen | Org:
    """
    Transform a search result row into either a Citizen or Org.

    Expected row columns (from SEARCH_ENTITIES):
      [id, name, entity_type, description, status, created_at_s, wallet,
       emoji, org_type, color, github_repository, universe]
    """
    entity_type = _safe_str(row[2])

    if entity_type == "CITIZEN":
        return Citizen(
            id=_safe_str(row[0]),
            name=_safe_str(row[1]),
            description=_safe_str(row[3]),
            emoji=_safe_str(row[7]) or None,
            wallet=_safe_str(row[6]) or None,
            org_membership=None,
            org_name=None,
            status=_safe_status(row[4]),
            registered_date=_epoch_to_date(row[5]),
            capabilities=[],
            verification=VerificationState.UNVERIFIED,
        )
    else:
        return Org(
            id=_safe_str(row[0]),
            name=_safe_str(row[1]),
            description=_safe_str(row[3]),
            type=_safe_str(row[8]) or None,
            color=_safe_str(row[9]) or None,
            wallet=_safe_str(row[6]) or None,
            endpoint=None,
            status=_safe_status(row[4]),
            registered_date=_epoch_to_date(row[5]),
            citizen_count=0,
            verification=VerificationState.UNVERIFIED,
            github_repository=_safe_str(row[10]) or None,
            org_type=_safe_str(row[8]) or None,
            universe=_safe_str(row[11]) or None,
        )


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------


def _safe_str(value: Any) -> str:
    """Coerce a graph value to string, handling None / NoneType."""
    if value is None:
        return ""
    return str(value)


def _safe_float(value: Any, default: float = 0.0) -> float:
    """Coerce a graph value to float."""
    if value is None:
        return default
    try:
        return float(value)
    except (ValueError, TypeError):
        return default


def _safe_status(value: Any) -> EntityStatus:
    """Coerce a graph status value to EntityStatus enum."""
    raw = _safe_str(value).lower()
    try:
        return EntityStatus(raw)
    except ValueError:
        return EntityStatus.ACTIVE


def _epoch_to_date(epoch_value: Any) -> str:
    """Convert an epoch-seconds integer to ISO date string (YYYY-MM-DD).

    Falls back to an ISO datetime string if the value looks like one already,
    or returns today's date if conversion fails.
    """
    if epoch_value is None:
        return datetime.now(timezone.utc).strftime("%Y-%m-%d")

    # If it's already a date-like string, return it
    if isinstance(epoch_value, str):
        if len(epoch_value) >= 10 and "-" in epoch_value[:10]:
            return epoch_value[:10]
        try:
            ts = int(float(epoch_value))
            return datetime.fromtimestamp(ts, tz=timezone.utc).strftime("%Y-%m-%d")
        except (ValueError, TypeError, OSError):
            return epoch_value

    try:
        ts = int(epoch_value)
        return datetime.fromtimestamp(ts, tz=timezone.utc).strftime("%Y-%m-%d")
    except (ValueError, TypeError, OSError):
        return datetime.now(timezone.utc).strftime("%Y-%m-%d")
