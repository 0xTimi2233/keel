# Issue 跟踪器：GitLab

本仓库的 issue 和规格（你可能称之为 PRD）作为 GitLab issue 存在，所有操作用 [`glab`](https://gitlab.com/gitlab-org/cli) CLI。仓库从 `git remote -v` 推断，`glab` 在克隆内运行时自动识别。

## 当 skill 说"发布到 issue 跟踪器"

创建 GitLab issue。

## 当 skill 说"获取相关 ticket"

运行 `glab issue view <number> --comments`。

## Merge request 作为 triage 表面

**MRs as a request surface: no。** 本仓库把外部 merge request 当作功能请求时设为 `yes`，`/triage` 读取此标志。

设为 `yes` 时，MR 与 issue 走同一套标签和状态：

- **列出外部 MR 供 triage**：`glab mr list -F json`，只保留作者不是项目成员或所有者的

与 GitHub 不同，GitLab 的 issue 和 MR 分开编号，知道维护者指哪个表面后 `#42` 没有歧义

## Wayfinding 操作

供 `/wayfinder` 使用。map 是一个 issue，child issue 作为 ticket。

- **Map**：一个带 `wayfinder:map` 标签的 issue，承载 Notes / Decisions-so-far / Fog 正文。支持原生 epics 的版本可用 epic 承载 map，带标签的 issue 在任何地方都可用
- **Child ticket**：描述顶部带 `Part of #<map>`、标签为 `wayfinder:<type>`（`research`/`prototype`/`grilling`/`task`）的 issue
- **阻塞**：GitLab 原生阻塞链接。用 `/blocked_by #<n>` 快捷动作添加，作为 note 发出（`glab issue note <child> --message "/blocked_by #<blocker>"`）。原生阻塞链接是 Premium/Ultimate 功能，免费版或不可用时回退为描述顶部的 `Blocked by: #<n>, #<n>` 行。所有阻塞者关闭后 ticket 才解除阻塞
- **Frontier 查询**：`glab issue list -F json` 限定在 map 的 children，丢弃有未关闭阻塞者（`glab api projects/:id/issues/:iid/links` 中原生 `blocked_by` 链接指向未关闭 issue，或 `Blocked by` 行中有未关闭 issue）或有 assignee 的，map 顺序中第一个获胜
- **认领**：`glab issue update <n> --assignee @me`
- **解决**：`glab issue note <n> --message "<answer>"`，然后 `glab issue close <n>`，再把上下文指针（gist + 链接）追加到 map 的 Decisions-so-far
