import assert from "node:assert/strict";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";

import {
  changedFiles,
  diffSnapshots,
  snapshotTree,
} from "../../lib/file-tree.mjs";

test("snapshots classify created, modified and deleted files", async (context) => {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), "skill-eval-tree-"));
  context.after(() => fs.rm(root, { recursive: true, force: true }));
  await fs.writeFile(path.join(root, "modify.txt"), "before\n");
  await fs.writeFile(path.join(root, "delete.txt"), "remove\n");
  await fs.mkdir(path.join(root, ".agents"), { recursive: true });
  await fs.writeFile(path.join(root, ".agents", "ignored.txt"), "ignored\n");
  const before = await snapshotTree(root);

  await fs.writeFile(path.join(root, "modify.txt"), "after\n");
  await fs.rm(path.join(root, "delete.txt"));
  await fs.writeFile(path.join(root, "create.txt"), "new\n");
  const after = await snapshotTree(root);
  const diff = diffSnapshots(before, after);

  assert.deepEqual(diff, {
    created: ["create.txt"],
    modified: ["modify.txt"],
    deleted: ["delete.txt"],
  });
  assert.deepEqual(changedFiles(diff), [
    "create.txt",
    "delete.txt",
    "modify.txt",
  ]);
});

