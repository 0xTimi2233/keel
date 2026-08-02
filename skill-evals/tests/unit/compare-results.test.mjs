import assert from "node:assert/strict";
import test from "node:test";

import {
  aggregatePromptfooResults,
  comparisonFailures,
} from "../../lib/compare-results.mjs";

function result(provider, scenario, success, score, error = undefined) {
  return {
    provider: { label: provider },
    vars: { scenarioFile: scenario },
    success,
    score,
    ...(error ? { response: { error } } : {}),
  };
}

test("aggregates repeated baseline and candidate runs", () => {
  const document = {
    results: {
      results: [
        result("baseline", "one.yaml", true, 1),
        result("baseline", "one.yaml", false, 0.5),
        result("candidate", "one.yaml", true, 1),
        result("candidate", "one.yaml", true, 1),
      ],
    },
  };
  const aggregates = aggregatePromptfooResults(document);
  const candidate = aggregates.find(
    (aggregate) => aggregate.provider === "candidate",
  );

  assert.equal(candidate.runs, 2);
  assert.equal(candidate.passRate, 1);
  assert.deepEqual(comparisonFailures(aggregates), []);
});

test("gate reports candidate failures and regressions", () => {
  const document = {
    results: {
      results: [
        result("baseline", "one.yaml", true, 1),
        result("candidate", "one.yaml", false, 0.5, "runtime failed"),
      ],
    },
  };
  const failures = comparisonFailures(aggregatePromptfooResults(document));

  assert.ok(failures.some((failure) => failure.includes("运行错误")));
  assert.ok(failures.some((failure) => failure.includes("未达到 100%")));
  assert.ok(failures.some((failure) => failure.includes("低于 baseline")));
});

