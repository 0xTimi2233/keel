#!/usr/bin/env python3
# 写入 issue 模板（assets/issue-templates 下所有文件），不覆盖已存在的
# 示例：python3 setup-templates.py [--platform github|gitlab]
from __future__ import annotations

import argparse
from pathlib import Path

from lib import (
    ActionError,
    SKILL_DIR,
    add_platform_argument,
    detect_platform,
    emit,
    install_file,
    run_entrypoint,
)

def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Install issue templates.")
    add_platform_argument(parser)
    return parser.parse_args()

def main() -> int:
    args = parse_args()
    platform = detect_platform(args.platform)
    destination = (
        Path(".gitlab/issue_templates")
        if platform == "gitlab"
        else Path(".github/ISSUE_TEMPLATE")
    )
    sources = sorted((SKILL_DIR / "assets/issue-templates" / platform).glob("*"))
    if not sources:
        raise ActionError("issue templates", "no template assets found")
    for source in sources:
        item = f"issue template {source.name}"
        status = install_file(source, destination / source.name, item)
        emit(status, item, "installed" if status == "created" else "unchanged")
    return 0

if __name__ == "__main__":
    run_entrypoint(main)
