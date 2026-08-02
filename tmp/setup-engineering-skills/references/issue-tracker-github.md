# Issue 跟踪器：GitHub

本仓库的 issue 和规格（你可能称之为 PRD）作为 GitHub issue 存在，所有操作用 `gh` CLI。仓库从 `git remote -v` 推断，`gh` 在克隆内运行时自动识别。

## 当 skill 说"发布到 issue 跟踪器"

创建 GitHub issue。

## 当 skill 说"获取相关 ticket"

运行 `gh issue view <number> --comments`。

## Pull request 作为 triage 表面

**PRs as a request surface: no。** 本仓库把外部 PR 当作功能请求时设为 `yes`，`/triage` 读取此标志。

设为 `yes` 时，PR 与 issue 走同一套标签和状态：

- **列出外部 PR 供 triage**：`gh pr list --state open --json number,title,body,labels,author,authorAssociation,comments`，只保留 `authorAssociation` 为 `CONTRIBUTOR`、`FIRST_TIME_CONTRIBUTOR` 或 `NONE` 的，丢弃 `OWNER`/`MEMBER`/`COLLABORATOR`

GitHub 的 issue 和 PR 共用同一编号空间，裸 `#42` 可能是任一个，用 `gh pr view 42` 解析，失败则回退 `gh issue view 42`

## Wayfinding 操作

供 `/wayfinder` 使用。map 是一个 issue，child issue 作为 ticket。

- **Map**：一个带 `wayfinder:map` 标签的 issue，承载 Notes / Decisions-so-far / Fog 正文
- **Child ticket**：通过 GitHub sub-issue 与 map 关联的 issue（`gh api` 的 sub-issues 端点）。未启用 sub-issues 时，把 child 加进 map 正文的任务列表，并在 child 正文顶部放 `Part of #<map>`。标签：`wayfinder:<type>`（`research`/`prototype`/`grilling`/`task`）
- **阻塞**：GitHub 原生 issue 依赖。用 `gh api --method POST repos/<owner>/<repo>/issues/<child>/dependencies/blocked_by -F issue_id=<blocker-db-id>` 添加边，`<blocker-db-id>` 是阻塞者的数字数据库 id（`gh api repos/<owner>/<repo>/issues/<n> --jq .id`，不是 `#number` 或 `node_id`）。GitHub 经 `issue_dependencies_summary.blocked_by` 报告未关闭的阻塞者。依赖不可用时回退为 child 正文顶部的 `Blocked by: #<n>, #<n>` 行。所有阻塞者关闭后 ticket 才解除阻塞
- **Frontier 查询**：列出 map 的未关闭 children，丢弃有未关闭阻塞者（`issue_dependencies_summary.blocked_by > 0`，或 `Blocked by` 行中有未关闭 issue）或有 assignee 的，map 顺序中第一个获胜
- **认领**：`gh issue edit <n> --add-assignee @me`
- **解决**：`gh issue comment <n> --body "<answer>"`，然后 `gh issue close <n>`，再把上下文指针（gist + 链接）追加到 map 的 Decisions-so-far
