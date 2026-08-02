# 场景 DSL

场景使用 UTF-8 YAML，用户输入、期望片段和文件内容可以全部使用中文。加载器采用严格
校验：未知字段、拼错的评分键、不安全沙箱和非法 thread 转换会在调用模型前失败。

## 完整示例

```yaml
schemaVersion: 1
id: example-file-handoff
description: 中文描述
fixture: empty
targetSkills:
  - producer-skill
  - consumer-skill
runtime:
  sandboxMode: workspace-write
  timeoutMs: 180000
stages:
  - id: producer
    thread: new
    turns:
      - user: |
          请逐条询问我，并在术语敲定后写入 CONTEXT.md。
        expect:
          response:
            questionCount: 1
            endsWithQuestion: true
          skills:
            used: [producer-skill]
          files:
            allowChanges: [CONTEXT.md]
  - id: consumer
    thread: new
    turns:
      - user: |
          请读取 CONTEXT.md 并解释术语。
        expect:
          response:
            containsAll: [核心术语]
          skills:
            used: [consumer-skill]
          files:
            unchanged: true
expect:
  files:
    requiredChanges: [CONTEXT.md]
    required:
      - path: CONTEXT.md
        containsAll: [核心术语]
```

## 顶层字段

| 字段 | 含义 |
| --- | --- |
| `schemaVersion` | 当前只能是 `1` |
| `id` | 稳定、唯一的场景 ID |
| `description` | 人类可读描述 |
| `fixture` | `fixtures/workspaces/` 下的前置工作区目录 |
| `targetSkills` | 控制组中要移除的目标 SKILL 名称 |
| `runtime.sandboxMode` | `read-only` 或 `workspace-write` |
| `runtime.timeoutMs` | 每一轮的超时毫秒数 |
| `stages` | 一个或多个对话阶段 |
| `expect` | 整个场景完成后的断言 |

也支持简写 `turns`，它会被转换为一个 `thread: new` 的 `main` stage。

## thread 语义

- `new`：创建新的 Codex thread。
- `continue`：沿用上一个 stage 的 thread。
- 同一个 stage 内的所有 turn 始终复用同一 thread。
- 所有 stage 始终复用同一临时工作区。
- 第一个 stage 不能使用 `continue`。

验证对话记忆时使用同一 thread。验证文件是否足以作为跨 SKILL 接口时使用新 thread：
它会消除聊天记忆，只保留真实文件状态。

## 断言

`expect` 可出现在 turn、stage 或场景顶层。turn 检查该轮；stage 检查该阶段累计状态；
顶层检查完整场景。

| 分组 | 字段 | 语义 |
| --- | --- | --- |
| `response` | `containsAll` | 必须包含每个字符串 |
| `response` | `containsAny` | 至少包含一个字符串 |
| `response` | `excludes` | 不得包含指定字符串 |
| `response` | `matches` | 必须满足每个 Unicode 正则 |
| `response` | `endsWithQuestion` | 是否以中文或英文问号结束 |
| `response` | `questionCount` | 精确数字，或 `{min, max}` |
| `response` | `minLength` / `maxLength` | 字符长度边界 |
| `skills` | `used` / `notUsed` | 是否观察到读取相应 `SKILL.md` |
| `files` | `unchanged` | 当前范围内文件是否完全不变 |
| `files` | `allowChanges` | 允许变化的路径白名单 |
| `files` | `requiredChanges` | 至少一个匹配路径必须变化 |
| `files` | `forbidChanges` | 匹配路径不得变化 |
| `files` | `exists` / `absent` | 快照中路径必须存在/不存在 |
| `files` | `required` | 检查指定最终文件的文本内容 |
| `commands` | `maxCount` | 命令执行数量上限 |
| `commands` | `required` / `forbid` | 要求/禁止出现的命令正则 |

路径支持 `*`、`**` 和 `?`，统一按 `/` 匹配。例如 `docs/*.md` 不会跨目录，
`docs/**` 会匹配任意深度。

`files.required` 的每一项必须有 `path`，并可带 `containsAll`、`containsAny`、
`excludes` 或 `matches`。

## 评分原则

优先使用行为和副作用，而非脆弱的完整文本匹配：

1. 对“一次只问一个”检查 `questionCount` 和结尾问号；
2. 对“不能执行计划”检查文件差异和危险命令，而不是要求某句固定措辞；
3. 对文件型 SKILL 检查允许路径、必需路径和关键内容；
4. 只用 `containsAll` 固定领域术语、协议字段等不可替代内容；
5. 语义质量无法确定性表达时，先保留人工验收；不要悄悄把 LLM judge 当成真值。

SKILL 使用痕迹来自 Codex 命令/MCP trace 中对
`.agents/skills/<name>/SKILL.md` 的读取。它适合检测遗漏和错误路由，但不是业务质量分数。

## Fixture 与快照

每次运行会：

1. 在系统临时根目录创建 `<scenario>-<variant>-<随机后缀>`；
2. 复制 fixture；
3. 把相应 variant 的全部 SKILL 安装到 `.agents/skills/`；
4. 初始化 Git 并记录初始文件快照；
5. 每轮后记录响应、trace、用量和文件 diff；
6. 成功后删除工作区；运行器异常时保留，行为断言失败则依靠报告内快照诊断。

`.agents`、`.git`、`node_modules`、缓存和 Python bytecode 不参与业务文件 diff。
设置 `SKILL_EVAL_KEEP_WORKSPACES=1` 可保留成功工作区。

工作区默认不放在源代码仓库内，以免 Codex 向上发现主项目的 `AGENTS.md` 并污染 case。
需要固定位置时可设置 `SKILL_EVAL_WORKSPACES_ROOT`，但应指向被测仓库之外。
