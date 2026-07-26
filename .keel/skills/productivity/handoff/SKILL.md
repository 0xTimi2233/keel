---
name: handoff
description: 压缩当前会话上下文并生成跨 Session 传递文档。当上下文饱和或需分支切换时触发。
disable-model-invocation: true
---

# 上下文交接 (Handoff)

用户手动输入 `/handoff` 触发。

## 执行流程

1. **提取核心 State**：已达成的决策、修改的文件路径（绝对路径）与阻塞点。
2. **生成交接文档**：在 `.scratch/handoffs/` 写入极简 Markdown 文档（无废话）。
3. **引导新 Session**：提示用户开启新 Session 并引用该文件继承上下文。
