/**
 * AST-free Scope & Symbol Analyzer for Linter
 */

export interface DuplicateDeclarationProblem {
  name: string;
  kind: string;
  line: number;
  column: number;
  message: string;
}

export function stripCommentsAndStrings(code: string): string {
  if (!code || typeof code !== "string") return "";
  return code.replace(
    /("(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|`(?:\\.|[^`\\])*`)|\/\*[\s\S]*?\*\/|\/\/.*$/gm,
    (match, str) => {
      if (str) {
        const newlines = (str.match(/\n/g) || []).length;
        return '""' + "\n".repeat(newlines);
      }
      const newlines = (match.match(/\n/g) || []).length;
      return "\n".repeat(newlines);
    }
  );
}

export function extractImportedSymbols(code: string): Set<string> {
  const imported = new Set<string>();
  if (!code) return imported;

  const importMatches = code.matchAll(/import\s+(?:type\s+)?([\s\S]*?)\s+from\s+['"][^'"]+['"]/g);
  for (const m of importMatches) {
    const clause = m[1].trim();

    const nsMatch = clause.match(/\*\s*as\s+([a-zA-Z_$][a-zA-Z0-9_$]*)/);
    if (nsMatch) {
      imported.add(nsMatch[1]);
      continue;
    }

    const defMatch = clause.match(/^([a-zA-Z_$][a-zA-Z0-9_$]*)(?:\s*,|\s*$)/);
    if (defMatch && defMatch[1] !== "type") {
      imported.add(defMatch[1]);
    }

    const namedMatch = clause.match(/\{([^}]+)\}/);
    if (namedMatch) {
      const names = namedMatch[1].split(",");
      for (const n of names) {
        const item = n.trim();
        if (!item) continue;
        const asMatch = item.match(
          /(?:type\s+)?([a-zA-Z_$][a-zA-Z0-9_$]*)(?:\s+as\s+([a-zA-Z_$][a-zA-Z0-9_$]*))?/
        );
        if (asMatch) {
          imported.add(asMatch[2] || asMatch[1]);
        }
      }
    }
  }

  const reqMatches = code.matchAll(
    /(?:const|let|var)\s+([\s\S]*?)\s*=\s*require\(['"][^'"]+['"]\)/g
  );
  for (const m of reqMatches) {
    const clause = m[1].trim();
    const namedMatch = clause.match(/\{([^}]+)\}/);
    if (namedMatch) {
      const names = namedMatch[1].split(",");
      for (const n of names) {
        const parts = n.split(":");
        const name = (parts[1] || parts[0]).trim();
        if (name) imported.add(name);
      }
    } else if (/^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(clause)) {
      imported.add(clause);
    }
  }

  return imported;
}

export function extractDeclaredSymbols(code: string): Set<string> {
  const declared = new Set<string>();
  if (!code) return declared;

  const clean = stripCommentsAndStrings(code);

  const varMatches = clean.matchAll(/\b(?:const|let|var)\s+([^;=\n]+)/g);
  for (const m of varMatches) {
    const declPart = m[1];
    const objMatches = declPart.matchAll(/\{([^}]+)\}/g);
    for (const om of objMatches) {
      const entries = om[1].split(",");
      for (const e of entries) {
        const item = e.split("=")[0].trim();
        const parts = item.split(":");
        const name = (parts[1] || parts[0]).trim();
        if (/^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(name)) declared.add(name);
      }
    }
    const arrMatches = declPart.matchAll(/\[([^\]]+)\]/g);
    for (const am of arrMatches) {
      const entries = am[1].split(",");
      for (const e of entries) {
        const name = e
          .split("=")[0]
          .replace(/\.\.\./, "")
          .trim();
        if (/^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(name)) declared.add(name);
      }
    }
    const simple = declPart.replace(/\{[^}]*\}/g, "").replace(/\[[^\]]*\]/g, "");
    const names = simple.split(",");
    for (const n of names) {
      const name = n.split("=")[0].trim();
      if (/^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(name)) declared.add(name);
    }
  }

  const fnMatches = clean.matchAll(/\bfunction\s*\*?\s*([a-zA-Z_$][a-zA-Z0-9_$]*)/g);
  for (const m of fnMatches) {
    if (m[1]) declared.add(m[1]);
  }

  const classMatches = clean.matchAll(/\bclass\s+([a-zA-Z_$][a-zA-Z0-9_$]*)/g);
  for (const m of classMatches) {
    if (m[1]) declared.add(m[1]);
  }

  const paramMatches = clean.matchAll(/(?:\(([^)]*)\)\s*=>|function[^(]*\(([^)]*)\))/g);
  for (const m of paramMatches) {
    const rawParams = m[1] || m[2] || "";
    const params = rawParams.split(",");
    for (const p of params) {
      const cleanParam = p
        .split("=")[0]
        .replace(/\{|\}|\[|\]|\.\.\./g, "")
        .trim();
      const subNames = cleanParam.split(/\s*,\s*|\s*:\s*|\s+/);
      for (const sn of subNames) {
        if (/^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(sn)) declared.add(sn);
      }
    }
  }

  const singleArrowMatches = clean.matchAll(/\b([a-zA-Z_$][a-zA-Z0-9_$]*)\s*=>/g);
  for (const m of singleArrowMatches) {
    if (m[1]) declared.add(m[1]);
  }

  const catchMatches = clean.matchAll(/\bcatch\s*\(\s*([a-zA-Z_$][a-zA-Z0-9_$]*)\s*\)/g);
  for (const m of catchMatches) {
    if (m[1]) declared.add(m[1]);
  }

  const tsMatches = clean.matchAll(/\b(?:type|interface|enum)\s+([a-zA-Z_$][a-zA-Z0-9_$]*)/g);
  for (const m of tsMatches) {
    if (m[1]) declared.add(m[1]);
  }

  return declared;
}

