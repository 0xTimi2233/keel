# Issue 追踪器：GitHub

此仓库的 issue 和 PRD 均存在于 GitHub Issues 中。所有操作均使用 `gh` CLI。

## 约定

- **创建 issue**：`gh issue create --title "..." --body "..."`。对于多行正文，使用 heredoc。
- **读取 issue**：`gh issue view <number> --comments`，通过 `jq` 过滤评论并拉取标签。
- **列出 issue**：`gh issue list --state open --json number,title,body,labels,comments --jq '[.[] | {number, title, body, labels: [.labels[].name], comments: [.comments[].body]}]'`，带有适当的 `--label` 与 `--state` 过滤器。
- **在 issue 下发表评论**：`gh issue comment <number> --body "..."`
- **应用 / 移除标签**：`gh issue edit <number> --add-label "..."` / `--remove-label "..."`
- **关闭**：`gh issue close <number> --comment "..."`

从 `git remote -v` 推断仓库 — 当在克隆仓库中运行时，`gh` 会自动执行此操作。

## Pull Requests 作为分类入口

**PRs 作为请求入口：否。** _（如果此仓库将外部 PR 视为功能请求，则设置为 `yes`；`/triage` 会读取该标志。）_

当设置为 `yes` 时，PR 与 issue 走相同的标签和状态流程，使用对应的 `gh pr` 命令：

- **读取 PR**：`gh pr view <number> --comments` 以及使用 `gh pr diff <number>` 获取 diff。
- **列出需要分类的外部 PR**：`gh pr list --state open --json number,title,body,labels,author,authorAssociation,comments`，然后仅保留 `authorAssociation` 为 `CONTRIBUTOR`、`FIRST_TIME_CONTRIBUTOR` 或 `NONE` 的 PR（过滤掉 `OWNER`/`MEMBER`/`COLLABORATOR`）。
- **评论 / 标签 / 关闭**：`gh pr comment`，`gh pr edit --add-label`/`--remove-label`，`gh pr close`。

GitHub 在 issue 和 PR 之间共享同一个编号空间，因此单独的 `#42` 可能是其中任何一种 — 使用 `gh pr view 42` 进行解析，并回退到 `gh issue view 42`。

## 当 Skill 提出“发布到 issue 追踪器”时

创建一个 GitHub issue。

## 当 Skill 提出“获取相关工单”时

运行 `gh issue view <number> --comments`。

## 寻路（Wayfinding）操作

被 `/wayfinder` 使用。**地图（map）**是一个包含**子** issue 工单的单一 issue。

- **地图（Map）**：标记有 `wayfinder:map` 的单个 issue，保存“笔记（Notes）/ 迄今为止的决议（Decisions-so-far）/ 迷雾（Fog）”正文。`gh issue create --label wayfinder:map`。
- **子工单（Child ticket）**：通过 GitHub 子 issue 关联到地图的 issue（在子 issue 端点上使用 `gh api`）。若未启用子 issue，则在地图正文的任务列表中添加子工单，并在子工单正文顶部加上 `Part of #<map>`。标签：`wayfinder:<type>`（`research`/`prototype`/`grilling`/`task`）。一旦被申领，工单将分配给主导的开发者。
- **阻塞（Blocking）**：GitHub 的**原生 issue 依赖项** — 规范且在 UI 上可见的表示形式。通过 `gh api --method POST repos/<owner>/<repo>/issues/<child>/dependencies/blocked_by -F issue_id=<blocker-db-id>` 添加关联，其中 `<blocker-db-id>` 是阻塞方的数字**数据库 id**（`gh api repos/<owner>/<repo>/issues/<n> --jq .id`，*而非* `#number` 或 `node_id`）。GitHub 报告 `issue_dependencies_summary.blocked_by`（仅包含开启状态的阻塞项 — 实时关卡）。若依赖项不可用，则回退到在子工单正文顶部写一行 `Blocked by: #<n>, #<n>`。当所有阻塞项都被关闭时，工单解除阻塞。
- **前沿（Frontier）查询**：列出地图的所有未关格子工单（`gh issue list --state open`，作用域限于地图的子 issue / 任务列表），过滤掉任何带有未关闭阻塞项（`issue_dependencies_summary.blocked_by > 0`，或在 `Blocked by` 行中有未关闭 issue）或已有被分配者的工单；在地图顺序中排名第一的胜出。
- **申领（Claim）**：`gh issue edit <n> --add-assignee @me` — 会话的第一次写入。
- **解决（Resolve）**：`gh issue comment <n> --body "<answer>"`，然后 `gh issue close <n>`，接着追加一个上下文指针（摘要 + 链接）到地图的“迄今为止的决议”中。
