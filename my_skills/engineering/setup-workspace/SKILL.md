---
name: setup-workspace
description: 配置仓库的工程基础设施；当用户需要初始化时使用
---

为仓库配置工程基础设施

## 流程

1. **探测**：运行 `python3 /path/to/setup-workspace/scripts/doctor.py`，输出平台、推荐标签、分支保护、issue 模板、CI、安全、权限的现状；同时检查当前分支与远端历史。平台识别不出时传 `--platform github` 或 `--platform gitlab` 指定
2. **报告**：向用户汇总缺失项与执行计划，包括推送方式：远端无 main 时直接推送；main 已有保护时走 PR（建分支、开 PR、合并）；需要 force 覆盖时明确告知并等确认
3. **执行**：用户确认后按序运行：
   - `python3 /path/to/setup-workspace/scripts/setup-labels.py [标签名...]`：创建缺失的推荐标签，清单见 [labels.md](./references/labels.md)
   - `python3 /path/to/setup-workspace/scripts/setup-templates.py`：写入 issue 模板
   - `python3 /path/to/setup-workspace/scripts/setup-ci.py`：生成 CI 与安全配置
4. **推送**：提交脚本生成的仓库文件，按报告确认的方式推送（直接推送、走 PR 或 force 覆盖）
5. **保护**：运行 `python3 /path/to/setup-workspace/scripts/protect-main.py` 配置 main 分支保护，推送后再配置，避免挡住推送
6. **验证**：复跑 doctor.py 确认全部就位

执行脚本失败时会输出一行 `failed` 并返回非零
