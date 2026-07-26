# Wide Refactor Expand-Contract Method

Sequence breaking codebase-wide refactors into 3 ordered tickets:

1. **Ticket 1: Expand**
   Add new field/interface while keeping old field/interface (Zero compilation errors, CI PASS).
2. **Ticket 2: Migrate**
   Migrate call sites to new field/interface in batches (CI PASS).
3. **Ticket 3: Contract**
   Clean up unused old field/interface (CI PASS).
