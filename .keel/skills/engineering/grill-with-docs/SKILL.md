---
name: grill-with-docs
description: Stateful grilling session combined with domain-modeling, mutating CONTEXT.md and ADRs iteratively.
disable-model-invocation: true
---

# Stateful Grilling & Document Mutation

Triggered via explicit `/grill-with-docs`.

## Directives

1. **Deep Interview**: Invoke [grilling SKILL.md](../productivity/grilling/SKILL.md) to question plan decisions.
2. **Mutate Documents**:
   - Write resolved vocabulary to `src/domains/<domain>/CONTEXT.md`.
   - Write hard architectural decisions to `docs/adr/XXXX-title.md`.
3. **Prompt Next Skill**: Summarize agreed state upon user confirmation and prompt `/to-spec`.
