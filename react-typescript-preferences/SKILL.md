---
name: react-typescript-preferences
description: Conserves frontend engineering preferences for TypeScript + React work using tiered must/prefer/never rules and repo-first adaptation. Use when user says "conserve my frontend preferences", "apply my React/TS defaults", "keep my coding style", or asks for TypeScript + React implementation decisions.
---

# React TypeScript Preferences

Use this skill to keep implementation decisions consistent with personal frontend preferences while respecting each repository first.

## Quick start

1. Detect repository conventions before coding.
2. Apply rules in this priority:
   - repository constraints
   - `must`
   - `prefer`
   - `never`
3. Verify with project gate script when available (for example `can-i-pr`), otherwise run typecheck/lint/test.
4. Run the heuristic verifier if available:

```bash
node react-typescript-preferences/scripts/verify-preferences.mjs
```

## Policy

- `must`: hard requirements for safety and structural consistency.
- `prefer`: defaults when there is no stronger local convention.
- `never`: anti-patterns to avoid unless explicitly requested.

## Workflows

### 1) Start of task

- Identify framework/runtime assumptions from `package.json`, TS config, lint config, and existing nearby files.
- Confirm whether the repo already uses patterns like `next-safe-action`, `react-hook-form`, or custom wrappers.
- Keep changes aligned with existing architecture unless migration is explicitly requested.

### 2) During implementation

- Preserve repository style for imports, file placement, exports, and component boundaries.
- For new decisions with no local standard, use this skill's `prefer` defaults.
- If preferences conflict with established code, choose repository-first and note tradeoffs.

### 3) Before handoff

- Run validation commands.
- Call out any intentional deviations from `must` or `prefer`.
- Suggest migration follow-ups only when they are low-risk and requested.

## References

- Detailed rules: [REFERENCE.md](REFERENCE.md)
- Execution checklist: [CHECKLIST.md](CHECKLIST.md)
- Prompt and behavior examples: [EXAMPLES.md](EXAMPLES.md)
