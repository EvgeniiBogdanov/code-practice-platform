import { render } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { JavaScriptIcon } from "./JavaScriptIcon";

describe("JavaScriptIcon", () => {
  it("renders SVG with default props", () => {
    const { container } = render(<JavaScriptIcon />);
    const svg = container.querySelector("svg");
    expect(svg).toBeInTheDocument();
    expect(svg).toHaveAttribute("width", "24");
    expect(svg).toHaveAttribute("height", "24");
    expect(svg).toHaveAttribute("viewBox", "0 0 24 24");
    expect(svg).toHaveAttribute("aria-hidden", "true");
  });

  it("applies custom size and className", () => {
    const { container } = render(<JavaScriptIcon size={16} className="custom-class" />);
    const svg = container.querySelector("svg");
    expect(svg).toHaveAttribute("width", "16");
    expect(svg).toHaveAttribute("height", "16");
    expect(svg).toHaveClass("custom-class");
  });

  it("sets accessible aria-label when provided", () => {
    const { getByLabelText } = render(<JavaScriptIcon aria-label="JavaScript" />);
    const svg = getByLabelText("JavaScript");
    expect(svg).toBeInTheDocument();
    expect(svg).not.toHaveAttribute("aria-hidden");
  });

  it("renders background rectangle and letter paths", () => {
    const { container } = render(<JavaScriptIcon color="#f59e0b" />);
    const rect = container.querySelector("rect");
    const path = container.querySelector("path");
    expect(rect).toBeInTheDocument();
    expect(rect).toHaveAttribute("rx", "3.5");
    expect(path).toBeInTheDocument();
  });
});