export function findDuplicateDeclarations(code: string): DuplicateDeclarationProblem[] {
  if (!code || typeof code !== "string") return [];

  const lines = code.split("\n");
  const duplicates: DuplicateDeclarationProblem[] = [];
  const scopeStack: Array<Map<string, { line: number; col: number; kind: string }>> = [new Map()];
  let pendingForVars: Array<{ name: string; kind: string; col: number; line: number }> = [];
  let inBlockComment = false;
  let inString: string | null = null;

  for (let lineIdx = 0; lineIdx < lines.length; lineIdx++) {
    const line = lines[lineIdx];
    const lineNum = lineIdx + 1;

    let cleanLine = "";
    for (let cIdx = 0; cIdx < line.length; cIdx++) {
      const ch = line[cIdx];
      const nextCh = line[cIdx + 1];

      if (inBlockComment) {
        if (ch === "*" && nextCh === "/") {
          inBlockComment = false;
          cIdx++;
          cleanLine += "  ";
        } else {
          cleanLine += " ";
        }
        continue;
      }

      if (inString) {
        if (ch === "\\" && nextCh) {
          cleanLine += "  ";
          cIdx++;
        } else if (ch === inString) {
          inString = null;
          cleanLine += " ";
        } else {
          cleanLine += " ";
        }
        continue;
      }

      if (ch === "/" && nextCh === "/") {
        cleanLine += " ".repeat(line.length - cIdx);
        break;
      }

      if (ch === "/" && nextCh === "*") {
        inBlockComment = true;
        cleanLine += "  ";
        cIdx++;
        continue;
      }

      if (ch === '"' || ch === "'" || ch === "`") {
        inString = ch;
        cleanLine += " ";
        continue;
      }

      cleanLine += ch;
    }

    const checkAndAdd = (name: string, kind: string, col: number, isForHeader = false) => {
      if (isForHeader) {
        const existing = pendingForVars.find((p) => p.name === name);
        if (existing) {
          duplicates.push({
            name,
            kind,
            line: lineNum,
            column: col,
            message: `Повторное объявление идентификатора '${name}' (Duplicate identifier '${name}'). Ранее объявлен на стр. ${existing.line}`,
          });
        } else {
          pendingForVars.push({ name, kind, col, line: lineNum });
        }
        return;
      }

      const currentScope = scopeStack[scopeStack.length - 1];
      if (currentScope.has(name)) {
        const prev = currentScope.get(name)!;
        if (prev.line === lineNum && prev.col === col) return;
        const typeNoun =
          kind === "type"
            ? "типа"
            : kind === "function"
              ? "функции"
              : kind === "class"
                ? "класса"
                : "идентификатора";
        duplicates.push({
          name,
          kind,
          line: lineNum,
          column: col,
          message: `Повторное объявление ${typeNoun} '${name}' (Duplicate identifier '${name}'). Ранее объявлен на стр. ${prev.line}`,
        });
      } else {
        currentScope.set(name, { line: lineNum, col, kind });
      }
    };

    const typeMatches = cleanLine.matchAll(/\btype\s+([a-zA-Z_$][a-zA-Z0-9_$]*)/g);
    for (const tm of typeMatches) {
      if (tm[1]) checkAndAdd(tm[1], "type", (tm.index || 0) + 1);
    }

    const varMatches = cleanLine.matchAll(/\b(?:const|let|var)\s+([^;=\n]+)/g);
    for (const vm of varMatches) {
      const declPart = vm[1];
      const isForHeader = /\bfor\s*\([^)]*$/.test(cleanLine.slice(0, vm.index || 0));
      const objMatches = declPart.matchAll(/\{([^}]+)\}/g);
      for (const om of objMatches) {
        const entries = om[1].split(",");
        for (const e of entries) {
          const item = e.split("=")[0].trim();
          const parts = item.split(":");
          const name = (parts[1] || parts[0]).trim();
          if (/^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(name)) {
            checkAndAdd(name, "variable", (vm.index || 0) + 1, isForHeader);
          }
        }
      }
      const arrMatches = declPart.matchAll(/\[([^\]]+)\]/g);
      for (const am of arrMatches) {
        const entries = am[1].split(",");
        for (const e of entries) {
          const name = e
            .split("=")[0]
            .replace(/\.\.\./, "")
            .trim();
          if (/^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(name)) {
            checkAndAdd(name, "variable", (vm.index || 0) + 1, isForHeader);
          }
        }
      }
      const simple = declPart.replace(/\{[^}]*\}/g, "").replace(/\[[^\]]*\]/g, "");
      const names = simple.split(",");
      for (const n of names) {
        const name = n.split("=")[0].trim();
        if (/^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(name)) {
          checkAndAdd(name, "variable", (vm.index || 0) + 1, isForHeader);
        }
      }
    }

    const fnMatches = cleanLine.matchAll(/\bfunction\s*\*?\s*([a-zA-Z_$][a-zA-Z0-9_$]*)/g);
    for (const fm of fnMatches) {
      if (fm[1]) checkAndAdd(fm[1], "function", (fm.index || 0) + 1);
    }

    const classMatches = cleanLine.matchAll(/\bclass\s+([a-zA-Z_$][a-zA-Z0-9_$]*)/g);
    for (const cm of classMatches) {
      if (cm[1]) checkAndAdd(cm[1], "class", (cm.index || 0) + 1);
    }

    const enumMatches = cleanLine.matchAll(/\benum\s+([a-zA-Z_$][a-zA-Z0-9_$]*)/g);
    for (const em of enumMatches) {
      if (em[1]) checkAndAdd(em[1], "enum", (em.index || 0) + 1);
    }

    for (let i = 0; i < cleanLine.length; i++) {
      const c = cleanLine[i];
      if (c === "{") {
        const newScope = new Map<string, { line: number; col: number; kind: string }>();
        if (pendingForVars.length > 0) {
          for (const pv of pendingForVars) {
            newScope.set(pv.name, { line: pv.line, col: pv.col, kind: pv.kind });
          }
          pendingForVars = [];
        }
        scopeStack.push(newScope);
      } else if (c === "}") {
        if (scopeStack.length > 1) {
          scopeStack.pop();
        }
      }
    }

    if (!cleanLine.includes("{") && !/\bfor\s*\(/.test(cleanLine)) {
      pendingForVars = [];
    }
  }

  return duplicates;
}

