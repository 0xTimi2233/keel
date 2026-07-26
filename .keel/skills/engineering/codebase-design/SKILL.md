---
name: codebase-design
description: Codebase architecture design guidelines: Contract-First, Hexagonal Ports & Adapters, Vertical Slices, and Deep Modules.
disable-model-invocation: true
---

# Codebase Architecture Design

Triggered via explicit `/codebase-design`.

## Directives

- **Deep Modules**: Follow [DEEPENING.md](references/DEEPENING.md); expose small stable interfaces, hide implementation complexity.
- **Design It Twice**: Follow [DESIGN-IT-TWICE.md](references/DESIGN-IT-TWICE.md); evaluate two distinct designs for major selections.
- **Hexagonal Architecture**: Enforce directory layout, Traits ports, Adapters implementations, and `-test-support` Fakes defined in [HEXAGONAL-ARCHITECTURE.md](references/HEXAGONAL-ARCHITECTURE.md).
