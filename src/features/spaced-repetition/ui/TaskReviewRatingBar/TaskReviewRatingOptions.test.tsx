import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { TaskReviewRatingOptions } from "./TaskReviewRatingOptions";
import { ReviewItem } from "@/entities/review";

describe("TaskReviewRatingOptions", () => {
  it("renders nothing when canRate is false", () => {
    const onRate = vi.fn();
    const { container } = render(
      <TaskReviewRatingOptions taskReview={null} canRate={false} onRate={onRate} />
    );

    expect(container.firstChild).toBeNull();
    expect(screen.queryByRole("button", { name: /легко/i })).not.toBeInTheDocument();
  });

  it("renders difficulty options when canRate is true", () => {
    const onRate = vi.fn();
    render(<TaskReviewRatingOptions taskReview={null} canRate={true} onRate={onRate} />);

    expect(screen.getByRole("button", { name: /легко/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /средне/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /сложно/i })).toBeInTheDocument();
  });

  it("calls onRate with corresponding rating when buttons are clicked", () => {
    const onRate = vi.fn();
    render(<TaskReviewRatingOptions taskReview={null} canRate={true} onRate={onRate} />);

    fireEvent.click(screen.getByRole("button", { name: /легко/i }));
    expect(onRate).toHaveBeenCalledWith("easy");

    fireEvent.click(screen.getByRole("button", { name: /средне/i }));
    expect(onRate).toHaveBeenCalledWith("medium");

    fireEvent.click(screen.getByRole("button", { name: /сложно/i }));
    expect(onRate).toHaveBeenCalledWith("hard");
  });

  it("indicates active rating when taskReview has a rating and canRate is true", () => {
    const mockReview: ReviewItem = {
      taskId: "1",
      stage: 2,
      intervalDays: 3,
      lastReviewedAt: Date.now(),
      lastReviewedDate: "2026-08-24",
      dueDate: "2026-08-27",
      nextReviewAt: Date.now() + 86400000 * 3,
      rating: "medium",
      history: [],
    };

    render(<TaskReviewRatingOptions taskReview={mockReview} canRate={true} onRate={vi.fn()} />);

    expect(screen.getByLabelText("Текущая оценка")).toBeInTheDocument();
  });
});
