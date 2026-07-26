快速开始：

```bash
npx skills add mattpocock/skills --skill=to-spec
```

```bash
npx skills update to-spec
```

[源码](https://github.com/mattpocock/skills/tree/main/skills/engineering/to-spec)

## 它的作用

`to-spec` 将当前对话以及对代码库的理解转化为规范文档（spec，你可能在其他地方称此类文档为 PRD），然后将其发布到你的 Issue 跟踪器中。

它**不会**再次对你进行面试。当你使用它时，对齐工作已经完成——`to-spec` 汇聚合成的是已知内容，而不是提出新一轮的问题。

## 何时使用它

你可以通过输入 `/to-spec` 来调用它——AI 代理不会自行主动触发它。

在一项改动已被深入讨论且业务领域语言已经确定后使用它，当你希望在编写任何代码之前将该共同理解以书面形式记录下来时。如果你*尚未*达成对齐，请先进行盘问——对此，使用 [grill-with-docs](https://aihero.dev/skills-grill-with-docs)。要将完成的 spec 拆分为 ticket，请使用 [to-tickets](https://aihero.dev/skills-to-tickets)。

## 前置条件

`to-spec` 会发布到你的 Issue 跟踪器中，因此 [setup-matt-pocock-skills](https://aihero.dev/skills-setup-matt-pocock-skills) 必须首先为该仓库配置好跟踪器和分流标签。它本身会应用 `ready-for-agent` 标签——不需要单独的分流环节。

## 规范文档包含的内容

- **问题陈述** —— 在项目自身词汇体系下，说明什么东西损坏了或缺失了，以及为什么值得去解决。
- **解决方案** —— 在不涉及任何实现细节的情况下，高阶阐述修复方案的构想。
- **用户故事（User stories）** —— 一份详尽且已编号的列表，涵盖该改动必须支持的具体行为，每一个都可独立验证。
- **实现决策** —— 在对话期间已确定的选择，以免后续重新反复拉扯。
- **测试决策** —— 功能将被测试的接缝位置，以及“完成”（done）标准的定义。
- **超出范围事项（Out-of-scope）** —— 本次改动故意*不*涵盖的内容，以保持 ticket 的边界清晰。
- **补充说明** —— 任何值得延续传递但又不符合上述章节的其他内容。

## 深层模块

在撰写 spec 之前，`to-spec` 会勾勒出该功能将被测试的**接缝**，并寻找构建**深层模块**（deep module）的机会——即隐藏在简洁、稳固接口背后的大量功能。相比新接缝，它更倾向于使用现有接缝；相比低阶接缝，它更倾向于最高阶的接缝，理想情况下整个改动仅需一个接缝。

这对 AI 代理驱动的开发至关重要：良好的接口能为测试提供一个稳固的目标，因此底层的代码可以自由重构而无需改动测试。

## 正常工作的标志

- 它开始撰写 spec，而不是向你提出新一轮的问题。
- 它在撰写前与你确认接缝，并提出尽可能少的接缝方案。
- 产出的 spec 使用的是你项目的业务领域词汇，而非通用的模版套话。

## 它的位置

`to-spec` 是主构建链中的一个步骤：

```txt
grill-with-docs → to-spec → to-tickets → implement → code-review
```

在计划和业务语言解决之后、将工作拆分为实现 ticket 之前使用它。它关键的邻居是 [grill-with-docs](https://aihero.dev/skills-grill-with-docs)（用以精炼上下文以便 spec 足够精准）和 [to-tickets](https://aihero.dev/skills-to-tickets)（将 spec 转化为供 [implement](https://aihero.dev/skills-implement) 构建的一组 ticket）。当你不确定使用哪个技能或流程时，[ask-matt](https://aihero.dev/skills-ask-matt) 会为你导航。
