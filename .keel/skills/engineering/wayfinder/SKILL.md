---
name: wayfinder
description: 迷雾项目大地图导航。将大型模糊项目构建为 wayfinder:map Epic 和子决策节点，推进前沿展开。
disable-model-invocation: true
---

# 迷雾项目大地图导航 (Wayfinder)

用户手动输入 `/wayfinder [Vision Description]` 触发。

## 执行流程

1. **广度优先建立大地图**：
   追问用户大愿景，在 GitHub 创建 Parent Epic Issue `[wayfinder:map]`。
   按照 [MAP-TEMPLATE.md](assets/MAP-TEMPLATE.md) 格式在内存与 Issue 正文中维护地图。
2. **批量注册决策/任务节点**：
   将大需求拆为子节点 Issues，标注节点类型（`research`, `prototype`, `grilling`, `task`）。
3. **推进前沿（Frontier Resolution）**：
   锁定当前处于拓扑前沿的节点，引导用户调用对应的 Skill（如 `/grill-with-docs` 或 `/to-spec`）逐个击破决策迷雾。
