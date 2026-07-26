# AI 友好型架构规范：契约优先 + DDD + 六边形 + 垂直切片

## 物理目录结构 (Rust 2024 Idiom)

```text
crates/
└── <domain>/
    ├── CONTEXT.md
    └── src/
        ├── domain/           <-- 纯业务实体 (零 IO 依赖)
        ├── ports/            <-- 出向端口 (pub trait)
        ├── adapters/         <-- 适配器实现 (impl Trait for Struct)
        └── features/         <-- 垂直切片 (无 mod.rs, 采用 feature.rs + feature/)
            ├── place_hold.rs
            └── place_hold/
                ├── command.rs
                ├── handler.rs
                ├── validator.rs
                ├── response.rs
                └── tests.rs  <-- #[cfg(test)] 白盒测试
```

## 测试替身 (Fakes)
每个领域必须在 `*-test-support` Crate 中提供官方内存 Fake 实现，供子工单快环测试毫秒级运行。
