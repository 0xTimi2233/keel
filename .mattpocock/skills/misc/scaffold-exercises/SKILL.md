---
name: scaffold-exercises
description: 创建包含章节、题目、解法和概念讲解的练习目录结构，并能通过 lint 校验。当用户想要脚手架练习、创建练习桩代码或设置新的课程章节时使用。
---

# 练习脚手架 (Scaffold Exercises)

创建能通过 `pnpm ai-hero-cli internal lint` 校验的练习目录结构，然后使用 `git commit` 进行提交。

## 目录命名规范

- **章节 (Sections)**：在 `exercises/` 内部命名为 `XX-section-name/`（例如 `01-retrieval-skill-building`）
- **练习 (Exercises)**：在章节内部命名为 `XX.YY-exercise-name/`（例如 `01.03-retrieval-with-bm25`）
- 章节编号 = `XX`，练习编号 = `XX.YY`
- 名称采用短横线命名法 (dash-case，小写字母加连字符)

## 练习变体

每个练习至少需要包含以下子文件夹之一：

- `problem/` - 包含 TODO 的学生工作区
- `solution/` - 参考实现
- `explainer/` - 概念性材料，无 TODO

当创建桩代码时，默认使用 `explainer/`，除非计划中另有规定。

## 必需文件

每个子文件夹（`problem/`、`solution/`、`explainer/`）都需要一个满足以下条件的 `readme.md`：

- **非空**（必须有真实内容，即使单行标题也可以）
- 没有损坏的链接

当创建桩代码时，创建一个包含标题和描述的最小 readme：

```md
# 练习标题

此处为描述
```

如果子文件夹包含代码，还需要一个 `main.ts`（>1 行）。但对于桩代码而言，仅有 readme 的练习也是可以的。

## 工作流

1. **解析计划** - 提取章节名称、练习名称和变体类型
2. **创建目录** - 对每个路径使用 `mkdir -p`
3. **创建桩 readme** - 在每个变体文件夹中创建一个带有标题的 `readme.md`
4. **运行 lint** - 运行 `pnpm ai-hero-cli internal lint` 进行验证
5. **修复错误** - 反复迭代直到 lint 通过

## Lint 规则摘要

Linter (`pnpm ai-hero-cli internal lint`) 检查以下内容：

- 每个练习都包含子文件夹（`problem/`、`solution/`、`explainer/`）
- 至少存在 `problem/`、`explainer/` 或 `explainer.1/` 之一
- 主子文件夹中存在且非空的 `readme.md`
- 不存在 `.gitkeep` 文件
- 不存在 `speaker-notes.md` 文件
- readme 中没有损坏的链接
- readme 中没有 `pnpm run exercise` 命令
- 每个子文件夹中需要 `main.ts`，除非它是纯 readme 文件夹

## 移动/重命名练习

当重新编号或移动练习时：

1. 使用 `git mv`（而不是 `mv`）重命名目录 — 这样可以保留 git 历史
2. 更新数字前缀以保持顺序
3. 在移动后重新运行 lint

示例：

```bash
git mv exercises/01-retrieval/01.03-embeddings exercises/01-retrieval/01.04-embeddings
```

## 示例：根据计划搭建桩代码

假设计划如下：

```
Section 05: Memory Skill Building
- 05.01 Introduction to Memory
- 05.02 Short-term Memory (explainer + problem + solution)
- 05.03 Long-term Memory
```

创建结构：

```bash
mkdir -p exercises/05-memory-skill-building/05.01-introduction-to-memory/explainer
mkdir -p exercises/05-memory-skill-building/05.02-short-term-memory/{explainer,problem,solution}
mkdir -p exercises/05-memory-skill-building/05.03-long-term-memory/explainer
```

然后创建 readme 桩文件：

```
exercises/05-memory-skill-building/05.01-introduction-to-memory/explainer/readme.md -> "# Introduction to Memory"
exercises/05-memory-skill-building/05.02-short-term-memory/explainer/readme.md -> "# Short-term Memory"
exercises/05-memory-skill-building/05.02-short-term-memory/problem/readme.md -> "# Short-term Memory"
exercises/05-memory-skill-building/05.02-short-term-memory/solution/readme.md -> "# Short-term Memory"
exercises/05-memory-skill-building/05.03-long-term-memory/explainer/readme.md -> "# Long-term Memory"
```
