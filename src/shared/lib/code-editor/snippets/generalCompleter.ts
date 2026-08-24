/**
 * General Identifiers, Tags, Props, Snippets & Emmet Completer
 */

import { isEmmetAbbreviation, expandEmmetAbbreviation } from "../emmetEngine";
import { fuzzyMatch } from "../fuzzyMatcher";
import { getTaskFilesExports, TaskFile } from "../importManager";
import { CompletionItem } from "../snippetsData";
import { LanguageCapabilities } from "../languages/languageTypes";
import { JS_KEYWORDS, JS_GLOBALS, JS_SNIPPETS } from "../languages/javascriptKnowledge";
import { REACT_HOOKS, REACT_SNIPPETS } from "../languages/reactKnowledge";
import {
  TS_KEYWORDS,
  TS_UTILITY_TYPES,
  TS_SNIPPETS,
  REACT_TS_TYPES,
} from "../languages/typescriptKnowledge";
import { collectTagCompletions, collectPropsCompletions } from "./generalCompleterHelpers";

export function getGeneralCompletions(
  fullCode: string,
  cursorIndex: number,
  textBeforeCursor: string,
  currentLineBeforeCursor: string,
  lineAfterCursor: string,
  files: TaskFile[],
  currentFilepath: string,
  capabilities: LanguageCapabilities,
  force = false
): { word: string; items: CompletionItem[] } {
  // 1. Tag open <Tag (only if JSX is supported)
  if (capabilities.supportsJsx) {
    const tagOpenMatch = currentLineBeforeCursor.match(/<([a-zA-Z0-9_$]*)$/);
    if (tagOpenMatch) {
      const tagQuery = tagOpenMatch[1];
      const afterTagMatch = lineAfterCursor.match(/^[a-zA-Z0-9_$]*/);
      const afterTagLen = afterTagMatch ? afterTagMatch[0].length : 0;
      const scoredTags = collectTagCompletions(
        tagQuery,
        cursorIndex,
        afterTagLen,
        files,
        currentFilepath
      );

      if (scoredTags.length > 0) {
        scoredTags.sort((a, b) => (b.score || 0) - (a.score || 0));
        return { word: tagQuery || "<", items: scoredTags.slice(0, 12) };
      }
    }

    // 2. JSX Props inside <Tag prop
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
      const scoredProps = collectPropsCompletions(tagName, propQuery, cursorIndex, afterPropLen);

      if (scoredProps.length > 0) {
        scoredProps.sort((a, b) => (b.score || 0) - (a.score || 0));
        const seen = new Set<string>();
        const unique = scoredProps.filter((p) => !seen.has(p.label) && seen.add(p.label));
        return { word: propQuery || "prop", items: unique.slice(0, 12) };
      }
    }
  }

  // 3. Emmet Abbreviation (only if Emmet is supported)
  if (capabilities.supportsEmmet) {
    const emmetMatch = currentLineBeforeCursor.match(/([a-zA-Z0-9_$.#:>+*^=$/-]+)$/);
    if (emmetMatch && isEmmetAbbreviation(emmetMatch[1])) {
      const abbr = emmetMatch[1];
      const lineIndentMatch = currentLineBeforeCursor.match(/^(\s*)/);
      const lineIndent = lineIndentMatch ? lineIndentMatch[1] : "";
      const expanded = expandEmmetAbbreviation(abbr, lineIndent);
      if (expanded && /[.#>+*[{]/.test(abbr)) {
        return {
          word: abbr,
          items: [
            {
              prefix: abbr,
              label: `${abbr} ⚡ (Emmet)`,
              detail: `Развернуть Emmet JSX разметку`,
              kind: "snippet",
              insertText: expanded,
              replaceStart: cursorIndex - abbr.length,
              replaceEnd: cursorIndex,
              score: 130,
            },
          ],
        };
      }
    }
  }

  // 4. Standard Identifier Context
  const wordMatch = textBeforeCursor.match(/([a-zA-Z_$][a-zA-Z0-9_$]*)$/);
  const word = wordMatch ? wordMatch[1] : "";

  if (!word && !force) return { word: "", items: [] };

  const allItems: CompletionItem[] = [];

  // JS standard snippets
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

  // React hooks & React snippets
  if (capabilities.supportsReactHooks) {
    for (const s of REACT_SNIPPETS) {
      const { match, score } = fuzzyMatch(s.prefix, word);
      if (match || (!word && force)) {
        allItems.push({
          prefix: s.prefix,
          label: s.label,
          detail: s.detail,
          kind: "snippet",
          insertText: s.prefix,
          snippet: s,
          score: score + 6,
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
  }

  // TypeScript Types & Snippets
  if (capabilities.supportsTypeScript) {
    for (const s of TS_SNIPPETS) {
      const { match, score } = fuzzyMatch(s.prefix, word);
      if (match || (!word && force)) {
        allItems.push({
          prefix: s.prefix,
          label: s.label,
          detail: s.detail,
          kind: "snippet",
          insertText: s.prefix,
          snippet: s,
          score: score + 6,
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

    for (const k of TS_KEYWORDS) {
      const { match, score } = fuzzyMatch(k, word);
      if (match || (!word && force)) {
        allItems.push({
          prefix: k,
          label: k,
          detail: "Ключевое слово TS",
          kind: "keyword",
          insertText: k,
          score: score + 1,
        });
      }
    }

    if (capabilities.supportsReactHooks) {
      for (const rt of REACT_TS_TYPES) {
        const { match, score } = fuzzyMatch(rt.name, word);
        if (match || (!word && force)) {
          const cleanInsert = rt.insertText.replace(/\$1/g, "");
          allItems.push({
            prefix: rt.name,
            label: rt.label,
            detail: rt.detail,
            kind: "type",
            insertText: cleanInsert,
            autoImport: rt.autoImport,
            score: score + 8,
          });
        }
      }
    }
  }

  // JavaScript Keywords & Globals
  if (capabilities.supportsJavaScriptGlobals) {
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
  }

  // Document tokens
  const docTokens = new Set<string>();
  const tokenRegex = /\b[a-zA-Z_$][a-zA-Z0-9_$]*\b/g;
  let tMatch: RegExpExecArray | null;
  while ((tMatch = tokenRegex.exec(fullCode)) !== null) {
    const tok = tMatch[0];
    if (tok !== word && tok.length > 2 && !JS_KEYWORDS.includes(tok) && !JS_GLOBALS.includes(tok)) {
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

  // Auto-import from task files
  if (capabilities.supportsAutoImport) {
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
  }

  allItems.sort((a, b) => (b.score || 0) - (a.score || 0));

  const seenLabels = new Set<string>();
  const uniqueItems = allItems.filter(
    (item) => !seenLabels.has(item.label) && seenLabels.add(item.label)
  );

  return { word: word || "", items: uniqueItems.slice(0, 12) };
}
