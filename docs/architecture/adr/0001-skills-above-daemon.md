# Skills are the upper layer; daemon is lower infrastructure

Skills contain all workflow logic (what to do, when, with what prompt). The daemon is the core engine managing dev agent task lifecycles: spawn, heartbeat, session reuse, and completion orchestration (e.g. triggering PR flow). However, it carries no knowledge of workflow semantics, issue decomposition, or GitHub issue structure — those belong to skills.

We considered three alternatives: (A) skills call daemon, (B) daemon orchestrates skills, (C) fully independent. We chose A because putting workflow intelligence in the daemon would duplicate logic that already lives in skills, and would make the daemon hard to test without a full GitHub environment. Keeping workflow logic in skills and lifecycle management in the daemon gives a clean separation: skills are declarative and testable as documents, daemon is imperative and testable as a process manager.
