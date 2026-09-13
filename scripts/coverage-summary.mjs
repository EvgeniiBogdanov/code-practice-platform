#!/usr/bin/env node
/**
 * Формирует markdown-сводку покрытия тестами из coverage/coverage-summary.json
 * (генерируется vitest c reporter "json-summary"). Вывод идёт в stdout —
 * в CI направляется в $GITHUB_STEP_SUMMARY.
 */
import { readFile } from "node:fs/promises";
import path from "node:path";

const SUMMARY_FILE = path.resolve(process.cwd(), "coverage", "coverage-summary.json");

let summary;
try {
  summary = JSON.parse(await readFile(SUMMARY_FILE, "utf8"));
} catch {
  console.log("> ⚠️ Файл coverage-summary.json не найден — покрытие не собрано.");
  process.exit(0);
}

const { total } = summary;
if (!total) {
  console.log("> ⚠️ В coverage-summary.json нет итоговых метрик.");
  process.exit(0);
}

const pct = (v) => `${Number(v.pct).toFixed(1)}%`;

console.log("## 📊 Покрытие тестами");
console.log("");
console.log("| Statements | Branches | Functions | Lines |");
console.log("| ---: | ---: | ---: | ---: |");
console.log(
  `| ${pct(total.statements)} | ${pct(total.branches)} | ${pct(total.functions)} | ${pct(total.lines)} |`
);
console.log("");
