/**
 * Auto-Import & Module Export Extractor
 */

export interface TaskFile {
  name?: string;
  filepath?: string;
  code?: string;
}

export interface TaskFileExportInfo {
  module: string;
  isDefault: boolean;
  filename: string;
}

export function getTaskFilesExports(
  files: TaskFile[] = [],
  currentFilepath = ""
): Record<string, TaskFileExportInfo> {
  const exportsMap: Record<string, TaskFileExportInfo> = {};
  if (!Array.isArray(files) || files.length === 0) return exportsMap;

  for (const file of files) {
    const filename = file.name || file.filepath;
    if (!filename || filename === currentFilepath || !file.code) continue;

    const modulePath = `./${filename.replace(/\.[^/.]+$/, "")}`;

    const defMatch = file.code.match(
      /export\s+default\s+(?:function\s+|class\s+|const\s+)?([a-zA-Z0-9_$]+)/
    );
    if (defMatch && defMatch[1]) {
      exportsMap[defMatch[1]] = {
        module: modulePath,
        isDefault: true,
        filename,
      };
    }

    const namedDeclRegex =
      /export\s+(?:const|let|var|function|class|type|interface|enum)\s+([a-zA-Z0-9_$]+)/g;
    let nm: RegExpExecArray | null;
    while ((nm = namedDeclRegex.exec(file.code)) !== null) {
      if (nm[1]) {
        exportsMap[nm[1]] = {
          module: modulePath,
          isDefault: false,
          filename,
        };
      }
    }

    const namedClauseRegex = /export\s*\{([^}]+)\}/g;
    let ncm: RegExpExecArray | null;
    while ((ncm = namedClauseRegex.exec(file.code)) !== null) {
      const items = ncm[1].split(",");
      for (const it of items) {
        const clean = it.trim();
        if (!clean) continue;
        const parts = clean.split(/\s+as\s+/);
        const exportedName = (parts[1] || parts[0]).trim();
        if (exportedName && /^[a-zA-Z0-9_$]+$/.test(exportedName)) {
          exportsMap[exportedName] = {
            module: modulePath,
            isDefault: false,
            filename,
          };
        }
      }
    }
  }

  return exportsMap;
}

export function addImportToFile(
  code: string,
  symbolName: string,
  moduleSpecifier = "react",
  isDefault = false
): { newCode: string; insertedLength: number; insertIndex: number } {
  if (!code && code !== "") return { newCode: code, insertedLength: 0, insertIndex: 0 };
  const cleanSym = symbolName.trim();
  if (!cleanSym) return { newCode: code, insertedLength: 0, insertIndex: 0 };

  const alreadyImportedRegex = new RegExp(`\\bimport\\s+[^;]*?\\b${cleanSym}\\b[^;]*?;?`, "m");
  if (alreadyImportedRegex.test(code)) {
    return { newCode: code, insertedLength: 0, insertIndex: 0 };
  }

  const escapedMod = moduleSpecifier.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const moduleImportRegex = new RegExp(
    `^(import\\s+(?:type\\s+)?(?:([a-zA-Z0-9_$]+)\\s*,?\\s*)?(?:\\{\\s*([^}]*?)\\s*\\})?\\s+from\\s+['"]${escapedMod}['"];?)`,
    "m"
  );
  const match = code.match(moduleImportRegex);

  if (match) {
    const fullImportLine = match[1];
    const existingDefault = match[2];
    const existingNamed = match[3];
    let newImportLine = fullImportLine;

    if (isDefault) {
      if (!existingDefault) {
        if (existingNamed) {
          newImportLine = `import ${cleanSym}, { ${existingNamed} } from '${moduleSpecifier}';`;
        } else {
          newImportLine = `import ${cleanSym} from '${moduleSpecifier}';`;
        }
      }
    } else {
      if (existingNamed) {
        const namedList = existingNamed
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean);
        if (!namedList.includes(cleanSym)) {
          namedList.push(cleanSym);
          const formatted = namedList.join(", ");
          if (existingDefault) {
            newImportLine = `import ${existingDefault}, { ${formatted} } from '${moduleSpecifier}';`;
          } else {
            newImportLine = `import { ${formatted} } from '${moduleSpecifier}';`;
          }
        }
      } else if (existingDefault) {
        newImportLine = `import ${existingDefault}, { ${cleanSym} } from '${moduleSpecifier}';`;
      }
    }

    if (newImportLine !== fullImportLine) {
      const newCode = code.replace(fullImportLine, newImportLine);
      const diff = newImportLine.length - fullImportLine.length;
      return { newCode, insertedLength: diff, insertIndex: match.index || 0 };
    }

    return { newCode: code, insertedLength: 0, insertIndex: 0 };
  }

  const statement = isDefault
    ? `import ${cleanSym} from '${moduleSpecifier}';\n`
    : `import { ${cleanSym} } from '${moduleSpecifier}';\n`;

  const lines = code.split("\n");
  let lastImportLineIdx = -1;

  for (let i = 0; i < lines.length; i++) {
    if (/^\s*import\b/.test(lines[i])) {
      lastImportLineIdx = i;
    }
  }

  if (lastImportLineIdx !== -1) {
    lines.splice(lastImportLineIdx + 1, 0, statement.trim());
    const newCode = lines.join("\n");
    return { newCode, insertedLength: statement.length, insertIndex: 0 };
  }

  let insertLineIdx = 0;
  while (
    insertLineIdx < lines.length &&
    (lines[insertLineIdx].trim().startsWith("//") ||
      lines[insertLineIdx].trim().startsWith("/*") ||
      lines[insertLineIdx].trim().startsWith("*"))
  ) {
    insertLineIdx++;
  }

  lines.splice(insertLineIdx, 0, statement.trim());
  const newCode = lines.join("\n");
  return { newCode, insertedLength: statement.length, insertIndex: 0 };
}

