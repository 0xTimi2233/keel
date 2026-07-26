# 编写 Agent Brief（Agent 任务简报）

Agent brief 是一份在 GitHub issue 或 PR 移动到 `ready-for-agent` 状态时发表的结构化评论。它是离线 Agent 据以工作的权威规范。原始正文和讨论属于上下文 — Agent brief 才是契约本身。

Brief 阐明了 **Agent 应该做什么**，这延伸适用于两种入口：对于 issue，那是从无到有构建变更；对于 PR，那是对*现有 diff* 还有哪些待完成工作 — 完成它、补全漏洞、回应评审要点。两种情况下原则相同；下面的 PR 示例展示了区别。

## 原则

### 耐久度胜于精确度

Issue 可能会在 `ready-for-agent` 状态下存放数天或数周。在此期间代码库会发生改变。撰写 Brief 时，使其即使在文件被重命名、移动或重构后依然保持有用。

- **要**描述接口、类型和行为契约
- **要**指明 Agent 应该寻找或修改的具体类型、函数签名或配置结构
- **不要**引用文件路径 — 它们会过时
- **不要**引用行号
- **不要**假设当前的实现结构将保持不变

### 行为性而非过程性

描述系统**应该做什么**，而不是**如何**去实现它。Agent 会重新探索代码库并做出自己的实现决策。

- **良好：** "`SkillConfig` 类型应接受一个类型为 `CronExpression` 的可选 `schedule` 字段"
- **不佳：** "打开 src/types/skill.ts 并在第 42 行添加一个 schedule 字段"
- **良好：** "当用户运行无参数的 `/triage` 时，他们应该看到需要关注的 issue 摘要"
- **不佳：** "在主处理函数中添加一个 switch 语句"

### 完整的验收标准

Agent 需要知道何时算完成。每个 Agent brief 都必须具备具象的、可测试的验收标准。每个标准都应该是可独立验证的。

- **良好：** "运行 `gh issue list --label needs-triage` 会返回已通过初步分类的 issue"
- **不佳：** "分类应该正常工作"

### 明确的范围边界

阐明哪些内容在范围之外。这可以防止 Agent 过度美化（gold-plating）或对相邻功能做出盲目假设。

## 模板

```markdown
## Agent Brief

**Category:** bug / enhancement
**Summary:** 关于需要发生什么的一句话描述

**Current behavior:**
描述当前发生的情况。对于 bug，这是被破坏的行为。
对于 enhancement，这是功能所基于的现状。

**Desired behavior:**
描述 Agent 工作完成后应该发生的情况。
对边界情况和错误条件保持具体明确。

**Key interfaces:**
- `TypeName` — 需要改变什么以及原因
- `functionName()` 返回类型 — 目前返回什么 vs 应该返回什么
- 配置形状 — 需要的任何新配置选项

**Acceptance criteria:**
- [ ] 具体的、可测试的标准 1
- [ ] 具体的、可测试的标准 2
- [ ] 具体的、可测试的标准 3

**Out of scope:**
- 在此 issue 中不应修改或处理的事物
- 可能看起来相关但实际独立的相邻功能
```

## 示例

### 优秀的 Agent Brief 示例（bug）

```markdown
## Agent Brief

**Category:** bug
**Summary:** Skill 描述截断会从单词中间切断，产生损坏的输出

**Current behavior:**
当 skill 描述超过 1024 个字符时，无论单词边界如何，它都会在整 1024 个字符处截断。
这会产生在单词中间断开的描述（例如 "Use when the user wants to confi"）。

**Desired behavior:**
截断应该在 1024 个字符之前的最后一个单词边界处切断，
并追加 "..." 以指示截断。

**Key interfaces:**
- `SkillMetadata` 类型的 `description` 字段 — 无需类型变更，
  但填充它的校验/处理逻辑需要尊重单词边界
- 读取 SKILL.md frontmatter 并提取描述的任何函数

**Acceptance criteria:**
- [ ] 1024 字符以下的描述保持不变
- [ ] 1024 字符以上的描述在 1024 字符前的最后一个单词边界处截断
- [ ] 截断后的描述以 "..." 结尾
- [ ] 包含 "..." 在内的总长度不超过 1024 字符

**Out of scope:**
- 改变 1024 字符限制本身
- 多行描述支持
```

