---
name: handoff
description: Compacts conversation context and writes cross-session bridge documents when context approaches saturation.
disable-model-invocation: true
---

# Handoff

Triggered via explicit `/handoff`.

## Directives

1. **Extract Core State**: Agreed decisions, modified absolute file paths, and active blockers.
2. **Generate Bridge Doc**: Write minimal Markdown bridge file in `.scratch/handoffs/`.
3. **Prompt New Session**: Prompt user to open a fresh session referencing the bridge file.
