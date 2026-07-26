---
name: handoff
description: 压缩当前会话上下文并生成跨 Session 传递文档。当上下文接近饱和或需要分支切换时触发。
disable-model-invocation: true
---

# 上下文交接 (Handoff)

用户手动输入 `/handoff` 触发。

## 执行流程

1. **提取核心状态**：
   - 已达成的共识与决策清单。
   - 已完成的步骤与修改的文件。
   - 剩余未完成的任务与阻塞点。
2. **压缩生成交接文档**：
   在 `.scratch/handoffs/` 或指定路径写入精简 Markdown 文件（包含绝对路径、关键变量名）。
3. **引导开启新 Session**：
   提示用户开启新 Session，通过引用该交接文件无缝继承上下文。
