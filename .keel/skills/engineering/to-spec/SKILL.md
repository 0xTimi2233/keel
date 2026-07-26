---
name: to-spec
description: 将对话上下文与业务共识合成为标准的 Parent Spec (PRD)，生成 BDD .feature 试卷，并在 GitHub 上发布 Parent Issue。
disable-model-invocation: true
---

# 需求规格化 (To Spec)

用户手动输入 `/to-spec [Feature Name]` 触发。

## 执行流程

1. **探查代码库**：探查现有领域与端口，确定本 Feature 的技术接缝（Seams）。
2. **合成 Spec 内容**：严格按照 [SPEC-TEMPLATE.md](assets/SPEC-TEMPLATE.md) 格式在内存中合成规范。
3. **生成 BDD 验收试卷**：在 `tests/features/<feature>.feature` 生成 Given-When-Then 文本。
4. **发布 Parent Spec Issue**：调用 `gh issue create --title "Spec: <Name>" --body "..."` 发布到 GitHub。
