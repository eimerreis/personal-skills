# Tapio profile reference

Derived from the baseline codebase patterns in `tapio.SelfService/Source/Frontend/v2/app`.

## Must

1. Keep Next.js App Router conventions and route-local co-location patterns.
2. Preserve Tailwind v4 tokenized styling approach (`app/globals.css`, `app/style.css`, semantic utilities).
3. Prefer existing utility helpers (`cn`, `Guard`) and local hooks wrappers.
4. Respect i18n and navigation wrappers where present (`useTranslation`, `useRouter`).

## Prefer

1. Keep `@tapio/ui-react` wrapper components and variant mappings consistent.
2. Preserve existing form style in-place (RHF + Zod in current baseline) unless migration is requested.
3. For mutations:
   - If client-side API call is necessary, use TanStack Query mutation hooks.
   - Prefer next-safe-action patterns only when already adopted by the target repo.
   - Do not auto-introduce new action libraries without explicit migration request.
4. Use aggregate quality gate scripts when provided (for example `npm run can-i-pr`).

## Migration direction (non-blocking)

- Forward preference can evolve toward `next-safe-action` where practical.
- Existing `useServerAction` usage should remain stable unless migration is in scope.
