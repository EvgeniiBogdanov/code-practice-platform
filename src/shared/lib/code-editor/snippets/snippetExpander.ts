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

  // Track position for initial tabstop / placeholder
  let firstTabStopOffset = -1;
  const tabStopMatch = rawBody.match(/\$\{1:([^}]+)\}|\$1/);
  if (tabStopMatch && tabStopMatch.index !== undefined) {
    if (tabStopMatch[1]) {
      // e.g. ${1:object} in "console.log(${1:object});" -> index 12 + 6 = 18 -> after "object"
      firstTabStopOffset = tabStopMatch.index + tabStopMatch[1].length;
    } else {
      // e.g. $1 in "console.log($1);" -> index 12 -> between ()
      firstTabStopOffset = tabStopMatch.index;
    }
  }

  // Replace ${n:placeholder} with placeholder text
  rawBody = rawBody.replace(/\$\{\d+:([^}]+)\}/g, "$1");

  // Remove standalone $0, $1, $2, $3, etc.
  rawBody = rawBody.replace(/\$\d+/g, "");

  const before = fullCode.substring(0, startReplace);
  const after = fullCode.substring(cursorIndex);

  const newCode = before + rawBody + after;

  let newCursorPos = startReplace + rawBody.length;
  if (snippet.cursorOffset !== undefined) {
    newCursorPos = startReplace + snippet.cursorOffset;
  } else if (firstTabStopOffset >= 0) {
    newCursorPos = startReplace + firstTabStopOffset;
  } else if (rawBody.includes("<div>\n      \n    </div>")) {
    newCursorPos = startReplace + rawBody.indexOf("<div>\n      \n    </div>") + 12;
  } else if (rawBody.includes("{\n  \n}")) {
    newCursorPos = startReplace + rawBody.indexOf("{\n  \n}") + 4;
  }

  return { newCode, newCursorPos };
}
