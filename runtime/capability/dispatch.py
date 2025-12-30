"""
Trigger dispatch and task creation.

Two-level protection against infinite loops:

Level 1: Atomic graph ops (no task_run)
- AGENT_DEAD, TASK_ORPHAN, TASK_STUCK
- Direct graph update, log only
- Cannot loop

Level 2: Task with circuit breaker
- HEALTH_CHECK_FAILED and other problems
- Creates task_run
- If 3 failures in 24h → disable capability, alert human
"""

import logging
import signal
from collections import defaultdict
from contextlib import contextmanager
from datetime import datetime, timedelta
from pathlib import Path
from typing import Any, Callable
from uuid import uuid4

from .context import CheckContext
from .decorators import Signal
from .registry import TriggerRegistry
from .throttler import get_throttler

log = logging.getLogger(__name__)

# Level 1 problems: atomic ops, no task_run
ATOMIC_PROBLEMS = {"AGENT_DEAD", "TASK_ORPHAN", "TASK_STUCK", "AGENT_STUCK"}

# Circuit breaker config
CIRCUIT_BREAKER_THRESHOLD = 3  # failures before disable
CIRCUIT_BREAKER_WINDOW = timedelta(hours=24)

# Track failures per capability
_circuit_breaker_failures: dict[str, list[datetime]] = defaultdict(list)
_disabled_capabilities: set[str] = set()

# Timeout for check execution (seconds)
CHECK_TIMEOUT = 30


def check_circuit_breaker(capability_id: str, problem: str) -> bool:
    """
    Check if circuit breaker allows creating a task.

    Returns True if task can be created, False if circuit breaker is open.
    """
    if capability_id in _disabled_capabilities:
        log.warning(f"Circuit breaker OPEN for {capability_id}")
        return False

    # Clean old failures
    now = datetime.now()
    cutoff = now - CIRCUIT_BREAKER_WINDOW
    _circuit_breaker_failures[capability_id] = [
        t for t in _circuit_breaker_failures[capability_id] if t > cutoff
    ]

    return True


def record_circuit_breaker_failure(capability_id: str, problem: str) -> bool:
    """
    Record a failure and check if circuit breaker should trip.

    Returns True if capability was disabled, False otherwise.
    """
    now = datetime.now()
    _circuit_breaker_failures[capability_id].append(now)

    # Clean old failures
    cutoff = now - CIRCUIT_BREAKER_WINDOW
    recent = [t for t in _circuit_breaker_failures[capability_id] if t > cutoff]
    _circuit_breaker_failures[capability_id] = recent

    if len(recent) >= CIRCUIT_BREAKER_THRESHOLD:
        _disabled_capabilities.add(capability_id)
        log.error(
            f"CIRCUIT_BREAKER: Capability {capability_id} disabled after "
            f"{len(recent)} failures in {CIRCUIT_BREAKER_WINDOW}"
        )
        return True

    return False


def is_capability_disabled(capability_id: str) -> bool:
    """Check if a capability is disabled by circuit breaker."""
    return capability_id in _disabled_capabilities


def enable_capability(capability_id: str) -> None:
    """Re-enable a disabled capability (manual reset)."""
    _disabled_capabilities.discard(capability_id)
    _circuit_breaker_failures[capability_id] = []
    log.info(f"Capability {capability_id} re-enabled")


def get_disabled_capabilities() -> set[str]:
    """Get set of disabled capability IDs."""
    return _disabled_capabilities.copy()


@contextmanager
def timeout(seconds: int):
    """Context manager for timing out operations.

    Uses SIGALRM in main thread, or threading-based timeout in other threads.
    """
    import threading

    if threading.current_thread() is threading.main_thread():
        # Use signal-based timeout in main thread
        def handler(signum, frame):
            raise TimeoutError(f"Check timed out after {seconds}s")

        old_handler = signal.signal(signal.SIGALRM, handler)
        signal.alarm(seconds)
        try:
            yield
        finally:
            signal.alarm(0)
            signal.signal(signal.SIGALRM, old_handler)
    else:
        # In non-main thread, just yield (no timeout enforcement)
        # A more robust solution would use threading.Timer, but that
        # can't interrupt running code - only set a flag
        yield


