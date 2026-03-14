"""
Pydantic models for the L4 Registry API.

Maps to TypeScript types in:
  app/[locale]/(public)/registry/lib/types.ts

DOCS: docs/registry/PATTERNS_Registry_Rules.md
"""

from enum import Enum
from typing import Optional

from pydantic import BaseModel, Field


class VerificationState(str, Enum):
    """Derived from graph link properties (polarity + permanence)."""

    UNVERIFIED = "unverified"
    PENDING = "pending"
    PROVISIONAL = "provisional"
    VERIFIED = "verified"
    REJECTED = "rejected"


class EntityStatus(str, Enum):
    ACTIVE = "active"
    PENDING = "pending"
    SUSPENDED = "suspended"


class Citizen(BaseModel):
    """A registered citizen in the L4 registry."""

    id: str
    name: str
    description: Optional[str] = None
    emoji: Optional[str] = None
    wallet: Optional[str] = None
    org_membership: Optional[str] = None
    org_name: Optional[str] = None
    status: EntityStatus = EntityStatus.ACTIVE
    registered_date: str
    capabilities: list[str] = Field(default_factory=list)
    verification: VerificationState = VerificationState.UNVERIFIED


class Org(BaseModel):
    """A registered organization in the L4 registry."""

    id: str
    name: str
    description: Optional[str] = None
    type: Optional[str] = None
    color: Optional[str] = None
    wallet: Optional[str] = None
    endpoint: Optional[str] = None
    status: EntityStatus = EntityStatus.ACTIVE
    registered_date: str
    citizen_count: int = 0
    verification: VerificationState = VerificationState.UNVERIFIED
    github_repository: Optional[str] = None
    org_type: Optional[str] = None
    universe: Optional[str] = None


class RegistryListResponse(BaseModel):
    """Paginated list response. Matches RegistryListResponse<T> in TypeScript."""

    items: list[Citizen | Org]
    count: int
    hasMore: bool


class CitizenDetail(Citizen):
    """Citizen with resolved org details."""

    org_details: Optional[Org] = None


class OrgDetail(Org):
    """Org with its member list."""

    members: list[Citizen] = Field(default_factory=list)


class HealthResponse(BaseModel):
    status: str
    database: str
    graph: str
