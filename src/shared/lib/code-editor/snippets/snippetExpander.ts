import { getComponentNameFromFilepath } from "../fuzzyMatcher";
import { SnippetItem } from "../snippetsData";

export interface TabStop {
  start: number;
  end: number;
}

export interface SnippetExpansion {
  newCode: string;
  newCursorPos: number;
  /** End of the first placeholder, which starts selected as in VS Code. */
  newSelectionEnd: number;
  /** Absolute ranges in Tab order: $1, $2 … and the final $0 position last. */
  tabStops: TabStop[];
}

const TAB_STOP = /\$\{(\d+):([^}]*)\}|\$(\d+)/g;

/** Expands VS Code snippet syntax (`$1`, `${1:placeholder}`, `$0`). */
export function expandSnippet(
  fullCode: string,
  cursorIndex: number,
  snippet: SnippetItem,
  prefixWord = "",
  options: { filepath?: string; title?: string } = {}
): SnippetExpansion {
  const { filepath = "Component.jsx", title = "" } = options;
  const compName = getComponentNameFromFilepath(title || filepath || "Component.jsx");
  const startReplace = cursorIndex - prefixWord.length;
  const lineStart = fullCode.lastIndexOf("\n", startReplace - 1) + 1;
  const indent = /^[ \t]*/.exec(fullCode.slice(lineStart, startReplace))?.[0] ?? "";

  // Continuation lines follow the indentation of the line the snippet starts on.
  const body = (typeof snippet.body === "function" ? snippet.body(compName) : snippet.body)
    .split("\n")
    .join(`\n${indent}`);

  const stops = new Map<number, TabStop>();
  let text = "";
  let last = 0;
  for (const match of body.matchAll(TAB_STOP)) {
    text += body.slice(last, match.index);
    const index = Number(match[1] ?? match[3]);
    const placeholder = match[2] ?? "";
    const start = startReplace + text.length;
    if (!stops.has(index)) stops.set(index, { start, end: start + placeholder.length });
    text += placeholder;
    last = match.index + match[0].length;
  }
  text += body.slice(last);

  const finalStop = stops.get(0) ?? {
    start: startReplace + text.length,
    end: startReplace + text.length,
  };
  const tabStops = [
    ...[...stops.entries()]
      .filter(([index]) => index > 0)
      .sort(([a], [b]) => a - b)
      .map(([, stop]) => stop),
    finalStop,
  ];
  const first =
    snippet.cursorOffset === undefined
      ? tabStops[0]
      : { start: startReplace + snippet.cursorOffset, end: startReplace + snippet.cursorOffset };

  return {
    newCode: fullCode.slice(0, startReplace) + text + fullCode.slice(cursorIndex),
    newCursorPos: first.start,
    newSelectionEnd: first.end,
    tabStops: snippet.cursorOffset === undefined ? tabStops : [],
  };
}
