import { getComponentNameFromFilepath } from "../fuzzyMatcher";
import { SnippetItem } from "../snippetsData";

export function expandSnippet(
  fullCode: string,
  cursorIndex: number,
  snippet: SnippetItem,
  prefixWord = "",
  options: { filepath?: string; title?: string } = {}
): { newCode: string; newCursorPos: number } {
  const { filepath = "Component.jsx", title = "" } = options;
  const currentFile = title || filepath || "Component.jsx";
  const compName = getComponentNameFromFilepath(currentFile);

  const startReplace = cursorIndex - (prefixWord ? prefixWord.length : 0);

  let rawBody = typeof snippet.body === "function" ? snippet.body(compName) : snippet.body;

  rawBody = rawBody
    .replace(/\$1/g, compName)
    .replace(/\$2/g, "")
    .replace(/\$3/g, "")
    .replace(/\$4/g, "");

  const before = fullCode.substring(0, startReplace);
  const after = fullCode.substring(cursorIndex);

  const newCode = before + rawBody + after;

  let newCursorPos = startReplace + rawBody.length;
  if (snippet.cursorOffset !== undefined) {
    newCursorPos = startReplace + snippet.cursorOffset;
  } else if (rawBody.includes("<div>\n      \n    </div>")) {
    newCursorPos = startReplace + rawBody.indexOf("<div>\n      \n    </div>") + 12;
  } else if (rawBody.includes("{\n  \n}")) {
    newCursorPos = startReplace + rawBody.indexOf("{\n  \n}") + 4;
  }

  return { newCode, newCursorPos };
}
