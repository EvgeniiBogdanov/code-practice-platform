import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { SpacedRepetitionKpiGrid } from "./SpacedRepetitionKpiGrid";

describe("SpacedRepetitionKpiGrid", () => {
  it("renders today's solved and unsolved task counters", () => {
    render(
      <SpacedRepetitionKpiGrid
        totalReviewed={12}
        totalCount={20}
        dueToday={3}
        mastered={5}
        masteryPercent={42}
        avgInterval={7}
        solvedToday={4}
        unsolvedToday={2}
      />
    );

    expect(screen.getByText("Сегодня решено")).toBeInTheDocument();
    expect(screen.getByText("Сегодня не решено")).toBeInTheDocument();
    expect(screen.getByText("4")).toBeInTheDocument();
    expect(screen.getByText("2")).toBeInTheDocument();
  });
});
