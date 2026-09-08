import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { SpacedRepetitionScheduleTab } from "./SpacedRepetitionScheduleTab";

vi.mock("../RetentionScheduleBar", () => ({
  RetentionScheduleBar: ({ height }: { height: number }) => (
    <div data-testid="retention-chart" data-height={height} />
  ),
}));

vi.mock("../SpacedRepetitionActivityChart", () => ({
  SpacedRepetitionActivityChart: () => (
    <section aria-label="Активность решений" data-testid="activity-chart" />
  ),
}));

describe("SpacedRepetitionScheduleTab", () => {
  it("renders charts in separate containers without a repeated description", () => {
    render(<SpacedRepetitionScheduleTab reviews={{}} targetTasks={[]} activityByDate={{}} />);

    const retentionContainer = screen.getByRole("region", {
      name: "Ближайшие повторения",
    });
    const activityChart = screen.getByTestId("activity-chart");
    const divider = screen.getByRole("separator");

    expect(retentionContainer).toContainElement(screen.getByTestId("retention-chart"));
    expect(retentionContainer).not.toContainElement(activityChart);
    const retentionChart = screen.getByTestId("retention-chart");

    expect(retentionChart).toHaveAttribute("data-height", "220");
    expect(screen.getAllByTestId(/(?:activity|retention)-chart/)).toEqual([
      activityChart,
      retentionChart,
    ]);
    expect(divider.previousElementSibling).toBe(activityChart);
    expect(divider.nextElementSibling).toBe(retentionContainer);
    expect(screen.queryByText(/Прогноз нагрузки/)).not.toBeInTheDocument();
  });
});
