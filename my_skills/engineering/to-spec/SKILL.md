---
name: to-spec
description: 把敲定的需求规格化为契约文件与骨架；当用户或其他 skill 需要规格化需求时使用
---

把 grilling 敲定的需求规格化为契约：四类契约文件与 `todo!()` 骨架。契约是仓库内文件，不创建 issue；issue 拆分见 /to-tickets。设计标准见 [design-standards.md](./references/design-standards.md)

## 输入

- 对话共识：grilling 敲定的需求行为、产品意图与部署形态
- `docs/product.md`：产品范围与边界
- 领域模型：`context.md` 术语表 / `context-map.md` 边界 / `docs/adr` 既有约束，见 /domain-modeling

## 流程

1. **核对范围**：读 `docs/product.md`，需求逐条确认在范围内；非目标冲突或超范围时先更新 `docs/product.md` 再继续；缺失时按 [product.template.md](./assets/product.template.md) 产出
2. **确认进程边界**：从共识读部署形态，确认受影响模块同进程或跨进程；共识缺失时与用户确认——进程边界决定契约类型
3. **设计契约**：进程内用 Rust trait，跨进程用 `.proto`，事件用 event JSON，验收用 `.feature`；接口形状按 [design-standards.md](./references/design-standards.md) 判断；每份契约归属唯一模块
4. **定路径与命名**：契约文件路径与命名一并定下，就近落在模块目录
5. **产出**：共识达成后一次性写出契约文件与 `todo!()` 实现骨架，不边问边改

## 完成标准

- 需求行为逐条体现在契约上
- 契约类型与进程边界匹配
- 每份契约归属唯一模块，路径与命名已定
- 非目标未进入任何契约
