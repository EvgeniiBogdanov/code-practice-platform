import { describe, expect, it } from "vitest";
import { getLanguageCapabilities, getLanguageId } from "./languageDetector";
import { LANGUAGES } from "./languageRegistry";

describe("language detection", () => {
  it.each([
    ["a.scss", "scss"],
    ["a.less", "less"],
    ["a.css", "css"],
    ["a.mjs", "javascript"],
    ["a.cts", "typescript"],
    ["Makefile", "plaintext"],
    ["config.yaml", "plaintext"],
  ])("%s -> %s", (path, id) => {
    expect(getLanguageId(path)).toBe(id);
  });

  it("resolves a language id given instead of a path", () => {
    for (const id of Object.keys(LANGUAGES)) expect(getLanguageId(id)).toBe(id);
  });

  it("gives SCSS and LESS the CSS features, their own parser and // comments", () => {
    for (const id of ["scss", "less"] as const) {
      expect(getLanguageCapabilities(id).supportsCssProperties).toBe(true);
      expect(LANGUAGES[id].comment.line.prefix).toBe("// ");
    }
    expect(LANGUAGES.scss.prettierParser).toBe("scss");
    expect(LANGUAGES.less.prettierParser).toBe("less");
  });
});
