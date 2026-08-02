#!/usr/bin/env bash
# 校验全部配置项，缺什么列出什么；全部就位退出 0，有缺失退出 1
set -euo pipefail

script_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# shellcheck source=lib.sh
source "$script_dir/lib.sh"

missing=0
labels=(needs-triage needs-info ready-for-agent ready-for-human wontfix)

if [[ "$(platform)" == "gitlab" ]]; then
  for label in "${labels[@]}"; do
    if glab label list 2>/dev/null | grep -qw "$label"; then
      echo "✓ 标签 $label"
    else
      echo "✗ 标签 $label"
      missing=1
    fi
  done
  project="$(gitlab_project_encoded)"
  if glab api "projects/$project/protected_branches" 2>/dev/null | grep -q 'main'; then
    echo "✓ 分支保护 main"
  else
    echo "✗ 分支保护 main"
    missing=1
  fi
  if [[ -f .gitlab-ci.yml ]]; then
    echo "✓ .gitlab-ci.yml"
  else
    echo "✗ .gitlab-ci.yml"
    missing=1
  fi
else
  existing="$(gh label list --json name --jq '.[].name' 2>/dev/null || true)"
  for label in "${labels[@]}"; do
    if grep -qx "$label" <<<"$existing"; then
      echo "✓ 标签 $label"
    else
      echo "✗ 标签 $label"
      missing=1
    fi
  done
  if gh api "repos/{owner}/{repo}/branches/main/protection" >/dev/null 2>&1; then
    echo "✓ 分支保护 main"
  else
    echo "✗ 分支保护 main"
    missing=1
  fi
  if [[ -f .github/workflows/codeql.yml ]]; then
    echo "✓ CodeQL workflow"
  else
    echo "✗ CodeQL workflow"
    missing=1
  fi
  if gh api "repos/{owner}/{repo}/secret-scanning" --jq '.enabled' 2>/dev/null | grep -q true; then
    echo "✓ secret scanning"
  else
    echo "✗ secret scanning"
    missing=1
  fi
  if gh api "repos/{owner}/{repo}/automated-security-fixes" --jq '.enabled' 2>/dev/null | grep -q true; then
    echo "✓ 依赖安全更新"
  else
    echo "✗ 依赖安全更新"
    missing=1
  fi
fi

if [[ "$(platform)" == "gitlab" ]]; then
  if [[ -f .gitlab/issue_templates/spec.md && -f .gitlab/issue_templates/bug.md ]]; then
    echo "✓ issue 模板"
  else
    echo "✗ issue 模板"
    missing=1
  fi
else
  if [[ -f .github/ISSUE_TEMPLATE/spec.md && -f .github/ISSUE_TEMPLATE/bug.md ]]; then
    echo "✓ issue 模板"
  else
    echo "✗ issue 模板"
    missing=1
  fi
fi

exit "$missing"
