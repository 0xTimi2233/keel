快速开始：

```bash
npx skills add mattpocock/skills --skill=to-tickets
```

```bash
npx skills update to-tickets
```

[源码](https://github.com/mattpocock/skills/tree/main/skills/engineering/to-tickets)

## 它的作用

`to-tickets` 将一个计划、规范文档（spec）或当前对话拆分为一组 **ticket（任务卡片）**——每一个都是曳光弹式的垂直切片——并发布到你配置好的跟踪器中，且每个 ticket 都会明确声明阻塞它的上游 ticket。

每一个 ticket 都是一颗**曳光弹**（tracer bullet）——一个贯穿所有集成层（Schema、API、UI、测试）的端到端的薄*垂直*切片，而绝非单层的水平切片。一个完成的切片本身就是可演示、可验证的，这使得每个 ticket 都能安全地交给 AI 代理去执行。

## 何时使用它

你可以通过输入 `/to-tickets` 来调用它——AI 代理不会自行主动触发它。

一旦有了达成的计划或书面的 spec，且你希望将其拆分为 ticket 时，就可以使用它。你可以将其指向当前对话，或者传入 spec 或 issue 引用，它会首先获取其正文和评论内容。如果改动尚未撰写为 spec，请先产出一份——对此，使用 [to-spec](https://aihero.dev/skills-to-spec)。

## 前置条件

`to-tickets` 会发布到你的 Issue 跟踪器中，因此 [setup-matt-pocock-skills](https://aihero.dev/skills-setup-matt-pocock-skills) 必须首先为该仓库配置好跟踪器及其分流标签词汇表。在真实的跟踪器上，它会在发布时自动应用 ready-for-agent 标签。

## 统一产物，两种解读

阻塞依赖边缘（blocking edges）是全篇的核心。它们使得同一组 ticket 根据跟踪器的不同有两种呈现方式：

- **本地文件** → 在 `.scratch/<feature>/issues/` 下每个 ticket 生成一个文件，按阻塞依赖优先排序，依赖关系写为文本。你从上到下逐个手动处理，始终保持人在回路中（in the loop）。
- **真实跟踪器（GitHub, Linear）** → 每个 ticket 对应一个 issue，依赖关系体现为原生阻塞链接（或子 issue）。任何阻塞依赖已全部完成的 ticket 都处于**前沿**（frontier），可随时被领取——因此多个 AI 代理可以并行运行。

无论介质如何，依赖边缘都存在于 ticket 中；介质仅决定是否有机制去并行执行它们。`to-tickets` 负责产出该产物——你如何运行它（手动串行执行，还是并行代理集群）完全取决于你。

## 垂直切片，而非水平切片

整个技能围绕着一个核心区别展开。**水平**切片交付的是改动的某一个层（例如所有的 Schema，或所有的 API），在每一层都落地之前没有东西可以正常工作。而**垂直**切片（曳光弹）则一次性交付贯穿*所有*层的一条狭长路径，因此只要完成就可以立即进行演示。

在切片之前，`to-tickets` 会寻找预重构（prefactoring）的机会——“先让变更变得容易，再去进行容易的变更”——并优先安排这部分工作。然后它会对拆分方案向你进行提问确认（粒度、阻塞边缘、哪些合并或拆分），最后才发布内容，并优先发布阻塞源，以便每个 ticket 的“被此阻塞”（Blocked by）能够引用真实的 ticket。

## 大范围重构特例

有一种形态突破了曳光弹规则：**大范围重构**（wide refactor）——即单一的机械式改动（重命名列、重断言共享符号的类型），其**爆炸半径**（blast radius）波及整个代码库，导致一次修改就会打破数千个调用点，没有任何垂直切片可以单独处于绿色（测试通过）状态。`to-tickets` 将其切片为**扩展-收缩**（expand–contract）模式：扩展（在旧形式旁添加新形式，使任何功能都不破损），迁移（按爆炸半径划分为多个批次分批迁移调用点，每批一个 ticket，期间 CI 全程保持绿色，因为旧形式依然存在），然后收缩（在没有调用方残留后删除旧形式）。当连分批迁移都无法单独保持绿色时，它们将共享一个集成分支（integration branch），共同阻塞最终的“集成与验证”ticket，且仅在最终 ticket 处保证绿色通过。

## 它的位置

`to-tickets` 是主构建链中的一个步骤：

```txt
grill-with-docs → to-spec → to-tickets → implement → code-review
```

它位于 [to-spec](https://aihero.dev/skills-to-spec)（向其递交附带用户故事的确定 spec 以供切片）和 [implement](https://aihero.dev/skills-implement)（构建每个 ticket，并在其 [code-review](https://aihero.dev/skills-code-review) 审查环节前在内部驱动 [tdd](https://aihero.dev/skills-tdd) 以测试先行的方式编写测试）之间。每个全新的上下文处理前沿上的一个 ticket，并在处理间隔中清理上下文。当你不确定使用哪个技能或流程时，[ask-matt](https://aihero.dev/skills-ask-matt) 会为你导航。
