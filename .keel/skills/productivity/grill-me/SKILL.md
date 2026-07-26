---
name: grill-me
description: User-invoked stateless grilling front door. Interviews user on plans without writing local files.
disable-model-invocation: true
---

# Grill Me (Stateless)

Triggered via explicit `/grill-me`.

Invokes [grilling SKILL.md](../grilling/SKILL.md) to interview user on plans.
Stateless execution: mutates zero local files; keeps agreed state within conversation context.
