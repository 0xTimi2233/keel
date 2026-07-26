---
name: to-release
description: Automated release management. Aggregates merged Parent Issues, calculates SemVer, updates CHANGELOG.md, and creates GitHub Release.
disable-model-invocation: true
---

# Automated Release Management (To Release)

Triggered via explicit `/to-release`.

## Directives

1. **Aggregate Merged Items**: Retrieve merged Parent Issues and commits since previous Git Tag.
2. **Calculate SemVer**:
   - Breaking changes -> Major
   - New features (Specs) -> Minor
   - Bug fixes -> Patch
3. **Generate Changelog**: Update `CHANGELOG.md` per [RELEASE-TEMPLATE.md](assets/RELEASE-TEMPLATE.md).
4. **Publish GitHub Release**: Commit Changelog, tag Git commit, and execute `gh release create <tag>`.
