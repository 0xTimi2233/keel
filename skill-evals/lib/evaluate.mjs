import {
  globToRegExp,
  matchesPathPattern,
} from "./path-pattern.mjs";

export { globToRegExp };

function asArray(value) {
  if (value === undefined || value === null) {
    return [];
  }
  return Array.isArray(value) ? value : [value];
}

function includesAll(text, values) {
  return values.every((value) => text.includes(String(value)));
}

function includesAny(text, values) {
  return values.some((value) => text.includes(String(value)));
}

function countQuestions(text) {
  return [...text].filter((character) => character === "?" || character === "？")
    .length;
}

function regexMatches(text, pattern) {
  return new RegExp(pattern, "u").test(text);
}

function changedFiles(scope) {
  return scope.changedFiles ?? [];
}

function commands(scope) {
  return (scope.trace ?? [])
    .filter((item) => item.type === "command_execution")
    .map((item) => item.command ?? "");
}

function checkResponse(expectation, scope, add) {
  if (!expectation) {
    return;
  }
  const text = scope.response ?? "";

  if (expectation.containsAll) {
    const values = asArray(expectation.containsAll);
    add(
      includesAll(text, values),
      "response.containsAll",
      `响应包含全部片段：${values.join("、")}`,
      `响应缺少要求片段；要求：${values.join("、")}`,
    );
  }
  if (expectation.containsAny) {
    const values = asArray(expectation.containsAny);
    add(
      includesAny(text, values),
      "response.containsAny",
      `响应至少包含一个候选片段`,
      `响应未包含任一候选片段：${values.join("、")}`,
    );
  }
  if (expectation.excludes) {
    const values = asArray(expectation.excludes);
    const found = values.filter((value) => text.includes(String(value)));
    add(
      found.length === 0,
      "response.excludes",
      "响应未出现禁用片段",
      `响应出现禁用片段：${found.join("、")}`,
    );
  }
  if (expectation.matches) {
    const values = asArray(expectation.matches);
    const failed = values.filter((value) => !regexMatches(text, value));
    add(
      failed.length === 0,
      "response.matches",
      "响应符合全部正则",
      `响应不符合正则：${failed.join("、")}`,
    );
  }
  if (expectation.endsWithQuestion !== undefined) {
    const actual = /[?？]\s*$/u.test(text);
    add(
      actual === expectation.endsWithQuestion,
      "response.endsWithQuestion",
      `响应结尾问号状态为 ${actual}`,
      `期望结尾问号状态为 ${expectation.endsWithQuestion}，实际为 ${actual}`,
    );
  }
  if (expectation.questionCount !== undefined) {
    const actual = countQuestions(text);
    const wanted = expectation.questionCount;
    const pass =
      typeof wanted === "number"
        ? actual === wanted
        : (wanted.min === undefined || actual >= wanted.min) &&
          (wanted.max === undefined || actual <= wanted.max);
    add(
      pass,
      "response.questionCount",
      `响应问号数为 ${actual}`,
      `响应问号数 ${actual} 不符合 ${JSON.stringify(wanted)}`,
    );
  }
  if (expectation.minLength !== undefined) {
    add(
      text.length >= expectation.minLength,
      "response.minLength",
      `响应长度 ${text.length} 达到下限`,
      `响应长度 ${text.length} 低于下限 ${expectation.minLength}`,
    );
  }
  if (expectation.maxLength !== undefined) {
    add(
      text.length <= expectation.maxLength,
      "response.maxLength",
      `响应长度 ${text.length} 未超上限`,
      `响应长度 ${text.length} 超过上限 ${expectation.maxLength}`,
    );
  }
}

function checkSkills(expectation, scope, add, options) {
  if (!expectation) {
    return;
  }
  const used = new Set(scope.skillsUsed ?? []);
  if (expectation.used) {
    for (const name of asArray(expectation.used)) {
      if (options.skipRequiredSkills?.has(name)) {
        continue;
      }
      add(
        used.has(name),
        `skills.used:${name}`,
        `读取了 SKILL：${name}`,
        `未观察到读取 SKILL：${name}`,
      );
    }
  }
  if (expectation.notUsed) {
    for (const name of asArray(expectation.notUsed)) {
      add(
        !used.has(name),
        `skills.notUsed:${name}`,
        `未读取 SKILL：${name}`,
        `不应读取但观察到 SKILL：${name}`,
      );
    }
  }
}

