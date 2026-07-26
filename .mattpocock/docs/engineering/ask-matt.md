快速开始：

```bash
npx skills add mattpocock/skills --skill=ask-matt
```

```bash
npx skills update ask-matt
```

[源码](https://github.com/mattpocock/skills/tree/main/skills/engineering/ask-matt)

## 它的作用

`ask-matt` 是本仓库中所有技能的路由分发器（router）。你只需描述你所处的场景，它就会告诉你要使用哪个技能或流程，以及按什么顺序去运行它们。

它**本身不做具体工作**。它不会提问盘问（grill）、撰写规范文档，也不会修复任何问题——它只负责指引方向。它的存在主要是为了服务**用户主动调用**（user-invoked）的技能：没有任何机制会自动为你触发这些技能，因此*你*必须记住它们的存在，而 `ask-matt` 就是你用来卸载这部分记忆的工具。它还会为你指引那些你可以按名称调用的模型主动调用（model-invoked）技能——例如 `/tdd`、`/diagnosing-bugs`、`/prototype`、`/code-review`，以及两个词汇参考技能 `/domain-modeling` 和 `/codebase-design`。它回答“选哪个，以及何时选”，然后将你移交给真正执行工作的技能。

## 何时使用它

你可以通过输入 `/ask-matt` 来调用它——AI 代理（agent）不会自行主动使用它。

每当你不确定某个场景需要哪个技能或流程时，都可以使用它：比如你有一个想法却不知从何入手，手头有一堆 Bug 报告但不确定是否属于 `/triage`，或者有两个看起来可互相替代的技能你无法区分。如果你已经明确知道想要哪个技能，直接跳过路由器进行直接调用即可。

## 是流程，而不只是技能

`ask-matt` 引导你建立的核心思维模型是**流程**（flow）——即贯穿多个技能的路径，而非单一技能。绝大多数工作都沿着一条**主流程**（main flow）推进（想法 → 交付：盘问/澄清 → 规范/设计 → 任务卡片/拆解 → 实现 → 审查），两条**汇入通道**（on-ramps）会汇入其中（一条负责处理传入 Bug 和需求的分类通道；一条负责生成想法的代码库健康度通道），其余的则是独立的**单点技能**（standalone），可根据需要单独调用。提出一个问题，你就会被定位到正确的流程和正确的步骤上——而不仅仅是获得一个工具。

## 它的位置

`ask-matt` 是**路由分发器**——覆盖整个技能集的独立地图。它是其他所有文档页面都链接回的节点（如 [ask-matt](https://aihero.dev/skills-ask-matt)），因此它从不处在某条链条*内部*；它指向各个链条*内部*。从这里，你最常到达的是主流程的起点 [grill-with-docs](https://aihero.dev/skills-grill-with-docs)，或是处理非你自己创建工作的入口 [triage](https://aihero.dev/skills-triage)。当连路由分发器本身的图景都陈旧时，它的[源码](https://github.com/mattpocock/skills/tree/main/skills/engineering/ask-matt)就是权威的基准地图。
