#!/usr/bin/env bash
# 创建缺失的工作流标签，幂等
set -euo pipefail

script_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# shellcheck source=lib.sh
source "$script_dir/lib.sh"

labels=(needs-triage needs-info ready-for-agent ready-for-human wontfix)

if [[ "$(platform)" == "gitlab" ]]; then
  for label in "${labels[@]}"; do
    if glab label list 2>/dev/null | grep -qw "$label"; then
      echo "已存在：$label"
    else
      glab label create -n "$label" -c "#808080"
    fi
  done
else
  existing="$(gh label list --json name --jq '.[].name' 2>/dev/null || true)"
  for label in "${labels[@]}"; do
    if grep -qx "$label" <<<"$existing"; then
      echo "已存在：$label"
    else
      gh label create "$label" --color 808080
    fi
  done
fi
