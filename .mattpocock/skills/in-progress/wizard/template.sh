#!/usr/bin/env bash
#
# 导引助手 (Wizard) — 引导人类一步一步地完成手动流程。
# 由 /wizard Skill 生成。
#
# "STAGES" 标记之上的所有内容均为 wizard 函数库：请勿手动编辑。
# 请在标记下方撰写每个步骤的阶段逻辑。

set -euo pipefail

# ──────────────────────────────────────────────────────────────────────────
# Wizard 函数库 — 令人愉悦、一致的 UX。在每个 wizard 中完全相同。
# ──────────────────────────────────────────────────────────────────────────

if [[ -t 1 ]] && command -v tput >/dev/null 2>&1 && [[ "$(tput colors 2>/dev/null || echo 0)" -ge 8 ]]; then
  BOLD=$(tput bold); DIM=$(tput dim); RESET=$(tput sgr0)
  BLUE=$(tput setaf 4); GREEN=$(tput setaf 2); YELLOW=$(tput setaf 3); RED=$(tput setaf 1)
else
  BOLD=""; DIM=""; RESET=""; BLUE=""; GREEN=""; YELLOW=""; RED=""
fi

# 作者在阶段 (stages) 章节的顶部设置这两个变量。
TOTAL_STAGES=0
TOTAL_MINUTES=0

_STAGE_INDEX=0
_MINUTES_ELAPSED=0
ENV_FILE="${ENV_FILE:-.env}"
WRITTEN_ENV=()    # 本次运行写入 ENV_FILE 的 KEY 列表
WRITTEN_SECRET=() # 本次运行设置的 secret NAME 列表
SKIPPED=()        # 无法执行的事项（例如缺少 gh）

# _clear — 清空终端，使屏幕上仅保留当前步骤。当输出非终端时不作操作，以保持管道日志可读。
_clear() {
  [[ -t 1 ]] || return 0
  if command -v tput >/dev/null 2>&1; then tput clear; else printf '\033[2J\033[3J\033[H'; fi
}

# banner "Title" — 开场展示框架：本 wizard 的功能及耗时。
banner() {
  _clear
  printf '\n%s%s  %s%s\n' "$BOLD" "$BLUE" "$1" "$RESET"
  printf '%s  共 %s 个阶段 · 约 %s 分钟%s\n\n' \
    "$DIM" "$TOTAL_STAGES" "$TOTAL_MINUTES" "$RESET"
  printf '%s  你负责操作浏览器；本 wizard 将明确指引你如何操作并\n' "$DIM"
  printf '  捕获你复制回来的数值。随时可以按 Ctrl-C 停止并在之后重新运行\n'
  printf '  — 它会自动记住已保存的数值。%s\n' "$RESET"
  pause "准备好开始了吗？"
}

# stage "Name" <minutes> — 清空屏幕，然后声明阶段并显示进度和剩余时间。清屏保持屏幕仅有当前步骤。
stage() {
  _clear
  _STAGE_INDEX=$((_STAGE_INDEX + 1))
  local remaining=$((TOTAL_MINUTES - _MINUTES_ELAPSED))
  (( remaining < 0 )) && remaining=0
  _MINUTES_ELAPSED=$((_MINUTES_ELAPSED + ${2:-0}))
  printf '\n%s%s▸ 阶段 %s/%s · %s%s  %s(约剩余 %s 分钟)%s\n' \
    "$BOLD" "$BLUE" "$_STAGE_INDEX" "$TOTAL_STAGES" "$1" "$RESET" "$DIM" "$remaining" "$RESET"
}

# say "..." — 普通说明行。
say()  { printf '  %s\n' "$1"; }
# step "..." — 人类在浏览器中执行的带编号感的操作。
step() { printf '  %s•%s %s\n' "$BLUE" "$RESET" "$1"; }
note() { printf '  %s%s%s\n' "$DIM" "$1" "$RESET"; }
warn() { printf '  %s⚠ %s%s\n' "$YELLOW" "$1" "$RESET"; }

# open_url URL — 在人类的浏览器中打开，支持跨平台（包含 WSL）。
open_url() {
  local url="$1"
  printf '  %s↗ 正在打开%s %s\n' "$GREEN" "$RESET" "$url"
  { if   command -v wslview     >/dev/null 2>&1; then wslview "$url"
    elif command -v explorer.exe >/dev/null 2>&1; then explorer.exe "$url"
    elif command -v xdg-open    >/dev/null 2>&1; then xdg-open "$url"
    elif command -v open        >/dev/null 2>&1; then open "$url"
    else warn "无法自动打开浏览器 — 请手动访问：$url"; fi
  } >/dev/null 2>&1 || warn "无法自动打开浏览器 — 请手动访问：$url"
}

# pause "msg" — 等待人类确认已完成手动操作部分。
pause() {
  printf '  %s%s%s ' "$DIM" "${1:-按回车键 (Enter) 继续}" "$RESET"
  read -r _ || true
}

# confirm "question" — y/N 门禁；回答 yes 时返回成功。
confirm() {
  local reply=""
  printf '  %s? %s [y/N] ' "$YELLOW" "$1"
  read -r reply || true
  [[ "$reply" =~ ^[Yy] ]]
}

# _existing KEY — ENV_FILE 中 KEY 的当前值（如果有）。
_existing() {
  [[ -f "$ENV_FILE" ]] || return 1
  local line; line=$(grep -E "^${1}=" "$ENV_FILE" | tail -n1) || return 1
  printf '%s' "${line#*=}"
}