### 优秀的 Agent Brief 示例（enhancement）

```markdown
## Agent Brief

**Category:** enhancement
**Summary:** 添加 `.out-of-scope/` 目录支持，用于追踪被拒绝的功能请求

**Current behavior:**
当一个功能请求被拒绝时，该 issue 将带上 `wontfix` 标签和评论被关闭。
没有对决策或推导理由的持久化记录。
未来类似的请求需要维护者凭记忆回忆或搜索先前的讨论。

**Desired behavior:**
被拒绝的功能请求应记录在 `.out-of-scope/<concept>.md` 文件中，
该文件捕获决策、推导理由以及指向请求该功能的所有 issue 的链接。
在对新 issue 进行分类时，应检查这些文件是否有匹配项。

**Key interfaces:**
- `.out-of-scope/` 中的 Markdown 文件格式 — 每个文件应该有一个
  `# Concept Name` 标题、一行 `**Decision:**`、一行 `**Reason:**`，
  以及一个带 issue 链接的 `**Prior requests:**` 列表
- 分类工作流应该尽早读取所有 `.out-of-scope/*.md` 文件，
  并通过概念相似度将传入的 issue 与它们进行匹配

**Acceptance criteria:**
- [ ] 将功能关闭为 wontfix 会在 `.out-of-scope/` 中创建/更新一个文件
- [ ] 文件包含决策、推导理由以及指向已关闭 issue 的链接
- [ ] 如果匹配的 `.out-of-scope/` 文件已存在，则将新 issue 追加到其 "Prior requests" 列表，而不是创建重复文件
- [ ] 在分类期间，当新 issue 匹配先前的拒绝时，会检查并暴露现有的 `.out-of-scope/` 文件

**Out of scope:**
- 自动化匹配（由人工确认匹配）
- 重新开启先前被拒绝的功能
- Bug 报告（只有被拒绝的 enhancement 才会放入 `.out-of-scope/`）
```

### 优秀的 Agent Brief 示例（PR）

对于 PR，"Current behavior" 描述 diff 的状态，并且 Brief 要求 Agent 完成或修复它，而不是从头开始构建。

```markdown
## Agent Brief

**Category:** enhancement
**Summary:** 完成贡献者为 `triage list` 提供的 `--json` 输出标志

**Current behavior:**
PR 添加了一个 `--json` 标志，将 issue 列表序列化为 JSON。主路径正常工作，
且 diff 契合项目的命令结构。仍存在两个缺口：错误依然打印为人类可读文本（而非 JSON），
且新标志缺乏测试覆盖。

**Desired behavior:**
带有 `--json` 时，所有输出（包括错误）都是 stdout 上的合法 JSON，
且命令的退出码保持不变。当标志不存在时，现有的人类可读输出不受影响。

**Key interfaces:**
- 在 `--json` 下，命令的错误路径应输出 `{ "error": string }` 而非纯文本错误
- 复用 PR 已经添加的现有序列化器；不要引入第二个

**Acceptance criteria:**
- [ ] `triage list --json` 对于成功和错误情况均输出合法的 JSON
- [ ] 退出码与非 JSON 命令匹配
- [ ] 有测试覆盖 `--json` 成功输出以及一种错误情况
- [ ] 默认（非 JSON）输出逐字节保持不变

**Out of scope:**
- 为任何其他命令添加 `--json`
- 改变 PR 已经定义的成功载荷的 JSON 形状
```

### 糟糕的 Agent Brief 示例

```markdown
## Agent Brief

**Summary:** 修复 triage bug

**What to do:**
triage 那块东西坏了。看一下主文件并修复它。
150 行左右的函数有问题。

**Files to change:**
- src/triage/handler.ts (line 150)
- src/types.ts (line 42)
```

这很糟糕，因为：
- 没有分类 Category
- 描述模糊（"triage 那块东西坏了"）
- 引用了会过时的文件路径和行号
- 没有验收标准
- 没有范围边界
- 没有关于当前行为与期望行为的描述
