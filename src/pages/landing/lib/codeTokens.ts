/**
 * Minimal JS/TS/JSX tokenizer for the static landing snippets. The workspace highlighter lives
 * in the editor bundle, so the landing reuses only its colour tokens (`--hl-*`), not the engine.
 */
export type CodeTokenKind =
  "plain" | "comment" | "string" | "keyword" | "number" | "tag" | "type" | "function" | "operator";

export interface CodeToken {
  kind: CodeTokenKind;
  text: string;
}

const KEYWORDS =
  "const|let|var|return|new|if|else|for|of|in|async|await|function|export|import|from|type|interface|extends|keyof|typeof|class|throw|try|catch|null|undefined|true|false";

const TOKEN_PATTERN = new RegExp(
  [
    String.raw`(\/\/.*$)`,
    String.raw`("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|\`(?:[^\`\\]|\\.)*\`)`,
    String.raw`\b(${KEYWORDS})\b`,
    String.raw`\b(\d+(?:\.\d+)?)\b`,
    String.raw`(<\/?[A-Za-z][\w.]*|\/?>)`,
    String.raw`\b([A-Z][\w$]*)\b`,
    String.raw`\b([A-Za-z_$][\w$]*)(?=\s*\()`,
    String.raw`(=>|===|!==|\?\?|&&|\|\|)`,
  ].join("|"),
  "g"
);

const GROUP_KINDS: readonly CodeTokenKind[] = [
  "comment",
  "string",
  "keyword",
  "number",
  "tag",
  "type",
  "function",
  "operator",
];

export const tokenizeLine = (line: string): CodeToken[] => {
  const tokens: CodeToken[] = [];
  let cursor = 0;

  for (const match of line.matchAll(TOKEN_PATTERN)) {
    const index = match.index ?? 0;
    if (index > cursor) tokens.push({ kind: "plain", text: line.slice(cursor, index) });

    const groupIndex = match.slice(1).findIndex((group) => group !== undefined);
    tokens.push({ kind: GROUP_KINDS[groupIndex] ?? "plain", text: match[0] });
    cursor = index + match[0].length;
  }

  if (cursor < line.length) tokens.push({ kind: "plain", text: line.slice(cursor) });
  return tokens;
};

export const tokenizeSnippet = (code: string): CodeToken[][] => code.split("\n").map(tokenizeLine);
