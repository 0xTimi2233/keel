---
name: improve-codebase-architecture
description: 代码库健康度体检。扫描 Git 提交热点与浅模块，输出包含 Tailwind 与 Mermaid 图表的 HTML 诊断报告。
disable-model-invocation: true
---

# 代码库架构体检与优化

用户手动输入 `/improve-codebase-architecture` 触发。

## 执行流程

1. **扫描 Git 热点（Hotspots）**：
   运行 `git log --oneline --name-only` 统计修改最频繁的文件列表。
2. **分析浅模块与耦合**：
   找出修改频繁且接口庞大的浅模块（Shallow Modules），评估重构为深模块与六边形 Crate 的可行性。
3. **生成 HTML 诊断报告**：
   严格参照 [HTML-REPORT.md](references/HTML-REPORT.md) 中的格式，在 `.scratch/reports/architecture-report.html` 输出美观报告，并在浏览器中自动打开。
