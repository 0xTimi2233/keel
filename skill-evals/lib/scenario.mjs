import fs from "node:fs/promises";
import path from "node:path";

import YAML from "yaml";

import { EVAL_ROOT, assertWithin, resolveFromEval, toPosixPath } from "./project-paths.mjs";

const ALLOWED_SANDBOXES = new Set(["read-only", "workspace-write"]);
const ALLOWED_THREAD_MODES = new Set(["new", "continue"]);

function requireObject(value, label) {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new Error(`${label} must be an object`);
  }
  return value;
}

function requireString(value, label) {
  if (typeof value !== "string" || value.trim() === "") {
    throw new Error(`${label} must be a non-empty string`);
  }
  return value;
}

function rejectUnknownKeys(value, allowedKeys, label) {
  const unknown = Object.keys(value).filter((key) => !allowedKeys.has(key));
  if (unknown.length > 0) {
    throw new Error(`${label} has unknown keys: ${unknown.join(", ")}`);
  }
}

function normalizeStringList(value, label) {
  const values = Array.isArray(value) ? value : [value];
  if (
    values.length === 0 ||
    values.some((entry) => typeof entry !== "string" || entry.trim() === "")
  ) {
    throw new Error(`${label} must be a string or a non-empty string array`);
  }
  return values;
}

function normalizeRegexList(value, label) {
  const values = normalizeStringList(value, label);
  for (const pattern of values) {
    try {
      new RegExp(pattern, "u");
    } catch (error) {
      throw new Error(
        `${label} contains an invalid regular expression ${JSON.stringify(pattern)}: ${error.message}`,
      );
    }
  }
  return values;
}

function normalizeNonNegativeInteger(value, label) {
  if (!Number.isInteger(value) || value < 0) {
    throw new Error(`${label} must be a non-negative integer`);
  }
  return value;
}

function normalizeResponseExpectation(value, label) {
  requireObject(value, label);
  rejectUnknownKeys(
    value,
    new Set([
      "containsAll",
      "containsAny",
      "excludes",
      "matches",
      "endsWithQuestion",
      "questionCount",
      "minLength",
      "maxLength",
    ]),
    label,
  );
  const result = {};
  for (const key of ["containsAll", "containsAny", "excludes"]) {
    if (value[key] !== undefined) {
      result[key] = normalizeStringList(value[key], `${label}.${key}`);
    }
  }
  if (value.matches !== undefined) {
    result.matches = normalizeRegexList(value.matches, `${label}.matches`);
  }
  if (value.endsWithQuestion !== undefined) {
    if (typeof value.endsWithQuestion !== "boolean") {
      throw new Error(`${label}.endsWithQuestion must be a boolean`);
    }
    result.endsWithQuestion = value.endsWithQuestion;
  }
  if (value.questionCount !== undefined) {
    if (typeof value.questionCount === "number") {
      result.questionCount = normalizeNonNegativeInteger(
        value.questionCount,
        `${label}.questionCount`,
      );
    } else {
      requireObject(value.questionCount, `${label}.questionCount`);
      rejectUnknownKeys(
        value.questionCount,
        new Set(["min", "max"]),
        `${label}.questionCount`,
      );
      if (
        value.questionCount.min === undefined &&
        value.questionCount.max === undefined
      ) {
        throw new Error(`${label}.questionCount must define min or max`);
      }
      result.questionCount = {};
      for (const key of ["min", "max"]) {
        if (value.questionCount[key] !== undefined) {
          result.questionCount[key] = normalizeNonNegativeInteger(
            value.questionCount[key],
            `${label}.questionCount.${key}`,
          );
        }
      }
      if (
        result.questionCount.min !== undefined &&
        result.questionCount.max !== undefined &&
        result.questionCount.min > result.questionCount.max
      ) {
        throw new Error(`${label}.questionCount.min cannot exceed max`);
      }
    }
  }
  for (const key of ["minLength", "maxLength"]) {
    if (value[key] !== undefined) {
      result[key] = normalizeNonNegativeInteger(value[key], `${label}.${key}`);
    }
  }
  return result;
}

