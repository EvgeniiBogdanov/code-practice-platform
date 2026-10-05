import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { SpacedRepetitionActivityChart } from "./SpacedRepetitionActivityChart";

const END_DATE = new Date(2026, 8, 7);

describe("SpacedRepetitionActivityChart", () => {
  it("renders 365 day cells for the last year with the total in the title", () => {
    const { container } = render(
      <SpacedRepetitionActivityChart
        endDate={END_DATE}
        activityByDate={{
          "2025-09-07": 5,
          "2025-09-08": 2,
          "2026-09-07": 3,
          "2026-09-08": 4,
        }}
      />
    );

    expect(container.querySelectorAll("[data-date]")).toHaveLength(365);
    expect(container.querySelector('[data-date="2025-09-08"]')).toBeInTheDocument();
    expect(container.querySelector('[data-date="2025-09-07"]')).not.toBeInTheDocument();
    expect(screen.getByText("Активность решений")).toBeInTheDocument();
    expect(screen.getByText("5 за последний год")).toBeInTheDocument();
    expect(screen.getByRole("img")).toHaveAccessibleName("Активность решений за последний год: 5");
  });

  it("renders weekday and month labels plus a legend", () => {
    render(<SpacedRepetitionActivityChart endDate={END_DATE} activityByDate={{}} />);

    expect(screen.getByText("Пн")).toBeInTheDocument();
    expect(screen.getByText("Ср")).toBeInTheDocument();
    expect(screen.getByText("Пт")).toBeInTheDocument();
    expect(screen.getByText("Меньше")).toBeInTheDocument();
    expect(screen.getByText("Больше")).toBeInTheDocument();
  });

  it("renders a loading placeholder instead of the grid when isLoading is true", () => {
    const { container, rerender } = render(
      <SpacedRepetitionActivityChart endDate={END_DATE} activityByDate={{}} isLoading />
    );

    expect(screen.getByRole("status", { name: "Загрузка активности решений" })).toBeInTheDocument();
    expect(container.querySelector("[data-date]")).not.toBeInTheDocument();

    rerender(
      <SpacedRepetitionActivityChart endDate={END_DATE} activityByDate={{}} isLoading={false} />
    );
    expect(container.querySelectorAll("[data-date]")).toHaveLength(365);
  });
});
