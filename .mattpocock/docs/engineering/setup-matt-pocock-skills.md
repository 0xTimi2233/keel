快速开始：

```bash
npx skills add mattpocock/skills --skill=setup-matt-pocock-skills
```

```bash
npx skills update setup-matt-pocock-skills
```

[源码](https://github.com/mattpocock/skills/tree/main/skills/engineering/setup-matt-pocock-skills)

## 它的作用

`setup-matt-pocock-skills` 教授一个特定的代码仓库工程类技能应该如何在该仓库中运行——Issue 存在于何处、分流标签（triage labels）叫什么名字、业务领域文档存放在哪里——并将这些答案记录为其他技能可以读取的**配置**（config）。

它编写配置，而不是硬编码行为。工程链假设 `docs/agents/` 目录下存在三个文件；本技能是一次性的引导初始化过程，负责生成这些文件，这些信息是从你的实际仓库（`git remote`、现有标签、现有 `CONTEXT.md`）中自动探测出来的，并与你确认而非瞎猜。它是提示词驱动的（prompt-driven）——先探索、呈现发现、确认，然后写入——而不是确定性的脚手架生成。

## 何时使用它

你可以通过输入 `/setup-matt-pocock-skills` 来调用它——AI 代理不会自行主动触发它。

在**每个仓库使用一次，且在使用任何其他工程技能之前**调用它。如果 [triage](https://aihero.dev/skills-triage)、[to-spec](https://aihero.dev/skills-to-spec) 或 [to-tickets](https://aihero.dev/skills-to-tickets) 开始猜测你的 Issue 存在于何处，或者应用不存在的标签，说明它们尚未在此处完成设置。只有在切换 Issue 跟踪器或重新开始时才需要再次运行它——日常的微调只需直接编辑 `docs/agents/*.md` 文件。

## 三项决策

它会为每项决策提供一个推荐答案，你可以简短回应予以接受，并且会跳过任何它已经能推断出的内容——因此大多数运行只是几次快速的确认：

- **Issue 跟踪器（Issue tracker）** —— 工作在何处被跟踪，以便 `triage`/`to-spec`/`to-tickets` 知道是调用 `gh`、`glab`、在 `.scratch/` 下撰写 markdown，还是遵循你描述的工作流。支持 GitHub、GitLab、本地 markdown 或其他。（它会推荐与你的 `git remote` 相匹配的选项。）
- **分流标签（Triage labels）** —— 仅在安装了 `triage` 技能时询问，然后只需确认：保留默认标签（`needs-triage`、`needs-info`、`ready-for-agent`、`ready-for-human`、`wontfix`）吗？只有当你的跟踪器已经在使用其他名称时才回答否，以便 `triage` 应用真实存在的标签而不是创建重复标签。
- **业务领域文档（Domain docs）** —— 默认假设为单上下文（根目录下包含一个 `CONTEXT.md` + `docs/adr/`），这几乎适合绝大多数仓库；只有在发现 Monorepo 信号时才会提出多上下文映射。

输出是 `docs/agents/` 目录下的集中配置文件——`issue-tracker.md`、`domain.md`，以及在安装了 `triage` 时生成的 `triage-labels.md`——加上在仓库已使用的 `CLAUDE.md` 或 `AGENTS.md` 中指向它们的 `## Agent skills` 区块。这些文件是整个工具集立足的共享基石。

## 正常工作的标志

- `issue-tracker.md` 和 `domain.md` 被生成在 `docs/agents/` 下（如果安装了 `triage` 则还包含 `triage-labels.md`），并且 `CLAUDE.md` 或 `AGENTS.md` 中出现了 `## Agent skills` 章节。
- 它推荐的跟踪器与你真实的 `git remote` 相匹配，且标签与你仓库中已存在的字符串相匹配。
- 此后，`triage` 和 `to-tickets` 会在正确的位置使用正确的标签进行操作，而不是频繁询问或猜测。

## 它的位置

`setup-matt-pocock-skills` 是一个**运行一次的初始化设置技能**——整个工程技能集立足的基石，而不是重复运行的步骤。它的邻居是读取其写入配置的那些技能：[triage](https://aihero.dev/skills-triage)（因为它要应用在此处配置的标签词汇表）以及 [to-spec](https://aihero.dev/skills-to-spec) / [to-tickets](https://aihero.dev/skills-to-tickets)（因为它们会发布到在此处配置的 Issue 跟踪器中）。先运行它；下游的一切都会假设它已经运行过。当你不确定使用哪个技能或流程时，[ask-matt](https://aihero.dev/skills-ask-matt) 会为你导航。
