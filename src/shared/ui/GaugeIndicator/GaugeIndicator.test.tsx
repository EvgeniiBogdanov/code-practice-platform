import React from "react";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { GaugeIndicator } from "./GaugeIndicator";

describe("GaugeIndicator", () => {
  it("renders properly with default props", () => {
    render(<GaugeIndicator value={85} />);
    const indicator = screen.getByRole("img");
    expect(indicator).toBeInTheDocument();
    expect(indicator).toHaveAttribute("aria-label", "Индикатор вероятности: 85%");
  });

  it("does not render native title attribute when title is provided (uses Tooltip)", () => {
    render(<GaugeIndicator value={85} title="Вероятность: 85%" />);
    const indicator = screen.getByRole("img");
    expect(indicator).not.toHaveAttribute("title");
  });

  it("clamps needle angle for 0%", () => {
    const { container } = render(<GaugeIndicator value={0} />);
    const group = container.querySelector("g[transform]");
    expect(group).toHaveAttribute("transform", "rotate(-130.0, 50, 50)");
  });

  it("clamps needle angle for 100%", () => {
    const { container } = render(<GaugeIndicator value={100} />);
    const group = container.querySelector("g[transform]");
    expect(group).toHaveAttribute("transform", "rotate(130.0, 50, 50)");
  });

  it("calculates middle angle for 50%", () => {
    const { container } = render(<GaugeIndicator value={50} />);
    const group = container.querySelector("g[transform]");
    expect(group).toHaveAttribute("transform", "rotate(0.0, 50, 50)");
  });

  it("clamps negative values to 0%", () => {
    const { container } = render(<GaugeIndicator value={-20} />);
    const group = container.querySelector("g[transform]");
    expect(group).toHaveAttribute("transform", "rotate(-130.0, 50, 50)");
  });

  it("clamps values above 100 to 100%", () => {
    const { container } = render(<GaugeIndicator value={150} />);
    const group = container.querySelector("g[transform]");
    expect(group).toHaveAttribute("transform", "rotate(130.0, 50, 50)");
  });

  it("applies custom size and class name", () => {
    const { container } = render(<GaugeIndicator value={70} size={24} className="custom-gauge" />);
    const svg = container.querySelector("svg");
    expect(svg).toHaveAttribute("width", "24");
    expect(svg).toHaveAttribute("height", "24");
    expect(screen.getByRole("img")).toHaveClass("custom-gauge");
  });
});
