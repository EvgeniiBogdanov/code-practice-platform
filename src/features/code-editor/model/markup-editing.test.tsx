import { useState, type ReactElement } from "react";
import { act, fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useUIStore } from "@/entities/ui-state";
import { useCodeEditor } from "./use-code-editor";

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
  const editor = useCodeEditor({ code, onChange, filepath, readOnly });
  return (
    <textarea
      aria-label="code"
      ref={editor.textareaRef}
      value={code}
      onChange={editor.handleTextChange}
      onKeyDown={editor.handleKeyDown}
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

  it("accepts a bare tag with Tab and places the cursor inside", async () => {
    render(<EditorHarness />);
    const textarea = screen.getByRole<HTMLTextAreaElement>("textbox");
    input(textarea, "div", "v");
    fireEvent.keyDown(textarea, { key: "Tab" });
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 10));
    });
    expect(textarea.value).toBe("<div></div>");
    expect(textarea.selectionStart).toBe(5);
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
