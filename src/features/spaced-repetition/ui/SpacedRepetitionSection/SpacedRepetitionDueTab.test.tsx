import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import type { Task } from "@/entities/task";
import type { ReviewItem } from "@/entities/review";
import { useProgressStore } from "@/entities/progress";
import { SpacedRepetitionDueTab } from "./SpacedRepetitionDueTab";
import styles from "./SpacedRepetitionSection.module.css";

// Mock TanStack Router Link
interface MockLinkProps {
  children: React.ReactNode;
  to: string;
  className?: string;
  onClick?: () => void;
}

vi.mock("@tanstack/react-router", () => ({
  Link: ({ children, to, className, onClick }: MockLinkProps) => (
    <a href={to} className={className} onClick={onClick} data-testid="router-link">
      {children}
    </a>
  ),
}));

describe("SpacedRepetitionDueTab", () => {
  beforeEach(() => {
    useProgressStore.setState({
      completedTasks: {},
      taskStatusTimestamps: {},
    });
  });

  const mockNormalTask: Task = {
    id: "task-due-normal",
    title: "Normal Due Task",
    section: "javascript",
    difficulty: "medium",
  };

  const mockNormalReview: ReviewItem = {
    taskId: "task-due-normal",
    stage: 2,
    intervalDays: 3,
    lastReviewedAt: 1000,
    lastReviewedDate: "2026-09-01",
    dueDate: "2026-09-04",
    nextReviewAt: 2000,
    rating: "medium",
    isUnsolved: false,
    history: [],
  };

  const mockUnsolvedTask: Task = {
    id: "task-due-unsolved",
    title: "Unsolved Due Task",
    section: "javascript",
    difficulty: "hard",
  };

  const mockUnsolvedReview: ReviewItem = {
    taskId: "task-due-unsolved",
    stage: 1,
    intervalDays: 1,
    lastReviewedAt: 3000,
    lastReviewedDate: "2026-09-03",
    dueDate: "2026-09-04",
    nextReviewAt: 5000,
    rating: "hard",
    isUnsolved: true,
    history: [],
  };

  it("renders empty state when there are no due tasks", () => {
    render(<SpacedRepetitionDueTab dueTasks={[]} reviews={{}} scopeLabel="JavaScript" />);

    expect(screen.getByText("Все задачи JavaScript повторены!")).toBeInTheDocument();
  });

  it("renders normal due task with yellow badge and stage interval info", () => {
    render(
      <SpacedRepetitionDueTab
        dueTasks={[mockNormalTask]}
        reviews={{ "task-due-normal": mockNormalReview }}
        scopeLabel="JavaScript"
      />
    );

    const titleEl = screen.getByText("Normal Due Task");
    expect(titleEl).toHaveClass(styles.upcomingRowTitle);
    expect(titleEl).toHaveClass(styles.ratingMedium);
    expect(titleEl).not.toHaveClass(styles.ratingUnsolved);

    const badge = screen.getByText("Этап 2 • 3 дн.");
    expect(badge).toBeInTheDocument();
    expect(badge.className).toMatch(/variant_yellow/);
  });

  it("renders unsolved due task with red ratingUnsolved class and red 'Не решено • 1 дн.' badge", () => {
    render(
      <SpacedRepetitionDueTab
        dueTasks={[mockUnsolvedTask]}
        reviews={{ "task-due-unsolved": mockUnsolvedReview }}
        scopeLabel="JavaScript"
      />
    );

    const titleEl = screen.getByText("Unsolved Due Task");
    expect(titleEl).toHaveClass(styles.upcomingRowTitle);
    expect(titleEl).toHaveClass(styles.ratingUnsolved);
    expect(titleEl).not.toHaveClass(styles.ratingHard);

    const badge = screen.getByText("Не решено • 1 дн.");
    expect(badge).toBeInTheDocument();
    expect(badge.className).toMatch(/variant_red/);
  });
});
