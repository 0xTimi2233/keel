# Triage 标签

skill 用五个标准 triage 角色说话，默认标签字符串与角色同名：

- `needs-triage`：维护者需要评估该 issue
- `needs-info`：等待报告者补充信息
- `ready-for-agent`：已充分定义，可交给无人值守的 agent
- `ready-for-human`：需要人工实现
- `wontfix`：不会处理

跟踪器已用其他名字时（如 `bug:triage` 代替 `needs-triage`），直接修改列表中的标签字符串，让 `triage` 复用现有标签而不是创建重复的。
