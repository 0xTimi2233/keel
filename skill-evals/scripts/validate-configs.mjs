import { spawn } from "node:child_process";
import crypto from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";

import YAML from "yaml";

import { snapshotTree } from "../lib/file-tree.mjs";
import {
  BASELINE_ROOT,
  CANDIDATE_ROOT,
  EVAL_ROOT,
  FIXTURES_ROOT,
  assertWithin,
} from "../lib/project-paths.mjs";
import { loadScenario } from "../lib/scenario.mjs";
import { discoverSkills } from "../lib/skills.mjs";

async function yamlFiles(root) {
  const files = [];
  async function visit(current) {
    const entries = await fs.readdir(current, { withFileTypes: true });
    entries.sort((left, right) => left.name.localeCompare(right.name));
    for (const entry of entries) {
      const absolute = path.join(current, entry.name);
      if (entry.isDirectory()) {
        await visit(absolute);
      } else if (
        entry.isFile() &&
        [".yaml", ".yml"].includes(path.extname(entry.name))
      ) {
        files.push(absolute);
      }
    }
  }
  await visit(root);
  return files;
}

async function validateProject() {
  const scenarioPaths = await yamlFiles(path.join(EVAL_ROOT, "scenarios"));
  const scenarios = await Promise.all(
    scenarioPaths.map((scenarioPath) =>
      loadScenario(path.relative(EVAL_ROOT, scenarioPath)),
    ),
  );
  const ids = scenarios.map((scenario) => scenario.id);
  const duplicateIds = ids.filter((id, index) => ids.indexOf(id) !== index);
  if (duplicateIds.length > 0) {
    throw new Error(
      `Duplicate scenario IDs: ${[...new Set(duplicateIds)].join(", ")}`,
    );
  }
  const knownScenarioSources = new Set(
    scenarios.map((scenario) => scenario.source),
  );
  const testListPaths = await yamlFiles(path.join(EVAL_ROOT, "tests"));
  for (const testListPath of testListPaths) {
    const testList = YAML.parse(await fs.readFile(testListPath, "utf8"));
    if (!Array.isArray(testList)) {
      throw new Error(
        `Test list must be an array: ${path.relative(EVAL_ROOT, testListPath)}`,
      );
    }
    for (const [index, testCase] of testList.entries()) {
      const scenarioFile = testCase?.vars?.scenarioFile;
      if (typeof scenarioFile !== "string") {
        throw new Error(
          `Test list ${path.relative(EVAL_ROOT, testListPath)}[${index}] must define vars.scenarioFile`,
        );
      }
      if (!knownScenarioSources.has(scenarioFile)) {
        throw new Error(
          `Test list ${path.relative(EVAL_ROOT, testListPath)}[${index}] references an unknown scenario: ${scenarioFile}`,
        );
      }
    }
  }

  const candidateSkills = await discoverSkills(CANDIDATE_ROOT);
  const baselineSkills = await discoverSkills(BASELINE_ROOT);
  const candidateNames = new Set(candidateSkills.map((skill) => skill.name));
  const baselineNames = new Set(baselineSkills.map((skill) => skill.name));
  for (const scenario of scenarios) {
    const fixturePath = assertWithin(
      FIXTURES_ROOT,
      path.resolve(FIXTURES_ROOT, scenario.fixture),
      `fixture for ${scenario.id}`,
    );
    const fixture = await fs.stat(fixturePath).catch(() => null);
    if (!fixture?.isDirectory()) {
      throw new Error(`Fixture is not a directory for ${scenario.id}: ${scenario.fixture}`);
    }
    for (const skill of scenario.targetSkills) {
      if (!candidateNames.has(skill)) {
        throw new Error(`Scenario ${scenario.id} targets missing candidate skill: ${skill}`);
      }
      if (!baselineNames.has(skill)) {
        throw new Error(`Scenario ${scenario.id} targets missing baseline skill: ${skill}`);
      }
    }
  }

  const manifestPath = path.join(BASELINE_ROOT, "baseline-manifest.json");
  const manifest = JSON.parse(await fs.readFile(manifestPath, "utf8"));
  const baselineSnapshot = await snapshotTree(BASELINE_ROOT);
  delete baselineSnapshot.files["baseline-manifest.json"];
  const digest = crypto
    .createHash("sha256")
    .update(JSON.stringify(baselineSnapshot.files))
    .digest("hex");
  if (digest !== manifest.sha256) {
    throw new Error(
      "Baseline content no longer matches baseline-manifest.json; create or restore a deliberate snapshot",
    );
  }
  console.log(
    `Project assets are valid (${scenarios.length} scenarios, ${candidateSkills.length} candidate skills, ${baselineSkills.length} baseline skills).`,
  );
}

await validateProject();

const runner = path.join(EVAL_ROOT, "scripts", "run-promptfoo.mjs");
const configs = [
  "promptfooconfig.smoke.yaml",
  "promptfooconfig.live-smoke.yaml",
  "promptfooconfig.candidate.yaml",
  "promptfooconfig.codex.yaml",
  "promptfooconfig.control.yaml",
  "promptfooconfig.acceptance.yaml",
];

for (const config of configs) {
  const exitCode = await new Promise((resolve, reject) => {
    const child = spawn(
      process.execPath,
      [runner, "validate", "config", "-c", config],
      {
        cwd: EVAL_ROOT,
        stdio: "inherit",
        env: process.env,
      },
    );
    child.on("error", reject);
    child.on("exit", (code, signal) => {
      if (signal) {
        reject(new Error(`Validation for ${config} terminated by ${signal}`));
      } else {
        resolve(code ?? 1);
      }
    });
  });
  if (exitCode !== 0) {
    process.exitCode = exitCode;
    break;
  }
}
