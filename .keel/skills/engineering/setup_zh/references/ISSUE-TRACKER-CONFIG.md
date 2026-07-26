# 问题追踪器配置规范

## 1. 必需标签集合

- `bug` — 缺陷或故障
- `enhancement` — 新需求或改进
- `needs-triage` — 待分诊评估
- `needs-info` — 缺少信息，等待提交者补充
- `ready-for-agent` — 规格完备，可供 Agent 独立施工
- `ready-for-human` — 涉及主观决策，需人类介入
- `wontfix` — 拒绝/重复/超出范围

## 2. CI 关联

- 所有带 `ready-for-agent` 标签的 Sub-issue，在其分支合并进集线分支时触发 Fast Loop CI。
