#!/usr/bin/env bash
# main 分支保护：PR 审查、CI 通过、禁止直接 push，已保护则跳过
set -euo pipefail

script_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# shellcheck source=lib.sh
source "$script_dir/lib.sh"

if [[ "$(platform)" == "gitlab" ]]; then
  project="$(gitlab_project_encoded)"
  if glab api "projects/$project/protected_branches" 2>/dev/null | grep -q 'main'; then
    echo "main 已受保护"
  else
    glab api --method POST "projects/$project/protected_branches" \
      --field name=main \
      --field push_access_level=0 \
      --field merge_access_level=40 \
      --field allow_force_push=false
    echo "main 保护已配置"
  fi
else
  if gh api "repos/{owner}/{repo}/branches/main/protection" >/dev/null 2>&1; then
    echo "main 已受保护"
  else
    gh api --method PUT "repos/{owner}/{repo}/branches/main/protection" --input - >/dev/null <<'JSON'
{
  "required_status_checks": {"strict": true, "contexts": []},
  "enforce_admins": true,
  "required_pull_request_reviews": {"required_approving_review_count": 1, "dismiss_stale_reviews": true},
  "restrictions": null
}
JSON
    echo "main 保护已配置"
  fi
fi
