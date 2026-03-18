#!/usr/bin/env python3
"""Generate repository stats for mind-platform dashboard.

Scans all Mind Protocol repos and writes stats to data/repo_stats.json.
Run via cron every 24h or manually: python3 scripts/generate_repo_stats.py

Output: data/repo_stats.json
"""

import json
import subprocess
import time
from pathlib import Path
from datetime import datetime, timezone

HOME = Path("/home/mind-protocol")
OUTPUT = Path(__file__).parent.parent / "data" / "repo_stats.json"

REPOS = [
    # Core stack
    "mind-mcp", "mind-protocol", "mind-platform",
    # Universes
    "lumina-prime", "venezia", "contre-terre",
    # Products
    "graphcare", "scopelock", "beatfoundry", "the-blood-ledger",
    "scisense", "hri", "babys",
    # Tools
    "cities-of-light", "mind-ops", "ai_devboard",
    # Apps
    "mind-chrome-extension", "mind-desktop", "mind-app",
    # Creative
    "synthetic-souls",
]

CATEGORIES = {
    "core": ["mind-mcp", "mind-protocol", "mind-platform"],
    "universes": ["lumina-prime", "venezia", "contre-terre"],
    "products": ["graphcare", "scopelock", "beatfoundry", "the-blood-ledger", "scisense", "hri", "babys"],
    "apps": ["mind-chrome-extension", "mind-desktop", "mind-app"],
    "tools": ["cities-of-light", "mind-ops", "ai_devboard"],
    "creative": ["synthetic-souls"],
}


def get_repo_stats(name: str) -> dict | None:
    repo_path = HOME / name
    if not (repo_path / ".git").exists():
        return None

    try:
        commits = int(subprocess.run(
            ["git", "rev-list", "--all", "--count"],
            cwd=str(repo_path), capture_output=True, text=True, timeout=10,
        ).stdout.strip() or "0")

        files = int(subprocess.run(
            ["git", "ls-files"],
            cwd=str(repo_path), capture_output=True, text=True, timeout=10,
        ).stdout.strip().count("\n") + 1)

        # Lines of code (fast: wc on tracked files)
        ls_result = subprocess.run(
            ["git", "ls-files"],
            cwd=str(repo_path), capture_output=True, text=True, timeout=10,
        )
        tracked_files = [f for f in ls_result.stdout.strip().split("\n") if f]

        lines = 0
        if tracked_files:
            wc_result = subprocess.run(
                ["xargs", "wc", "-l"],
                input="\n".join(tracked_files),
                cwd=str(repo_path), capture_output=True, text=True, timeout=30,
            )
            last_line = wc_result.stdout.strip().split("\n")[-1]
            try:
                lines = int(last_line.split()[0])
            except (IndexError, ValueError):
                pass

        # Last commit date
        last_commit = subprocess.run(
            ["git", "log", "-1", "--format=%aI"],
            cwd=str(repo_path), capture_output=True, text=True, timeout=5,
        ).stdout.strip()

        # Top contributors (last 50 commits)
        contribs = subprocess.run(
            ["git", "shortlog", "-sn", "--all", "-50"],
            cwd=str(repo_path), capture_output=True, text=True, timeout=10,
        ).stdout.strip().split("\n")
        contributors = []
        for c in contribs[:5]:
            c = c.strip()
            if c:
                parts = c.split("\t", 1)
                if len(parts) == 2:
                    contributors.append({"count": int(parts[0].strip()), "name": parts[1].strip()})

        # Detect primary language
        extensions = {}
        for f in tracked_files[:500]:
            ext = Path(f).suffix.lower()
            if ext:
                extensions[ext] = extensions.get(ext, 0) + 1
        lang_map = {
            ".py": "Python", ".ts": "TypeScript", ".tsx": "TypeScript",
            ".js": "JavaScript", ".jsx": "JavaScript", ".rs": "Rust",
            ".go": "Go", ".md": "Markdown", ".yaml": "YAML", ".yml": "YAML",
            ".json": "JSON", ".html": "HTML", ".css": "CSS",
        }
        primary_lang = "Unknown"
        if extensions:
            top_ext = max(extensions, key=extensions.get)
            primary_lang = lang_map.get(top_ext, top_ext)

        # Category
        category = "other"
        for cat, repos in CATEGORIES.items():
            if name in repos:
                category = cat
                break

        return {
            "name": name,
            "commits": commits,
            "files": files,
            "lines": lines,
            "last_commit": last_commit,
            "contributors": contributors,
            "primary_language": primary_lang,
            "category": category,
        }

    except Exception as e:
        return {"name": name, "error": str(e)}


def main():
    stats = []
    totals = {"repos": 0, "commits": 0, "files": 0, "lines": 0}

    for name in REPOS:
        s = get_repo_stats(name)
        if s and "error" not in s:
            stats.append(s)
            totals["repos"] += 1
            totals["commits"] += s["commits"]
            totals["files"] += s["files"]
            totals["lines"] += s["lines"]

    # Sort by lines desc
    stats.sort(key=lambda x: x.get("lines", 0), reverse=True)

    output = {
        "generated_at": datetime.now(timezone.utc).isoformat(),
        "totals": totals,
        "categories": {cat: [r["name"] for r in stats if r.get("category") == cat] for cat in CATEGORIES},
        "repos": stats,
    }

    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    OUTPUT.write_text(json.dumps(output, indent=2))
    print(f"Stats written to {OUTPUT}")
    print(f"  {totals['repos']} repos · {totals['commits']} commits · {totals['files']} files · {totals['lines']:,} lines")


if __name__ == "__main__":
    main()
