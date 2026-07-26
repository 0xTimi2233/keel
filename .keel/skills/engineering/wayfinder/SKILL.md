---
name: wayfinder
description: 迷雾项目大地图导航。将大型模糊项目构建为 wayfinder:map Epic 和子决策节点，推进前沿展开。
disable-model-invocation: true
---

# 迷雾项目大地图导航 (Wayfinder)

用户手动输入 `/wayfinder [Vision Description]` 触发。

## 执行流程

1. **大地图创建**：追问用户愿景，在 GitHub 创建 Parent Epic Issue `[wayfinder:map]`。
   参照 [MAP-TEMPLATE.md](assets/MAP-TEMPLATE.md) 格式维护地图。
2. **节点注册**：批量拆为子节点 Issues，标注类型（`research`, `prototype`, `grilling`, `task`）。
3. **Frontier Resolution**：锁定拓扑前沿节点，引导用户调用对应 Skill 击破迷雾。
