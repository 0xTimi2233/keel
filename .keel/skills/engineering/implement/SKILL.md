---
name: implement
description: Use when driven to code and test a single vertical slice (Sub-issue) following TDD cycle with Fakes.
---

# Vertical Slice TDD Implementation

Triggered when an agent picks up a Sub-issue tagged `ready-for-agent`.

## Directives

1. **Read Context**: Read Sub-issue description and corresponding `.feature` BDD file.
2. **Step Definitions (Red)**: Implement test assertions, inject `*-test-support` Fakes adapter, verify test fails (Red).
3. **Feature Code**: Write `command.rs`, `handler.rs`, `validator.rs` in `src/features/<feature>/`.
4. **Verify Green**: Run `cargo test --package <crate>`, verify tests pass 100% (Green).
5. **Submit PR**: Commit and submit PR targeting `feature/issue-<parent_id>` with `auto-merge` enabled.
