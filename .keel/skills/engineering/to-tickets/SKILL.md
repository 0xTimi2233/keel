---
name: to-tickets
description: Breaks Parent Spec or conversation into tracer-bullet vertical slice Sub-issues and publishes to GitHub.
disable-model-invocation: true
---

# Vertical Slice Slicing (To Tickets)

Triggered via explicit `/to-tickets [#PARENT_ID]`.

## Directives

- **Tracer Bullet**: Each slice must cut end-to-end through Schema -> API -> Logic -> Test. Adhere to atomic completeness in [VERTICAL-SLICE-RULES.md](references/VERTICAL-SLICE-RULES.md).
- **Wide Refactors**: Sequence breaking refactors using Expand-Contract 3-step method in [WIDE-REFACTORS.md](references/WIDE-REFACTORS.md).
- **Zero Blockers**: Leverage pre-locked Trait contracts and Fakes to keep slices unblocked for parallel execution.
- **Publish Sub-issues**: Draft tickets per [ISSUE-TEMPLATE.md](assets/ISSUE-TEMPLATE.md); upon user approval, execute `gh issue create` to link natively as Parent Sub-issues with `ready-for-agent` label.
