import fs from "node:fs/promises";

import { EVAL_ROOT, assertWithin, resolveFromEval } from "../lib/project-paths.mjs";

export default class ReportFixtureProvider {
  constructor(options = {}) {
    this.config = options.config ?? options;
  }

  id() {
    return "skill-eval:report-fixture";
  }

  async callApi(prompt) {
    const reportPath = assertWithin(
      EVAL_ROOT,
      resolveFromEval(String(prompt).trim()),
      "report fixture path",
    );
    return { output: await fs.readFile(reportPath, "utf8") };
  }
}

