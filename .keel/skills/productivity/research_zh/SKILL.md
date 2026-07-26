---
name: research_zh
description: 后台第一手资料调研原语。中文审阅版。
disable-model-invocation: true
---

# 后台资料调研原语

当需要查明技术细节、官方 API 行为或代码库历史时触发。

## 执行流程

1. **Primary Sources Only**：只阅读官方文档、源码文件与标准 RFC，禁止根据推测给出结论。
2. **Subagent 隔离探查**：派发独立子 Agent 执行，不占用主会话 context。
3. **生成带引用的报告**：
   在 `research/<topic>.md` 写入报告，包含：
   - 研判结论。
   - 源码物理路径与行号 / 官方文档 URL 引用。
