import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import type { MasteryStats } from "@/entities/review";
import { SpacedRepetitionDistributionTab } from "./SpacedRepetitionDistributionTab";

// Mock MasteryDistributionPie to isolate tab rendering
vi.mock("../MasteryDistributionPie", () => ({
  MasteryDistributionPie: () => <div data-testid="mastery-distribution-pie" />,
}));

describe("SpacedRepetitionDistributionTab", () => {
  const mockStats: MasteryStats = {
    mastered: 42,
    reviewing: 15,
    learning: 8,
    unreviewed: 20,
    totalReviewed: 65,
    totalCount: 85,
    dueToday: 5,
  };

  it("renders all 4 stages with correct titles and descriptions", () => {
    render(
      <SpacedRepetitionDistributionTab masteryStats={mockStats} scopeLabel="JavaScript" />
    );

    expect(screen.getByText("Уровни закрепления SM-2:")).toBeInTheDocument();
    expect(screen.getByText("Мастер (30-60+ дней)")).toBeInTheDocument();
    expect(screen.getByText("Закрепление (7-14 дней)")).toBeInTheDocument();
    expect(screen.getByText("Изучение (1-3 дня)")).toBeInTheDocument();
    expect(screen.getByText("Ещё не в графике")).toBeInTheDocument();

    expect(
      screen.getByText("Задачи JavaScript, ожидающие решения")
    ).toBeInTheDocument();
  });

  it("renders counts inside reusable gray Badge components", () => {
    const { container } = render(
      <SpacedRepetitionDistributionTab masteryStats={mockStats} scopeLabel="JavaScript" />
    );

    // Verify counts are displayed
    expect(screen.getByText("42")).toBeInTheDocument();
    expect(screen.getByText("15")).toBeInTheDocument();
    expect(screen.getByText("8")).toBeInTheDocument();
    expect(screen.getByText("20")).toBeInTheDocument();

    // Verify all badges have variant-gray class and stageBadge class
    const grayBadges = container.querySelectorAll('[class*="variant-gray"]');
    expect(grayBadges).toHaveLength(4);

    grayBadges.forEach((badge) => {
      expect(badge.className).toMatch(/stageBadge/);
    });
  });

  it("renders count of 0 correctly inside Badge label", () => {
    const statsWithZero: MasteryStats = {
      ...mockStats,
      learning: 0,
    };
    render(
      <SpacedRepetitionDistributionTab masteryStats={statsWithZero} scopeLabel="JavaScript" />
    );

    const zeroEl = screen.getByText("0");
    expect(zeroEl).toBeInTheDocument();
    expect(zeroEl.className).toMatch(/label/);
  });

  it("does not render onboarding hint even when totalReviewed is 0", () => {
    const zeroStats: MasteryStats = {
      ...mockStats,
      totalReviewed: 0,
    };
    render(
      <SpacedRepetitionDistributionTab masteryStats={zeroStats} scopeLabel="JavaScript" />
    );

    expect(screen.queryByText("Как включить задачи в график:")).not.toBeInTheDocument();
  });
});
