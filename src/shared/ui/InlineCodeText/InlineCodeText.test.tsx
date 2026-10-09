import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { InlineCodeText } from "./InlineCodeText";

const codeOf = (text: string): string[] => {
  const { container } = render(<InlineCodeText>{text}</InlineCodeText>);
  return Array.from(container.querySelectorAll("code"), (node) => node.textContent ?? "");
};

describe("InlineCodeText", () => {
  it("wraps Latin identifiers and leaves Russian words as text", () => {
    expect(codeOf("getUserName возвращает строку даже для неизвестного id")).toEqual([
      "getUserName",
      "id",
    ]);
  });

  it("keeps member access, calls and mixed-script names in one piece", () => {
    expect(codeOf("user.id и fn() дают onИмяChange")).toEqual(["user.id", "fn()", "onИмяChange"]);
  });

  it("renders backticked fragments without the backticks", () => {
    expect(codeOf("поле `a-b` обязательно")).toEqual(["a-b"]);
  });

  it("keeps the surrounding text and punctuation", () => {
    const { container } = render(<InlineCodeText>{"null, а не undefined."}</InlineCodeText>);
    expect(container.textContent).toBe("null, а не undefined.");
  });
});
