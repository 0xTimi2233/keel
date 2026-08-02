import { evaluateReport } from "../lib/evaluate.mjs";

export default function scenarioContract(output) {
  try {
    const report = JSON.parse(output);
    return evaluateReport(report);
  } catch (error) {
    return {
      pass: false,
      score: 0,
      reason:
        error instanceof Error
          ? `无法评分 skill-eval 报告：${error.message}`
          : `无法评分 skill-eval 报告：${String(error)}`,
    };
  }
}

