#!/usr/bin/env python3
# GitHub / GitLab API 适配器：标签、分支保护、安全设置
# 库模块，被 doctor.py 与 setup-*.py import
from __future__ import annotations

import json
from typing import Any
from urllib.parse import quote

from lib import (
    ActionError,
    CommandResult,
    command_failure,
    gitlab_project_encoded,
    http_status,
    parse_json,
    require_success,
    run_cli,
)

class GitHub:
    repository_endpoint = "repos/{owner}/{repo}"

    def api(
        self,
        endpoint: str,
        *,
        method: str | None = None,
        payload: object | None = None,
    ) -> CommandResult:
        args = ["gh", "api"]
        if method is not None:
            args.extend(["--method", method])
        args.append(endpoint)
        input_text = None
        if payload is not None:
            args.extend(["--input", "-"])
            input_text = json.dumps(payload)
        return run_cli(args, input_text=input_text)

    def repository(self) -> dict[str, Any]:
        result = require_success(
            self.api(self.repository_endpoint), "repository inspection"
        )
        data = parse_json(result.stdout, "repository inspection")
        if not isinstance(data, dict):
            raise ActionError("repository inspection", "JSON response is not an object")
        return data

    def label_exists(self, name: str) -> bool:
        endpoint = f"{self.repository_endpoint}/labels/{quote(name, safe='')}"
        result = self.api(endpoint)
        if result.returncode == 0:
            return True
        if http_status(result) == 404:
            return False
        raise ActionError(f"label {name}", command_failure(result))

    def create_label(self, name: str, color: str = "#808080", description: str = "") -> None:
        require_success(
            self.api(
                f"{self.repository_endpoint}/labels",
                method="POST",
                payload={
                    "name": name,
                    "color": color.lstrip("#"),
                    "description": description,
                },
            ),
            f"label {name}",
        )

    def main_is_protected(self) -> bool:
        result = self.api(f"{self.repository_endpoint}/branches/main/protection")
        if result.returncode == 0:
            return True
        if http_status(result) == 404:
            return False
        raise ActionError("main branch protection", command_failure(result))

    def vulnerability_alerts_enabled(self) -> bool:
        result = self.api(f"{self.repository_endpoint}/vulnerability-alerts")
        if result.returncode == 0:
            return True
        if http_status(result) == 404:
            return False
        raise ActionError("dependency graph", command_failure(result))

    def enable_vulnerability_alerts(self) -> None:
        require_success(
            self.api(
                f"{self.repository_endpoint}/vulnerability-alerts", method="PUT"
            ),
            "dependency graph",
        )

    def protect_main(self, approval: int = 0) -> None:
        payload = {
            "required_status_checks": {"strict": True, "contexts": []},
            "enforce_admins": True,
            "required_pull_request_reviews": {
                "required_approving_review_count": approval,
                "dismiss_stale_reviews": True,
            },
            "restrictions": None,
            "allow_force_pushes": False,
        }
        require_success(
            self.api(
                f"{self.repository_endpoint}/branches/main/protection",
                method="PUT",
                payload=payload,
            ),
            "main branch protection",
        )

    def update_security_feature(self, feature: str) -> None:
        payload = {"security_and_analysis": {feature: {"status": "enabled"}}}
        require_success(
            self.api(self.repository_endpoint, method="PATCH", payload=payload),
            feature.replace("_", " "),
        )

    def automated_security_fixes_enabled(self) -> bool:
        result = self.api(f"{self.repository_endpoint}/automated-security-fixes")
        if result.returncode == 0:
            return True
        if http_status(result) == 404:
            return False
        raise ActionError("dependency security updates", command_failure(result))

    def enable_automated_security_fixes(self) -> None:
        require_success(
            self.api(
                f"{self.repository_endpoint}/automated-security-fixes",
                method="PUT",
            ),
            "dependency security updates",
        )

class GitLab:
    def __init__(self) -> None:
        self.project = gitlab_project_encoded()
        self.repository_endpoint = f"projects/{self.project}"

    def api(
        self,
        endpoint: str,
        *,
        method: str | None = None,
        fields: tuple[str, ...] = (),
    ) -> CommandResult:
        args = ["glab", "api", endpoint]
        if method is not None:
            args.extend(["--method", method])
        for field in fields:
            args.extend(["--field", field])
        return run_cli(args)

    def repository(self) -> dict[str, Any]:
        result = require_success(
            self.api(self.repository_endpoint), "project inspection"
        )
        data = parse_json(result.stdout, "project inspection")
        if not isinstance(data, dict):
            raise ActionError("project inspection", "JSON response is not an object")
        return data

    def label_exists(self, name: str) -> bool:
        endpoint = f"{self.repository_endpoint}/labels/{quote(name, safe='')}"
        result = self.api(endpoint)
        if result.returncode == 0:
            return True
        if http_status(result) == 404:
            return False
        raise ActionError(f"label {name}", command_failure(result))

    def create_label(self, name: str, color: str = "#808080", description: str = "") -> None:
        require_success(
            self.api(
                f"{self.repository_endpoint}/labels",
                method="POST",
                fields=(
                    f"name={name}",
                    f"color={color}",
                    f"description={description}",
                ),
            ),
            f"label {name}",
        )

    def main_is_protected(self) -> bool:
        result = self.api(f"{self.repository_endpoint}/protected_branches/main")
        if result.returncode == 0:
            return True
        if http_status(result) == 404:
            return False
        raise ActionError("main branch protection", command_failure(result))

    def protect_main(self, approval: int = 0) -> None:
        # approval 仅 GitHub 生效；GitLab 的批准规则不在此配置
        require_success(
            self.api(
                f"{self.repository_endpoint}/protected_branches",
                method="POST",
                fields=(
                    "name=main",
                    "push_access_level=0",
                    "merge_access_level=40",
                    "allow_force_push=false",
                ),
            ),
            "main branch protection",
        )

def provider(platform: str) -> GitHub | GitLab:
    return GitLab() if platform == "gitlab" else GitHub()
