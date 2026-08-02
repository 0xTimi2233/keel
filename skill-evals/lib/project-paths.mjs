import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const LIB_DIR = path.dirname(fileURLToPath(import.meta.url));

export const EVAL_ROOT = path.resolve(LIB_DIR, "..");
export const REPO_ROOT = path.resolve(EVAL_ROOT, "..");
export const FIXTURES_ROOT = path.join(EVAL_ROOT, "fixtures", "workspaces");
export const BASELINE_ROOT = path.join(EVAL_ROOT, "variants", "baseline");
export const CANDIDATE_ROOT = path.join(REPO_ROOT, "my_skills");

export function validateWorkspaceRoot(value) {
  if (!path.isAbsolute(value)) {
    throw new Error("SKILL_EVAL_WORKSPACES_ROOT must be an absolute path");
  }
  const resolved = path.resolve(value);
  if (resolved === path.parse(resolved).root) {
    throw new Error("Workspace root cannot be a filesystem root");
  }

  const fromRepository = path.relative(REPO_ROOT, resolved);
  const insideRepository =
    fromRepository === "" ||
    (!fromRepository.startsWith("..") && !path.isAbsolute(fromRepository));
  const toRepository = path.relative(resolved, REPO_ROOT);
  const containsRepository =
    toRepository === "" ||
    (!toRepository.startsWith("..") && !path.isAbsolute(toRepository));
  if (insideRepository || containsRepository) {
    throw new Error("Workspace root must be outside and must not contain the source repository");
  }
  return resolved;
}

export const WORKSPACES_ROOT = validateWorkspaceRoot(
  process.env.SKILL_EVAL_WORKSPACES_ROOT ??
    path.join(os.tmpdir(), "keel-skill-eval-workspaces"),
);

export function resolveFromEval(value) {
  return path.isAbsolute(value) ? path.normalize(value) : path.resolve(EVAL_ROOT, value);
}

export function assertWithin(parent, candidate, label = "path") {
  const resolvedParent = path.resolve(parent);
  const resolvedCandidate = path.resolve(candidate);
  const relative = path.relative(resolvedParent, resolvedCandidate);

  if (relative === "" || (!relative.startsWith("..") && !path.isAbsolute(relative))) {
    return resolvedCandidate;
  }

  throw new Error(`${label} escapes its allowed root: ${candidate}`);
}

export function toPosixPath(value) {
  return value.split(path.sep).join("/");
}
