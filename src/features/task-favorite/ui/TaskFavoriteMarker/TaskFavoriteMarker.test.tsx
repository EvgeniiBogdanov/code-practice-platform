import React from "react";
import { act, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import { useFavoriteTaskStore } from "@/entities/favorite-task";
import { TaskFavoriteMarker } from "./TaskFavoriteMarker";

describe("TaskFavoriteMarker", () => {
  beforeEach(() => {
    useFavoriteTaskStore.setState({ favoriteTaskIds: [] });
  });

  it("renders only for a favorite task", () => {
    render(<TaskFavoriteMarker taskId="task-1" taskTitle="Тестовая задача" />);

    expect(screen.queryByRole("img")).not.toBeInTheDocument();

    act(() => useFavoriteTaskStore.setState({ favoriteTaskIds: ["task-1"] }));

    expect(
      screen.getByRole("img", { name: "Задача «Тестовая задача» в избранном" })
    ).toBeInTheDocument();
  });
});
