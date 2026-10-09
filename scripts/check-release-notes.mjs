#!/usr/bin/env node
/**
 * Проверяет, что версия описана согласованно: package.json ↔ верхняя запись CHANGELOG.md ↔ бейдж README.
 * Если передан git-ref базы (в CI — `HEAD^1`, вершина main для merge-коммита PR) и версия изменилась,
 * новая версия должна быть больше базовой. Отсутствие поднятия версии — не ошибка, только notice.
 */
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";

const [baseRef] = process.argv.slice(2);
const errors = [];

const readJsonVersion = (source) => JSON.parse(source).version;
const version = readJsonVersion(readFileSync("package.json", "utf8"));

const changelogVersion = readFileSync("CHANGELOG.md", "utf8").match(
  /^## .*?\[(\d+\.\d+\.\d+)\]/m
)?.[1];
if (changelogVersion !== version) {
  errors.push(
    `CHANGELOG.md: верхняя запись — [${changelogVersion ?? "нет"}], а в package.json — ${version}`
  );
}

const badgeVersion = readFileSync("README.md", "utf8").match(
  /badge\/version-(\d+\.\d+\.\d+)-/
)?.[1];
if (badgeVersion !== version) {
  errors.push(`README.md: бейдж версии — ${badgeVersion ?? "нет"}, а в package.json — ${version}`);
}

const compareSemver = (a, b) => {
  const [x, y] = [a, b].map((v) => v.split(".").map(Number));
  return x[0] - y[0] || x[1] - y[1] || x[2] - y[2];
};

if (baseRef) {
  const baseVersion = readJsonVersion(
    execFileSync("git", ["show", `${baseRef}:package.json`], { encoding: "utf8" })
  );
  if (baseVersion === version) {
    console.log(`::notice title=Версия не изменилась::package.json остаётся ${version}`);
  } else if (compareSemver(version, baseVersion) < 0) {
    errors.push(`package.json: версия ${version} меньше базовой ${baseVersion}`);
  } else {
    console.log(`Версия: ${baseVersion} → ${version}`);
  }
}

for (const message of errors) console.log(`::error title=Несогласованная версия::${message}`);
if (errors.length > 0) process.exit(1);
console.log(`✓ package.json, CHANGELOG.md и README.md согласованы (${version})`);
