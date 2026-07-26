# Issue 追踪器：GitLab

此仓库的 issue 和 PRD 均存在于 GitLab Issues 中。所有操作均使用 [`glab`](https://gitlab.com/gitlab-org/cli) CLI。

## 约定

- **创建 issue**：`glab issue create --title "..." --description "..."`。对于多行描述，使用 heredoc。传入 `--description -` 以打开编辑器。
- **读取 issue**：`glab issue view <number> --comments`。使用 `-F json` 获取机器可读的输出。
- **列出 issue**：`glab issue list -F json` 带有适当的 `--label` 过滤器。
- **在 issue 下发表评论**：`glab issue note <number> --message "..."`。GitLab 将评论称为 "notes"。
- **应用 / 移除标签**：`glab issue update <number> --label "..."` / `--unlabel "..."`。多个标签可以用逗号分隔或重复该标志。
- **关闭**：`glab issue close <number>`。`glab issue close` 不接受关闭时的评论，因此先使用 `glab issue note <number> --message "..."` 发表说明，然后再进行关闭。
- **Merge requests**：GitLab 将 PR 称为 "merge requests"。使用 `glab mr create`，`glab mr view`，`glab mr note` 等 — 形式与 `gh pr ...` 相同，用 `mr` 代替 `pr`，用 `note`/`--message` 代替 `comment`/`--body`。

从 `git remote -v` 推断仓库 — 当在克隆仓库中运行时，`glab` 会自动执行此操作。

## Merge Requests 作为分类入口

**MRs 作为请求入口：否。** _（如果此仓库将外部 merge request 视为功能请求，则设置为 `yes`；`/triage` 会读取该标志。）_

当设置为 `yes` 时，MR 与 issue 走相同的标签和状态流程，使用对应的 `glab mr` 命令：

- **读取 MR**：`glab mr view <number> --comments` 以及使用 `glab mr diff <number>` 获取 diff。
- **列出需要分类的外部 MR**：`glab mr list -F json`，然后仅保留作者不是项目成员/所有者的 MR（贡献者的 MR，而非维护者进行中的工作）。
- **评论 / 标签 / 关闭**：`glab mr note`，`glab mr update --label`/`--unlabel`，`glab mr close`。

与 GitHub 不同，GitLab 对 issue 和 MR 分别编号，因此一旦你知道维护者指的是哪个入口，`#42` 就是明确无误的。

## 当 Skill 提出“发布到 issue 追踪器”时

创建一个 GitLab issue。

## 当 Skill 提出“获取相关工单”时

运行 `glab issue view <number> --comments`。

## 寻路（Wayfinding）操作

被 `/wayfinder` 使用。**地图（map）**是一个包含**子** issue 工单的单一 issue。

- **地图（Map）**：标记有 `wayfinder:map` 的单个 issue，保存“笔记（Notes）/ 迄今为止的决议（Decisions-so-far）/ 迷雾（Fog）”正文。`glab issue create --label wayfinder:map`。（在拥有原生 epic 的 GitLab 层级中，epic 可以用于承载地图；带标签的 issue 则在所有地方都适用。）
- **子工单（Child ticket）**：在描述顶部写有 `Part of #<map>` 且带有标签 `wayfinder:<type>`（`research`/`prototype`/`grilling`/`task`）的 issue。一旦被申领，工单将分配给主导的开发者。
- **阻塞（Blocking）**：GitLab 的**原生阻塞链接（native blocking link）** — 规范且在 UI 上可见的表示形式。通过作为 note 发送的 `/blocked_by #<n>` 快捷指令（quick action）进行添加（`glab issue note <child> --message "/blocked_by #<blocker>"`）。原生阻塞链接属于 Premium/Ultimate 功能；在免费层级（或无法使用时）回退到在描述顶部写一行 `Blocked by: #<n>, #<n>`。当所有阻塞项都被关闭时，工单解除阻塞。
- **前沿（Frontier）查询**：`glab issue list -F json` 作用域限于地图的子工单，过滤掉任何带有未关闭阻塞项 — 指向未关闭 issue 的原生 `blocked_by` 链接（`glab api projects/:id/issues/:iid/links`），或 `Blocked by` 行中的未关闭 issue — 或已有被分配者的工单；在地图顺序中排名第一的胜出。
- **申领（Claim）**：`glab issue update <n> --assignee @me` — 会话的第一次写入。
- **解决（Resolve）**：`glab issue note <n> --message "<answer>"`，然后 `glab issue close <n>`，接着追加一个上下文指针（摘要 + 链接）到地图的“迄今为止的决议”中。
