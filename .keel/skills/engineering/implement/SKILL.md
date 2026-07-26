---
name: implement
description: 驱动单个垂直切片的 TDD 编码实现。使用假替身（Fakes）快环测试，确保测试全绿后提交。
---

# 垂直切片 TDD 实现

当 Agent 抓取单个带有 `ready-for-agent` 的 Sub-issue 时触发。

## 执行流程

1. **读取上下文与测试试卷**：
   读取 Sub-issue 描述，找到对应的 `.feature` BDD 验收文件与单元测试要求。
2. **编写/更新测试步骤（Step Definitions）**：
   实现或补全测试断言，注入 `*-test-support` 提供的 Fake 适配器，运行测试确认报红（Red）。
3. **编写业务代码**：
   在切片目录（如 `src/features/<feature>/`）下编写 `command.rs`, `handler.rs`, `validator.rs` 等实现代码。
4. **验证绿灯（Green）**：
   运行本地测试命令（如 `cargo test --package <crate>`），验证测试 100% 通过（Green）。
5. **提交代码与开启 PR**：
   提交 Commit 并发起目标为集线分支（`feature/issue-<parent_id>`）的 PR，开启 GitHub `auto-merge`。
