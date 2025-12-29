"""
Capability runtime infrastructure.

Public API:
    - check: Decorator to register health check functions
    - Signal: Return values from checks (HEALTHY, DEGRADED, CRITICAL)
    - triggers: Trigger builders with IDE autocomplete
    - CheckContext: Read-only context passed to check functions
"""

from .decorators import check, Signal, triggers
from .context import CheckContext

__all__ = ["check", "Signal", "triggers", "CheckContext"]
