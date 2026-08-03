#!/usr/bin/env python3
# 公共设施：平台检测、CLI 运行、报告与文件安装，供各脚本共享
# 库模块，被 doctor.py 与 setup-*.py import
from __future__ import annotations

import argparse
from dataclasses import dataclass
import json
from pathlib import Path
import re
import shutil
import subprocess
from typing import Callable, NoReturn
from urllib.parse import quote, urlsplit

SKILL_DIR = Path(__file__).resolve().parent.parent
DEFAULT_LABELS = (
    "type:bug",
    "type:feature",
    "priority:P1",
    "priority:P2",
    "priority:P3",
    "priority:P4",
    "stage:needs-triage",
    "stage:needs-info",
    "stage:ready-for-agent",
    "stage:ready-for-human",
    "stage:wontfix",
)
LABEL_COLORS = {
    "type:bug": "d73a4a",
    "type:feature": "a2eeef",
    "priority:P1": "b60205",
    "priority:P2": "d93f0b",
    "priority:P3": "fbca04",
    "priority:P4": "0e8a16",
    "stage:needs-triage": "ededed",
    "stage:needs-info": "d455d0",
    "stage:ready-for-agent": "8fc951",
    "stage:ready-for-human": "0052cc",
    "stage:wontfix": "6f42c1",
}
LABEL_DESCRIPTIONS = {
    "type:bug": "bug",
    "type:feature": "feature",
    "priority:P1": "urgent",
    "priority:P2": "high",
    "priority:P3": "normal",
    "priority:P4": "low",
    "stage:needs-triage": "待分诊",
    "stage:needs-info": "缺信息",
    "stage:ready-for-agent": "可交给 agent",
    "stage:ready-for-human": "需要人处理",
    "stage:wontfix": "不修复",
}
PLATFORMS = ("github", "gitlab")
GITLAB_SECURITY_TEMPLATES = (
    "Jobs/SAST.gitlab-ci.yml",
    "Jobs/Dependency-Scanning.v2.gitlab-ci.yml",
)

@dataclass(frozen=True)
class CommandResult:
    args: tuple[str, ...]
    returncode: int
    stdout: str
    stderr: str

@dataclass(frozen=True)
class Report:
    status: str
    item: str
    detail: str

class ActionError(Exception):
    """An expected operational failure suitable for a one-line message."""

    def __init__(self, item: str, detail: str) -> None:
        super().__init__(detail)
        self.item = item
        self.detail = detail

def run_cli(
    args: list[str], *, input_text: str | None = None, timeout: int = 30
) -> CommandResult:
    """Run a CLI without leaking its routine output."""
    try:
        result = subprocess.run(
            args,
            check=False,
            input=input_text,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True,
            timeout=timeout,
        )
        return CommandResult(
            tuple(args), result.returncode, result.stdout, result.stderr
        )
    except FileNotFoundError:
        return CommandResult(tuple(args), 127, "", f"{args[0]} command not found")
    except subprocess.TimeoutExpired:
        return CommandResult(
            tuple(args), 124, "", f"{args[0]} command timed out after {timeout}s"
        )
    except OSError as error:
        return CommandResult(tuple(args), 126, "", clean_detail(str(error)))

def clean_detail(text: str) -> str:
    """Collapse diagnostics to one quiet, printable line."""
    lines = [line.strip() for line in text.splitlines() if line.strip()]
    return lines[-1] if lines else "command failed without diagnostics"

def http_status(result: CommandResult) -> int | None:
    """Extract an HTTP status from gh/glab diagnostics."""
    text = f"{result.stderr}\n{result.stdout}"
    patterns = (
        r"(?:HTTP\s+|status(?: code)?[=: ]+)([1-5]\d\d)\b",
        r"\b(401|403|404|409|422|429|500|502|503|504)\b",
    )
    for pattern in patterns:
        match = re.search(pattern, text, re.IGNORECASE)
        if match:
            return int(match.group(1))
    return None

