快速开始：

```bash
npx skills add mattpocock/skills --skill=code-review
```

```bash
npx skills update code-review
```

[源码](https://github.com/mattpocock/skills/tree/main/skills/engineering/code-review)

## 它的作用

`code-review` 审查 `HEAD` 与你提供的固定基点（提交、分支、标签或 merge-base）之间的差异（diff），并沿着两条独立的轴线进行分析：**Standards（代码规范维度）**（代码是否遵循了本仓库记录的规范约定？）和 **Spec（需求规范维度）**（它是否实现了源 issue 或 spec 所要求的改动？）。它将每条轴线作为独立的并行子代理（sub-agent）运行，并并排报告结果。它绝不会合并或重新排序这两套审查结果——保持它们的分离正是该技能的核心所在，因为一项改动可能会通过其中一条轴线却未通过另一条，而单一混合的裁定会让其中一边掩盖另一边。

## 何时使用它

你可以输入 `/code-review`，或者当你要求审查某个分支、PR、正在进行中的改动或任何“自 X 节点以来”的变动时，AI 代理会自动调用它。

当存在需要对照已知良好基点进行判定的 diff，且你希望独立解答这两个问题——*是否正确地构建了代码？* 以及 *构建的东西是否正确？* 时，就可以使用它。它在构建循环的末端运行；对于真正以测试驱动方式编写代码，请使用 [tdd](https://aihero.dev/skills-tdd)；而对于将整份规范转化为代码，请使用 [implement](https://aihero.dev/skills-implement)，它会在提交前自行运行一次 `/code-review` 审查环节。

## 前置条件

**Spec** 维度需要有地方来获取源 spec——比如提交信息中的 issue 引用、你传入的路径，或者 `docs/`/`specs/` 下的 spec 文件。此 issue 跟踪器的集成来自于 [setup-matt-pocock-skills](https://aihero.dev/skills-setup-matt-pocock-skills)；如果没有 spec，Spec 轴线会直接跳过并明确说明。**Standards** 维度则不需要设置任何内容——即使在没有记录任何规范的仓库中，它也始终附带内置的 Fowler 代码坏味道基线。

## 双轴并行，绝不合并

其核心特色是**双轴线**。**Standards** 询问 diff 是否符合本仓库的代码编写习惯——即 `CODING_STANDARDS.md` 或 `CONTRIBUTING.md`，再加上约 12 个 Fowler 代码坏味道（如 神秘命名 Mysterious Name、重复代码 Duplicated Code、依恋情结 Feature Envy、数据泥团 Data Clumps 等）的固定基线。两条规则保障该基线的合理性：已记录的仓库规范始终优先于基线，且每一个坏味道都是主观裁定，而非硬性违规。**Spec** 则询问正交的问题——代码是否真正实现了 issue 或 spec 要求的内容，且既没有遗漏需求也没有偷偷引入范围蔓延（scope creep）？

它们作为并行子代理运行，因此双方不会污染彼此的上下文，最终的报告会在单独的 `## Standards` 和 `## Spec` 标题下呈现，并附带各自轴线的总结。两条轴线之间故意不设唯一的胜者。

## 正常工作的标志

- 首先锁定并确认固定基点（`git rev-parse`），对于错误的引用或空的 diff 会快速失败，而不是在子代理内部报错。
- Standards 和 Spec 的审查发现分两个清晰的区块输出，各自引用其来源——一方引用仓库规范或基线坏味道，另一方引用引用的 spec 行文本。
- 当找不到 spec 时，Spec 轴线报告“无可用的 spec”，而不是凭空捏造需求。

## 它的位置

`code-review` 是主构建链末端的审查步骤：

```txt
grill-with-docs → to-spec → to-tickets → implement → code-review
```

它最近的邻居是 [implement](https://aihero.dev/skills-implement)，后者驱动构建并在提交前将本技能作为其自身的审查环节进行调用；在上游，它所对照检查的 spec 是由 [to-spec](https://aihero.dev/skills-to-spec) 和 [to-tickets](https://aihero.dev/skills-to-tickets) 生成的。当你不确定使用哪个技能或流程时，[ask-matt](https://aihero.dev/skills-ask-matt) 会为你导航。
