"""
Agent registry and controller.

Tracks running agents, heartbeats, stuck detection.
Provides kill switch with 4 levels: pause, stop, kill, disable.
"""

import logging
import time
from dataclasses import dataclass
from datetime import datetime
from enum import Enum
from typing import Optional

log = logging.getLogger(__name__)


class AgentMode(Enum):
    """Agent controller modes."""
    ACTIVE = "active"       # Normal operation
    PAUSED = "paused"       # No new claims, running finish
    STOPPED = "stopped"     # No new claims, stop after current step
    DISABLED = "disabled"   # Persist off until enable


class AgentStatus(Enum):
    """Individual agent status."""
    IDLE = "idle"
    RUNNING = "running"
    STUCK = "stuck"
    DEAD = "dead"
    KILLED = "killed"


@dataclass
class AgentState:
    """State of a running agent."""
    agent_id: str
    actor_id: str               # Node in graph (actor:agent_*)
    task_id: Optional[str]      # Current task_run being worked
    status: AgentStatus
    started_at: datetime
    last_heartbeat: datetime
    current_step: Optional[int] = None
    step_started_at: Optional[datetime] = None

    def seconds_since_heartbeat(self) -> float:
        return (datetime.now() - self.last_heartbeat).total_seconds()

    def to_dict(self) -> dict:
        return {
            "agent_id": self.agent_id,
            "actor_id": self.actor_id,
            "task_id": self.task_id,
            "status": self.status.value,
            "started_at": self.started_at.isoformat(),
            "last_heartbeat": self.last_heartbeat.isoformat(),
            "current_step": self.current_step,
            "seconds_since_heartbeat": round(self.seconds_since_heartbeat()),
        }


@dataclass
class AgentConfig:
    """Agent controller configuration."""
    heartbeat_interval: int = 60        # Expected heartbeat frequency (seconds)
    stuck_threshold: int = 300          # 5 min: mark as stuck
    release_threshold: int = 600        # 10 min: auto-release task
    max_concurrent: int = 5             # Max running agents


class AgentRegistry:
    """
    Registry of running agents.

    Tracks agent states, heartbeats, stuck detection.
    """

    def __init__(self, config: Optional[AgentConfig] = None):
        self.config = config or AgentConfig()
        self.agents: dict[str, AgentState] = {}

    def register(self, agent_id: str, actor_id: str) -> AgentState:
        """Register a new agent."""
        now = datetime.now()
        state = AgentState(
            agent_id=agent_id,
            actor_id=actor_id,
            task_id=None,
            status=AgentStatus.IDLE,
            started_at=now,
            last_heartbeat=now,
        )
        self.agents[agent_id] = state
        log.info(f"Agent registered: {agent_id}")
        return state

    def heartbeat(self, agent_id: str, step: Optional[int] = None) -> bool:
        """Update agent heartbeat. Returns False if agent not found."""
        state = self.agents.get(agent_id)
        if not state:
            return False

        state.last_heartbeat = datetime.now()
        if step is not None:
            state.current_step = step
            state.step_started_at = datetime.now()

        # If was stuck, back to running
        if state.status == AgentStatus.STUCK:
            state.status = AgentStatus.RUNNING
            log.info(f"Agent {agent_id} recovered from stuck")

        return True

    def claim_task(self, agent_id: str, task_id: str) -> bool:
        """Agent claims a task."""
        state = self.agents.get(agent_id)
        if not state:
            return False

        if state.status not in [AgentStatus.IDLE, AgentStatus.RUNNING]:
            return False

        state.task_id = task_id
        state.status = AgentStatus.RUNNING
        state.current_step = 0
        state.step_started_at = datetime.now()
        log.info(f"Agent {agent_id} claimed task {task_id}")
        return True

    def complete_task(self, agent_id: str) -> Optional[str]:
        """Agent completed current task. Returns task_id."""
        state = self.agents.get(agent_id)
        if not state:
            return None

        task_id = state.task_id
        state.task_id = None
        state.status = AgentStatus.IDLE
        state.current_step = None
        state.step_started_at = None
        log.info(f"Agent {agent_id} completed task {task_id}")
        return task_id

    def fail_task(self, agent_id: str, reason: str) -> Optional[str]:
        """Agent failed current task. Returns task_id."""
        state = self.agents.get(agent_id)
        if not state:
            return None

        task_id = state.task_id
        state.task_id = None
        state.status = AgentStatus.IDLE
        state.current_step = None
        log.warning(f"Agent {agent_id} failed task {task_id}: {reason}")
        return task_id

    def unregister(self, agent_id: str) -> None:
        """Remove agent from registry."""
        if agent_id in self.agents:
            del self.agents[agent_id]
            log.info(f"Agent unregistered: {agent_id}")

    def check_stuck(self) -> list[str]:
        """Check for stuck agents. Returns list of stuck agent_ids."""
        stuck = []
        now = datetime.now()

        for agent_id, state in self.agents.items():
            if state.status != AgentStatus.RUNNING:
                continue

            seconds = state.seconds_since_heartbeat()

            if seconds > self.config.release_threshold:
                # Auto-release: too long without heartbeat
                log.error(f"Agent {agent_id} auto-released after {seconds}s")
                state.status = AgentStatus.DEAD
                stuck.append(agent_id)

            elif seconds > self.config.stuck_threshold:
                # Mark stuck but don't release yet
                if state.status != AgentStatus.STUCK:
                    log.warning(f"Agent {agent_id} stuck ({seconds}s since heartbeat)")
                    state.status = AgentStatus.STUCK
                    stuck.append(agent_id)

        return stuck

    def list_agents(self) -> list[dict]:
        """List all agents with status."""
        self.check_stuck()  # Update stuck status
        return [state.to_dict() for state in self.agents.values()]

    def get_agent(self, agent_id: str) -> Optional[dict]:
        """Get single agent status."""
        state = self.agents.get(agent_id)
        if state:
            return state.to_dict()
        return None

    def count_by_status(self) -> dict[str, int]:
        """Count agents by status."""
        counts = {s.value: 0 for s in AgentStatus}
        for state in self.agents.values():
            counts[state.status.value] += 1
        return counts


