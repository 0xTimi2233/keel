---
name: prototype
description: 抛弃型原型探索。在独立分支上编写逻辑或 UI 探针代码，验证技术可行性后抛弃代码，保留结论。
---

# 抛弃型原型探索

在技术方案不明朗、需要验证可行性时触发。

## 执行流程

1. **创建独立原型分支**：切出 `prototype/<topic>` 临时分支。
2. **极速编写探针代码**：
   - 逻辑原型遵从 [LOGIC-PROTOTYPE.md](references/LOGIC-PROTOTYPE.md)。
   - UI 原型遵从 [UI-PROTOTYPE.md](references/UI-PROTOTYPE.md)。
3. **提取结论并切回分支**：
   在 `.scratch/prototypes/` 记录可行性研判与参数，删除/废弃临时代码分支，切回主开发分支。
