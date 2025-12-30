"""
Read-only context passed to check functions.
"""

from dataclasses import dataclass, field
from datetime import datetime
from pathlib import Path
from typing import Optional, Any
import logging


@dataclass
class CheckContext:
    """Read-only context passed to @check functions."""

    # Trigger info
    trigger: str
    trigger_source: str
    capability: str
    timestamp: datetime = field(default_factory=datetime.now)

    # Payload (varies by trigger type)
    module_id: Optional[str] = None
    file_path: Optional[Path] = None

    # Injected by MCP (private)
    _target_dir: Path = None
    _graph: Any = None  # GraphOps

    @property
    def project_root(self) -> Path:
        """Get the project root directory."""
        return self._target_dir or Path(".")

    def list_files(self, pattern: str) -> list[Path]:
        """List files matching glob pattern relative to project root."""
        if self._target_dir is None:
            return []
        return list(self._target_dir.glob(pattern))

    def read_file(self, path: Path) -> str:
        """Read file contents relative to project root."""
        if self._target_dir is None:
            raise RuntimeError("Context not initialized with target_dir")
        full_path = self._target_dir / path if not path.is_absolute() else path
        return full_path.read_text()

    def file_exists(self, path: Path) -> bool:
        """Check if file exists relative to project root."""
        if self._target_dir is None:
            return False
        full_path = self._target_dir / path if not path.is_absolute() else path
        return full_path.exists()

    def query_graph(self, **filters) -> list:
        """Query graph nodes (requires graph connection)."""
        if self._graph is None:
            raise RuntimeError("Context not initialized with graph")
        return self._graph.query(**filters)

    def log(self, level: str, msg: str):
        """Log a message."""
        logger = logging.getLogger(f"capability.{self.capability}")
        log_level = getattr(logging, level.upper(), logging.INFO)
        logger.log(log_level, msg)
