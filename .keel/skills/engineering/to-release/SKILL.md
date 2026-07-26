---
name: to-release
description: 自动化版本发布管理。汇总已完成的 Parent Issues，计算 SemVer 版本号，更新 CHANGELOG.md 并创建 GitHub Release。
disable-model-invocation: true
---

# 版本发布管理 (To Release)

用户手动输入 `/to-release` 触发。

## 执行流程

1. **汇总合并内容**：
   检索自上一 Tag 以来已合并入 `main` 的所有 Parent Issues 与提交。
2. **计算 SemVer 版本号**：
   - Breaking changes -> Major
   - New features (Specs) -> Minor
   - Bug fixes -> Patch
3. **生成发布内容**：
   参考 [RELEASE-TEMPLATE.md](assets/RELEASE-TEMPLATE.md) 模版格式更新 `CHANGELOG.md`。
4. **触发 GitHub Release**：
   提交 Changelog，打上 Git Tag，调用 `gh release create <tag>` 创建 GitHub 官方 Release。
