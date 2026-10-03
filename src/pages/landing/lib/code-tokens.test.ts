import { describe, expect, it } from "vitest";
import { tokenizeLine, tokenizeSnippet } from "./code-tokens";

const kinds = (line: string): string[] =>
  tokenizeLine(line)
    .filter((token) => token.kind !== "plain")
    .map((token) => `${token.kind}:${token.text}`);

describe("code tokens", () => {
  it("highlights keywords, calls, operators and numbers", () => {
    expect(kinds("const log = debounce((msg) => console.log(msg), 300);")).toEqual([
      "keyword:const",
      "function:debounce",
      "operator:=>",
      "function:log",
      "number:300",
    ]);
  });

  it("keeps strings and comments intact", () => {
    expect(kinds('log("a, b"); // выведет "c"')).toEqual([
      "function:log",
      'string:"a, b"',
      'comment:// выведет "c"',
    ]);
  });

  it("recognises JSX tags and types", () => {
    expect(kinds("<Counter initial={0} />")).toEqual(["tag:<Counter", "number:0", "tag:/>"]);
    expect(kinds("type Handler = Record<string, Listener>;")).toContain("type:Record");
  });

  it("preserves the original text when joined back", () => {
    const code = 'const total = items.reduce((sum, item) => sum + item.price, 0);\n  return "ok";';
    const joined = tokenizeSnippet(code)
      .map((line) => line.map((token) => token.text).join(""))
      .join("\n");

    expect(joined).toBe(code);
  });
});
