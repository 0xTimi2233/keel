---
name: implement
description: Use when driven to code and test a single vertical slice (Sub-issue) following TDD cycle with Fakes.
---

# 垂直切片 TDD 实现

当 Agent 抓取单个带有 `ready-for-agent` 的 Sub-issue 时触发。

## 执行流程

1. **读取上下文**：读取 Sub-issue 描述与对应的 `.feature` BDD 文件。
2. **Step Definitions (Red)**：实现测试断言，注入 `*-test-support` Fakes 适配器，确认测试报红 (Red)。
3. **实现代码**：在 `src/features/<feature>/` 下编写 `command.rs`, `handler.rs`, `validator.rs` 等。
4. **验证绿灯 (Green)**：运行 `cargo test --package <crate>`，验证测试 100% 通过 (Green)。
5. **提交 PR**：提交 Commit 发起目标为 `feature/issue-<parent_id>` 的 PR，开启 `auto-merge`。