class AgentController:
    """
    Kill switch for agents (memory only, resets on MCP restart).

    4 levels:
    - ACTIVE: Normal operation
    - PAUSED: No new claims, running agents finish
    - STOPPED: No new claims, stop after current step
    - DISABLED: Agents stopped until enable() called

    Not persisted: MCP restart = agents enabled.
    If you want permanent disable, stop the MCP.
    """

    def __init__(self):
        self._mode = AgentMode.ACTIVE

    @property
    def mode(self) -> AgentMode:
        return self._mode

    def pause(self) -> None:
        """Pause: no new claims, running finish."""
        self._mode = AgentMode.PAUSED
        log.info("Agents PAUSED: no new claims, running will finish")

    def stop(self) -> None:
        """Stop: no new claims, stop after current step."""
        self._mode = AgentMode.STOPPED
        log.info("Agents STOPPED: stop after current step")

    def kill(self, registry: AgentRegistry) -> list[str]:
        """Kill: immediate stop, release all tasks."""
        self._mode = AgentMode.DISABLED
        killed = []
        for agent_id, state in registry.agents.items():
            if state.status == AgentStatus.RUNNING:
                state.status = AgentStatus.KILLED
                killed.append(agent_id)
        log.warning(f"Agents KILLED: {len(killed)} agents stopped immediately")
        return killed

    def enable(self) -> None:
        """Enable: resume normal operation."""
        self._mode = AgentMode.ACTIVE
        log.info("Agents ENABLED: normal operation resumed")

    def can_claim(self) -> bool:
        """Can agents claim new tasks?"""
        return self._mode == AgentMode.ACTIVE

    def can_continue_step(self) -> bool:
        """Can agents continue to next step?"""
        return self._mode in [AgentMode.ACTIVE, AgentMode.PAUSED]

    def must_stop_now(self) -> bool:
        """Must agents stop immediately?"""
        return self._mode in [AgentMode.STOPPED, AgentMode.DISABLED]

    def get_status(self) -> dict:
        """Get controller status."""
        return {
            "mode": self._mode.value,
            "can_claim": self.can_claim(),
            "can_continue": self.can_continue_step(),
            "must_stop": self.must_stop_now(),
        }


# Singletons
_registry: Optional[AgentRegistry] = None
_controller: Optional[AgentController] = None


def get_registry() -> AgentRegistry:
    """Get global agent registry."""
    global _registry
    if _registry is None:
        _registry = AgentRegistry()
    return _registry


def get_controller() -> AgentController:
    """Get global agent controller."""
    global _controller
    if _controller is None:
        _controller = AgentController()
    return _controller


def reset_agents() -> tuple[AgentRegistry, AgentController]:
    """Reset registry and controller (for testing)."""
    global _registry, _controller
    _registry = AgentRegistry()
    _controller = AgentController()
    return _registry, _controller
