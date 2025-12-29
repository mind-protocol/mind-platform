"""
Throttler: Rate limiting and deduplication for task_runs.

In-memory state for V1. Prevents:
- Duplicate tasks for same target+problem
- Too many concurrent agent tasks
- Runaway task creation when no agents active
"""

import time
from dataclasses import dataclass, field
from typing import Optional


@dataclass
class ThrottlerConfig:
    """Throttler configuration."""
    max_concurrent_agents: int = 5      # Max tasks claimed by agents
    max_pending_no_agent: int = 20      # Max unclaimed tasks (queue limit)
    max_per_module_hour: int = 10       # Rate limit per module
    dedup_window_seconds: int = 3600    # 1 hour dedup window


@dataclass
class TaskSlot:
    """Tracking info for an active task."""
    task_id: str
    module_id: str
    problem: str
    target: Optional[str]
    created_at: float
    claimed_by: Optional[str] = None
    claimed_at: Optional[float] = None


class Throttler:
    """
    Rate limiter and deduplicator for task_runs.

    Sits between health checks and the graph. When a check returns
    degraded/critical, dispatch asks throttler before creating task_run.
    """

    def __init__(self, config: Optional[ThrottlerConfig] = None):
        self.config = config or ThrottlerConfig()

        # Active tasks: task_id → TaskSlot
        self.active: dict[str, TaskSlot] = {}

        # Recent creations by module: module_id → [timestamps]
        self.recent_by_module: dict[str, list[float]] = {}

    def can_create(self, module_id: str, problem: str, target: Optional[str] = None) -> bool:
        """
        Check if a new task_run can be created.

        Blocks if:
        - Duplicate: same module+problem+target already active
        - Queue full: too many unclaimed tasks
        - Rate limit: too many tasks for this module in the hour
        """
        now = time.time()

        # 1. Dedup check: same target+problem already exists?
        for slot in self.active.values():
            if (slot.module_id == module_id and
                slot.problem == problem and
                slot.target == target):
                return False  # Duplicate

        # 2. Queue limit: count unclaimed tasks
        unclaimed = sum(1 for s in self.active.values() if s.claimed_by is None)
        if unclaimed >= self.config.max_pending_no_agent:
            return False  # Queue full

        # 3. Rate limit: max per module per hour
        self._prune_old_timestamps(module_id, now)
        recent = self.recent_by_module.get(module_id, [])
        if len(recent) >= self.config.max_per_module_hour:
            return False  # Rate limited

        return True

    def can_claim(self, task_id: str, agent_id: str) -> bool:
        """
        Check if an agent can claim a task.

        Blocks if:
        - Controller not allowing claims (paused/stopped/disabled)
        - Task doesn't exist or already claimed
        - Too many concurrent agent tasks
        """
        # Check controller kill switch
        from .agents import get_controller
        controller = get_controller()
        if not controller.can_claim():
            return False  # Kill switch active

        slot = self.active.get(task_id)
        if not slot:
            return False  # Task not found

        if slot.claimed_by is not None:
            return False  # Already claimed

        # Count currently claimed tasks
        claimed_count = sum(1 for s in self.active.values() if s.claimed_by is not None)
        if claimed_count >= self.config.max_concurrent_agents:
            return False  # Too many active agents

        return True

    def register_create(self, task_id: str, module_id: str, problem: str,
                        target: Optional[str] = None) -> None:
        """Register a newly created task_run."""
        now = time.time()

        self.active[task_id] = TaskSlot(
            task_id=task_id,
            module_id=module_id,
            problem=problem,
            target=target,
            created_at=now,
        )

        # Track for rate limiting
        if module_id not in self.recent_by_module:
            self.recent_by_module[module_id] = []
        self.recent_by_module[module_id].append(now)

    def register_claim(self, task_id: str, agent_id: str) -> bool:
        """Register an agent claiming a task. Returns False if not allowed."""
        if not self.can_claim(task_id, agent_id):
            return False

        slot = self.active[task_id]
        slot.claimed_by = agent_id
        slot.claimed_at = time.time()
        return True

    def on_complete(self, task_id: str) -> None:
        """Mark task as complete, freeing the slot."""
        if task_id in self.active:
            del self.active[task_id]

    def on_abandon(self, task_id: str) -> None:
        """Agent abandoned task, make it claimable again."""
        slot = self.active.get(task_id)
        if slot:
            slot.claimed_by = None
            slot.claimed_at = None

    def _prune_old_timestamps(self, module_id: str, now: float) -> None:
        """Remove timestamps older than the dedup window."""
        if module_id not in self.recent_by_module:
            return

        cutoff = now - self.config.dedup_window_seconds
        self.recent_by_module[module_id] = [
            ts for ts in self.recent_by_module[module_id]
            if ts > cutoff
        ]

    def get_stats(self) -> dict:
        """Get current throttler stats."""
        claimed = sum(1 for s in self.active.values() if s.claimed_by is not None)
        unclaimed = len(self.active) - claimed

        return {
            "active_total": len(self.active),
            "claimed_by_agents": claimed,
            "pending_unclaimed": unclaimed,
            "max_concurrent_agents": self.config.max_concurrent_agents,
            "max_pending": self.config.max_pending_no_agent,
        }


# Singleton instance
_throttler: Optional[Throttler] = None


def get_throttler() -> Throttler:
    """Get the global throttler instance."""
    global _throttler
    if _throttler is None:
        _throttler = Throttler()
    return _throttler


def reset_throttler(config: Optional[ThrottlerConfig] = None) -> Throttler:
    """Reset throttler (for testing)."""
    global _throttler
    _throttler = Throttler(config)
    return _throttler
