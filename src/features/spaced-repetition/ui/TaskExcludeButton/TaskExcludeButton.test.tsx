import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useReviewStore } from "@/entities/review";
import { Tooltip } from "@/shared/ui";
import { TaskExcludeButton } from "./TaskExcludeButton";

vi.mock("@/shared/lib/storage", () => ({
  getAllReviewsFromDB: vi.fn().mockResolvedValue({}),
  getReviewsFromLocalStorage: vi.fn().mockReturnValue({}),
  saveReviewToDB: vi.fn().mockResolvedValue(undefined),
  deleteReviewFromDB: vi.fn().mockResolvedValue(undefined),
  deleteReviewsForTasksFromDB: vi.fn().mockResolvedValue(undefined),
  clearAllReviewsFromDB: vi.fn().mockResolvedValue(undefined),
  getExcludedTasksFromDB: vi.fn().mockResolvedValue([]),
  saveExcludedTasksToDB: vi.fn().mockResolvedValue(undefined),
  getExcludedTasksFromLocalStorage: vi.fn().mockReturnValue([]),
  getAssistantNameFromDB: vi.fn().mockResolvedValue("Интервальный помощник"),
  saveAssistantNameToDB: vi.fn().mockResolvedValue(undefined),
  clearAssistantNameFromDB: vi.fn().mockResolvedValue(undefined),
  getAssistantNameFromLocalStorage: vi.fn().mockReturnValue("Интервальный помощник"),
  DEFAULT_ASSISTANT_NAME: "Интервальный помощник",
  broadcastSyncEvent: vi.fn(),
  subscribeToSyncEvents: vi.fn(),
}));

describe("TaskExcludeButton", () => {
  beforeEach(() => {
    useReviewStore.setState({
      excludedTaskIds: [],
      reviews: {},
      isInitialized: true,
    });
  });

  it("toggles task exclusion state accessibly", () => {
    render(
      <Tooltip.Provider>
        <TaskExcludeButton taskId="task-1" taskTitle="Тестовая задача" />
      </Tooltip.Provider>
    );

    const button = screen.getByRole("button", {
      name: "Исключить из интервального повторения",
    });
    expect(button).toHaveAttribute("aria-pressed", "false");

    fireEvent.click(button);

    expect(useReviewStore.getState().excludedTaskIds).toEqual(["task-1"]);

    const returnButton = screen.getByRole("button", {
      name: "Вернуть в интервальное повторение",
    });
    expect(returnButton).toHaveAttribute("aria-pressed", "true");
  });

  it("does not trigger parent container click", () => {
    const handleParentClick = vi.fn();

    render(
      <Tooltip.Provider>
        <div onClick={handleParentClick}>
          <TaskExcludeButton taskId="task-1" taskTitle="Тестовая задача" />
        </div>
      </Tooltip.Provider>
    );

    const button = screen.getByRole("button");
    fireEvent.click(button);

    expect(handleParentClick).not.toHaveBeenCalled();
    expect(useReviewStore.getState().excludedTaskIds).toEqual(["task-1"]);
  });
});
