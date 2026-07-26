---
name: obsidian-vault
description: 使用 wikilink 和索引笔记在 Obsidian vault 中搜索、创建和管理笔记。当用户想要在 Obsidian 中查找、创建或组织笔记时使用。
---

# Obsidian Vault

## Vault 位置

`/mnt/d/Obsidian Vault/AI Research/`

根目录下基本为平铺结构。

## 命名规范

- **索引笔记 (Index notes)**：聚合相关主题（例如 `Ralph Wiggum Index.md`、`Skills Index.md`、`RAG Index.md`）
- 所有笔记名称采用**首字母大写 (Title Case)**
- 不使用文件夹进行组织 — 改为使用链接和索引笔记

## 链接规范

- 使用 Obsidian 的 `[[wikilinks]]` 语法：`[[Note Title]]`
- 笔记在底部链接到依赖项/相关笔记
- 索引笔记本质上就是 `[[wikilinks]]` 的列表

## 工作流

### 搜索笔记

```bash
# 按文件名搜索
find "/mnt/d/Obsidian Vault/AI Research/" -name "*.md" | grep -i "keyword"

# 按内容搜索
grep -rl "keyword" "/mnt/d/Obsidian Vault/AI Research/" --include="*.md"
```

或直接在 vault 路径上使用 Grep/Glob 工具。

### 创建新笔记

1. 文件名使用**首字母大写 (Title Case)**
2. 将内容编写为一个学习单元（遵循 vault 规则）
3. 在底部向相关笔记添加 `[[wikilinks]]`
4. 如果属于编号序列的一部分，使用层级编号方案

### 查找相关笔记

在整个 vault 中搜索 `[[Note Title]]` 以查找反向链接：

```bash
grep -rl "\\[\\[Note Title\\]\\]" "/mnt/d/Obsidian Vault/AI Research/"
```

### 查找索引笔记

```bash
find "/mnt/d/Obsidian Vault/AI Research/" -name "*Index*"
```
