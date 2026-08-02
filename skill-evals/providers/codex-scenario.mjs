import { loadScenario } from "../lib/scenario.mjs";
import { runScenario } from "../lib/run-scenario.mjs";

export default class CodexScenarioProvider {
  constructor(options = {}) {
    this.config = options.config ?? options;
    this.variant = this.config.variant ?? "candidate";
  }

  id() {
    return `codex-skill-eval:${this.variant}`;
  }

  async callApi(prompt) {
    try {
      const scenario = await loadScenario(String(prompt).trim());
      const excludedSkills = new Set(this.config.excludedSkills ?? []);
      if (this.variant === "no-skill") {
        for (const name of scenario.targetSkills) {
          excludedSkills.add(name);
        }
      }
      const report = await runScenario({
        scenario,
        variant: this.variant,
        skillSource: this.config.skillSource,
        excludedSkills: [...excludedSkills],
        runtimeConfig: {
          model: this.config.model,
          reasoning: this.config.reasoning,
        },
      });
      return {
        output: JSON.stringify(report),
        tokenUsage: {
          total:
            (report.usage.input_tokens ?? 0) +
            (report.usage.output_tokens ?? 0),
          prompt: report.usage.input_tokens ?? 0,
          completion: report.usage.output_tokens ?? 0,
          cached: report.usage.cached_input_tokens ?? 0,
        },
        metadata: {
          scenarioId: scenario.id,
          variant: this.variant,
          workspace: report.workspace,
        },
      };
    } catch (error) {
      return {
        error: error instanceof Error ? error.stack ?? error.message : String(error),
      };
    }
  }
}
