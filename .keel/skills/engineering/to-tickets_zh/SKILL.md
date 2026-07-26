---
name: to-tickets_zh
description: 切分零依赖垂直切片 Sub-issues 并发布至 GitHub。中文审阅版。
disable-model-invocation: true
---

# 垂直切片拆单 (To Tickets)

用户手动输入 `/to-tickets [#PARENT_ID]` 触发。

## 拆单准则

- **Tracer Bullet**：切片必须贯穿 Schema -> API -> Logic -> Test 全栈。遵循 [VERTICAL-SLICE-RULES.md](references/VERTICAL-SLICE-RULES.md) 的原子可验证性定理（Atomic Completeness）。
- **Wide Refactors**：遇到破坏性重构，遵循 [WIDE-REFACTORS.md](references/WIDE-REFACTORS.md) 规定的 Expand-Contract 三步拆分法。
- **Zero Blockers**：利用提前锁定的 Traits 契约与 Fakes，保持切片零依赖阻碍，支持平行施工。
- **发布挂载**：按 [ISSUE-TEMPLATE.md](assets/ISSUE-TEMPLATE.md) 格式拟定子工单，经用户确认后，调用 `gh issue create` 原生挂载为 Parent Sub-issues，标注 `ready-for-agent`。