def command_failure(result: CommandResult) -> str:
    if result.returncode == 127:
        return result.stderr
    status = http_status(result)
    detail = clean_detail(result.stderr or result.stdout)
    if status is None or re.search(rf"\bHTTP\s+{status}\b", detail, re.IGNORECASE):
        return detail
    return f"HTTP {status}: {detail}"

def require_success(result: CommandResult, item: str) -> CommandResult:
    if result.returncode != 0:
        raise ActionError(item, command_failure(result))
    return result

def parse_json(text: str, item: str) -> object:
    try:
        return json.loads(text)
    except json.JSONDecodeError as error:
        raise ActionError(item, f"invalid JSON response: {error.msg}") from error

def failure_status(error: ActionError) -> str:
    if re.search(r"HTTP (?:401|403)\b", error.detail):
        return "access-denied"
    return "unknown"

def emit(status: str, item: str, detail: str) -> None:
    print(f"{status}: {item} - {detail}")

def report_file(item: str, path: Path) -> Report:
    if path.is_file():
        return Report("OK", item, f"{path} exists")
    if path.exists():
        return Report("unknown", item, f"{path} is not a file")
    return Report("missing", item, f"{path} does not exist")

def install_file(source: Path, destination: Path, item: str) -> str:
    """Copy an asset once; reject conflicting non-file targets."""
    if destination.is_file():
        return "exists"
    if destination.exists():
        raise ActionError(item, f"{destination} exists and is not a file")
    try:
        destination.parent.mkdir(parents=True, exist_ok=True)
        shutil.copy2(source, destination)
    except OSError as error:
        raise ActionError(item, clean_detail(str(error))) from error
    return "created"

def add_platform_argument(parser: argparse.ArgumentParser) -> None:
    parser.add_argument(
        "--platform",
        choices=PLATFORMS,
        help="Override platform detection for an ambiguous remote host.",
    )

def origin_url() -> str:
    result = run_cli(["git", "remote", "get-url", "origin"])
    require_success(result, "platform")
    url = result.stdout.strip()
    if not url:
        raise ActionError("platform", "origin remote URL is empty")
    return url

def _remote_host_and_path(url: str) -> tuple[str, str]:
    if "://" in url:
        parsed = urlsplit(url)
        return (parsed.hostname or "").lower(), parsed.path.lstrip("/")

    match = re.match(r"^(?:[^@/]+@)?([^:/]+):(.+)$", url)
    if match:
        return match.group(1).lower(), match.group(2).lstrip("/")

    path = Path(url)
    if path.is_absolute() or url.startswith("."):
        raise ActionError("platform", "origin remote is local; use --platform")
    parts = url.split("/", 1)
    if len(parts) == 2 and "." in parts[0]:
        return parts[0].lower(), parts[1]
    raise ActionError("platform", "could not parse origin remote; use --platform")

def detect_platform(override: str | None = None) -> str:
    if override is not None:
        return override
    host, _ = _remote_host_and_path(origin_url())
    if "github" in host:
        return "github"
    if "gitlab" in host:
        return "gitlab"
    raise ActionError(
        "platform", f"unsupported remote host {host or 'unknown'}; use --platform"
    )

def gitlab_project_encoded() -> str:
    _, path = _remote_host_and_path(origin_url())
    repository = path.removesuffix(".git").strip("/")
    if "/" not in repository:
        raise ActionError("platform", "GitLab origin lacks a namespace and project")
    return quote(repository, safe="")

def run_entrypoint(main: Callable[[], int | None]) -> NoReturn:
    """Run a mutating entrypoint with consistent, non-noisy failures."""
    try:
        exit_code = main()
    except ActionError as error:
        emit("failed", error.item, error.detail)
        exit_code = 1
    except Exception as error:  # Keep operational scripts free of tracebacks.
        emit("failed", "script", clean_detail(str(error)))
        exit_code = 1
    raise SystemExit(exit_code or 0)
