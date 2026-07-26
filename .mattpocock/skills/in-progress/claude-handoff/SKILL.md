---
name: claude-handoff
description: 将当前对话交接给一个全新的后台代理，该代理将立即接管工作。
argument-hint: "下一个环节将用于什么？"
disable-model-invocation: true
---

编写当前对话的交接摘要 (handoff summary)，以便全新的代理能够继续工作。不要直接保存它，而是启动一个后台代理，并使用该摘要作为其提示词种子：`claude --bg --name "<descriptive name>" "<handoff summary>"`。它将在当前工作目录中启动并立即返回；用户可以使用 `claude agents` 来管理它。

务必使用描述性名称传递 `-n`/`--name`（例如 `--name "Fix login bug"`） — 它设置了在任务列表、会话选择器和终端标题中显示的显示名称。

在摘要中包含一个“推荐 Skill (suggested skills)”章节，用以建议代理应该调用的 Skill。

不要重复在其他产物（PRD、计划、ADR、issue、提交、diff）中已捕获的内容。请通过路径或 URL 引用它们。

脱敏处理任何敏感信息，例如 API key、密码或个人可识别信息 — 摘要将成为代理的提示词。

如果用户传递了参数，将其视为对下一个环节所关注重点的描述，并相应地定制摘要。
