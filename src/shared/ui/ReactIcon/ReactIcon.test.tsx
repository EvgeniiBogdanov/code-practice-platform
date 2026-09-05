import { render } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { ReactIcon } from "./ReactIcon";

describe("ReactIcon", () => {
  it("renders SVG with default props", () => {
    const { container } = render(<ReactIcon />);
    const svg = container.querySelector("svg");
    expect(svg).toBeInTheDocument();
    expect(svg).toHaveAttribute("width", "24");
    expect(svg).toHaveAttribute("height", "24");
    expect(svg).toHaveAttribute("viewBox", "0 0 24 24");
    expect(svg).toHaveAttribute("aria-hidden", "true");
  });

  it("applies custom size and className", () => {
    const { container } = render(<ReactIcon size={16} className="custom-class" />);
    const svg = container.querySelector("svg");
    expect(svg).toHaveAttribute("width", "16");
    expect(svg).toHaveAttribute("height", "16");
    expect(svg).toHaveClass("custom-class");
  });

  it("sets accessible aria-label when provided", () => {
    const { getByLabelText } = render(<ReactIcon aria-label="React" />);
    const svg = getByLabelText("React");
    expect(svg).toBeInTheDocument();
    expect(svg).not.toHaveAttribute("aria-hidden");
  });

  it("renders official react atom path", () => {
    const { container } = render(<ReactIcon color="#61dafb" />);
    const path = container.querySelector("path");
    expect(path).toBeInTheDocument();
  });
});
