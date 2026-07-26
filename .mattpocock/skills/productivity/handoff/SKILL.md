---
name: handoff
description: 将当前对话精简压缩为交接文档，以便另一个代理接手。
argument-hint: "下一个环节将用于什么？"
disable-model-invocation: true
---

编写一份总结当前对话的交接文档 (handoff document)，以便新的代理可以继续工作。保存到用户操作系统的临时目录 — 而不是当前工作区。

在文档中包含一个“推荐 Skill (suggested skills)”章节，用以建议代理应该调用的 Skill。

不要重复在其他产物（规范、计划、ADR、issue、提交、diff）中已捕获的内容。请通过路径或 URL 引用它们。

脱敏处理任何敏感信息，例如 API key、密码或个人可识别信息。

如果用户传递了参数，将其视为对下一个环节所关注重点的描述，并相应地定制文档。
