---
name: git-guardrails-claude-code
description: 设置 Claude Code hook，在危险 git 命令（push、reset --hard、clean、branch -D 等）执行之前将其拦截阻断。当用户希望防止破坏性 git 操作、添加 git 安全护栏 hook 或在 Claude Code 中拦截 git push/reset 时使用。
---

# 设置 Git 安全护栏 (Setup Git Guardrails)

设置一个 PreToolUse hook，在 Claude 执行危险 git 命令之前对其进行拦截阻断。

## 将被拦截的操作

- `git push`（包含 `--force` 在内的所有变体）
- `git reset --hard`
- `git clean -f` / `git clean -fd`
- `git branch -D`
- `git checkout .` / `git restore .`

当被拦截时，Claude 会看到一条消息，告知其没有权限使用这些命令。

## 步骤

### 1. 询问作用域

询问用户：仅为**当前项目**安装 (`.claude/settings.json`)，还是为**所有项目**全局安装 (`~/.claude/settings.json`)？

### 2. 复制 hook 脚本

随附的脚本位于：[scripts/block-dangerous-git.sh](scripts/block-dangerous-git.sh)

根据作用域将其复制到目标位置：

- **项目级**：`.claude/hooks/block-dangerous-git.sh`
- **全局级**：`~/.claude/hooks/block-dangerous-git.sh`

通过 `chmod +x` 赋予可执行权限。

### 3. 将 hook 添加到配置中

添加到相应的配置文件中：

**项目级** (`.claude/settings.json`):

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Bash",
        "hooks": [
          {
            "type": "command",
            "command": "\"$CLAUDE_PROJECT_DIR\"/.claude/hooks/block-dangerous-git.sh"
          }
        ]
      }
    ]
  }
}
```

**全局级** (`~/.claude/settings.json`):

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Bash",
        "hooks": [
          {
            "type": "command",
            "command": "~/.claude/hooks/block-dangerous-git.sh"
          }
        ]
      }
    ]
  }
}
```

如果配置文件已经存在，将该 hook 合并到现有的 `hooks.PreToolUse` 数组中 — 切勿覆盖其他配置。

### 4. 询问自定义设置

询问用户是否想在拦截列表中添加或删除任何模式。相应地编辑复制的脚本。

### 5. 验证

运行快速测试：

```bash
echo '{"tool_input":{"command":"git push origin main"}}' | <path-to-script>
```

应该以退出代码 2 退出，并将 BLOCKED 拦截消息打印到 stderr。
