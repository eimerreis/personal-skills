# personal-skills

Personal AI skills for TypeScript + React work, published as a reusable `skills` source.

## Skills in this repo

- `react-typescript-preferences`: portable core defaults for React + TypeScript.
- `tapio-react-preferences`: tapio-specific extension profile.

## Install (OpenCode, global)

One-command bootstrap (core default, optional tapio via extra `-s`):

```bash
npx -y skills add eimerreis/personal-skills -g -a opencode -s react-typescript-preferences -y
```

Optional extension in the same install call:

```bash
npx -y skills add eimerreis/personal-skills -g -a opencode -s react-typescript-preferences -s tapio-react-preferences -y
```

Default (core skill only):

```bash
npx -y skills add eimerreis/personal-skills -g -a opencode -s react-typescript-preferences -y
```

Optional tapio extension:

```bash
npx -y skills add eimerreis/personal-skills -g -a opencode -s tapio-react-preferences -y
```

Install both:

```bash
npx -y skills add eimerreis/personal-skills -g -a opencode --all
```

By default this uses symlinks. For copy-based snapshots, add `--copy`.

Note: current `skills` agent routing may still resolve to shared/global skill directories.
Use `npx -y skills ls -g --json` to verify final installed paths.

## Local development and sync

When editing this repo locally, use the sync helper:

```bash
./scripts/install-opencode-skills.sh
```

Install all local skills:

```bash
./scripts/install-opencode-skills.sh --all
```

Install selected skills:

```bash
./scripts/install-opencode-skills.sh --skill react-typescript-preferences --skill tapio-react-preferences
```

If local OpenCode skill folders drift from this repo, the script fails by default.
Use `--force` to replace existing installs.

## Validate preferences (core skill)

Changed files only:

```bash
node react-typescript-preferences/scripts/verify-preferences.mjs
```

Full repository scan:

```bash
node react-typescript-preferences/scripts/verify-preferences.mjs --all
```

`must` violations return exit code `1`; `prefer` issues are warnings.

## Versioning

- Repository-level semver tags (`v0.x` while evolving quickly).
- Changelog maintained in `CHANGELOG.md`.

## License

MIT.
