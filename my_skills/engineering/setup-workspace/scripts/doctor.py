#!/usr/bin/env python3
"""Report workspace infrastructure without changing repository configuration."""
from __future__ import annotations

import json
from pathlib import Path
import re
from urllib.parse import unquote

from lib import gitlab_project_encoded, platform, run_cli


Report = tuple[str, str, str]


def http_status(stderr: str) -> int | None:
    """Extract an HTTP status from gh/glab diagnostics when one is present."""
    match = re.search(r"(?:HTTP\s+|status(?: code)?[=: ]+)([1-5]\d\d)\b", stderr, re.I)
    if match:
        return int(match.group(1))
    match = re.search(r"\b(401|403|404)\b", stderr)
    return int(match.group(1)) if match else None


def api_failure(stderr: str, *, not_found: str = "missing") -> str:
    status = http_status(stderr)
    if status in (401, 403):
        return "access-denied"
    if status == 404:
        return not_found
    return "unknown"


def parse_json(text: str) -> object | None:
    try:
        return json.loads(text)
    except (json.JSONDecodeError, TypeError):
        return None


def compact_names(names: list[str]) -> str:
    if not names:
        return "none found"
    preview = ", ".join(names[:10])
    suffix = f" (+{len(names) - 10} more)" if len(names) > 10 else ""
    return f"{len(names)} found: {preview}{suffix}"


def local_file(item: str, path: Path) -> Report:
    if path.is_file():
        return "OK", item, f"{path} exists"
    return "missing", item, f"{path} does not exist"


def local_directory(item: str, path: Path) -> Report:
    if path.is_dir():
        return "OK", item, f"{path}/ exists"
    return "missing", item, f"{path}/ does not exist"


def github_labels() -> Report:
    result = run_cli(["gh", "label", "list", "--json", "name"])
    if result.returncode != 0:
        status = api_failure(result.stderr, not_found="unknown")
        return status, "labels", "could not inspect repository labels"
    data = parse_json(result.stdout)
    if not isinstance(data, list):
        return "unknown", "labels", "response was not valid JSON"
    names = sorted(
        item["name"]
        for item in data
        if isinstance(item, dict) and isinstance(item.get("name"), str)
    )
    status = "OK" if names else "missing"
    return status, "labels", compact_names(names)


def github_branch_protection() -> Report:
    result = run_cli(["gh", "api", "repos/{owner}/{repo}/branches/main/protection"])
    if result.returncode == 0:
        return "OK", "main branch protection", "configured"
    status = api_failure(result.stderr)
    detail = {
        "missing": "not configured",
        "access-denied": "API access denied",
        "unknown": "could not inspect protection",
    }[status]
    return status, "main branch protection", detail


def github_setting(item: str, endpoint: str, jq: str, expected: str) -> Report:
    result = run_cli(["gh", "api", endpoint, "--jq", jq])
    if result.returncode != 0:
        status = api_failure(result.stderr)
        detail = (
            "API access denied"
            if status == "access-denied"
            else "could not inspect setting"
        )
        return status, item, detail
    value = result.stdout.strip()
    if value == expected:
        return "OK", item, expected
    if value in ("false", "disabled", "null", ""):
        return "missing", item, value or "not configured"
    return "unknown", item, f"reported {value}"


def github_permissions() -> Report:
    result = run_cli(
        ["gh", "api", "repos/{owner}/{repo}", "--jq", ".permissions.admin"]
    )
    if result.returncode != 0:
        status = api_failure(result.stderr, not_found="unknown")
        return status, "Admin permission", "could not inspect repository permissions"
    value = result.stdout.strip()
    if value == "true":
        return "OK", "Admin permission", "available"
    if value == "false":
        return "access-denied", "Admin permission", "Admin permission is required"
    return "unknown", "Admin permission", "permission was not reported"


def github_reports() -> list[tuple[str, list[Report]]]:
    return [
        ("Platform", [("OK", "platform", "github")]),
        ("Labels", [github_labels()]),
        ("Branch protection", [github_branch_protection()]),
        (
            "Templates",
            [
                local_directory("issue templates", Path(".github/ISSUE_TEMPLATE")),
                local_file(
                    "pull request template", Path(".github/pull_request_template.md")
                ),
            ],
        ),
        (
            "CI",
            [
                local_file("security workflow", Path(".github/workflows/security.yml")),
                local_file("Dependabot configuration", Path(".github/dependabot.yml")),
            ],
        ),
        (
            "Security",
            [
                github_setting(
                    "secret scanning",
                    "repos/{owner}/{repo}/secret-scanning",
                    ".enabled",
                    "true",
                ),
                github_setting(
                    "secret scanning push protection",
                    "repos/{owner}/{repo}",
                    ".security_and_analysis.secret_scanning_push_protection.status",
                    "enabled",
                ),
                github_setting(
                    "dependency security updates",
                    "repos/{owner}/{repo}/automated-security-fixes",
                    ".enabled",
                    "true",
                ),
            ],
        ),
        ("Permissions", [github_permissions()]),
    ]


def gitlab_api(path: str, *, jq: str | None = None):
    args = ["glab", "api", path]
    if jq is not None:
        args.extend(["--jq", jq])
    return run_cli(args)