function normalizeSkillExpectation(value, label) {
  requireObject(value, label);
  rejectUnknownKeys(value, new Set(["used", "notUsed"]), label);
  const result = {};
  for (const key of ["used", "notUsed"]) {
    if (value[key] !== undefined) {
      result[key] = normalizeStringList(value[key], `${label}.${key}`);
    }
  }
  return result;
}

function normalizeFileRequirement(value, label) {
  requireObject(value, label);
  rejectUnknownKeys(
    value,
    new Set(["path", "containsAll", "containsAny", "excludes", "matches"]),
    label,
  );
  const result = { path: requireString(value.path, `${label}.path`) };
  for (const key of ["containsAll", "containsAny", "excludes"]) {
    if (value[key] !== undefined) {
      result[key] = normalizeStringList(value[key], `${label}.${key}`);
    }
  }
  if (value.matches !== undefined) {
    result.matches = normalizeRegexList(value.matches, `${label}.matches`);
  }
  return result;
}

function normalizeFileExpectation(value, label) {
  requireObject(value, label);
  rejectUnknownKeys(
    value,
    new Set([
      "unchanged",
      "allowChanges",
      "requiredChanges",
      "forbidChanges",
      "exists",
      "absent",
      "required",
    ]),
    label,
  );
  const result = {};
  if (value.unchanged !== undefined) {
    if (typeof value.unchanged !== "boolean") {
      throw new Error(`${label}.unchanged must be a boolean`);
    }
    result.unchanged = value.unchanged;
  }
  for (const key of [
    "allowChanges",
    "requiredChanges",
    "forbidChanges",
    "exists",
    "absent",
  ]) {
    if (value[key] !== undefined) {
      result[key] = normalizeStringList(value[key], `${label}.${key}`);
    }
  }
  if (value.required !== undefined) {
    if (!Array.isArray(value.required) || value.required.length === 0) {
      throw new Error(`${label}.required must be a non-empty array`);
    }
    result.required = value.required.map((requirement, index) =>
      normalizeFileRequirement(requirement, `${label}.required[${index}]`),
    );
  }
  return result;
}

function normalizeCommandExpectation(value, label) {
  requireObject(value, label);
  rejectUnknownKeys(value, new Set(["maxCount", "required", "forbid"]), label);
  const result = {};
  if (value.maxCount !== undefined) {
    result.maxCount = normalizeNonNegativeInteger(
      value.maxCount,
      `${label}.maxCount`,
    );
  }
  for (const key of ["required", "forbid"]) {
    if (value[key] !== undefined) {
      result[key] = normalizeRegexList(value[key], `${label}.${key}`);
    }
  }
  return result;
}

function normalizeExpectation(value, label) {
  requireObject(value, label);
  rejectUnknownKeys(
    value,
    new Set(["response", "skills", "files", "commands"]),
    label,
  );
  return {
    ...(value.response !== undefined
      ? { response: normalizeResponseExpectation(value.response, `${label}.response`) }
      : {}),
    ...(value.skills !== undefined
      ? { skills: normalizeSkillExpectation(value.skills, `${label}.skills`) }
      : {}),
    ...(value.files !== undefined
      ? { files: normalizeFileExpectation(value.files, `${label}.files`) }
      : {}),
    ...(value.commands !== undefined
      ? { commands: normalizeCommandExpectation(value.commands, `${label}.commands`) }
      : {}),
  };
}

function normalizeTurn(turn, label) {
  requireObject(turn, label);
  rejectUnknownKeys(turn, new Set(["user", "expect"]), label);

  return {
    user: requireString(turn.user, `${label}.user`),
    ...(turn.expect !== undefined
      ? { expect: normalizeExpectation(turn.expect, `${label}.expect`) }
      : {}),
  };
}

