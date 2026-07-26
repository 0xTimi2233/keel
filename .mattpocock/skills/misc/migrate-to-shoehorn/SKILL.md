---
name: migrate-to-shoehorn
description: 将测试文件中的 `as` 类型断言迁移到 @total-typescript/shoehorn。当用户提及 shoehorn、想要在测试中替换 `as` 或需要局部测试数据时使用。
---

# 迁移到 Shoehorn (Migrate to Shoehorn)

## 为什么使用 shoehorn？

`shoehorn` 允许你在保持 TypeScript 类型检查的同时在测试中传递局部数据 (partial data)。它使用类型安全的替代方案取代了 `as` 断言。

**仅限测试代码。** 绝不要在生产代码中使用 shoehorn。

在测试中使用 `as` 的问题：

- 缺乏使用规范训练
- 必须手动指定目标类型
- 故意传递错误数据时需要双重 `as`（`as unknown as Type`）

## 安装

```bash
npm i @total-typescript/shoehorn
```

## 迁移模式

### 仅需少量属性的大型对象

迁移前：

```ts
type Request = {
  body: { id: string };
  headers: Record<string, string>;
  cookies: Record<string, string>;
  // ...还有 20 个属性
};

it("gets user by id", () => {
  // 只关心 body.id 但必须伪造整个 Request
  getUser({
    body: { id: "123" },
    headers: {},
    cookies: {},
    // ...伪造所有 20 个属性
  });
});
```

迁移后：

```ts
import { fromPartial } from "@total-typescript/shoehorn";

it("gets user by id", () => {
  getUser(
    fromPartial({
      body: { id: "123" },
    }),
  );
});
```

### `as Type` → `fromPartial()`

迁移前：

```ts
getUser({ body: { id: "123" } } as Request);
```

迁移后：

```ts
import { fromPartial } from "@total-typescript/shoehorn";

getUser(fromPartial({ body: { id: "123" } }));
```

### `as unknown as Type` → `fromAny()`

迁移前：

```ts
getUser({ body: { id: 123 } } as unknown as Request); // 故意使用错误的类型
```

迁移后：

```ts
import { fromAny } from "@total-typescript/shoehorn";

getUser(fromAny({ body: { id: 123 } }));
```

## 适用场景对比

| 函数 (Function) | 使用场景 (Use case) |
| --------------- | -------------------------------------------------- |
| `fromPartial()` | 传递依然能通过类型检查的局部数据 |
| `fromAny()`     | 传递故意错误的数据（保持自动补全） |
| `fromExact()`   | 强制提供完整对象（稍后可替换为 fromPartial） |

## 工作流

1. **收集需求** - 询问用户：
   - 哪些测试文件包含引发问题的 `as` 断言？
   - 它们是在处理只有部分属性重要的庞大对象吗？
   - 他们是否需要为了错误测试而传递故意错误的数据？

2. **安装并迁移**：
   - [ ] 安装：`npm i @total-typescript/shoehorn`
   - [ ] 查找带有 `as` 断言的测试文件：`grep -r " as [A-Z]" --include="*.test.ts" --include="*.spec.ts"`
   - [ ] 将 `as Type` 替换为 `fromPartial()`
   - [ ] 将 `as unknown as Type` 替换为 `fromAny()`
   - [ ] 添加来自 `@total-typescript/shoehorn` 的 import
   - [ ] 运行类型检查进行验证
