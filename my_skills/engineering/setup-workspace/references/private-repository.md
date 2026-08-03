# 私有仓库付费安全功能

私有仓库的部分安全功能需要付费计划（GitHub Code Security 或 Advanced Security），setup-ci 默认不配置：

- secret scanning（含 push protection）
- dependency graph（依赖图）
- dependency review（PR 依赖审查）
- 依赖安全更新

如需启用：在 GitHub 设置（Settings → Code security and analysis）中确认仓库计划后手动开启
