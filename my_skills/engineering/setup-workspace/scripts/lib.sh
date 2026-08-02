#!/usr/bin/env bash
# 公共函数：平台探测与 GitLab 项目路径解析

platform() {
  local remote
  remote="$(git remote get-url origin 2>/dev/null || true)"
  case "$remote" in
    *gitlab*) echo gitlab ;;
    *) echo github ;;
  esac
}

# 输出 URL 编码的 namespace/project（如 group%2Fproject），供 GitLab REST API 使用
gitlab_project_encoded() {
  local url
  url="$(git remote get-url origin)"
  url="${url#*://}"
  url="${url#git@}"
  url="${url#*:}"
  url="${url#*/}"
  url="${url%.git}"
  printf '%s' "$url" | sed 's|/|%2F|g'
}
