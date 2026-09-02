import React from "react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, act } from "@testing-library/react";
import { TaskMetaBadges } from "./TaskMetaBadges";
import type { Task } from "../../types";

describe("TaskMetaBadges", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("renders nothing if task section is not javascript or algorithms", () => {
    const reactTask: Task = {
      id: "react-1",
      title: "React Task",
      section: "react",
      difficulty: "warm-up",
    };

    const { container } = render(<TaskMetaBadges task={reactTask} />);
    expect(container.firstChild).toBeNull();
  });

  it("renders badges for javascript syntax tasks without probability badge", () => {
    const jsTask: Task = {
      id: "js_while_1",
      title: "1. Напиши базовый синтаксис цикла while",
      group: "Циклы",
      subgroup: "while",
      section: "javascript",
    };

    render(<TaskMetaBadges task={jsTask} />);
    expect(screen.getByText("Синтаксис")).toBeInTheDocument();
    expect(screen.queryByText(/Вероятность/)).not.toBeInTheDocument();
  });

  it("renders multiple badges including interview probability for complex JS tasks", () => {
    const jsTask: Task = {
      id: "js70",
      title: "1. Практическая задача - debounce",
      group: "Асинхронность",
      subgroup: "Контроль частоты",
      section: "javascript",
    };

    render(<TaskMetaBadges task={jsTask} />);
    expect(screen.getByText("Вероятность: 99%")).toBeInTheDocument();
    expect(screen.getByText("Утилита")).toBeInTheDocument();
    expect(screen.getByText("Асинхронность")).toBeInTheDocument();
  });

  it("renders badges and probability indicator for algorithms tasks", () => {
    const algoTask: Task = {
      id: "algo4",
      title: "1. Two Sum",
      group: "Hash Map",
      section: "algorithms",
    };

    render(<TaskMetaBadges task={algoTask} />);
    expect(screen.getByText("Вероятность: 98%")).toBeInTheDocument();
    expect(screen.getByText("Алгоритм")).toBeInTheDocument();
    expect(screen.getByText("Hash Map")).toBeInTheDocument();
  });

  it("shows custom tooltip with interview probability on hover for algorithms tasks", () => {
    const algoTask: Task = {
      id: "algo18",
      title: "1. Valid Parentheses",
      group: "Stack",
      section: "algorithms",
    };

    render(<TaskMetaBadges task={algoTask} />);

    const badge = screen.getByText("Вероятность: 98%").closest("span");
    expect(badge).not.toBeNull();

    if (badge) {
      fireEvent.mouseEnter(badge);
      act(() => {
        vi.advanceTimersByTime(300);
      });

      const tooltip = screen.getByRole("tooltip");
      expect(tooltip).toBeInTheDocument();
      expect(tooltip).toHaveTextContent("Вероятность на Middle/Senior: 98% (Критически высокая — стандарт live coding)");
    }
  });
});
