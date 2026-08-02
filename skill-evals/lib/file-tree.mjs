import crypto from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";

import { toPosixPath } from "./project-paths.mjs";

const DEFAULT_IGNORED_PARTS = new Set([
  ".agents",
  ".git",
  ".skill-eval",
  ".state",
  "node_modules",
  "__pycache__",
]);

function shouldIgnore(relativePath, ignoredParts) {
  return relativePath
    .split(path.sep)
    .some((part) => ignoredParts.has(part) || part === ".DS_Store" || part.endsWith(".pyc"));
}

function isProbablyText(buffer) {
  return !buffer.subarray(0, 8192).includes(0);
}

export async function snapshotTree(root, options = {}) {
  const ignoredParts = new Set([
    ...DEFAULT_IGNORED_PARTS,
    ...(options.ignoredParts ?? []),
  ]);
  const files = {};

  async function visit(current) {
    const entries = await fs.readdir(current, { withFileTypes: true });
    entries.sort((left, right) => left.name.localeCompare(right.name));

    for (const entry of entries) {
      const absolute = path.join(current, entry.name);
      const relative = path.relative(root, absolute);
      if (shouldIgnore(relative, ignoredParts)) {
        continue;
      }

      if (entry.isDirectory()) {
        await visit(absolute);
        continue;
      }

      if (entry.isSymbolicLink()) {
        files[toPosixPath(relative)] = {
          kind: "symlink",
          target: await fs.readlink(absolute),
        };
        continue;
      }

      if (!entry.isFile()) {
        continue;
      }

      const buffer = await fs.readFile(absolute);
      const record = {
        kind: "file",
        size: buffer.length,
        sha256: crypto.createHash("sha256").update(buffer).digest("hex"),
      };

      if (
        isProbablyText(buffer) &&
        buffer.length <= (options.maxTextBytes ?? 256 * 1024)
      ) {
        record.text = buffer.toString("utf8");
      }

      files[toPosixPath(relative)] = record;
    }
  }

  await visit(root);
  return { files };
}

export function diffSnapshots(before, after) {
  const beforeFiles = before.files ?? {};
  const afterFiles = after.files ?? {};
  const created = [];
  const modified = [];
  const deleted = [];

  for (const file of Object.keys(afterFiles)) {
    if (!(file in beforeFiles)) {
      created.push(file);
      continue;
    }

    if (JSON.stringify(beforeFiles[file]) !== JSON.stringify(afterFiles[file])) {
      modified.push(file);
    }
  }

  for (const file of Object.keys(beforeFiles)) {
    if (!(file in afterFiles)) {
      deleted.push(file);
    }
  }

  return {
    created: created.sort(),
    modified: modified.sort(),
    deleted: deleted.sort(),
  };
}

export function changedFiles(diff) {
  return [...diff.created, ...diff.modified, ...diff.deleted].sort();
}

