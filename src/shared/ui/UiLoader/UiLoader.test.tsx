import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { UiLoader } from "./UiLoader";

describe("UiLoader", () => {
  it("renders with default status role and accessible label", () => {
    render(<UiLoader />);

    const loader = screen.getByRole("status");
    expect(loader).toBeInTheDocument();
    expect(loader).toHaveAttribute("aria-label", "Загрузка...");
  });

  it("renders with custom label and shows visible text when showLabel is true", () => {
    render(<UiLoader label="Загрузка данных" showLabel />);

    const loader = screen.getByRole("status");
    expect(loader).toHaveAttribute("aria-label", "Загрузка данных");
    expect(screen.getByText("Загрузка данных")).toBeInTheDocument();
  });

  it("renders with center class when center is enabled", () => {
    const { container } = render(<UiLoader center data-testid="centered-loader" />);

    const loader = screen.getByTestId("centered-loader");
    expect(loader.className).toContain("center");
    expect(container.querySelector("svg")).toBeInTheDocument();
  });

  it("supports numeric custom sizes", () => {
    const { container } = render(<UiLoader size={40} />);

    const svg = container.querySelector("svg");
    expect(svg).toHaveStyle({ width: "40px", height: "40px" });
  });
});
