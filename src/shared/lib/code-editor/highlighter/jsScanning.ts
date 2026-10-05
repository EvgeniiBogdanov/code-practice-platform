/**
 * Lexical scanners for JavaScript template literals.
 */

/** Returns the end (exclusive) of a template literal starting at `start`. */
export const scanTemplate = (code: string, start: number): number => {
  let i = start + 1;
  while (i < code.length) {
    const ch = code[i];
    if (ch === "\\") i += 2;
    else if (ch === "`") return i + 1;
    else if (ch === "$" && code[i + 1] === "{") i = scanExpression(code, i + 2);
    else i++;
  }
  return code.length;
};

/** Returns the index after the `}` that closes an expression opened before `start`. */
export const scanExpression = (code: string, start: number): number => {
  let depth = 1;
  let i = start;
  while (i < code.length) {
    const ch = code[i];
    if (ch === "`") {
      i = scanTemplate(code, i);
      continue;
    }
    if (ch === '"' || ch === "'") {
      i++;
      while (i < code.length && code[i] !== ch && code[i] !== "\n") i += code[i] === "\\" ? 2 : 1;
      i++;
      continue;
    }
    if (ch === "{") depth++;
    if (ch === "}" && --depth === 0) return i + 1;
    i++;
  }
  return code.length;
};
