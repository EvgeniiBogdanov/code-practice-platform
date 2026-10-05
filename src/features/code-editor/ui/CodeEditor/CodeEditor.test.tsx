import { useState, type ReactElement } from "react";
import { act, fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useUIStore } from "@/entities/ui-state";
import { activateCodeHistoryTask } from "../../model/useCodeHistory";
import { CodeEditor } from "./CodeEditor";

const EditorHarness = ({ initial = "" }: { initial?: string }): ReactElement => {
  const [code, setCode] = useState(initial);
  return <CodeEditor code={code} onChange={setCode} filepath="main.js" />;
};

const FilesHarness = (): ReactElement => {
  const [codes, setCodes] = useState(["one", "two"]);
  const [activeFileIdx, setActiveFileIdx] = useState(0);
  return (
    <>
      <button type="button" onClick={() => setActiveFileIdx(1 - activeFileIdx)}>
        Switch file
      </button>
      <CodeEditor
        key={activeFileIdx}
        code={codes[activeFileIdx]}
        onChange={(code) =>
          setCodes((previous) =>
            previous.map((value, index) => (index === activeFileIdx ? code : value))
          )
        }
        filepath={`file-${activeFileIdx}.js`}
        historyScope={{ taskKey: "javascript:1", documentKey: `candidate:${activeFileIdx}` }}
      />
    </>
  );
};

describe("CodeEditor history buttons", () => {
  beforeEach(() => {
    useUIStore.setState({ editorLinterEnabled: false });
    activateCodeHistoryTask(null);
  });

  it("restores typed code with undo and redo buttons", async () => {
    render(<EditorHarness />);
    const textarea = screen.getByRole<HTMLTextAreaElement>("textbox");
    fireEvent.input(textarea, {
      target: { value: "hello", selectionStart: 5, selectionEnd: 5 },
      data: "hello",
      inputType: "insertFromPaste",
    });
    expect(textarea.value).toBe("hello");

    fireEvent.click(screen.getByRole("button", { name: "Отменить (Ctrl+Z)" }));
    expect(textarea.value).toBe("");

    fireEvent.click(screen.getByRole("button", { name: "Повторить (Ctrl+Y)" }));
    expect(textarea.value).toBe("hello");
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });
    expect(textarea.selectionStart).toBe(5);
  });

  it("keeps undo and redo available after switching between task files", () => {
    activateCodeHistoryTask("javascript:1");
    render(<FilesHarness />);
    const textarea = screen.getByRole<HTMLTextAreaElement>("textbox");
    fireEvent.input(textarea, {
      target: { value: "one!", selectionStart: 4, selectionEnd: 4 },
      data: "!",
      inputType: "insertText",
    });
    fireEvent.click(screen.getByRole("button", { name: "Switch file" }));
    expect(screen.getByRole<HTMLTextAreaElement>("textbox").value).toBe("two");
    fireEvent.click(screen.getByRole("button", { name: "Switch file" }));
    expect(screen.getByRole<HTMLTextAreaElement>("textbox").value).toBe("one!");
    fireEvent.click(screen.getByRole("button", { name: "Отменить (Ctrl+Z)" }));
    expect(screen.getByRole<HTMLTextAreaElement>("textbox").value).toBe("one");
    fireEvent.click(screen.getByRole("button", { name: "Повторить (Ctrl+Y)" }));
    expect(screen.getByRole<HTMLTextAreaElement>("textbox").value).toBe("one!");
  });

  it.each(["shortcut", "toolbar"])(
    "clears additional selections after undoing a multi-cursor edit via %s",
    (method) => {
      render(<EditorHarness initial="foo foo" />);
      const textarea = screen.getByRole<HTMLTextAreaElement>("textbox");
      textarea.setSelectionRange(0, 3);
      fireEvent.keyDown(textarea, { key: "l", ctrlKey: true, shiftKey: true });
      fireEvent.keyDown(textarea, { key: "x" });
      expect(textarea.value).toBe("x x");
      expect(screen.getByText("2 выделений")).toBeInTheDocument();

      if (method === "shortcut") {
        fireEvent.keyDown(textarea, { key: "z", ctrlKey: true });
      } else {
        fireEvent.click(screen.getByRole("button", { name: "Отменить (Ctrl+Z)" }));
      }
      expect(textarea.value).toBe("foo foo");
      expect(screen.queryByText("2 выделений")).not.toBeInTheDocument();
    }
  );
});

