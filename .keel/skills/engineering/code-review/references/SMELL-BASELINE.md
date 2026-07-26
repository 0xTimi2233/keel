# Fowler Code Smells Baseline

1. **Mysterious Name** — Name fails to reveal intent. -> Rename.
2. **Duplicated Code** — Same logic shape in multiple places. -> Extract shared function.
3. **Feature Envy** — Method reaches into another object's data. -> Move method onto target data.
4. **Data Clumps** — Primitive fields travelling together. -> Bundle into domain type.
5. **Primitive Obsession** — Primitive type representing domain concept. -> Extract Newtype.
6. **Repeated Switches** — Same switch/if cascade across places. -> Replace with polymorphism or map.
7. **Shotgun Surgery** — One change forces edits across scattered files. -> Gather into single module.
8. **Speculative Generality** — Abstractions for non-existent needs. -> Delete redundant code.
9. **Message Chains** — Navigating `a.b().c().d()`. -> Hide navigation behind method.
10. **Middle Man** — Class delegating most work onward. -> Call real target directly.
