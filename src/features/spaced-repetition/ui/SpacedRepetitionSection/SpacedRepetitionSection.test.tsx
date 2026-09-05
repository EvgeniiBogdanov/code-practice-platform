import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import type { Task } from "@/entities/task";
import { SpacedRepetitionSection } from "./SpacedRepetitionSection";
import styles from "./SpacedRepetitionSection.module.css";

const mockTasks: Task[] = [
  {
    id: 1,
    title: "Task One",
    section: "javascript",
    difficulty: "easy",
    category: "basics",
    desc: "First task",
  },
  {
    id: 2,
    title: "Task Two",
    section: "javascript",
    difficulty: "medium",
    category: "basics",
    desc: "Second task",
  },
];

const mockUpcomingTasks = [
  {
    task: mockTasks[0],
    review: {
      taskId: "1",
      stage: 2,
      intervalDays: 3,
      rating: "easy",
      nextReviewDate: "2026-09-08T00:00:00Z",
    },
    stage: 2,
    intervalDays: 3,
    daysUntil: 3,
    relativeTime: "через 3 дн.",
    formattedDate: "8 сент. 2026",
  },
];

vi.mock("../../model/useSpacedRepetitionData", () => ({
  useSpacedRepetitionData: () => ({
    reviews: {
      "1": { taskId: "1", stage: 2, intervalDays: 3, rating: "easy" },
    },
    targetTasks: mockTasks,
    masteryStats: {
      dueToday: 1,
      learning: 1,
      reviewing: 1,
      mastered: 0,
      totalReviewed: 2,
      unreviewed: 0,
      totalCount: 2,
    },
    dueTasks: [mockTasks[0]],
    upcomingTasks: mockUpcomingTasks,
    unsolvedTasks: [mockTasks[1]],
    masteryPercent: 50,
    avgInterval: 3,
    scopeLabel: "JavaScript",
  }),
}));

interface MockLinkProps {
  children: React.ReactNode;
  to: string;
  onClick?: () => void;
  className?: string;
}

// Mock TanStack Router Link
vi.mock("@tanstack/react-router", () => ({
  Link: ({ children, to, onClick, className }: MockLinkProps) => (
    <a href={to} onClick={onClick} className={className} data-testid="router-link">
      {children}
    </a>
  ),
}));

describe("SpacedRepetitionSection", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders page header outside mainScrollable container", () => {
    const { container } = render(<SpacedRepetitionSection inModal={true} />);

    const header = container.querySelector(`.${styles.pageHeader}`);
    const scrollable = container.querySelector(`.${styles.mainScrollable}`);

    expect(header).toBeInTheDocument();
    expect(scrollable).toBeInTheDocument();
    // Header must NOT be a child of scrollable
    expect(scrollable?.contains(header)).toBe(false);
  });

  it("renders non-scrolling header and task list for 'due' (Повтор) tab", () => {
    const { container } = render(<SpacedRepetitionSection inModal={true} />);

    const dueTabBtn = screen.getByRole("tab", { name: /повтор/i });
    fireEvent.click(dueTabBtn);

    const header = container.querySelector(`.${styles.pageHeader}`);
    const scrollable = container.querySelector(`.${styles.mainScrollable}`);

    expect(header).toHaveTextContent("Повтор");
    expect(header).toHaveTextContent(
      "Задачи с наступившим сроком повторения для закрепления в долговременной памяти"
    );

    // Header is outside the scroll container
    expect(scrollable?.contains(header)).toBe(false);

    // Task list is inside the scrollable container
    expect(scrollable).toHaveTextContent("Task One");
  });

  it("renders non-scrolling header and task list for 'upcoming' (В очереди) tab", () => {
    const { container } = render(<SpacedRepetitionSection inModal={true} />);

    const upcomingTabBtn = screen.getByRole("tab", { name: /в очереди/i });
    fireEvent.click(upcomingTabBtn);

    const header = container.querySelector(`.${styles.pageHeader}`);
    const scrollable = container.querySelector(`.${styles.mainScrollable}`);

    expect(header).toHaveTextContent("В очереди на повторение");
    expect(header).toHaveTextContent(
      "Предстоящие запланированные интервалы повторений"
    );

    // Header is outside the scroll container
    expect(scrollable?.contains(header)).toBe(false);

    // Task list is inside the scrollable container
    expect(scrollable).toHaveTextContent("Task One");
  });

  it("renders non-scrolling header and task list for 'unsolved' (Нерешенные) tab", () => {
    const { container } = render(<SpacedRepetitionSection inModal={true} />);

    const unsolvedTabBtn = screen.getByRole("tab", { name: /нерешенные/i });
    fireEvent.click(unsolvedTabBtn);

    const header = container.querySelector(`.${styles.pageHeader}`);
    const scrollable = container.querySelector(`.${styles.mainScrollable}`);

    expect(header).toHaveTextContent("Нерешенные задачи");
    expect(header).toHaveTextContent(
      "Задачи, требующие повторного разбора и решения"
    );

    // Header is outside the scroll container
    expect(scrollable?.contains(header)).toBe(false);

    // Task list is inside the scrollable container
    expect(scrollable).toHaveTextContent("Task Two");
  });

  it("renders close button and triggers onCloseModal when clicked", () => {
    const handleClose = vi.fn();
    render(<SpacedRepetitionSection inModal={true} onCloseModal={handleClose} />);

    const closeBtn = screen.getByRole("button", { name: "Закрыть статистику повторений" });
    expect(closeBtn).toBeInTheDocument();

    fireEvent.click(closeBtn);
    expect(handleClose).toHaveBeenCalledTimes(1);
  });
});
