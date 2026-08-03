#!/usr/bin/env python3
# 配置 main 分支保护
# 保护配置是无状态幂等操作，每次执行都按推荐配置写入，不跳过
# 示例：python3 protect-main.py [--platform github|gitlab]
from __future__ import annotations

import argparse

from lib import add_platform_argument, detect_platform, emit, run_entrypoint
from providers import provider


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Protect the main branch.")
    add_platform_argument(parser)
    parser.add_argument(
        "--approval",
        type=int,
        default=0,
        help="Required PR approvals; 0 for single-person, 1+ for teams.",
    )
    return parser.parse_args()


def main() -> int:
    args = parse_args()
    service = provider(detect_platform(args.platform))
    service.protect_main(args.approval)
    emit("created", "main branch protection", f"configured ({args.approval} approval)")
    return 0


if __name__ == "__main__":
    run_entrypoint(main)
