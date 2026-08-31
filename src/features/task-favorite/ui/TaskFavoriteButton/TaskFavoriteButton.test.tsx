import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useFavoriteTaskStore } from "@/entities/favorite-task";
import { Tooltip } from "@/shared/ui";
import { TaskFavoriteButton } from "./TaskFavoriteButton";

describe("TaskFavoriteButton", () => {
  beforeEach(() => {
    useFavoriteTaskStore.setState({ favoriteTaskIds: [] });
  });

  it("toggles the task and exposes its state accessibly", () => {
    render(
      <Tooltip.Provider>
        <TaskFavoriteButton taskId="task-1" taskTitle="Тестовая задача" />
      </Tooltip.Provider>
    );

    const addButton = screen.getByRole("button", {
      name: "Добавить «Тестовая задача» в избранное",
    });
    const inactiveIcon = addButton.querySelector("svg");
    expect(addButton).toHaveAttribute("aria-pressed", "false");
    expect(addButton).toHaveClass(/variant_transparent/);
    expect(inactiveIcon).toHaveAttribute("fill", "none");

    fireEvent.click(addButton);

    expect(useFavoriteTaskStore.getState().favoriteTaskIds).toEqual(["task-1"]);
    const removeButton = screen.getByRole("button", {
      name: "Удалить «Тестовая задача» из избранного",
    });
    expect(removeButton).toHaveAttribute("aria-pressed", "true");
    expect(removeButton.querySelector("svg")).toHaveAttribute("fill", "currentColor");
  });

  it("does not trigger a parent row click", () => {
    const handleRowClick = vi.fn();

    render(
      <Tooltip.Provider>
        <div onClick={handleRowClick}>
          <TaskFavoriteButton taskId="task-1" taskTitle="Тестовая задача" />
        </div>
      </Tooltip.Provider>
    );

    fireEvent.click(
      screen.getByRole("button", { name: "Добавить «Тестовая задача» в избранное" })
    );

    expect(handleRowClick).not.toHaveBeenCalled();
    expect(useFavoriteTaskStore.getState().favoriteTaskIds).toEqual(["task-1"]);
  });

  it("supports the compact icon used in task lists", () => {
    render(
      <Tooltip.Provider>
        <TaskFavoriteButton taskId="task-1" taskTitle="Тестовая задача" iconSize={13} />
      </Tooltip.Provider>
    );

    const button = screen.getByRole("button", {
      name: "Добавить «Тестовая задача» в избранное",
    });

    expect(button.querySelector("svg")).toHaveAttribute("width", "13");
    expect(button.querySelector("svg")).toHaveAttribute("height", "13");
  });
});
