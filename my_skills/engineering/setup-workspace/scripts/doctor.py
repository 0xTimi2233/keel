#!/usr/bin/env python3
# 探测仓库工程设施现状：平台、标签、分支保护、issue 模板、CI、安全、权限
# 示例：python3 doctor.py [--platform github|gitlab]
from __future__ import annotations

import argparse
from pathlib import Path
from typing import Any, Callable
from urllib.parse import unquote

from lib import (
    ActionError,
    DEFAULT_LABELS,
GITLAB_SECURITY_TEMPLATES,
    Report,
    add_platform_argument,
    clean_detail,
    detect_platform,
    failure_status,
    report_file,
)
from providers import GitHub, GitLab

class DoctorArgumentParser(argparse.ArgumentParser):
    def error(self, message: str) -> None:
        raise ActionError("doctor", message)

def parse_args() -> argparse.Namespace:
    parser = DoctorArgumentParser(
        description="Inspect repository workflow infrastructure without changing it."
    )
    add_platform_argument(parser)
    return parser.parse_args()

def checked(item: str, inspection: Callable[[], Report]) -> Report:
    try:
        return inspection()
    except ActionError as error:
        return Report(failure_status(error), item, error.detail)
    except (OSError, UnicodeError) as error:
        return Report("unknown", item, clean_detail(str(error)))

def presence(item: str, exists: Callable[[], bool], missing: str) -> Report:
    return checked(
        item,
        lambda: Report("OK", item, "exists")
        if exists()
        else Report("missing", item, missing),
    )

def issue_template_reports(base: Path) -> list[Report]:
    if not base.is_dir():
        return [Report("missing", "issue templates", f"{base} does not exist")]
    names = sorted(item.name for item in base.iterdir() if item.is_file())
    if not names:
        return [Report("missing", "issue templates", "no template files")]
    return [Report("OK", "issue templates", ", ".join(names))]

def github_security_reports(repository: dict[str, Any]) -> list[Report]:
    security = repository.get("security_and_analysis")
    reports = []
    for key, item in (
        ("secret_scanning", "secret scanning"),
        ("secret_scanning_push_protection", "secret scanning push protection"),
    ):
        value = security.get(key) if isinstance(security, dict) else None
        status = value.get("status") if isinstance(value, dict) else None
        if status == "enabled":
            reports.append(Report("OK", item, "enabled"))
        elif status in ("disabled", None):
            reports.append(Report("missing", item, status or "not available"))
        else:
            reports.append(Report("unknown", item, f"reported {status}"))
    return reports

def github_permission_report(repository: dict[str, Any]) -> Report:
    permissions = repository.get("permissions")
    admin = permissions.get("admin") if isinstance(permissions, dict) else None
    if admin is True:
        return Report("OK", "Admin permission", "available")
    if admin is False:
        return Report("access-denied", "Admin permission", "required")
    return Report("unknown", "Admin permission", "not reported")

def github_reports() -> list[Report]:
    github = GitHub()
    reports = [Report("OK", "platform", "github")]
    for label in DEFAULT_LABELS:
        reports.append(
            presence(
                f"label {label}",
                lambda label=label: github.label_exists(label),
                "does not exist",
            )
        )
    reports.append(
        presence(
            "main branch protection",
            github.main_is_protected,
            "not configured",
        )
    )
    reports.extend(issue_template_reports(Path(".github/ISSUE_TEMPLATE")))
    reports.extend(
        (
            report_file(
                "security workflow", Path(".github/workflows/security.yml")
            ),
            report_file(
                "Dependabot configuration", Path(".github/dependabot.yml")
            ),
        )
    )

    try:
        repository = github.repository()
    except ActionError as error:
        status = failure_status(error)
        reports.extend(
            Report(status, item, error.detail)
            for item in (
                "secret scanning",
                "secret scanning push protection",
                "Admin permission",
            )
        )
    else:
        reports.extend(github_security_reports(repository))
        reports.append(github_permission_report(repository))

    reports.append(
        presence(
            "dependency security updates",
            github.automated_security_fixes_enabled,
            "disabled",
        )
    )
    return reports

def gitlab_permission_report(repository: dict[str, Any]) -> Report:
    permissions = repository.get("permissions")
    levels = []
    if isinstance(permissions, dict):
        for key in ("project_access", "group_access"):
            access = permissions.get(key)
            level = access.get("access_level") if isinstance(access, dict) else None
            if isinstance(level, int):
                levels.append(level)
    if not levels:
        return Report("unknown", "Maintainer permission", "not reported")
    level = max(levels)
    if level >= 40:
        return Report("OK", "Maintainer permission", f"access level {level}")
    return Report(
        "access-denied", "Maintainer permission", f"access level {level}; 40 required"
    )

def gitlab_ci_template_report(item: str, template: str) -> Report:
    path = Path(".gitlab-ci.yml")
    if not path.is_file():
        return Report("missing", item, ".gitlab-ci.yml does not exist")
    try:
        configured = template in path.read_text(encoding="utf-8")
    except (OSError, UnicodeError) as error:
        return Report("unknown", item, clean_detail(str(error)))
    if configured:
        return Report("OK", item, "configured")
    return Report("missing", item, "not configured")

def gitlab_reports() -> list[Report]:
    gitlab = GitLab()
    reports = [
        Report("OK", "platform", f"gitlab ({unquote(gitlab.project)})")
    ]
    for label in DEFAULT_LABELS:
        reports.append(
            presence(
                f"label {label}",
                lambda label=label: gitlab.label_exists(label),
                "does not exist",
            )
        )
    reports.append(
        presence(
            "main branch protection",
            gitlab.main_is_protected,
            "not configured",
        )
    )
    reports.extend(issue_template_reports(Path(".gitlab/issue_templates")))
    reports.append(report_file("GitLab CI configuration", Path(".gitlab-ci.yml")))
    for template in GITLAB_SECURITY_TEMPLATES:
        reports.append(
            gitlab_ci_template_report(
                template.removeprefix("Jobs/").removesuffix(".gitlab-ci.yml"),
                template,
            )
        )
    reports.append(
        checked(
            "Maintainer permission",
            lambda: gitlab_permission_report(gitlab.repository()),
        )
    )
    return reports

def unknown_platform_reports(error: ActionError) -> list[Report]:
    items = (
        "platform",
        "labels",
        "main branch protection",
        "issue templates",
        "CI configuration",
        "security settings",
        "repository permission",
    )
    return [Report("unknown", item, error.detail) for item in items]

def print_reports(reports: list[Report]) -> None:
    for report in reports:
        print(f"{report.status}: {report.item} - {report.detail}")

    problems: dict[str, list[str]] = {
        "missing": [],
        "access-denied": [],
        "unknown": [],
    }
    for report in reports:
        if report.status in problems:
            problems[report.status].append(report.item)
    detail = "; ".join(
        f"{status}={', '.join(items)}"
        for status, items in problems.items()
        if items
    )
    if detail:
        summary_status = next(
            status for status in problems if problems[status]
        )
        print(f"{summary_status}: summary - {detail}")
    else:
        print("OK: summary - all configured")

def main() -> int:
    args = parse_args()
    try:
        platform = detect_platform(args.platform)
        reports = gitlab_reports() if platform == "gitlab" else github_reports()
    except ActionError as error:
        reports = unknown_platform_reports(error)
    print_reports(reports)
    return 0

if __name__ == "__main__":
    try:
        main()
    except Exception as error:  # A diagnostic report must never fail the caller.
        print(f"unknown: doctor - {clean_detail(str(error))}")
    raise SystemExit(0)
