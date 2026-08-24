/**
 * General Completer Tag and Prop Helpers
 */

import { fuzzyMatch } from "../fuzzyMatcher";
import { getTaskFilesExports } from "../importManager";
import type { TaskFile } from "../importManager";
import type { CompletionItem } from "../snippetsData";
import { JSX_ELEMENTS, REACT_JSX_PROPS } from "../languages/reactKnowledge";

export function collectTagCompletions(
  query: string,
  cursorIndex: number,
  afterTagLen: number,
  files: TaskFile[],
  currentFilepath: string
): CompletionItem[] {
  const scoredTags: CompletionItem[] = [];

  for (const el of JSX_ELEMENTS) {
    const { match, score } = fuzzyMatch(el.name, query);
    if (match || !query) {
      scoredTags.push({
        prefix: el.name,
        label: `<${el.name}>`,
        detail: el.detail,
        kind: "keyword",
        insertText: el.name,
        replaceStart: cursorIndex - query.length,
        replaceEnd: cursorIndex + afterTagLen,
        score: score + 10,
      });
    }
  }

  const taskFilesExports = getTaskFilesExports(files, currentFilepath);
  for (const [sym, info] of Object.entries(taskFilesExports)) {
    if (/^[A-Z]/.test(sym)) {
      const { match, score } = fuzzyMatch(sym, query);
      if (match || !query) {
        scoredTags.push({
          prefix: sym,
          label: `<${sym}>`,
          detail: `Компонент задачи: ${info.filename}`,
          kind: "import",
          insertText: sym,
          autoImport: { symbol: sym, module: info.module, isDefault: info.isDefault },
          replaceStart: cursorIndex - query.length,
          replaceEnd: cursorIndex + afterTagLen,
          score: score + 15,
        });
      }
    }
  }

  return scoredTags;
}

export function collectPropsCompletions(
  tagName: string,
  query: string,
  cursorIndex: number,
  afterPropLen: number
): CompletionItem[] {
  let candidateProps = [...REACT_JSX_PROPS.common, ...REACT_JSX_PROPS.events];
  if (REACT_JSX_PROPS[tagName]) {
    candidateProps = [...REACT_JSX_PROPS[tagName], ...candidateProps];
  }

  const scoredProps: CompletionItem[] = [];
  for (const prop of candidateProps) {
    const { match, score } = fuzzyMatch(prop.label, query);
    if (match || !query) {
      scoredProps.push({
        prefix: prop.label,
        label: prop.label,
        detail: prop.detail,
        kind: prop.kind,
        insertText: prop.insertText,
        replaceStart: cursorIndex - query.length,
        replaceEnd: cursorIndex + afterPropLen,
        score,
      });
    }
  }

  return scoredProps;
}
