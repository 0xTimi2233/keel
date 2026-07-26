---
name: domain-modeling
description: Maintains domain ubiquitous language in CONTEXT.md and immutable decisions in docs/adr/ during design sessions.
disable-model-invocation: true
---

# Domain Modeling & Documentation

Triggered via explicit `/domain-modeling` or by upstream orchestrators.

## Directives

1. **Ubiquitous Language (CONTEXT.md)**:
   Maintain bounded context domain glossary in `src/domains/<domain>/CONTEXT.md`.
   Format defined in [CONTEXT-FORMAT.md](assets/CONTEXT-FORMAT.md).
2. **Single Source ADR (docs/adr/XXXX-title.md)**:
   Record architectural decisions in single-source ADR files.
   Format defined in [ADR-TEMPLATE.md](assets/ADR-TEMPLATE.md).
