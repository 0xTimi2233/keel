---
name: setup
description: 在项目中初始化 Agent 基础设施：配置问题追踪标签、文档结构与 AGENTS.md 宪法。
disable-model-invocation: true
---

# 挂载 Agent 基础设施

用户手动输入 `/setup` 触发。

## 执行流程

1. **探查仓库环境**：
   探查语言、包管理器、测试框架及当前包含的框架文件。
2. **初始化 GitHub Issue 标签**：
   在问题追踪器建立 7 个标准标签（`bug`, `enhancement`, `needs-triage`, `needs-info`, `ready-for-agent`, `ready-for-human`, `wontfix`）。
   完整配置要求参见 [ISSUE-TRACKER-CONFIG.md](references/ISSUE-TRACKER-CONFIG.md)。
3. **建立领域文档结构**：
   在根目录下初始化 `docs/` 与 `docs/adr/`，若不存在则创建占位文件。
4. **生成/补丁 AGENTS.md**：
   在 `AGENTS.md` 中写入 Agent 行为宪法，涵盖：
   - 契约优先（Contract-First）
   - 六边形架构（Hexagonal Architecture）与端口适配器隔离
   - 垂直切片（Vertical Slicing）与 BDD (.feature) 验收准则
