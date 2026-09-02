import React from "react";
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { TaskReviewHeader } from "./TaskReviewHeader";
import { ReviewItem, ReviewBadgeMeta, useReviewStore } from "@/entities/review";

describe("TaskReviewHeader", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-08-24T12:00:00Z"));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

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

    expect(screen.getByText(/Интервальный помощник/i)).toBeInTheDocument();
    expect(screen.getByText(/Через 7 дней/i)).toBeInTheDocument();
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

    expect(screen.getByText(/Интервальный помощник/i)).toBeInTheDocument();
    expect(screen.getByText(/Пора повторить/i)).toBeInTheDocument();
    expect(screen.getByText(/оцени/i)).toBeInTheDocument();
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
      screen.getByText(/Оцени сложность задачи, а я рассчитаю оптимальный интервал для повторения:/i)
    ).toBeInTheDocument();
  });

  it("renders unsolved state with support message and without badge when isUnsolved is true", () => {
    render(
      <TaskReviewHeader
        taskReview={null}
        canRate={false}
        isUnsolved={true}
      />
    );

    expect(screen.getByText(/Интервальный помощник/i)).toBeInTheDocument();
    expect(screen.queryByText(/Не решено/i)).not.toBeInTheDocument();
  });

  it("renders excluded message without any status badge when isExcluded is true", () => {
    render(
      <TaskReviewHeader
        taskReview={null}
        canRate={false}
        isExcluded={true}
      />
    );

    expect(screen.getByText(/Интервальный помощник/i)).toBeInTheDocument();
    expect(screen.getByText("Задача исключена из цикла повторений")).toBeInTheDocument();
    expect(screen.queryByText(/^Исключена$/i)).not.toBeInTheDocument();
  });

  it("renders custom assistant name when configured in review store", () => {
    useReviewStore.setState({ assistantName: "Кибер-Наставник" });

    render(
      <TaskReviewHeader
        taskReview={null}
        canRate={false}
      />
    );

    expect(screen.getByText("Кибер-Наставник")).toBeInTheDocument();
    expect(screen.queryByText("Интервальный помощник")).not.toBeInTheDocument();

    useReviewStore.setState({ assistantName: "Интервальный помощник" });
  });
});
