import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { UiSpinner } from "./UiSpinner";

describe("UiSpinner", () => {
  it("announces what is loading and draws the round icon", () => {
    const { container } = render(<UiSpinner label="Рисуем диаграмму" size={24} />);

    expect(screen.getByRole("status", { name: "Рисуем диаграмму" })).toBeInTheDocument();
    expect(container.querySelector("svg")).toHaveAttribute("width", "24");
  });

  it("stays out of the accessibility tree without a label", () => {
    const { container } = render(<UiSpinner />);

    expect(screen.queryByRole("status")).not.toBeInTheDocument();
    expect(container.firstChild).toHaveAttribute("aria-hidden", "true");
  });
});
