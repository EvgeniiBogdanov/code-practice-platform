import { describe, expect, it, vi } from "vitest";
import type React from "react";
import { handleEnterKey, handlePairsAndBackspace, producesText } from "./editor-key-helpers";

const key = (
  init: Partial<Parameters<typeof producesText>[0]>
): Parameters<typeof producesText>[0] => ({
  key: "a",
  ctrlKey: false,
  metaKey: false,
  altKey: false,
  ...init,
});

describe("producesText", () => {
  it("accepts plain, shifted and AltGr characters", () => {
    expect(producesText(key({ key: "a" }))).toBe(true);
    expect(producesText(key({ key: "{" }))).toBe(true);
    expect(
      producesText(
        key({ key: "{", ctrlKey: true, altKey: true, getModifierState: (n) => n === "AltGraph" })
      )
    ).toBe(true);
  });

  it("accepts a macOS Option symbol but not Alt+letter shortcuts", () => {
    expect(producesText(key({ key: "|", altKey: true }))).toBe(true);
    expect(producesText(key({ key: "d", altKey: true }))).toBe(false);
  });

  it("rejects Ctrl/Cmd shortcuts and named keys", () => {
    expect(producesText(key({ key: "c", ctrlKey: true }))).toBe(false);
    expect(producesText(key({ key: "c", metaKey: true }))).toBe(false);
    expect(producesText(key({ key: "Enter" }))).toBe(false);
  });
});

describe("handleEnterKey", () => {
  const press = (code: string, cursor: number, tabSize?: number): string | null => {
    let result: string | null = null;
    const handled = handleEnterKey(
      {
        key: "Enter",
        preventDefault: vi.fn(),
      } as unknown as React.KeyboardEvent<HTMLTextAreaElement>,
      { selectionStart: cursor, selectionEnd: cursor } as HTMLTextAreaElement,
      code,
      (next) => {
        result = next;
      },
      tabSize
    );
    return handled ? result : null;
  };

  it("indents one level after an opening bracket", () => {
    expect(press("if (a) {", 8)).toBe("if (a) {\n  ");
    expect(press("if (a) {", 8, 4)).toBe("if (a) {\n    ");
  });

  it("does not add a level on a blank line below an opening bracket", () => {
    const code = "if (a) {\n  ";
    expect(press(code, code.length)).toBe(`${code}\n  `);
  });

  it("splits a bracket pair onto three lines", () => {
    expect(press("f({})", 3)).toBe("f({\n  \n})");
  });
});

describe("handlePairsAndBackspace in HTML", () => {
  const typeQuote = (code: string, cursor: number): string | null => {
    let result: string | null = null;
    const handled = handlePairsAndBackspace(
      {
        key: '"',
        ctrlKey: false,
        metaKey: false,
        altKey: false,
        preventDefault: vi.fn(),
      } as unknown as React.KeyboardEvent<HTMLTextAreaElement>,
      { selectionStart: cursor, selectionEnd: cursor } as HTMLTextAreaElement,
      code,
      (next) => {
        result = next;
      },
      "index.html"
    );
    return handled ? result : null;
  };

  it("pairs quotes in script code but not in markup text", () => {
    const script = "<script>\n  x = \n</script>";
    expect(typeQuote(script, script.indexOf("\n</script>"))).toBe('<script>\n  x = ""\n</script>');
    const text = "<p> </p>";
    expect(typeQuote(text, 3)).toBeNull();
  });
});
