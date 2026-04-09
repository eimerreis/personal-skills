---
name: tapio-react-preferences
description: Extends React and TypeScript preference preservation with tapio-specific frontend conventions. Use when a repository contains @tapio/ui-react or @tapio/tailwind, or when user asks for tapio-style implementation details.
---

# Tapio React Preferences

Use this extension with `react-typescript-preferences` for tapio repositories.

## Quick start

1. Load `react-typescript-preferences` first. If not loaded, load it now.
2. Detect tapio markers in `package.json`:
   - `@tapio/ui-react`
   - `@tapio/tailwind`
3. Apply tapio profile constraints from [REFERENCE.md](REFERENCE.md).

## Policy

- Repository-first still applies.
- This skill narrows defaults to fit tapio stack patterns.
- Treat migration notes as optional unless migration is explicitly requested.
