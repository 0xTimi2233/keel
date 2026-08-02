import assert from "node:assert/strict";
import test from "node:test";

import { normalizeScenario } from "../../lib/scenario.mjs";

test("normalizes legacy turns into one stage", () => {
  const scenario = normalizeScenario({
    id: "legacy",
    turns: [{ user: "你好" }],
  });

  assert.equal(scenario.stages.length, 1);
  assert.equal(scenario.stages[0].thread, "new");
  assert.equal(scenario.stages[0].turns[0].user, "你好");
  assert.equal(scenario.runtime.sandboxMode, "read-only");
});

test("accepts multi-stage thread transitions", () => {
  const scenario = normalizeScenario({
    id: "multi-stage",
    stages: [
      { id: "one", thread: "new", turns: [{ user: "第一轮" }] },
      { id: "two", thread: "continue", turns: [{ user: "第二轮" }] },
      { id: "three", thread: "new", turns: [{ user: "新线程" }] },
    ],
  });

  assert.deepEqual(
    scenario.stages.map((stage) => stage.thread),
    ["new", "continue", "new"],
  );
});

test("rejects an initial continue stage and unsafe sandbox", () => {
  assert.throws(
    () =>
      normalizeScenario({
        id: "bad-thread",
        stages: [
          { id: "first", thread: "continue", turns: [{ user: "继续" }] },
        ],
      }),
    /cannot continue/u,
  );
  assert.throws(
    () =>
      normalizeScenario({
        id: "bad-sandbox",
        runtime: { sandboxMode: "danger-full-access" },
        turns: [{ user: "运行" }],
      }),
    /read-only or workspace-write/u,
  );
});

test("rejects misspelled expectation keys instead of silently skipping them", () => {
  assert.throws(
    () =>
      normalizeScenario({
        id: "bad-expectation",
        turns: [
          {
            user: "检查",
            expect: { file: { unchanged: true } },
          },
        ],
      }),
    /unknown keys: file/u,
  );
});

test("rejects null groups, duplicate stage syntaxes and invalid regex", () => {
  assert.throws(
    () =>
      normalizeScenario({
        id: "null-expectation",
        turns: [{ user: "检查", expect: { files: null } }],
      }),
    /must be an object/u,
  );
  assert.throws(
    () =>
      normalizeScenario({
        id: "two-syntaxes",
        turns: [{ user: "简写" }],
        stages: [{ id: "main", turns: [{ user: "完整" }] }],
      }),
    /both stages and turns/u,
  );
  assert.throws(
    () =>
      normalizeScenario({
        id: "invalid-regex",
        turns: [
          {
            user: "检查",
            expect: { response: { matches: "[" } },
          },
        ],
      }),
    /invalid regular expression/u,
  );
});
