"""
Capability runtime infrastructure.

Public API:
    - check: Decorator to register health check functions
    - Signal: Return values from checks (HEALTHY, DEGRADED, CRITICAL)
    - triggers: Trigger builders with IDE autocomplete
    - CheckContext: Read-only context passed to check functions
    - TriggerRegistry: Maps triggers to check functions
    - Throttler: Rate limiting and deduplication for task_runs
    - discover_capabilities: Find capabilities with runtime/checks.py
    - dispatch_trigger: Execute checks for a trigger
    - run_checks: Convenience function for dispatch + task creation
"""

from .decorators import check, Signal, triggers
from .context import CheckContext
from .registry import TriggerRegistry
from .throttler import Throttler, ThrottlerConfig, get_throttler, reset_throttler
from .agents import (
    AgentRegistry, AgentController, AgentState, AgentStatus, AgentMode, AgentConfig,
    get_registry, get_controller, reset_agents,
)
from .loader import discover_capabilities, load_checks
from .dispatch import dispatch_trigger, create_task_runs, run_checks

__all__ = [
    # Decorators
    "check",
    "Signal",
    "triggers",
    # Context
    "CheckContext",
    # Registry
    "TriggerRegistry",
    # Throttler
    "Throttler",
    "ThrottlerConfig",
    "get_throttler",
    "reset_throttler",
    # Agents
    "AgentRegistry",
    "AgentController",
    "AgentState",
    "AgentStatus",
    "AgentMode",
    "AgentConfig",
    "get_registry",
    "get_controller",
    "reset_agents",
    # Loader
    "discover_capabilities",
    "load_checks",
    # Dispatch
    "dispatch_trigger",
    "create_task_runs",
    "run_checks",
]
