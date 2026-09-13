import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import type { Task } from "@/entities/task";
import type { ReviewItem } from "@/entities/review";
import { useProgressStore } from "@/entities/progress";
import { UpcomingTaskItem } from "../../lib/upcoming-helpers";
import { SpacedRepetitionUpcomingTab } from "./SpacedRepetitionUpcomingTab";
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

describe("SpacedRepetitionUpcomingTab", () => {
  beforeEach(() => {
    useProgressStore.setState({
      completedTasks: {},
      taskStatusTimestamps: {},
    });
  });

  const mockTaskNormal: Task = {
    id: "task-normal",
    title: "Normal Task Title",
    section: "javascript",
    difficulty: "medium",
  };

  const mockReviewNormal: ReviewItem = {
    taskId: "task-normal",
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

  const mockUpcomingNormal: UpcomingTaskItem = {
    task: mockTaskNormal,
    review: mockReviewNormal,
    stage: 2,
    intervalDays: 3,
    daysUntil: 2,
    relativeTime: "Послезавтра",
    formattedDate: "4 сент. 2026",
    isDue: false,
    nextReviewAt: 2000,
    dueDate: "2026-09-04",
  };

  const mockTaskUnsolved: Task = {
    id: "task-unsolved",
    title: "Unsolved Task Title",
    section: "javascript",
    difficulty: "hard",
  };

  const mockReviewUnsolved: ReviewItem = {
    taskId: "task-unsolved",
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

  const mockUpcomingUnsolved: UpcomingTaskItem = {
    task: mockTaskUnsolved,
    review: mockReviewUnsolved,
    stage: 1,
    intervalDays: 1,
    daysUntil: 1,
    relativeTime: "Завтра",
    formattedDate: "4 сент. 2026",
    isDue: false,
    nextReviewAt: 5000,
    dueDate: "2026-09-04",
  };

  it("renders empty state when there are no upcoming tasks", () => {
    render(<SpacedRepetitionUpcomingTab upcomingTasks={[]} scopeLabel="JavaScript" />);

    expect(screen.getByText("Нет запланированных повторений JavaScript")).toBeInTheDocument();
  });

  it("renders normal upcoming task with stage badge and ratingMedium color", () => {
    render(
      <SpacedRepetitionUpcomingTab upcomingTasks={[mockUpcomingNormal]} scopeLabel="JavaScript" />
    );

    const titleEl = screen.getByText("Normal Task Title");
    expect(titleEl).toHaveClass(styles.upcomingRowTitle);
    expect(titleEl).toHaveClass(styles.ratingMedium);
    expect(titleEl).not.toHaveClass(styles.ratingUnsolved);

    expect(screen.getByText("Этап 2")).toBeInTheDocument();
    expect(screen.getByText("Послезавтра")).toBeInTheDocument();
  });

  it("renders unsolved task with ratingUnsolved (red) class and red 'Не решено' badge", () => {
    render(
      <SpacedRepetitionUpcomingTab upcomingTasks={[mockUpcomingUnsolved]} scopeLabel="JavaScript" />
    );

    const titleEl = screen.getByText("Unsolved Task Title");
    expect(titleEl).toHaveClass(styles.upcomingRowTitle);
    expect(titleEl).toHaveClass(styles.ratingUnsolved);
    expect(titleEl).not.toHaveClass(styles.ratingHard);

    const unsolvedBadge = screen.getByText("Не решено");
    expect(unsolvedBadge).toBeInTheDocument();
    expect(unsolvedBadge.className).toMatch(/variant_red/);
  });

  it("recognizes unsolved status from completedTasks store even if review.isUnsolved was false", () => {
    useProgressStore.setState({
      completedTasks: {
        "task-normal": "unsolved",
      },
    });

    render(
      <SpacedRepetitionUpcomingTab upcomingTasks={[mockUpcomingNormal]} scopeLabel="JavaScript" />
    );

    const titleEl = screen.getByText("Normal Task Title");
    expect(titleEl).toHaveClass(styles.ratingUnsolved);
    expect(screen.getByText("Не решено")).toBeInTheDocument();
  });
});
