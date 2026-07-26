---
name: setup-ts-deep-modules
description: 将 dependency-cruiser 集成到 TypeScript 仓库中，使每个包都成为深层模块 — 具体实现隐藏在子文件夹中，仅通过入口文件可达。用户调用。
disable-model-invocation: true
---

# 设置 TS 深层模块 (Setup TS Deep Modules)

使此仓库中的每个包都成为**深层模块 (deep module)**：在较小的接口背后隐藏大量的行为。一个包的公开表面是它的**入口点 (entry points)** — 即位于包根目录下的文件 — 并且其子文件夹中的所有内容都是隐藏的。本 Skill 安装 [dependency-cruiser](https://github.com/sverweij/dependency-cruiser) 以及使入口点成为唯一进入路径的规则，然后验证这些规则生效。

有关词汇表（深层模块、接口、接缝、深度），运行 `/codebase-design` Skill — 全程使用其语言。

## 本 Skill 强制要求的形态

```
src/packages/
  <name>/
    index.ts        ← 入口点（公开）。从外部导入此文件。
    client.ts       ← 另一个入口点。包可以暴露“多个”入口点。
    lib/            ← 实现：对外隐藏，内部可相互自由导入。
    tests/          ← 同置的测试 + fixture（子文件夹，因此私有）。
```

公开表面是包的**根目录文件** — 而不是单单指定的某个 `index.ts`。按照约定，实现保存在 `lib/`，测试保存在 `tests/`，赋予每个包相同的双文件夹形态。不过规则本身是通用的：*任何*子文件夹中的*任何内容*都是私有的，因此你永远不需要扩展配置来添加文件夹。

四条规则，全部为 `error` 级别：

1. **入口点边界 (Entry-point boundary)** — 包外部的代码（应用代码或其他包）只能导入该包的入口点（其根文件），绝不能导入其子文件夹中的任何内容。
2. **包内自由 (Intra-package freedom)** — 包自身的内部文件可以相互自由导入。
3. **通过入口点测试 (Tests through the entry points)** — `<pkg>/tests/` 下的文件可以导入任何包的入口点及其自身 `tests/` 里的 fixture，但绝不能导入任何包的子文件夹内部实现（甚至不能导入自身的子文件夹实现）。跨包的集成测试是允许的；深层导入是不允许的。
4. **无循环依赖 (No cycles)** — 不允许存在依赖循环。

**入口点，而非桶文件 (barrel)。** 因为公开表面是*所有*根文件，所以包可以暴露多个小入口点（`index.ts`、`client.ts`、`server.ts`），而不是将所有内容汇聚通过一个庞大的 `index.ts`。不鼓励重新导出整个子树的桶文件 (barrel files) — 请保持入口点精简，并将实现隐藏在子文件夹中。

分层 (Layering)（哪些包可以依赖哪些包）属于*另一个*维度的关注点，在本仓库的配置中留作注释占位符，由具体项目填写。

## 步骤

### 1. 检测环境

- **包管理器 (Package manager)** — `pnpm-lock.yaml` → pnpm，`yarn.lock` → yarn，`bun.lockb` → bun，否则为 npm。在下面的每个命令中使用对应的包管理器（`pnpm`/`yarn`/`npm run`/`bunx`）。
- **包根目录 (Packages root)** — 如果 `src/` 存在则使用 `src/packages`，否则使用 `packages`。如果仓库已有其他明显的约定，请与用户确认选择。
- **现有配置 (Existing config)** — 检查是否存在 `.dependency-cruiser.*` 文件。如果存在，**不要**覆盖它：将四条规则和选项合并进去，并告知用户添加了哪些内容。

**完成标准：** 包管理器、包根目录和现有配置状态均已明确。

### 2. 安装 dependency-cruiser

使用检测到的包管理器将 `dependency-cruiser` 安装为 devDependency。

**完成标准：** `dependency-cruiser` 已存在于 `devDependencies` 中。

### 3. 编写配置文件

将 [`dependency-cruiser.config.cjs`](dependency-cruiser.config.cjs) 复制到仓库根目录作为 `.dependency-cruiser.cjs`。将 `PACKAGES_ROOT` 设置为步骤 1 中检测到的根目录。规则基于路径深度且与扩展名无关，因此无需调整其他内容。

**完成标准：** `.dependency-cruiser.cjs` 存在且包含正确的 `PACKAGES_ROOT`，并且存在四条禁止性规则。

### 4. 集成到检查命令中

- 添加 `lint:boundaries` 脚本：`depcruise <packages-root>`（或 `depcruise src`）。
- 将其整合到仓库的汇总检查命令中 — 即已经运行类型检查的那个命令（例如 `check` / `ci` / `validate` 脚本）。**不要**修改 `tsconfig` 或添加路径别名。
- 如果没有汇总脚本，添加 `lint:boundaries` 并告知用户在 CI 中引入它。

**完成标准：** `lint:boundaries` 存在，并与类型检查作为同一命令的一部分运行。

### 5. 搭建示例包模板 (Scaffold)

创建提交一个 `<packages-root>/example/` 作为可复制的模板：

- `index.ts` — 入口点。导出委托给内部文件的函数（以便该包在形式上是明显*深层*的，而不是透传）。
- `lib/impl.ts` — **子文件夹**中的内部文件，被 `index.ts` 导入，从外部不可达。
- `tests/example.test.ts` — **仅**导入 `../index`（入口点），并对公开函数进行断言。

告知用户这是一个可以复制或删除的起始模板。

**完成标准：** 示例包存在，通过根入口点暴露其行为，并将 `impl` 隐藏在子文件夹中。

### 6. 验证规则生效

这是整个 Skill 的完成标准 — 如果在违规时无法报错，那么配置就是无用的。

1. 运行 `lint:boundaries`。它必须在干净的示例上**通过**。
2. 临时在 `tests/example.test.ts` 中添加一个深层导入（例如 `import { thing } from "../lib/impl"`）。再次运行 `lint:boundaries` — 它必须**失败**并报出 `tests-through-entrypoints` 错误。
3. 还原深层导入。再运行一次 — 它必须**通过**。

**完成标准：** 你已观察到一次通过、一次因深层导入引发的失败，以及再次通过。如果步骤 2 没有失败，说明规则配置未正确链接 — 在结束前修复它。

### 7. 文档化约定

在**包文件夹中**写一个 `README.md`（`<packages-root>/README.md`） — 紧邻其管辖的包 — 涵盖：`src/packages/<name>/` 布局（根目录入口点，`lib/` 放实现，`tests/` 放测试），“仅通过包的入口点（其根文件）进行导入”，以及如何运行 `lint:boundaries`。明确**不鼓励使用桶文件 (barrel files)** — 暴露多个小入口点，而不是通过一个 index 重新导出整个子树。保持简洁，包含可复制的代码片段加每条规则一句话解释。

然后在仓库的代理说明文件中添加一个**上下文指针 (context pointer)** — 如果存在 `CLAUDE.md` 则添加到其中，否则添加到 `AGENTS.md`（如果两者都不存在则创建 `AGENTS.md`）。一行就足够了，例如 `包是深层模块 — 在添加或导入之前请参阅 [src/packages/README.md](./src/packages/README.md)。` 这能让代理主动发现边界规则，而不是踩坑违规。

**完成标准：** `<packages-root>/README.md` 存在且明确反对桶文件，且仓库的 `CLAUDE.md`/`AGENTS.md` 链接到了该文件。

## 注意事项

- 配置中的 `$1` 反向引用（dependency-cruiser 的分组匹配）使得包可以访问自己的内部实现，而外部无法访问 — 请勿将其拆解为单独的每个包的规则。
- 公开 vs 私有由**深度 (depth)** 决定：包的根目录文件是入口点；子文件夹中的任何内容都是私有的。常规子文件夹是 `lib/`（实现）和 `tests/`，但规则并没有硬编码它们 — 任何子文件夹都是私有的，因此新文件夹永远不需要更改配置。添加入口点只需添加根目录文件 — 无需桶文件。
- 包是**平铺的 (flat)**：根目录下只有一级直接子目录。包的内部实现可以按需深层嵌套；但一个包不能包含另一个包。
- 使用 `.cjs`（而不是 `.js`），以便配置的 `module.exports` 即使在 `"type": "module"` 的仓库中也能正常工作。
