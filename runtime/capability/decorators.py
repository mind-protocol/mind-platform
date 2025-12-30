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
    def healthy(cls, **data) -> dict:
        """All good, no action needed. Optionally include metadata."""
        return {"signal": cls.HEALTHY, **data}

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
        # Handle dynamic loading where module might not be in sys.modules yet
        module_name = fn.__module__
        if module_name in sys.modules:
            module = sys.modules[module_name]
            if not hasattr(module, "__checks__"):
                module.__checks__ = []
            module.__checks__.append(fn)
        # If module not in sys.modules, loader will collect via hasattr check

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

        @staticmethod
        def on_move(match: str) -> dict:
            """Fires when a file matching pattern is moved/renamed."""
            return {"type": "file.on_move", "match": match}

    class event:
        """Custom event triggers."""

        @staticmethod
        def on(name: str) -> dict:
            """Fires on custom event."""
            return {"type": f"event.{name}"}

        @staticmethod
        def after_ingest() -> dict:
            """Fires after graph ingestion."""
            return {"type": "event.after_ingest"}

    class hook:
        """Hook triggers (Mind hooks)."""

        @staticmethod
        def on(name: str) -> dict:
            """Fires on named hook."""
            return {"type": f"hook.{name}"}

        @staticmethod
        def post_commit() -> dict:
            """Fires after commit hook."""
            return {"type": "hook.post_commit"}

        @staticmethod
        def pre_commit() -> dict:
            """Fires before commit hook."""
            return {"type": "hook.pre_commit"}

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
        def weekly() -> dict:
            """Fires once per week."""
            return {"type": "cron.weekly"}

        @staticmethod
        def hourly() -> dict:
            """Fires once per hour."""
            return {"type": "cron.hourly"}

        @staticmethod
        def every(minutes: int) -> dict:
            """Fires every N minutes."""
            return {"type": f"cron.every_{minutes}m"}

    class git:
        """Git event triggers."""

        @staticmethod
        def post_commit() -> dict:
            """Fires after a git commit."""
            return {"type": "git.post_commit"}

        @staticmethod
        def pre_commit() -> dict:
            """Fires before a git commit."""
            return {"type": "git.pre_commit"}

    class ci:
        """CI/CD event triggers."""

        @staticmethod
        def pull_request() -> dict:
            """Fires on pull request events."""
            return {"type": "ci.pull_request"}

        @staticmethod
        def push() -> dict:
            """Fires on push events."""
            return {"type": "ci.push"}

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

    class stream:
        """Log/stream triggers."""

        @staticmethod
        def on_error(match: str) -> dict:
            """Fires when error pattern detected in log stream."""
            return {"type": "stream.on_error", "match": match}

        @staticmethod
        def on_pattern(match: str, pattern: str) -> dict:
            """Fires when pattern detected in log stream."""
            return {"type": "stream.on_pattern", "match": match, "pattern": pattern}
