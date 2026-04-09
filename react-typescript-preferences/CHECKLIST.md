# Checklist

Use this checklist before handoff.

## 1) Baseline read

- [ ] Checked `package.json` and framework version.
- [ ] Checked TS, lint, and formatting config.
- [ ] Reviewed nearby files to confirm local patterns.

## 2) Implementation rules

- [ ] New/edited files follow repo architecture.
- [ ] No deep relative import chains when alias exists.
- [ ] Default exports used only for framework special files.
- [ ] Client hook usage is in `"use client"` files.

## 3) Preference defaults

- [ ] Applied `prefer` defaults only where repo is silent.
- [ ] Kept forms/actions pattern consistent with existing repo unless migration requested.
- [ ] Preserved frontend aesthetic intent without generic templates.

## 4) Verification

- [ ] Ran project gate script if available.
- [ ] Otherwise ran typecheck + lint + tests.
- [ ] Ran heuristic verifier (if present):

```bash
node react-typescript-preferences/scripts/verify-preferences.mjs
```
