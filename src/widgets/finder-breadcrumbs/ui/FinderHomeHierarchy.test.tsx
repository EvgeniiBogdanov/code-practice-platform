import React from "react";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { FinderHomeHierarchy } from "./FinderHomeHierarchy";

describe("FinderHomeHierarchy", () => {
  it("renders home overview breadcrumb item with PlatformLogo icon", () => {
    const { container } = render(<FinderHomeHierarchy />);

    expect(screen.getByText("Обзор платформы")).toBeInTheDocument();

    const svg = container.querySelector("svg");
    expect(svg).toBeInTheDocument();
    expect(svg).toHaveAttribute("width", "14");
    expect(svg).toHaveAttribute("height", "14");
  });
});
