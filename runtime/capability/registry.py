"""
Trigger registry: maps triggers to check functions.
"""

from collections import defaultdict
from fnmatch import fnmatch
from typing import Callable
import logging

log = logging.getLogger(__name__)


class TriggerRegistry:
    """Maps trigger types to check functions."""

    def __init__(self):
        self.checks: dict[str, list[dict]] = defaultdict(list)

    def register(self, trigger_type: str, trigger_match: str | None,
                 check_fn: Callable, capability: str):
        """
        Register a check function for a trigger type.

        Args:
            trigger_type: Type of trigger (e.g., "file.on_delete")
            trigger_match: Optional glob pattern for matching (e.g., "docs/**/*.md")
            check_fn: The check function to call
            capability: Name of the capability
        """
        self.checks[trigger_type].append({
            "match": trigger_match,
            "fn": check_fn,
            "capability": capability,
        })
        log.debug(f"Registered: {check_fn.__check_meta__['id']} on {trigger_type}")

    def register_check(self, check_fn: Callable, capability: str):
        """
        Register all triggers for a check function.

        Args:
            check_fn: Function with __check_meta__ attribute
            capability: Name of the capability
        """
        meta = check_fn.__check_meta__

        for trigger in meta["triggers"]:
            trigger_type = trigger["type"]
            trigger_match = trigger.get("match")
            self.register(trigger_type, trigger_match, check_fn, capability)

    def get_checks(self, trigger_type: str, payload: dict) -> list[tuple[Callable, str]]:
        """
        Get checks matching trigger type and payload.

        Args:
            trigger_type: Type of trigger that fired
            payload: Trigger payload (e.g., {"file_path": "docs/auth/PATTERNS.md"})

        Returns:
            List of (check_fn, capability) tuples
        """
        results = []

        for entry in self.checks.get(trigger_type, []):
            match_pattern = entry["match"]

            # If no match pattern, always match
            if match_pattern is None:
                results.append((entry["fn"], entry["capability"]))
                continue

            # If match pattern, check against file_path in payload
            file_path = payload.get("file_path", "")
            if file_path and fnmatch(str(file_path), match_pattern):
                results.append((entry["fn"], entry["capability"]))

        return results

    def get_all_triggers(self) -> list[str]:
        """Get all registered trigger types."""
        return list(self.checks.keys())

    def get_stats(self) -> dict:
        """Get registry statistics."""
        return {
            "trigger_types": len(self.checks),
            "total_checks": sum(len(v) for v in self.checks.values()),
            "by_type": {k: len(v) for k, v in self.checks.items()},
        }
