# GitLab

## 约定目录

- issue 模板：.gitlab/issue_templates/
- MR 模板：.gitlab/merge_request_templates/
- CI：.gitlab-ci.yml（仓库根）
- 依赖更新：Renovate

模板与 workflow 写入后随推送自动应用

## 分支保护

检查是否已保护：`glab api projects/{project_id}/protected_branches`，列表含 name=main 即已保护

配置：`glab api --method POST projects/{project_id}/protected_branches --field name=main --field push_access_level=0 --field merge_access_level=40 --field allow_force_push=false`

- push_access_level=0：禁止直接 push
- merge_access_level=40：仅 maintainer 可合并

project_id 用 URL 编码的 namespace/project（如 group%2Fproject）

## 安全 CI

`.gitlab-ci.yml` 引入官方模板：

```yaml
include:
  - template: Jobs/SAST.gitlab-ci.yml
  - template: Jobs/Dependency-Scanning.v2.gitlab-ci.yml
```

## 权限

受保护分支与安全设置需要 Maintainer 或 owner 权限
