import { execFile as execFileCallback } from "node:child_process";
import fs from "node:fs/promises";
import path from "node:path";
import { promisify } from "node:util";

import { snapshotTree } from "./file-tree.mjs";
import {
  BASELINE_ROOT,
  CANDIDATE_ROOT,
  FIXTURES_ROOT,
  WORKSPACES_ROOT,
  assertWithin,
  resolveFromEval,
} from "./project-paths.mjs";
import { installSkills } from "./skills.mjs";

const execFile = promisify(execFileCallback);

function safeSegment(value) {
  return value.replace(/[^a-zA-Z0-9_-]+/g, "-").replace(/^-+|-+$/g, "") || "scenario";
}

export function skillSourceForVariant(variant, configuredSource) {
  if (configuredSource) {
    return resolveFromEval(configuredSource);
  }
  if (variant === "baseline") {
    return BASELINE_ROOT;
  }
  return CANDIDATE_ROOT;
}

async function initializeGit(workspaceRoot) {
  await execFile("git", ["init", "-q"], { cwd: workspaceRoot });
  await execFile("git", ["add", "-A"], { cwd: workspaceRoot });
  await execFile(
    "git",
    [
      "-c",
      "user.name=Skill Eval",
      "-c",
      "user.email=skill-eval@example.invalid",
      "-c",
      "commit.gpgsign=false",
      "commit",
      "-qm",
      "fixture baseline",
      "--allow-empty",
    ],
    { cwd: workspaceRoot },
  );
}

export async function createWorkspace({
  scenario,
  variant,
  skillSource,
  excludedSkills = [],
}) {
  await fs.mkdir(WORKSPACES_ROOT, { recursive: true });
  const prefix = `${safeSegment(scenario.id)}-${safeSegment(variant)}-`;
  const workspaceRoot = await fs.mkdtemp(path.join(WORKSPACES_ROOT, prefix));

  try {
    const fixturePath = assertWithin(
      FIXTURES_ROOT,
      path.resolve(FIXTURES_ROOT, scenario.fixture),
      "fixture path",
    );
    await fs.cp(fixturePath, workspaceRoot, { recursive: true });

    const resolvedSkillSource = skillSourceForVariant(variant, skillSource);
    const installedSkills = await installSkills({
      sourceRoot: resolvedSkillSource,
      workspaceRoot,
      excludedSkills,
    });

    await initializeGit(workspaceRoot);
    const initialSnapshot = await snapshotTree(workspaceRoot);

    return {
      root: workspaceRoot,
      initialSnapshot,
      installedSkills,
      skillSource: resolvedSkillSource,
    };
  } catch (error) {
    await fs.rm(workspaceRoot, { recursive: true, force: true });
    throw error;
  }
}

export async function removeWorkspace(workspaceRoot) {
  const target = assertWithin(WORKSPACES_ROOT, workspaceRoot, "workspace cleanup path");
  if (target === path.resolve(WORKSPACES_ROOT)) {
    throw new Error("Refusing to delete the workspace root");
  }
  await fs.rm(target, { recursive: true, force: true });
}
