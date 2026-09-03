import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { StatsModalSkeleton } from "./StatsModalSkeleton";

describe("StatsModalSkeleton", () => {
  it("renders skeleton container with accessible role and label", () => {
    render(<StatsModalSkeleton />);
    const container = screen.getByRole("status");
    expect(container).toBeInTheDocument();
    expect(container).toHaveAttribute("aria-label", "Загрузка статистики повторений");
  });
});
