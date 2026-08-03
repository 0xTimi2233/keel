---
name: domain-modeling
description: 主动构建并打磨项目的领域模型；当用户想敲定领域术语或统一语言、记录架构决策，或其他 skill 需要维护领域模型时使用
---

设计过程中主动构建和打磨项目的领域模型：挑战术语、构造边缘场景、在概念结晶的当下写下术语表和决策。本 skill 只在**改变**模型时启用，仅仅查词汇无需启用

## 文件结构

多数仓库只有一个上下文：

```
/
├── context.md
├── docs/
│   └── adr/
│       ├── 0001-event-sourced-orders.md
│       └── 0002-postgres-for-write-model.md
└── src/
```

根目录存在 `context-map.md` 时，仓库有多个上下文，由它指明各自位置：

```
/
├── context-map.md
├── docs/
│   └── adr/                          # 全局决策
├── src/
│   ├── ordering/
│   │   ├── context.md
│   │   └── docs/adr/                 # 上下文专属决策
│   └── billing/
│       ├── context.md
│       └── docs/adr/
```

**惰性创建**：只在有内容可写时才创建文件。没有 `context.md` 时，第一个术语敲定后才建；没有 `docs/adr/` 时，第一条 ADR 需要时才建

## 会话中

- **挑战术语**：用户用词与 `context.md` 已有语言冲突时立即指出："你的术语表把 cancellation 定义为 X，但你这里似乎指 Y，是哪个？"
- **打磨模糊用语**：用户使用含糊或过载的术语时，给出精确的规范术语："你说的 account 是指 Customer 还是 User，两者是不同的东西"
- **用具体场景检验**：讨论领域关系时用具体场景压测，构造探测边缘情况的场景，逼用户厘清概念边界
- **与代码交叉验证**：用户描述行为方式时核对代码是否一致，发现矛盾就指出："代码把整个 Order 取消，但你刚说可以部分取消，哪个是对的？"
- **即时更新**：术语一敲定就写入 `context.md`，不要等批量处理。格式见 [context-format.md](./references/context-format.md)

`context.md` 只放术语表，绝不掺杂实现细节：它不是规范、草稿或实现决策的仓库

## 克制地提供 ADR

三条同时满足才提议创建 ADR：

1. **难逆转**：后续反悔或重构的成本昂贵
2. **脱离上下文令人费解**：未来读者会想"为什么这么做"
3. **存在真实权衡**：确有备选方案，因特定原因选定其一

缺任一条就跳过。格式见 [adr-format.md](./references/adr-format.md)
