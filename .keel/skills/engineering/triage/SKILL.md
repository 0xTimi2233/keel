---
name: triage
description: 外部 Issue 与 PR 的分诊状态机。评估、查重、验证复现、补齐细节并标记状态。
disable-model-invocation: true
---

# 问题与 PR 分诊 (Triage)

用户手动输入 `/triage` 触发。专门用于处理外部/测试人员提交的原始 Issue/PR。

## 状态机角色

- **Category**: `bug` | `enhancement`
- **State**: `needs-triage` | `needs-info` | `ready-for-agent` | `ready-for-human` | `wontfix`

## 执行流程

1. **查重与查边界**：
   检索代码库看是否已实现；查阅并比对 [OUT-OF-SCOPE.md](references/OUT-OF-SCOPE.md) 中的拒绝历史。若已实现或拒绝，标记为 `wontfix` 关闭。
2. **验证复现**：
   针对 Bug 尝试复现，记录复现路径。
3. **补齐细节与撰写 Brief**：
   若模糊则追问；若完备则遵循 [AGENT-BRIEF.md](references/AGENT-BRIEF.md) 撰写 Brief 并标注为 `ready-for-agent`。
