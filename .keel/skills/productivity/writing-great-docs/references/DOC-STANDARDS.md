# 系统文档结构与写作标准

## 1. 架构概览文档标准 (docs/architecture.md)

- **Defining Constraints**: 声明最高测试接缝 (Seams)、状态管理规则、模块深浅标准。
- **Key Decisions**: 数据库、中间件、RPC 协议等关键技术选型（链接到对应 ADR）。
- **Sub-Systems Index**: 通过 Markdown 链接链接到具体的子系统文档。

## 2. 设计系统文档标准 (docs/design-system.md)

- **Core Aesthetic**: 设计语言、网格系统、字体层次。
- **Tokens**: 色彩、间距、圆角与阴影变量名。
- **Component Seams**: 组件物理存放路径与解耦约束。

## 3. 维护纪律

- **更新即清理**: 修改架构时同步修改单源事实文档，彻底清除已作废的旧规则。
- **禁止废弃残留**: 杜绝在文档中保留过期的“临时替代方案”。
