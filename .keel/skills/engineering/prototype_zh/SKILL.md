---
name: prototype_zh
description: 抛弃型原型探索与可行性探针。中文审阅版。
disable-model-invocation: true
---

# 抛弃型原型探索

在技术方案不明朗、需要验证可行性时触发。

## 执行流程

1. **创建独立分支**：切出 `prototype/<topic>` 临时分支。
2. **极速编写探针**：
   - 逻辑原型遵循 [LOGIC-PROTOTYPE.md](references/LOGIC-PROTOTYPE.md)。
   - UI 原型遵循 [UI-PROTOTYPE.md](references/UI-PROTOTYPE.md)。
3. **提取结论并清理**：在 `.scratch/prototypes/` 记录可行性参数，废弃代码分支，切回主分支。
