快速开始：

```bash
npx skills add mattpocock/skills --skill=codebase-design
```

```bash
npx skills update codebase-design
```

[源码](https://github.com/mattpocock/skills/tree/main/skills/engineering/codebase-design)

## 它的作用

`codebase-design` 为你设计**深层模块**（deep modules）提供了一套通用且精准的词汇表——深层模块是指隐藏在简洁接口背后、位于干净接缝处、且可以通过该接口进行测试的大量行为。

它是一门**语言，而非一套流程**。它不会重构你的代码，也不会为你提供一份重构计划——它规范了词汇（模块 module、接口 interface、深度 depth、接缝 seam、适配器 adapter、杠杆率 leverage、局部性 locality），以便每个设计讨论以及每个涉及设计的其他技能都能以相同的方式交流。保持一致的语言是其全部精髓；“组件”（component）、“服务”（service）、“API” 和 “边界”（boundary）等词被故意禁止使用，因为它们模糊了关键的区别。

## 何时使用它

你可以输入 `/codebase-design`，或者当任务匹配时 AI 代理会自动调用它。

当你在设计或改进模块接口、寻找加深模块深度的机会、决定接缝位置，或者提升代码的可测试性与 AI 导航性时，就可以使用它。其他技能在需要深层模块词汇时会自动拉取它。如果你想精炼项目的*业务领域*术语而非模块设计，请使用 [domain-modeling](https://aihero.dev/skills-domain-modeling)；若要对现有的代码库进行全面的架构审查与改造，请使用 [improve-codebase-architecture](https://aihero.dev/skills-improve-codebase-architecture)。

## 深层，而非浅层

当大量行为隐藏在一个简洁的接口背后时，模块就是**深层**（deep）的；而当接口几乎与实现一样复杂时，模块就是**浅层**（shallow）的。深度是通过**杠杆率**（leverage）来衡量的——即调用方（或测试）在其必须学习的每单位接口成本下能够触发多少行为。至关重要的是，深度是*接口*的属性，而非实现的属性：深层模块内部完全可以由小型、可替换的零部件组成，只是这些零部件永远不会暴露给调用方。

两项检查承担了大部分工作。**删除测试**（deletion test）：想象删掉该模块——如果复杂性随之消失，说明它只是个透传层；如果复杂性重新散落并显现在 N 个调用方中，说明它在真正发挥价值。以及“**单个适配器意味着假设性接缝，两个适配器才意味着真实接缝**”——在没有实际差异出现之前，不要切割接缝。

## 接口即测试表面

调用方和测试穿越的是同一个接缝，因此一个摆放恰当的接口能为测试提供一个稳固的目标，而底层的代码则可以自由重构。这就是为什么这套词汇坚持使用**接缝**（seam，Feathers 提出的术语——即你无需修改该处代码即可改变行为的地方），而非被过度使用的“边界”；也是为什么这里的“接口”意味着*调用方必须知道的一切事实*：包含函数签名，但也包含不变性（invariants）、顺序要求、错误模式和性能表现——而不单单是类型层面的表象。

## 故意独立抽出

`codebase-design` 是深层模块词汇的**唯一事实来源**（single source of truth），作为一个独立的模型主动调用技能被拆分出来，以便任何工具都可以使用它。其他技能会指向它，而不是重复阐述这些词汇：[tdd](https://aihero.dev/skills-tdd) 借用它在编写测试前放置接缝，[improve-codebase-architecture](https://aihero.dev/skills-improve-codebase-architecture) 在重构现有代码时依赖它，而 [to-spec](https://aihero.dev/skills-to-spec) 在撰写规范前勾勒接缝和深化机会时也会使用它。

将其保持独立的意义在于，你也可以单独使用它——作为思考模块设计方式的**参考指南**——而无需触发任何那些技能所要求的更大流程。在同一个地方规范一次词汇，每个设计讨论都会从中受益。

## 它的位置

`codebase-design` 是一个**可随时使用的独立技能**——位于工程技能之下的共享词汇层。它最近的邻居是 [domain-modeling](https://aihero.dev/skills-domain-modeling)，后者是面向问题领域而非模块结构的平行词汇技能。当你不确定使用哪个技能或流程时，[ask-matt](https://aihero.dev/skills-ask-matt) 会为你导航。
