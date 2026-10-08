import { Editor } from "@tiptap/core";
import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";
import { toKnownLanguage } from "./codeLanguageHints";
import { createNoteExtensions } from "./noteExtensions";

const createEditor = (): Editor =>
  new Editor({ extensions: createNoteExtensions(), content: "", contentType: "markdown" });

const codeBlocks = (editor: Editor): Array<string | null> =>
  (editor.getJSON().content ?? [])
    .filter((node) => node.type === "codeBlock")
    .map((node) => node.attrs?.language ?? null);

const paragraphs = (editor: Editor): string[] =>
  (editor.getJSON().content ?? [])
    .filter((node) => node.type === "paragraph")
    .map((node) => node.content?.map((part) => ("text" in part ? part.text : "")).join("") ?? "")
    .filter((text) => text !== "");

describe("toKnownLanguage", () => {
  it("accepts the names the code window lists, in any case, and nothing else", () => {
    expect(toKnownLanguage("js")).toBe("js");
    expect(toKnownLanguage(" JSON ")).toBe("json");
    expect(toKnownLanguage("bash")).toBe("bash");
    expect(toKnownLanguage("Ошибка")).toBeNull();
    expect(toKnownLanguage("hello world")).toBeNull();
    expect(toKnownLanguage("")).toBeNull();
  });
});

describe("pasting code from the web", () => {
  let editor: Editor | null = null;

  // jsdom has no ClipboardEvent, which `view.pasteHTML` creates.
  beforeAll(() => {
    vi.stubGlobal("ClipboardEvent", class extends Event {});
  });

  afterEach(() => editor?.destroy());

  /** Pastes into a fresh, empty note. */
  const paste = (html: string): Editor => {
    editor?.destroy();
    editor = createEditor();
    editor.view.pasteHTML(html);
    return editor;
  };

  it("takes a language label above a code block as the block's language", () => {
    const note = paste("<p>Пример:</p><p>js</p><pre><code>const a = 1;</code></pre><p>Дальше</p>");

    expect(codeBlocks(note)).toEqual(["js"]);
    expect(paragraphs(note)).toEqual(["Пример:", "Дальше"]);
  });

  it("finds the language in the usual class and attribute markers", () => {
    expect(codeBlocks(paste('<pre><code class="hljs language-css">a { }</code></pre>'))).toEqual([
      "css",
    ]);
    expect(
      codeBlocks(paste('<div class="highlight highlight-source-json"><pre>{ }</pre></div>'))
    ).toEqual(["json"]);
    expect(
      codeBlocks(paste('<pre data-language="TypeScript"><code>let a: number;</code></pre>'))
    ).toEqual(["typescript"]);
  });

  it("keeps a label that is ordinary text, and a language the block already has", () => {
    const text = paste("<p>Итог</p><pre><code>text</code></pre>");
    expect(codeBlocks(text)).toEqual([null]);
    expect(paragraphs(text)).toEqual(["Итог"]);

    const marked = paste('<p>css</p><pre><code class="language-js">x</code></pre>');
    expect(codeBlocks(marked)).toEqual(["js"]);
    expect(paragraphs(marked)).toEqual(["css"]);
  });
});
