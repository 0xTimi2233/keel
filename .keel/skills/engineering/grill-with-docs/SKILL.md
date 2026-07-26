---
name: grill-with-docs
description: 有状态的需求与架构追问。结合 grilling 与 domain-modeling，将追问成果实时落盘至 CONTEXT.md 和 docs/adr/。
disable-model-invocation: true
---

# 有状态追问与文档落盘

用户手动输入 `/grill-with-docs` 触发。

## 执行流程

1. **深度盘问**：调用 [grilling SKILL.md](../productivity/grilling/SKILL.md) 逐问追问方案。
2. **实时落盘**：
   - 业务术语实时写入 `src/domains/<domain>/CONTEXT.md`。
   - 硬性决策实时写入 `docs/adr/XXXX-title.md`。
3. **引导下一个技能**：盘问获用户确认后，引导使用 `/to-spec` 生成正式 Spec。
