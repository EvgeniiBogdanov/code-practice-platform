import mermaid from "mermaid";
import { describe, expect, it } from "vitest";
import { parseMarkdownBlocks } from "@/shared/lib/markdown";

const ARTICLES = import.meta.glob<string>("../content/*.md", {
  query: "?raw",
  import: "default",
  eager: true,
});

const diagramsOf = (article: string): string[] =>
  parseMarkdownBlocks(article).flatMap((block) =>
    block.type === "mermaid" && block.code ? [block.code] : []
  );

describe("theory diagrams", () => {
  it("illustrates every article", () => {
    for (const [file, article] of Object.entries(ARTICLES)) {
      expect(diagramsOf(article).length, file).toBeGreaterThan(0);
    }
  });

  it("writes every diagram in valid Mermaid syntax", async () => {
    for (const [file, article] of Object.entries(ARTICLES)) {
      for (const code of diagramsOf(article)) {
        await expect(mermaid.parse(code), `${file}:\n${code}`).resolves.toBeTruthy();
      }
    }
  });
});
