import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { CodeText } from "./CodeText";

describe("CodeText", () => {
  it("colours keywords and keeps the text readable", () => {
    const { container } = render(<CodeText code="const userName: string" />);
    expect(container.textContent).toBe("const userName: string");
    expect(container.querySelector(".hl-kw")?.textContent).toBe("const");
  });

  it("escapes markup in the code instead of inserting it", () => {
    const { container } = render(<CodeText code="<img src=x onerror=alert(1)>" />);
    expect(container.querySelector("img")).toBeNull();
    expect(container.textContent).toContain("<img");
  });
});
