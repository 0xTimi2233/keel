---
name: codebase-design_zh
description: 代码库架构设计原则与六边形规范。中文审阅版。
disable-model-invocation: true
---

# 代码库架构设计指南

用户手动输入 `/codebase-design` 触发。

## 核心法则

- **Deep Modules**：遵循 [DEEPENING.md](references/DEEPENING.md)，提供小而稳定的公开接口，隐藏内部复杂度。
- **Design It Twice**：遵循 [DESIGN-IT-TWICE.md](references/DESIGN-IT-TWICE.md)，针对重大选型对比两种方案。
- **Hexagonal Architecture**：严格执行 [HEXAGONAL-ARCHITECTURE.md](references/HEXAGONAL-ARCHITECTURE.md) 中的物理目录布局、Traits 端口、Adapters 适配器以及 `-test-support` Fakes 规则。
