#!/usr/bin/env python3
# 创建缺失的推荐标签，已存在的保留
# 示例：python3 setup-labels.py [标签名...] [--platform github|gitlab]
from __future__ import annotations

import argparse

from lib import (
    DEFAULT_LABELS,
    LABEL_COLORS,
    add_platform_argument,
    detect_platform,
    emit,
    run_entrypoint,
)
from providers import provider

def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Create missing workflow labels.")
    add_platform_argument(parser)
    parser.add_argument(
        "labels",
        nargs="*",
        help="Label names; defaults to the skill's recommended workflow labels.",
    )
    return parser.parse_args()

def main() -> int:
    args = parse_args()
    labels = tuple(dict.fromkeys(args.labels or DEFAULT_LABELS))
    service = provider(detect_platform(args.platform))
    for label in labels:
        if service.label_exists(label):
            emit("exists", f"label {label}", "unchanged")
            continue
        service.create_label(label, LABEL_COLORS.get(label, "808080"))
        emit("created", f"label {label}", f"color {LABEL_COLORS.get(label, '808080')}")
    return 0

if __name__ == "__main__":
    run_entrypoint(main)
