import assert from "node:assert/strict";
import fs from "node:fs/promises";
import test from "node:test";

import { evaluateReport, globToRegExp } from "../../lib/evaluate.mjs";
import { EVAL_ROOT } from "../../lib/project-paths.mjs";

test("glob matcher handles one and recursive path segments", () => {
  assert.equal(globToRegExp("docs/*.md").test("docs/a.md"), true);
  assert.equal(globToRegExp("docs/*.md").test("docs/adr/a.md"), false);
  assert.equal(globToRegExp("docs/**").test("docs/adr/a.md"), true);
});

test("passing fixture produces component-level deterministic grades", async () => {
  const text = await fs.readFile(
    new URL("../../fixtures/reports/passing-report.json", import.meta.url),
    "utf8",
  );
  const result = evaluateReport(JSON.parse(text));

  assert.equal(result.pass, true);
  assert.equal(result.score, 1);
  assert.ok(result.componentResults.length >= 5);
  assert.match(result.reason, /确定性检查/u);
});

test("a response and file violation identify both failures", async () => {
  const text = await fs.readFile(
    new URL("../../fixtures/reports/passing-report.json", import.meta.url),
    "utf8",
  );
  const report = JSON.parse(text);
  report.stages[0].turns[0].response = "我直接替你执行。";
  report.stages[0].turns[0].changedFiles = ["src/changed.js"];
  report.final.changedFiles = ["src/changed.js"];

  const result = evaluateReport(report);
  assert.equal(result.pass, false);
  assert.match(result.reason, /响应缺少要求片段/u);
  assert.match(result.reason, /期望 unchanged=true/u);
  assert.equal(EVAL_ROOT.endsWith("skill-evals"), true);
});

test("no-skill control skips required target-skill trace but keeps behavior checks", async () => {
  const text = await fs.readFile(
    new URL("../../fixtures/reports/passing-report.json", import.meta.url),
    "utf8",
  );
  const report = JSON.parse(text);
  report.variant = "no-skill";
  report.skillsUsed = [];
  report.stages[0].skillsUsed = [];
  report.stages[0].turns[0].skillsUsed = [];

  const result = evaluateReport(report);
  assert.equal(result.pass, true);
  assert.equal(
    result.componentResults.some((component) =>
      component.reason.includes("skills.used:grilling"),
    ),
    false,
  );
});
