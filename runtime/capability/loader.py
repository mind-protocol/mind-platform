"""
Capability discovery and loading.
"""

import importlib.util
import logging
import sys
from pathlib import Path
from typing import Callable

log = logging.getLogger(__name__)

# Find mind-platform root for setting up imports
_this_file = Path(__file__).resolve()
_platform_root = _this_file.parent.parent.parent  # runtime/capability/loader.py -> runtime -> mind-platform


def load_checks(checks_file: Path) -> list[Callable]:
    """
    Load @check decorated functions from a checks.py file.

    Args:
        checks_file: Path to checks.py

    Returns:
        List of check functions with __check_meta__ attribute
    """
    if not checks_file.exists():
        log.warning(f"Checks file not found: {checks_file}")
        return []

    # Ensure mind-platform is in path for imports
    # We keep it in path permanently since checks may need runtime.capability at any time
    platform_path = str(_platform_root)
    if platform_path not in sys.path:
        sys.path.insert(0, platform_path)
        log.debug(f"Added {platform_path} to sys.path for capability imports")

    try:
        spec = importlib.util.spec_from_file_location(
            f"checks_{checks_file.parent.parent.name}",
            checks_file
        )
        module = importlib.util.module_from_spec(spec)
        spec.loader.exec_module(module)

        # Option 1: Explicit CHECKS list
        if hasattr(module, "CHECKS"):
            return module.CHECKS

        # Option 2: Auto-collected via decorator
        if hasattr(module, "__checks__"):
            return module.__checks__

        # Option 3: Scan for decorated functions
        checks = [
            obj for obj in vars(module).values()
            if callable(obj) and hasattr(obj, "__check_meta__")
        ]

        log.info(f"Loaded {len(checks)} checks from {checks_file}")
        return checks

    except Exception as e:
        log.error(f"Failed to load {checks_file}: {e}")
        return []


def discover_capabilities(caps_dir: Path) -> list[tuple[str, Path, list[Callable]]]:
    """
    Discover all capabilities with runtime/checks.py.

    Args:
        caps_dir: Path to capabilities directory (e.g., .mind/capabilities/)

    Returns:
        List of (capability_name, capability_path, checks) tuples
    """
    if not caps_dir.exists():
        log.warning(f"Capabilities directory not found: {caps_dir}")
        return []

    capabilities = []

    for cap_dir in sorted(caps_dir.iterdir()):
        if not cap_dir.is_dir():
            continue
        if cap_dir.name.startswith("_"):
            continue
        if cap_dir.name == "runtime":  # Skip the runtime infrastructure itself
            continue

        checks_file = cap_dir / "runtime" / "checks.py"
        if not checks_file.exists():
            log.debug(f"Capability {cap_dir.name} has no runtime/checks.py")
            continue

        checks = load_checks(checks_file)
        if checks:
            # Set capability name on each check
            for check_fn in checks:
                if hasattr(check_fn, "__check_meta__"):
                    check_fn.__check_meta__["capability"] = cap_dir.name

            capabilities.append((cap_dir.name, cap_dir, checks))
            log.info(f"Discovered capability: {cap_dir.name} ({len(checks)} checks)")

    return capabilities
