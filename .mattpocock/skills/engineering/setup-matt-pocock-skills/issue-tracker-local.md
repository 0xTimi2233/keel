# Issue 追踪器：本地 Markdown

此仓库的 issue 和 spec（你可能将 spec 称为 PRD）均作为 markdown 文件存在于 `.scratch/` 中。

## 约定

- 每个功能一个目录：`.scratch/<feature-slug>/`
- spec 为 `.scratch/<feature-slug>/spec.md`
- 实现 issue 为 `.scratch/<feature-slug>/issues/<NN>-<slug>.md`，每张工单一个文件，从 `01` 开始编号 — 切勿使用单个合并的工单文件
- 分类状态作为 `Status:` 行记录在每个 issue 文件的顶部附近（有关角色字符串，请参阅 `triage-labels.md`）
- 评论和对话历史追加在文件底部 `## Comments` 标题下方

## 当 Skill 提出“发布到 issue 追踪器”时

在 `.scratch/<feature-slug>/` 下创建一个新文件（如果需要则创建该目录）。

## 当 Skill 提出“获取相关工单”时

阅读位于引用路径的文件。用户通常会直接传递路径或 issue 编号。

## 寻路（Wayfinding）操作

被 `/wayfinder` 使用。**地图（map）**是一个文件，每张工单有一个**子**文件。

- **地图（Map）**：`.scratch/<effort>/map.md` — “笔记（Notes）/ 迄今为止的决议（Decisions-so-far）/ 迷雾（Fog）”正文。
- **子工单（Child ticket）**：`.scratch/<effort>/issues/NN-<slug>.md`，从 `01` 开始编号，问题写在正文中。一行 `Type:` 记录工单类型（`research`/`prototype`/`grilling`/`task`）；一行 `Status:` 记录 `claimed`/`resolved`。
- **阻塞（Blocking）**：顶部附近有一行 `Blocked by: NN, NN`。当其列出的每个文件均为 `resolved` 时，工单解除阻塞。
- **前沿（Frontier）**：在 `.scratch/<effort>/issues/` 中扫描未关闭、未阻塞且未被申领的文件；按编号最靠前者胜出。
- **申领（Claim）**：在开展任何工作前设置 `Status: claimed` 并保存。
- **解决（Resolve）**：在 `## Answer` 标题下追加答案，设置 `Status: resolved`，然后在 `map.md` 中追加一个上下文指针（摘要 + 链接）到地图的“迄今为止的决议”中。
