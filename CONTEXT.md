# Keel

A skill-driven AI development workflow system, deeply integrated with GitHub. Two subsystems: a **skill system** (methodology/workflow) consumed by agents, and a **daemon** (CLI + long-running process) that manages dev agent lifecycles.

## Language

**Skill**:
A declarative workflow instruction file consumed by an AI agent, defining *what* to do and in what order. Split into two layers by consumer.
_Avoid_: Plugin, extension, script

**Orchestration Skill**:
A skill consumed by the Main Agent. Covers scheduling, issue decomposition, dependency ordering, and agent lifecycle decisions. Does not contain implementation details.
_Avoid_: Management skill, coordination skill

**Execution Skill**:
A skill consumed by a Dev Agent inside a sandbox. Covers TDD cycles, code standards, PR submission, and implementation patterns. Does not contain scheduling logic.
_Avoid_: Dev skill, coding skill

**Main Agent**:
The AI agent running in the user's conversation thread. Plays the Architect, QA, and PM roles by switching skills/prompts. Reads orchestration skills, makes scheduling decisions, and reports progress to the human. Not managed by the daemon — it *is* the daemon's caller.
_Avoid_: Parent agent, coordinator

**CLI**:
The command-line interface through which the Main Agent issues commands to the daemon — spawn, query, kill, reuse, search. Not human-facing; humans interact with the Main Agent in conversation.
_Avoid_: Client, frontend

**Daemon**:
The core long-running process that manages Dev Agent task lifecycles: spawning in isolated workspaces, monitoring heartbeat/status, and managing Codex sessions (reuse vs new). A thin wrapper over the Codex App Server, adding task-level abstractions. Has no AI reasoning capability.
_Avoid_: Server, scheduler

**Codex App Server**:
The underlying agent runtime that manages AI agent sessions, model calls, and tool execution. Daemon delegates to it; does not replace it.
_Avoid_: LLM provider, model server

**Task**:
The daemon's core abstraction — the binding of an issue, a git worktree, and a Codex session into a single manageable unit. A task has a lifecycle: spawned → running → completed/failed/killed.
_Avoid_: Job, process

**Dev Agent**:
An AI agent instance spawned by the daemon to work on a single issue in an isolated sandbox (git worktree). Executes autonomously guided by prompt and execution skills, including submitting PRs upon completion. Plays the Developer role.
_Avoid_: Worker, bot

**Reviewer Agent**:
A cloud AI triggered by GitHub Actions on PR events. Executes the dual-axis review (spec axis + standards axis). Not managed by the daemon — lives entirely in CI.
_Avoid_: Review bot

**Gate**:
A human intervention point in the workflow. Four gates exist: requirements clarification, solution selection, plan confirmation (contract freeze), and defect escalation.
_Avoid_: Checkpoint, review point

**Contract**:
A frozen, authoritative declaration (interface, schema, `.feature`, `.proto`) that must exist before implementation begins. Owned by Architect or QA, never by Developer.
_Avoid_: Spec, specification (too vague)

**Slice**:
A minimal end-to-end vertical behaviour that penetrates all layers. The unit of work assigned to a single dev agent.
_Avoid_: Task, ticket, story
