# Reference

This skill is repository-first. It preserves preferences without forcing style drift in mature codebases.

## Must

Apply as hard requirements for new and edited files.

1. Respect framework architecture in the repo (for Next.js, App Router conventions and special files).
2. Keep TypeScript strictness aligned with repo config; do not weaken strict checks.
3. Use path aliases expected by the repo (`@/` when configured) and avoid deep relative import chains.
4. Use default exports only where framework conventions require them (for Next.js special files).
5. Ensure client-only hooks and state live in client components (`"use client"` first line when required).

## Prefer

Use these when repo conventions do not already define a different pattern.

### Engineering defaults

- Prefer `type` over `interface` unless declaration merging is needed.
- Use `import type` for type-only imports.
- Keep components functional and explicit about props.
- Prefer named exports for reusable components and utilities.
- Prefer project-level gate scripts (example: `can-i-pr`) over ad hoc command selection.

### Forms and validation

- Forward default: `Conform + Zod` for new systems.
- If a repo already uses another form stack heavily, preserve local consistency unless migration is requested.

### Mutations and actions

- Prefer `next-safe-action` where the repo already supports it.
- For true client-side API calls, use TanStack Query mutation hooks.
- Do not auto-introduce `next-safe-action` into repos that do not use it unless explicitly requested.

### Styling and UI taste

- Preserve design intent and avoid generic output.
- Avoid default typography stacks such as Inter, Roboto, Arial, and unnamed system-only choices.
- Avoid purple-on-white cliches and generic glowing dark themes.
- Use purposeful color systems, meaningful motion, and layered backgrounds.
- Prefer semantic tokens/utilities over one-off hardcoded color values.

## Never

- Never override established repository architecture for personal preference alone.
- Never introduce new dependencies only to satisfy style taste unless asked.
- Never bypass accessibility and responsiveness checks for visual polish.
- Never enforce full-repo rewrites when the task scope is local.

## Conflict resolution

Use this order:

1. Correctness and security
2. Repository conventions
3. Skill `must`
4. Skill `prefer`
5. Personal taste details
