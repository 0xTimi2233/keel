快速开始：

```bash
npx skills add mattpocock/skills --skill=domain-modeling
```

```bash
npx skills update domain-modeling
```

[源码](https://github.com/mattpocock/skills/tree/main/skills/engineering/domain-modeling)

## 它的作用

`domain-modeling` 在你设计时构建并精炼项目的**通用语言**（ubiquitous language）——质疑模糊的术语，用具体场景对关系进行压力测试，并在词汇和决策成型时立即将其记录下来。

这是一门**主动**的规范，而非被动的规范。仅仅阅读 `CONTEXT.md` 来借用其词汇是任何技能都可以做到的单行习惯；而该技能适用于当你正在*改变*模型时——创造一个权威规范的术语、捕获代码与你刚才所说内容之间的矛盾、记录一个难以逆转的决策。同时它保持词汇表的纯粹：`CONTEXT.md` 是一个词汇表且仅此而已——没有实现细节、没有规范文档、没有临时草稿。

## 何时使用它

你可以输入 `/domain-modeling`，或者当任务匹配时 AI 代理会自动调用它——例如当你正在锁定术语、化解被过度重载的词汇或记录架构决策时。

当*词汇*本身成为问题时使用它：两个人对“取消”（cancellation）的理解不同，“账户”（account）承担了三种职责，或者设计讨论总是卡在一个从未被精准命名的概念上。如果问题在于模块的*形状*——接缝放置在哪里、接口有多深——请使用 [codebase-design](https://aihero.dev/skills-codebase-design)。如果你希望在构建前对计划本身进行盘问，请使用 [grilling](https://aihero.dev/skills-grilling)。

## 前置条件

该技能会在两个地方写入内容，两者都是延迟创建的——只有在有内容需要记录时才会创建。确定下来的术语会写入根目录下的 `CONTEXT.md`（或者在由 `CONTEXT-MAP.md` 标记的多上下文仓库中，写入各自上下文对应的 `CONTEXT.md`）。决策会写入 `docs/adr/`。前期不需要预先存在任何文件；第一个确定下来的术语会创建词汇表，第一个真正的权衡会创建 ADR。

## 词汇表 vs. ADR

两个产物，两种不同的门槛：

- **词汇表**（`CONTEXT.md`）记录语言。每当一个模糊的术语被确定为规范表达时，它就会被实时内联写入——而不是批量写入——从而使共享词汇表与对话保持同步。它绝不包含任何实现细节。
- **ADR** 记录决策，且门槛很高：只有当选择满足**难以逆转**、**脱离上下文会令人惊讶**且**属于真实权衡的结果**时，才会提出。三者缺一不可，否则就不生成 ADR。这正是保持 `docs/adr/` 成为重要抉择分叉点的记录、而非流水账日记的原因。

让它产生实效的核心举措：当你陈述某事物如何运作时，该技能会交叉比对代码并揭示矛盾——“你的代码取消了整个订单（Orders），但你刚才说可以部分取消——哪一个是正确的？” 语言和代码被强制达成一致。

## 故意独立抽出

`domain-modeling` 是构建项目通用语言的**唯一事实来源**，作为一个独立的模型主动调用技能被拆分出来，以便任何其他技能都可以使用它。[grill-with-docs](https://aihero.dev/skills-grill-with-docs) 在盘问环节运行时依赖它记录术语和决策，[triage](https://aihero.dev/skills-triage) 使用它让任务卡片保持使用项目自身的词汇，而 [improve-codebase-architecture](https://aihero.dev/skills-improve-codebase-architecture) 在工作时也会使用它。

将其保持独立意味着你也可以直接使用它——作为如何精炼模型的**参考指南**——而无需承诺履行任何那些技能所要求的步骤。语言存在于一个地方，需要它的所有东西都指向那里。

## 它的位置

`domain-modeling` 是一个**可随时使用的独立技能**，它运行在其他技能*底层*的频率与在固定步骤中运行的频率一样高。它最近的邻居是 [codebase-design](https://aihero.dev/skills-codebase-design)，因为共享语言能够让你精准命名深层模块及其接缝；在下游，一个确定的词汇表正是 [to-spec](https://aihero.dev/skills-to-spec) 用来合成以项目自身词汇撰写的规范文档的依据。当你不确定使用哪个技能或流程时，[ask-matt](https://aihero.dev/skills-ask-matt) 会为你导航。
