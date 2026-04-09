#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { execSync } from "node:child_process";

const args = new Set(process.argv.slice(2));
const scanAll = args.has("--all");

const allowedDefaultExportFiles = new Set([
  "page.tsx",
  "layout.tsx",
  "error.tsx",
  "loading.tsx",
  "not-found.tsx",
  "template.tsx",
  "default.tsx",
  "route.ts",
  "route.tsx",
]);

const hookSignals = [
  /\buseState\s*\(/,
  /\buseEffect\s*\(/,
  /\buseMemo\s*\(/,
  /\buseCallback\s*\(/,
  /\buseRef\s*\(/,
  /\buseTransition\s*\(/,
  /\buseServerAction\s*\(/,
  /\buseTranslation\s*\(/,
  /\buseRouter\s*\(/,
];

const mustViolations = [];
const preferWarnings = [];

function sh(command) {
  return execSync(command, {
    encoding: "utf8",
    stdio: ["ignore", "pipe", "ignore"],
  }).trim();
}

function toPosix(filePath) {
  return filePath.split(path.sep).join("/");
}

function isTsFile(filePath) {
  return (
    (filePath.endsWith(".ts") || filePath.endsWith(".tsx")) &&
    !filePath.endsWith(".d.ts")
  );
}

function listAllTsFiles(rootDir) {
  const out = [];

  function walk(dir) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      if (
        entry.name === "node_modules" ||
        entry.name === ".git" ||
        entry.name === ".next"
      ) {
        continue;
      }

      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        walk(fullPath);
        continue;
      }

      if (isTsFile(fullPath)) {
        out.push(toPosix(path.relative(rootDir, fullPath)));
      }
    }
  }

  walk(rootDir);
  return out;
}

function listChangedFiles(rootDir) {
  const files = new Set();

  try {
    const staged = sh("git diff --name-only --cached");
    const unstaged = sh("git diff --name-only");
    const untracked = sh("git ls-files --others --exclude-standard");

    for (const block of [staged, unstaged, untracked]) {
      if (!block) continue;
      for (const line of block.split("\n")) {
        if (!line) continue;
        const candidate = toPosix(line.trim());
        if (
          isTsFile(candidate) &&
          fs.existsSync(path.join(rootDir, candidate))
        ) {
          files.add(candidate);
        }
      }
    }
  } catch {
    return [];
  }

  return [...files];
}

function addMust(file, rule, detail) {
  mustViolations.push({ file, rule, detail });
}

function addPrefer(file, rule, detail) {
  preferWarnings.push({ file, rule, detail });
}

function checkFile(rootDir, relativePath) {
  const absolutePath = path.join(rootDir, relativePath);
  const content = fs.readFileSync(absolutePath, "utf8");
  const baseName = path.basename(relativePath);

  if (
    /^\s*export\s+default\b/m.test(content) &&
    !allowedDefaultExportFiles.has(baseName)
  ) {
    addMust(
      relativePath,
      "default-export-scope",
      "Default export outside framework special file.",
    );
  }

  if (/from\s+["']\.\.\//.test(content)) {
    addMust(
      relativePath,
      "deep-relative-import",
      "Use configured alias (for example '@/') instead of '../'.",
    );
  }

  const usesHookSignal = hookSignals.some((signal) => signal.test(content));
  const firstNonEmpty = content
    .split("\n")
    .map((line) => line.trim())
    .find((line) => line.length > 0);

  if (
    usesHookSignal &&
    firstNonEmpty !== '"use client";' &&
    firstNonEmpty !== "'use client';"
  ) {
    addMust(
      relativePath,
      "client-directive",
      "Hook/state usage detected without top-level 'use client'.",
    );
  }

  if (
    /className\s*=\s*\{`[^`]*\$\{[^`]*`\}/.test(content) &&
    !/\bcn\s*\(/.test(content)
  ) {
    addPrefer(
      relativePath,
      "classname-merge",
      "Template-literal class merge detected; prefer cn()/utility helper.",
    );
  }

  if (/\b(Inter|Roboto|Arial)\b/.test(content)) {
    addPrefer(
      relativePath,
      "typography-defaults",
      "Default font family detected; prefer intentional typography choice.",
    );
  }
}

function printItems(items, label) {
  if (items.length === 0) {
    return;
  }

  console.log(`\n${label}:`);
  for (const item of items) {
    console.log(`- ${item.file} :: ${item.rule} :: ${item.detail}`);
  }
}

function main() {
  const rootDir = process.cwd();

  const targets = scanAll ? listAllTsFiles(rootDir) : listChangedFiles(rootDir);

  if (targets.length === 0) {
    console.log("No TypeScript targets found for verification.");
    process.exit(0);
  }

  for (const relativePath of targets) {
    checkFile(rootDir, relativePath);
  }

  console.log(`Scanned ${targets.length} TypeScript files.`);
  printItems(mustViolations, "Must violations");
  printItems(preferWarnings, "Prefer warnings");

  const summary = `\nResult: ${mustViolations.length} must, ${preferWarnings.length} prefer.`;
  console.log(summary);

  if (mustViolations.length > 0) {
    process.exit(1);
  }

  process.exit(0);
}

main();
