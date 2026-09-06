import { beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { useProgressStore } from "@/entities/progress";
import { useReviewStore } from "@/entities/review";
import { useUIStore } from "@/entities/ui-state";
import { TaskReviewRatingBar } from "./TaskReviewRatingBar";

describe("TaskReviewRatingBar", () => {
  const submitReview = vi.fn(async (): Promise<void> => {});

  beforeEach(() => {
    submitReview.mockClear();
    useUIStore.setState({ hideInteractiveAssistant: false });
    useReviewStore.setState({
      reviews: {},
      excludedTaskIds: [],
      isInitialized: true,
      submitReview,
    });
    useProgressStore.setState({
      completedTasks: { "1": "solved" },
      taskStatusTimestamps: {},
    });
  });

  it("keeps solution rating available when the interactive assistant is hidden", () => {
    useUIStore.setState({ hideInteractiveAssistant: true });

    render(<TaskReviewRatingBar taskId="1" />);

    expect(screen.queryByText("Интервальный помощник")).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Легко/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Средне/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Сложно/i })).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /Средне/i }));
    expect(submitReview).toHaveBeenCalledWith("1", "medium");
  });
});
