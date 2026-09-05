import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { SpacedRepetitionDistributionSkeleton } from "./SpacedRepetitionDistributionSkeleton";

describe("SpacedRepetitionDistributionSkeleton", () => {
  it("renders with role status and accessible label", () => {
    render(<SpacedRepetitionDistributionSkeleton />);

    const skeleton = screen.getByRole("status", { name: "Загрузка диаграммы распределения" });
    expect(skeleton).toBeInTheDocument();
  });

  it("applies custom className when provided", () => {
    const { container } = render(
      <SpacedRepetitionDistributionSkeleton className="custom-test-class" />
    );

    expect(container.firstChild).toHaveClass("custom-test-class");
  });

  it("renders 4 stage skeleton placeholders", () => {
    const { container } = render(<SpacedRepetitionDistributionSkeleton />);

    const stageItems = container.querySelectorAll('[class*="stageItem"]');
    expect(stageItems).toHaveLength(4);
  });
});
