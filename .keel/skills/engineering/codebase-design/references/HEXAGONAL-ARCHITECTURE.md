# Hexagonal Architecture Specification

## Directory Layout (Rust 2021 Idiom)

```text
crates/
└── <domain>/
    ├── CONTEXT.md
    └── src/
        ├── domain/           <-- Domain entities (Zero IO dependencies)
        ├── ports/            <-- Outbound ports (pub trait)
        ├── adapters/         <-- Adapters (impl Trait for Struct)
        └── features/         <-- Vertical Slices (No mod.rs, uses feature.rs + feature/)
            ├── place_hold.rs
            └── place_hold/
                ├── command.rs
                ├── handler.rs
                ├── validator.rs
                ├── response.rs
                └── tests.rs  <-- #[cfg(test)] Whitebox unit tests
```

## Test Doubles (Fakes)
Every domain must provide an official in-memory Fake implementation in `*-test-support` Crate for millisecond fast-loop testing.
