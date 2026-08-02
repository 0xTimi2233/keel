import assert from "node:assert/strict";
import fs from "node:fs/promises";
import path from "node:path";
import test from "node:test";

import { normalizeScenario } from "../../lib/scenario.mjs";
import { runScenario } from "../../lib/run-scenario.mjs";
import { WORKSPACES_ROOT } from "../../lib/project-paths.mjs";
import { removeWorkspace } from "../../lib/workspace.mjs";

test("reuses a thread for turns and hands real files to a new thread", async () => {
  const scenario = normalizeScenario({
    id: "runner-file-handoff",
    fixture: "empty",
    runtime: { sandboxMode: "workspace-write", timeoutMs: 5_000 },
    stages: [
      {
        id: "upstream",
        thread: "new",
        turns: [{ user: "先提问" }, { user: "写入术语" }],
      },
      {
        id: "downstream",
        thread: "new",
        turns: [{ user: "读取术语" }],
      },
    ],
  });
  let threadCount = 0;
  const calls = [];
  const createThread = ({ workspaceRoot }) => {
    threadCount += 1;
    const id = `fake-thread-${threadCount}`;
    return {
      id,
      async run(input) {
        calls.push({ id, input });
        if (input === "写入术语") {
          await fs.writeFile(
            path.join(workspaceRoot, "CONTEXT.md"),
            "# 术语\n\n- ShipmentIntent：发运意图。\n",
          );
        }
        const response =
          input === "读取术语"
            ? await fs.readFile(path.join(workspaceRoot, "CONTEXT.md"), "utf8")
            : "下一项？";
        return {
          finalResponse: response,
          usage: {
            input_tokens: 1,
            cached_input_tokens: 0,
            cache_write_input_tokens: 0,
            output_tokens: 1,
            reasoning_output_tokens: 0,
          },
          items:
            input === "先提问"
              ? [
                  {
                    type: "command_execution",
                    command:
                      "sed -n '1,120p' .agents/skills/grilling/SKILL.md",
                    aggregated_output: "",
                    status: "completed",
                    exit_code: 0,
                  },
                ]
              : [],
        };
      },
    };
  };

  const report = await runScenario({
    scenario,
    variant: "candidate",
    createThread,
  });

  assert.deepEqual(
    calls.map(({ id }) => id),
    ["fake-thread-1", "fake-thread-1", "fake-thread-2"],
  );
  assert.match(report.stages[1].turns[0].response, /ShipmentIntent/u);
  assert.deepEqual(report.skillsUsed, ["grilling"]);
  assert.deepEqual(report.final.changedFiles, ["CONTEXT.md"]);
  assert.equal(
    await fs
      .stat(path.join(WORKSPACES_ROOT, report.workspace))
      .then(() => true)
      .catch(() => false),
    false,
  );
});

test("retains and reports a workspace after a runtime failure", async (context) => {
  const scenario = normalizeScenario({
    id: "runner-runtime-failure",
    fixture: "empty",
    turns: [{ user: "触发错误" }],
  });
  let retainedPath;
  context.after(async () => {
    if (retainedPath) {
      await removeWorkspace(retainedPath);
    }
  });

  await assert.rejects(
    () =>
      runScenario({
        scenario,
        variant: "candidate",
        createThread: () => ({
          id: "failed-thread",
          async run() {
            throw new Error("fake runtime failure");
          },
        }),
      }),
    (error) => {
      assert.match(error.message, /fake runtime failure/u);
      const match = error.message.match(/Runtime workspace retained at (.+)$/u);
      assert.ok(match);
      retainedPath = match[1];
      return true;
    },
  );
  assert.equal(
    await fs
      .stat(retainedPath)
      .then(() => true)
      .catch(() => false),
    true,
  );
});
