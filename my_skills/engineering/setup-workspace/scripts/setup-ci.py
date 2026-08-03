#!/usr/bin/env python3
# 生成 CI 与安全配置
# GitHub：写 dependabot.yml 与 security.yml，启用 secret scanning、push protection、依赖安全更新
# GitLab：写 .gitlab-ci.yml，include 官方 SAST 与依赖扫描模板
# 限制：GitLab 的 include 结构复杂或重复时无法安全合并，报失败需手工合并
# 外部依赖：dependabot.yml 配置 Dependabot 服务，维护 action SHA，语言确定后补对应生态
# 示例：python3 setup-ci.py [--platform github|gitlab]
from __future__ import annotations

import argparse
from pathlib import Path
import re
from typing import Any

from lib import (
    ActionError,
    GITLAB_SECURITY_TEMPLATES,
    SKILL_DIR,
    add_platform_argument,
    clean_detail,
    detect_platform,
    emit,
    install_file,
    run_entrypoint,
)
from providers import GitHub

def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Install security CI and enable repository security settings."
    )
    add_platform_argument(parser)
    return parser.parse_args()

def ensure_gitlab_ci() -> str:
    # 已有 include 为列表形式时补入缺失模板；结构复杂或重复时无法安全合并，报失败需手工合并
    source = SKILL_DIR / "assets/gitlab/gitlab-ci.yml"
    destination = Path(".gitlab-ci.yml")
    if not destination.exists():
        return install_file(source, destination, "GitLab security CI")
    if not destination.is_file():
        raise ActionError("GitLab security CI", ".gitlab-ci.yml is not a file")
    try:
        text = destination.read_text(encoding="utf-8")
    except (OSError, UnicodeError) as error:
        raise ActionError("GitLab security CI", clean_detail(str(error))) from error

    missing = [
        template for template in GITLAB_SECURITY_TEMPLATES if template not in text
    ]
    if not missing:
        return "exists"

    lines = text.splitlines(keepends=True)
    include_indexes = [
        index
        for index, line in enumerate(lines)
        if re.match(r"^include:\s*(?:#.*)?(?:\r?\n)?$", line)
    ]
    if not include_indexes:
        separator = "" if not text or text.endswith("\n") else "\n"
        addition = "include:\n" + "".join(
            f"  - template: {template}\n" for template in missing
        )
        updated = f"{text}{separator}{addition}"
    elif len(include_indexes) == 1:
        start = include_indexes[0]
        end = len(lines)
        first_content = None
        for index in range(start + 1, len(lines)):
            stripped = lines[index].strip()
            if not stripped or stripped.startswith("#"):
                continue
            if not lines[index][0].isspace():
                end = index
                break
            if first_content is None:
                first_content = stripped
        if first_content is not None and not first_content.startswith("-"):
            raise ActionError(
                "GitLab security CI",
                "existing include mapping is not a list; merge the asset manually",
            )
        additions = [f"  - template: {template}\n" for template in missing]
        lines[end:end] = additions
        updated = "".join(lines)
    else:
        raise ActionError(
            "GitLab security CI",
            "multiple top-level include blocks found; merge the asset manually",
        )

    try:
        destination.write_text(updated, encoding="utf-8")
    except OSError as error:
        raise ActionError("GitLab security CI", clean_detail(str(error))) from error
    return "updated"

def security_status(repository: dict[str, Any], feature: str) -> str | None:
    security = repository.get("security_and_analysis")
    value = security.get(feature) if isinstance(security, dict) else None
    return value.get("status") if isinstance(value, dict) else None

def configure_github() -> None:
    github = GitHub()
    files = (
        (
            "Dependabot configuration",
            SKILL_DIR / "assets/github/dependabot.yml",
            Path(".github/dependabot.yml"),
        ),
        (
            "security workflow",
            SKILL_DIR / "assets/github/workflows/security.yml",
            Path(".github/workflows/security.yml"),
        ),
    )
    for item, source, destination in files:
        status = install_file(source, destination, item)
        emit(status, item, "installed" if status == "created" else "unchanged")

    repository = github.repository()
    if repository.get("visibility") != "public":
        emit("skipped", "secret scanning", "requires paid plan on private repositories")
        emit("skipped", "secret scanning push protection", "requires paid plan on private repositories")
        emit("skipped", "dependency graph", "requires paid plan on private repositories")
        emit("skipped", "dependency security updates", "requires paid plan on private repositories")
        return

    if github.vulnerability_alerts_enabled():
        emit("exists", "dependency graph", "enabled")
    else:
        github.enable_vulnerability_alerts()
        emit("created", "dependency graph", "enabled")

    for feature, item in (
        ("secret_scanning", "secret scanning"),
        ("secret_scanning_push_protection", "secret scanning push protection"),
    ):
        if security_status(repository, feature) == "enabled":
            emit("exists", item, "enabled")
            continue
        github.update_security_feature(feature)
        emit("created", item, "enabled")

    if github.automated_security_fixes_enabled():
        emit("exists", "dependency security updates", "enabled")
    else:
        github.enable_automated_security_fixes()
        emit("created", "dependency security updates", "enabled")

def main() -> int:
    args = parse_args()
    if detect_platform(args.platform) == "gitlab":
        status = ensure_gitlab_ci()
        detail = "security templates configured" if status != "exists" else "unchanged"
        emit(status, "GitLab security CI", detail)
    else:
        configure_github()
    return 0

if __name__ == "__main__":
    run_entrypoint(main)
