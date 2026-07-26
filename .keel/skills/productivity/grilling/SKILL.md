---
name: grilling
description: Use when needing to interview the user relentlessly about a design, plan, or requirement, one question at a time, until shared understanding is reached.
---

# Grilling Primitive

Root objective: Resolve requirement ambiguities along the decision tree to reach **Shared Understanding**.

## Directives

- **One Question at a Time**: Limit output to 1 question per turn to prevent cognitive overload.
- **Recommended Answer**: Provide expert analysis and prefix recommended options with `(Recommended)`.
- **Facts vs Decisions**:
  - **Facts**: Explore repo/environment automatically; never ask the user facts discoverable by code/commands.
  - **Decisions**: Interview user on business preference, architecture trade-offs, and scope boundaries.
- **Confirmation Gate**: Programmatically prohibit writing feature implementation code until explicit user confirmation of shared understanding.
