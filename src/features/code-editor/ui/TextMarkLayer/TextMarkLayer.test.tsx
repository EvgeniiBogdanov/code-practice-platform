import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { TextMarkLayer } from "./TextMarkLayer";

const markTexts = (container: HTMLElement): (string | null)[] =>
  [...container.querySelectorAll("mark")].map((mark) => mark.textContent);

describe("TextMarkLayer", () => {
  it("marks exactly the given characters, not the whole word around them", () => {
    const code = "userName = userAge";
    const { container } = render(
      <TextMarkLayer
        code={code}
        variant="selection"
        marks={[
          { start: 0, end: 4 },
          { start: 11, end: 15 },
        ]}
      />
    );
    expect(markTexts(container)).toEqual(["user", "user"]);
    // The text is complete, so the layer wraps exactly like the code above it.
    expect(container.textContent).toBe(`${code}\n`);
  });

  it("distinguishes the active match of a search", () => {
    const { container } = render(
      <TextMarkLayer
        code="a a a"
        variant="find"
        marks={[
          { start: 0, end: 1 },
          { start: 2, end: 3 },
          { start: 4, end: 5 },
        ]}
        active={{ start: 2, end: 3 }}
      />
    );
    const marks = [...container.querySelectorAll("mark")];
    expect(marks.map((mark) => mark.className.split(" ").length)).toEqual([2, 3, 2]);
  });

  it("skips bare carets and unsorted or overlapping ranges without garbling the text", () => {
    const { container } = render(
      <TextMarkLayer
        code="abcdef"
        variant="selection"
        marks={[
          { start: 4, end: 6 },
          { start: 2, end: 2 },
          { start: 0, end: 3 },
          { start: 2, end: 5 },
        ]}
      />
    );
    expect(markTexts(container)).toEqual(["abc", "ef"]);
    expect(container.textContent).toBe("abcdef\n");
  });

  it("renders nothing without ranges", () => {
    const { container } = render(<TextMarkLayer code="abc" variant="find" marks={[]} />);
    expect(container).toBeEmptyDOMElement();
  });
});
