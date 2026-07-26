# 术语表 (Glossary)

## 一、 核心美德

### Predictability (可预测性)
Agent 每次运行采取相同物理执行过程。根美德。
- *Avoid*: consistency, reliability, output-determinism

## 二、 物理调用轴 (Invocation)

### Model-Invoked (模型调用)
保留 `description`。Agent 自主触发与嵌套调用。付出 **Context Load**。

### User-Invoked (用户调用)
声明 `disable-model-invocation: true`。对 Agent 物理隐形，仅终端触发。**零 Context Load**，付出 **Cognitive Load**。

### Description (描述)
模型调用的机器可读触发器。常驻 **Context Pointer**。删去即转为 User-Invoked。

### Context Pointer (上下文指针)
常驻上下文的物理引用（如 Markdown 链接）。决定资料加载时机与可靠性。

### Context Load (上下文负载)
模型调用 `description` 逐轮占用上下文的 Token 与注意力物理开销。

### Cognitive Load (认知负载)
人类记住技能存在与触发时机的记忆负担。

### Router Skill (路由器技能)
索引其他 User-Invoked 技能的入口技能。降低 Cognitive Load。

### Granularity (粒度)
技能拆分细度。**By Invocation** 按引导词切分；**By Sequence** 隐去后置步骤防止 Premature Completion。

## 三、 信息层级轴 (Information Hierarchy)

### Information Hierarchy (信息层级)
按紧迫程度排列的内容梯子：Steps > In-skill Reference > External Reference。

### Steps (步骤)
`SKILL.md` 中有序动作。绑定二元物理 **Completion Criterion**。

### Reference (参考)
按需查阅的定义与规则。**Progressive Disclosure** 的主要下沉对象。

### External Reference (外部参考)
技能系统之外的静态文件，无 `description`，不可独立调用。

### Progressive Disclosure (渐进式暴露)
参考资料下沉至同目录链接 Markdown 文件。保持主文档清晰。

### Co-location (同地协作)
相关资料集中置于同一标题下（定义、规则、边界）。

### Sprawl (膨胀)
*失败模式*。技能体积仅因物理字数过长而损坏可读性。解法：信息层级下沉。

## 四、 运行时控制轴 (Steering)

### Branch (分支)
技能调用的独立路径分支。

### Leading Word (引导词)
预训练权重已存在的精炼概念（如 `tight`, `red`, `tracer bullet`）。单词唤醒先验知识，锚定物理行为。

### Completion Criterion (完成标准)
告知 Agent 工作完成的二元物理条件。必须 **Checkable** 与 **Exhaustive**。

### Legwork (腿部工作量)
Agent 单步内探查代码库、查阅文件的主动工作量。

### Post-Completion Steps (后置步骤)
当前步骤之后的后续步骤。露在上下文中诱导 Premature Completion。

### Premature Completion (过早完成)
*失败模式*。在步骤未完成前注意力滑向结束。防御：硬化 Completion Criterion 或隐藏后置步骤。

### Negation (否定诱导)
*失败模式*。禁止句（“不要思考大象”）反向激活被禁行为。解法：使用 **Positive Assertions** 规定目标行为。

## 五、 剪裁纪律轴 (Pruning)

### Single Source of Truth (单源事实)
规则与含义有且仅有唯一的权威物理出处。

### Duplication (重复)
*失败模式*。同一含义存在多个出处。

### Relevance (相关性)
每一行是否依然约束 Agent 行为。

### Sediment (沉淀)
*失败模式*。废弃旧规则因不敢删除而积聚沉淀。

### No-Op (无用语句)
*失败模式*。模型默认已遵循的句子。句级测试：删去不改变 Agent 默认行为即擦除。
