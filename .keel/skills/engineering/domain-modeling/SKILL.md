---
name: domain-modeling
description: 领域建模与统一语言维护。在盘问过程中迭代维护 CONTEXT.md 词汇表与 docs/adr/ 架构决策记录。
disable-model-invocation: true
---

# 领域建模与文档维护

用户手动输入 `/domain-modeling` 或由上游编排技能触发。

## 执行流程

1. **Ubiquitous Language (CONTEXT.md)**：
   在限界上下文目录（如 `src/domains/<domain>/CONTEXT.md`）维护词汇表。
   格式见 [CONTEXT-FORMAT.md](assets/CONTEXT-FORMAT.md)。
2. **Single Source ADR (docs/adr/XXXX-title.md)**：
   针对不可逆的物理决策写入单源 ADR。
   格式见 [ADR-TEMPLATE.md](assets/ADR-TEMPLATE.md)。
