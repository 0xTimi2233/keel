快速开始：

```bash
npx skills add mattpocock/skills --skill=grilling
```

```bash
npx skills update grilling
```

[源码](https://github.com/mattpocock/skills/tree/main/skills/productivity/grilling)

## 它的作用

`grilling` 是一项在构建之前对计划或设计进行压力测试的不厌其烦的追问面试。它沿着决策树分支逐个梳理，一次解决决策之间的一个依赖关系，直到你与 AI 代理达成共同理解。

它**一次只问一个问题**并在提出下一个问题之前等待你的回答——绝不出抛出一长串批量清单，那会让人不知所措。每个问题都会附带 AI 代理自身的推荐答案，对于代码库能够解答的任何问题，它会主动探索而非询问你。在确认达成共同理解之前，它不会开始执行该计划。

## 何时使用它

你可以输入 `/grilling`，或者当任务匹配时 AI 代理会自动调用它——这是底层原语（primitive），而不单纯是仅供用户使用的入口点。

当一个计划或设计依然存在薄弱环节且你希望在编写代码前将其暴露出来时，就可以使用它。在实践中，你通常会通过它的两个包装器（wrappers）之一来调用它，而不是直接按名称调用：对于纯粹的追问会话，使用 [grill-me](https://aihero.dev/skills-grill-me)；要让会话在推进的同时撰写 ADR 和词汇表，请使用 [grill-with-docs](https://aihero.dev/skills-grill-with-docs)。

## 决策树

其思维模型是一棵**决策树**：每个计划都会分叉为多个决策，而决策之间互相依赖。`grilling` 每次向下走过该树的一个节点，因此早期的回答可以重塑接下来要提出的问题。这就是为什么问题逐个抛出且按依赖顺序呈现——批量灌入并行问题会破坏使面试收敛并达成共同理解的结构。

## 故意独立抽出

`grilling` 是该追问面试技巧的**唯一事实来源**（single source of truth），作为一个由模型调用的**原语**（primitive）被拆分出来，以便每个需要追问面试的技能都可以使用它，而无需重新发明轮子。[grill-me](https://aihero.dev/skills-grill-me) 和 [grill-with-docs](https://aihero.dev/skills-grill-with-docs) 是其两个供用户调用的前端入口，但 [improve-codebase-architecture](https://aihero.dev/skills-improve-codebase-architecture) 和 [triage](https://aihero.dev/skills-triage) 也会依赖它来对其自身的决策进行压力测试。

将该技巧保存在一个地方意味着当你只想要追问过程——而不需要其包装器所叠加的 ADR 撰写或 ticket 梳理时，你也可以直接使用它。

## 它的位置

`grilling` 是主构建链底层的面试**原语**：[grill-with-docs](https://aihero.dev/skills-grill-with-docs) 运行它以在 [to-spec](https://aihero.dev/skills-to-spec) 撰写 spec 之前精炼上下文。当你不确定使用哪个入口点时，[ask-matt](https://aihero.dev/skills-ask-matt) 会为你导航。
