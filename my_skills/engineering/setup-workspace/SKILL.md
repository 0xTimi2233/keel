---
name: setup-workspace
description: 配置仓库的基础工程设施；当用户或其他 skill 需要初始化时使用
---

为仓库配置工程工作流依赖的基础设施。脚本根据 `origin` 自动识别 GitHub / GitLab，全部幂等、已就位项跳过；企业域名无法识别时传 `--platform github` 或 `--platform gitlab`。平台差异见 [github.md](./references/github.md) 或 [gitlab.md](./references/gitlab.md)，推荐标签见 [labels.md](./references/labels.md)

## 流程

1. **探测**：在目标仓库根目录运行 `python3 /path/to/setup-workspace/scripts/doctor.py`，逐项检查并输出平台、推荐标签、main 分支保护、issue 模板、CI、安全设置、权限的现状；该脚本只读且恒返回 0
2. **报告**：无缺失项时告知已就位并结束；有缺失时向用户汇总待执行动作
3. **执行**：用户确认后统一执行，按序运行：
   - `python3 /path/to/setup-workspace/scripts/setup-labels.py`：创建缺失的推荐标签；传位置参数可改用指定标签清单
   - `python3 /path/to/setup-workspace/scripts/protect-main.py`：配置 main 分支保护
   - `python3 /path/to/setup-workspace/scripts/setup-templates.py`：写入 issue 模板
   - `python3 /path/to/setup-workspace/scripts/setup-ci.py`：落位 CI 与安全设置
4. **推送**：提交脚本生成的仓库文件并推送

执行型脚本成功返回 0；CLI 缺失、未认证、权限不足或 API 失败时输出一行 `failed` 结果并返回非零。不得把失败当作 `skipped`