# ask KEY "Prompt" — 读取数值到 $KEY。在重新运行时提供已有的 .env 值作为默认值（直接按回车保留）。明文输入（非敏感）。
ask() {
  local key="$1" prompt="$2" current input
  current=$(_existing "$key" || true)
  if [[ -n "$current" ]]; then
    printf '  %s%s%s %s[按回车保留当前值]%s ' "$BOLD" "$prompt" "$RESET" "$DIM" "$RESET"
  else
    printf '  %s%s%s ' "$BOLD" "$prompt" "$RESET"
  fi
  read -r input || true
  [[ -z "$input" && -n "$current" ]] && input="$current"
  printf -v "$key" '%s' "$input"
}

# ask_secret KEY "Prompt" — 类似于 ask，但输入过程隐藏。
ask_secret() {
  local key="$1" prompt="$2" current input
  current=$(_existing "$key" || true)
  if [[ -n "$current" ]]; then
    printf '  %s%s%s %s[按回车保留当前值]%s ' "$BOLD" "$prompt" "$RESET" "$DIM" "$RESET"
  else
    printf '  %s%s%s ' "$BOLD" "$prompt" "$RESET"
  fi
  read -rs input || true
  printf '\n'
  [[ -z "$input" && -n "$current" ]] && input="$current"
  printf -v "$key" '%s' "$input"
}

# write_env KEY VALUE — 插入/更新 KEY=VALUE 到 ENV_FILE（不存在则创建；存在则替换所在行）。具备幂等性。
write_env() {
  local key="$1" value="$2" tmp
  touch "$ENV_FILE"
  tmp=$(mktemp)
  grep -vE "^${key}=" "$ENV_FILE" > "$tmp" || true
  printf '%s=%s\n' "$key" "$value" >> "$tmp"
  mv "$tmp" "$ENV_FILE"
  WRITTEN_ENV+=("$key")
  printf '  %s✓ 已写入%s %s → %s\n' "$GREEN" "$RESET" "$key" "$ENV_FILE"
}

# set_secret NAME VALUE — 通过 gh 设置 GitHub Actions 仓库 secret。若 gh 不可用或未登录，回退为警告（并予以记录）。
set_secret() {
  local name="$1" value="$2"
  if command -v gh >/dev/null 2>&1 && gh auth status >/dev/null 2>&1; then
    if printf '%s' "$value" | gh secret set "$name" >/dev/null 2>&1; then
      WRITTEN_SECRET+=("$name")
      printf '  %s✓ 已设置%s GitHub secret %s\n' "$GREEN" "$RESET" "$name"
      return
    fi
  fi
  SKIPPED+=("GitHub secret $name (请手动设置：gh secret set $name)")
  warn "跳过了 GitHub secret $name — gh 未准备好；请稍后手动设置"
}

# set_var NAME VALUE — 设置 GitHub Actions 仓库变量（非敏感信息）。
set_var() {
  local name="$1" value="$2"
  if command -v gh >/dev/null 2>&1 && gh auth status >/dev/null 2>&1; then
    if gh variable set "$name" --body "$value" >/dev/null 2>&1; then
      printf '  %s✓ 已设置%s GitHub variable %s\n' "$GREEN" "$RESET" "$name"
      return
    fi
  fi
  SKIPPED+=("GitHub variable $name")
  warn "跳过了 GitHub variable $name — gh 未准备好；请稍后手动设置"
}

# finish — 清屏，然后对所有已配置的内容输出结尾总结。
finish() {
  _clear
  printf '\n%s%s  ✓ 设置完成%s\n' "$BOLD" "$GREEN" "$RESET"
  (( ${#WRITTEN_ENV[@]} ))    && note "已写入 ${#WRITTEN_ENV[@]} 个变量值到 $ENV_FILE: ${WRITTEN_ENV[*]}"
  (( ${#WRITTEN_SECRET[@]} )) && note "已设置 ${#WRITTEN_SECRET[@]} 个 GitHub secret(s): ${WRITTEN_SECRET[*]}"
  if (( ${#SKIPPED[@]} )); then
    printf '\n'; warn "仍需手动完成的事项："
    for s in "${SKIPPED[@]}"; do note "  - $s"; done
  fi
  printf '\n'
}

# ──────────────────────────────────────────────────────────────────────────
# STAGES — 撰写此章节。人类执行的每个步骤对应一个 stage()。
# 替换下方的示例。设置两个总量以匹配你撰写的阶段。
# ──────────────────────────────────────────────────────────────────────────

TOTAL_STAGES=1
TOTAL_MINUTES=5

banner "Stripe 设置"

# ── 示例阶段：请替换为你的实际步骤 ───────────────────────────
stage "Stripe — API 密钥" 5
say "我们将获取你的 Stripe 测试密钥并将其保存用于本地开发 + CI。"
open_url "https://dashboard.stripe.com/test/apikeys"
step "在 API 密钥页面，复制 Publishable key（以 pk_test_ 开头）。"
ask STRIPE_PUBLISHABLE_KEY "粘贴 publishable key:"
step "点击 Secret key 行上的 'Reveal test key'，然后复制它。"
ask_secret STRIPE_SECRET_KEY "粘贴 secret key:"
write_env STRIPE_PUBLISHABLE_KEY "$STRIPE_PUBLISHABLE_KEY"
write_env STRIPE_SECRET_KEY "$STRIPE_SECRET_KEY"
set_secret STRIPE_SECRET_KEY "$STRIPE_SECRET_KEY"   # CI 需要此密钥
# ──────────────────────────────────────────────────────────────────────────

finish
