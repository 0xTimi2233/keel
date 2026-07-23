# Two-layer skill architecture: orchestration and execution

Skills are split into two layers consumed by different agents. Orchestration skills are consumed by the Main Agent and cover scheduling, issue decomposition, dependency ordering, and agent lifecycle decisions. Execution skills are consumed by Dev Agents inside sandboxes and cover TDD cycles, code standards, PR submission, and implementation patterns.

We considered: (A) one skill per role, (B) one skill per workflow step, (C) only Main Agent consumes skills, (D) two layers. We chose D because the two consumers (Main Agent vs Dev Agent) have fundamentally different concerns — scheduling vs implementation — and mixing them produces skills that are too long and conflate orchestration logic with coding discipline. A Dev Agent doesn't need to know about issue dependency graphs; a Main Agent doesn't need to know about TDD inner loops.
