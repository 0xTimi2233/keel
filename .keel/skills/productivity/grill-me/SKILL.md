---
name: grill-me
description: 无状态的用户盘问入口。高强度追问用户的想法或设计，仅在对话上下文中达成共识，不写入任何文件。
disable-model-invocation: true
---

# 无状态盘问入口

用户手动输入 `/grill-me` 触发。

调用 `grilling` 技能（见 [grilling SKILL.md](../grilling/SKILL.md)），对用户当前提出的想法、方案或设计进行逐问盘问。
本技能为无状态（Stateless），不修改本地任何文件，盘问成果保留在对话历史中。