def gitlab_collection(item: str, endpoint: str, *, not_found: str = "unknown") -> Report:
    result = gitlab_api(endpoint)
    if result.returncode != 0:
        status = api_failure(result.stderr, not_found=not_found)
        detail = (
            "API access denied"
            if status == "access-denied"
            else "could not inspect collection"
        )
        return status, item, detail
    data = parse_json(result.stdout)
    if not isinstance(data, list):
        return "unknown", item, "response was not a JSON array"
    if not data:
        return "missing", item, "none found"
    names = []
    for entry in data:
        if not isinstance(entry, dict):
            continue
        name = entry.get("name") or entry.get("title")
        if isinstance(name, str):
            names.append(name)
    return "OK", item, compact_names(names) if names else f"{len(data)} found"


def gitlab_branch_protection(endpoint: str) -> Report:
    result = gitlab_api(endpoint)
    if result.returncode != 0:
        status = api_failure(result.stderr, not_found="unknown")
        return status, "main branch protection", "could not inspect protected branches"
    data = parse_json(result.stdout)
    if not isinstance(data, list):
        return "unknown", "main branch protection", "response was not a JSON array"
    protected = any(
        isinstance(branch, dict) and branch.get("name") == "main" for branch in data
    )
    if protected:
        return "OK", "main branch protection", "configured"
    return "missing", "main branch protection", "not configured"


def gitlab_ci_include(item: str, needle: str) -> Report:
    path = Path(".gitlab-ci.yml")
    if not path.is_file():
        return "missing", item, ".gitlab-ci.yml does not exist"
    try:
        present = needle in path.read_text(encoding="utf-8")
    except (OSError, UnicodeError):
        return "unknown", item, ".gitlab-ci.yml could not be read"
    if present:
        return "OK", item, f"includes {needle}"
    return "missing", item, f"does not include {needle}"


def gitlab_permissions(project: str) -> Report:
    result = gitlab_api(f"projects/{project}")
    if result.returncode != 0:
        status = api_failure(result.stderr, not_found="unknown")
        return status, "Maintainer permission", "could not inspect project permissions"
    data = parse_json(result.stdout)
    if not isinstance(data, dict) or not isinstance(data.get("permissions"), dict):
        return "unknown", "Maintainer permission", "permission was not reported"
    permissions = data["permissions"]
    levels = []
    for key in ("project_access", "group_access"):
        access = permissions.get(key)
        if isinstance(access, dict) and isinstance(access.get("access_level"), int):
            levels.append(access["access_level"])
    if not levels:
        return "unknown", "Maintainer permission", "permission was not reported"
    level = max(levels)
    if level >= 40:
        role = "Owner" if level >= 50 else "Maintainer"
        return "OK", "Maintainer permission", f"{role} access (level {level})"
    return (
        "access-denied",
        "Maintainer permission",
        f"Maintainer access is required (level {level})",
    )


def gitlab_reports() -> list[tuple[str, list[Report]]]:
    try:
        project = gitlab_project_encoded()
    except SystemExit:
        project = ""
    display_project = unquote(project) if project else "unknown"
    if not project:
        unknown = lambda item: ("unknown", item, "could not determine GitLab project")
        return [
            ("Platform", [("OK", "platform", "gitlab")]),
            ("Labels", [unknown("labels")]),
            ("Branch protection", [unknown("main branch protection")]),
            (
                "Templates",
                [
                    local_directory(
                        "issue templates", Path(".gitlab/issue_templates")
                    )
                ],
            ),
            (
                "CI",
                [
                    local_file("GitLab CI configuration", Path(".gitlab-ci.yml")),
                    gitlab_ci_include("SAST template", "Jobs/SAST.gitlab-ci.yml"),
                    gitlab_ci_include(
                        "dependency scanning template",
                        "Jobs/Dependency-Scanning.v2.gitlab-ci.yml",
                    ),
                ],
            ),
            ("Permissions", [unknown("Maintainer permission")]),
        ]
    return [
        ("Platform", [("OK", "platform", f"gitlab ({display_project})")]),
        ("Labels", [gitlab_collection("labels", f"projects/{project}/labels")]),
        (
            "Branch protection",
            [gitlab_branch_protection(f"projects/{project}/protected_branches")],
        ),
        (
            "Templates",
            [local_directory("issue templates", Path(".gitlab/issue_templates"))],
        ),
        (
            "CI",
            [
                local_file("GitLab CI configuration", Path(".gitlab-ci.yml")),
                gitlab_ci_include("SAST template", "Jobs/SAST.gitlab-ci.yml"),
                gitlab_ci_include(
                    "dependency scanning template",
                    "Jobs/Dependency-Scanning.v2.gitlab-ci.yml",
                ),
            ],
        ),
        ("Permissions", [gitlab_permissions(project)]),
    ]


def print_reports(groups: list[tuple[str, list[Report]]]) -> None:
    visible_groups = [(name, reports) for name, reports in groups if reports]
    for index, (_, reports) in enumerate(visible_groups):
        if index:
            print()
        for status, item, detail in reports:
            print(f"{status}: {item} - {detail}")

    problems: dict[str, list[str]] = {
        "missing": [],
        "access-denied": [],
        "unknown": [],
    }
    for _, reports in groups:
        for status, item, _ in reports:
            if status in problems and item not in problems[status]:
                problems[status].append(item)
    print()
    summaries = [
        f"{status}: {', '.join(items)}" for status, items in problems.items() if items
    ]
    print("; ".join(summaries) if summaries else "all configured")


def main() -> int:
    current_platform = platform()
    groups = gitlab_reports() if current_platform == "gitlab" else github_reports()
    print_reports(groups)
    return 0


if __name__ == "__main__":
    try:
        main()
    except Exception as error:  # A diagnostic report must never fail the caller.
        print(f"unknown: doctor - unexpected inspection error: {error}")
    raise SystemExit(0)
