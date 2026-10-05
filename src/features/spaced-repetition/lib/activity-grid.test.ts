import { describe, expect, it } from "vitest";
import { ACTIVITY_WEEKS, buildActivityGrid, getActivityRange } from "./activity-grid";

const SUNDAY_END = new Date(2026, 8, 13).getTime();
const MONDAY_END = new Date(2026, 8, 7).getTime();

describe("getActivityRange", () => {
  it("returns a 365-day window ending on the given date", () => {
    expect(getActivityRange(MONDAY_END)).toEqual({ from: "2025-09-08", to: "2026-09-07" });
  });
});

describe("buildActivityGrid", () => {
  it.each([MONDAY_END, SUNDAY_END])("always produces 53 full weeks of 7 slots", (end) => {
    const { weeks } = buildActivityGrid({}, end);
    expect(weeks).toHaveLength(ACTIVITY_WEEKS);
    expect(weeks.every((week) => week.days.length === 7)).toBe(true);
  });

  it("aligns the first day to its Monday-based weekday and pads with nulls", () => {
    const { weeks } = buildActivityGrid({}, SUNDAY_END);
    // from = 2025-09-14 is a Sunday → six leading empty slots
    expect(weeks[0].days.slice(0, 6).every((day) => day === null)).toBe(true);
    expect(weeks[0].days[6]?.date).toBe("2025-09-14");
  });

  it("counts activity only inside the window and assigns levels", () => {
    const { weeks, total } = buildActivityGrid(
      { "2025-09-07": 9, "2025-09-08": 1, "2026-09-07": 7, "2026-09-08": 3 },
      MONDAY_END
    );
    const cells = weeks.flatMap((week) => week.days).filter((day) => day !== null);
    expect(cells).toHaveLength(365);
    expect(total).toBe(8);
    expect(cells.find((cell) => cell.date === "2025-09-08")?.level).toBe(1);
    expect(cells.find((cell) => cell.date === "2026-09-07")?.level).toBe(4);
  });

  it("labels month starts without labelling the clipped first and last columns", () => {
    const { weeks } = buildActivityGrid({}, MONDAY_END);
    const labels = weeks.map((week) => week.monthLabel);
    expect(labels.filter(Boolean)).toHaveLength(12);
    expect(labels[0]).toBe("сент");
    expect(labels.at(-1)).toBeNull();
  });
});
