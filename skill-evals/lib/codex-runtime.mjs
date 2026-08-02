import { Codex } from "@openai/codex-sdk";

const ALLOWED_REASONING = new Set(["minimal", "low", "medium", "high", "xhigh"]);
const PASSTHROUGH_ENV = [
  "CODEX_HOME",
  "HOME",
  "LANG",
  "LC_ALL",
  "LOGNAME",
  "NO_PROXY",
  "PATH",
  "SHELL",
  "SSL_CERT_DIR",
  "SSL_CERT_FILE",
  "TERM",
  "TMPDIR",
  "USER",
  "XDG_CACHE_HOME",
  "XDG_CONFIG_HOME",
  "XDG_DATA_HOME",
  "http_proxy",
  "https_proxy",
  "no_proxy",
  "HTTP_PROXY",
  "HTTPS_PROXY",
];

function nonEmpty(value) {
  return typeof value === "string" && value.trim() !== "" ? value.trim() : undefined;
}

export function codexEnvironment(source = process.env) {
  const environment = {};
  for (const key of PASSTHROUGH_ENV) {
    if (typeof source[key] === "string") {
      environment[key] = source[key];
    }
  }
  return environment;
}

export function resolveRuntimeOptions(config = {}, environment = process.env) {
  const reasoning =
    nonEmpty(config.reasoning) ??
    nonEmpty(environment.CODEX_EVAL_REASONING) ??
    "medium";
  if (!ALLOWED_REASONING.has(reasoning)) {
    throw new Error(
      `CODEX eval reasoning must be one of ${[...ALLOWED_REASONING].join(", ")}; received ${reasoning}`,
    );
  }

  return {
    model:
      nonEmpty(config.model) ??
      nonEmpty(environment.CODEX_EVAL_MODEL) ??
      "gpt-5.6-sol",
    reasoning,
  };
}

export function createCodexThreadFactory(config = {}) {
  const runtime = resolveRuntimeOptions(config);
  const codex = new Codex({
    ...(nonEmpty(process.env.CODEX_EVAL_CODEX_PATH)
      ? { codexPathOverride: process.env.CODEX_EVAL_CODEX_PATH }
      : {}),
    ...(nonEmpty(process.env.OPENAI_BASE_URL)
      ? { baseUrl: process.env.OPENAI_BASE_URL }
      : {}),
    ...(nonEmpty(process.env.OPENAI_API_KEY)
      ? { apiKey: process.env.OPENAI_API_KEY }
      : {}),
    env: codexEnvironment(),
  });

  return ({ workspaceRoot, sandboxMode }) =>
    codex.startThread({
      model: runtime.model,
      modelReasoningEffort: runtime.reasoning,
      workingDirectory: workspaceRoot,
      skipGitRepoCheck: false,
      sandboxMode,
      approvalPolicy: "never",
      networkAccessEnabled: false,
      webSearchMode: "disabled",
    });
}

