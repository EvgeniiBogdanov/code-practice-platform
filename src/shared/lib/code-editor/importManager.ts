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

const escapeRegExp = (value: string): string => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/** `import a, { b } from "m";` and side-effect `import "m";`, also across lines. */
const IMPORT_STATEMENT = /^import\s+(type\s+)?(?:([^'";]*?)\s*from\s*)?(['"])([^'"\n]+)\3(;?)/gm;

interface ImportStatement {
  start: number;
  end: number;
  typeOnly: boolean;
  defaultName: string;
  named: string[];
  namespace: boolean;
  quote: string;
  module: string;
  semicolon: string;
}

const parseImports = (code: string): ImportStatement[] =>
  [...code.matchAll(IMPORT_STATEMENT)].map((match) => {
    const clause = match[2] ?? "";
    const braces = /\{([^}]*)\}/.exec(clause)?.[1] ?? "";
    const rest = clause
      .replace(/\{[^}]*\}/, "")
      .replace(/,/g, " ")
      .trim();
    return {
      start: match.index,
      end: match.index + match[0].length,
      typeOnly: Boolean(match[1]),
      defaultName: rest.startsWith("*") ? "" : rest,
      named: braces
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
      namespace: rest.startsWith("*"),
      quote: match[3],
      module: match[4],
      semicolon: match[5],
    };
  });

const isImported = (statement: ImportStatement, symbol: string): boolean =>
  statement.defaultName === symbol ||
  new RegExp(`\\*\\s+as\\s+${escapeRegExp(symbol)}$`).test(statement.defaultName) ||
  statement.named.some((item) => (item.split(/\s+as\s+/).pop() ?? item) === symbol);

const formatImport = (
  statement: Pick<ImportStatement, "defaultName" | "named" | "quote" | "module" | "semicolon">
): string => {
  const clause = [
    statement.defaultName,
    statement.named.length ? `{ ${statement.named.join(", ")} }` : "",
  ]
    .filter(Boolean)
    .join(", ");
  return `import ${clause} from ${statement.quote}${statement.module}${statement.quote}${statement.semicolon}`;
};

export function addImportToFile(
  code: string,
  symbolName: string,
  moduleSpecifier = "react",
  isDefault = false
): { newCode: string; insertedLength: number; insertIndex: number } {
  const unchanged = { newCode: code, insertedLength: 0, insertIndex: 0 };
  const symbol = symbolName.trim();
  if (!symbol) return unchanged;

  const imports = parseImports(code);
  if (imports.some((statement) => isImported(statement, symbol))) return unchanged;

  // A value cannot join a type-only import, and `* as ns` cannot be combined with braces.
  const target = imports.find(
    (statement) =>
      statement.module === moduleSpecifier && !statement.typeOnly && !statement.namespace
  );
  if (target && (isDefault ? !target.defaultName : true)) {
    const updated = formatImport({
      ...target,
      defaultName: isDefault ? symbol : target.defaultName,
      named: isDefault ? target.named : [...target.named, symbol],
    });
    return {
      newCode: code.slice(0, target.start) + updated + code.slice(target.end),
      insertedLength: updated.length - (target.end - target.start),
      insertIndex: target.start,
    };
  }

  // PREFERENCES.quotePreference is "double"; an existing import sets the file's style.
  const style = imports.at(-1) ?? { quote: '"', semicolon: ";" };
  const statement = formatImport({
    defaultName: isDefault ? symbol : "",
    named: isDefault ? [] : [symbol],
    module: moduleSpecifier,
    quote: style.quote,
    semicolon: style.semicolon,
  });

  const lastImport = imports.at(-1);
  if (lastImport) {
    return {
      newCode: `${code.slice(0, lastImport.end)}\n${statement}${code.slice(lastImport.end)}`,
      insertedLength: statement.length + 1,
      insertIndex: lastImport.end,
    };
  }

  const lines = code.split("\n");
  let insertLine = 0;
  while (insertLine < lines.length && /^\s*(?:\/\/|\/\*|\*)/.test(lines[insertLine])) {
    insertLine++;
  }
  const insertIndex = lines
    .slice(0, insertLine)
    .reduce((total, line) => total + line.length + 1, 0);
  return {
    newCode: `${code.slice(0, insertIndex)}${statement}\n${code.slice(insertIndex)}`,
    insertedLength: statement.length + 1,
    insertIndex,
  };
}