describe("CodeEditor suggestions", () => {
  beforeEach(() => {
    useUIStore.setState({ editorLinterEnabled: false });
  });

  it("closes suggestions after clearing the text and opens them for a snippet prefix", () => {
    // Matched letters are wrapped in <mark>, so the label is matched by its whole text.
    const snippetLabel = (_: string, element: Element | null): boolean =>
      element?.tagName === "SPAN" && /clg ⚡/.test(element.textContent ?? "");
    render(<EditorHarness />);
    const textarea = screen.getByRole<HTMLTextAreaElement>("textbox");

    fireEvent.input(textarea, {
      target: { value: "clg", selectionStart: 3, selectionEnd: 3 },
      data: "g",
      inputType: "insertText",
    });
    expect(screen.getByText(snippetLabel)).toBeInTheDocument();

    fireEvent.input(textarea, {
      target: { value: "", selectionStart: 0, selectionEnd: 0 },
      inputType: "deleteContentBackward",
    });
    expect(screen.queryByText(snippetLabel)).not.toBeInTheDocument();
  });

  it("keeps keyboard selection after ArrowDown keyup", () => {
    render(<EditorHarness />);
    const textarea = screen.getByRole<HTMLTextAreaElement>("textbox");
    fireEvent.input(textarea, {
      target: { value: "console.", selectionStart: 8, selectionEnd: 8 },
      data: ".",
      inputType: "insertText",
    });
    const suggestions = screen.getByRole("listbox");
    expect(suggestions?.children.length).toBeGreaterThan(1);

    fireEvent.keyDown(textarea, { key: "ArrowDown" });
    fireEvent.keyUp(textarea, { key: "ArrowDown" });

    expect(suggestions?.children[1]?.className).toContain("selected");
    expect(suggestions?.children[0]?.className).not.toContain("selected");
  });

  it("toggles fullscreen only in the editor that has focus when F11 is pressed", () => {
    const first = vi.fn();
    const second = vi.fn();
    render(
      <>
        <CodeEditor code="a" onChange={vi.fn()} filepath="a.js" onToggleFullscreen={first} />
        <CodeEditor code="b" onChange={vi.fn()} filepath="b.js" onToggleFullscreen={second} />
      </>
    );
    screen.getAllByRole<HTMLTextAreaElement>("textbox")[1].focus();

    fireEvent.keyDown(window, { key: "F11" });

    expect(first).not.toHaveBeenCalled();
    expect(second).toHaveBeenCalledTimes(1);
  });

  it("ignores F11 when no editor is focused or hovered", () => {
    const toggle = vi.fn();
    render(<CodeEditor code="a" onChange={vi.fn()} filepath="a.js" onToggleFullscreen={toggle} />);

    fireEvent.keyDown(window, { key: "F11" });

    expect(toggle).not.toHaveBeenCalled();
  });

  it("exposes the open suggestion list to assistive technology", () => {
    render(<EditorHarness />);
    const textarea = screen.getByRole<HTMLTextAreaElement>("textbox", { name: "Редактор кода" });
    expect(textarea).toHaveAttribute("aria-multiline", "true");
    expect(textarea).not.toHaveAttribute("aria-controls");

    fireEvent.input(textarea, {
      target: { value: "console.", selectionStart: 8, selectionEnd: 8 },
      data: ".",
      inputType: "insertText",
    });
    const listbox = screen.getByRole("listbox");
    expect(textarea).toHaveAttribute("aria-controls", listbox.id);
    const selected = screen
      .getAllByRole("option")
      .find((option) => option.getAttribute("aria-selected") === "true");
    expect(textarea).toHaveAttribute("aria-activedescendant", selected?.id);

    fireEvent.keyDown(textarea, { key: "ArrowDown" });
    expect(textarea.getAttribute("aria-activedescendant")).not.toBe(selected?.id);
  });

  it("marks only the selected letters of each Ctrl+D match, not the whole identifiers", () => {
    render(<EditorHarness initial={"userName = userAge;\nuserName = 1;"} />);
    const textarea = screen.getByRole<HTMLTextAreaElement>("textbox");
    textarea.setSelectionRange(0, 4);

    fireEvent.keyDown(textarea, { key: "d", code: "KeyD", ctrlKey: true });
    fireEvent.keyDown(textarea, { key: "d", code: "KeyD", ctrlKey: true });

    const marks = [...document.querySelectorAll("pre mark")].map((mark) => mark.textContent);
    expect(marks).toEqual(["user", "user", "user"]);
    // The syntax highlighter no longer wraps the whole token in a selection.
    expect(document.querySelector("pre .hl-multi-selected")).toBeNull();
  });
});
