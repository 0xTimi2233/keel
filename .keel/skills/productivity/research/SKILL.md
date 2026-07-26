---
name: research
description: Use when the agent needs to research primary sources (specs, code, RFCs, official docs) in depth without polluting the main conversation thread.
---

# Research Primitive

Triggered when investigating technical specifics, official API behavior, or codebase history.

## Directives

1. **Primary Sources Only**: Read official docs, source code, and RFC specs exclusively; prohibit speculative conclusions.
2. **Isolated Subagent Execution**: Dispatch background subagent to execute without main thread context bloat.
3. **Generate Cited Report**:
   Write Markdown report to `research/<topic>.md`, containing:
   - Definite findings & analysis.
   - Exact source file physical paths, line numbers, or official doc URLs.
