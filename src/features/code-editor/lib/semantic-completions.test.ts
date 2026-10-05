import { describe, it, expect } from "vitest";
import type { CompletionItem } from "@/shared/lib/code-editor";
import { mergeCompletions } from "./semantic-completions";

const item = (prefix: string, kind: string, label = prefix): CompletionItem => ({
  prefix,
  label,
  detail: "",
  kind,
  insertText: label,
});

describe("mergeCompletions", () => {
  it("puts a snippet whose prefix is the typed word above fuzzy TypeScript matches", () => {
    const merged = mergeCompletions(
      [item("clearLog", "function"), item("CloseEvent", "var")],
      [item("clg", "snippet", "clg ⚡")],
      "clg"
    );
    expect(merged[0].label).toBe("clg ⚡");
  });

  it("keeps TypeScript order between equal matches and drops scraped words it knows", () => {
    const merged = mergeCompletions(
      [item("console", "var"), item("const", "keyword")],
      [item("console", "variable"), item("cons", "variable")],
      ""
    );
    expect(merged.map(({ label }) => label)).toEqual(["console", "const"]);
  });
});
