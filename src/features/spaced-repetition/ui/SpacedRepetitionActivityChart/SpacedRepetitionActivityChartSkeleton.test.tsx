import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { SpacedRepetitionActivityChartSkeleton } from "./SpacedRepetitionActivityChartSkeleton";

describe("SpacedRepetitionActivityChartSkeleton", () => {
  it("renders status container with accessible loading label", () => {
    render(<SpacedRepetitionActivityChartSkeleton />);

    expect(screen.getByRole("status", { name: "Загрузка активности решений" })).toBeInTheDocument();
  });

  it("applies custom className", () => {
    render(<SpacedRepetitionActivityChartSkeleton className="custom-test-class" />);

    expect(screen.getByRole("status", { name: "Загрузка активности решений" })).toHaveClass(
      "custom-test-class"
    );
  });
});
