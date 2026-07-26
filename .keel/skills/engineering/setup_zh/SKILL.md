---
name: setup_zh
description: 初始化 Agent 基础设施与架构宪法。中文审阅版。
disable-model-invocation: true
---

# 挂载 Agent 基础设施

用户手动输入 `/setup` 触发。

## 执行流程

1. **探查仓库环境**：探查语言、包管理器与测试框架。
2. **初始化 GitHub Issue 标签**：
   在 tracker 建立 7 个标准标签（`bug`, `enhancement`, `needs-triage`, `needs-info`, `ready-for-agent`, `ready-for-human`, `wontfix`）。
   配置规范见 [ISSUE-TRACKER-CONFIG.md](references/ISSUE-TRACKER-CONFIG.md)。
3. **建立文档结构**：初始化 `docs/` 与 `docs/adr/`。
4. **生成/补丁 AGENTS.md**：写入包含 Contract-First, Hexagonal Architecture, Vertical Slicing 及 BDD (.feature) 准则的宪法。
