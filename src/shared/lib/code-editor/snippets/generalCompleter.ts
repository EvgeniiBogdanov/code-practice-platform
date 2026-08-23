import { isEmmetAbbreviation, expandEmmetAbbreviation } from "../emmetEngine";
import { fuzzyMatch } from "../fuzzyMatcher";
import { getTaskFilesExports, TaskFile } from "../importManager";
import {
  REACT_HOOKS,
  JS_KEYWORDS,
  JS_GLOBALS,
  TS_UTILITY_TYPES,
  JSX_ELEMENTS,
  JS_SNIPPETS,
  REACT_JSX_PROPS,
  CompletionItem,
} from "../snippetsData";

export function getGeneralCompletions(
  fullCode: string,
  cursorIndex: number,
  textBeforeCursor: string,
  currentLineBeforeCursor: string,
  lineAfterCursor: string,
  files: TaskFile[],
  currentFilepath: string,
  force: boolean
): { word: string; items: CompletionItem[] } {
  // 1. Tag open <Tag
  const tagOpenMatch = currentLineBeforeCursor.match(/<([a-zA-Z0-9_$]*)$/);
  if (tagOpenMatch) {
    const tagQuery = tagOpenMatch[1];
    const afterTagMatch = lineAfterCursor.match(/^[a-zA-Z0-9_$]*/);
    const afterTagLen = afterTagMatch ? afterTagMatch[0].length : 0;
    const scoredTags: CompletionItem[] = [];

    for (const el of JSX_ELEMENTS) {
      const { match, score } = fuzzyMatch(el.name, tagQuery);
      if (match || !tagQuery) {
        scoredTags.push({
          prefix: el.name,
          label: `<${el.name}>`,
          detail: el.detail,
          kind: "keyword",
          insertText: el.name,
          replaceStart: cursorIndex - tagQuery.length,
          replaceEnd: cursorIndex + afterTagLen,
          score: score + 10,
        });
      }
    }

    const taskFilesExports = getTaskFilesExports(files, currentFilepath);
    for (const [sym, info] of Object.entries(taskFilesExports)) {
      if (/^[A-Z]/.test(sym)) {
        const { match, score } = fuzzyMatch(sym, tagQuery);
        if (match || !tagQuery) {
          scoredTags.push({
            prefix: sym,
            label: `<${sym}>`,
            detail: `Компонент задачи: ${info.filename}`,
            kind: "import",
            insertText: sym,
            autoImport: { symbol: sym, module: info.module, isDefault: info.isDefault },
            replaceStart: cursorIndex - tagQuery.length,
            replaceEnd: cursorIndex + afterTagLen,
            score: score + 15,
          });
        }
      }
    }

    if (scoredTags.length > 0) {
      scoredTags.sort((a, b) => (b.score || 0) - (a.score || 0));
      return {
        word: tagQuery || "<",
        items: scoredTags.slice(0, 12),
      };
    }
  }

  // 2. JSX Props
  const inTagMatch = currentLineBeforeCursor.match(
    /<([a-zA-Z0-9_$]+)(?:\s+[^>]*?)?\s+([a-zA-Z0-9_$-]*)$/
  );
  const isInsideQuoteOrBrace =
    /=["'][^"']*$/.test(currentLineBeforeCursor) || /=\{[^}]*$/.test(currentLineBeforeCursor);

  if (inTagMatch && !isInsideQuoteOrBrace) {
    const tagName = inTagMatch[1].toLowerCase();
    const propQuery = inTagMatch[2] || "";
    const afterPropMatch = lineAfterCursor.match(/^[a-zA-Z0-9_$-]*/);
    const afterPropLen = afterPropMatch ? afterPropMatch[0].length : 0;

    let candidateProps = [...REACT_JSX_PROPS.common, ...REACT_JSX_PROPS.events];
    if (REACT_JSX_PROPS[tagName]) {
      candidateProps = [...REACT_JSX_PROPS[tagName], ...candidateProps];
    }

    const scoredProps: CompletionItem[] = [];
    for (const prop of candidateProps) {
      const { match, score } = fuzzyMatch(prop.label, propQuery);
      if (match || !propQuery) {
        scoredProps.push({
          prefix: prop.label,
          label: prop.label,
          detail: prop.detail,
          kind: prop.kind,
          insertText: prop.insertText,
          replaceStart: cursorIndex - propQuery.length,
          replaceEnd: cursorIndex + afterPropLen,
          score,
        });
      }
    }

    if (scoredProps.length > 0) {
      scoredProps.sort((a, b) => (b.score || 0) - (a.score || 0));
      const seen = new Set<string>();
      const uniqueProps: CompletionItem[] = [];
      for (const p of scoredProps) {
        if (!seen.has(p.label)) {
          seen.add(p.label);
          uniqueProps.push(p);
        }
      }
      return {
        word: propQuery || "prop",
        items: uniqueProps.slice(0, 12),
      };
    }
  }

  // 3. Emmet Abbreviation
  const emmetMatch = currentLineBeforeCursor.match(/([a-zA-Z0-9_$.#:>+*^=$/-]+)$/);
  if (emmetMatch && isEmmetAbbreviation(emmetMatch[1])) {
    const abbr = emmetMatch[1];
    const lineIndentMatch = currentLineBeforeCursor.match(/^(\s*)/);
    const lineIndent = lineIndentMatch ? lineIndentMatch[1] : "";
    const expanded = expandEmmetAbbreviation(abbr, lineIndent);
    if (expanded) {
      const emmetItem: CompletionItem = {
        prefix: abbr,
        label: `${abbr} ⚡ (Emmet)`,
        detail: `Развернуть Emmet JSX разметку`,
        kind: "snippet",
        insertText: expanded,
        replaceStart: cursorIndex - abbr.length,
        replaceEnd: cursorIndex,
        score: 130,
      };

      if (/[.#>+*[{]/.test(abbr)) {
        return {
          word: abbr,
          items: [emmetItem],
        };
      }
    }
  }

  // 4. Standard Identifier Context
  const wordMatch = textBeforeCursor.match(/([a-zA-Z_$][a-zA-Z0-9_$]*)$/);
  const word = wordMatch ? wordMatch[1] : "";

  if (!word && !force) return { word: "", items: [] };

  const allItems: CompletionItem[] = [];

  for (const s of JS_SNIPPETS) {
    const { match, score } = fuzzyMatch(s.prefix, word);
    if (match || (!word && force)) {
      allItems.push({
        prefix: s.prefix,
        label: s.label,
        detail: s.detail,
        kind: "snippet",
        insertText: s.prefix,
        snippet: s,
        score: score + 5,
      });
    }
  }

  for (const h of REACT_HOOKS) {
    const { match, score } = fuzzyMatch(h, word);
    if (match || (!word && force)) {
      allItems.push({
        prefix: h,
        label: h,
        detail: "React Hook (auto-import)",
        kind: "hook",
        insertText: h,
        autoImport: { symbol: h, module: "react", isDefault: false },
        score: score + 10,
      });
    }
  }

  for (const t of TS_UTILITY_TYPES) {
    const { match, score } = fuzzyMatch(t.name, word);
    if (match || (!word && force)) {
      const cleanInsert = t.insertText.replace(/\$1/g, "").replace(/\$2/g, "");
      allItems.push({
        prefix: t.name,
        label: t.label,
        detail: t.detail,
        kind: "type",
        insertText: cleanInsert,
        autoImport: t.autoImport,
        score: score + 7,
      });
    }
  }

  for (const k of JS_KEYWORDS) {
    const { match, score } = fuzzyMatch(k, word);
    if (match || (!word && force)) {
      allItems.push({
        prefix: k,
        label: k,
        detail: "Ключевое слово JS",
        kind: "keyword",
        insertText: k,
        score,
      });
    }
  }

  for (const g of JS_GLOBALS) {
    const { match, score } = fuzzyMatch(g, word);
    if (match || (!word && force)) {
      allItems.push({
        prefix: g,
        label: g,
        detail: "Глобальный объект JS",
        kind: "global",
        insertText: g,
        score,
      });
    }
  }

  const docTokens = new Set<string>();
  const tokenRegex = /\b[a-zA-Z_$][a-zA-Z0-9_$]*\b/g;
  let tMatch: RegExpExecArray | null;
  while ((tMatch = tokenRegex.exec(fullCode)) !== null) {
    const tok = tMatch[0];
    if (
      tok !== word &&
      tok.length > 2 &&
      !JS_KEYWORDS.includes(tok) &&
      !REACT_HOOKS.includes(tok) &&
      !JS_GLOBALS.includes(tok)
    ) {
      docTokens.add(tok);
    }
  }

  for (const tok of docTokens) {
    const { match, score } = fuzzyMatch(tok, word);
    if (match || (!word && force)) {
      allItems.push({
        prefix: tok,
        label: tok,
        detail: "Переменная / Символ в коде",
        kind: "variable",
        insertText: tok,
        score: score - 5,
      });
    }
  }

  const taskFilesExports = getTaskFilesExports(files, currentFilepath);
  for (const [sym, info] of Object.entries(taskFilesExports)) {
    const { match, score } = fuzzyMatch(sym, word);
    if (match || (!word && force)) {
      allItems.push({
        prefix: sym,
        label: sym,
        detail: `Auto-import from '${info.module}' (${info.filename})`,
        kind: "import",
        insertText: sym,
        autoImport: { symbol: sym, module: info.module, isDefault: info.isDefault },
        score: score + 6,
      });
    }
  }

  allItems.sort((a, b) => (b.score || 0) - (a.score || 0));

  const seenLabels = new Set<string>();
  const uniqueItems: CompletionItem[] = [];
  for (const item of allItems) {
    if (!seenLabels.has(item.label)) {
      seenLabels.add(item.label);
      uniqueItems.push(item);
    }
  }

  return {
    word: word || "",
    items: uniqueItems.slice(0, 12),
  };
}
