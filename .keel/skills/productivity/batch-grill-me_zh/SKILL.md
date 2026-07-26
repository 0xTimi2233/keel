---
name: batch-grill-me_zh
description: 按轮次分批提问的盘问入口。中文审阅版。
disable-model-invocation: true
---

# 按轮次批量盘问入口

用户手动输入 `/batch-grill-me` 触发。

## 执行流程

1. **构建决策树**：梳理方案的所有决策节点与依赖关系。
2. **计算 Frontier（拓扑前沿）**：找出当前所有前置条件已满足、可直接回答的问题集合。
3. **Round-by-Round 提问**：
   - 集中列出当前轮次的前沿问题，每个问题前缀 `(推荐) 选项内容`。
   - 等待用户集中回答。
4. **迭代推进**：根据回答更新决策树，重新计算下一轮 Frontier，直至决策清零。
5. **Confirmation Gate**：获得用户确认后结束。
