---
name: setup-pre-commit
description: 在当前仓库中设置含有 lint-staged (Prettier)、类型检查和测试的 Husky pre-commit hook。当用户想要添加 pre-commit hook、设置 Husky、配置 lint-staged，或添加提交时的格式化/类型检查/测试时使用。
---

# 设置 Pre-Commit Hook (Setup Pre-Commit Hooks)

## 本 Skill 设置的内容

- **Husky** pre-commit hook
- **lint-staged** 在所有暂存文件上运行 Prettier
- **Prettier** 配置（如果缺失）
- 在 pre-commit hook 中运行 **typecheck** 和 **test** 脚本

## 步骤

### 1. 检测包管理器

检查是否存在 `package-lock.json` (npm)、`pnpm-lock.yaml` (pnpm)、`yarn.lock` (yarn)、`bun.lockb` (bun)。使用存在的包管理器。如果不明确则默认使用 npm。

### 2. 安装依赖

安装为 devDependencies：

```
husky lint-staged prettier
```

### 3. 初始化 Husky

```bash
npx husky init
```

这会创建 `.husky/` 目录并将 `prepare: "husky"` 添加到 package.json 中。

### 4. 创建 `.husky/pre-commit`

写入此文件（Husky v9+ 不需要 shebang）：

```
npx lint-staged
npm run typecheck
npm run test
```

**适配**：将 `npm` 替换为检测到的包管理器。如果仓库在 package.json 中没有 `typecheck` 或 `test` 脚本，省略那些行并告知用户。

### 5. 创建 `.lintstagedrc`

```json
{
  "*": "prettier --ignore-unknown --write"
}
```

### 6. 创建 `.prettierrc`（如果缺失）

仅在不存在 Prettier 配置时创建。使用以下默认配置：

```json
{
  "useTabs": false,
  "tabWidth": 2,
  "printWidth": 80,
  "singleQuote": false,
  "trailingComma": "es5",
  "semi": true,
  "arrowParens": "always"
}
```

### 7. 验证

- [ ] `.husky/pre-commit` 存在且可执行
- [ ] `.lintstagedrc` 存在
- [ ] package.json 中的 `prepare` 脚本为 `"husky"`
- [ ] `prettier` 配置存在
- [ ] 运行 `npx lint-staged` 以验证其工作正常

### 8. 提交

暂存所有修改/创建的文件并提交，提交信息为：`Add pre-commit hooks (husky + lint-staged + prettier)`

这将触发新的 pre-commit hook 运行 — 成为验证一切工作正常的好冒烟测试。

## 注意事项

- Husky v9+ 不需要 hook 文件中的 shebang
- `prettier --ignore-unknown` 会跳过 Prettier 无法解析的文件（图片等）
- pre-commit 会首先运行 lint-staged（快速、仅限暂存文件），然后运行完整的类型检查和测试
