# 工程技能 (Engineering)

我日常用于代码工作的技能集合。

## 用户主动调用 (User-invoked)

仅当由你显式输入时触发（Claude Code: `disable-model-invocation: true`；Codex: `agents/openai.yaml` 中的 `policy.allow_implicit_invocation: false`）。

- **[ask-matt](ask-matt/SKILL.md)** — 询问哪个技能或流程适合你的当前场景。本仓库中用户主动调用技能的路由导航。
- **[grill-with-docs](grill-with-docs/SKILL.md)** — 追问探究环节，同时构建项目的领域模型、锤炼术语并在线更新 `CONTEXT.md` 和 ADR。
- **[triage](triage/SKILL.md)** — 驱动 issue 穿过分流角色的状态机。
- **[improve-codebase-architecture](improve-codebase-architecture/SKILL.md)** — 扫描代码库中的深化改进机会，以可视化 HTML 报告形式展示，然后对你选择的方案进行追问探究。
- **[setup-matt-pocock-skills](setup-matt-pocock-skills/SKILL.md)** — 为工程技能配置本仓库（Issue 跟踪器、分流标签、领域文档布局）。每个仓库运行一次。
- **[to-spec](to-spec/SKILL.md)** — 将当前对话转化为规范文档 (spec) 并发布到 issue 跟踪器。
- **[to-tickets](to-tickets/SKILL.md)** — 将任何方案、规范或对话拆解为一组示踪弹 (tracer-bullet) 工单，每张工单明确其阻塞关联关系——可以是本地文件中的文本，也可以是真实跟踪器上的原生阻塞链接。
- **[implement](implement/SKILL.md)** — 实现规范或一组工单所描述的工作，在预先约定的接缝处驱动 `/tdd`，并在提交前使用 `/code-review` 收尾。
- **[wayfinder](wayfinder/SKILL.md)** — 规划超出单个代理会话容量的庞大工作量，将其作为 issue 跟踪器上的决策工单共享地图，逐一解决，直到通往目标的路径清晰明了。

## 模型自主调用 (Model-invoked)

模型或用户均可调用（具备丰富的触发词短语，便于模型在需要时自行使用）。

- **[prototype](prototype/SKILL.md)** — 构建抛弃型原型以回答设计疑问：用于状态/逻辑的可运行终端应用，或若干可切换的 UI 变体。

- **[diagnosing-bugs](diagnosing-bugs/SKILL.md)** — 针对疑难 Bug 和性能衰退的严谨诊断循环：重现 → 精简 → 假设 → 埋点/仪表化 → 修复 → 回归测试。
- **[research](research/SKILL.md)** — 针对高信度的权威来源对问题进行深入调研，并将研究成果保存为带引用链接的 Markdown 文件存入仓库，在后台代理中运行。
- **[tdd](tdd/SKILL.md)** — 采用红-绿-重构循环的测试驱动开发。按垂直切片一次构建一个功能或修复一个 Bug。
- **[domain-modeling](domain-modeling/SKILL.md)** — 主动构建并锤炼项目的领域模型——挑战质疑术语、通过场景压测、在线更新 `CONTEXT.md` 和 ADR。
- **[codebase-design](codebase-design/SKILL.md)** — 设计深层模块 (deep modules) 的通用规范与词汇表：小接口、清晰接缝、可通过接口进行测试。
- **[code-review](code-review/SKILL.md)** — 从固定基准点开始对 diff 进行双轴审查：**代码规范 (Standards)**（是否符合仓库的代码规范加上 Fowler 代码坏味道基线？）和 **需求规范 (Spec)**（是否忠实实现了原始 issue/PRD？），作为并行子代理运行。
- **[resolving-merge-conflicts](resolving-merge-conflicts/SKILL.md)** — 逐块 (hunk) 处理正在进行的 git merge 或 rebase 冲突，追溯双方源头意图进行解决，然后完成操作——绝不使用 `--abort`。
