---
name: to-spec
description: Synthesizes conversation into a Parent Spec (PRD), generates BDD .feature tests, and publishes Parent Issue to GitHub.
disable-model-invocation: true
---

# Feature Specification (To Spec)

Triggered via explicit `/to-spec [Feature Name]`.

## Directives

1. **Explore Codebase**: Inspect existing domains, ports, and adapters to locate technical seams.
2. **Synthesize Spec**: Formulate spec in memory following [SPEC-TEMPLATE.md](assets/SPEC-TEMPLATE.md).
3. **Generate BDD Test Suite**: Write Given-When-Then acceptance text to `tests/features/<feature>.feature`.
4. **Publish Parent Spec Issue**: Execute `gh issue create --title "Spec: <Name>" --body "..."` to publish Parent Issue and capture Issue ID.
