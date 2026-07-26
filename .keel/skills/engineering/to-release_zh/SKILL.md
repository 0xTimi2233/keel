---
name: to-release_zh
description: 计算 SemVer、更新 CHANGELOG 与发布 GitHub Release。中文审阅版。
disable-model-invocation: true
---

# 版本发布管理 (To Release)

用户手动输入 `/to-release` 触发。

## 执行流程

1. **汇总合并内容**：检索自上一 Tag 以来已合并入 `main` 的 Parent Issues 与提交。
2. **计算 SemVer**：
   - Breaking changes -> Major
   - New features (Specs) -> Minor
   - Bug fixes -> Patch
3. **生成 Changelog**：参考 [RELEASE-TEMPLATE.md](assets/RELEASE-TEMPLATE.md) 格式更新 `CHANGELOG.md`。
4. **GitHub Release**：打上 Git Tag，调用 `gh release create <tag>` 创建官方 Release。
