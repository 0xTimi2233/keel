---
name: wizard
description: Use when needing to generate a human-friendly interactive bash wizard for setting up environment variables or secrets.
---

# Interactive Wizard Generator

Triggered when human environment setup or secret configuration is required.

## Directives

1. **Identify Missing Config**: Isolate required environment variables or tooling dependencies.
2. **Generate Bash Script**: Write single-file interactive script in `.scratch/wizards/` using `read -p` and error-handling conditions.
3. **Prompt Execution**: Output single-line terminal command for human execution.
