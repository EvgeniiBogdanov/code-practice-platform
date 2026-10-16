import React, { useRef } from "react";
import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { HighlightedCode } from "./HighlightedCode";

const Harness = ({ lines }: { lines: string[] }): React.JSX.Element => {
  const codeRef = useRef<HTMLElement>(null);
  return <HighlightedCode lines={lines} codeRef={codeRef} />;
};

const rows = (container: HTMLElement): Element[] => [
  ...(container.querySelector("code")?.children ?? []),
];

describe("HighlightedCode", () => {
  it("renders one row per line and keeps the document text", () => {
    const { container } = render(<Harness lines={["a", "", '<span class="hl-kw">b</span>']} />);
    expect(rows(container)).toHaveLength(3);
    expect(container.querySelector("code")?.textContent).toBe("a\n\nb\n");
  });

  it("rewrites only the edited line", () => {
    const { container, rerender } = render(<Harness lines={["one", "two", "three"]} />);
    const [first, second, third] = rows(container);
    rerender(<Harness lines={["one", "twos", "three"]} />);
    const next = rows(container);
    expect(next[0]).toBe(first);
    expect(next[1]).toBe(second);
    expect(next[2]).toBe(third);
    expect(second.textContent).toBe("twos\n");
  });

  it("inserts and removes rows in the middle without touching the rest", () => {
    const { container, rerender } = render(<Harness lines={["a", "b", "c"]} />);
    const [first, , last] = rows(container);
    rerender(<Harness lines={["a", "b", "x", "y", "c"]} />);
    expect(rows(container).map((row) => row.textContent)).toEqual([
      "a\n",
      "b\n",
      "x\n",
      "y\n",
      "c\n",
    ]);
    expect(rows(container)[0]).toBe(first);
    expect(rows(container)[4]).toBe(last);

    rerender(<Harness lines={["a", "c"]} />);
    expect(rows(container).map((row) => row.textContent)).toEqual(["a\n", "c\n"]);
    expect(rows(container)[0]).toBe(first);
    expect(rows(container)[1]).toBe(last);
  });
});
