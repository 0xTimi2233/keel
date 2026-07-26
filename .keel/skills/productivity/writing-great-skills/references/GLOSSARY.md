# Glossary

## Root Virtue

### Predictability
Degree to which a skill makes the agent adopt the same execution process on every run. Root virtue; cost and maintainability are symptoms.
- *Avoid*: consistency, reliability, output-determinism

## Invocation

### Model-Invoked
Keeps `description`. Autonomous agent discovery & nested invocation. Pays Context Load.

### User-Invoked
Sets `disable-model-invocation: true`. Invisible to agent. Zero Context Load, pays Cognitive Load.

### Description
Machine-readable trigger. Permanent Context Pointer for model-invoked skills. Deleting it converts skill to user-invoked.

### Context Pointer
Reference in agent context pointing to out-of-context material. Wording decides loading timing and reliability.

### Context Load
Permanent context window token and attention cost imposed by a model-invoked skill's description.

### Cognitive Load
Memory burden on the human to remember available user-invoked skills.

### Router Skill
User-invoked skill indexing other user-invoked skills to reduce Cognitive Load.

### Granularity
Fine-ness of skill division. Split **By Invocation** for distinct leading words; split **By Sequence** to hide post-completion steps.

## Information Hierarchy

### Information Hierarchy
Content ladder ranked by immediacy of need: Steps > In-skill Reference > External Reference.

### Steps
Ordered actions in `SKILL.md`. Every step binds a checkable Completion Criterion.

### Reference
Material referred to on demand. Primary candidate for Progressive Disclosure.

### External Reference
Static file outside skill system without description. Not invocable on its own.

### Progressive Disclosure
Moving reference out of `SKILL.md` into linked Markdown files to keep top ladder legible.

### Co-location
Grouping related definitions, rules, and caveats under a single heading.

### Sprawl
*Failure mode.* Oversized skill length damaging readability and attention. Fix: push reference down.

## Steering

### Branch
Distinct execution path through a skill.

### Leading Word
Pretrained concept token (`tight`, `red`, `tracer bullet`). Recruits priors to anchor behavior in minimal tokens.

### Completion Criterion
Checkable and exhaustive binary condition marking step completion. Resists Premature Completion.

### Legwork
Unprompted agent work (repo exploration, file reading) within a single step.

### Post-Completion Steps
Steps following current step. Pulls agent forward into Premature Completion.

### Premature Completion
*Failure mode.* Quitting a step before genuine completion due to attention slipping forward.

### Negation
*Failure mode.* Prohibitive steering ("don't think of an elephant") backfiring by activating banned behavior. Fix: Positive Assertions.

## Pruning

### Single Source of Truth
Each rule lives in exactly one authoritative location.

### Duplication
*Failure mode.* Same meaning repeated in multiple places.

### Relevance
Whether a line actively bears on agent execution.

### Sediment
*Failure mode.* Stale rules accumulated over time without pruning.

### No-Op
*Failure mode.* Instruction stating default behavior. Sentence-level test: delete if behavior is unchanged.
