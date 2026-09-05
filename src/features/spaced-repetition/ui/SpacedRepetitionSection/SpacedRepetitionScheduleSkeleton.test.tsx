import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { SpacedRepetitionScheduleSkeleton } from "./SpacedRepetitionScheduleSkeleton";

describe("SpacedRepetitionScheduleSkeleton", () => {
  it("renders with role status and accessible label", () => {
    render(<SpacedRepetitionScheduleSkeleton />);

    const skeleton = screen.getByRole("status", { name: "Загрузка графика повторений" });
    expect(skeleton).toBeInTheDocument();
  });

  it("applies custom className when provided", () => {
    const { container } = render(
      <SpacedRepetitionScheduleSkeleton className="custom-schedule-class" />
    );

    expect(container.firstChild).toHaveClass("custom-schedule-class");
  });

  it("renders 7 bar column placeholders for all time buckets", () => {
    const { container } = render(<SpacedRepetitionScheduleSkeleton />);

    const barCols = container.querySelectorAll('[class*="barCol"]');
    expect(barCols).toHaveLength(7);

    const labelCols = container.querySelectorAll('[class*="labelCol"]');
    expect(labelCols).toHaveLength(7);
  });
});
