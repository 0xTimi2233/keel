#!/usr/bin/env bash
# issue 模板落位到平台约定目录，幂等（-n 不覆盖已有文件）
set -euo pipefail

script_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# shellcheck source=lib.sh
source "$script_dir/lib.sh"

skill_dir="$(cd "$script_dir/.." && pwd)"

if [[ "$(platform)" == "gitlab" ]]; then
  mkdir -p .gitlab/issue_templates
  cp -n "$skill_dir"/assets/issue-templates/*.md .gitlab/issue_templates/
  echo "模板已写入 .gitlab/issue_templates/"
else
  mkdir -p .github/ISSUE_TEMPLATE
  cp -n "$skill_dir"/assets/issue-templates/*.md .github/ISSUE_TEMPLATE/
  echo "模板已写入 .github/ISSUE_TEMPLATE/"
fi