def dispatch_trigger(
    trigger_type: str,
    payload: dict,
    registry: TriggerRegistry,
    target_dir: Path,
    graph: Any = None,
) -> list[tuple[Callable, dict]]:
    """
    Dispatch a trigger to matching checks.

    Args:
        trigger_type: Type of trigger (e.g., "file.on_delete")
        payload: Trigger payload (e.g., {"file_path": "docs/auth/PATTERNS.md"})
        registry: TriggerRegistry with registered checks
        target_dir: Project root directory
        graph: Optional graph connection

    Returns:
        List of (check_fn, signal_result) tuples
    """
    matching_checks = registry.get_checks(trigger_type, payload)
    results = []

    log.info(f"Trigger: {trigger_type} → {len(matching_checks)} checks")

    for check_fn, capability in matching_checks:
        meta = check_fn.__check_meta__

        try:
            # Build context
            ctx = CheckContext(
                trigger=trigger_type,
                trigger_source=payload.get("file_path", ""),
                capability=capability,
                timestamp=datetime.now(),
                module_id=payload.get("module_id"),
                file_path=Path(payload["file_path"]) if payload.get("file_path") else None,
                _target_dir=target_dir,
                _graph=graph,
            )

            # Execute with timeout
            with timeout(CHECK_TIMEOUT):
                result = check_fn(ctx)

            # Validate result
            if not isinstance(result, dict) or "signal" not in result:
                log.warning(f"Check {meta['id']} returned invalid result: {result}")
                continue

            results.append((check_fn, result))
            log.debug(f"Check {meta['id']}: {result['signal']}")

        except TimeoutError:
            log.error(f"Check {meta['id']} timed out after {CHECK_TIMEOUT}s")
        except Exception as e:
            log.error(f"Check {meta['id']} failed: {e}")

    return results


def handle_atomic_problem(
    problem: str,
    signal_result: dict,
    graph: Any,
) -> None:
    """
    Handle Level 1 problems with atomic graph ops.

    No task_run created - just direct graph update and log.
    Cannot loop.
    """
    target = signal_result.get("target") or signal_result.get("agent_id")

    if problem == "AGENT_DEAD":
        # Atomic: mark agent dead, release tasks
        agent_id = signal_result.get("agent_id")
        if agent_id and graph:
            try:
                from .graph_ops import cleanup_dead_agent
                cleanup_dead_agent(graph, agent_id)
            except Exception as e:
                log.error(f"Atomic AGENT_DEAD failed for {agent_id}: {e}")
        log.error(f"[AGENT] [DEAD] {target}")

    elif problem == "TASK_ORPHAN":
        # Atomic: release task back to pending
        task_id = signal_result.get("task_id")
        if task_id and graph:
            try:
                from .graph_ops import release_task
                release_task(graph, task_id)
            except Exception as e:
                log.error(f"Atomic TASK_ORPHAN failed for {task_id}: {e}")
        log.warning(f"[TASK] [ORPHAN_RELEASED] {target}")

    elif problem == "TASK_STUCK":
        # Atomic: mark task stuck
        task_id = signal_result.get("task_id")
        log.warning(f"[TASK] [STUCK] {target}")

    elif problem == "AGENT_STUCK":
        # Log only - requires investigation
        agent_id = signal_result.get("agent_id")
        log.warning(f"[AGENT] [STUCK] {target}")


