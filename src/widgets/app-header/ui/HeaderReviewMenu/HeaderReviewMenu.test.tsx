import React from "react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { HeaderReviewMenu } from "./HeaderReviewMenu";
import { useReviewStore, ReviewItem } from "@/entities/review";
import { useAllTaskSections } from "@/entities/task/catalog";
import { Task } from "@/entities/task/meta";

vi.mock("@tanstack/react-router", () => ({
  Link: ({ children, to }: { children: React.ReactNode; to: string }) => <a href={to}>{children}</a>,
  useLocation: () => ({ pathname: "/react" }),
}));

vi.mock("@/entities/task/catalog", () => ({
  useAllTaskSections: vi.fn(),
}));

describe("HeaderReviewMenu - Task Exclusion", () => {
  const mockTasks: Task[] = [
    {
      id: "task-1",
      title: "Task 1",
      section: "react",
      difficulty: "easy",
    } as unknown as Task,
    {
      id: "task-2",
      title: "Task 2",
      section: "react",
      difficulty: "medium",
    } as unknown as Task,
  ];

  const mockReviews: Record<string, ReviewItem> = {
    "task-1": {
      taskId: "task-1",
      stage: 1,
      intervalDays: 1,
      lastReviewedAt: Date.now() - 86400000 * 2,
      lastReviewedDate: "2026-09-01",
      dueDate: "2026-09-02",
      nextReviewAt: Date.now() - 86400000,
      rating: "medium",
      history: [],
    },
    "task-2": {
      taskId: "task-2",
      stage: 1,
      intervalDays: 1,
      lastReviewedAt: Date.now() - 86400000 * 2,
      lastReviewedDate: "2026-09-01",
      dueDate: "2026-09-02",
      nextReviewAt: Date.now() - 86400000,
      rating: "easy",
      history: [],
    },
  };

  beforeEach(() => {
    vi.mocked(useAllTaskSections).mockReturnValue({
      tasks: mockTasks,
      isLoading: false,
    });

    useReviewStore.setState({
      reviews: mockReviews,
      excludedTaskIds: [],
      isInitialized: true,
    });
  });

  it("displays due tasks count and items when no tasks are excluded", () => {
    render(<HeaderReviewMenu />);

    const button = screen.getByRole("button", { name: /Интервальное повторение/i });
    expect(button).toBeInTheDocument();
    expect(screen.getByText("2")).toBeInTheDocument();

    fireEvent.click(button);

    expect(screen.getByText(/2 к повторению/i)).toBeInTheDocument();
    expect(screen.getByText("Task 1")).toBeInTheDocument();
    expect(screen.getByText("Task 2")).toBeInTheDocument();
  });

  it("excludes task from count and dropdown when excluded in store", () => {
    useReviewStore.setState({ excludedTaskIds: ["task-1"] });

    render(<HeaderReviewMenu />);

    expect(screen.getByText("1")).toBeInTheDocument();

    const button = screen.getByRole("button", { name: /Интервальное повторение/i });
    fireEvent.click(button);

    expect(screen.getByText(/1 к повторению/i)).toBeInTheDocument();
    expect(screen.queryByText("Task 1")).not.toBeInTheDocument();
    expect(screen.getByText("Task 2")).toBeInTheDocument();
  });

  it("shows 'no reviewed tasks' empty state when all reviewed tasks are excluded", () => {
    useReviewStore.setState({ excludedTaskIds: ["task-1", "task-2"] });

    render(<HeaderReviewMenu />);

    const button = screen.getByRole("button", { name: /Интервальное повторение/i });
    fireEvent.click(button);

    expect(screen.getByText("0 решено")).toBeInTheDocument();
    expect(screen.getByText("Ещё нет решённых задач")).toBeInTheDocument();
    expect(screen.queryByText("Task 1")).not.toBeInTheDocument();
    expect(screen.queryByText("Task 2")).not.toBeInTheDocument();
  });

  it("shows 'all tasks reviewed' empty state when active reviewed task exists but due tasks are excluded", () => {
    useReviewStore.setState({
      reviews: {
        ...mockReviews,
        "task-3": {
          taskId: "task-3",
          stage: 2,
          intervalDays: 7,
          lastReviewedAt: Date.now(),
          lastReviewedDate: "2026-09-03",
          dueDate: "2026-09-10",
          nextReviewAt: Date.now() + 86400000 * 7,
          rating: "easy",
          history: [],
        },
      },
      excludedTaskIds: ["task-1", "task-2"],
    });

    render(<HeaderReviewMenu />);

    const button = screen.getByRole("button", { name: /Интервальное повторение/i });
    fireEvent.click(button);

    expect(screen.getByText("Задач нет")).toBeInTheDocument();
    expect(screen.getByText("Все задачи повторены!")).toBeInTheDocument();
    expect(screen.queryByText("Task 1")).not.toBeInTheDocument();
    expect(screen.queryByText("Task 2")).not.toBeInTheDocument();
  });
});
