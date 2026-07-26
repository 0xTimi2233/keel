---
name: batch-grill-me
description: Round-by-round batch grilling entrance. Calculates topological frontier decisions and prompts in batches.
disable-model-invocation: true
---

# Batch Grill Me

Triggered via explicit `/batch-grill-me`.

## Directives

1. **Build Decision Tree**: Map all plan decision nodes and dependencies.
2. **Calculate Frontier**: Isolate current unblocked decision nodes whose prerequisites are satisfied.
3. **Round-by-Round Interview**:
   - List current round frontier questions; prefix options with `(Recommended)`.
   - Await user batch responses.
4. **Iterative Progression**: Update decision tree, recalculate next frontier, repeat until cleared.
5. **Confirmation Gate**: Conclude upon explicit user confirmation.
