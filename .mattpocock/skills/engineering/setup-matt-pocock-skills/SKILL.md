---
name: setup-matt-pocock-skills
description: 为工程 Skill 配置此仓库 — 设置其 issue 追踪器、分类标签词汇表以及领域文档布局。在使用其他工程 Skill 之前运行一次。
disable-model-invocation: true
---

# 配置 Matt Pocock 的 Skill（Setup Matt Pocock's Skills）

脚手架化工程 Skill 所假设的按仓库配置：

- **Issue 追踪器** — issue 的存放位置（默认 GitHub；开箱即用支持本地 markdown）
- **分类标签** — 用于五个规范分类角色的字符串
- **领域文档** — `CONTEXT.md` 和 ADR 的存放位置，以及读取它们的消费规则

这是一个提示词驱动的 Skill，而非确定性的脚本。去探索、展示你找到的内容、与用户确认，然后进行写入。

## 流程

### 1. 探索

查看当前仓库以了解其起始状态。阅读所有存在的内容；不要作假设：

- `git remote -v` 与 `.git/config` — 这是 GitHub 仓库吗？哪一个？
- 仓库根目录下的 `AGENTS.md` 和 `CLAUDE.md` — 两者是否存在？其中是否已有 `## Agent skills` 章节？
- 仓库根目录下的 `CONTEXT.md` 与 `CONTEXT-MAP.md`
- `docs/adr/` 以及任何 `src/*/docs/adr/` 目录
- `docs/agents/` — 该 Skill 之前的输出是否已存在？
- `.scratch/` — 标志着本地 markdown issue 追踪器约定已在使用中
- `triage` Skill 是否已安装？（与此文件夹并列的 `triage` Skill 文件夹，或者可用 Skill 中的 `triage`。）这决定了 B 章节是否需要运行。
- Monorepo 信号 — `pnpm-workspace.yaml`、`package.json` 中的 `workspaces` 字段，或者带有自身 `src/` 的已填充 `packages/*`。仅在真正的大型多包仓库中呈现；它们的缺失意味着单上下文（single-context），这几乎适用于绝大多数仓库。

### 2. 展示发现并询问

总结存在的内容和缺失的内容。然后按顺序处理各个章节 — 一章、一答，接着进入下一章。

在每个章节开头给出推荐的答案，以便用户可以用一个词接受。仅当选择真正产生分支时给出单行解释；当探索已经确定结论时，直接跳过该章节（当未安装 `triage` 时跳过 B 章节，当没有 Monorepo 时跳过 C 章节）。

**A 章节 — Issue 追踪器。**

> 解释： "Issue 追踪器"是此仓库管理 issue 的地方。诸如 `to-tickets`、`triage`、`to-spec` 以及 `qa` 等 Skill 都会对其进行读写 — 它们需要知道是调用 `gh issue create`，还是在 `.scratch/` 下写入 markdown 文件，或是遵循你描述的其他工作流。请选择你在此仓库中实际追踪工作的地点。

默认姿态：这些 Skill 是专门为 GitHub 设计的。如果 `git remote` 指向 GitHub，请提议 GitHub。如果 `git remote` 指向 GitLab（`gitlab.com` 或自托管的主机），请提议 GitLab。否则（或者如果用户偏好），提供：

