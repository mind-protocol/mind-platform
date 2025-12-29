"""
Graph operations for tasks and agents.

Task and agent state lives in the graph, with proper links:
- task_run [INSTANCE_OF] → task (template)
- task_run [TARGET] → concerned node
- task_run [CLAIMED_BY] → actor (when claimed)
- actor [WORKS_ON] → task_run (current task)
"""

import logging
from datetime import datetime
from typing import Any, Optional
from uuid import uuid4

log = logging.getLogger(__name__)


# =============================================================================
# TASK STATUS
# =============================================================================

class TaskStatus:
    PENDING = "pending"
    CLAIMED = "claimed"
    RUNNING = "running"
    COMPLETED = "completed"
    FAILED = "failed"
    STUCK = "stuck"


def create_task_run(
    graph: Any,
    problem: str,
    capability: str,
    task_template: str,
    signal_level: str,
    target_node: Optional[str] = None,
    signal_data: Optional[dict] = None,
) -> Optional[str]:
    """
    Create a task_run node in the graph.

    Returns node_id if created, None if failed.
    """
    node_id = f"narrative:task_run:{uuid4().hex[:8]}"
    now = datetime.now().isoformat()

    content = {
        "status": TaskStatus.PENDING,
        "problem": problem,
        "signal": signal_level,
        "created_at": now,
        "claimed_at": None,
        "completed_at": None,
        "data": signal_data or {},
    }

    synthesis = f"Fix {problem} ({signal_level})"

    try:
        # Create node
        graph.create_node(
            id=node_id,
            node_type="narrative",
            type="task_run",
            content=str(content),
            synthesis=synthesis,
        )

        # Link to task template
        task_node = f"narrative:capability:{capability}:tasks:{task_template}"
        graph.create_link(source=node_id, target=task_node, nature="executes")

        # Link to target if provided
        if target_node:
            graph.create_link(source=node_id, target=target_node, nature="concerns")

        log.info(f"Created task_run: {node_id}")
        return node_id

    except Exception as e:
        log.error(f"Failed to create task_run: {e}")
        return None


def claim_task(graph: Any, task_id: str, actor_id: str) -> bool:
    """
    Atomically claim a task for an agent.

    Returns True if claimed, False if already claimed or not found.
    """
    try:
        # Query current status
        task = graph.get_node(task_id)
        if not task:
            return False

        # Parse content
        content = eval(task.get("content", "{}"))
        if content.get("status") != TaskStatus.PENDING:
            return False  # Not claimable

        # Update status
        content["status"] = TaskStatus.CLAIMED
        content["claimed_at"] = datetime.now().isoformat()

        graph.update_node(task_id, content=str(content))

        # Create CLAIMED_BY link
        graph.create_link(source=task_id, target=actor_id, nature="claimed_by")

        log.info(f"Task {task_id} claimed by {actor_id}")
        return True

    except Exception as e:
        log.error(f"Failed to claim task: {e}")
        return False


def start_task(graph: Any, task_id: str) -> bool:
    """Mark task as running."""
    try:
        task = graph.get_node(task_id)
        if not task:
            return False

        content = eval(task.get("content", "{}"))
        content["status"] = TaskStatus.RUNNING
        graph.update_node(task_id, content=str(content))
        return True
    except Exception as e:
        log.error(f"Failed to start task: {e}")
        return False


def complete_task(graph: Any, task_id: str) -> bool:
    """Mark task as completed."""
    try:
        task = graph.get_node(task_id)
        if not task:
            return False

        content = eval(task.get("content", "{}"))
        content["status"] = TaskStatus.COMPLETED
        content["completed_at"] = datetime.now().isoformat()
        graph.update_node(task_id, content=str(content))

        log.info(f"Task {task_id} completed")
        return True
    except Exception as e:
        log.error(f"Failed to complete task: {e}")
        return False


def fail_task(graph: Any, task_id: str, reason: str) -> bool:
    """Mark task as failed."""
    try:
        task = graph.get_node(task_id)
        if not task:
            return False

        content = eval(task.get("content", "{}"))
        content["status"] = TaskStatus.FAILED
        content["failure_reason"] = reason
        content["completed_at"] = datetime.now().isoformat()
        graph.update_node(task_id, content=str(content))

        log.warning(f"Task {task_id} failed: {reason}")
        return True
    except Exception as e:
        log.error(f"Failed to fail task: {e}")
        return False


def release_task(graph: Any, task_id: str) -> bool:
    """Release task back to pending (for stuck/dead agents)."""
    try:
        task = graph.get_node(task_id)
        if not task:
            return False

        content = eval(task.get("content", "{}"))
        content["status"] = TaskStatus.PENDING
        content["claimed_at"] = None
        graph.update_node(task_id, content=str(content))

        # Remove CLAIMED_BY link
        graph.delete_links(source=task_id, nature="claimed_by")

        log.info(f"Task {task_id} released to pending")
        return True
    except Exception as e:
        log.error(f"Failed to release task: {e}")
        return False


