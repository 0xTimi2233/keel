# Vertical Slice Rules

1. **Atomic Completeness**: Slice physical lower bound must be compilable, CI green, and CR passable upon ticket completion. Prohibit splitting atomic changes that break compilation.
2. **Independently Demoable & Verifiable**: Completed slice must be independently executable by integration or BDD tests.
3. **Avoid Premature Compression**: Slice size should fit cleanly within a single fresh session context.
