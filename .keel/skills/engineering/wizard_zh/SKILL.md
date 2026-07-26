---
name: wizard_zh
description: 交互式 Bash 向导生成器。中文审阅版。
disable-model-invocation: true
---

# 交互式向导生成器

当需要人类配置环境变量、秘钥或依赖工具链时触发。

## 执行流程

1. **确定缺失配置**。
2. **生成单文件 Bash 脚本**：在 `.scratch/wizards/` 写入轻量交互脚本，采用 `read -p` 和防错条件判断。
3. **提示用户执行**：输出单行运行指令，由人类手动运行。
