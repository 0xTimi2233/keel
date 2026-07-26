---
name: improve-codebase-architecture_zh
description: 代码库提交热点扫描与 HTML 诊断报告生成。中文审阅版。
disable-model-invocation: true
---

# 代码库架构体检与优化

用户手动输入 `/improve-codebase-architecture` 触发。

## 执行流程

1. **扫描 Git Hotspots**：运行 `git log --oneline --name-only` 统计高频修改文件。
2. **分析浅模块**：识别接口庞大且修改频繁的浅模块，评估重构方案。
3. **HTML 报告**：参照 [HTML-REPORT.md](references/HTML-REPORT.md) 格式在 `.scratch/reports/architecture-report.html` 输出报告并在浏览器中打开。
