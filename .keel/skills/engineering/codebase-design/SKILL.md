---
name: codebase-design
description: 代码库架构设计原则：契约优先、DDD 限界上下文、六边形 Ports & Adapters、垂直切片与深模块设计。
disable-model-invocation: true
---

# 代码库架构设计指南

用户手动输入 `/codebase-design` 触发。

## 核心设计法则

1. **深模块原则（Deep Modules）**：
   模块必须提供小而稳定的公开接口，隐藏内部复杂的实现。遵循 [DEEPENING.md](references/DEEPENING.md) 中的深化原则。
2. **两次设计原则（Design It Twice）**：
   对于重大接口与选型，遵循 [DESIGN-IT-TWICE.md](references/DESIGN-IT-TWICE.md) 至少设计两种不同方案进行对比取舍。
3. **六边形架构规范（Hexagonal Architecture）**：
   查阅并严格执行 [HEXAGONAL-ARCHITECTURE.md](references/HEXAGONAL-ARCHITECTURE.md) 中的物理目录布局、Traits 端口、Adapters 适配器以及 `-test-support` 假替身规则。
