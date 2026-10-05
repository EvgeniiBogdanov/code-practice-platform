import { describe, expect, it } from "vitest";
import { parseMarkdownBlocks } from "./markdownParser";

const LIST_WITH_CODE = [
  "1. **Создание контекстов**:",
  "   ```jsx",
  "   const AccordionContext = createContext(null);",
  "   ```",
  "   - `AccordionContext` координирует секции.",
  "",
  "2. **Корневой компонент**:",
  "   ```jsx",
  "   export function Accordion() {}",
  "   ```",
  "",
  "3. **Привязка подкомпонентов**",
].join("\n");

const htmlBlocks = (markdown: string): string[] =>
  parseMarkdownBlocks(markdown)
    .filter((block) => block.type === "markdown")
    .map((block) => block.html ?? "");

const countTag = (html: string, tag: string): number =>
  (html.match(new RegExp(`<${tag}[\\s>]`, "g")) ?? []).length;

describe("parseMarkdownBlocks", () => {
  it("keeps every html block a valid list when code blocks are nested in list items", () => {
    for (const html of htmlBlocks(LIST_WITH_CODE)) {
      expect(countTag(html, "li")).toBe((html.match(/<\/li>/g) ?? []).length);
      expect(countTag(html, "ol") + countTag(html, "ul")).toBe(
        (html.match(/<\/(ol|ul)>/g) ?? []).length
      );
      // <li> вне списка — признак разрезанной разметки
      expect(html.trimStart().startsWith("<li")).toBe(false);
      expect(html.trimStart().startsWith("</li")).toBe(false);
    }
  });

  it("preserves numbering and extracts code blocks in order", () => {
    const blocks = parseMarkdownBlocks(LIST_WITH_CODE);

    expect(blocks.map((block) => block.type)).toEqual([
      "markdown",
      "code",
      "markdown",
      "code",
      "markdown",
    ]);
    expect(blocks[1].code).toContain("AccordionContext");
    expect(blocks[2].html).toContain('<ol start="2">');
    expect(blocks[4].html).toContain('<ol start="3">');
  });

  it("renders content after a nested code block as a list continuation", () => {
    const [, , continuation] = parseMarkdownBlocks(LIST_WITH_CODE);
    expect(continuation.html).toContain('class="md-list-continuation"');
    expect(continuation.html).toContain("<ul>");
  });

  it("keeps lists without code intact", () => {
    const blocks = parseMarkdownBlocks("1. Первый\n2. Второй\n\n```js\nconst a = 1;\n```");
    expect(blocks).toHaveLength(2);
    expect(countTag(blocks[0].html ?? "", "li")).toBe(2);
  });
});
