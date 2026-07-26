# HTML 报告格式

架构审查在 OS 临时目录中渲染为单个自包含的 HTML 文件。Tailwind 和 Mermaid 均由 CDN 提供。Mermaid 能够稳定可靠地处理图表 (graph) 形式的视图；由 HTML div 与内联 SVG 手工打造的视图则用于处理更具编辑特性的视觉效果（块体图、截面图）。结合使用两者 — 不要所有东西都依赖 Mermaid，否则看起来会非常同质通用。

## 页面骨架 (Scaffold)

```html
<!doctype html>
<html lang="zh-CN">
  <head>
    <meta charset="utf-8" />
    <title>架构审查报告 — {{仓库名称}}</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script type="module">
      import mermaid from "https://cdn.jsdelivr.net/npm/mermaid@11/dist/mermaid.esm.min.mjs";
      mermaid.initialize({ startOnLoad: true, theme: "neutral", securityLevel: "loose" });
    </script>
    <style>
      /* 针对 Tailwind 未能精细覆盖的内容使用小型自定义样式层：
         虚线接缝线、具备手绘感的箭头等 */
      .seam { stroke-dasharray: 4 4; }
      .leak { stroke: #dc2626; }
      .deep { background: linear-gradient(135deg, #0f172a, #1e293b); }
    </style>
  </head>
  <body class="bg-stone-50 text-slate-900 font-sans">
    <main class="max-w-5xl mx-auto px-6 py-12 space-y-12">
      <header>...</header>
      <section id="candidates" class="space-y-10">...</section>
      <section id="top-recommendation">...</section>
    </main>
  </body>
</html>
```

## 页眉 (Header)

仓库名称、日期，以及简练的图例说明：实线框 = 模块，虚线 = 接缝，红色箭头 = 泄漏，深色厚边框 = 深层模块。无需前言导语段落 — 直接进入候选对象。

## 候选方案卡片 (Candidate card)

图表承载主要信息。文字表述精炼简洁，直接自然地使用词汇表术语（来自 `/codebase-design` 技能）。

每个候选方案为一个 `<article>`：

- **标题 (Title)** — 简短，命名该深化事项（例如：“折叠订单接收流水线”）。
- **徽章行 (Badge row)** — 推荐强度（`Strong` 强力推荐 = 翡翠绿，`Worth exploring` 值得探索 = 琥珀黄，`Speculative` 推测性 = 石板灰），加上依赖分类标签（`in-process` 进程内，`local-substitutable` 本地可替代，`ports & adapters` 端口与适配器，`mock` Mock 替代）。
- **文件列表 (Files)** — 等宽字体列表，`font-mono text-sm`。
- **重构前/后对比图 (Before / After diagram)** — 核心展示。两列并排。参见下文模式。
- **痛点 (Problem)** — 一句话。痛在哪里。
- **解决方案 (Solution)** — 一句话。改变了什么。
- **收益 (Wins)** — 要点列表，每条 ≤ 6 个词/字。例如：“测试仅需打在一个接口”、“计价逻辑停止泄漏”、“删除 4 个浅层包装层”。
- **ADR 强调框 (ADR callout)**（如适用）— 琥珀色背景框中的一行文字。

不要使用成段的文字解释。如果图表需要一段文字才能看懂，请重新绘制图表。

## 图表模式 (Diagram patterns)

选择契合候选方案的模式。混合使用。不要让每张图看起来都一模一样 — 丰富多样也是其价值所在。

### Mermaid 图 (依赖关系 / 调用流的主要工具)

当核心焦点在于“X 调用 Y 调用 Z，看看有多乱”时，使用 Mermaid 的 `flowchart` 或 `graph`。将其包裹在 Tailwind 风格的卡片中，使其看起来自然融合。使用 classDef 样式将泄漏边标红、将深层模块置深色。时序图 (Sequence diagram) 非常适合展现“重构前：6 次往返；重构后：1 次。”

