---
name: diagnosing-bugs
description: Use when encountering broken tests, crashes, or unhandled errors to isolate root cause without patching symptoms.
---

# Deep Bug Diagnosis

Triggered upon test failures, runtime crashes, or unexpected behavior.

## Directives

- **Un-truncated Log Analysis**: Read full, un-truncated error logs and stack traces before formulating hypotheses.
- **Root-Cause Isolation**: Trace upstream data providers; prohibit symptom patching (silent try/catch, dummy fallbacks).
- **Minimal Reproduction Test**: Write failing reproduction test (Red) before fixing; verify test passes (Green) after fix.
