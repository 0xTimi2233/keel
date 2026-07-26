---
name: writing-great-skills
description: Use when creating, editing, or refactoring an AI Skill file (SKILL.md). Enforces high-determinism, leading-word assertions, and zero-fluff pruning.
---

# Skill 编写规范

核心目标：**Predictability（过程确定性）**。约束 Agent 在每次运行中执行相同的流程。

术语定义详见 [GLOSSARY.md](references/GLOSSARY.md)。

## 1. 物理调用配置 (Invocation)

- **Model-invoked**：省略 `disable-model-invocation`。描述在每轮对话中常驻上下文（产生 Context Load）。用于 Agent/Skill 自主触发。
- **User-invoked**：配置 `disable-model-invocation: true`。对 Agent 物理隐藏（零 Context Load）。仅允许人类在终端显式输入 `/command` 触发。
- **Router Skill**：当用户调用技能过多时，创建一个 User-invoked 技能作为入口，统一索引其他技能。

## 2. 描述编写规范 (Description)

- **前置核心词**：将描述的核心触发词放在句首。
- **一分支一触发**：每个逻辑分支只保留 1 个核心触发词，擦除所有同义词重构。
- **禁止重复正文**：描述仅声明触发条件，禁止重复正文中的实现细节。

## 3. 信息层级 (Information Hierarchy)

1. **In-skill Step**：`SKILL.md` 中的有序动作。每个步骤结尾必须绑定物理可查验的 **Completion Criterion**。
2. **In-skill Reference**：`SKILL.md` 内平铺的静态规则。
3. **External Reference**：下沉到独立文件的资料（如 [GLOSSARY.md](references/GLOSSARY.md)），通过 Markdown 链接按需加载（Progressive Disclosure）。

## 4. 技能切分时机 (When to Split)

- **按调用切分**：当某个功能有独立触发词，或需要被其他技能调用时，切出独立的 Model-invoked 技能。
- **按顺序切分**：当后续步骤会干扰 Agent 当前步骤的专注度时，将后续步骤隐藏到独立技能中（防止 Premature Completion）。

## 5. 剪裁与无用语句擦除 (Pruning)

- **Single Source of Truth**：每个规则只在一处定义，禁止多处重复。
- **No-op Test**：句级测试。如果删去某句话对 Agent 的行为零影响，直接整句擦除。
- **Leading Words**：使用大模型预训练固有词汇（如 `tight`, `red`, `tracer bullet`）替代长篇解释。

## 6. 常见失败模式 (Failure Modes)

- **Premature Completion**：步骤未真正完成就提前结束。防御：硬化二元 Completion Criterion，或切分隐藏后置步骤。
- **Duplication**：同一语义多处定义。收拢为 Single Source of Truth。
- **Sediment**：废弃的旧规则残留。定期清理擦除。
- **Sprawl**：技能文件过长。下沉参考资料到独立文件。
- **No-op**：默认已遵循的冗余规则。整句擦除。
- **Negation**：使用否定句反向激活错误行为。强制使用正向断言（Positive Assertions）规定目标行为。
