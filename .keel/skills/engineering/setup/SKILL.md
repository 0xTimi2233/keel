---
name: setup
description: Scaffolds agent engineering infrastructure: configures issue tracker labels, domain docs layout, and AGENTS.md constitution.
disable-model-invocation: true
---

# Setup Agent Infrastructure

Triggered via explicit `/setup`.

## Directives

1. **Explore Repo Environment**: Inspect language, package manager, and test framework.
2. **Initialize Tracker Labels**:
   Create 7 canonical labels (`bug`, `enhancement`, `needs-triage`, `needs-info`, `ready-for-agent`, `ready-for-human`, `wontfix`).
   Label bounds defined in [ISSUE-TRACKER-CONFIG.md](references/ISSUE-TRACKER-CONFIG.md).
3. **Establish Docs Layout**: Initialize `docs/` and `docs/adr/`.
4. **Patch AGENTS.md**: Write agent behavior constitution incorporating Contract-First, Hexagonal Architecture, Vertical Slicing, and BDD (.feature) standards.
