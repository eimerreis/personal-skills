#!/usr/bin/env bash
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

KNOWN_SKILLS=(
  "react-typescript-preferences"
  "tapio-react-preferences"
)

SELECTED_SKILLS=()
INSTALL_ALL="false"
FORCE="false"
COPY_MODE="false"

usage() {
  cat <<'EOF'
Usage: install-opencode-skills.sh [options]

Options:
  --skill <name>   Install one skill (repeatable)
  --all            Install all known skills
  --force          Replace existing drifted installs
  --copy           Pass --copy to `skills add`
  -h, --help       Show this help

Defaults:
  - Installs core skill only: react-typescript-preferences
  - Uses symlink install mode
EOF
}

contains() {
  local needle="$1"
  shift
  for item in "$@"; do
    if [[ "$item" == "$needle" ]]; then
      return 0
    fi
  done
  return 1
}

realpath_safe() {
  python3 -c 'import os,sys; print(os.path.realpath(sys.argv[1]))' "$1"
}

get_installed_path() {
  local skill_name="$1"
  npx -y skills ls -g --json 2>/dev/null | node -e '
const fs = require("node:fs");
const input = fs.readFileSync(0, "utf8").trim();
if (!input) {
  process.exit(0);
}
const data = JSON.parse(input);
const name = process.argv[1];
const hit = data.find((entry) => entry && entry.name === name && entry.path);
if (hit) {
  process.stdout.write(hit.path);
}
' "$skill_name"
}

while [[ $# -gt 0 ]]; do
  case "$1" in
    --skill)
      if [[ $# -lt 2 ]]; then
        echo "Missing value for --skill"
        exit 1
      fi
      SELECTED_SKILLS+=("$2")
      shift 2
      ;;
    --all)
      INSTALL_ALL="true"
      shift
      ;;
    --force)
      FORCE="true"
      shift
      ;;
    --copy)
      COPY_MODE="true"
      shift
      ;;
    -h|--help)
      usage
      exit 0
      ;;
    *)
      echo "Unknown option: $1"
      usage
      exit 1
      ;;
  esac
done

if [[ "$INSTALL_ALL" == "true" ]]; then
  SELECTED_SKILLS=("${KNOWN_SKILLS[@]}")
elif [[ ${#SELECTED_SKILLS[@]} -eq 0 ]]; then
  SELECTED_SKILLS=("react-typescript-preferences")
fi

for skill in "${SELECTED_SKILLS[@]}"; do
  if ! contains "$skill" "${KNOWN_SKILLS[@]}"; then
    echo "Unknown skill: $skill"
    echo "Known skills: ${KNOWN_SKILLS[*]}"
    exit 1
  fi
done

for skill in "${SELECTED_SKILLS[@]}"; do
  source_path="${REPO_ROOT}/${skill}"

  if [[ ! -d "$source_path" ]]; then
    echo "Missing skill folder: $source_path"
    exit 1
  fi

  installed_path="$(get_installed_path "$skill")"

  if [[ -n "$installed_path" && -e "$installed_path" ]]; then
    source_real="$(realpath_safe "$source_path")"
    target_real="$(realpath_safe "$installed_path")"

    if [[ "$source_real" != "$target_real" ]]; then
      if [[ "$FORCE" != "true" ]]; then
        echo "Drift detected for '${skill}':"
        echo "  installed: $target_real"
        echo "  source:    $source_real"
        echo "Use --force to replace the existing install."
        exit 1
      fi

      npx -y skills remove -g -s "$skill" -y >/dev/null 2>&1 || true
    fi
  fi

  cmd=(npx -y skills add "$REPO_ROOT" -g -a opencode -s "$skill" -y)
  if [[ "$COPY_MODE" == "true" ]]; then
    cmd+=(--copy)
  fi

  echo "Installing ${skill} to OpenCode..."
  "${cmd[@]}"
done

echo "Done."
