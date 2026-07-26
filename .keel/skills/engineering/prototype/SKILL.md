---
name: prototype
description: Use when exploring technological feasibility via throwaway prototype code on an isolated branch.
---

# Throwaway Prototype Exploration

Triggered when technical feasibility or architectural approach requires validation.

## Directives

1. **Create Isolated Branch**: Checkout `prototype/<topic>` temporary branch.
2. **Write Probe Code**:
   - Logic prototypes follow [LOGIC-PROTOTYPE.md](references/LOGIC-PROTOTYPE.md).
   - UI prototypes follow [UI-PROTOTYPE.md](references/UI-PROTOTYPE.md).
3. **Extract Findings & Clean**: Document parameters in `.scratch/prototypes/`, discard prototype branch, checkout main branch.
