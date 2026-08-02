import path from "node:path";

import { createCodexThreadFactory } from "./codex-runtime.mjs";
import { changedFiles, diffSnapshots, snapshotTree } from "./file-tree.mjs";
import { matchesPathPattern } from "./path-pattern.mjs";
import { createWorkspace, removeWorkspace } from "./workspace.mjs";

const SKILL_PATH_PATTERN =
  /(?:^|[\s"'`])(?:[^\s"'`]*[\\/])?\.agents[\\/]skills[\\/]([^\\/\s"'`]+)[\\/]SKILL\.md(?=$|[\s"'`])/gu;

function truncate(value, maxLength = 4_000) {
  if (typeof value !== "string" || value.length <= maxLength) {
    return value;
  }
  return `${value.slice(0, maxLength)}\n…[truncated ${value.length - maxLength} chars]`;
}

function sanitizeItem(item) {
  switch (item.type) {
    case "agent_message":
      return { type: item.type, text: truncate(item.text) };
    case "command_execution":
      return {
        type: item.type,
        command: truncate(item.command),
        output: truncate(item.aggregated_output),
        exitCode: item.exit_code,
        status: item.status,
      };
    case "file_change":
      return { type: item.type, changes: item.changes, status: item.status };
    case "mcp_tool_call":
      return {
        type: item.type,
        server: item.server,
        tool: item.tool,
        status: item.status,
        ...(item.error?.message ? { error: item.error.message } : {}),
      };
    case "web_search":
      return { type: item.type, query: item.query };
    case "error":
      return { type: item.type, message: item.message };
    case "todo_list":
      return { type: item.type, items: item.items };
    case "reasoning":
      return { type: item.type };
    default:
      return { type: item.type ?? "unknown" };
  }
}

export function detectSkillReads(items = []) {
  const names = new Set();
  for (const item of items) {
    const searchable = [];
    if (item.type === "command_execution") {
      searchable.push(item.command);
    } else if (item.type === "mcp_tool_call") {
      searchable.push(JSON.stringify(item.arguments ?? {}));
    }

    for (const value of searchable) {
      SKILL_PATH_PATTERN.lastIndex = 0;
      for (const match of String(value).matchAll(SKILL_PATH_PATTERN)) {
        names.add(match[1]);
      }
    }
  }
  return [...names].sort();
}

function sumUsage(total, usage) {
  if (!usage) {
    return total;
  }
  for (const [key, value] of Object.entries(usage)) {
    total[key] = (total[key] ?? 0) + (Number(value) || 0);
  }
  return total;
}

async function runWithTimeout(thread, input, timeoutMs) {
  const controller = new AbortController();
  const timeout = setTimeout(
    () => controller.abort(new Error(`Turn exceeded ${timeoutMs} ms`)),
    timeoutMs,
  );
  timeout.unref?.();
  try {
    return await thread.run(input, { signal: controller.signal });
  } finally {
    clearTimeout(timeout);
  }
}

function relativeWorkspaceName(root) {
  return path.basename(root);
}

function compactSnapshot(snapshot, fileDiff, expectation) {
  const changed = new Set(changedFiles(fileDiff));
  const filesExpectation = expectation?.files;
  const needsFullIndex = Boolean(
    filesExpectation?.exists ||
      filesExpectation?.absent ||
      filesExpectation?.required,
  );
  const contentPatterns = (filesExpectation?.required ?? []).map(
    (requirement) => requirement.path,
  );
  const files = {};

  for (const [file, sourceRecord] of Object.entries(snapshot.files ?? {})) {
    if (!needsFullIndex && !changed.has(file)) {
      continue;
    }
    const record = { ...sourceRecord };
    const contentRequired = contentPatterns.some((pattern) =>
      matchesPathPattern(file, pattern),
    );
    if (typeof record.text === "string" && !contentRequired) {
      if (changed.has(file) && record.text.length > 16_000) {
        record.text = `${record.text.slice(0, 16_000)}\n…[snapshot text truncated]`;
        record.textTruncated = true;
      } else if (!changed.has(file)) {
        delete record.text;
      }
    }
    files[file] = record;
  }
  return { files };
}

export async function runScenario({
  scenario,
  variant = "candidate",
  skillSource,
  excludedSkills = [],
  createThread,
  keepWorkspace = process.env.SKILL_EVAL_KEEP_WORKSPACES === "1",
  runtimeConfig = {},
}) {
  const workspace = await createWorkspace({
    scenario,
    variant,
    skillSource,
    excludedSkills,
  });
  const threadFactory =
    createThread ?? createCodexThreadFactory(runtimeConfig);
  const startedAt = new Date().toISOString();
  let currentThread;
  let previousSnapshot = workspace.initialSnapshot;
  const stages = [];
  const allSkills = new Set();
  const totalUsage = {};
  let completed = false;

  try {
    for (const stage of scenario.stages) {
      if (stage.thread === "new") {
        currentThread = threadFactory({
          workspaceRoot: workspace.root,
          sandboxMode: scenario.runtime.sandboxMode,
          stage,
          scenario,
        });
      } else if (!currentThread) {
        throw new Error(`Stage ${stage.id} requested a missing previous thread`);
      }

      const stageBefore = previousSnapshot;
      const turns = [];
      const stageSkills = new Set();

      for (const [turnIndex, turn] of stage.turns.entries()) {
        const before = await snapshotTree(workspace.root);
        const result = await runWithTimeout(
          currentThread,
          turn.user,
          scenario.runtime.timeoutMs,
        );
        const after = await snapshotTree(workspace.root);
        const fileDiff = diffSnapshots(before, after);
        const skillsUsed = detectSkillReads(result.items);
        for (const name of skillsUsed) {
          stageSkills.add(name);
          allSkills.add(name);
        }
        sumUsage(totalUsage, result.usage);

        turns.push({
          index: turnIndex,
          user: turn.user,
          response: result.finalResponse,
          threadId: currentThread.id ?? null,
          skillsUsed,
          fileDiff,
          changedFiles: changedFiles(fileDiff),
          usage: result.usage,
          trace: result.items.map(sanitizeItem),
          snapshot: compactSnapshot(after, fileDiff, turn.expect),
        });
        previousSnapshot = after;
      }

      const stageAfter = previousSnapshot;
      const stageDiff = diffSnapshots(stageBefore, stageAfter);
      stages.push({
        id: stage.id,
        thread: stage.thread,
        threadId: currentThread.id ?? null,
        skillsUsed: [...stageSkills].sort(),
        turns,
        fileDiff: stageDiff,
        changedFiles: changedFiles(stageDiff),
        snapshot: compactSnapshot(stageAfter, stageDiff, stage.expect),
      });
    }

    const finalSnapshot = await snapshotTree(workspace.root);
    const finalDiff = diffSnapshots(workspace.initialSnapshot, finalSnapshot);
    completed = true;
    return {
      schemaVersion: 1,
      scenario,
      variant,
      startedAt,
      finishedAt: new Date().toISOString(),
      workspace: relativeWorkspaceName(workspace.root),
      installedSkills: workspace.installedSkills,
      skillsUsed: [...allSkills].sort(),
      stages,
      final: {
        fileDiff: finalDiff,
        changedFiles: changedFiles(finalDiff),
        snapshot: compactSnapshot(finalSnapshot, finalDiff, scenario.expect),
      },
      usage: totalUsage,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(
      `${message}\nRuntime workspace retained at ${workspace.root}`,
      error instanceof Error ? { cause: error } : undefined,
    );
  } finally {
    if (!keepWorkspace && completed) {
      await removeWorkspace(workspace.root);
    }
  }
}
