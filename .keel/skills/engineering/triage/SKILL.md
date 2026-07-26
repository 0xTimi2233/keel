---
name: triage
description: Issue and PR triage state machine. Evaluates, verifies reproduction, checks out-of-scope history, and tags state.
disable-model-invocation: true
---

# Issue & PR Triage State Machine

Triggered via explicit `/triage`. Processes external/reporter submitted Issues/PRs.

## State Machine Roles

- **Category**: `bug` | `enhancement`
- **State**: `needs-triage` | `needs-info` | `ready-for-agent` | `ready-for-human` | `wontfix`

## Directives

1. **Check Duplication & Scope**: Search codebase for existing implementations; compare against rejection history in [OUT-OF-SCOPE.md](references/OUT-OF-SCOPE.md). Mark `wontfix` if duplicate or rejected.
2. **Verify Claims**: Reproduce bug claims; document reproduction path.
3. **Draft Brief & Tag**: Write Agent Brief per [AGENT-BRIEF.md](references/AGENT-BRIEF.md) and tag `ready-for-agent`.
