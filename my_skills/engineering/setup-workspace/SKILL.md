---
name: setup-workspace
description: 配置仓库的工程基础设施；当用户需要初始化仓库时使用
---

为仓库配置工程基础设施

## 流程

1. **探测**：运行 `./scripts/doctor.py`，会输出平台、推荐标签、分支保护、issue 模板、CI、安全、权限的现状；同时会检查当前分支与远端历史
2. **报告**：向用户汇总缺失项（将配置的内容）与推送方式，询问协作方式；action 配置说明见 [security.md](./references/security.md)
   - 缺失项：doctor 输出的 missing 项
   - 推送方式：已有项目走 PR；远端无 main 时建立 main 推全部历史
   - 协作方式：单人或多人；单人 approval=0（PR 合并无需批准）
3. **执行**：用户确认后按序运行：
   - `./scripts/setup-labels.py [label...]`：创建标签，默认定义见 [labels.json](./references/labels.json)，可传自定义标签名
   - `./scripts/setup-templates.py`：写入 issue 模板
   - `./scripts/setup-ci.py`：生成 CI 与安全配置
4. **推送远端**：提交脚本生成的仓库文件，按报告确认的方式推送
5. **分支保护**：运行 `./scripts/protect-main.py [--approval N]` 配置 main 分支保护，推送后再配置，避免阻塞当前推送
6. **验证**：复跑 `./scripts/doctor.py` 确认全部就位

> 平台识别：脚本从 git 远程地址自动识别（GitHub / GitLab），doctor 输出显示无法识别时，传 `--platform github` 或 `--platform gitlab`