export function findUnusedImports(code: string): Set<string> {
  const unused = new Set<string>();
  if (!code || typeof code !== "string" || !code.trim()) return unused;

  const importedItems: string[] = [];

  const importBlockRegex = /(?:^|\n)\s*import\s+([\s\S]*?)\s+from\s*['"][^'"]+['"]/g;
  let match: RegExpExecArray | null;
  while ((match = importBlockRegex.exec(code)) !== null) {
    const importClause = match[1].trim();

    const defaultMatch = importClause.match(/^(?:type\s+)?([a-zA-Z_$][a-zA-Z0-9_$]*)(?:\s*,|\s*$)/);
    if (defaultMatch && defaultMatch[1] && defaultMatch[1] !== "type") {
      importedItems.push(defaultMatch[1]);
    }

    const nsMatch = importClause.match(/\*\s+as\s+([a-zA-Z_$][a-zA-Z0-9_$]*)/);
    if (nsMatch && nsMatch[1]) {
      importedItems.push(nsMatch[1]);
    }

    const namedMatch = importClause.match(/\{([\s\S]*?)\}/);
    if (namedMatch && namedMatch[1]) {
      const parts = namedMatch[1].split(",");
      for (const part of parts) {
        const item = part.trim();
        if (!item) continue;
        const asMatch = item.match(
          /(?:type\s+)?([a-zA-Z_$][a-zA-Z0-9_$]*)(?:\s+as\s+([a-zA-Z_$][a-zA-Z0-9_$]*))?/
        );
        if (asMatch) {
          importedItems.push(asMatch[2] || asMatch[1]);
        }
      }
    }
  }

  if (importedItems.length === 0) {
    return unused;
  }

  const cleanCode = stripCommentsAndStrings(code);
  const bodyCode = cleanCode.replace(/(?:^|\n)\s*import\s+[\s\S]*?from\s*""/g, "\n");

  for (const sym of importedItems) {
    const regex = new RegExp(`\\b${sym}\\b`);
    if (!regex.test(bodyCode)) {
      unused.add(sym);
    }
  }

  return unused;
}
