import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { TaskTableCells } from "./TaskTableCells";
import { TaskTableHeader } from "./TaskTableHeader";

describe("TaskTable layout", () => {
  it("shows only an icon in the favorites column header", () => {
    const { container } = render(<TaskTableHeader />);

    expect(container.querySelector("svg")).toBeInTheDocument();
    expect(container).not.toHaveTextContent("Избранное");
  });

  it("places the favorite action after the solution, review and status cells", () => {
    render(
      <TaskTableCells
        status="unstarted"
        favoriteMarker={<button aria-label="Добавить в избранное" />}
      />
    );

    const favoriteButton = screen.getByRole("button", { name: "Добавить в избранное" });
    const favoriteCell = favoriteButton.parentElement;
    const rowMeta = favoriteCell?.parentElement;

    expect(rowMeta?.children).toHaveLength(4);
    expect(rowMeta?.lastElementChild).toBe(favoriteCell);
  });

  it("renders status and solution when not excluded", () => {
    render(
      <TaskTableCells
        status="solved"
        review={{
          taskId: "task-1",
          stage: 1,
          intervalDays: 1,
          dueDate: "2026-09-08",
          lastReviewedDate: "2026-09-07",
          history: [],
          nextReviewAt: Date.now() + 86400000,
          lastReviewedAt: Date.now() - 3600000,
          rating: "easy",
        }}
        isExcluded={false}
      />
    );

    expect(screen.getByLabelText("Решено")).toBeInTheDocument();
    expect(screen.queryByLabelText("Не решено")).not.toBeInTheDocument();
  });

  it("does not render checkmark, cross, or solution date badge when task is excluded", () => {
    render(
      <TaskTableCells
        status="solved"
        review={{
          taskId: "task-1",
          stage: 1,
          intervalDays: 1,
          dueDate: "2026-09-08",
          lastReviewedDate: "2026-09-07",
          history: [],
          nextReviewAt: Date.now() + 86400000,
          lastReviewedAt: Date.now() - 3600000,
          rating: "easy",
        }}
        isExcluded={true}
      />
    );

    expect(screen.queryByLabelText("Решено")).not.toBeInTheDocument();
    expect(screen.queryByLabelText("Не решено")).not.toBeInTheDocument();
    expect(screen.getByText("Исключена")).toBeInTheDocument();
    const excludedLabels = screen.getAllByLabelText("Исключена");
    expect(excludedLabels.length).toBeGreaterThanOrEqual(2);
  });
});
