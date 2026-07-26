快速开始：

```bash
npx skills add mattpocock/skills --skill=research
```

```bash
npx skills update research
```

[源码](https://github.com/mattpocock/skills/tree/main/skills/engineering/research)

## 它的作用

`research` 通过阅读拥有答案的源头资料来解答问题，并留下一份带有引用的 Markdown 文件。它仅基于**第一手资料**（官方文档、源码、规格说明、第一方 API）工作——绝不依赖二次解读，因此它保存的内容可以追溯到权威依据，而不是对总结的再总结。

## 何时使用它

你可以输入 `/research`，或者当任务转变为需要阅读大量探路资料时，AI 代理会自动调用它。

当下一步是*弄清某些事情*——API 如何表现、规范实际说了什么、某个论断是否成立——且你不想因为进行阅读而打断你当前主线程的思路时，就可以使用它。如果希望通过追问盘问而非阅读来磨砺计划，请使用 [grilling](https://aihero.dev/skills-grilling)；如果想用一次性代码探索要构建的内容，请使用 [prototype](https://aihero.dev/skills-prototype)。

## 委派探路

其核心机制在于阅读过程作为**后台代理**（background agent）运行。你继续开展手头的工作；它去追踪每个论断直到其第一手资料源头，并在仓库保存此类笔记的位置放下一份带有引用的 Markdown 文件。研究是你委派出去的探路工作，而不是外包出去的思考——你收回的是一份可供回应、附带资料来源的文件。

## 它的位置

这是一个可随时使用的独立技能，为思考类技能提供养料：它产出的文件是用于盘问、计划或设计的基础材料，因此它位于像 [grilling](https://aihero.dev/skills-grilling) 和 [to-prd](https://aihero.dev/skills-to-prd) 这样的工作上游，而非构建链内部。有关完整全景图，请参阅 [ask-matt](https://aihero.dev/skills-ask-matt)。
