---
name: diagnosing-bugs
description: Use when encountering broken tests, crashes, or unhandled errors to isolate root cause without patching symptoms.
---

# 疑难 Bug 诊断

在遇到测试报错、崩溃或异常行为时触发。

## 诊断准则

- **未截断日志分析**：在提出假说前，必须获取并阅读完整未截断的错误日志与堆栈。
- **Root-Cause Isolation**：追踪数据上游，禁止通过静默 try/catch 或伪造默认值做表面修复。
- **最小复现测试**：先写出精准复现报错的测试 (Red)，修复后验证变绿 (Green)。
