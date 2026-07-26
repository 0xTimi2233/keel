---
name: code-review
description: 双轴代码审查（Standards & Spec）。派发两个并行子 Agent 分别审查代码规范与需求对齐度，输出结构化修补清单。
disable-model-invocation: true
---

# 双轴代码审查 (Code Review)

用户手动输入 `/code-review [fixed-point]` 触发（在 Parent PR 准备合并入 `main` 时）。

## 双轴审查机制

- **Standards 轴**：审查代码规范。阅读并对比 [SMELL-BASELINE.md](references/SMELL-BASELINE.md) 中的 Fowler 代码气味基线。
- **Spec 轴**：对比 Parent Spec Issue 与 `.feature` 文件，审查需求是否有遗漏或 Scope Creep。

## 执行流程

1. 锁定 Diff 边界 (`git diff <fixed-point>...HEAD`)。
2. 并行派发 2 个子 Agent 分别执行 Standards 与 Spec 审查。
3. 汇总生成结构化修补清单。若有缺陷，提示开启全新的干净 Session (Fixer Agent) 集中修复。
