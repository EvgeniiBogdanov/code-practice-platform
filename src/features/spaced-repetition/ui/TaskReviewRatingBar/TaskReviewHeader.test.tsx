import React from "react";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { TaskReviewHeader } from "./TaskReviewHeader";
import { ReviewItem, ReviewBadgeMeta } from "@/entities/review";

describe("TaskReviewHeader", () => {
  const defaultBadgeMeta: ReviewBadgeMeta = {
    stage: 2,
    stageName: "Уровень 2",
    badgeVariant: "level",
    isDue: false,
    label: "Через 7 дней",
    isMaster: false,
  };

  it("renders scheduled review description and reset hint on a single line when !canRate", () => {
    const mockReview: ReviewItem = {
      taskId: "1",
      stage: 2,
      intervalDays: 7,
      lastReviewedAt: Date.now(),
      lastReviewedDate: "2026-08-24",
      dueDate: "2026-08-31",
      nextReviewAt: Date.now() + 86400000 * 7,
      rating: "easy",
      history: [],
    };

    render(
      <TaskReviewHeader
        taskReview={mockReview}
        badgeMeta={defaultBadgeMeta}
        canRate={false}
      />
    );

    expect(screen.getByText(/Интервальное повторение/i)).toBeInTheDocument();
    expect(screen.getByText(/Следующее повторение:/i)).toBeInTheDocument();
    expect(screen.getByText(/Через 7 дней/i)).toBeInTheDocument();
    expect(
      screen.getByText(/В день повторения решение автоматически сбросится до чистого шаблона/i)
    ).toBeInTheDocument();

    const descElement = screen.getByText(/Следующее повторение:/i).closest("span");
    expect(descElement).toHaveTextContent(
      "Следующее повторение: Через 7 дней. В день повторения решение автоматически сбросится до чистого шаблона"
    );
  });

  it("renders due review description when canRate is true and review exists", () => {
    const mockReview: ReviewItem = {
      taskId: "1",
      stage: 2,
      intervalDays: 7,
      lastReviewedAt: Date.now() - 86400000 * 8,
      lastReviewedDate: "2026-08-16",
      dueDate: "2026-08-23",
      nextReviewAt: Date.now() - 86400000,
      rating: "easy",
      history: [],
    };

    const dueBadgeMeta: ReviewBadgeMeta = {
      ...defaultBadgeMeta,
      isDue: true,
      badgeVariant: "due",
      label: "Повтор",
    };

    render(
      <TaskReviewHeader
        taskReview={mockReview}
        badgeMeta={dueBadgeMeta}
        canRate={true}
      />
    );

    expect(screen.getByText(/Пора повторить задачу!/i)).toBeInTheDocument();
  });

  it("renders initial rating description for new tasks", () => {
    const newBadgeMeta: ReviewBadgeMeta = {
      stage: 0,
      stageName: "Новая задача",
      badgeVariant: "new",
      isDue: true,
      label: "Новая",
      isMaster: false,
    };

    render(
      <TaskReviewHeader
        taskReview={null}
        badgeMeta={newBadgeMeta}
        canRate={true}
      />
    );

    expect(
      screen.getByText(/Оцените сложность решения для составления персонального графика повторений:/i)
    ).toBeInTheDocument();
  });
});
