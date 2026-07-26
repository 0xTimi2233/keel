快速开始：

```bash
npx skills add mattpocock/skills --skill=implement
```

```bash
npx skills update implement
```

[源码](https://github.com/mattpocock/skills/tree/main/skills/engineering/implement)

## 它的作用

`implement` 用于实现规范文档（spec）或一组任务卡片（tickets）中描述的工作——通过测试驱动开发、类型检查以及全量测试套件驱动整个实现流程，然后移交给审查阶段并提交到当前分支。

它**不会**决定要构建什么。规范文档已经确定，接缝也已达成共识；`implement` 执行的是该计划，而不是重新开启讨论。它是双手，而不是大脑——思考过程已经在上游完成。

## 何时使用它

你可以通过输入 `/implement` 来调用它——AI 代理不会自行主动触发它。

当工作已经记录为 spec 或拆分为 ticket，且你准备好将其转化为代码时，就可以使用它。如果 spec 尚不存在，请先撰写它——对此，使用 [to-spec](https://aihero.dev/skills-to-spec)，或者使用 [to-tickets](https://aihero.dev/skills-to-tickets) 将 spec 拆分为 ticket。如果你只想在没有完整 spec 的情况下以测试先行的方式构建某些内容，可以直接降级使用 [tdd](https://aihero.dev/skills-tdd)。

## 预先约定的接缝

`implement` 运行的核心思想是**接缝**（seam）——在编写任何代码之前选择的、对功能进行测试的稳定接口。它不会在构建中途捏造接缝；它使用已挑选好的接缝（在 [to-spec](https://aihero.dev/skills-to-spec) 期间），并通过 [tdd](https://aihero.dev/skills-tdd) 针对它们编写测试。在预先约定的接缝处工作是保持实现真实可靠的关键：测试针对的是稳固的目标，因此底层的代码可以自由重构而无需改动测试。

围绕这一核心，它保持着紧密的循环——频繁进行类型检查、随写随运行单个测试文件、最后运行全量测试套件——然后通过一次审查环节并提交到当前分支来收尾。

## 它的位置

`implement` 是靠近主链条末端、紧邻审查之前的构建步骤：

```txt
grill-with-docs → to-spec → to-tickets → implement → code-review
```

在工作完成规范编写和序列排布之后再使用它，而不是在此之前。它关键的邻居是 [to-tickets](https://aihero.dev/skills-to-tickets)（负责生成其所执行的 ticket，每个 ticket 声明了其阻塞依赖边缘）以及 [tdd](https://aihero.dev/skills-tdd)（在运行其自身的 [code-review](https://aihero.dev/skills-code-review) 环节并提交之前，它在内部驱动该技能在每个接缝处编写测试）。当你不确定使用哪个技能或流程时，[ask-matt](https://aihero.dev/skills-ask-matt) 会为你导航。
