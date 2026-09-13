#!/usr/bin/env node
/**
 * Считает размеры production-сборки (dist/) по типам файлов: raw и gzip.
 * Результат печатается в stdout и сохраняется в bundle-report.md
 * (файл используется CI для комментария в PR).
 */
import { readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { gzipSync } from "node:zlib";
import path from "node:path";

const DIST_DIR = path.resolve(process.cwd(), "dist");
const REPORT_FILE = path.resolve(process.cwd(), "bundle-report.md");

const TYPE_LABELS = {
  ".js": "JavaScript",
  ".css": "CSS",
  ".html": "HTML",
  ".svg": "SVG",
  ".woff2": "Fonts (woff2)",
  ".woff": "Fonts (woff)",
  ".png": "Images (png)",
  ".jpg": "Images (jpg)",
  ".webp": "Images (webp)",
  ".json": "JSON",
  ".txt": "Text",
};

function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

function* walk(dir) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(full);
    else yield full;
  }
}

const groups = new Map();
let totalRaw = 0;
let totalGzip = 0;
let fileCount = 0;

for (const filePath of walk(DIST_DIR)) {
  // Sourcemaps не отгружаются пользователям и размывают картину веса бандла
  if (filePath.endsWith(".map")) continue;
  const raw = statSync(filePath).size;
  const gzip = gzipSync(readFileSync(filePath)).length;
  const ext = path.extname(filePath).toLowerCase();
  const label = TYPE_LABELS[ext] ?? `Other (${ext || "no ext"})`;

  const group = groups.get(label) ?? { files: 0, raw: 0, gzip: 0 };
  group.files += 1;
  group.raw += raw;
  group.gzip += gzip;
  groups.set(label, group);

  totalRaw += raw;
  totalGzip += gzip;
  fileCount += 1;
}

const sorted = [...groups.entries()].sort((a, b) => b[1].raw - a[1].raw);

const rows = sorted
  .map(([label, g]) => `| ${label} | ${g.files} | ${formatBytes(g.raw)} | ${formatBytes(g.gzip)} |`)
  .join("\n");

const report = [
  "## 📦 Размер бандла (dist/)",
  "",
  "| Категория | Файлов | Raw | Gzip |",
  "| --- | ---: | ---: | ---: |",
  rows,
  `| **Итого** | **${fileCount}** | **${formatBytes(totalRaw)}** | **${formatBytes(totalGzip)}** |`,
  "",
  `<sub>Собрано из ${DIST_DIR} · gzip без сжатия словаря</sub>`,
  "",
].join("\n");

writeFileSync(REPORT_FILE, report);
console.log(report);
