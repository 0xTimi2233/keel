// @ts-check
// 用于 dependency-cruiser 的深层模块强制规范。
//
// 包根目录下的每个包都是一个 深层模块 (DEEP MODULE)：在较小接口背后
// 隐藏大量行为。一个包的 公开表面 (PUBLIC SURFACE) 是它的 入口点 (ENTRY POINTS) —
// 即位于包根目录的文件。具体实现在 子文件夹 (SUBFOLDERS) 中，且是私有的 —
// 按照约定实现存放在 `lib/`，测试存放在 `tests/`，不过任何子文件夹都是私有的。
// 一个包可以暴露多个小入口点（index.ts, client.ts, server.ts, …） — 相比于
// 一个庞大的桶文件 index，更推荐这种做法。
//
// 这里你唯一可能需要修改的地方是 PACKAGES_ROOT。

/** 包存放的位置。每个包对应一个直接子目录（平铺，无嵌套）。 */
const PACKAGES_ROOT = "src/packages";

// --- 衍生出的匹配模式（无需编辑） -------------------------------------
const R = PACKAGES_ROOT;
/**
 * 包的私有内部实现：嵌套在包子文件夹中的任何内容。
 * 包的根目录文件是其入口点，不会在此处匹配 —
 * 它们保持可从外部导入。
 */
const PACKAGE_INTERNALS = `^${R}/[^/]+/[^/]+/`;

/** @type {import('dependency-cruiser').IConfiguration} */
module.exports = {
  forbidden: [
    {
      name: "entrypoint-boundary-from-app",
      comment:
        "应用/根目录代码可以导入包的入口点（其根目录文件），但不能导入其子文件夹中的任何内容。",
      severity: "error",
      from: { pathNot: `^${R}/` }, // 导入方不在任何包内部
      to: { path: PACKAGE_INTERNALS },
    },
    {
      name: "entrypoint-boundary-across-packages",
      comment:
        "包自身的文件可以自由相互导入，但访问其他包时只能通过其入口点 — 绝不能访问其内部实现。",
      severity: "error",
      // 导入方在某个包内 ($1)，但不是测试文件
      from: { path: `^${R}/([^/]+)/`, pathNot: `^${R}/[^/]+/tests/` },
      to: {
        path: PACKAGE_INTERNALS,
        pathNot: `^${R}/$1/`, // 同一个包 → 包内自由导入
      },
    },
    {
      name: "tests-through-entrypoints",
      comment:
        "包的测试像其他人一样通过其入口点对其进行测试：它们可以导入任何包的入口点及其自身的 tests/ fixture，但绝不能导入任何包的内部实现 — 甚至不能导入它们自己的。",
      severity: "error",
      from: { path: `^${R}/([^/]+)/tests/` }, // 测试文件，位于包 $1
      to: {
        path: PACKAGE_INTERNALS,
        pathNot: `^${R}/$1/tests/`, // 允许导入自身 tests/ 下的 fixture
      },
    },
    {
      name: "tests-folder-is-private",
      comment:
        "包的 tests/ 文件夹仅允许从测试中访问 — 其他任何文件均不可导入其中的 fixture。",
      severity: "error",
      from: { pathNot: `^${R}/[^/]+/tests/` }, // 导入方本身不是测试
      to: { path: `^${R}/[^/]+/tests/` },
    },
    {
      name: "no-circular",
      comment: "不允许循环依赖。如果你想允许包外部的循环依赖，可以将其作用域限制为 `^${R}/`。",
      severity: "error",
      from: {},
      to: { circular: true },
    },

    // --- 分层架构 (Layering)（可选，默认关闭） ----------------------------------
    // 接口隐藏控制的是你“如何”导入（通过入口点）。
    // 分层架构控制的是“哪些”包可以依赖哪些包。在此处添加你自己的规则，
    // 例如：
    //
    // {
    //   name: "ui-may-not-depend-on-billing",
    //   severity: "error",
    //   from: { path: `^${R}/ui/` },
    //   to:   { path: `^${R}/billing/` },
    // },
  ],
  options: {
    doNotFollow: { path: "node_modules" },
    tsConfig: { fileName: "tsconfig.json" },
    enhancedResolveOptions: {
      extensions: [".ts", ".tsx", ".js", ".jsx", ".json"],
    },
  },
};
