# 何时进行 Mock

仅在**系统边界**处进行 Mock：

- 外部 API（支付、电子邮件等）
- 数据库（有时 — 优先选用测试数据库）
- 时间 / 随机性
- 文件系统（有时）

不要 Mock：

- 你自己的类 / 模块
- 内部协同对象
- 任何你可控的内容

## 为可 Mock 性而设计

在系统边界处，设计易于 Mock 的接口：

**1. 使用依赖注入**

将外部依赖传入，而不是在内部创建它们：

```typescript
// 易于 Mock
function processPayment(order, paymentClient) {
  return paymentClient.charge(order.total);
}

// 难于 Mock
function processPayment(order) {
  const client = new StripeClient(process.env.STRIPE_KEY);
  return client.charge(order.total);
}
```

**2. 相比通用获取器，优先选用 SDK 风格的接口**

为每个外部操作创建具体的函数，而不是使用包含条件逻辑的单个通用函数：

```typescript
// 良好：每个函数都可以独立 Mock
const api = {
  getUser: (id) => fetch(`/users/${id}`),
  getOrders: (userId) => fetch(`/users/${userId}/orders`),
  createOrder: (data) => fetch('/orders', { method: 'POST', body: data }),
};

// 不佳：Mock 需要在 Mock 内部使用条件逻辑
const api = {
  fetch: (endpoint, options) => fetch(endpoint, options),
};
```

SDK 方法意味着：
- 每个 Mock 返回一个特定的数据结构
- 测试设置中没有条件逻辑
- 更容易看出测试行使了哪些端点
- 每个端点具备类型安全性
