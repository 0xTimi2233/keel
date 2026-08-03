# 默认安全配置

## 安全检查

security.yml 配置 3 个 Action：

- CodeQL：代码漏洞静态扫描，自动适配仓库语言
- Gitleaks：密钥泄露扫描，发现 secret 提交即检查失败
- Dependency Review：审查 PR 依赖变更，私有仓库需付费

## 仓库安全设置

- secret scanning：提交中的密钥自动检测，私有仓库需付费
- push protection：检测到密钥推送直接拦截，私有仓库需付费
- dependency graph：依赖审查与漏洞警报的数据基础，私有仓库需付费
- 依赖安全更新：Dependabot 自动提交漏洞修复 PR，私有仓库需付费
- Dependabot 配置：维护 workflow 中 action 的 SHA

私有仓库：付费功能默认不配置，传 `--paid` 时配置
