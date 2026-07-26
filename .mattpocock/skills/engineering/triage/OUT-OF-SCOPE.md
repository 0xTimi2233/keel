# 范围外知识库（Out-of-Scope Knowledge Base）

仓库中的 `.out-of-scope/` 目录用于存储被拒绝的功能请求的持久化记录。它服务于两个目的：

1. **机构记忆（Institutional memory）** — 为何拒绝某个功能，以便在 issue 关闭后推导理由不会丢失
2. **去重（Deduplication）** — 当传来匹配先前拒绝的新 issue 时，Skill 可以暴露先前的决议，而不是重新进行争论

## 目录结构

```
.out-of-scope/
├── dark-mode.md
├── plugin-system.md
└── graphql-api.md
```

每个**概念**一个文件，而不是每个 issue 一个文件。请求相同内容的多个 issue 归类在同一个文件下。

## 文件格式

文件应该用轻松、易读的风格撰写 — 更像是一份短小的设计文档而非数据库条目。使用段落、代码示例和实例使推导理由保持清晰，并对初次接触它的读者有用。

```markdown
# 深色模式（Dark Mode）

本项目不支持深色模式或面向用户的主题化。

## 为何这超出范围

渲染管线假设使用定义在 `ThemeConfig` 中的单色调板。
支持多个主题将需要：

- 包裹整个组件树的主题上下文提供者（context provider）
- 按组件的感知主题的样式解析
- 用户主题偏好的持久化层

这是一项重大的架构调整，与本项目专注于内容创作的初初衷不符。
主题化是嵌入或重新分发输出的下游消费者的关注点。

```ts
// 现在的 ThemeConfig 接口并非为运行时切换而设计：
interface ThemeConfig {
  colors: ColorPalette; // 单一调板，在构建时解析
  fonts: FontStack;
}
```

## 先前的请求（Prior requests）

- #42 — "Add dark mode support"
- #87 — "Night theme for accessibility"
- #134 — "Dark theme option"
```

### 给文件命名

为概念使用简短、描述性的 kebab-case 名称：`dark-mode.md`，`plugin-system.md`，`graphql-api.md`。名称应该足够易于识别，以便浏览目录的人无需打开文件即可了解被拒绝的内容。

### 撰写理由

理由应该是实质性的 — 而不是"我们不想做这个"，而是原因。好的理由会引用：

- 项目范围或理念（"本项目专注于 X；主题化是下游关注点"）
- 技术约束（"支持这一点需要 Y，这与我们的 Z 架构相冲突"）
- 战略决策（"我们选择使用 A 而不是 B，因为……"）

理由应该是耐久的。避免引用临时情况（"我们现在太忙了"）— 这些不是真正的拒绝，而是推迟。

## 何时检查 `.out-of-scope/`

在分类期间（步骤 1：收集上下文），阅读 `.out-of-scope/` 中的所有文件。当评估新 issue 时：

- 检查该请求是否匹配现有的范围外概念
- 匹配是通过概念相似度而非关键字 — "night theme" 匹配 `dark-mode.md`
- 如果存在匹配，将其暴露给维护者："这与 `.out-of-scope/dark-mode.md` 相似 — 我们先前拒绝了它，因为 [原因]。你现在依然这么认为吗？"

维护者可能会：

- **确认** — 新 issue 被添加到现有文件的 "Prior requests" 列表，然后关闭
- **重新考虑** — 范围外文件被删除或更新，且 issue 进入正常分类流程
- **不同意** — issue 相关但截然不同，进入正常分类流程

## 何时写入 `.out-of-scope/`

仅当一个 **enhancement**（而非 bug）作为 `wontfix` 被*拒绝*时。这同样适用于 enhancement PR，就像适用于 issue 一样 — 被拒绝的 PR 记录在此处，以便相同的请求不会作为新代码卷土重来。

当某项内容因**已经实现**而被作为 `wontfix` 关闭时，**不要**写入此处。那是一个已构建的功能，而非被拒绝的功能；记录它会用虚假的拒绝毒害去重检查。相反，关闭评论会指明该功能目前所在的位置。

流程：

1. 维护者决定某功能请求超出范围
2. 检查匹配的 `.out-of-scope/` 文件是否已存在
3. 如果存在：将新 issue 追加到 "Prior requests" 列表
4. 如果不存在：使用概念名称、决议、原因和第一个先前请求创建一个新文件
5. 在 issue 上发表评论解释决议并提及 `.out-of-scope/` 文件
6. 使用 `wontfix` 标签关闭 issue

## 更新或删除范围外文件

如果维护者改变了关于先前被拒绝概念的想法：

- 删除 `.out-of-scope/` 文件
- Skill 无需重新开启旧 issue — 它们是历史记录
- 触发重新考虑的新 issue 按照正常分类流程推进
