---
name: setup-workspace
description: 配置仓库的工程基础设施；当用户需要初始化时使用
---

为仓库配置工程基础设施

## 流程

1. **探测**：在仓库根目录运行 `python3 /path/to/setup-workspace/scripts/doctor.py`，输出平台、推荐标签、分支保护、issue 模板、CI、安全、权限的现状

   脚本从 git 远程地址自动识别平台（GitHub / GitLab），识别不出（如企业自建域名）时传 `--platform github` 或 `--platform gitlab` 指定
2. **报告**：有缺失时向用户汇总待执行动作
3. **执行**：用户确认后按序运行：
   - `python3 /path/to/setup-workspace/scripts/setup-labels.py [标签名...]`：创建缺失的推荐标签，清单见 [labels.md](./references/labels.md)
   - `python3 /path/to/setup-workspace/scripts/protect-main.py`：配置 main 分支保护
   - `python3 /path/to/setup-workspace/scripts/setup-templates.py`：写入 issue 模板
   - `python3 /path/to/setup-workspace/scripts/setup-ci.py`：生成 CI 与安全配置
4. **推送**：提交脚本生成的仓库文件并推送

执行脚本失败时会输出一行 `failed` 并返回非零
