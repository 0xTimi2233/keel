---
name: grilling_zh
description: 需求与设计盘问原语。中文审阅版。
disable-model-invocation: true
---

# 盘问原语 (Grilling Primitive)

核心目标：消除需求歧义，顺着决策树依赖链推演，达成 **Shared Understanding（共识）**。

## 执行准则

- **One Question at a Time**：严格限制每次只抛出 1 个问题，禁止多问并列导致认知过载。
- **Recommended Answer**：每个问题必须提供专业分析并给出推荐选项，格式前缀 `(推荐) 选项内容`。
- **Facts vs Decisions 分离**：
  - **Facts（事实）**：能够通过查看代码库、运行命令探查到的信息，Agent 必须自动去查，禁止询问用户。
  - **Decisions（决策）**：涉及业务偏好、架构取舍与范围剪裁的选择，向用户提问。
- **Confirmation Gate**：未获得用户明确确认共识前，程序化禁止编写任何业务实现代码。
