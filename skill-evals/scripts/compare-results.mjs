import fs from "node:fs/promises";
import path from "node:path";

import {
  aggregatePromptfooResults,
  comparisonFailures,
} from "../lib/compare-results.mjs";
import { EVAL_ROOT, assertWithin, resolveFromEval } from "../lib/project-paths.mjs";

const failOnRegression = process.argv.includes("--fail-on-regression");
const resultArgument = process.argv
  .slice(2)
  .find((argument) => !argument.startsWith("--"));
const resultPath = assertWithin(
  EVAL_ROOT,
  resolveFromEval(resultArgument ?? "results/compare.json"),
  "comparison result path",
);
if (path.extname(resultPath) !== ".json") {
  throw new Error("Comparison result must be a .json file");
}

const document = JSON.parse(await fs.readFile(resultPath, "utf8"));
const aggregates = aggregatePromptfooResults(document);
console.table(
  aggregates.map((aggregate) => ({
    scenario: aggregate.scenario,
    provider: aggregate.provider,
    runs: aggregate.runs,
    passRate: `${(aggregate.passRate * 100).toFixed(1)}%`,
    averageScore: aggregate.averageScore.toFixed(3),
    errors: aggregate.errors,
  })),
);

const failures = comparisonFailures(aggregates);
if (failures.length === 0) {
  console.log("Comparison gate passed.");
} else {
  console.error(failures.map((failure) => `- ${failure}`).join("\n"));
  if (failOnRegression) {
    process.exitCode = 1;
  }
}

