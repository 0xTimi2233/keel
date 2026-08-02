---
name: setup-workspace
description: 配置仓库的基础工程设施；当用户或其他 skill 需要初始化时使用
---

为仓库配置工程工作流依赖的基础设施，脚本自动识别平台（GitHub / GitLab），全部幂等、已就位项跳过。平台差异见 [github.md](./references/github.md) 或 [gitlab.md](./references/gitlab.md)，推荐标签见 [labels.md](./references/labels.md)

## 流程

1. **探测**：运行 `python3 scripts/doctor.py`，逐项检查并输出平台、标签、分支保护、模板、CI、安全设置、权限的现状
2. **报告**：无缺失项时告知已就位并结束；有缺失时向用户汇总待执行动作
3. **执行**：用户确认后统一执行，按序运行：
   - `python3 scripts/setup-labels.py <标签清单>`：创建缺失的标签
   - `python3 scripts/protect-main.py`：配置 main 分支保护
   - `python3 scripts/setup-templates.py`：写入 issue 模板
   - `python3 scripts/setup-ci.py`：落位 CI 与安全设置
4. **推送**：提交 .github/ 变更并推送
