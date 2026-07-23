# Separate skill directories for orchestration and execution

Orchestration skills (consumed by Main Agent / Antigravity) live in `.agents/skills/`. Execution skills (consumed by Dev Agent and Reviewer Agent / Codex) live in a separate directory outside `.agents/`.

Mixing them in one directory would cause execution skills to pollute Antigravity's context window (even with `disable-model-invocation`, they appear in the skill listing). The two skill layers target different agent runtimes with different invocation mechanisms — physical separation makes this explicit and costs nothing.
