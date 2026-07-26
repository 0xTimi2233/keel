---
name: writing-great-docs_zh
description: 项目文档编写与塑造规范。建立概念铺垫、格式把控与单源事实。中文审阅版。
disable-model-invocation: true
---

# 项目文档编写规范

文档是物理落盘的**持久化资产 (Persisted Artifacts)**。核心美德是 **Predictability (可预测性) 与抗 Context 污染**。

## 1. 概念铺垫与层级 (Grounding & Hierarchy)

- **先铺垫后引用 (Grounding)**：在后文使用某个业务概念或术语之前，先在前文建立定义铺垫。

- **顶层仅保留 Invariants**：主文档控制在 2 屏以内。先交代核心约束，子系统细节下沉至链接文件。

## 2. 块切分与排版决策 (Block & Format Choices)

- **240 字逻辑块目标**：保持每个段落或逻辑块在 240 字符以内。多重职责的散文拆为 Bullet 列表。

- **散文与列表选型**：散文用于推导逻辑；Bullet 列表用于平行观测点或二元条件。

- **正文与 Callout 选型**：仅当信息会干扰正文主逻辑时，使用 Callout 块 (`> [!NOTE]`, `> [!IMPORTANT]`)。

## 3. 单源事实与覆盖更新 (Single Source & Overwrites)

- **唯一权威出处**：每个规则、参数或决策有且仅有 1 个物理文件出处。

- **引用链接，绝不重复**：通过 Markdown 链接 (`[标题](path/file.md)`) 引用权威定义。重复解释引发逻辑漂移。

- **彻底覆盖擦除**：更新文档时直接覆盖废弃规则。擦除历史替代方案或“旧行为说明”残留文本。
