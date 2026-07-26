---
name: writing-great-docs
description: Use when creating, writing, or shaping any persisted project documentation to ensure clear grounding, format precision, and single-source truth.
---

# Universal Documentation Standards

Documentation communicates domain invariants as committed disk artifacts. The root virtue is **Predictability & Anti-Context Pollution**.

## 1. Grounding & Hierarchy

- **Ground Before Reaching**: Introduce a concept or term in an earlier section before a later section relies on it.

- **Invariants at the Top**: Keep root documents under 2 screens. State core invariants up front; offload subsystem details to linked files.

## 2. Block Slicing & Format Choices

- **240-Char Block Target**: Keep paragraphs and blocks under 240 characters. Split multi-job prose into concise bullet lists.

- **Prose vs List**: Use prose for narrative arguments; use bullet lists for parallel observations or criteria.

- **Inline vs Callout**: Reserve callouts (`> [!NOTE]`, `> [!IMPORTANT]`) for information that would genuinely derail main text inline.

## 3. Single Source & Clean Overwrites

- **Canonical Locations**: Define each requirement, API contract, or invariant in exactly one physical file.

- **Link, Never Duplicate**: Reference canonical definitions via Markdown links (`[Title](path/file.md)`). Duplicate text creates drift.

- **Clean Overwrites**: Update documentation by overwriting stale rules directly. Omit historical workaround text.
