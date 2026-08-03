# context.md 格式

## 结构

```md
# {上下文名称}

{一两句话说明该上下文是什么、为什么存在}

## 术语

**订单**:
客户下单后产生的交易记录
等价: Order
避免: 采购单, 交易

**发票**:
货物交付后发给客户的付款请求
等价: Invoice
避免: 账单, 付款请求

**客户**:
下订单的个人或组织
等价: Customer
避免: 客户单位, 账户
```

## 规则

- **有主见**：同一概念有多个词时，选定最好的一个，其余列入 `避免`
- **语言分层**：主词与 `避免` 使用项目日常语言，同一概念在代码或文档中的名称列入 `等价` 字段
- **定义紧凑**：最多一两句话，定义它**是什么**，而不是它做什么
- **只收本上下文特有的术语**：通用编程概念（超时、错误类型、工具模式）不属于这里，即使项目大量使用
- **自然成簇时分组**：术语形成自然聚类时用子标题分组；全部属于同一领域时平铺即可

## 单上下文与多上下文

**单上下文（多数仓库）**：根目录一个 `context.md`

**多上下文**：根目录 `context-map.md` 列出各上下文的位置与关系：

```md
# 上下文地图

## 上下文

- [Ordering](./src/ordering/context.md) — 接收并跟踪客户订单
- [Billing](./src/billing/context.md) — 生成发票并处理付款
- [Fulfillment](./src/fulfillment/context.md) — 管理仓库拣货与发货

## 关系

- **Ordering → Fulfillment**: Ordering 发出 `OrderPlaced` 事件；Fulfillment 消费后开始拣货
- **Fulfillment → Billing**: Fulfillment 发出 `ShipmentDispatched` 事件；Billing 消费后生成发票
- **Ordering ↔ Billing**: 共享 `CustomerId` 和 `Money` 类型
```

推断采用哪种结构：

- 存在 `context-map.md` → 读它找上下文
- 只有根 `context.md` → 单上下文
- 都不存在 → 第一个术语敲定时惰性创建根 `context.md`

多上下文时推断当前话题属于哪个上下文，不确定就问
