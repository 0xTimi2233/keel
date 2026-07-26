# Issue Tracker Configuration

## 1. Canonical Label Set

- `bug` — Defect or failure
- `enhancement` — Feature request or improvement
- `needs-triage` — Evaluation in progress
- `needs-info` — Missing info, awaiting reporter response
- `ready-for-agent` — Fully specified, ready for AFK agent execution
- `ready-for-human` — Requires human judgment/implementation
- `wontfix` — Rejected, duplicate, or out of scope

## 2. CI Integration

- All Sub-issues tagged `ready-for-agent` trigger Fast Loop CI upon branch PR submission.
