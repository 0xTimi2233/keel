---
name: domain-modeling
description: 领域建模与统一语言维护。在盘问过程中迭代维护 CONTEXT.md 词汇表与 docs/adr/ 架构决策记录。
disable-model-invocation: true
---

# 领域建模与文档维护

用户手动输入 `/domain-modeling` 或由上游编排技能触发。

## 物理文件维护规则

1. **统一语言字典（CONTEXT.md）**：
   在限界上下文目录（如 `src/domains/<domain>/CONTEXT.md`）下维护领域通用词汇。
   格式见 [CONTEXT-FORMAT.md](assets/CONTEXT-FORMAT.md)。
2. **架构决策记录（docs/adr/XXXX-title.md）**：
   针对不可逆的硬性决策（如技术选型、算法变更、物理解耦），写入单源 ADR。
   格式见 [ADR-TEMPLATE.md](assets/ADR-TEMPLATE.md)。
