---
name: setup-workspace
description: 配置仓库的基础工程设施：工作流标签、main 分支保护、issue 模板、基础 CI（安全扫描与依赖安全更新）；当其他 skill 发现配置缺失或新仓库首次运行前调用
---

为仓库配置工程工作流依赖的基础设施，经 gh / glab 落位，全部幂等，已就位项跳过。平台由 `git remote` 探测（GitHub / GitLab），差异见 [platforms.md](./references/platforms.md)

## 流程

1. **探测**：查询现有标签、分支保护与 .github/ 内容，识别缺失项
2. **标签**：运行 [setup-labels.sh](./scripts/setup-labels.sh)，创建缺失的工作流标签：
   - needs-triage
   - needs-info
   - ready-for-agent
   - ready-for-human
   - wontfix
3. **分支保护**：运行 [protect-main.sh](./scripts/protect-main.sh)，main 未受保护时配置 PR 审查、CI 通过、禁止直接 push
4. **模板**：运行 [setup-templates.sh](./scripts/setup-templates.sh)，把 assets/issue-templates/ 下模板写入 .github/ISSUE_TEMPLATE/（GitLab 为 .gitlab/issue_templates/）
5. **CI**：运行 [setup-ci.sh](./scripts/setup-ci.sh)，落位安全扫描与依赖分析配置，并开启 secret scanning、依赖安全更新
6. **推送**：提交 .github/ 变更并推送，模板与 workflow 随推送自动应用
7. **校验**：运行 [verify.sh](./scripts/verify.sh)，核对全部项，缺什么补什么

完成标准：verify.sh 无缺失项，向用户汇报就位与跳过的配置
