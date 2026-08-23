/**
 * Bracket Matching Engine for Code Editor
 */

export function findMatchingBracketPair(
  code: string,
  cursorIndex: number
): [number, number] | null {
  if (!code || typeof code !== "string" || cursorIndex < 0 || cursorIndex > code.length) {
    return null;
  }

  const brackets: Record<string, string> = { "(": ")", "{": "}", "[": "]" };
  const closingBrackets: Record<string, string> = { ")": "(", "}": "{", "]": "[" };

  let targetIdx = -1;
  let isOpening = false;
  let openChar = "";
  let closeChar = "";

  const charUnder = code[cursorIndex];
  const charBefore = cursorIndex > 0 ? code[cursorIndex - 1] : "";

  if (brackets[charUnder]) {
    targetIdx = cursorIndex;
    isOpening = true;
    openChar = charUnder;
    closeChar = brackets[charUnder];
  } else if (closingBrackets[charUnder]) {
    targetIdx = cursorIndex;
    isOpening = false;
    closeChar = charUnder;
    openChar = closingBrackets[charUnder];
  } else if (brackets[charBefore]) {
    targetIdx = cursorIndex - 1;
    isOpening = true;
    openChar = charBefore;
    closeChar = brackets[charBefore];
  } else if (closingBrackets[charBefore]) {
    targetIdx = cursorIndex - 1;
    isOpening = false;
    closeChar = charBefore;
    openChar = closingBrackets[charBefore];
  }

  if (targetIdx === -1) return null;

  if (isOpening) {
    let depth = 1;
    let inString: string | null = null;
    for (let i = targetIdx + 1; i < code.length; i++) {
      const ch = code[i];
      if (inString) {
        if (ch === "\\" && i + 1 < code.length) {
          i++;
        } else if (ch === inString) {
          inString = null;
        }
        continue;
      }
      if (ch === '"' || ch === "'" || ch === "`") {
        inString = ch;
        continue;
      }
      if (ch === openChar) depth++;
      else if (ch === closeChar) {
        depth--;
        if (depth === 0) return [targetIdx, i];
      }
    }
  } else {
    let depth = 1;
    let inString: string | null = null;
    for (let i = targetIdx - 1; i >= 0; i--) {
      const ch = code[i];
      if (inString) {
        if (ch === "\\" && i > 0 && code[i - 1] === "\\") {
          // skip escaped
        } else if (ch === inString) {
          inString = null;
        }
        continue;
      }
      if (ch === '"' || ch === "'" || ch === "`") {
        inString = ch;
        continue;
      }
      if (ch === closeChar) depth++;
      else if (ch === openChar) {
        depth--;
        if (depth === 0) return [i, targetIdx];
      }
    }
  }

  return null;
}
