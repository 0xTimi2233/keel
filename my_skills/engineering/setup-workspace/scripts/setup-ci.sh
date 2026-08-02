#!/usr/bin/env bash
# 基础 CI：安全扫描与依赖分析（语言无关），幂等
set -euo pipefail

script_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# shellcheck source=lib.sh
source "$script_dir/lib.sh"

skill_dir="$(cd "$script_dir/.." && pwd)"

if [[ "$(platform)" == "gitlab" ]]; then
  cp -n "$skill_dir"/assets/gitlab-ci.yml .gitlab-ci.yml
  echo ".gitlab-ci.yml 已就位（SAST 与依赖扫描）"
else
  mkdir -p .github/workflows
  cp -n "$skill_dir"/assets/workflows/codeql.yml .github/workflows/
  gh api --method PUT "repos/{owner}/{repo}/secret-scanning" --input - >/dev/null <<'JSON' || echo "警告：secret scanning 开启失败"
{"enabled": true}
JSON
  gh api --method PUT "repos/{owner}/{repo}/automated-security-fixes" --input - >/dev/null <<'JSON' || echo "警告：依赖安全更新开启失败"
{"enabled": true}
JSON
  echo "CodeQL 与安全设置已就位"
fi
