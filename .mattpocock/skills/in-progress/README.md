# 开发中 (In Progress)

尚在开发中的 Skill。它们尚未准备好发布 — 可能会有瑕疵、破坏性变更和被放弃的实验。在升级到稳定分类之前，它们不包含在插件和顶层 README 中。

- **[loop-me](loop-me/SKILL.md)** — 以当前目录作为有状态的工作区，通过多轮环节将需求盘问成可实施的工作流规范。用户调用。
- **[wizard](wizard/SKILL.md)** — 生成一个交互式 bash 导引助手 (wizard)，引导人类完成手动流程（初始化设置、一次性迁移、状态流转）— 打开 URL、提取数值、写入 `.env` 和 GitHub Actions secrets。用户调用。
- **[writing-beats](writing-beats/SKILL.md)** — 以“选择你自己的冒险”风格，将文章塑造为节拍 (beats) 的旅程。选择一个起始节拍，只编写该节拍，然后转向下一个，直到文章达到自然的终点。
- **[writing-fragments](writing-fragments/SKILL.md)** — 挖掘你的写作碎片（异构的写作素材片段）的盘问环节，并将它们追加到单个文档中，作为未来文章的原始素材。
- **[writing-shape](writing-shape/SKILL.md)** — 提取原始素材的 Markdown 文件，逐段将其塑造为文章，并在每一步论证格式选择。
- **[claude-handoff](claude-handoff/SKILL.md)** — 将当前对话交接给一个全新的后台代理，该代理通过 `claude --bg` 携带交接摘要种子立即接管工作。用户调用。
- **[setup-ts-deep-modules](setup-ts-deep-modules/SKILL.md)** — 将 dependency-cruiser 集成到 TypeScript 仓库中，使每个包都成为深层模块 (deep module) — 具体实现隐藏在子文件夹中，仅通过入口文件可达，并通过入口文件进行测试。用户调用。
- **[to-questionnaire](to-questionnaire/SKILL.md)** — 将你无法完全回答的决策转化为 Markdown 调查问卷，供他人异步填写或在会议中共同填写。它盘问的是发送上下文（发给谁、需要收回什么），而不是主题本身。用户调用。
- **[batch-grill-me](batch-grill-me/SKILL.md)** — 紧凑的追问访谈，按轮次而非一次一个问题来遍历设计树 — 每一轮询问已知前提已决定的整个决策前沿 (frontier)，然后根据你的回答重新计算。用户调用。
