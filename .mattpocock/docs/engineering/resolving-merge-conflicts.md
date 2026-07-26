快速开始：

```bash
npx skills add mattpocock/skills --skill=resolving-merge-conflicts
```

```bash
npx skills update resolving-merge-conflicts
```

[源码](https://github.com/mattpocock/skills/tree/main/skills/engineering/resolving-merge-conflicts)

## 它的作用

`resolving-merge-conflicts` 用于处理正在进行中的 git merge 或 rebase 冲突，按冲突块（hunk）逐块排查并完成操作——解决冲突、验证通过并完成提交。

它根据**意图**而非简单的文本内容进行解决。在修改冲突块之前，它会先将每一侧改动追溯到其**第一手资料**（提交信息、PR、原始 issue），以理解做此改动的初衷，然后在两者兼容的情况下同时保留双方意图。它绝不会捏造新行为来抹平冲突，也绝不使用 `--abort`：合并任务始终会被推至完成。

## 何时使用它

你可以输入 `/resolving-merge-conflicts`，或者当任务匹配时 AI 代理会自动调用它。

当处于 merge 或 rebase 过程中且 git 因无法自动解决冲突而暂停时，就可以使用它。它用于处理眼前的冲突——而非规划合并过程或调试事后被破坏的行为。如果合并已经完成，但有些功能因你看不出原因的缘故而报错失败，请改用 [diagnosing-bugs](https://aihero.dev/skills-diagnosing-bugs)。

## 按意图解决

解决冲突中的陷阱是将冲突视为单纯的文本问题——为了消掉冲突标记而盲目选择“我们的”（ours）或“他们的”（theirs）。本技能将冲突视为**意图**问题。冲突块的每一侧存在，都是因为有人希望达成某个目标；解决方案必须在可能的情况下兼顾双方诉求，而在两者确实不可兼得时，选择符合本次合并明确目标的一方，并大声说明权衡理由。

这就是为什么第一手资料至关重要。你无法保留你尚未阅读过的意图，因此解决工作始于历史记录——提交信息、PR、任务卡片——而非仅仅盯着 diff。

## 正常工作的标志

- 每个已解决的冲突块都保留了双方的行为，或者在无法同时保留时明确指出了权衡。
- 没有出现任何两边分支上都不存在的新行为。
- 项目自身的检查命令（类型检查、测试、代码格式化）被自动找到并在提交前运行并全部通过（绿色）。
- 合并或变基（rebase）被推至最终的完成提交，绝不中止撤销。

## 它的位置

这是一个可随时使用的独立技能：你会在合并或变基卡住的时刻调用它，它会还给你一个干净、已提交的代码树。它天然的邻居是 [diagnosing-bugs](https://aihero.dev/skills-diagnosing-bugs)，因为一个能够干净解决但事后表现异常的合并，属于诊断问题而非冲突问题。当你不确定使用哪个技能时，[ask-matt](https://aihero.dev/skills-ask-matt) 会为你导航。
