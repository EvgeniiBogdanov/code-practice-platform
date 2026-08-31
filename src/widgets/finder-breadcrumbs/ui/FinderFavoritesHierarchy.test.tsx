import React from "react";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { FinderFavoritesHierarchy } from "./FinderFavoritesHierarchy";

describe("FinderFavoritesHierarchy", () => {
  it("renders favorites breadcrumb item with icon", () => {
    const { container } = render(<FinderFavoritesHierarchy />);

    expect(screen.getByText("Избранное")).toBeInTheDocument();
    expect(screen.getByTitle("Избранные задачи")).toBeInTheDocument();

    const svg = container.querySelector("svg");
    expect(svg).toBeInTheDocument();
    expect(svg).toHaveAttribute("fill", "currentColor");
    expect(svg).toHaveAttribute("stroke", "var(--accent-yellow)");
  });
});
