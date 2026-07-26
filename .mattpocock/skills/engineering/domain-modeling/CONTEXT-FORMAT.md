# CONTEXT.md 格式

## 结构

```md
# {上下文名称}

{一两句话说明该上下文是什么以及为什么存在。}

## 语言/术语

**Order（订单）**:
{该术语的一两句话描述}
_避免使用_: Purchase, transaction

**Invoice（发票）**:
发货后发送给客户的付款请求。
_避免使用_: Bill, payment request

**Customer（客户）**:
下订单的个人或组织。
_避免使用_: Client, buyer, account
```

## 规则

- **要有明确见解。** 当同一个概念存在多个词汇时，挑选最好的一个，并将其他词汇列在 `_Avoid_`（避免使用）之下。
- **保持定义精简。** 最多一两句话。定义它*是什么*，而不是它做什么。
- **仅包含特定于本项目上下文的术语。** 通用编程概念（超时、错误类型、工具类模式）即便项目大量使用也不属于此处。在添加术语之前，问问自己：这是本上下文特有的概念，还是通用编程概念？只有前者才属于此处。
- **出现自然聚类时，按子标题分组术语。** 如果所有术语都属于一个单一紧密连贯的领域，使用平铺列表即可。

## 单上下文 vs 多上下文仓库

**单上下文（大多数仓库）：** 仓库根目录下保留一个 `CONTEXT.md`。

**多上下文：** 仓库根目录下的 `CONTEXT-MAP.md` 列出各个上下文、它们所在的位置以及它们之间的关系：

```md
# 上下文地图 (Context Map)

## 上下文列表

- [Ordering](./src/ordering/CONTEXT.md) — 接收并跟踪客户订单
- [Billing](./src/billing/CONTEXT.md) — 生成发票并处理付款
- [Fulfillment](./src/fulfillment/CONTEXT.md) — 管理仓库拣货与发货

## 关联关系

- **Ordering → Fulfillment**: Ordering 触发 `OrderPlaced` 事件；Fulfillment 消费该事件以开始拣货
- **Fulfillment → Billing**: Fulfillment 触发 `ShipmentDispatched` 事件；Billing 消费该事件以生成发票
- **Ordering ↔ Billing**: 共享 `CustomerId` 和 `Money` 的类型
```

本技能会推断适用于哪种结构：

- 如果存在 `CONTEXT-MAP.md`，阅读它以查找上下文
- 如果仅存在根目录 `CONTEXT.md`，则为单上下文
- 如果两者都不存在，在解决第一个术语时延迟创建根目录 `CONTEXT.md`

当存在多个上下文时，推断当前主题与哪一个相关。如果不明确，主动询问。