def create_task_runs(
    results: list[tuple[Callable, dict]],
    graph: Any,
    caps_dir: Path,
) -> list[str]:
    """
    Create task_run nodes for non-healthy signals.

    Two-level protection:
    - Level 1 (ATOMIC_PROBLEMS): Direct graph ops, no task_run, cannot loop
    - Level 2: Task_run with circuit breaker (3 failures = disable capability)

    Throttler gates creation:
    - Dedup: same target+problem already active → skip
    - Queue limit: too many unclaimed tasks → skip
    - Rate limit: too many for this module/hour → skip

    Args:
        results: List of (check_fn, signal_result) from dispatch_trigger
        graph: Graph connection for creating nodes
        caps_dir: Path to capabilities directory

    Returns:
        List of created task_run node IDs
    """
    throttler = get_throttler()
    created_ids = []
    throttled = 0
    atomic_handled = 0

    for check_fn, signal_result in results:
        signal_level = signal_result.get("signal")

        # Skip healthy signals
        if signal_level == Signal.HEALTHY:
            continue

        meta = check_fn.__check_meta__
        capability = meta.get("capability", "unknown")
        module_id = signal_result.get("module_id", capability)
        problem = meta["on_problem"]
        target = signal_result.get("target") or signal_result.get("file_path")

        # Level 1: Atomic problems - no task_run
        if problem in ATOMIC_PROBLEMS:
            handle_atomic_problem(problem, signal_result, graph)
            atomic_handled += 1
            continue

        # Check circuit breaker before creating Level 2 task
        if not check_circuit_breaker(capability, problem):
            log.warning(f"Circuit breaker blocked: {problem} for {capability}")
            continue

        # Ask throttler before creating
        if not throttler.can_create(module_id, problem, target):
            log.debug(f"Throttled: {problem} for {module_id}")
            throttled += 1
            continue

        # Create task_run node
        node_id = f"narrative:task_run:{uuid4().hex[:8]}"

        # Build content
        content_parts = [
            f"# Problem: {meta['on_problem']}",
            f"",
            f"**Signal:** {signal_level}",
            f"**Capability:** {meta['capability']}",
            f"**Check:** {meta['id']}",
        ]

        # Add signal data
        signal_data = {k: v for k, v in signal_result.items() if k != "signal"}
        if signal_data:
            content_parts.append(f"**Data:** {signal_data}")

        content = "\n".join(content_parts)
        synthesis = f"Fix {meta['on_problem']} ({signal_level})"

        try:
            # Create node
            graph.create_node(
                id=node_id,
                node_type="narrative",
                type="task_run",
                content=content,
                synthesis=synthesis,
            )

            # Find and link to task template
            task_id = meta["task"]
            task_node = f"narrative:capability:{meta['capability']}:tasks:{task_id}"
            graph.create_link(
                source=node_id,
                target=task_node,
                nature="executes",
            )

            # Register with throttler
            throttler.register_create(node_id, module_id, problem, target)

            created_ids.append(node_id)
            log.info(f"Created task_run: {node_id} for {meta['on_problem']}")

        except Exception as e:
            log.error(f"Failed to create task_run: {e}")
            # Record failure for circuit breaker
            record_circuit_breaker_failure(capability, problem)

    if throttled:
        log.info(f"Throttled {throttled} task(s)")
    if atomic_handled:
        log.info(f"Handled {atomic_handled} atomic problem(s)")

    return created_ids


def run_checks(
    trigger_type: str,
    payload: dict,
    registry: TriggerRegistry,
    target_dir: Path,
    graph: Any = None,
    create_tasks: bool = True,
) -> dict:
    """
    Convenience function: dispatch trigger and optionally create tasks.

    Args:
        trigger_type: Type of trigger
        payload: Trigger payload
        registry: TriggerRegistry
        target_dir: Project root
        graph: Graph connection
        create_tasks: Whether to create task_run nodes

    Returns:
        Summary dict with results
    """
    results = dispatch_trigger(trigger_type, payload, registry, target_dir, graph)

    summary = {
        "trigger": trigger_type,
        "checks_run": len(results),
        "healthy": 0,
        "degraded": 0,
        "critical": 0,
        "task_runs": [],
    }

    for _, signal_result in results:
        level = signal_result.get("signal", "unknown")
        if level == Signal.HEALTHY:
            summary["healthy"] += 1
        elif level == Signal.DEGRADED:
            summary["degraded"] += 1
        elif level == Signal.CRITICAL:
            summary["critical"] += 1

    if create_tasks and graph:
        caps_dir = target_dir / ".mind" / "capabilities"
        task_ids = create_task_runs(results, graph, caps_dir)
        summary["task_runs"] = task_ids

    return summary
