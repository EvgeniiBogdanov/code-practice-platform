import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { SpacedRepetitionActivityChart } from "./SpacedRepetitionActivityChart";

interface MockTimeRangeProps {
  data: Array<{ day: string; value: number }>;
  from: string;
  to: string;
  height: number;
  weekdayTicks: number[];
  margin: { top: number; right: number; bottom: number; left: number };
  tooltip: (props: { day: string; value: number }) => React.JSX.Element;
}

vi.mock("@/shared/lib/hooks", () => ({
  useParentSize: () => [{ current: null }, { width: 700, height: 112 }],
}));

vi.mock("@nivo/calendar", () => ({
  TimeRange: ({ data, from, to, height, weekdayTicks, margin, tooltip }: MockTimeRangeProps) => (
    <div
      data-testid="nivo-time-range"
      data-from={from}
      data-to={to}
      data-count={data.length}
      data-height={height}
      data-weekday-ticks={weekdayTicks.join(",")}
      data-horizontal-margin={`${margin.left},${margin.right}`}
    >
      {tooltip({ day: "2026-09-07", value: 2 })}
    </div>
  ),
}));

describe("SpacedRepetitionActivityChart", () => {
  it("renders Nivo time range with activity from the last year", () => {
    render(
      <SpacedRepetitionActivityChart
        endDate={new Date(2026, 8, 7)}
        activityByDate={{
          "2025-09-07": 1,
          "2025-09-08": 2,
          "2026-09-07": 3,
          "2026-09-08": 4,
        }}
      />
    );

    const chart = screen.getByTestId("nivo-time-range");
    expect(chart).toHaveAttribute("data-from", "2025-09-08");
    expect(chart).toHaveAttribute("data-to", "2026-09-07");
    expect(chart).toHaveAttribute("data-count", "2");
    expect(chart).toHaveAttribute("data-height", "112");
    expect(chart).toHaveAttribute("data-weekday-ticks", "0,1,2,3,4,5,6");
    expect(chart).toHaveAttribute("data-horizontal-margin", "8,8");
    expect(screen.getByText("Активность решений")).toBeInTheDocument();
    expect(screen.getByText("Решено: 2")).toBeInTheDocument();
    expect(
      screen.queryByText("Количество завершённых повторений по дням за последний год")
    ).not.toBeInTheDocument();
  });
});
