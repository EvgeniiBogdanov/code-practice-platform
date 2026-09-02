import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { MasteryDistributionPie } from "./MasteryDistributionPie";
import { type MasteryStats } from "@/entities/review";

describe("MasteryDistributionPie", () => {
  it("renders with empty mastery stats without error", () => {
    const emptyStats: MasteryStats = {
      totalCount: 0,
      totalReviewed: 0,
      learning: 0,
      reviewing: 0,
      mastered: 0,
      unreviewed: 0,
      dueToday: 0,
    };

    const { container } = render(<MasteryDistributionPie masteryStats={emptyStats} />);
    expect(container).toBeInTheDocument();
    expect(screen.getByText("0%")).toBeInTheDocument();
    expect(screen.getByText("Мастерство")).toBeInTheDocument();
  });

  it("renders with populated mastery stats showing correct mastery percentage", () => {
    const stats: MasteryStats = {
      totalCount: 10,
      totalReviewed: 6,
      learning: 1,
      reviewing: 2,
      mastered: 3,
      unreviewed: 4,
      dueToday: 1,
    };

    render(<MasteryDistributionPie masteryStats={stats} />);
    // 3 / 6 = 50%
    expect(screen.getByText("50%")).toBeInTheDocument();
    expect(screen.getByText("Мастерство")).toBeInTheDocument();
  });
});
