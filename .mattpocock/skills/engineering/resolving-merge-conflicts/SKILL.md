---
name: resolving-merge-conflicts
description: "当需要解决正在进行中的 git merge/rebase 冲突时使用。"
---

1. **查看 merge/rebase 的当前状态**。检查 git 历史记录以及存在冲突的文件。

2. **查找每个冲突的原始凭据**。深刻理解每次修改的原因以及最初的意图。阅读 commit 提交信息，检查 PR，检查原始的 issue/工单。

3. **解决每个冲突块（hunk）**。在可能的情况下同时保留双方意图。在不可兼容的情况下，选择匹配该 merge 设定目标的一方，并记录权衡说明。**切勿**捏造新的行为。始终进行解决；绝不使用 `--abort`。

4. 探测项目的**自动化检查工具**并运行它们 — 通常是类型检查（typecheck），然后是测试，最后是格式化。修复 merge 破坏的所有内容。

5. **完成 merge/rebase**。暂存（stage）所有内容并提交（commit）。如果是变基（rebase），继续 rebase 流程，直到所有 commit 都完成变基。
