# 生产力 (Productivity)

通用工作流工具，非针对具体代码。

## 用户调用 (User-invoked)

仅在手动输入时可达（Claude Code：`disable-model-invocation: true`；Codex：`agents/openai.yaml` 中的 `policy.allow_implicit_invocation: false`）。

- **[grill-me](grill-me/SKILL.md)** — 针对计划或设计接受严苛追问盘问，直到决策树的每一个分支都被解决。
- **[handoff](handoff/SKILL.md)** — 将当前对话精简压缩为交接文档，以便另一个代理可以接管工作。
- **[teach](teach/SKILL.md)** — 以当前目录作为有状态的教学工作区，跨多个环节教授用户一项新 Skill 或概念。
- **[writing-great-skills](writing-great-skills/SKILL.md)** — 编写和编辑优秀 Skill 的参考指南：使 Skill 具备可预测性的词汇和原则。

## 模型调用 (Model-invoked)

模型或用户均可达（包含丰富的触发短语，便于模型主动调用）。

- **[grilling](grilling/SKILL.md)** — 针对计划、决策或想法不懈地追问用户，直到决策树的每一个分支都被解决。
