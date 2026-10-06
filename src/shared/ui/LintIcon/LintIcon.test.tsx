import { render } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { LintIcon } from "./LintIcon";

describe("LintIcon", () => {
  it("renders stroke-based SVG with default props", () => {
    const { container } = render(<LintIcon />);
    const svg = container.querySelector("svg");
    expect(svg).toHaveAttribute("width", "24");
    expect(svg).toHaveAttribute("height", "24");
    expect(svg).toHaveAttribute("viewBox", "0 0 24 24");
    expect(svg).toHaveAttribute("stroke", "currentColor");
    expect(svg).toHaveAttribute("aria-hidden", "true");
  });

  it("applies custom size and className", () => {
    const { container } = render(<LintIcon size={14} className="custom-lint" />);
    const svg = container.querySelector("svg");
    expect(svg).toHaveAttribute("width", "14");
    expect(svg).toHaveClass("custom-lint");
  });

  it("is exposed to assistive tech when aria-label is provided", () => {
    const { getByLabelText } = render(<LintIcon aria-label="Lint" />);
    expect(getByLabelText("Lint")).not.toHaveAttribute("aria-hidden");
  });
});