```html
<div class="rounded-lg border border-slate-200 bg-white p-4">
  <pre class="mermaid">
    flowchart LR
      A[OrderHandler] --> B[OrderValidator]
      B --> C[OrderRepo]
      C -.leak.-> D[PricingClient]
      classDef leak stroke:#dc2626,stroke-width:2px;
      class C,D leak
  </pre>
</div>
```

### 手工构建框线图 (当 Mermaid 的布局难以符合预期时)

将模块实现为带有边框和标签的 `<div>`。将箭头实现为相对容器上绝对定位的内联 SVG `<line>` 或 `<path>` 元素。当你希望“重构后”图表看起来像一个带粗边框、内部带有灰色隐化细节的深层模块时使用 — Mermaid 无法渲染出这种恰当的量感重量。

### 截面图 (适合展示分层浅薄)

堆叠水平色带 (`h-12 border-l-4`) 来展示调用穿过的层级。重构前：6 个无所事事的薄层。重构后：1 个标记有合并后职责的厚实色带。

### 块体图 (适合展示“接口与实现一样宽”)

每个模块对应两个矩形 — 一个代表接口表面积，一个代表实现。重构前：接口矩形几乎与实现矩形一样高（浅层）。重构后：接口矩形很矮，实现矩形很高（深层）。

### 调用图折叠

重构前：渲染为嵌套方框的函数调用树。重构后：同一棵树被折叠为一个方框，原有的内部调用在方框内部淡化显示。

## 样式指南 (Style guidance)

- 偏向社论/刊物风格，而非企业仪表盘风格。保留充裕的留白。标题可选用衬线体（`font-serif` 与 stone/slate 背景搭配效果极佳）。
- 克制使用色彩：一种强调色（翡翠绿或靛蓝）加上用于泄漏的红色和用于警告的琥珀黄。
- 将图表高度保持在 ~320px 左右，以便重构前/后能在无需滚动的情况下舒适地并排展示。
- 图表内部的模块标签使用 `text-xs uppercase tracking-wider` — 使其看起来像示意图，而不是 UI。
- 仅有的脚本是 Tailwind CDN 和 Mermaid ESM 导入。报告在其他方面保持纯静态 — 没有应用代码，除了 Mermaid 自身的渲染外没有任何交互。

## 顶级推荐章节 (Top recommendation section)

一个较大的卡片。包含候选方案名称、一句话解释原因、指向其对应卡片的锚点链接。就这么简单。

## 语气与措辞 (Tone)

通俗平实、简洁凝练 — 但架构名词和动词直接来自 `/codebase-design` 技能。简洁凝练绝不是用词偏离规范的借口。

**必须精确使用：** 模块 (module)、接口 (interface)、实现 (implementation)、深度 (depth)、深层 (deep)、浅层 (shallow)、接缝 (seam)、适配器 (adapter)、杠杆力 (leverage)、局部性 (locality)。

**绝勿替换使用：** 组件 (component)、服务 (service)、单元 (unit)（替代模块）· API、签名 (signature)（替代接口）· 边界 (boundary)（替代接缝）· 层 (layer)、包装层 (wrapper)（在指代模块时替代模块）。

**契合本风格的句式：**

- "订单接收模块过于浅薄 — 接口几乎与实现完全匹配。"
- "计价逻辑跨接缝泄漏。"
- "深化：一个接口，一处测试。"
- "两个适配器证明了接缝的合理性：生产环境为 HTTP，测试中为内存实现。"

**收益要点 (Wins bullets)** 用词汇表术语指名收益：*"局部性：Bug 集中在一个模块中"*，*"杠杆力：一个接口，N 个调用点"*，*"接口收缩；实现吸纳了包装层"*。不要写 *"更容易维护"* 或 *"更干净的代码"* — 这些词汇不在词汇表中，无法赢得其一席之地。

- 保持断言直接，不套话，不要使用“值得注意的是…”等客套话。如果一句话可以做成要点，就做成要点。如果一个要点可以删掉，就删掉它。如果某个术语不在 `/codebase-design` 词汇表中，在发明新词之前，请优先使用词汇表中的已有术语。
