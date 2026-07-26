# 好测试与坏测试

## 好的测试

**集成风格**：通过真实接口进行测试，而不是 Mock 内部零部件。

```typescript
// 良好：测试可观察的行为
test("user can checkout with valid cart", async () => {
  const cart = createCart();
  cart.add(product);
  const result = await checkout(cart, paymentMethod);
  expect(result.status).toBe("confirmed");
});
```

特征：

- 测试用户 / 调用方关心的行为
- 仅使用公共 API
- 在内部重构中幸存
- 描述的是 WHAT（什么），而不是 HOW（如何）
- 每个测试包含一个逻辑断言

## 坏的测试

**实现细节测试**：与内部结构强耦合。

```typescript
// 不佳：测试实现细节
test("checkout calls paymentService.process", async () => {
  const mockPayment = jest.mock(paymentService);
  await checkout(cart, payment);
  expect(mockPayment.process).toHaveBeenCalledWith(cart.total);
});
```

危险信号：

- Mock 内部协同对象
- 测试私有方法
- 对调用次数 / 顺序进行断言
- 当重构但行为没有改变时测试挂掉
- 测试名称描述的是 HOW 而非 WHAT
- 通过外部手段而非接口进行验证

```typescript
// 不佳：绕过接口进行验证
test("createUser saves to database", async () => {
  await createUser({ name: "Alice" });
  const row = await db.query("SELECT * FROM users WHERE name = ?", ["Alice"]);
  expect(row).toBeDefined();
});

// 良好：通过接口进行验证
test("createUser makes user retrievable", async () => {
  const user = await createUser({ name: "Alice" });
  const retrieved = await getUser(user.id);
  expect(retrieved.name).toBe("Alice");
});
```

**同义反复/重言式测试**：预期值重述了实现，因此测试凭构造就能通过。

```typescript
// 不佳：预期值按照代码计算的方式被重新计算
test("calculateTotal sums line items", () => {
  const items = [{ price: 10 }, { price: 5 }];
  const expected = items.reduce((sum, i) => sum + i.price, 0);
  expect(calculateTotal(items)).toBe(expected);
});

// 良好：预期值是独立的已知字面量
test("calculateTotal sums line items", () => {
  expect(calculateTotal([{ price: 10 }, { price: 5 }])).toBe(15);
});
```
