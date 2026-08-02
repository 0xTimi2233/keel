# GitHub

## 约定目录

- issue 模板：.github/ISSUE_TEMPLATE/
- CI：.github/workflows/*.yml
- 依赖更新：.github/dependabot.yml

模板与 workflow 写入后随推送自动应用

## 分支保护

检查是否已保护：`gh api repos/{owner}/{repo}/branches/main/protection`，404 表示未保护

配置：`gh api --method PUT repos/{owner}/{repo}/branches/main/protection --input -`，请求体：

```json
{
  "required_status_checks": {"strict": true, "contexts": []},
  "enforce_admins": true,
  "required_pull_request_reviews": {
    "required_approving_review_count": 1,
    "dismiss_stale_reviews": true
  },
  "restrictions": null
}
```

## 安全设置

| 项 | 命令 | 请求体 |
|---|---|---|
| secret scanning | `gh api --method PATCH repos/{owner}/{repo} --input -` | {"security_and_analysis": {"secret_scanning": {"status": "enabled"}}} |
| push protection | `gh api --method PATCH repos/{owner}/{repo} --input -` | {"security_and_analysis": {"secret_scanning_push_protection": {"status": "enabled"}}} |
| 依赖安全更新 | `gh api --method PUT repos/{owner}/{repo}/automated-security-fixes` | 无 |

secret scanning 与 push protection 状态从 `gh api repos/{owner}/{repo}` 的 `security_and_analysis` 读取；依赖安全更新用 `GET repos/{owner}/{repo}/automated-security-fixes` 检查，200 表示已启用，404 表示未启用

## 权限

分支保护与安全设置需要仓库 Admin 权限，检查 `gh api repos/{owner}/{repo}` 返回的 `.permissions.admin`；非 true 时报告缺少 Admin 权限

## Dependabot

`.github/dependabot.yml` 以 `package-ecosystem: github-actions`、`directory: /`、weekly 维护 workflow 中 pin 的 action SHA；语言确定后补对应生态的 version updates

Gitleaks v3 与 dependency-review-action v5 使用 Node 24，self-hosted runner 需 v2.327.1 或更高
