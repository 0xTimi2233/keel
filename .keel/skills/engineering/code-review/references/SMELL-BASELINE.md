# Fowler 代码气味检测基线

1. **Mysterious Name** — 命名无法表明意图。 -> 重命名。
2. **Duplicated Code** — 重复代码结构。 -> 提取共享函数。
3. **Feature Envy** — 方法过度使用其他对象的数据。 -> 移至数据所属对象。
4. **Data Clumps** — 多个总是同时出现的数据项。 -> 封装为独立类型。
5. **Primitive Obsession** — 用基础类型表示领域概念。 -> 提取 Newtype。
6. **Repeated Switches** — 多处重复的 switch/if 分支。 -> 多态或映射表替代。
7. **Shotgun Surgery** — 一处改动引发多处文件散落修改。 -> 聚合同变模块。
8. **Speculative Generality** — 为不存在的需求预留过度设计。 -> 删除冗余抽象。
9. **Message Chains** — 连续导航调用 `a.b().c().d()`。 -> 委托封装隐藏路径。
10. **Middle Man** — 过度委托的中间对象。 -> 直接调用目标。
