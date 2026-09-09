import React from "react";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { TaskDifficultyBadge } from "./TaskDifficultyBadge";

describe("TaskDifficultyBadge", () => {
  it("renders nothing when difficulty is undefined", () => {
    const { container } = render(<TaskDifficultyBadge />);
    expect(container.firstChild).toBeNull();
  });

  it("renders Russian labels for algorithms difficulty levels", () => {
    const { rerender } = render(<TaskDifficultyBadge difficulty="easy" />);
    expect(screen.getByText("Лёгкая")).toBeInTheDocument();

    rerender(<TaskDifficultyBadge difficulty="medium" />);
    expect(screen.getByText("Средняя")).toBeInTheDocument();

    rerender(<TaskDifficultyBadge difficulty="hard" />);
    expect(screen.getByText("Сложная")).toBeInTheDocument();
  });

  it("is case-insensitive for difficulty input", () => {
    const { rerender } = render(<TaskDifficultyBadge difficulty="EASY" />);
    expect(screen.getByText("Лёгкая")).toBeInTheDocument();

    rerender(<TaskDifficultyBadge difficulty="Medium" />);
    expect(screen.getByText("Средняя")).toBeInTheDocument();

    rerender(<TaskDifficultyBadge difficulty="HARD" />);
    expect(screen.getByText("Сложная")).toBeInTheDocument();
  });

  it("renders other existing difficulty labels correctly", () => {
    const { rerender } = render(<TaskDifficultyBadge difficulty="warm-up" />);
    expect(screen.getByText("Разминка")).toBeInTheDocument();

    rerender(<TaskDifficultyBadge difficulty="refactoring" />);
    expect(screen.getByText("Рефакторинг")).toBeInTheDocument();
  });
});
