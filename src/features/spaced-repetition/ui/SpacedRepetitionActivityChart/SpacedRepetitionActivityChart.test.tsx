import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { SpacedRepetitionActivityChart } from "./SpacedRepetitionActivityChart";
import styles from "./SpacedRepetitionActivityChart.module.css";

interface MockTimeRangeProps {
  data: Array<{ day: string; value: number }>;
  from: string;
  to: string;
  height: number;
  weekdayTicks: number[];
  margin: { top: number; right: number; bottom: number; left: number };
  tooltip: (props: { day: string; value: number }) => React.JSX.Element;
}

let mockDimensions = { width: 700, height: 112 };

vi.mock("@/shared/lib/hooks", () => ({
  useParentSize: () => [{ current: null }, mockDimensions],
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
    expect(chart).toHaveAttribute("data-height", "119");
    expect(chart).toHaveAttribute("data-weekday-ticks", "0,1,2,3,4,5,6");
    expect(chart).toHaveAttribute("data-horizontal-margin", "16,16");
    expect(screen.getByText("Активность решений")).toBeInTheDocument();
    expect(screen.getByText("Решено: 2")).toBeInTheDocument();
    expect(
      screen.queryByText("Количество завершённых повторений по дням за последний год")
    ).not.toBeInTheDocument();
  });

  it("scales height proportionally when container width is wider to preserve square proportions", () => {
    mockDimensions = { width: 984, height: 112 };

    render(
      <SpacedRepetitionActivityChart
        endDate={new Date(2026, 8, 7)}
        activityByDate={{ "2026-09-07": 1 }}
      />
    );

    const chart = screen.getByTestId("nivo-time-range");
    const height = Number(chart.getAttribute("data-height"));
    // Height should scale up from 112 to 157 to ensure square cells fill width without distortion
    expect(height).toBeGreaterThan(112);
  });

  it("compensates right margin when 53 weeks are rendered to prevent clipping", () => {
    mockDimensions = { width: 984, height: 112 };

    render(
      <SpacedRepetitionActivityChart
        endDate={new Date(2026, 8, 13)}
        activityByDate={{ "2026-09-13": 1 }}
      />
    );

    const chart = screen.getByTestId("nivo-time-range");
    // When start date is Sunday, Nivo plans for 52 columns but renders 53.
    // Margin right should expand from 16 to 32 to absorb column 53 within container bounds.
    expect(chart).toHaveAttribute("data-horizontal-margin", "16,32");
  });

  it("renders skeleton placeholder with matching computed height when isLoading is true", () => {
    mockDimensions = { width: 984, height: 112 };

    const { rerender } = render(
      <SpacedRepetitionActivityChart
        endDate={new Date(2026, 8, 7)}
        activityByDate={{ "2026-09-07": 1 }}
        isLoading={true}
      />
    );

    const statusContainer = screen.getByRole("status", {
      name: "Загрузка активности решений",
    });
    expect(statusContainer).toBeInTheDocument();
    expect(screen.queryByTestId("nivo-time-range")).not.toBeInTheDocument();

    const skeletonPlaceholder = statusContainer.querySelector(`.${styles.chartPlaceholder}`);
    expect(skeletonPlaceholder).toHaveStyle({ height: "157px" });

    // Transition from loading to loaded
    rerender(
      <SpacedRepetitionActivityChart
        endDate={new Date(2026, 8, 7)}
        activityByDate={{ "2026-09-07": 1 }}
        isLoading={false}
      />
    );

    const chart = screen.getByTestId("nivo-time-range");
    expect(chart).toHaveAttribute("data-height", "157");
  });
});
