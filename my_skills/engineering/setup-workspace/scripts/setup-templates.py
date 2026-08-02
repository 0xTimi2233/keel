#!/usr/bin/env python3
"""Install issue templates without overwriting existing files."""
from __future__ import annotations
from pathlib import Path
import shutil
from lib import platform

SKILL_DIR = Path(__file__).resolve().parent.parent

def main() -> None:
    destination = (
        Path(".gitlab/issue_templates")
        if platform() == "gitlab"
        else Path(".github/ISSUE_TEMPLATE")
    )
    destination.mkdir(parents=True, exist_ok=True)
    for source in sorted((SKILL_DIR / "assets/issue-templates").glob("*.md")):
        target = destination / source.name
        if target.exists():
            print(f"issue template {source.name}: exists")
            continue
        shutil.copy2(source, target)
        print(f"issue template {source.name}: created")

if __name__ == "__main__":
    main()