- **GitHub** — issue 保存在仓库的 GitHub Issues 中（使用 `gh` CLI）
- **GitLab** — issue 保存在仓库的 GitLab Issues 中（使用 [`glab`](https://gitlab.com/gitlab-org/cli) CLI）
- **本地 Markdown** — issue 作为文件保存在此仓库的 `.scratch/<feature>/` 下（适合单人项目或没有远程仓库的项目）
- **其他**（Jira、Linear 等） — 请用户用一短段话描述工作流；该 Skill 将其记录为自由文本

将选择记录在 `docs/agents/issue-tracker.md` 中。GitHub 和 GitLab 模板携带了一个“将 PR 作为请求入口”的标志，默认**关闭** — 保持关闭且不要专门提及；想要在分类队列中引入外部 PR 的用户可以随后在该文件中自行开启。

**B 章节 — 分类标签词汇表。** 如果未安装 `triage` Skill（探索已告知你），完全跳过此章节 — 未安装的 Skill 不需要标签。

如果已安装，仅询问一个问题：

> 你希望保留默认的分类标签吗？（推荐：**是**）

默认值是五个规范角色，每个标签字符串等于其名称：`needs-triage`、`needs-info`、`ready-for-agent`、`ready-for-human`、`wontfix`。如果回答**是**，按原样写入。仅当用户回答否时 — 通常是因为他们的追踪器已在使用其他名称（例如用 `bug:triage` 代表 `needs-triage`） — 收集覆盖项，以便 `triage` 应用现有标签而不是创建重复标签。

**C 章节 — 领域文档。** 默认为**单上下文（single-context）** — 在仓库根目录下提供单个 `CONTEXT.md` + `docs/adr/`。这适合几乎每个仓库；无需询问直接写入。

仅当探索发现 Monorepo 信号时，才提供**多上下文（multi-context）** — 包含一个指向各上下文 `CONTEXT.md` 文件的根 `CONTEXT-MAP.md`。然后确认他们想要哪种布局。

### 3. 确认与编辑

向用户展示一份草稿：

- 准备添加至被编辑的 `CLAUDE.md` / `AGENTS.md` 的 `## Agent skills` 块（参见步骤 4 的选择规则）
- `docs/agents/issue-tracker.md`、`docs/agents/domain.md` 和 `docs/agents/triage-labels.md` 的内容（最后一个仅在安装了 `triage` 时存在）

在写入之前让他们进行编辑。

### 4. 写入

**选择要编辑的文件：**

- 如果 `CLAUDE.md` 存在，编辑它。
- 否则如果 `AGENTS.md` 存在，编辑它。
- 如果两者都不存在，询问用户创建哪一个 — 不要替他们选择。

当 `CLAUDE.md` 已经存在时，切勿创建 `AGENTS.md`（反之亦然）— 始终编辑已经存在的那一个。

如果选定的文件中已存在 `## Agent skills` 块，请原地更新其内容，而不是追加重复的块。不要覆盖用户对周围章节的修改。

块的内容结构：

```markdown
## Agent skills

### Issue tracker

[关于在何处追踪 issue 的单行总结]。参见 `docs/agents/issue-tracker.md`。

### Triage labels

[关于标签词汇表的单行总结]。参见 `docs/agents/triage-labels.md`。

### Domain docs

[关于布局的单行总结 — "single-context" 或 "multi-context"]。参见 `docs/agents/domain.md`。
```

仅当安装了 `triage` 且运行了 B 章节时，才包含 `### Triage labels` 子块并写入 `docs/agents/triage-labels.md`。如果没有安装，两者都省略。

然后使用此 Skill 文件夹中的种子模板作为起点来写入文档文件：

- [issue-tracker-github.md](issue-tracker-github.md) — GitHub issue 追踪器
- [issue-tracker-gitlab.md](issue-tracker-gitlab.md) — GitLab issue 追踪器
- [issue-tracker-local.md](issue-tracker-local.md) — 本地 markdown issue 追踪器
- [triage-labels.md](triage-labels.md) — 标签映射（仅当安装了 `triage` 时）
- [domain.md](domain.md) — 领域文档消费规则 + 布局

对于“其他” issue 追踪器，根据用户的描述从头开始编写 `docs/agents/issue-tracker.md`。

### 5. 完成

告诉用户配置已完成，以及哪些工程 Skill 现在将从这些文件中进行读取。提及他们以后可以直接编辑 `docs/agents/*.md` — 仅当他们想要切换 issue 追踪器或从头重新开始时，才需要重新运行此 Skill。
