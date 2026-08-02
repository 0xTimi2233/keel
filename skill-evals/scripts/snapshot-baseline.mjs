import crypto from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";

import { snapshotTree } from "../lib/file-tree.mjs";
import {
  BASELINE_ROOT,
  CANDIDATE_ROOT,
  EVAL_ROOT,
  assertWithin,
  toPosixPath,
} from "../lib/project-paths.mjs";
import { copySkillSource, discoverSkills } from "../lib/skills.mjs";

const force = process.argv.includes("--force");
const allowedArguments = new Set(["--force"]);
const unknownArguments = process.argv
  .slice(2)
  .filter((argument) => !allowedArguments.has(argument));
if (unknownArguments.length > 0) {
  throw new Error(`Unknown arguments: ${unknownArguments.join(", ")}`);
}

const variantsRoot = path.join(EVAL_ROOT, "variants");
assertWithin(variantsRoot, BASELINE_ROOT, "baseline path");
await fs.mkdir(variantsRoot, { recursive: true });
const existing = await fs.readdir(BASELINE_ROOT).catch((error) => {
  if (error.code === "ENOENT") {
    return [];
  }
  throw error;
});

if (existing.length > 0 && !force) {
  throw new Error(
    "Baseline already exists. Review the candidate first, then rerun with --force to replace it.",
  );
}
let stagingRoot;
let backupPath;
try {
  stagingRoot = await fs.mkdtemp(path.join(variantsRoot, ".baseline-staging-"));
  await copySkillSource(CANDIDATE_ROOT, stagingRoot);
  const skills = await discoverSkills(stagingRoot);
  const snapshot = await snapshotTree(stagingRoot);
  const digest = crypto
    .createHash("sha256")
    .update(JSON.stringify(snapshot.files))
    .digest("hex");
  const manifest = {
    schemaVersion: 1,
    createdAt: new Date().toISOString(),
    source: toPosixPath(path.relative(EVAL_ROOT, CANDIDATE_ROOT)),
    sha256: digest,
    skills: skills.map(({ name, sourcePath }) => ({ name, sourcePath })),
  };
  await fs.writeFile(
    path.join(stagingRoot, "baseline-manifest.json"),
    `${JSON.stringify(manifest, null, 2)}\n`,
  );

  if (existing.length > 0) {
    const backupRoot = path.join(variantsRoot, "baseline-backups");
    await fs.mkdir(backupRoot, { recursive: true });
    const safeTimestamp = new Date()
      .toISOString()
      .replaceAll(":", "-")
      .replace(/\.\d{3}Z$/u, "Z");
    backupPath = path.join(backupRoot, safeTimestamp);
    await fs.rename(BASELINE_ROOT, backupPath);
  }
  await fs.rename(stagingRoot, BASELINE_ROOT);
  stagingRoot = undefined;
  console.log(`Snapshotted ${skills.length} skills to ${BASELINE_ROOT}`);
  if (backupPath) {
    console.log(`Previous baseline retained at ${backupPath}`);
  }
} catch (error) {
  if (stagingRoot) {
    await fs.rm(stagingRoot, { recursive: true, force: true });
  }
  const baselineExists = await fs
    .stat(BASELINE_ROOT)
    .then(() => true)
    .catch(() => false);
  if (backupPath && !baselineExists) {
    await fs.rename(backupPath, BASELINE_ROOT);
  }
  throw error;
}
