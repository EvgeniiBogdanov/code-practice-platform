import { Editor } from "@tiptap/core";
import { afterEach, describe, expect, it } from "vitest";
import { createNoteExtensions } from "./noteExtensions";

const SAMPLE = [
  "# Заголовок",
  "",
  "Текст с **жирным**, *курсивом* и `кодом`.",
  "",
  "- пункт",
  "",
  "- [ ] задача",
  "",
  "> цитата",
  "",
  "```",
  "const a = 1;",
  "```",
].join("\n");

const createEditor = (markdown: string): Editor =>
  new Editor({ extensions: createNoteExtensions(), content: markdown, contentType: "markdown" });

const copyText = (editor: Editor): string =>
  editor.view.someProp("clipboardTextSerializer", (serialize) =>
    serialize(editor.state.selection.content(), editor.view)
  ) ?? "";

const paste = (editor: Editor, types: string[], text: string): boolean => {
  const event = {
    clipboardData: {
      types,
      getData: (type: string): string => (type === "text/plain" ? text : ""),
    },
    preventDefault: (): void => {},
  } as unknown as ClipboardEvent;
  return (
    editor.view.someProp("handlePaste", (handle) =>
      handle(editor.view, event, editor.state.doc.slice(0))
    ) ?? false
  );
};

describe("markdown clipboard", () => {
  let editor: Editor;

  afterEach(() => editor.destroy());

  it("keeps the markdown source through a render and back", () => {
    editor = createEditor(SAMPLE);

    expect(editor.getMarkdown().trimEnd()).toBe(SAMPLE);
    expect(editor.getHTML()).toContain("<strong>жирным</strong>");
  });

  it("copies the selection as markdown", () => {
    editor = createEditor(SAMPLE);
    editor.commands.selectAll();

    expect(copyText(editor)).toBe(SAMPLE);
  });

  it("copies a few words out of a heading as plain text", () => {
    editor = createEditor("# Заголовок страницы");
    editor.commands.setTextSelection({ from: 2, to: 6 });

    expect(copyText(editor)).toBe("агол");
  });

  it("pastes plain markdown text as blocks", () => {
    editor = createEditor("");

    expect(paste(editor, ["text/plain"], "## Идея\n\n- раз\n- два")).toBe(true);

    expect(editor.getHTML()).toContain("<h2>Идея</h2>");
    expect(editor.getHTML()).toContain("<li>");
  });

  it("leaves rich html pastes to the editor, but treats source-editor html as text", () => {
    editor = createEditor("");

    expect(paste(editor, ["text/plain", "text/html"], "**x**")).toBe(false);
    expect(paste(editor, ["text/plain", "text/html", "vscode-editor-data"], "**x**")).toBe(true);
  });
});

describe("pasting markdown that comes with html", () => {
  let editor: Editor;

  afterEach(() => editor.destroy());

  const paste = (html: string, text: string): boolean => {
    const event = {
      clipboardData: {
        types: ["text/plain", "text/html"],
        getData: (type: string): string =>
          type === "text/plain" ? text : type === "text/html" ? html : "",
      },
      preventDefault: (): void => {},
    } as unknown as ClipboardEvent;
    return (
      editor.view.someProp("handlePaste", (handle) =>
        handle(editor.view, event, editor.state.doc.slice(0))
      ) ?? false
    );
  };

  it("reads markdown source with code fences, so the code keeps its language", () => {
    editor = createEditor("");

    const handled = paste("<p>js</p><pre>const a = 1;</pre>", "```js\nconst a = 1;\n```");

    expect(handled).toBe(true);
    expect(editor.getJSON().content?.[0].attrs?.language).toBe("js");
  });

  it("leaves html without fences, and this editor's own copies, to the html parser", () => {
    editor = createEditor("");

    expect(paste("<p>text</p>", "text")).toBe(false);
    expect(paste('<p data-pm-slice="0 0 []">x</p>', "```js\nx\n```")).toBe(false);
  });
});
