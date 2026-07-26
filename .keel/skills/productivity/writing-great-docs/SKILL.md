---
name: writing-great-docs
description: Use when creating, writing, or editing project system documentation (architecture.md, vision.md, design-system.md, etc.) to prevent context bloat and enforce single source of truth.
---

# 项目系统文档编写规范

核心目标：撰写高密度、防上下文污染、单源事实的静态系统文档。

规范标准详见 [DOC-STANDARDS.md](references/DOC-STANDARDS.md)。

## 1. 防上下文污染 (Progressive Disclosure)

- **主文档控制**：全局主文档 (`docs/architecture.md`, `docs/vision.md`) 仅保留核心约束与全景图，控制在 1-2 屏内。
- **细节下沉**：具体子模块与实现细节下沉到子目录文件，通过 Markdown 链接按需加载。

## 2. 单源事实 (Single Source of Truth)

- **零重复定义**：每个架构规则、设计 Token 或选型决策只能在一处权威文档定义。
- **链接引用**：其他文档一律通过物理 Markdown 链接引用，禁止复制粘贴。

## 3. 指令与剪裁 (Pruning)

- **Positive Assertions**：强制使用正向断言声明终态。
- **No-op Test**：句级测试。删去无实质约束力的修辞套话。
- **Leading Words**：使用行业预训练概念（如 `Hexagonal Architecture`, `Contract-First`, `Deep Module`）锚定规则。
