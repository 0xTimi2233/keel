# 领域文档（Domain Docs）

工程 Skill 在探索代码库时应如何消费此仓库的领域文档。

## 在探索前，请先阅读这些文件

- 仓库根目录下的 **`CONTEXT.md`**，或
- 仓库根目录下的 **`CONTEXT-MAP.md`**（如果存在）— 它指向每个上下文的 `CONTEXT.md`。阅读每个与主题相关的文档。
- **`docs/adr/`** — 阅读与你即将开展工作的区域相关的 ADR。在多上下文仓库中，还需检查 `src/<context>/docs/adr/` 以获取特定于上下文的决议。

如果这些文件有任何不存在，**请静默继续**。不要标记它们缺失；不要预先建议创建它们。`/domain-modeling` Skill（通过 `/grill-with-docs` 和 `/improve-codebase-architecture` 触发）会在术语或决议实际得到明确时按需延迟创建它们。

## 文件结构

单上下文仓库（绝大多数仓库）：

```
/
├── CONTEXT.md
├── docs/adr/
│   ├── 0001-event-sourced-orders.md
│   └── 0002-postgres-for-write-model.md
└── src/
```

多上下文仓库（根目录下存在 `CONTEXT-MAP.md`）：

```
/
├── CONTEXT-MAP.md
├── docs/adr/                          ← 系统级决议
└── src/
    ├── ordering/
    │   ├── CONTEXT.md
    │   └── docs/adr/                  ← 特定上下文的决议
    └── billing/
        ├── CONTEXT.md
        └── docs/adr/
```

## 使用词汇表中的术语

当你的输出中命名某个领域概念时（在 issue 标题、重构提案、假设、测试名称中），请使用 `CONTEXT.md` 中定义的术语。不要漂移到词汇表明确避免使用的同义词。

如果你需要的概念尚未在词汇表中，这是一个信号 — 要么是你正在捏造项目未使用的语言（需重新考量），要么是确实存在缺口（将其记录下来以便提交给 `/domain-modeling`）。

## 标记与 ADR 冲突的情况

如果你的输出与现有的 ADR 发生冲突，请显式提出，而非静默覆盖：

> _与 ADR-0007 (event-sourced orders) 冲突 — 但值得重新讨论，因为……_
