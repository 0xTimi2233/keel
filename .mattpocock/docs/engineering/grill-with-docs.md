快速开始：

```bash
npx skills add mattpocock/skills --skill=grill-with-docs
```

```bash
npx skills update grill-with-docs
```

[源码](https://github.com/mattpocock/skills/tree/main/skills/engineering/grill-with-docs)

## 它的作用

`grill-with-docs` 就某个计划或设计对你进行不厌其烦的深入追问（每次只问一个问题），直到你与 AI 代理达成共同理解——并在推进过程中随手将词汇和决策记录下来。

这种追问**会留下书面痕迹**（paper trail）。普通的面试追问虽然能磨砺你的思路，但在会话结束时就会烟消云散；而本技能则在每个术语确定的瞬间将其捕获到 `CONTEXT.md` 词汇表中，并将重大且不可逆的决策记录为 ADR。这样，对齐成果便能在对话结束后继续存在，而不是仅留在你的大脑中。

## 何时使用它

你可以通过输入 `/grill-with-docs` 来调用它——AI 代理不会自行主动触发它。

在改动的最开始阶段使用它：当计划依然模糊、业务领域语言尚未确定，且你希望在编写任何代码之前对两者进行压力测试时。如果你只需要追问盘问过程而不需要产出文档产物，请使用 [grilling](https://aihero.dev/skills-grilling)；如果计划已经清晰，你只需要锁定或记录术语，请使用 [domain-modeling](https://aihero.dev/skills-domain-modeling)。如果改动过于庞大无法在单次会话中容纳，且路线图依然混沌不清——比如全新项目或庞大的功能构建——请从上游的 [wayfinder](https://aihero.dev/skills-wayfinder) 开始：它将把整个工作规划为一张决策地图，一旦前路清晰，就会交回给本主流程。

## 前置条件

该技能是有状态的——它会在追问的同时写入你的仓库。确定下来的术语会落入根目录下的 `CONTEXT.md` 词汇表中（如果在由 `CONTEXT-MAP.md` 标记的多上下文仓库中，则写入相关上下文的 `CONTEXT.md`），真正难以逆转的决策会作为 ADR 写入 `docs/adr/` 下。两者都是延迟创建的——在第一个术语或决策明确之前什么都不会存在——因此你不需要提前搭建任何脚手架，但你需要处于可以安全写入这些文件的环境中。

## 追问过程（The Grill）

其核心引擎是**盘问**（grill）：沿着决策树进行不厌其烦的、每次一个问题的梳理，在继续推进前先解决决策之间的依赖关系，并为每个问题提供推荐答案。代码库能够回答的问题会通过读取代码库来解决，而不是询问你。

使该变体成为独立技能的原因在于答案的归宿。随着盘问的运行，模糊的语言被精炼为规范术语并实时内联写入词汇表——而不是在最后批量写入。词汇表保持为词汇表：纯粹的词汇，没有实现细节，没有规范文档。ADR 极少提供，只有当决策难以逆转、脱离上下文会令人惊讶且属于真实权衡的结果时才会生成。大多数会话会产出更精准的词汇表以及极少或没有 ADR，这正是预期的形态。

## 正常工作的标志

- 它每次只提出一个问题并等待回答，而不是直接抛出一整份问卷。
- 术语在确定的瞬间就会以你项目自身的词汇写入 `CONTEXT.md`。
- 它在可能的情况下主动查看代码库以回答自己的问题。
- ADR 保持罕见——不会要求你对可逆的选择进行盖章认可。

## 它的位置

`grill-with-docs` 是主构建链的起始步骤：

```txt
grill-with-docs → to-spec → to-tickets → implement → code-review
```

它排在最前面，在任何内容被撰写为 spec 之前：它产出共同的理解和确定的词汇，然后由 [to-spec](https://aihero.dev/skills-to-spec) 将其合成为规范文档，而无需重新面试询问你。它最近的邻居是 [grilling](https://aihero.dev/skills-grilling)（不带文档产物的相同盘问过程）和 [domain-modeling](https://aihero.dev/skills-domain-modeling)（它所驱动的词汇表与 ADR 规范）。当你不确定使用哪个技能或流程时，[ask-matt](https://aihero.dev/skills-ask-matt) 会为你导航。
