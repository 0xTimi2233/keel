import { spawn } from "node:child_process";
import fs from "node:fs/promises";
import path from "node:path";

import { EVAL_ROOT } from "../lib/project-paths.mjs";

const stateDirectory = path.join(EVAL_ROOT, ".state");
const cacheDirectory = path.join(EVAL_ROOT, ".cache");
const logDirectory = path.join(EVAL_ROOT, ".logs");
await Promise.all(
  [stateDirectory, cacheDirectory, logDirectory, path.join(EVAL_ROOT, "results")].map(
    (directory) => fs.mkdir(directory, { recursive: true }),
  ),
);

const entrypoint = path.join(
  EVAL_ROOT,
  "node_modules",
  "promptfoo",
  "dist",
  "src",
  "entrypoint.js",
);

const child = spawn(process.execPath, [entrypoint, ...process.argv.slice(2)], {
  cwd: EVAL_ROOT,
  stdio: "inherit",
  env: {
    ...process.env,
    PROMPTFOO_CONFIG_DIR: stateDirectory,
    PROMPTFOO_CACHE_PATH: cacheDirectory,
    PROMPTFOO_LOG_DIR: logDirectory,
    PROMPTFOO_DISABLE_TELEMETRY: "1",
    PROMPTFOO_DISABLE_UPDATE: "1",
  },
});

child.on("error", (error) => {
  console.error(error);
  process.exitCode = 1;
});
child.on("exit", (code, signal) => {
  if (signal) {
    console.error(`promptfoo terminated by ${signal}`);
    process.exitCode = 1;
  } else {
    process.exitCode = code ?? 1;
  }
});

