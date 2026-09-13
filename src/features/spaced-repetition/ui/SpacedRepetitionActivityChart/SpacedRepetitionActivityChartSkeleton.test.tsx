import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { SpacedRepetitionActivityChartSkeleton } from "./SpacedRepetitionActivityChartSkeleton";
import styles from "./SpacedRepetitionActivityChart.module.css";

let mockDimensions = { width: 984, height: 112 };

vi.mock("@/shared/lib/hooks", () => ({
  useParentSize: () => [{ current: null }, mockDimensions],
}));

describe("SpacedRepetitionActivityChartSkeleton", () => {
  it("renders status container with accessible loading label and dynamic height", () => {
    mockDimensions = { width: 984, height: 112 };
    render(<SpacedRepetitionActivityChartSkeleton endDate={new Date(2026, 8, 7)} />);

    const skeleton = screen.getByRole("status", {
      name: "Загрузка активности решений",
    });
    expect(skeleton).toBeInTheDocument();

    const placeholder = skeleton.querySelector(`.${styles.chartPlaceholder}`);
    expect(placeholder).toHaveStyle({ height: "157px" });
  });

  it("applies custom className", () => {
    render(<SpacedRepetitionActivityChartSkeleton className="custom-test-class" />);

    const skeleton = screen.getByRole("status", {
      name: "Загрузка активности решений",
    });
    expect(skeleton).toHaveClass("custom-test-class");
  });
});
