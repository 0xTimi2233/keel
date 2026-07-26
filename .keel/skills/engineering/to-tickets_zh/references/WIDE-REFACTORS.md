# 宽幅重构 Expand-Contract 三步拆分法

当改动会引发全库编译报错时，禁止强行垂直切，必须拆为 3 张带依赖顺序的 Ticket：

1. **Ticket 1: Expand (扩充)**
   新增新字段/新接口，保留旧字段/旧接口（全库代码零报错，CI PASS）。
2. **Ticket 2: Migrate (迁移)**
   将所有业务调用点迁移至新字段/新接口（基于 Ticket 1 的合并代码，CI PASS）。
3. **Ticket 3: Contract (收缩)**
   物理清理已经无人使用的旧字段/旧接口（CI PASS）。
