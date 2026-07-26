---
name: grill-with-docs
description: 有状态的需求与架构追问。结合 grilling 与 domain-modeling，将追问成果实时落盘至 CONTEXT.md 和 docs/adr/。
disable-model-invocation: true
---

# 有状态追问与文档落盘

用户手动输入 `/grill-with-docs` 触发。

## 执行流程

1. **深度盘问**：调用 `grilling` 技能逐问追问用户提出的业务方案。
2. **实时落盘**：
   - 厘清的业务术语实时写入 `src/domains/<domain>/CONTEXT.md`。
   - 敲定的硬性决策实时写入 `docs/adr/XXXX-title.md`。
3. **生成输出总结**：
   盘问结束获得用户确认后，总结已建立的共识，并引导用户使用 `/to-spec` 生成正式规格说明。
