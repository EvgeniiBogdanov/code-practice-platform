/**
 * Bracket Matching Engine for Code Editor
 */

const CLOSING_FOR: Record<string, string> = { "(": ")", "{": "}", "[": "]" };
const OPENING_FOR: Record<string, string> = { ")": "(", "}": "{", "]": "[" };
/** Stack marker for the `{` of a template `${`. */
const TEMPLATE_EXPRESSION = "${";

/**
 * Pairs every bracket in one forward pass, so brackets inside strings, comments and
 * template text are ignored in both directions and an unbalanced one cannot leak further.
 */
const collectBracketPairs = (code: string): Map<number, number> => {
  const pairs = new Map<number, number>();
  const stack: Array<{ char: string; index: number }> = [];
  let inTemplate = false;
  let i = 0;
  while (i < code.length) {
    const ch = code[i];
    if (inTemplate) {
      if (ch === "\\") i += 2;
      else if (ch === "`") {
        inTemplate = false;
        i++;
      } else if (ch === "$" && code[i + 1] === "{") {
        stack.push({ char: TEMPLATE_EXPRESSION, index: i + 1 });
        inTemplate = false;
        i += 2;
      } else i++;
      continue;
    }
    // `//` after `:` is a URL (`http://…`), not a comment.
    if (ch === "/" && code[i + 1] === "/" && code[i - 1] !== ":") {
      const lineEnd = code.indexOf("\n", i);
      i = lineEnd === -1 ? code.length : lineEnd;
      continue;
    }
    if (ch === "/" && code[i + 1] === "*") {
      const end = code.indexOf("*/", i + 2);
      i = end === -1 ? code.length : end + 2;
      continue;
    }
    if (ch === '"' || ch === "'") {
      // A quote never spans lines, so an apostrophe in prose cannot hide the rest of the file.
      i++;
      while (i < code.length && code[i] !== ch && code[i] !== "\n") i += code[i] === "\\" ? 2 : 1;
      i++;
      continue;
    }
    if (ch === "`") {
      inTemplate = true;
      i++;
      continue;
    }
    if (CLOSING_FOR[ch]) stack.push({ char: ch, index: i });
    else if (OPENING_FOR[ch]) {
      const expressionEnd = ch === "}" && stack.at(-1)?.char === TEMPLATE_EXPRESSION;
      if (expressionEnd) {
        const marker = stack.pop();
        if (marker) {
          pairs.set(marker.index, i);
          pairs.set(i, marker.index);
        }
        inTemplate = true;
      } else {
        // Skip unmatched openers above the match so one stray bracket does not break the rest.
        const open = stack.map((entry) => entry.char).lastIndexOf(OPENING_FOR[ch]);
        if (open !== -1) {
          const [opener] = stack.splice(open);
          pairs.set(opener.index, i);
          pairs.set(i, opener.index);
        }
      }
    }
    i++;
  }
  return pairs;
};

export function findMatchingBracketPair(
  code: string,
  cursorIndex: number
): [number, number] | null {
  if (!code || typeof code !== "string" || cursorIndex < 0 || cursorIndex > code.length) {
    return null;
  }

  const pairs = collectBracketPairs(code);
  // The bracket under the caret wins over the one before it, as in VS Code.
  for (const index of [cursorIndex, cursorIndex - 1]) {
    const partner = pairs.get(index);
    if (partner !== undefined) return index < partner ? [index, partner] : [partner, index];
  }
  return null;
}
