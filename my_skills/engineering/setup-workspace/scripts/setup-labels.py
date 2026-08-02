#!/usr/bin/env python3
"""Create requested workflow labels and leave existing labels unchanged."""
from __future__ import annotations
import argparse
import re
from lib import platform, require_success, run_cli

def parse_args() -> tuple[str, ...]:
    parser = argparse.ArgumentParser(description="Create missing workflow labels.")
    parser.add_argument("labels", nargs="+", help="Label names to create or retain.")
    return tuple(dict.fromkeys(parser.parse_args().labels))

def main() -> None:
    labels = parse_args()
    if platform() == "gitlab":
        for label in labels:
            result = run_cli(["glab", "label", "list"])
            exists = result.returncode == 0 and bool(
                re.search(rf"(?<!\w){re.escape(label)}(?!\w)", result.stdout)
            )
            if exists:
                print(f"label {label}: exists")
                continue
            result = run_cli(
                ["glab", "label", "create", "-n", label, "-c", "#808080"]
            )
            require_success(result, f"label {label}")
            print(f"label {label}: created")
        return
    result = run_cli(
        ["gh", "label", "list", "--json", "name", "--jq", ".[].name"]
    )
    existing = set(result.stdout.splitlines()) if result.returncode == 0 else set()
    for label in labels:
        if label in existing:
            print(f"label {label}: exists")
            continue
        result = run_cli(["gh", "label", "create", label, "--color", "808080"])
        require_success(result, f"label {label}")
        print(f"label {label}: created")

if __name__ == "__main__":
    main()
