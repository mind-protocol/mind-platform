"""
Health Checks: create-doc-chain

Decorator-based health checks for doc chain completeness.
Source: capabilities/create-doc-chain/runtime/checks.py
Installed to: .mind/capabilities/create-doc-chain/runtime/checks.py
"""

from pathlib import Path

# These will be provided by mind.capability when implemented
# For now, define stubs that document the interface

class Signal:
    """Health check signal values."""
    HEALTHY = "healthy"
    DEGRADED = "degraded"
    CRITICAL = "critical"

    @classmethod
    def healthy(cls):
        return {"signal": cls.HEALTHY}

    @classmethod
    def degraded(cls, **data):
        return {"signal": cls.DEGRADED, **data}

    @classmethod
    def critical(cls, **data):
        return {"signal": cls.CRITICAL, **data}


class triggers:
    """Trigger builder namespace."""

    class file:
        @staticmethod
        def on_delete(pattern: str):
            return f"file.delete:{pattern}"

        @staticmethod
        def on_modify(pattern: str):
            return f"file.modify:{pattern}"

    class init:
        @staticmethod
        def after_scan():
            return "init.after_scan"

    class cron:
        @staticmethod
        def daily():
            return "cron.daily"


def check(id: str, triggers: list, on_problem: str, task: str):
    """
    Decorator to register a health check function.

    Args:
        id: Unique check identifier
        triggers: List of trigger patterns
        on_problem: Problem ID from VOCABULARY (e.g. "INCOMPLETE_CHAIN")
        task: Task template to create on failure (e.g. "TASK_create_doc")
    """
    def decorator(fn):
        fn.check_id = id
        fn.triggers = triggers
        fn.on_problem = on_problem
        fn.task = task
        return fn
    return decorator


# =============================================================================
# HEALTH CHECKS
# =============================================================================

EXPECTED_DOCS = {
    "OBJECTIVES", "PATTERNS", "VOCABULARY", "BEHAVIORS",
    "ALGORITHM", "VALIDATION", "IMPLEMENTATION", "HEALTH", "SYNC",
}

CRITICAL_DOCS = {"OBJECTIVES", "PATTERNS"}

PLACEHOLDER_PATTERNS = [
    "{placeholder}",
    "{Module}",
    "STATUS: STUB",
]


@check(
    id="chain_completeness",
    triggers=[
        triggers.file.on_delete("docs/**/*.md"),
        triggers.init.after_scan(),
        triggers.cron.daily(),
    ],
    on_problem="INCOMPLETE_CHAIN",
    task="TASK_create_doc",
)
def chain_completeness(ctx) -> dict:
    """
    H1: Check if module has complete doc chain.

    Returns CRITICAL if OBJECTIVES or PATTERNS missing.
    Returns DEGRADED if other docs missing.
    Returns HEALTHY if all docs present.
    """
    module_id = ctx.module_id
    docs_path = Path(f"docs/{module_id}")

    if not docs_path.exists():
        return Signal.critical(missing=list(EXPECTED_DOCS), module_id=module_id)

    # Find existing docs
    found = set()
    for doc_type in EXPECTED_DOCS:
        if (docs_path / f"{doc_type}.md").exists():
            found.add(doc_type)
        elif list(docs_path.glob(f"{doc_type}_*.md")):
            found.add(doc_type)

    missing = EXPECTED_DOCS - found

    if not missing:
        return Signal.healthy()

    if missing & CRITICAL_DOCS:
        return Signal.critical(missing=list(missing), module_id=module_id)

    return Signal.degraded(missing=list(missing), module_id=module_id)


@check(
    id="placeholder_detection",
    triggers=[
        triggers.file.on_modify("docs/**/*.md"),
        triggers.cron.daily(),
    ],
    on_problem="PLACEHOLDER_DOC",
    task="TASK_create_doc",
)
def placeholder_detection(ctx) -> dict:
    """
    H2: Detect unfilled placeholders in doc files.

    Returns CRITICAL if 10+ files have placeholders.
    Returns DEGRADED if any files have placeholders.
    Returns HEALTHY if no placeholders found.
    """
    if ctx.file_path:
        paths = [ctx.file_path]
    else:
        paths = list(Path("docs").rglob("*.md"))

    issues = []
    for path in paths:
        try:
            content = path.read_text()
            for pattern in PLACEHOLDER_PATTERNS:
                if pattern in content:
                    issues.append({"path": str(path), "pattern": pattern})
                    break  # One issue per file is enough
        except Exception:
            continue

    if not issues:
        return Signal.healthy()

    if len(issues) >= 10:
        return Signal.critical(issues=issues, count=len(issues))

    return Signal.degraded(issues=issues, count=len(issues))


# =============================================================================
# REGISTRY (collected by MCP loader)
# =============================================================================

CHECKS = [
    chain_completeness,
    placeholder_detection,
]
