import { useState, type ReactElement } from "react";
import { act, fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import { useUIStore } from "@/entities/ui-state";
import { CodeEditor } from "./CodeEditor";

const EditorHarness = (): ReactElement => {
  const [code, setCode] = useState("");
  return <CodeEditor code={code} onChange={setCode} filepath="main.js" />;
};

describe("CodeEditor history buttons", () => {
  beforeEach(() => {
    useUIStore.setState({ editorLinterEnabled: false });
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
});
