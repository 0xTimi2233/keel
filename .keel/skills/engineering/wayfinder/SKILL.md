---
name: wayfinder
description: Fog-of-war epic project mapping. Builds map issue and child decision nodes to resolve topological frontiers.
disable-model-invocation: true
---

# Fog-of-War Epic Mapping (Wayfinder)

Triggered via explicit `/wayfinder [Vision Description]`.

## Directives

1. **Create Epic Map**: Interview user vision; create Parent Epic Issue `[wayfinder:map]` on GitHub. Maintain map body per [MAP-TEMPLATE.md](assets/MAP-TEMPLATE.md).
2. **Register Nodes**: Batch register child decision Issues with type tags (`research`, `prototype`, `grilling`, `task`).
3. **Frontier Resolution**: Isolate topological frontier nodes and prompt user to invoke corresponding skill.