function checkFiles(expectation, scope, add) {
  if (!expectation) {
    return;
  }
  const changed = changedFiles(scope);

  if (expectation.unchanged !== undefined) {
    add(
      (changed.length === 0) === expectation.unchanged,
      "files.unchanged",
      `文件变更数为 ${changed.length}`,
      `期望 unchanged=${expectation.unchanged}，实际变更：${changed.join("、") || "无"}`,
    );
  }
  if (expectation.allowChanges) {
    const patterns = asArray(expectation.allowChanges);
    const unexpected = changed.filter(
      (file) =>
        !patterns.some((pattern) => matchesPathPattern(file, pattern)),
    );
    add(
      unexpected.length === 0,
      "files.allowChanges",
      "所有文件变更均在白名单内",
      `白名单外文件变更：${unexpected.join("、")}`,
    );
  }
  if (expectation.requiredChanges) {
    for (const pattern of asArray(expectation.requiredChanges)) {
      const pass = changed.some((file) => matchesPathPattern(file, pattern));
      add(
        pass,
        `files.requiredChanges:${pattern}`,
        `发生了要求的文件变更：${pattern}`,
        `未发生要求的文件变更：${pattern}`,
      );
    }
  }
  if (expectation.forbidChanges) {
    for (const pattern of asArray(expectation.forbidChanges)) {
      const found = changed.filter((file) => matchesPathPattern(file, pattern));
      add(
        found.length === 0,
        `files.forbidChanges:${pattern}`,
        `未发生禁用文件变更：${pattern}`,
        `发生了禁用文件变更：${found.join("、")}`,
      );
    }
  }

  const snapshotFiles = scope.snapshot?.files ?? {};
  if (expectation.exists) {
    for (const pattern of asArray(expectation.exists)) {
      const found = Object.keys(snapshotFiles).some((file) =>
        matchesPathPattern(file, pattern),
      );
      add(
        found,
        `files.exists:${pattern}`,
        `最终文件存在：${pattern}`,
        `最终文件不存在：${pattern}`,
      );
    }
  }
  if (expectation.absent) {
    for (const pattern of asArray(expectation.absent)) {
      const found = Object.keys(snapshotFiles).filter((file) =>
        matchesPathPattern(file, pattern),
      );
      add(
        found.length === 0,
        `files.absent:${pattern}`,
        `最终文件不存在：${pattern}`,
        `不应存在的文件：${found.join("、")}`,
      );
    }
  }
  if (expectation.required) {
    for (const requirement of expectation.required) {
      const matchingFiles = Object.keys(snapshotFiles).filter((file) =>
        matchesPathPattern(file, requirement.path),
      );
      add(
        matchingFiles.length > 0,
        `files.required:${requirement.path}`,
        `找到要求文件：${requirement.path}`,
        `找不到要求文件：${requirement.path}`,
      );
      for (const file of matchingFiles) {
        const text = snapshotFiles[file].text;
        if (
          requirement.containsAll ||
          requirement.containsAny ||
          requirement.excludes ||
          requirement.matches
        ) {
          add(
            typeof text === "string",
            `files.text:${file}`,
            `文件可作为文本检查：${file}`,
            `文件不是可检查的文本：${file}`,
          );
          if (typeof text !== "string") {
            continue;
          }
        }
        if (requirement.containsAll) {
          const values = asArray(requirement.containsAll);
          add(
            includesAll(text, values),
            `files.containsAll:${file}`,
            `${file} 包含全部要求片段`,
            `${file} 缺少要求片段：${values.filter((value) => !text.includes(String(value))).join("、")}`,
          );
        }
        if (requirement.containsAny) {
          const values = asArray(requirement.containsAny);
          add(
            includesAny(text, values),
            `files.containsAny:${file}`,
            `${file} 至少包含一个候选片段`,
            `${file} 未包含任一候选片段：${values.join("、")}`,
          );
        }
        if (requirement.excludes) {
          const found = asArray(requirement.excludes).filter((value) =>
            text.includes(String(value)),
          );
          add(
            found.length === 0,
            `files.excludes:${file}`,
            `${file} 未包含禁用片段`,
            `${file} 包含禁用片段：${found.join("、")}`,
          );
        }
        if (requirement.matches) {
          const failed = asArray(requirement.matches).filter(
            (pattern) => !regexMatches(text, pattern),
          );
          add(
            failed.length === 0,
            `files.matches:${file}`,
            `${file} 符合全部正则`,
            `${file} 不符合正则：${failed.join("、")}`,
          );
        }
      }
    }
  }
}