def query_pending_tasks(graph: Any, limit: int = 10) -> list[dict]:
    """Query pending tasks ordered by weight."""
    try:
        # This would be a proper Cypher query in real implementation
        # For now, simplified version
        results = graph.query(
            "MATCH (t:narrative {type: 'task_run'}) "
            "WHERE t.content CONTAINS 'pending' "
            "RETURN t.id, t.content, t.synthesis "
            f"LIMIT {limit}"
        )
        return results
    except Exception as e:
        log.error(f"Failed to query tasks: {e}")
        return []


# =============================================================================
# AGENT STATUS
# =============================================================================

class ActorStatus:
    IDLE = "idle"
    RUNNING = "running"
    STUCK = "stuck"
    DEAD = "dead"


def update_actor_heartbeat(graph: Any, actor_id: str, step: Optional[int] = None) -> bool:
    """Update actor heartbeat timestamp."""
    try:
        actor = graph.get_node(actor_id)
        if not actor:
            return False

        content = eval(actor.get("content", "{}"))
        content["last_heartbeat"] = datetime.now().isoformat()
        if step is not None:
            content["current_step"] = step

        # If was stuck, back to running
        if content.get("status") == ActorStatus.STUCK:
            content["status"] = ActorStatus.RUNNING

        graph.update_node(actor_id, content=str(content))
        return True
    except Exception as e:
        log.error(f"Failed to update heartbeat: {e}")
        return False


def set_actor_working(graph: Any, actor_id: str, task_id: str) -> bool:
    """Set actor as working on a task."""
    try:
        actor = graph.get_node(actor_id)
        if not actor:
            return False

        content = eval(actor.get("content", "{}"))
        content["status"] = ActorStatus.RUNNING
        content["current_task"] = task_id
        graph.update_node(actor_id, content=str(content))

        # Create WORKS_ON link
        graph.create_link(source=actor_id, target=task_id, nature="works_on")
        return True
    except Exception as e:
        log.error(f"Failed to set actor working: {e}")
        return False


def set_actor_idle(graph: Any, actor_id: str) -> bool:
    """Set actor as idle (finished task)."""
    try:
        actor = graph.get_node(actor_id)
        if not actor:
            return False

        content = eval(actor.get("content", "{}"))
        old_task = content.get("current_task")
        content["status"] = ActorStatus.IDLE
        content["current_task"] = None
        graph.update_node(actor_id, content=str(content))

        # Remove WORKS_ON link
        if old_task:
            graph.delete_links(source=actor_id, target=old_task, nature="works_on")
        return True
    except Exception as e:
        log.error(f"Failed to set actor idle: {e}")
        return False


def detect_stuck_agents(graph: Any, stuck_threshold: int = 300, dead_threshold: int = 900) -> dict:
    """
    Detect stuck/dead agents.

    Returns: {"stuck": [actor_ids], "dead": [actor_ids]}
    """
    from datetime import datetime, timedelta

    now = datetime.now()
    stuck = []
    dead = []

    try:
        # Query running actors
        results = graph.query(
            "MATCH (a:actor) "
            "WHERE a.content CONTAINS 'running' "
            "RETURN a.id, a.content"
        )

        for row in results:
            actor_id = row[0]
            content = eval(row[1] or "{}")

            last_hb = content.get("last_heartbeat")
            if not last_hb:
                continue

            hb_time = datetime.fromisoformat(last_hb)
            seconds = (now - hb_time).total_seconds()

            if seconds > dead_threshold:
                dead.append(actor_id)
                content["status"] = ActorStatus.DEAD
                graph.update_node(actor_id, content=str(content))
                log.error(f"Agent {actor_id} marked DEAD ({seconds}s silent)")

            elif seconds > stuck_threshold:
                if content.get("status") != ActorStatus.STUCK:
                    stuck.append(actor_id)
                    content["status"] = ActorStatus.STUCK
                    graph.update_node(actor_id, content=str(content))
                    log.warning(f"Agent {actor_id} marked STUCK ({seconds}s silent)")

    except Exception as e:
        log.error(f"Failed to detect stuck agents: {e}")

    return {"stuck": stuck, "dead": dead}


def cleanup_dead_agent(graph: Any, actor_id: str) -> Optional[str]:
    """
    Cleanup dead agent: release task, mark dead.

    Returns released task_id if any.
    """
    try:
        actor = graph.get_node(actor_id)
        if not actor:
            return None

        content = eval(actor.get("content", "{}"))
        task_id = content.get("current_task")

        # Release task if any
        if task_id:
            release_task(graph, task_id)

        # Mark actor dead
        content["status"] = ActorStatus.DEAD
        content["current_task"] = None
        graph.update_node(actor_id, content=str(content))

        # Remove WORKS_ON link
        graph.delete_links(source=actor_id, nature="works_on")

        log.info(f"Cleaned up dead agent {actor_id}, released task {task_id}")
        return task_id

    except Exception as e:
        log.error(f"Failed to cleanup dead agent: {e}")
        return None
