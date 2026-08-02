# Issue 跟踪器：本地 markdown

本仓库的 issue 和规格（你可能称之为 PRD）作为 `.scratch/` 下的 markdown 文件存在。

## 约定

- 每个功能一个目录：`.scratch/<feature-slug>/`
- 规格是 `.scratch/<feature-slug>/spec.md`
- 实现 issue 每个 ticket 一个文件：`.scratch/<feature-slug>/issues/<NN>-<slug>.md`，从 `01` 编号，绝不用单个合并的 tickets 文件
- Triage 状态记录在 issue 文件顶部附近的 `Status:` 行（角色字符串见 `triage-labels.md`）
- 评论和对话历史以 `## Comments` 标题追加到文件底部

## 当 skill 说"发布到 issue 跟踪器"

在 `.scratch/<feature-slug>/` 下创建新文件（需要时创建目录）。

## 当 skill 说"获取相关 ticket"

读取引用路径处的文件。用户通常直接传路径或 issue 编号。

## Wayfinding 操作

供 `/wayfinder` 使用。**map** 是一个文件，**child** 每个 ticket 一个文件。

- **Map**：`.scratch/<effort>/map.md`，承载 Notes / Decisions-so-far / Fog 正文
- **Child ticket**：`.scratch/<effort>/issues/NN-<slug>.md`，从 `01` 编号，问题在正文中。`Type:` 行记录 ticket 类型（`research`/`prototype`/`grilling`/`task`）；`Status:` 行记录 `claimed`/`resolved`
- **阻塞**：顶部附近的 `Blocked by: NN, NN` 行。它列出的每个文件都 `resolved` 后 ticket 才解除阻塞
- **Frontier**：扫描 `.scratch/<effort>/issues/` 找未关闭、未阻塞、未认领的文件，编号最小的获胜
- **认领**：任何工作前设置 `Status: claimed` 并保存
- **解决**：在 `## Answer` 标题下追加答案，设置 `Status: resolved`，再把上下文指针（gist + 链接）追加到 `map.md` 的 Decisions-so-far
