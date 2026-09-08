import React from "react";
import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import styles from "./PlatformLogo.module.css";
import { PlatformLogo } from "./PlatformLogo";

describe("PlatformLogo", () => {
  it("renders SVG element with default size", () => {
    const { container } = render(<PlatformLogo />);
    const svg = container.querySelector("svg");
    expect(svg).toBeInTheDocument();
    expect(svg).toHaveAttribute("width", "28");
    expect(svg).toHaveAttribute("height", "28");
  });

  it("supports numeric and string sizes", () => {
    const { container: c1 } = render(<PlatformLogo size="sm" />);
    expect(c1.querySelector("svg")).toHaveAttribute("width", "20");

    const { container: c2 } = render(<PlatformLogo size="lg" />);
    expect(c2.querySelector("svg")).toHaveAttribute("width", "36");

    const { container: c3 } = render(<PlatformLogo size={48} />);
    expect(c3.querySelector("svg")).toHaveAttribute("width", "48");

    const { container: c4 } = render(<PlatformLogo size="34" />);
    expect(c4.querySelector("svg")).toHaveAttribute("width", "34");
    expect(c4.querySelector("svg")).toHaveAttribute("height", "34");
  });

  it("supports rendering without background and applies modifier class", () => {
    const { container } = render(<PlatformLogo withBackground={false} />);
    const rect = container.querySelector("rect");
    expect(rect).toBeNull();
    const svg = container.querySelector("svg");
    expect(svg).toHaveClass(styles.noBackground);
  });

  it("renders background card by default", () => {
    const { container } = render(<PlatformLogo />);
    const rects = container.querySelectorAll("rect");
    expect(rects.length).toBeGreaterThan(0);
  });

  it("renders without center circle node", () => {
    const { container } = render(<PlatformLogo />);
    const circle = container.querySelector("circle");
    expect(circle).toBeNull();
  });

  it("applies custom className", () => {
    const { container } = render(<PlatformLogo className="custom-logo" />);
    expect(container.querySelector("svg")).toHaveClass("custom-logo");
  });

  it("matches JavaScriptIcon rounding ratio on background card", () => {
    const { container } = render(<PlatformLogo />);
    const rect = container.querySelector("rect");
    expect(rect).toHaveAttribute("rx", "4");
  });
});