export function getWordAtPosition(text: string, position: number): string {
  if (!text || typeof text !== "string" || position < 0 || position > text.length) return "";
  let start = position;
  let end = position;

  if (start > 0 && !/[a-zA-Z0-9_$]/.test(text[start]) && /[a-zA-Z0-9_$]/.test(text[start - 1])) {
    start--;
    end--;
  }

  while (start > 0 && /[a-zA-Z0-9_$]/.test(text[start - 1])) {
    start--;
  }
  while (end < text.length && /[a-zA-Z0-9_$]/.test(text[end])) {
    end++;
  }
  return text.substring(start, end);
}

export function findDefinition(
  symbol: string,
  currentCode = "",
  taskFiles: TaskFile[] = [],
  currentFilepath = ""
):
  | { type: "file"; fileIndex: number; filename: string }
  | { type: "local"; line: number; col: number }
  | null {
  if (!symbol || typeof symbol !== "string") return null;
  const cleanSym = symbol.trim();
  if (!cleanSym) return null;

  if (Array.isArray(taskFiles) && taskFiles.length > 0) {
    for (let i = 0; i < taskFiles.length; i++) {
      const file = taskFiles[i];
      if (!file || file.name === currentFilepath || file.filepath === currentFilepath) continue;

      const baseFilename = (file.name || file.filepath || "").replace(/\.[^/.]+$/, "");
      if (baseFilename.toLowerCase() === cleanSym.toLowerCase()) {
        return { type: "file", fileIndex: i, filename: file.name || file.filepath || "" };
      }

      if (file.code) {
        const hasExport =
          new RegExp(
            `export\\s+default\\s+(?:function\\s+|class\\s+|const\\s+)?\\b${cleanSym}\\b`
          ).test(file.code) ||
          new RegExp(
            `export\\s+(?:const|let|var|function|class|type|interface|enum)\\s+\\b${cleanSym}\\b`
          ).test(file.code) ||
          new RegExp(`export\\s*\\{[^}]*\\b${cleanSym}\\b[^}]*\\}`).test(file.code);

        if (hasExport) {
          return { type: "file", fileIndex: i, filename: file.name || file.filepath || "" };
        }
      }
    }
  }

  if (currentCode) {
    const lines = currentCode.split("\n");
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const patterns = [
        new RegExp(
          `\\b(?:const|let|var)\\s+(?:\\{[^}]*\\b${cleanSym}\\b[^}]*\\}|\\[[^\\]]*\\b${cleanSym}\\b[^\\]]*\\}|\\b${cleanSym}\\b)`
        ),
        new RegExp(`\\bfunction\\s*\\*?\\s*\\b${cleanSym}\\b`),
        new RegExp(`\\bclass\\s+\\b${cleanSym}\\b`),
        new RegExp(`\\b(?:type|interface|enum)\\s+\\b${cleanSym}\\b`),
      ];

      for (const pat of patterns) {
        const m = line.match(pat);
        if (m) {
          return { type: "local", line: i + 1, col: (m.index || 0) + 1 };
        }
      }
    }
  }

  return null;
}
