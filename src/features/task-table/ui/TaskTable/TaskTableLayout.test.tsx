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
});
