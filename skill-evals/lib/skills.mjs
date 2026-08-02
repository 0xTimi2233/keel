import fs from "node:fs/promises";
import path from "node:path";

import YAML from "yaml";

import { toPosixPath } from "./project-paths.mjs";

export function validateSkillName(value, label = "skill name") {
  if (
    typeof value !== "string" ||
    value.trim() === "" ||
    value !== value.trim() ||
    value === "." ||
    value === ".." ||
    /[\\/]/u.test(value)
  ) {
    throw new Error(`${label} must be one safe path segment: ${String(value)}`);
  }
  return value;
}

function copyFilter(source) {
  const name = path.basename(source);
  return (
    name !== "__pycache__" &&
    name !== ".DS_Store" &&
    !name.endsWith(".pyc")
  );
}

async function skillName(skillFile) {
  const text = await fs.readFile(skillFile, "utf8");
  const match = text.match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/);
  if (!match) {
    throw new Error(`SKILL.md is missing frontmatter: ${skillFile}`);
  }

  const frontmatter = YAML.parse(match[1]);
  if (!frontmatter?.name || typeof frontmatter.name !== "string") {
    throw new Error(`SKILL.md is missing a string name: ${skillFile}`);
  }

  return validateSkillName(frontmatter.name, `SKILL.md name in ${skillFile}`);
}

export async function discoverSkills(sourceRoot) {
  const discovered = [];

  async function visit(current) {
    const entries = await fs.readdir(current, { withFileTypes: true });
    for (const entry of entries) {
      if (
        entry.name === "__pycache__" ||
        entry.name === "node_modules" ||
        entry.name.startsWith(".")
      ) {
        continue;
      }

      const absolute = path.join(current, entry.name);
      if (entry.isDirectory()) {
        await visit(absolute);
      } else if (entry.isFile() && entry.name === "SKILL.md") {
        discovered.push({
          name: await skillName(absolute),
          directory: path.dirname(absolute),
          sourcePath: toPosixPath(path.relative(sourceRoot, path.dirname(absolute))),
        });
      }
    }
  }

  await visit(sourceRoot);
  discovered.sort((left, right) => left.name.localeCompare(right.name));

  const duplicates = discovered
    .map((skill) => skill.name)
    .filter((name, index, names) => names.indexOf(name) !== index);
  if (duplicates.length > 0) {
    throw new Error(`Duplicate skill names: ${[...new Set(duplicates)].join(", ")}`);
  }

  return discovered;
}

export async function installSkills({
  sourceRoot,
  workspaceRoot,
  excludedSkills = [],
}) {
  const destinationRoot = path.join(workspaceRoot, ".agents", "skills");
  const excluded = new Set(excludedSkills);
  const skills = await discoverSkills(sourceRoot);
  await fs.mkdir(destinationRoot, { recursive: true });

  const installed = [];
  for (const skill of skills) {
    if (excluded.has(skill.name)) {
      continue;
    }

    const destination = path.join(destinationRoot, skill.name);
    await fs.cp(skill.directory, destination, {
      recursive: true,
      filter: copyFilter,
    });
    installed.push(skill.name);
  }

  return installed;
}

export async function copySkillSource(sourceRoot, destinationRoot) {
  await fs.cp(sourceRoot, destinationRoot, {
    recursive: true,
    filter: copyFilter,
  });
}
