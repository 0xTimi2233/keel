---
name: grill-me
description: 无状态的用户盘问入口。追问用户想法，仅在对话上下文中达成共识，不写入任何文件。
disable-model-invocation: true
---

# 无状态盘问入口

用户手动输入 `/grill-me` 触发。

调用 [grilling SKILL.md](../grilling/SKILL.md) 原语对用户方案进行逐问盘问。
本技能为 **Stateless（无状态）**，不修改本地文件，盘问成果保留在对话上下文中。
