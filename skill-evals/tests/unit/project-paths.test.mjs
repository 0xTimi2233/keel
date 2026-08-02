import assert from "node:assert/strict";
import os from "node:os";
import path from "node:path";
import test from "node:test";

import {
  REPO_ROOT,
  WORKSPACES_ROOT,
  validateWorkspaceRoot,
} from "../../lib/project-paths.mjs";

test("runtime workspaces default outside the source repository", () => {
  assert.equal(WORKSPACES_ROOT.startsWith(`${REPO_ROOT}${path.sep}`), false);
});

test("workspace root rejects relative, filesystem and repository paths", () => {
  assert.throws(() => validateWorkspaceRoot("relative"), /absolute/u);
  assert.throws(
    () => validateWorkspaceRoot(path.parse(os.tmpdir()).root),
    /filesystem root/u,
  );
  assert.throws(() => validateWorkspaceRoot(REPO_ROOT), /source repository/u);
  assert.equal(validateWorkspaceRoot(path.join(os.tmpdir(), "safe-evals")), path.join(os.tmpdir(), "safe-evals"));
});

