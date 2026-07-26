---
name: writing-great-docs
description: 撰写与维护高密度、防上下文污染、耐编辑破坏的静态项目系统文档（Vision、架构概览、设计系统）。
disable-model-invocation: true
---

# 编写项目系统文档规范

本文档用于指导编写项目全局静态文档（如 `docs/architecture.md`、`docs/vision.md`、`docs/design-system.md`）。

阅读具体文档分类标准与维护纪律：[DOC-STANDARDS.md](references/DOC-STANDARDS.md)。

## 核心原则

1. **防上下文污染（Progressive Disclosure）**：
   主文档只保留全局核心约束与系统全景（控制在 1-2 屏内）。具体子模块细节下沉到子目录文件，在主文档中使用显式 Markdown 链接按需加载。
2. **单源事实（Single Source of Truth）**：
   每个架构规则、API 契约或设计 Token 只能在一处定义。其他文档一律通过链接引用，禁止复制粘贴。
3. **正向断言与 No-op 剪裁**：
   使用正向断言规定系统终态。删去所有无实质约束的修辞套话。
4. **引导词锚定**：
   使用行业高密度词汇（如 Hexagonal Architecture, Contract-First, Deep Module, Event-Driven）替代长篇解释。
