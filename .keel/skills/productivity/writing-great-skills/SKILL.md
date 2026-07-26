---
name: writing-great-skills
description: 编写与编辑高确定性 AI Skill 的词汇、原则与结构规范。
disable-model-invocation: true
---

# 编写高品质 Skill 规范

Skill 的本质是从随机 LLM 系统中提取确定性。可预测性（Agent 每次运行采用相同流程）是最高原则。

阅读核心术语定义：[GLOSSARY.md](references/GLOSSARY.md)。

## 物理调用分类

- **模型调用（Model-invoked）**：保留 `description`，Agent 可自主触发，其他 Skill 可嵌套调用。增加 Context Load。
- **用户调用（User-invoked）**：在 frontmatter 中声明 `disable-model-invocation: true`，剥离模型视角描述，仅允许人类在终端显式输入命令。零 Context Load。

除必须由 Agent 自动感知或被其他 Skill 内部嵌套调用的技能外，所有编排类技能一律设为用户调用。

## 信息层级与渐进式暴露（Progressive Disclosure）

1. **Skill 主步骤（SKILL.md）**：按顺序书写的核心执行动作，每个步骤必须包含明确可查验的二元完成标准（Completion Criteria）。
2. **同地参考文件（Co-located References/Assets）**：将具体的范式、规则或模板下沉到 `references/` 或 `assets/` 目录。**主 `SKILL.md` 中必须包含指向子文件的显式 Markdown 链接（例如 `[描述](references/file.md)`），否则 Agent 不会自动读取。**

## 剪裁与无用语句检查（No-op Test）

对每一句话执行 No-op 测试：若删去该句不改变 Agent 的行为，直接删去整句。禁止使用“请注意”、“这非常重要”、“旨在帮助你”等无意义修辞废话。

## 引导词（Leading Words）

使用模型预训练积累的高密度专业词汇（如 Tracer Bullet, Deep Module, Seam, Red-Green, Single Source of Truth, Expand-Contract），用单个词汇锚定整块复杂行为。

## 失败模式防护（Failure Modes）

- **防止过早完成（Premature Completion）**：使用二元硬性完成标准（如：测试全绿、所有变更已注册）。
- **防止重复（Duplication）**：每个规则保持单源事实（Single Source of Truth），禁止多处复制。
- **防止沉积（Sediment）**：更新时及时剔除已废弃的旧规则。
- **正向断言（Positive Assertions）**：使用正向断言规定系统终态，禁止使用否定句式。
