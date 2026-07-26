---
name: domain-modeling
description: 构建并锤炼项目的领域模型。当用户希望确定领域术语或通用语言 (ubiquitous language)、记录架构决策，或者当其他技能需要维护领域模型时使用。
---

# 领域建模 (Domain Modeling)

在设计过程中主动构建并锤炼项目的领域模型。这是一项**主动的**规范与纪律——质疑否定术语、构想边缘情况场景，并在术语和决策定型的那一刻将其记录下来。（仅仅*阅读* `CONTEXT.md` 以了解词汇并不属于本技能——那只是任何技能都可以做到的单行习惯。本技能适用于你正在修改模型，而不仅仅是消费模型的时候。）

## 文件结构 (File structure)

大多数仓库只有单个上下文：

```
/
├── CONTEXT.md
├── docs/
│   └── adr/
│       ├── 0001-event-sourced-orders.md
│       └── 0002-postgres-for-write-model.md
└── src/
```

如果根目录下存在 `CONTEXT-MAP.md`，说明该仓库拥有多个上下文。地图会指向每个上下文所在的位置：

```
/
├── CONTEXT-MAP.md
├── docs/
│   └── adr/                          ← 系统维度的决策
├── src/
│   ├── ordering/
│   │   ├── CONTEXT.md
│   │   └── docs/adr/                 ← 上下文特有的决策
│   └── billing/
│       ├── CONTEXT.md
│       └── docs/adr/
```

延迟创建文件 — 仅在你有内容需要写入时才创建。如果不存在 `CONTEXT.md`，在解决第一个术语时创建一个。如果不存在 `docs/adr/`，在需要第一个 ADR 时创建它。

## 会话期间的作法 (During the session)

### 针对词汇表提出质疑 (Challenge against the glossary)

当用户使用的术语与 `CONTEXT.md` 中现有的语言冲突时，立即指出。“你的词汇表将‘cancellation (取消)’定义为 X，但你似乎指的是 Y — 到底是哪一个？”

### 锤炼模糊语言 (Sharpen fuzzy language)

当用户使用模糊或过载的术语时，提出一个精确的规范术语。“你刚才说了‘account (账号)’ — 你指的是 Customer (客户) 还是 User (用户)？这两者是不同的概念。”

### 讨论具体场景 (Discuss concrete scenarios)

当讨论领域关系时，使用具体场景进行压测。构想探查边缘情况的场景，迫使用户对概念之间的边界保持精确。

### 与代码交叉比对 (Cross-reference with code)

当用户说明某项机制的工作原理时，检查代码是否吻合。如果发现矛盾，将其浮出水面：“你的代码取消了整个 Order (订单)，但你刚才说可以部分取消 — 哪一个是正确的？”

### 在线更新 CONTEXT.md (Update CONTEXT.md inline)

当一个术语得到明确解决时，当场更新 `CONTEXT.md`。不要批量集中处理 — 随时发生随时捕获。使用 [CONTEXT-FORMAT.md](CONTEXT-FORMAT.md) 中的格式。

`CONTEXT.md` 应当完全没有任何实现细节。不要将 `CONTEXT.md` 视为规范文档、草稿本或实现决策的存储库。它是一份词汇表，仅此而已。

### 审慎地提供 ADR (Offer ADRs sparingly)

仅当以下三条同时满足时，才主动提议创建 ADR：

1. **难以逆转** — 以后改变主意的成本非常高昂
2. **缺乏上下文时令人困惑/意外** — 未来的读者会困惑“他们为什么要这样做？”
3. **真实权衡取舍的结果** — 存在切实可行的替代方案，且你出于特定原因选择了其中之一

如果缺少其中任何一条，跳过 ADR。使用 [ADR-FORMAT.md](ADR-FORMAT.md) 中的格式。
