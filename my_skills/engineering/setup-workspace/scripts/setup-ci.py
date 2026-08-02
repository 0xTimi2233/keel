#!/usr/bin/env python3
"""Install security CI and enable GitHub security settings."""
from __future__ import annotations
import json
from pathlib import Path
import shutil
from lib import platform, run_cli

SKILL_DIR = Path(__file__).resolve().parent.parent

def copy_if_missing(source: Path, destination: Path) -> str:
    if destination.exists():
        return "exists"
    shutil.copy2(source, destination)
    return "created"

def configure_github_setting(name: str, endpoint: str) -> None:
    current = run_cli(["gh", "api", endpoint, "--jq", ".enabled"])
    if current.returncode == 0 and current.stdout.strip() == "true":
        print(f"{name}: exists")
        return
    result = run_cli(
        ["gh", "api", "--method", "PUT", endpoint, "--input", "-"],
        input_text=json.dumps({"enabled": True}),
    )
    print(f"{name}: {'created' if result.returncode == 0 else 'skipped'}")

def configure_github_push_protection() -> None:
    endpoint = "repos/{owner}/{repo}"
    status_path = ".security_and_analysis.secret_scanning_push_protection.status"
    current = run_cli(["gh", "api", endpoint, "--jq", status_path])
    if current.returncode == 0 and current.stdout.strip() == "enabled":
        print("secret scanning push protection: exists")
        return
    payload = {
        "security_and_analysis": {
            "secret_scanning_push_protection": {"status": "enabled"}
        }
    }
    result = run_cli(
        ["gh", "api", "--method", "PATCH", endpoint, "--input", "-"],
        input_text=json.dumps(payload),
    )
    print(
        "secret scanning push protection: "
        f"{'created' if result.returncode == 0 else 'skipped'}"
    )

def main() -> None:
    if platform() == "gitlab":
        status = copy_if_missing(
            SKILL_DIR / "assets/gitlab-ci.yml", Path(".gitlab-ci.yml")
        )
        print(f"GitLab security CI: {status}")
        return
    github_dir = Path(".github")
    workflows_dir = github_dir / "workflows"
    workflows_dir.mkdir(parents=True, exist_ok=True)
    files = (
        ("Dependabot configuration", "assets/dependabot.yml", github_dir / "dependabot.yml"),
        ("Security workflow", "assets/workflows/security.yml", workflows_dir / "security.yml"),
    )
    for name, source, destination in files:
        status = copy_if_missing(SKILL_DIR / source, destination)
        print(f"{name}: {status}")
    configure_github_setting(
        "secret scanning", "repos/{owner}/{repo}/secret-scanning"
    )
    configure_github_push_protection()
    configure_github_setting(
        "dependency security updates",
        "repos/{owner}/{repo}/automated-security-fixes",
    )

if __name__ == "__main__":
    main()
