---
name: improve-codebase-architecture
description: Codebase health inspection. Scans Git hotspots and shallow modules to generate HTML review reports with Tailwind and Mermaid.
disable-model-invocation: true
---

# Codebase Architecture Inspection

Triggered via explicit `/improve-codebase-architecture`.

## Directives

1. **Scan Git Hotspots**: Execute `git log --oneline --name-only` to locate high-frequency modified files.
2. **Analyze Shallow Modules**: Identify shallow modules with large interfaces and frequent edits; evaluate hexagonal refactoring feasibility.
3. **Generate HTML Report**: Write review report to `.scratch/reports/architecture-report.html` per [HTML-REPORT.md](references/HTML-REPORT.md) and open automatically in browser.
