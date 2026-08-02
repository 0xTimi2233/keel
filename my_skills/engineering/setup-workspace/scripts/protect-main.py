#!/usr/bin/env python3
"""Protect the main branch and leave existing protection unchanged."""
from __future__ import annotations
import json
from lib import gitlab_project_encoded, platform, require_success, run_cli

def gitlab_main_is_protected(output: str) -> bool:
    try:
        branches = json.loads(output)
    except json.JSONDecodeError:
        return False
    return isinstance(branches, list) and any(
        isinstance(branch, dict) and branch.get("name") == "main"
        for branch in branches
    )

def main() -> None:
    if platform() == "gitlab":
        project = gitlab_project_encoded()
        result = run_cli(["glab", "api", f"projects/{project}/protected_branches"])
        if result.returncode == 0 and gitlab_main_is_protected(result.stdout):
            print("branch protection main: exists")
            return
        result = run_cli(
            [
                "glab",
                "api",
                "--method",
                "POST",
                f"projects/{project}/protected_branches",
                "--field",
                "name=main",
                "--field",
                "push_access_level=0",
                "--field",
                "merge_access_level=40",
                "--field",
                "allow_force_push=false",
            ]
        )
        require_success(result, "branch protection main")
        print("branch protection main: created")
        return
    result = run_cli(["gh", "api", "repos/{owner}/{repo}/branches/main/protection"])
    if result.returncode == 0:
        print("branch protection main: exists")
        return
    payload = {
        "required_status_checks": {"strict": True, "contexts": []},
        "enforce_admins": True,
        "required_pull_request_reviews": {
            "required_approving_review_count": 1,
            "dismiss_stale_reviews": True,
        },
        "restrictions": None,
    }
    result = run_cli(
        [
            "gh",
            "api",
            "--method",
            "PUT",
            "repos/{owner}/{repo}/branches/main/protection",
            "--input",
            "-",
        ],
        input_text=json.dumps(payload),
    )
    require_success(result, "branch protection main")
    print("branch protection main: created")

if __name__ == "__main__":
    main()
