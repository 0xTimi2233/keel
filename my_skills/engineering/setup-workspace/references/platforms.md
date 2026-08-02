# 平台差异

## 约定目录

| 配置 | GitHub | GitLab |
|---|---|---|
| issue 模板 | .github/ISSUE_TEMPLATE/ | .gitlab/issue_templates/ |
| PR/MR 模板 | .github/pull_request_template.md | .gitlab/merge_request_templates/ |
| CI | .github/workflows/*.yml | .gitlab-ci.yml（仓库根） |
| 依赖更新 | dependabot.yml | Renovate |

模板与 workflow 写入后随推送自动应用，无需额外启用

## 分支保护

GitHub：`PUT /repos/{owner}/{repo}/branches/{branch}/protection`

- required_pull_request_reviews：required_approving_review_count=1、dismiss_stale_reviews=true
- required_status_checks：strict=true、contexts=[]
- enforce_admins：true
- restrictions：null

查询：GET 同一端点，返回 404 表示未保护

GitLab：`POST /projects/{project_id}/protected_branches`，project_id 用 URL 编码的 namespace/project（如 group%2Fproject）

- push_access_level=0（禁止直接 push）
- merge_access_level=40（仅 maintainer 可合并）
- allow_force_push=false

## 安全设置

GitHub（均与语言无关）：

- `PUT /repos/{owner}/{repo}/secret-scanning`，{enabled: true}
- `PUT /repos/{owner}/{repo}/automated-security-fixes`，{enabled: true}

语言确定后补 dependabot.yml 的 version updates（package-ecosystem 按语言选择）

GitLab：.gitlab-ci.yml 引入官方安全模板 Security/SAST 与 Security/Dependency-Scanning
