---
name: to-tickets
description: 将 Parent Spec 或对话切分为零依赖的垂直切片 Sub-issues，并批量发布到 GitHub 追踪器。
disable-model-invocation: true
---

# 垂直切片拆单 (To Tickets)

用户手动输入 `/to-tickets [#PARENT_ID]` 触发。

## 拆单准则

1. **垂直切片（Tracer Bullet）**：
   每个 Ticket 必须贯穿 Schema -> API -> Logic -> Test 全栈，可被独立验证。
   详细法则见 [VERTICAL-SLICE-RULES.md](references/VERTICAL-SLICE-RULES.md)。
2. **大重构拆分**：
   遇到破坏性公共重构，遵循 [WIDE-REFACTORS.md](references/WIDE-REFACTORS.md) 规定的 Expand-Contract 三步拆分法。
3. **零依赖平行化（Zero Blockers）**：
   利用提前锁定的 Traits 契约与测试替身（Fakes），使各切片尽可能保持零依赖阻碍，支持平行施工。
4. **确认与发布**：
   按照 [ISSUE-TEMPLATE.md](assets/ISSUE-TEMPLATE.md) 格式在内存中拟定子工单，展示给用户确认后，调用 `gh issue create` 原生挂载为 Parent 的 Sub-issues，打上 `ready-for-agent` 标签。
