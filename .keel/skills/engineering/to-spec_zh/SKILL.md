---
name: to-spec_zh
description: 合成标准 Spec PRD、BDD .feature 试卷与发布 Parent Issue。中文审阅版。
disable-model-invocation: true
---

# 需求规格化 (To Spec)

用户手动输入 `/to-spec [Feature Name]` 触发。

## 执行流程

1. **探查代码库**：探查现有领域与端口，确定本 Feature 的技术接缝（Seams）。
2. **合成 Spec 内容**：严格按照 [SPEC-TEMPLATE.md](assets/SPEC-TEMPLATE.md) 格式在内存中合成规范。
3. **生成 BDD 验收试卷**：在 `tests/features/<feature>.feature` 生成 Given-When-Then 文本。
4. **发布 Parent Spec Issue**：调用 `gh issue create --title "Spec: <Name>" --body "..."` 发布到 GitHub。
