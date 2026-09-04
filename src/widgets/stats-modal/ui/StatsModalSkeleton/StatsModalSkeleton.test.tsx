import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { StatsModalSkeleton } from "./StatsModalSkeleton";

describe("StatsModalSkeleton", () => {
  it("renders skeleton container with accessible role and label", () => {
    render(<StatsModalSkeleton />);
    const container = screen.getByRole("status");
    expect(container).toBeInTheDocument();
    expect(container).toHaveAttribute("aria-label", "Загрузка статистики повторений");
  });

  it("renders interactive close button when onClose is provided and triggers callback", () => {
    const handleClose = vi.fn();
    render(<StatsModalSkeleton onClose={handleClose} />);

    const closeBtn = screen.getByRole("button", { name: "Закрыть статистику повторений" });
    expect(closeBtn).toBeInTheDocument();

    fireEvent.click(closeBtn);
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it("renders close button placeholder when onClose is not provided", () => {
    render(<StatsModalSkeleton />);
    expect(
      screen.queryByRole("button", { name: "Закрыть статистику повторений" })
    ).not.toBeInTheDocument();
  });

  it("supports custom className", () => {
    render(<StatsModalSkeleton className="custom-test-class" />);
    const container = screen.getByRole("status");
    expect(container).toHaveClass("custom-test-class");
  });

  it("renders pill-shaped badge skeletons for each stage item", () => {
    const { container } = render(<StatsModalSkeleton />);
    const stageItems = container.querySelectorAll('[class*="stageItem"]');
    expect(stageItems).toHaveLength(4);

    stageItems.forEach((item) => {
      // Last child is the badge skeleton
      const badgeSkeleton = item.lastElementChild;
      expect(badgeSkeleton).toBeInTheDocument();
      // Should have style or attributes matching 28px width, 20px height, 9999px radius
      expect(badgeSkeleton).toHaveStyle({ width: "28px", height: "20px", borderRadius: "9999px" });
    });
  });
});
