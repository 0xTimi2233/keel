---
name: setup-engineering-skills
description: 初始化仓库的工程 skill 配置：issue 跟踪器、triage 标签、领域文档布局。其他工程 skill 首次使用前运行一次
disable-model-invocation: true
---

为工程 skill 搭建仓库级配置：

- **Issue 跟踪器**：issue 存放在哪里（默认 GitHub，本地 markdown 也直接支持）
- **Triage 标签**：五个标准 triage 角色使用的标签字符串
- **领域文档**：确认单/多上下文布局（文件结构与维护规则由 `/domain-modeling` 定义）

这是对话驱动的 skill，不是确定性脚本：探查、汇报发现、与用户确认、然后写入。

## 流程

### 1. 探查

查看当前仓库，了解初始状态。读现存的东西，不要假设：

- `git remote -v` 和 `.git/config`：是不是 GitHub 仓库？哪个？
- 仓库根目录的 `AGENTS.md` 和 `CLAUDE.md`：存在吗？里面有没有 `## Agent skills` 小节？
- 仓库根目录的 `CONTEXT.md` 和 `CONTEXT-MAP.md`
- `docs/adr/` 和任何 `src/*/docs/adr/` 目录
- `docs/agents/`：本 skill 之前的产出是否已存在
- `.scratch/`：是否已在使用本地 markdown issue 跟踪器约定
- 是否安装了 `triage` skill（与本 skill 相邻的 `triage` 目录，或可用 skill 中有 `triage`）：决定 B 节是否运行
- Monorepo 信号：`pnpm-workspace.yaml`、`package.json` 的 `workspaces` 字段，或带自己 `src/` 的 `packages/*`。只在真正的大型多包仓库出现；没有就是单上下文，几乎全部仓库都是

### 2. 汇报发现并询问

总结有什么、缺什么。然后按顺序逐节处理，一节一个问题，答完再下一节。

每节先给推荐答案，让用户一个字就能接受。只有选择真正分叉时才给一行解释；探查已确定答案的节直接跳过（B 节在未安装 `triage` 时，C 节在没有 monorepo 信号时）。

**A 节：Issue 跟踪器。**

> 解释：issue 跟踪器是仓库 issue 的存放处。`to-tickets`、`triage`、`to-spec` 等 skill 要读写它，它们需要知道是调用 `gh issue create`、在 `.scratch/` 下写 markdown 文件，还是遵循你描述的其他工作流。选择你实际跟踪工作的位置。

默认姿态：这些 skill 按 GitHub 设计。`git remote` 指向 GitHub 就推荐 GitHub，指向 GitLab 就推荐 GitLab。其他情况（或用户偏好）提供：

- **GitHub**：issue 存在仓库的 GitHub Issues
- **GitLab**：issue 存在 GitLab Issues
- **本地 markdown**：issue 作为 `.scratch/<feature>/` 下的文件，适合单人项目或无 remote 的仓库
- **其他**（Jira、Linear 等）：请用户用一段话描述工作流，skill 以自由文本记录

选择记录在 `docs/agents/issue-tracker.md`。GitHub 和 GitLab 模板带有 "PRs as a request surface" 标志，默认**关**，保持关闭且不要提起；想要外部 PR 进入 triage 队列的用户可自行在文件中打开

**B 节：Triage 标签词汇。** 未安装 `triage` skill 时整节跳过，未安装的 skill 不需要标签。

已安装则只问一个问题：

> 使用默认 triage 标签吗？（推荐：**是**）

默认是五个标准角色，标签字符串与角色同名：`needs-triage`、`needs-info`、`ready-for-agent`、`ready-for-human`、`wontfix`。回答**是**就原样写入。只有用户说否时，通常因为他们的跟踪器已用其他名字（如 `bug:triage` 代替 `needs-triage`），收集覆盖项，让 `triage` 复用现有标签而不是创建重复的

**C 节：领域文档。** 默认**单上下文**：根目录一个 `CONTEXT.md` + `docs/adr/`，适用于绝大多数仓库，不问直接写。

只在探查发现 monorepo 信号时提供**多上下文**：根目录 `CONTEXT-MAP.md` 指向各上下文的 `CONTEXT.md`。然后确认用户要哪种布局

### 3. 确认

给用户展示草稿：

- 要加进 `CLAUDE.md` / `AGENTS.md`（哪个由第 4 步规则决定）的 `## Agent skills` 块
- `docs/agents/issue-tracker.md` 的内容，以及安装了 `triage` 时的 `docs/agents/triage-labels.md`

让用户先改再写

### 4. 写入

**选择要编辑的文件：**

- 存在 `CLAUDE.md` 就编辑它
- 否则存在 `AGENTS.md` 就编辑它
- 都不存在就问用户创建哪个，不要替用户选

如果所选文件中已有 `## Agent skills` 块，原地更新而不是追加副本。不要覆盖用户对周边小节的编辑。

块内容：

```markdown
## Agent skills

### Issue tracker

[issue 存放在哪里的一行摘要]。见 `docs/agents/issue-tracker.md`。

### Triage labels

[标签词汇的一行摘要]。见 `docs/agents/triage-labels.md`。

### Domain docs

[布局的一行摘要："single-context" 或 "multi-context"]。文件结构与维护规则见 `/domain-modeling` skill。
```

只在安装了 `triage` 且 B 节运行时包含 `### Triage labels` 子块并写入 `docs/agents/triage-labels.md`，否则两者都省略。

然后用本 skill 目录下的种子模板为起点写文档文件：

- [issue-tracker-github.md](./references/issue-tracker-github.md)：GitHub issue 跟踪器
- [issue-tracker-gitlab.md](./references/issue-tracker-gitlab.md)：GitLab issue 跟踪器
- [issue-tracker-local.md](./references/issue-tracker-local.md)：本地 markdown issue 跟踪器
- [triage-labels.md](./references/triage-labels.md)：标签映射，只在安装了 `triage` 时

"其他"跟踪器从用户描述白手起家写 `docs/agents/issue-tracker.md`

### 5. 完成

告诉用户设置完成，哪些工程 skill 现在会读这些文件。说明之后可以直接编辑 `docs/agents/*.md`，只有想换跟踪器或从头再来时才需要重跑本 skill