export function normalizeScenario(raw, source = "<inline>") {
  requireObject(raw, `scenario (${source})`);
  rejectUnknownKeys(
    raw,
    new Set([
      "schemaVersion",
      "id",
      "description",
      "fixture",
      "targetSkills",
      "runtime",
      "stages",
      "turns",
      "expect",
    ]),
    "scenario",
  );
  if (raw.schemaVersion !== undefined && raw.schemaVersion !== 1) {
    throw new Error(`scenario.schemaVersion must be 1: ${source}`);
  }
  if (raw.stages !== undefined && raw.turns !== undefined) {
    throw new Error("scenario cannot define both stages and turns");
  }

  const id = requireString(raw.id, "scenario.id");
  if (raw.runtime !== undefined) {
    requireObject(raw.runtime, "scenario.runtime");
    rejectUnknownKeys(
      raw.runtime,
      new Set(["sandboxMode", "timeoutMs"]),
      "scenario.runtime",
    );
  }
  const runtime = {
    sandboxMode:
      raw.runtime?.sandboxMode === undefined
        ? "read-only"
        : raw.runtime.sandboxMode,
    timeoutMs:
      raw.runtime?.timeoutMs === undefined
        ? 180_000
        : raw.runtime.timeoutMs,
  };

  if (!ALLOWED_SANDBOXES.has(runtime.sandboxMode)) {
    throw new Error(
      `scenario.runtime.sandboxMode must be read-only or workspace-write: ${id}`,
    );
  }
  if (!Number.isInteger(runtime.timeoutMs) || runtime.timeoutMs <= 0) {
    throw new Error(`scenario.runtime.timeoutMs must be a positive integer: ${id}`);
  }

  const rawStages =
    raw.stages === undefined
      ? [
          {
            id: "main",
            thread: "new",
            turns: raw.turns,
          },
        ]
      : raw.stages;
  if (!Array.isArray(rawStages) || rawStages.length === 0) {
    throw new Error(`scenario.stages must contain at least one stage: ${id}`);
  }

  const stages = rawStages.map((stage, stageIndex) => {
    const label = `scenario.stages[${stageIndex}]`;
    requireObject(stage, label);
    rejectUnknownKeys(stage, new Set(["id", "thread", "turns", "expect"]), label);

    const thread = stage.thread === undefined ? "new" : stage.thread;
    if (!ALLOWED_THREAD_MODES.has(thread)) {
      throw new Error(`${label}.thread must be new or continue`);
    }
    if (stageIndex === 0 && thread === "continue") {
      throw new Error("The first scenario stage cannot continue a previous thread");
    }
    if (!Array.isArray(stage.turns) || stage.turns.length === 0) {
      throw new Error(`${label}.turns must contain at least one turn`);
    }

    return {
      id: requireString(
        stage.id === undefined ? `stage-${stageIndex + 1}` : stage.id,
        `${label}.id`,
      ),
      thread,
      turns: stage.turns.map((turn, turnIndex) =>
        normalizeTurn(turn, `${label}.turns[${turnIndex}]`),
      ),
      ...(stage.expect !== undefined
        ? { expect: normalizeExpectation(stage.expect, `${label}.expect`) }
        : {}),
    };
  });

  const stageIds = stages.map((stage) => stage.id);
  if (new Set(stageIds).size !== stageIds.length) {
    throw new Error(`scenario stage IDs must be unique: ${id}`);
  }

  const targetSkills =
    raw.targetSkills === undefined
      ? []
      : normalizeStringList(raw.targetSkills, "scenario.targetSkills");
  if (new Set(targetSkills).size !== targetSkills.length) {
    throw new Error(`scenario.targetSkills must be unique: ${id}`);
  }

  return {
    schemaVersion: 1,
    id,
    description:
      raw.description === undefined
        ? id
        : requireString(raw.description, "scenario.description"),
    fixture:
      raw.fixture === undefined
        ? "empty"
        : requireString(raw.fixture, "scenario.fixture"),
    targetSkills,
    runtime,
    stages,
    ...(raw.expect !== undefined
      ? { expect: normalizeExpectation(raw.expect, "scenario.expect") }
      : {}),
    source,
  };
}

export async function loadScenario(value) {
  const candidate = resolveFromEval(value);
  const scenarioPath = assertWithin(EVAL_ROOT, candidate, "scenario path");
  if (![".yaml", ".yml"].includes(path.extname(scenarioPath))) {
    throw new Error(`Scenario file must use .yaml or .yml: ${value}`);
  }

  const text = await fs.readFile(scenarioPath, "utf8");
  return normalizeScenario(YAML.parse(text), toPosixPath(path.relative(EVAL_ROOT, scenarioPath)));
}
