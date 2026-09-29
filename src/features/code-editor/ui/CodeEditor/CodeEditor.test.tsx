import { useState, type ReactElement } from "react";
import { act, fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
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

  it("shows a single quick fix and hides it in read-only mode", () => {
    useUIStore.setState({ editorLinterEnabled: true });
    const { rerender } = render(
      <CodeEditor code="retrun 1" onChange={() => {}} filepath="main.js" />
    );
    expect(screen.getAllByText(/Опечатка/)).toHaveLength(1);

    rerender(<CodeEditor code="retrun 1" onChange={() => {}} filepath="main.js" readOnly />);
    expect(screen.queryByText(/Опечатка/)).not.toBeInTheDocument();
    expect(screen.getByRole<HTMLTextAreaElement>("textbox")).toHaveProperty("readOnly", true);
  });
});

describe("CodeEditor suggestions", () => {
  beforeEach(() => {
    useUIStore.setState({ editorLinterEnabled: false });
  });

  it("closes suggestions after clearing the text and opens them for a snippet prefix", () => {
    render(<EditorHarness />);
    const textarea = screen.getByRole<HTMLTextAreaElement>("textbox");

    fireEvent.input(textarea, {
      target: { value: "clg", selectionStart: 3, selectionEnd: 3 },
      data: "g",
      inputType: "insertText",
    });
    expect(screen.getByText(/clg ⚡/)).toBeInTheDocument();

    fireEvent.input(textarea, {
      target: { value: "", selectionStart: 0, selectionEnd: 0 },
      inputType: "deleteContentBackward",
    });
    expect(screen.queryByText(/clg ⚡/)).not.toBeInTheDocument();
  });
});