function checkCommands(expectation, scope, add) {
  if (!expectation) {
    return;
  }
  const values = commands(scope);
  if (expectation.maxCount !== undefined) {
    add(
      values.length <= expectation.maxCount,
      "commands.maxCount",
      `命令数 ${values.length} 未超上限`,
      `命令数 ${values.length} 超过上限 ${expectation.maxCount}`,
    );
  }
  if (expectation.required) {
    for (const pattern of asArray(expectation.required)) {
      const pass = values.some((command) => regexMatches(command, pattern));
      add(
        pass,
        `commands.required:${pattern}`,
        `观察到要求的命令模式：${pattern}`,
        `未观察到要求的命令模式：${pattern}`,
      );
    }
  }
  if (expectation.forbid) {
    for (const pattern of asArray(expectation.forbid)) {
      const found = values.filter((command) => regexMatches(command, pattern));
      add(
        found.length === 0,
        `commands.forbid:${pattern}`,
        `未观察到禁用命令模式：${pattern}`,
        `观察到禁用命令：${found.join("；")}`,
      );
    }
  }
}

function scopeFromTurn(turn) {
  return {
    response: turn.response,
    skillsUsed: turn.skillsUsed,
    changedFiles: turn.changedFiles,
    trace: turn.trace,
    snapshot: turn.snapshot,
  };
}

function scopeFromStage(stage) {
  const lastTurn = stage.turns.at(-1);
  return {
    response: lastTurn?.response ?? "",
    skillsUsed: stage.skillsUsed,
    changedFiles: stage.changedFiles,
    trace: stage.turns.flatMap((turn) => turn.trace ?? []),
    snapshot: stage.snapshot,
  };
}

function scopeFromReport(report) {
  const turns = report.stages.flatMap((stage) => stage.turns);
  return {
    response: turns.at(-1)?.response ?? "",
    skillsUsed: report.skillsUsed,
    changedFiles: report.final.changedFiles,
    trace: turns.flatMap((turn) => turn.trace ?? []),
    snapshot: report.final.snapshot,
  };
}

function evaluateExpectation(expectation, scope, prefix, components, options) {
  if (!expectation) {
    return;
  }
  const add = (pass, name, success, failure) => {
    components.push({
      pass,
      score: pass ? 1 : 0,
      reason: `${prefix}.${name}: ${pass ? success : failure}`,
      metadata: { check: `${prefix}.${name}` },
    });
  };
  checkResponse(expectation.response, scope, add);
  checkSkills(expectation.skills, scope, add, options);
  checkFiles(expectation.files, scope, add);
  checkCommands(expectation.commands, scope, add);
}

export function evaluateReport(report) {
  if (!report || report.schemaVersion !== 1 || !report.scenario) {
    throw new Error("Output is not a skill-eval report with schemaVersion 1");
  }

  const components = [];
  const scenario = report.scenario;
  const options = {
    skipRequiredSkills:
      report.variant === "no-skill"
        ? new Set(scenario.targetSkills ?? [])
        : new Set(),
  };
  for (const [stageIndex, expectedStage] of scenario.stages.entries()) {
    const actualStage = report.stages[stageIndex];
    if (!actualStage) {
      components.push({
        pass: false,
        score: 0,
        reason: `stage:${expectedStage.id}: 运行报告缺少该阶段`,
        metadata: { check: `stage:${expectedStage.id}` },
      });
      continue;
    }

    for (const [turnIndex, expectedTurn] of expectedStage.turns.entries()) {
      const actualTurn = actualStage.turns[turnIndex];
      if (!actualTurn) {
        components.push({
          pass: false,
          score: 0,
          reason: `stage:${expectedStage.id}.turn:${turnIndex + 1}: 运行报告缺少该轮`,
          metadata: {
            check: `stage:${expectedStage.id}.turn:${turnIndex + 1}`,
          },
        });
        continue;
      }
      evaluateExpectation(
        expectedTurn.expect,
        scopeFromTurn(actualTurn),
        `stage:${expectedStage.id}.turn:${turnIndex + 1}`,
        components,
        options,
      );
    }
    evaluateExpectation(
      expectedStage.expect,
      scopeFromStage(actualStage),
      `stage:${expectedStage.id}`,
      components,
      options,
    );
  }
  evaluateExpectation(
    scenario.expect,
    scopeFromReport(report),
    "scenario",
    components,
    options,
  );

  const pass = components.every((result) => result.pass);
  const score =
    components.length === 0
      ? 1
      : components.reduce((sum, result) => sum + result.score, 0) /
        components.length;
  const failures = components.filter((result) => !result.pass);
  return {
    pass,
    score,
    reason:
      failures.length === 0
        ? `通过 ${components.length} 项确定性检查`
        : failures.map((failure) => failure.reason).join("\n"),
    componentResults: components,
  };
}
