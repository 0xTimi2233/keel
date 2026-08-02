#!/usr/bin/env python3
"""Shared helpers for platform detection and CLI execution."""
from __future__ import annotations
import subprocess

def run_cli(args: list[str], *, input_text: str | None = None) -> subprocess.CompletedProcess[str]:
    """Run a CLI command quietly and return its captured result."""
    try:
        return subprocess.run(
            args,
            check=False,
            input=input_text,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True,
        )
    except FileNotFoundError:
        return subprocess.CompletedProcess(args, 127, "", f"{args[0]} not found")

def require_success(result: subprocess.CompletedProcess[str], action: str) -> None:
    """Exit with one concise error line when a required CLI action fails."""
    if result.returncode == 0:
        return
    detail = result.stderr.strip().splitlines()[-1] if result.stderr.strip() else ""
    suffix = f" ({detail})" if detail else ""
    raise SystemExit(f"{action}: failed{suffix}")

def _origin_url(*, required: bool) -> str:
    result = run_cli(["git", "remote", "get-url", "origin"])
    if required:
        require_success(result, "origin lookup")
    return result.stdout.strip() if result.returncode == 0 else ""

def platform() -> str:
    """Detect GitLab from the origin URL and otherwise default to GitHub."""
    return "gitlab" if "gitlab" in _origin_url(required=False) else "github"

def gitlab_project_encoded() -> str:
    """Return URL-encoded namespace/project for the GitLab REST API."""
    url = _origin_url(required=True)
    if "://" in url:
        repository = url.split("://", 1)[1].partition("/")[2]
    else:
        repository = url.removeprefix("git@")
        if ":" in repository:
            repository = repository.split(":", 1)[1]
        else:
            repository = repository.partition("/")[2]
    return repository.removesuffix(".git").replace("/", "%2F")
