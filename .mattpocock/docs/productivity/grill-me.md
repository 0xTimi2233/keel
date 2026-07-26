快速开始：

```bash
npx skills add mattpocock/skills --skill=grill-me
```

```bash
npx skills update grill-me
```

[源码](https://github.com/mattpocock/skills/tree/main/skills/productivity/grill-me)

## 它的作用

`grill-me` 就某个计划或设计进行不厌其烦的深入追问面试，走过决策树的每一个分支，直到你与 AI 代理达成**共同理解**。

它**一次只问一个问题**并等待回答。它绝不会一次性抛出一大堆问题——那会让人不知所措——对于可以通过阅读代码库来解答的问题，它会主动去阅读代码而非询问你。每个问题都会附带 AI 代理自身的推荐答案，因此你是在对一个建议做出回应，而不是盯着空白的提示词发呆。

## 何时使用它

你可以通过输入 `/grill-me` 来调用它——AI 代理不会自行主动触发它。

在构建之前使用它：当一个计划感觉大致正确，但你能隐约感知到其中隐藏着未解决的决策时——在你希望找出薄弱环节并将其公之于众的时刻。如果你希望在同样的追问盘问中同时留下一份包含 ADR 和词汇表的书面痕迹，请改用 [grill-with-docs](https://aihero.dev/skills-grill-with-docs)。如果工作庞大到无法在单个会话中容纳，且通往目标的路线依然迷雾重重——如全新项目或庞大的功能构建——请从上游更远处的 [wayfinder](https://aihero.dev/skills-wayfinder) 开始，它首先将其绘制为决策地图，然后再汇入本流程。

## 决策树

会话将计划作为一棵决策树进行梳理，逐个解决决策之间的依赖关系——父级决策在挂载于其下的选择之前被确定。重点不是迅速达成一致，而是将每个隐性的判定显性化，从而不遗留任何默默假设的重要事项。走出会话后，你将得到一份每个分支都已被梳理过的计划。

`grill-me` 是**无状态的**：它不写入任何内容，也不留下任何工作区痕迹。它可以在任何地方运行，唯一的产物就是对话本身中被磨砺得更加清晰的共识。这与 [grill-with-docs](https://aihero.dev/skills-grill-with-docs) 形成了鲜明的对比，后者将同样的追问过程记录为持久的 ADR 和词汇表。

## 它的位置

`grill-me` 是一个可随时使用的独立技能——每当计划需要加固时运行的构建前压力测试。它是 [grilling](https://aihero.dev/skills-grilling) 原语的无状态、用户调用的入口；它最近的邻居是 [grill-with-docs](https://aihero.dev/skills-grill-with-docs)，即运行相同追问但额外将决策记录为 ADR 和词汇表的有状态同胞技能。如果最终结果是希望记录为一份 spec 规范文档，请移交给 [to-spec](https://aihero.dev/skills-to-spec)，它会将确立的共识合成为 spec 而无需重新对你进行面试。当你不确定使用哪个流程时，[ask-matt](https://aihero.dev/skills-ask-matt) 会为你导航。
