import { useState, type ReactElement } from "react";
import { act, fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { CodeEditor } from "../CodeEditor";

const Harness = ({ initial, readOnly }: { initial: string; readOnly?: boolean }): ReactElement => {
  const [code, setCode] = useState(initial);
  return <CodeEditor code={code} onChange={setCode} filepath="a.js" readOnly={readOnly} />;
};

const editor = (): HTMLTextAreaElement =>
  screen.getByRole<HTMLTextAreaElement>("textbox", { name: "Редактор кода" });
/** The editor opens with the caret on a blank first line, so no word seeds the query. */
const renderEditor = (initial: string, readOnly?: boolean): void => {
  render(<Harness initial={`\n${initial}`} readOnly={readOnly} />);
  editor().setSelectionRange(0, 0);
};
const press = (target: Element, init: KeyboardEventInit): void => {
  act(() => {
    fireEvent.keyDown(target, init);
  });
};
const type = (input: HTMLElement, value: string): void => {
  act(() => {
    fireEvent.change(input, { target: { value } });
  });
};

describe("find and replace", () => {
  it("opens with Ctrl+F seeded by the word under the caret and counts matches", () => {
    render(<Harness initial={"let foo = 1;\nfoo += foo;"} />);
    editor().setSelectionRange(5, 5);

    press(editor(), { key: "f", code: "KeyF", ctrlKey: true });

    const query = screen.getByRole<HTMLInputElement>("textbox", { name: "Найти" });
    expect(query.value).toBe("foo");
    expect(screen.getByText("Найдено: 3")).toBeInTheDocument();
  });

  it("steps through matches with Enter and Shift+Enter and wraps", () => {
    renderEditor("ab ab ab");
    press(editor(), { key: "f", code: "KeyF", ctrlKey: true });
    const query = screen.getByRole("textbox", { name: "Найти" });
    type(query, "ab");
    expect(screen.getByText("1 из 3")).toBeInTheDocument();
    expect([editor().selectionStart, editor().selectionEnd]).toEqual([1, 3]);

    press(query, { key: "Enter" });
    expect(editor().selectionStart).toBe(4);
    press(query, { key: "Enter" });
    press(query, { key: "Enter" });
    expect(editor().selectionStart).toBe(1);
    press(query, { key: "Enter", shiftKey: true });
    expect(editor().selectionStart).toBe(7);
    expect(screen.getByText("3 из 3")).toBeInTheDocument();
  });

  it("reports no results and invalid regular expressions", () => {
    renderEditor("abc");
    press(editor(), { key: "f", code: "KeyF", ctrlKey: true });
    const query = screen.getByRole("textbox", { name: "Найти" });

    type(query, "zzz");
    expect(screen.getByText("Нет результатов")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Регулярное выражение" }));
    type(query, "(");
    expect(screen.getByText("Неверное выражение")).toBeInTheDocument();
    expect(query).toHaveAttribute("aria-invalid", "true");
  });

  it("replaces the current match and then all", () => {
    renderEditor("cat cat cat");
    press(editor(), { key: "h", code: "KeyH", ctrlKey: true });
    type(screen.getByRole("textbox", { name: "Найти" }), "cat");
    type(screen.getByRole("textbox", { name: "Заменить на" }), "dog");

    fireEvent.click(screen.getByRole("button", { name: "Заменить" }));
    expect(editor().value).toBe("\ndog cat cat");

    fireEvent.click(screen.getByRole("button", { name: "Заменить все" }));
    expect(editor().value).toBe("\ndog dog dog");
    expect(screen.getByText("Заменено: 2")).toBeInTheDocument();
  });

  it("does not offer replacing in a read-only editor", () => {
    renderEditor("a", true);
    press(editor(), { key: "h", code: "KeyH", ctrlKey: true });
    expect(screen.getByRole("textbox", { name: "Найти" })).toBeInTheDocument();
    expect(screen.queryByRole("textbox", { name: "Заменить на" })).not.toBeInTheDocument();
  });

  it("closes with Escape and returns focus to the editor", () => {
    renderEditor("abc");
    press(editor(), { key: "f", code: "KeyF", ctrlKey: true });
    press(screen.getByRole("textbox", { name: "Найти" }), { key: "Escape" });

    expect(screen.queryByRole("search")).not.toBeInTheDocument();
    expect(document.activeElement).toBe(editor());
  });

  it("goes to a line with Ctrl+G", () => {
    renderEditor("one\ntwo\nthree");
    press(editor(), { key: "g", code: "KeyG", ctrlKey: true });
    const line = screen.getByRole("textbox", { name: "Номер строки" });
    type(line, "3");
    press(line, { key: "Enter" });

    // Line 3 of "\none\ntwo\nthree" is "two", which starts at offset 5.
    expect(editor().selectionStart).toBe(5);
    expect(screen.queryByRole("search")).not.toBeInTheDocument();
  });

  it("toggles search options with Alt+C in the search field", () => {
    renderEditor("Aa aa");
    press(editor(), { key: "f", code: "KeyF", ctrlKey: true });
    const query = screen.getByRole("textbox", { name: "Найти" });
    type(query, "aa");
    expect(screen.getByText(/из 2|Найдено: 2/)).toBeInTheDocument();

    press(query, { key: "c", code: "KeyC", altKey: true });
    expect(screen.getByRole("button", { name: "Учитывать регистр" })).toHaveAttribute(
      "aria-pressed",
      "true"
    );
    expect(screen.getByText(/из 1|Найдено: 1/)).toBeInTheDocument();
  });

  it("marks only the matched letters and keeps the current match distinct", () => {
    renderEditor("userName = userAge");
    press(editor(), { key: "f", code: "KeyF", ctrlKey: true });
    const query = screen.getByRole("textbox", { name: "Найти" });
    type(query, "user");

    const marks = [...document.querySelectorAll("mark")];
    expect(marks.map((mark) => mark.textContent)).toEqual(["user", "user"]);
    expect(marks[0].className).not.toBe(marks[1].className);

    press(query, { key: "Enter" });
    const after = [...document.querySelectorAll("mark")];
    expect(after[1].className).not.toBe(after[0].className);
    expect(screen.getByText("2 из 2")).toBeInTheDocument();
  });

  it("moves the caret position in the status bar with the selected match", () => {
    renderEditor("one\ntwo target");
    press(editor(), { key: "f", code: "KeyF", ctrlKey: true });
    type(screen.getByRole("textbox", { name: "Найти" }), "target");

    expect(screen.getByText(/Стр 3, Кол 5/)).toBeInTheDocument();
  });
});
