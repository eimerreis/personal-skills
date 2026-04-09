# Examples

## Trigger phrases

- "Conserve my frontend preferences while implementing this React feature."
- "Apply my React/TS defaults and keep style consistent with this repo."
- "Keep my coding style for TypeScript + React and avoid generic UI output."

## Expected behavior

### Example A: Existing RHF codebase

- Detect that the repo already uses `react-hook-form`.
- Keep RHF for local changes.
- Mention Conform as optional migration path only if requested.

### Example B: Repo with project gate script

- Find aggregate verification script (example: `can-i-pr`).
- Run it instead of ad hoc check selection.

### Example C: New UI component in unconstrained repo

- Apply `prefer` engineering defaults.
- Apply anti-generic aesthetic guidance.
- Keep accessibility and responsive behavior intact.
