---
name: writing-great-skills
description: Use when creating, editing, or refactoring an AI Skill file (SKILL.md). Enforces high-determinism, leading-word assertions, and zero-fluff pruning.
---

# Writing Great Skills

Root virtue: **Predictability**. Constrain agent process convergence across runs, not output exactness.

Defined terms in [GLOSSARY.md](references/GLOSSARY.md).

## Invocation

- **Model-invoked**: Omit `disable-model-invocation`. Description sits in Context Window every turn (pays **Context Load**). Enables autonomous agent discovery and skill-to-skill invocation.
- **User-invoked (`disable-model-invocation: true`)**: Hides description from agent (**zero Context Load**, pays **Cognitive Load**). Triggerable only via explicit human `/command`.
- **Router Skill**: A user-invoked skill indexing other user-invoked skills to reduce Cognitive Load when skills multiply.

## Writing the Description

- **Front-load Leading Word**: Place the skill's primary leading word first.
- **One Trigger per Branch**: Eliminate synonym repetition across a single branch.
- **Cut Body Duplication**: Keep description to trigger boundaries; omit internal step details.

## Information Hierarchy

1. **In-skill Step**: Primary ordered actions in `SKILL.md`. End each step with a checkable & exhaustive **Completion Criterion** to prevent **Premature Completion**.
2. **In-skill Reference**: Secondary flat rules and facts within `SKILL.md`.
3. **External Reference**: Push reference out of `SKILL.md` into linked files via **Context Pointer** (**Progressive Disclosure**, e.g. [GLOSSARY.md](references/GLOSSARY.md)).

## Granularity (When to Split)

- **By Invocation**: Split off a model-invoked skill when it has a distinct leading word or requires independent invocation.
- **By Sequence**: Split steps when post-completion steps pull the agent into Premature Completion.

## Pruning & Leading Words

- **Single Source of Truth**: Keep every rule in one authoritative location.
- **No-op Test**: Test each sentence in isolation. Delete any sentence that fails to alter default agent behavior.
- **Leading Words**: Use pretrained concept tokens (`tight`, `red`, `tracer bullet`) to collapse verbose multi-sentence rules.

## Failure Modes

- **Premature Completion**: Quitting a step before genuine completion. Defense: sharpen binary Completion Criterion or hide post-completion steps via sequence split.
- **Duplication**: Repeated meaning across places. Consolidate to Single Source of Truth.
- **Sediment**: Stale layers accumulated over time. Prune aggressively.
- **Sprawl**: Oversized skill body. Push reference down via Progressive Disclosure.
- **No-op**: Stating default behavior. Delete sentence.
- **Negation**: Prohibitive steering backfires. Use **Positive Assertions** specifying target behavior.
