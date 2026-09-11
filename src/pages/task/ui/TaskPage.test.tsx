import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { Tooltip } from "@/shared/ui";
import { useProgressStore } from "@/entities/progress";
import { useReviewStore } from "@/entities/review";
import { TaskPage } from "./TaskPage";

vi.mock("@tanstack/react-router", () => ({
  Link: ({
    children,
    className,
    ...rest
  }: {
    children?: React.ReactNode;
    className?: string;
    [key: string]: unknown;
  }): React.JSX.Element => (
    <a className={className} {...(rest as React.AnchorHTMLAttributes<HTMLAnchorElement>)}>
      {children}
    </a>
  ),
  useNavigate: () => vi.fn(),
}));

const mockTask = {
  id: "test-task-1",
  section: "javascript" as const,
  title: "Test Task 1",
  difficulty: "easy",
  desc: "Task description",
  candidate: "function initial() {}",
  solution: "function solution() {}",
};

vi.mock("@/entities/task/catalog", () => ({
  useTaskById: (id: string) => ({
    task: id === "test-task-1" ? mockTask : undefined,
    isLoading: false,
  }),
}));

vi.mock("./CandidateTab", () => ({
  CandidateTab: () => <div data-testid="candidate-tab" />,
}));
vi.mock("./SolutionTab", () => ({
  SolutionTab: () => <div data-testid="solution-tab" />,
}));
vi.mock("./ChecklistTab", () => ({
  ChecklistTab: () => <div data-testid="checklist-tab" />,
}));
vi.mock("./MaterialsTab", () => ({
  MaterialsTab: () => <div data-testid="materials-tab" />,
}));
vi.mock("./QuestionsTab", () => ({
  QuestionsTab: () => <div data-testid="questions-tab" />,
}));

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
  saveTaskStatusToDB: vi.fn().mockResolvedValue(undefined),
  removeTaskStatusesFromDB: vi.fn().mockResolvedValue(undefined),
  clearAllTaskStatusesFromDB: vi.fn().mockResolvedValue(undefined),
  getCompletedTasksWithTimestampsFromDB: vi.fn().mockResolvedValue({ tasks: {}, timestamps: {} }),
  getChecklistStateFromDB: vi.fn().mockResolvedValue({}),
  saveChecklistItemToDB: vi.fn().mockResolvedValue(undefined),
  requestPersistentStorage: vi.fn(),
  migrateFromLocalStorageIfNeeded: vi.fn().mockResolvedValue(undefined),
  clearAllSolutions: vi.fn().mockResolvedValue(undefined),
  deleteSolutionsForTasks: vi.fn().mockResolvedValue(undefined),
}));

describe("TaskPage - Status Buttons", () => {
  beforeEach(() => {
    useReviewStore.setState({
      excludedTaskIds: [],
      reviews: {},
      isInitialized: true,
    });
    useProgressStore.setState({
      completedTasks: {},
      taskStatusTimestamps: {},
      isInitialized: true,
    });
  });

  it("shows active solved button when task is solved and not excluded", () => {
    useProgressStore.setState({
      completedTasks: { "test-task-1": "solved" },
    });

    render(
      <Tooltip.Provider>
        <TaskPage taskId="test-task-1" section="javascript" />
      </Tooltip.Provider>
    );

    const solvedButton = screen.getByRole("button", { name: "Решено" });
    const unsolvedButton = screen.getByRole("button", { name: "Не решено" });

    expect(solvedButton).toHaveAttribute("aria-pressed", "true");
    expect(solvedButton).not.toBeDisabled();
    expect(unsolvedButton).not.toHaveAttribute("aria-pressed");
    expect(unsolvedButton).not.toBeDisabled();
  });

  it("resets active state and disables status buttons when task is excluded", () => {
    useProgressStore.setState({
      completedTasks: { "test-task-1": "solved" },
    });
    useReviewStore.setState({
      excludedTaskIds: ["test-task-1"],
    });

    render(
      <Tooltip.Provider>
        <TaskPage taskId="test-task-1" section="javascript" />
      </Tooltip.Provider>
    );

    const solvedButton = screen.getByRole("button", { name: "Решено" });
    const unsolvedButton = screen.getByRole("button", { name: "Не решено" });

    expect(solvedButton).not.toHaveAttribute("aria-pressed");
    expect(solvedButton).toBeDisabled();
    expect(unsolvedButton).not.toHaveAttribute("aria-pressed");
    expect(unsolvedButton).toBeDisabled();
  });

  it("does not toggle status when clicking disabled buttons on excluded task", () => {
    const setTaskStatusSpy = vi.spyOn(useProgressStore.getState(), "setTaskStatus");
    useReviewStore.setState({
      excludedTaskIds: ["test-task-1"],
    });

    render(
      <Tooltip.Provider>
        <TaskPage taskId="test-task-1" section="javascript" />
      </Tooltip.Provider>
    );

    const solvedButton = screen.getByRole("button", { name: "Решено" });
    fireEvent.click(solvedButton);

    expect(setTaskStatusSpy).not.toHaveBeenCalled();
    expect(useProgressStore.getState().completedTasks["test-task-1"]).toBeUndefined();
  });

  it("submits review with 'hard' and isUnsolved=true when clicking 'Не решено'", async () => {
    const submitReviewSpy = vi.spyOn(useReviewStore.getState(), "submitReview");
    const setTaskStatusSpy = vi.spyOn(useProgressStore.getState(), "setTaskStatus");

    render(
      <Tooltip.Provider>
        <TaskPage taskId="test-task-1" section="javascript" />
      </Tooltip.Provider>
    );

    const unsolvedButton = screen.getByRole("button", { name: "Не решено" });
    fireEvent.click(unsolvedButton);

    await vi.waitFor(() => {
      expect(setTaskStatusSpy).toHaveBeenCalledWith("test-task-1", "unsolved");
      expect(submitReviewSpy).toHaveBeenCalledWith("test-task-1", "hard", true);
    });
  });

  it("removes review when unchecking 'Не решено'", async () => {
    useProgressStore.setState({
      completedTasks: { "test-task-1": "unsolved" },
    });
    const removeReviewSpy = vi.spyOn(useReviewStore.getState(), "removeReview");
    const setTaskStatusSpy = vi.spyOn(useProgressStore.getState(), "setTaskStatus");

    render(
      <Tooltip.Provider>
        <TaskPage taskId="test-task-1" section="javascript" />
      </Tooltip.Provider>
    );

    const unsolvedButton = screen.getByRole("button", { name: "Не решено" });
    expect(unsolvedButton).toHaveAttribute("aria-pressed", "true");

    fireEvent.click(unsolvedButton);

    await vi.waitFor(() => {
      expect(setTaskStatusSpy).toHaveBeenCalledWith("test-task-1", null);
      expect(removeReviewSpy).toHaveBeenCalledWith("test-task-1");
    });
  });
});
