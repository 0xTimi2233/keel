#!/usr/bin/env python3
# 配置 main 分支保护，已配置的保留
# 示例：python3 protect-main.py [--platform github|gitlab]
from __future__ import annotations

import argparse

from lib import add_platform_argument, detect_platform, emit, run_entrypoint
from providers import provider

def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Protect the main branch.")
    add_platform_argument(parser)
    return parser.parse_args()

def main() -> int:
    args = parse_args()
    service = provider(detect_platform(args.platform))
    if service.main_is_protected():
        emit("exists", "main branch protection", "unchanged")
        return 0
    service.protect_main()
    emit("created", "main branch protection", "configured")
    return 0

if __name__ == "__main__":
    run_entrypoint(main)
