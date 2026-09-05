import { render } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { GitHubIcon } from "./GitHubIcon";

describe("GitHubIcon", () => {
  it("renders SVG with default props", () => {
    const { container } = render(<GitHubIcon />);
    const svg = container.querySelector("svg");
    expect(svg).toBeInTheDocument();
    expect(svg).toHaveAttribute("width", "24");
    expect(svg).toHaveAttribute("height", "24");
    expect(svg).toHaveAttribute("viewBox", "0 0 24 24");
    expect(svg).toHaveAttribute("aria-hidden", "true");
  });

  it("applies custom size and className", () => {
    const { container } = render(<GitHubIcon size={20} className="custom-github" />);
    const svg = container.querySelector("svg");
    expect(svg).toBeInTheDocument();
    expect(svg).toHaveAttribute("width", "20");
    expect(svg).toHaveAttribute("height", "20");
    expect(svg).toHaveClass("custom-github");
  });

  it("sets accessible aria-label when provided", () => {
    const { getByLabelText } = render(<GitHubIcon aria-label="GitHub Repository" />);
    const svg = getByLabelText("GitHub Repository");
    expect(svg).toBeInTheDocument();
    expect(svg).not.toHaveAttribute("aria-hidden");
  });

  it("renders official github mark path", () => {
    const { container } = render(<GitHubIcon color="#f59e0b" />);
    const path = container.querySelector("path");
    expect(path).toBeInTheDocument();
    expect(path).toHaveAttribute("fill", "currentColor");
  });
});
