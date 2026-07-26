---
name: code-review
description: Dual-axis code review (Standards & Spec). Dispatches parallel subagents to audit standards compliance and spec fidelity.
disable-model-invocation: true
---

# Dual-Axis Code Review

Triggered via explicit `/code-review [fixed-point]` (e.g. when Parent PR is ready for `main`).

## Directives

- **Standards Axis**: Audit coding standards against [SMELL-BASELINE.md](references/SMELL-BASELINE.md) Fowler code smells.
- **Spec Axis**: Compare Parent Spec Issue and `.feature` files to audit missing requirements or scope creep.

## Process

1. Pin Diff boundary (`git diff <fixed-point>...HEAD`).
2. Dispatch 2 parallel subagents for Standards and Spec audits.
3. Aggregate findings into structured fix list. Prompt new clean Fixer Agent session if defects exist.
