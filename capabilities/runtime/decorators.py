"""
Decorator-based health check registration.

Usage:
    from capabilities.runtime import check, Signal, triggers

    @check(
        id="chain_completeness",
        triggers=[triggers.file.on_delete("docs/**/*.md")],
        on_problem="INCOMPLETE_CHAIN",
        task="TASK_create_doc",
    )
    def chain_completeness(ctx) -> dict:
        if all_docs_exist:
            return Signal.healthy()
        return Signal.degraded(missing=["OBJECTIVES"])
"""

import sys
from typing import Callable


class Signal:
    """Health check return values."""

    HEALTHY = "healthy"
    DEGRADED = "degraded"
    CRITICAL = "critical"

    @classmethod
    def healthy(cls) -> dict:
        """All good, no action needed."""
        return {"signal": cls.HEALTHY}

    @classmethod
    def degraded(cls, **data) -> dict:
        """Something wrong, create task_run."""
        return {"signal": cls.DEGRADED, **data}

    @classmethod
    def critical(cls, **data) -> dict:
        """Serious issue, create urgent task_run."""
        return {"signal": cls.CRITICAL, **data}


def check(id: str, triggers: list, on_problem: str, task: str) -> Callable:
    """
    Decorator to register a health check function.

    Args:
        id: Unique check identifier (e.g., "chain_completeness")
        triggers: List of trigger dicts from triggers.* builders
        on_problem: Problem ID from capability's VOCABULARY (e.g., "INCOMPLETE_CHAIN")
        task: Task ID from capability's tasks/ folder (e.g., "TASK_create_doc")

    Returns:
        Decorated function with __check_meta__ attribute
    """

    def decorator(fn: Callable) -> Callable:
        fn.__check_meta__ = {
            "id": id,
            "triggers": triggers,
            "on_problem": on_problem,
            "task": task,
            "capability": None,  # Set by loader
        }

        # Auto-register in module's __checks__ list
        module = sys.modules[fn.__module__]
        if not hasattr(module, "__checks__"):
            module.__checks__ = []
        module.__checks__.append(fn)

        return fn

    return decorator


class triggers:
    """Trigger builders with IDE autocomplete."""

    class file:
        """File system triggers."""

        @staticmethod
        def on_delete(match: str) -> dict:
            """Fires when a file matching pattern is deleted."""
            return {"type": "file.on_delete", "match": match}

        @staticmethod
        def on_create(match: str) -> dict:
            """Fires when a file matching pattern is created."""
            return {"type": "file.on_create", "match": match}

        @staticmethod
        def on_modify(match: str) -> dict:
            """Fires when a file matching pattern is modified."""
            return {"type": "file.on_modify", "match": match}

    class init:
        """Initialization triggers."""

        @staticmethod
        def after_scan() -> dict:
            """Fires after MCP scans modules on startup."""
            return {"type": "init.after_scan"}

        @staticmethod
        def startup() -> dict:
            """Fires on MCP startup."""
            return {"type": "init.startup"}

    class cron:
        """Scheduled triggers."""

        @staticmethod
        def daily() -> dict:
            """Fires once per day."""
            return {"type": "cron.daily"}

        @staticmethod
        def hourly() -> dict:
            """Fires once per hour."""
            return {"type": "cron.hourly"}

        @staticmethod
        def every(minutes: int) -> dict:
            """Fires every N minutes."""
            return {"type": f"cron.every_{minutes}m"}

    class manual:
        """Manual invocation triggers."""

        @staticmethod
        def invoke(name: str) -> dict:
            """Fires on explicit manual invocation."""
            return {"type": f"manual.{name}"}

    class graph:
        """Graph mutation triggers."""

        @staticmethod
        def on_node_create(node_type: str = None) -> dict:
            """Fires when a node is created."""
            return {"type": "graph.node_create", "node_type": node_type}

        @staticmethod
        def on_link_create(nature: str = None) -> dict:
            """Fires when a link is created."""
            return {"type": "graph.link_create", "nature": nature}
