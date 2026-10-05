import { useState, type ReactElement } from "react";
import { act, fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useUIStore } from "@/entities/ui-state";
import { useCodeEditor } from "./useCodeEditor";

const EditorHarness = ({
  initial = "",
  filepath = "App.tsx",
  readOnly = false,
}: {
  initial?: string;
  filepath?: string;
  readOnly?: boolean;
}): ReactElement => {
  const [code, onChange] = useState(initial);
  const { textareaRef, handleTextChange, handleKeyDown } = useCodeEditor({
    code,
    onChange,
    filepath,
    readOnly,
  });
  return (
    <textarea
      aria-label="code"
      ref={textareaRef}
      value={code}
      onChange={handleTextChange}
      onKeyDown={handleKeyDown}
      readOnly={readOnly}
    />
  );
};

const input = (
  textarea: HTMLTextAreaElement,
  value: string,
  data: string,
  inputType = "insertText"
): void => {
  fireEvent.input(textarea, {
    target: { value, selectionStart: value.length, selectionEnd: value.length },
    data,
    inputType,
  });
};

describe("markup editor input", () => {
  beforeEach(() => {
    useUIStore.setState({ editorLinterEnabled: false });
  });

  describe.each(["App.jsx", "App.tsx", "index.html"])("tag acceptance in %s", (filepath) => {
    it.each(["button", "dialog", "aside", "h6", "svg", "path", "feGaussianBlur", "my-button"])(
      "expands %s with Tab and Enter",
      async (tag) => {
        for (const key of ["Tab", "Enter"]) {
          const view = render(<EditorHarness filepath={filepath} />);
          const textarea = screen.getByRole<HTMLTextAreaElement>("textbox");
          input(textarea, tag, tag.slice(-1));
          fireEvent.keyDown(textarea, { key });
          await act(async () => {
            await new Promise((resolve) => setTimeout(resolve, 0));
          });
          expect(textarea.value).toBe(`<${tag}></${tag}>`);
          expect(textarea.selectionStart).toBe(tag.length + 2);
          view.unmount();
        }
      }
    );
  });

  it("accepts the button suggestion while the name is incomplete", async () => {
    render(<EditorHarness />);
    const textarea = screen.getByRole<HTMLTextAreaElement>("textbox");
    input(textarea, "but", "t");
    fireEvent.keyDown(textarea, { key: "Tab" });
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });
    expect(textarea.value).toBe("<button></button>");
    expect(textarea.selectionStart).toBe(8);
  });

  it("closes a typed tag as one undoable edit", async () => {
    render(<EditorHarness initial="<div" />);
    const textarea = screen.getByRole<HTMLTextAreaElement>("textbox");
    input(textarea, "<div>", ">");
    expect(textarea.value).toBe("<div></div>");
    expect(textarea.selectionStart).toBe(5);
    fireEvent.keyDown(textarea, { key: "z", ctrlKey: true });
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 10));
    });
    expect(textarea.value).toBe("<div");
  });

  it.each(["App.jsx", "App.tsx", "index.html"])(
    "keeps an existing closing tag in sync in %s",
    (filepath) => {
      render(<EditorHarness initial="<div></div>" filepath={filepath} />);
      const textarea = screen.getByRole<HTMLTextAreaElement>("textbox");

      fireEvent.input(textarea, {
        target: { value: "<di></div>", selectionStart: 3, selectionEnd: 3 },
        inputType: "deleteContentBackward",
      });
      expect(textarea.value).toBe("<di></di>");

      fireEvent.input(textarea, {
        target: { value: "<div></di>", selectionStart: 4, selectionEnd: 4 },
        data: "v",
        inputType: "insertText",
      });
      expect(textarea.value).toBe("<div></div>");
      expect(textarea.selectionStart).toBe(4);
    }
  );

  it("fills an empty JSX closing tag while typing the opening name", () => {
    render(<EditorHarness initial="<></>" filepath="App.jsx" />);
    const textarea = screen.getByRole<HTMLTextAreaElement>("textbox");

    fireEvent.input(textarea, {
      target: { value: "<d></>", selectionStart: 2, selectionEnd: 2 },
      data: "d",
      inputType: "insertText",
    });
    expect(textarea.value).toBe("<d></d>");

    fireEvent.input(textarea, {
      target: { value: "<di></d>", selectionStart: 3, selectionEnd: 3 },
      data: "i",
      inputType: "insertText",
    });
    expect(textarea.value).toBe("<di></di>");
  });

  it("undoes a typed word together and redoes it with Ctrl+Y", async () => {
    render(<EditorHarness />);
    const textarea = screen.getByRole<HTMLTextAreaElement>("textbox");
    input(textarea, "a", "a");
    input(textarea, "ab", "b");
    input(textarea, "abc", "c");
    fireEvent.keyDown(textarea, { key: "z", ctrlKey: true });
    expect(textarea.value).toBe("");
    fireEvent.keyDown(textarea, { key: "y", ctrlKey: true });
    expect(textarea.value).toBe("abc");
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });
    expect(textarea.selectionStart).toBe(3);
  });

  it("indents and outdents selected lines with Tab and Shift+Tab", async () => {
    render(<EditorHarness initial={"one\ntwo\nthree"} filepath="main.js" />);
    const textarea = screen.getByRole<HTMLTextAreaElement>("textbox");
    textarea.focus();
    textarea.setSelectionRange(0, 8);
    expect([textarea.selectionStart, textarea.selectionEnd]).toEqual([0, 8]);
    fireEvent.keyDown(textarea, { key: "Tab" });
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });
    expect(textarea.value).toBe("  one\n  two\nthree");
    expect([textarea.selectionStart, textarea.selectionEnd]).toEqual([0, 12]);

    fireEvent.keyDown(textarea, { key: "Tab", shiftKey: true });
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });
    expect(textarea.value).toBe("one\ntwo\nthree");
    expect([textarea.selectionStart, textarea.selectionEnd]).toEqual([0, 8]);
  });

  it("outdents the current line with Shift+Tab", async () => {
    render(<EditorHarness initial="  value" filepath="main.js" />);
    const textarea = screen.getByRole<HTMLTextAreaElement>("textbox");
    textarea.setSelectionRange(4, 4);
    fireEvent.keyDown(textarea, { key: "Tab", shiftKey: true });
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });
    expect(textarea.value).toBe("value");
    expect(textarea.selectionStart).toBe(2);
  });

  it.each(["insertFromPaste", "insertCompositionText"])("does not rewrite %s", (inputType) => {
    render(<EditorHarness />);
    const textarea = screen.getByRole<HTMLTextAreaElement>("textbox");
    input(textarea, "<div>", ">", inputType);
    expect(textarea.value).toBe("<div>");
  });

  it("indents between paired tags and closes the nearest ancestor on slash", async () => {
    const { unmount } = render(<EditorHarness initial="<div></div>" />);
    let textarea = screen.getByRole<HTMLTextAreaElement>("textbox");
    textarea.setSelectionRange(5, 5);
    fireEvent.keyDown(textarea, { key: "Enter" });
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 10));
    });
    expect(textarea.value).toBe("<div>\n  \n</div>");
    expect(textarea.selectionStart).toBe(8);
    unmount();
    render(<EditorHarness initial="<div><span></span><" />);
    textarea = screen.getByRole<HTMLTextAreaElement>("textbox");
    textarea.setSelectionRange(textarea.value.length, textarea.value.length);
    fireEvent.keyDown(textarea, { key: "/" });
    expect(textarea.value).toBe("<div><span></span></div>");
  });

  it("does not consume composing keys or mutate readonly code", () => {
    render(<EditorHarness initial="<div" readOnly />);
    const textarea = screen.getByRole<HTMLTextAreaElement>("textbox");
    const change = vi.fn();
    textarea.addEventListener("input", change);
    fireEvent.keyDown(textarea, { key: "Enter" });
    expect(textarea.value).toBe("<div");
    expect(change).not.toHaveBeenCalled();
  });
});

it("closes tags at multiple cursors", () => {
  render(<EditorHarness initial={"<div\n<div"} />);
  const textarea = screen.getByRole<HTMLTextAreaElement>("textbox");
  textarea.setSelectionRange(1, 4);
  fireEvent.keyDown(textarea, { key: "l", ctrlKey: true, shiftKey: true });
  fireEvent.keyDown(textarea, { key: "ArrowRight" });
  fireEvent.keyDown(textarea, { key: ">" });
  expect(textarea.value).toBe("<div></div>\n<div></div>");
});

it("drops JSX suggestions when switching to a JS file", async () => {
  const view = render(<EditorHarness />);
  const textarea = screen.getByRole<HTMLTextAreaElement>("textbox");
  input(textarea, "div", "v");
  view.rerender(<EditorHarness filepath="main.js" />);
  fireEvent.keyDown(textarea, { key: "Tab" });
  await act(async () => {
    await new Promise((resolve) => setTimeout(resolve, 10));
  });
  expect(textarea.value).toBe("div  ");
});
