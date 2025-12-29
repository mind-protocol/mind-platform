"""
Trigger dispatch and task creation.
"""

import logging
import signal
from contextlib import contextmanager
from datetime import datetime
from pathlib import Path
from typing import Any, Callable
from uuid import uuid4

from .context import CheckContext
from .decorators import Signal
from .registry import TriggerRegistry
from .throttler import get_throttler

log = logging.getLogger(__name__)

# Timeout for check execution (seconds)
CHECK_TIMEOUT = 30


@contextmanager
def timeout(seconds: int):
    """Context manager for timing out operations."""
    def handler(signum, frame):
        raise TimeoutError(f"Check timed out after {seconds}s")

    old_handler = signal.signal(signal.SIGALRM, handler)
    signal.alarm(seconds)
    try:
        yield
    finally:
        signal.alarm(0)
        signal.signal(signal.SIGALRM, old_handler)


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


def create_task_runs(
    results: list[tuple[Callable, dict]],
    graph: Any,
    caps_dir: Path,
) -> list[str]:
    """
    Create task_run nodes for non-healthy signals.

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

    for check_fn, signal_result in results:
        signal_level = signal_result.get("signal")

        # Skip healthy signals
        if signal_level == Signal.HEALTHY:
            continue

        meta = check_fn.__check_meta__
        module_id = signal_result.get("module_id", meta.get("capability", "unknown"))
        problem = meta["on_problem"]
        target = signal_result.get("target") or signal_result.get("file_path")

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

    if throttled:
        log.info(f"Throttled {throttled} task(s)")

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
