# 何时 mock

只在**系统边界** mock：

- 外部 API（支付、邮件等）
- 数据库（有时，优先用测试数据库）
- 时间或随机性
- 文件系统（有时）

不要 mock：

- 自己的类或模块
- 内部协作者
- 任何你能控制的东西

## 为可 mock 性设计

在系统边界设计容易 mock 的接口：

**依赖注入**

外部依赖传进来，不要在内部创建：

```typescript
// GOOD: 容易 mock
function processPayment(order, paymentClient) {
  return paymentClient.charge(order.total);
}

// BAD: 难 mock
function processPayment(order) {
  const client = new StripeClient(process.env.STRIPE_KEY);
  return client.charge(order.total);
}
```

**SDK 风格接口，不用通用 fetcher**

每个外部操作用专门函数，不用一个带条件逻辑的通用函数：

```typescript
// GOOD: 每个函数可独立 mock
const api = {
  getUser: (id) => fetch(`/users/${id}`),
  getOrders: (userId) => fetch(`/users/${userId}/orders`),
  createOrder: (data) => fetch('/orders', { method: 'POST', body: data }),
};

// BAD: mock 需要在 mock 内部写条件逻辑
const api = {
  fetch: (endpoint, options) => fetch(endpoint, options),
};
```

SDK 方式的好处：

- 每个 mock 返回一个特定形状
- 测试搭建没有条件逻辑
- 容易看出测试用了哪些端点
- 每个端点有类型安全
