function resultRows(document) {
  const rows = document?.results?.results;
  if (!Array.isArray(rows)) {
    throw new Error("File is not a Promptfoo JSON result with results.results");
  }
  return rows;
}

export function aggregatePromptfooResults(document) {
  const groups = new Map();
  for (const result of resultRows(document)) {
    const provider = result.provider?.label ?? result.provider?.id ?? "unknown";
    const scenario =
      result.vars?.scenarioFile ??
      result.testCase?.description ??
      `test-${result.testIdx ?? "unknown"}`;
    const key = `${provider}\u0000${scenario}`;
    const group = groups.get(key) ?? {
      provider,
      scenario,
      runs: 0,
      passes: 0,
      errors: 0,
      scoreTotal: 0,
    };
    group.runs += 1;
    group.passes += result.success ? 1 : 0;
    group.errors += result.error || result.response?.error ? 1 : 0;
    group.scoreTotal += Number(result.score) || 0;
    groups.set(key, group);
  }

  return [...groups.values()]
    .map((group) => ({
      provider: group.provider,
      scenario: group.scenario,
      runs: group.runs,
      passes: group.passes,
      errors: group.errors,
      passRate: group.runs === 0 ? 0 : group.passes / group.runs,
      averageScore: group.runs === 0 ? 0 : group.scoreTotal / group.runs,
    }))
    .sort(
      (left, right) =>
        left.scenario.localeCompare(right.scenario) ||
        left.provider.localeCompare(right.provider),
    );
}

export function comparisonFailures(aggregates) {
  const byScenario = new Map();
  for (const aggregate of aggregates) {
    const variants = byScenario.get(aggregate.scenario) ?? new Map();
    variants.set(aggregate.provider, aggregate);
    byScenario.set(aggregate.scenario, variants);
  }

  const failures = [];
  for (const [scenario, variants] of byScenario) {
    const baseline = variants.get("baseline");
    const candidate = variants.get("candidate");
    if (!candidate) {
      failures.push(`${scenario}: 缺少 candidate 结果`);
      continue;
    }
    if (candidate.errors > 0) {
      failures.push(`${scenario}: candidate 有 ${candidate.errors} 个运行错误`);
    }
    if (candidate.passRate < 1) {
      failures.push(
        `${scenario}: candidate 通过率 ${(candidate.passRate * 100).toFixed(1)}%，未达到 100%`,
      );
    }
    if (!baseline) {
      failures.push(`${scenario}: 缺少 baseline 结果`);
      continue;
    }
    if (baseline.errors > 0) {
      failures.push(`${scenario}: baseline 有 ${baseline.errors} 个运行错误，无法可靠比较`);
    }
    if (candidate.passRate < baseline.passRate) {
      failures.push(
        `${scenario}: candidate 通过率低于 baseline（${(candidate.passRate * 100).toFixed(1)}% < ${(baseline.passRate * 100).toFixed(1)}%）`,
      );
    }
    if (candidate.averageScore + Number.EPSILON < baseline.averageScore) {
      failures.push(
        `${scenario}: candidate 平均分低于 baseline（${candidate.averageScore.toFixed(3)} < ${baseline.averageScore.toFixed(3)}）`,
      );
    }
  }
  return failures;
}
