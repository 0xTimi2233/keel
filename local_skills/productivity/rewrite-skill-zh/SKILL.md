---
name: rewrite-skill-zh
description: 将英文 skill 重写为中文 skill
disable-model-invocation: true
---

遵循 `/writing-great-skills` 的通用规则

## 流程

1. **理解**：通读原 skill 及其附属文件，找出核心动作、执行顺序、完成条件和锚点词
2. **重写**：按目标平台改写调用方式、目录结构和工具说明，以行为为单位重写，重新组织中文句式、结构和示例
3. **检查**：对照原 Skill，确认完整保留核心动作、顺序和完成条件

## 工具

- [token_analyze.py](./scripts/token_analyze.py)：分析对比词句的 token 分词开销