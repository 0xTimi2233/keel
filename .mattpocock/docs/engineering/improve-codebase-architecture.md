快速开始：

```bash
npx skills add mattpocock/skills --skill=improve-codebase-architecture
```

```bash
npx skills update improve-codebase-architecture
```

[源码](https://github.com/mattpocock/skills/tree/main/skills/engineering/improve-codebase-architecture)

## 它的作用

`improve-codebase-architecture` 扫描代码库以寻找**加深模块深度的契机**（deepening opportunities）——即那些浅层模块（其接口复杂程度与其隐藏的实现几乎相当）可以演变为深层模块的地方——将其呈现为一份独立的视觉化 HTML 报告，然后就你挑选的候选方案进行深入追问盘问。

它**不会**为你提供一份平铺直叙的重构清单。每一个候选方案都必须通过**删除测试**（deletion test）——移除该模块是将复杂性*浓缩*在更小的接口背后，还是仅仅把复杂性挪到了别处？只有满足“浓缩”情况的方案才能获得一张建议卡片。正是这一过滤机制防止了报告变成泛泛而谈的清理建议。

除非你将其指定到某个具体区域，否则它还会自动将范围限定在实际发生开发的地方——读取最近的提交，从而偏向于你仍在修改的代码。加深模块的深度通过使其未来的修改更加轻松而获得回报，因此它对仓库中最近发生变更的部分赋予了更高的权重。

## 何时使用它

你可以通过输入 `/improve-codebase-architecture` 来调用它——AI 代理不会自行主动触发它。

把它作为定期健康检查使用：每隔几天，或者每当代码库开始让人觉得为了理解一个概念必须在多个小模块之间来回跳转时。它读取现有的架构并提出在哪里进行深化的建议。如果你已经明确知道想要重新设计的模块，且只需要词汇表来进行深入思考，请改用 [codebase-design](https://aihero.dev/skills-codebase-design)——本技能是发现候选对象的“勘探器”；而那个技能则是“设计工作台”。

## 加深深度的契机

整个技能围绕着一个核心思想展开：**深度**（depth）。一个深层模块在简洁、稳固的接口背后隐藏着大量功能；而一个浅层模块则通过与其底层代码几乎一样宽泛的接口泄漏其实现。该报告会寻找浅薄之处——仅仅为了可测试性而抽离的纯函数，而真正的 Bug 却隐藏在其如何被调用中（缺乏**局部性** locality）；跨越其**接缝**（seams）泄漏信息的模块；不打开五个文件就无法理解的概念——并提出可以解决该问题的深化方案。

它使用共享的设计词汇（**模块** module、**接口** interface、**深度** depth、**接缝** seam、**适配器** adapter、**杠杆率** leverage、**局部性** locality）以及来自 `CONTEXT.md` 的项目自身业务语言来表达，因此候选方案读起来会是“深化订单接收模块”，而绝非“重构 FooBarHandler”。

## 先出报告，后进行盘问

其输出是一个写入操作系统临时目录的、可在浏览器中查看的 HTML 文件——不会在仓库中留下残留。每个候选方案都是一张卡片，包含涉及的文件、痛点摩擦、通俗易懂的解决方案、在局部性和杠杆率方面的收益、前后对比图，以及 `强烈推荐`（Strong）/ `值得探索`（Worth exploring）/ `推测探索`（Speculative）徽章。它会以建议首先解决的那一项来收尾。

然后它会暂停并询问你想探索哪一个。挑选一个，它就会针对该设计运行 [grilling](https://aihero.dev/skills-grilling) 追问循环——约束条件、接缝背后隐藏了什么、哪些测试能够存续——并在决策成型时实时更新业务领域模型。

## 它的位置

`improve-codebase-architecture` 是**定期维护工具**——每隔几天运行一次，而不是作为某个链条中的固定步骤。它的邻居包括：[codebase-design](https://aihero.dev/skills-codebase-design)（拥有每个候选方案所使用的深度与接缝词汇）、[grilling](https://aihero.dev/skills-grilling)（一旦你选择了候选方案，负责沿着决策树进行追问）、以及 [domain-modeling](https://aihero.dev/skills-domain-modeling)（在重新设计确定下来时保持 `CONTEXT.md` 和 ADR 最新）。当你不确定使用哪个技能或流程时，[ask-matt](https://aihero.dev/skills-ask-matt) 会为你导航。
