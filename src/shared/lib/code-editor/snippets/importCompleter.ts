import { fuzzyMatch } from "../fuzzyMatcher";
import { getTaskFilesExports, TaskFile } from "../importManager";
import { KNOWN_MODULES, CompletionItem } from "../snippetsData";

export function getImportCompletions(
  fullCode: string,
  cursorIndex: number,
  currentLineBeforeCursor: string,
  lineAfterCursor: string,
  lineStart: number,
  lineEnd: number,
  fullCurrentLine: string,
  files: TaskFile[],
  currentFilepath: string
): { word: string; items: CompletionItem[] } | null {
  const fromMatch = currentLineBeforeCursor.match(/from\s*(['"]?)([a-zA-Z0-9_@/.-]*)$/);
  if (fromMatch && currentLineBeforeCursor.includes("from")) {
    const hasQuote = Boolean(fromMatch[1]);
    const quoteChar = fromMatch[1] || "'";
    const query = fromMatch[2] || "";

    const afterMatch = lineAfterCursor.match(/^([a-zA-Z0-9_@/.-]*)(\s*['"]?)(\s*;?)/);
    const afterTotalLen = afterMatch ? afterMatch[0].length : 0;

    const replaceStart = cursorIndex - query.length;
    const replaceEnd = cursorIndex + afterTotalLen;
    const quoteToUse = hasQuote ? quoteChar : "'";
    const insertSuffix = `${quoteToUse};`;

    const moduleCandidates: CompletionItem[] = Object.keys(KNOWN_MODULES).map((mod) => ({
      prefix: mod,
      label: `'${mod}'`,
      detail: `Модуль библиотеки`,
      kind: "module",
      insertText: hasQuote ? `${mod}${insertSuffix}` : `'${mod}${insertSuffix}`,
      replaceStart,
      replaceEnd,
      cursorOffset: (hasQuote ? `${mod}${insertSuffix}` : `'${mod}${insertSuffix}`).length,
    }));

    if (Array.isArray(files)) {
      files.forEach((f) => {
        if (f.name !== currentFilepath) {
          const rel = `./${f.name?.replace(/\.[^/.]+$/, "")}`;
          moduleCandidates.push({
            prefix: rel,
            label: `'${rel}'`,
            detail: `Локальный файл: ${f.name}`,
            kind: "module",
            insertText: hasQuote ? `${rel}${insertSuffix}` : `'${rel}${insertSuffix}`,
            replaceStart,
            replaceEnd,
            cursorOffset: (hasQuote ? `${rel}${insertSuffix}` : `'${rel}${insertSuffix}`).length,
          });
        }
      });
    }

    const scoredModules: CompletionItem[] = [];
    for (const modItem of moduleCandidates) {
      const { match, score } = fuzzyMatch(modItem.prefix, query);
      if (match || !query) {
        scoredModules.push({ ...modItem, score });
      }
    }

    scoredModules.sort((a, b) => (b.score || 0) - (a.score || 0));

    return {
      word: query || "from",
      items: scoredModules.slice(0, 10),
    };
  }

  const inBracesMatch = currentLineBeforeCursor.match(/^import\s+(type\s+)?\{\s*([^}]*?)$/);
  if (inBracesMatch) {
    const isType = Boolean(inBracesMatch[1]);
    const typePrefix = isType ? "type " : "";
    const insideText = inBracesMatch[2];
    const parts = insideText.split(",");
    const currentPart = parts[parts.length - 1].trim();
    const alreadyImported = parts
      .slice(0, -1)
      .map((s) => s.trim())
      .filter(Boolean);

    const hasFromClause = /from\s+['"]([^'"]+)['"]/.exec(fullCurrentLine);
    const targetModuleName = hasFromClause ? hasFromClause[1] : null;

    const afterIdentMatch = lineAfterCursor.match(/^[a-zA-Z0-9_$]*/);
    const afterIdentLen = afterIdentMatch ? afterIdentMatch[0].length : 0;

    const suggestions: CompletionItem[] = [];

    const addNamedExports = (modName: string, modInfo: { named?: string[] }) => {
      if (!modInfo || !modInfo.named) return;
      for (const sym of modInfo.named) {
        if (alreadyImported.includes(sym)) continue;
        const { match, score } = fuzzyMatch(sym, currentPart);
        if (match || !currentPart) {
          let insertStr: string;
          let repStart: number;
          let repEnd: number;
          let cOffset: number | undefined;

          if (hasFromClause) {
            insertStr = sym;
            repStart = cursorIndex - currentPart.length;
            repEnd = cursorIndex + afterIdentLen;
            cOffset = currentPart.length > 0 ? sym.length : undefined;
          } else {
            const allSyms = [...alreadyImported, sym].join(", ");
            insertStr = `import ${typePrefix}{ ${allSyms} } from '${modName}';`;
            repStart = lineStart;
            repEnd = lineEnd === -1 ? fullCode.length : lineEnd;
            cOffset = `import ${typePrefix}{ ${allSyms}`.length;
          }

          suggestions.push({
            prefix: sym,
            label: hasFromClause
              ? sym
              : `{ ${[...alreadyImported, sym].join(", ")} } from '${modName}';`,
            detail: `from '${modName}'`,
            kind: sym.startsWith("use") ? "hook" : "import",
            insertText: insertStr,
            replaceStart: repStart,
            replaceEnd: repEnd,
            cursorOffset: cOffset,
            score,
          });
        }
      }
    };

    if (targetModuleName && KNOWN_MODULES[targetModuleName]) {
      addNamedExports(targetModuleName, KNOWN_MODULES[targetModuleName]);
    } else {
      for (const [modName, modInfo] of Object.entries(KNOWN_MODULES)) {
        addNamedExports(modName, modInfo);
      }

      const taskExports = getTaskFilesExports(files, currentFilepath);
      for (const [sym, info] of Object.entries(taskExports)) {
        if (!info.isDefault) {
          if (alreadyImported.includes(sym)) continue;
          const { match, score } = fuzzyMatch(sym, currentPart);
          if (match || !currentPart) {
            let insertStr: string;
            let repStart: number;
            let repEnd: number;
            let cOffset: number | undefined;

            if (hasFromClause) {
              insertStr = sym;
              repStart = cursorIndex - currentPart.length;
              repEnd = cursorIndex + afterIdentLen;
              cOffset = currentPart.length > 0 ? sym.length : undefined;
            } else {
              const allSyms = [...alreadyImported, sym].join(", ");
              insertStr = `import ${typePrefix}{ ${allSyms} } from '${info.module}';`;
              repStart = lineStart;
              repEnd = lineEnd === -1 ? fullCode.length : lineEnd;
              cOffset = `import ${typePrefix}{ ${allSyms}`.length;
            }

            suggestions.push({
              prefix: sym,
              label: hasFromClause
                ? sym
                : `{ ${[...alreadyImported, sym].join(", ")} } from '${info.module}';`,
              detail: `from '${info.module}' (${info.filename})`,
              kind: "import",
              insertText: insertStr,
              replaceStart: repStart,
              replaceEnd: repEnd,
              cursorOffset: cOffset,
              score,
            });
          }
        }
      }
    }

    if (suggestions.length > 0) {
      suggestions.sort((a, b) => (b.score || 0) - (a.score || 0));
      return {
        word: currentPart || "{",
        items: suggestions.slice(0, 12),
      };
    }
  }

  return null;
}
